import type { Article, Story, StaticLink, Perspective, Region } from "../../src/lib/types";
import { CATEGORIES, matchKnowledgeCards, type KnowledgeCard } from "../../config/syllabus";
import { chatJson, type ChatMessage } from "./llm";

const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

export interface ClusterSpec {
  headline: string;
  kicker: string;
  category: string;
  region: Region;
  importance: number;
  countryFocus?: string;
  articleIds: number[];
}

interface BriefAndClusters {
  brief: string[];
  stories: ClusterSpec[];
}

// Keep only valid, in-range, integer article indices. Models sometimes return
// strings or hallucinated positions, which would otherwise crash the pipeline.
export function sanitizeArticleIds(ids: unknown, max: number): number[] {
  if (!Array.isArray(ids)) return [];
  return ids.map((i) => Number(i)).filter((i) => Number.isInteger(i) && i >= 0 && i < max);
}

function indexArticles(articles: Article[]): string {
  return articles
    .map(
      (a, i) =>
        `[${i}] (${a.source}${a.region === "global" ? ", global" : ""}) ${a.title}${a.snippet ? ` :: ${a.snippet.slice(0, 200)}` : ""}`,
    )
    .join("\n");
}

export async function clusterArticles(articles: Article[]): Promise<BriefAndClusters> {
  const system = `You are the editor of a daily current-affairs newspaper for Indian Civil Services (UPSC) aspirants.
You are given raw articles from many feeds published in the last 24 hours. Your job:
1. Group articles that cover the SAME underlying event/story into a single story (stitch duplicates and multi-source coverage together).
2. Produce a "brief": 3-5 short bullet strings capturing the day's most exam-relevant agenda (plain text, no markdown).
3. For each story give: a crisp headline (max 14 words, neutral, newspaper style), a "kicker" (short section label like "IR · West Asia" or "Polity · Parliament"), a category key, region ("india" or "global"), importance 1-5 (5 = must know for UPSC), an optional countryFocus (a lower-case country key for a story where a single country's own media would add a fresh perspective — e.g. "iran", "us", "china", "russia", "israel", "pakistan", "japan", "france", "uk", "australia"), and the articleIds array (use the bracket index numbers given).
Rules:
- Prefer 8 to 14 stories. Ignore pure entertainment/gossip/sports unless policy-relevant.
- Weight stories by UPSC relevance: polity, economy, IR, environment, security, science & tech, society, culture, geography, agriculture.
- Every story must reference at least one article index. Use only indices that exist.
- category must be one of: ${CATEGORY_KEYS.join(", ")}.
Return STRICT JSON: {"brief": string[], "stories": [{"headline": string, "kicker": string, "category": string, "region": "india"|"global", "importance": number, "countryFocus": string|null, "articleIds": number[]}]}`;

  const user = `Today's candidate articles (last 24h):\n\n${indexArticles(articles)}\n\nCluster them into the newspaper's stories now.`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const result = await chatJson<BriefAndClusters>(messages);
  // Guard against out-of-range indices.
  result.stories = (result.stories || [])
    .map((s) => ({ ...s, articleIds: sanitizeArticleIds(s.articleIds, articles.length) }))
    .filter((s) => s.articleIds.length > 0);
  return result;
}

interface EnrichedStory {
  headline: string;
  kicker: string;
  category: string;
  summary: string;
  whyItMatters: string;
  perspectives: { source: string; take: string }[];
  staticLinks: StaticLink[];
  prelims: string[];
  mainsQuestion: string;
  tags: string[];
  readMinutes: number;
}

function cardPrompt(cards: KnowledgeCard[]): string {
  if (!cards.length) return "No static knowledge cards matched — use your own accurate UPSC knowledge for the Static Link panel.";
  return cards
    .map(
      (c) =>
        `• ${c.title} [${c.paper} :: ${c.syllabusNode}]\n  What: ${c.whatIsIt}\n  Background: ${c.background}\n  ${c.geography ? `Geography: ${c.geography}\n  ` : ""}${c.socioEconomic ? `Socio-economic: ${c.socioEconomic}\n  ` : ""}  Key terms: ${c.keyTerms.join(", ")}\n  Prelims: ${c.prelimsPointers.join(" | ")}\n  Mains angle: ${c.mainsAngle}`,
    )
    .join("\n\n");
}

export async function enrichStory(
  spec: ClusterSpec,
  storyArticles: Article[],
  regionals: Article[] = [],
): Promise<Story> {
  const all = [...storyArticles, ...regionals];
  const corpus = all.map((a) => `${a.title}. ${a.snippet}`).join(" ");
  const cards = matchKnowledgeCards(`${spec.headline} ${spec.kicker} ${corpus}`);

  const system = `You are a UPSC mentor editing one story for a daily brief. Produce study-grade, factual, neutral content.
Return STRICT JSON with this shape:
{
  "headline": string (max 14 words),
  "kicker": string (short section label),
  "category": string,
  "summary": string (3-5 sentences: the consolidated, stitched account of what happened — synthesise across all sources, do NOT copy any source verbatim),
  "whyItMatters": string (1-2 sentences: exam relevance),
  "perspectives": array of { "source": string (must match one of the source names given), "take": string (one line: how THAT source frames it; note bias/region if useful) } — include one entry per distinct source given, using the EXACT source name,
  "staticLinks": array (1-3) of {
     "topic": string,
     "paper": string (e.g. "GS-II"),
     "syllabusNode": string,
     "whatIsIt": string,
     "background": string (history: when it came, by whom, key events),
     "geography": string|null,
     "socioEconomic": string|null,
     "whyInNews": string,
     "wayForward": string|null,
     "keyTerms": string[] (4-7 terms),
     "prelimsPointers": string[] (2-4 crisp facts),
     "mainsAngle": string
  },
  "prelims": string[] (2-4 ready-to-memorise factual pointers from the news),
  "mainsQuestion": string (one UPSC-style mains question),
  "tags": string[] (3-6 short tags),
  "readMinutes": number (estimated minutes to read + revise, 3-9)
}
Ground each staticLink in the knowledge cards supplied; do not invent facts. If no card matches, still provide accurate general UPSC context. Never fabricate names, dates or numbers.`;

  const sourcesBlock = all
    .map((a) => `- ${a.source} [${a.publishedAt.slice(0, 10)}]: ${a.title}${a.snippet ? ` — ${a.snippet}` : ""} (${a.link})`)
    .join("\n");

  const user = `Story to write up:
HEADLINE (draft): ${spec.headline}
KICKER: ${spec.kicker}
CATEGORY: ${spec.category}
REGION: ${spec.region}
${spec.countryFocus ? `COUNTRY FOCUS (regional perspective included below): ${spec.countryFocus}` : ""}

SOURCES / ARTICLES:
${sourcesBlock}

STATIC KNOWLEDGE CARDS (authoritative grounding — prefer these):
${cardPrompt(cards)}

Write the JSON now.`;

  const messages: ChatMessage[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  const e = await chatJson<EnrichedStory>(messages);

  const bySource = new Map<string, Article>();
  for (const a of all) if (!bySource.has(a.source)) bySource.set(a.source, a);

  const perspectives: Perspective[] = (e.perspectives || [])
    .map((p) => {
      const match =
        bySource.get(p.source) ||
        all.find((a) => a.source.toLowerCase() === p.source.toLowerCase());
      const regional = regionals.some((r) => r.source === p.source);
      return {
        source: p.source,
        region: match?.region === "india" ? "India" : spec.countryFocus ? spec.countryFocus : "Global",
        lean: "unknown" as const,
        take: p.take,
        link: match?.link || "#",
        isRegional: regional,
      };
    })
    .filter((p) => p.link !== "#");
  // Ensure every source is represented even if the model dropped one.
  for (const a of all) {
    if (!perspectives.some((p) => p.source === a.source)) {
      perspectives.push({
        source: a.source,
        region: a.region === "india" ? "India" : spec.countryFocus || "Global",
        lean: "unknown",
        take: "Coverage available at source.",
        link: a.link,
        isRegional: regionals.includes(a),
      });
    }
  }

  const slug = slugify(e.headline || spec.headline);
  return {
    id: slug,
    slug,
    headline: e.headline || spec.headline,
    kicker: e.kicker || spec.kicker,
    category: CATEGORY_KEYS.includes(e.category) ? e.category : spec.category,
    region: spec.region,
    importance: spec.importance,
    signal: spec.importance >= 5 ? "must-read" : spec.importance >= 3 ? "recommended" : "all",
    summary: e.summary,
    whyItMatters: e.whyItMatters,
    perspectives,
    articles: all,
    static: (e.staticLinks || []).slice(0, 3),
    prelims: e.prelims || [],
    mainsQuestion: e.mainsQuestion,
    tags: e.tags || [],
    readMinutes: e.readMinutes || 5,
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
}

// Deterministic fallback used by --dry-run (no API key needed) so the UI can
// be developed and previewed without spending tokens.
export function buildHeuristicStories(articles: Article[]): Story[] {
  return articles.slice(0, 12).map((a, i) => {
    const slug = slugify(a.title) || `story-${i}`;
    return {
      id: slug,
      slug,
      headline: a.title,
      kicker: a.categories[0] ? `${a.categories[0]} · ${a.region === "india" ? "India" : "World"}` : "News",
      category: a.categories[0] || "polity",
      region: a.region,
      importance: 3,
      signal: "recommended" as const,
      summary: a.snippet || "Summary unavailable (dry run).",
      whyItMatters: "Dry-run placeholder — run with an LLM configured for the full brief.",
      perspectives: [
        { source: a.source, region: a.region === "india" ? "India" : "Global", lean: "unknown" as const, take: a.snippet.slice(0, 140), link: a.link },
      ],
      articles: [a],
      static: [],
      prelims: [],
      tags: a.categories,
      readMinutes: 4,
    };
  });
}
