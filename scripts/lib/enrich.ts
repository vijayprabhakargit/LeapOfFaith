import type { Article, Story, StaticLink, Perspective, Region, ExtraItem } from "../../src/lib/types";
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

// The "outlet family" of a source — e.g. "The Hindu — World" belongs to
// "The Hindu". Used to stop a paper with several feeds from dominating.
export function outletFamily(source: string): string {
  return source.split(" — ")[0].trim();
}

const STOPWORDS = new Set([
  "the","a","an","and","or","of","to","in","on","for","with","at","by","from","as","is","are","was","were","be","been",
  "it","its","this","that","these","those","after","over","into","amid","against","new","says","said","will","may",
  "can","not","but","how","why","what","who","top","india","indian","year","years","than","then","also","more","most",
  "out","up","off","no","yes","his","her","their","our","your","they","them","he","she","we","you","has","have","had",
]);

// Significant headline tokens (lowercased; stopwords and short words removed).
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w));
}

// Lane 1 — per-source shortlist: the top ~20% of each source's fresh articles,
// by feed order (a publisher's feed ≈ their front page), fallback recency.
// Headline + snippet only; no deep content.
export function shortlistPerSource(articles: Article[], pct = 0.2, minPer = 3, maxPer = 10): Article[] {
  const byFamily = new Map<string, Article[]>();
  for (const a of articles) {
    const key = outletFamily(a.source);
    const list = byFamily.get(key) ?? [];
    list.push(a);
    byFamily.set(key, list);
  }
  const out: Article[] = [];
  for (const list of byFamily.values()) {
    list.sort(
      (x, y) =>
        (x.feedRank ?? 999) - (y.feedRank ?? 999) ||
        new Date(y.publishedAt).getTime() - new Date(x.publishedAt).getTime(),
    );
    const k = Math.min(list.length, Math.max(minPer, Math.min(maxPer, Math.ceil(list.length * pct))));
    out.push(...list.slice(0, k));
  }
  return out;
}

// Lane 2 — smart cross-source preselect at headline level. Favours stories that
// corroborate across different outlets (shared significant headline tokens),
// plus source priority/weight and feed order, then guarantees every feed
// contributes at least one and caps depth per family.
export function preselectByHeadlines(
  pool: Article[],
  priorityOf: Map<string, number>,
  weightOf: Map<string, number> = new Map(),
  limit = 90,
  perFamilyCap = 10,
): Article[] {
  const famOf = (a: Article) => outletFamily(a.source);
  const tokens = new Map<Article, Set<string>>();
  for (const a of pool) tokens.set(a, new Set(tokenize(a.title)));

  const corroboration = new Map<Article, number>();
  for (const a of pool) {
    const ta = tokens.get(a)!;
    const fa = famOf(a);
    const families = new Set<string>();
    for (const b of pool) {
      if (b === a || famOf(b) === fa) continue;
      let shared = 0;
      for (const t of ta) {
        if (tokens.get(b)!.has(t)) {
          shared++;
          if (shared >= 2) break;
        }
      }
      if (shared >= 2) families.add(famOf(b));
    }
    corroboration.set(a, families.size);
  }

  const score = (a: Article) => {
    const p = priorityOf.get(a.sourceId) ?? 3;
    const w = weightOf.get(a.sourceId) ?? 1;
    const rank = Math.min(a.feedRank ?? 999, 20);
    return (
      4 - p + (w - 1) + (corroboration.get(a) ?? 0) * 1.5 - rank * 0.02 + new Date(a.publishedAt).getTime() / 1e14
    );
  };

  const sorted = [...pool].sort((x, y) => score(y) - score(x));
  const picked: Article[] = [];
  const inPicked = new Set<Article>();
  const famCount = new Map<string, number>();
  const take = (a: Article) => {
    picked.push(a);
    inPicked.add(a);
    const f = famOf(a);
    famCount.set(f, (famCount.get(f) ?? 0) + 1);
  };

  // Breadth first: one article from every family.
  for (const a of sorted) {
    if (picked.length >= limit) break;
    if ((famCount.get(famOf(a)) ?? 0) === 0) take(a);
  }
  // Then depth by score, within the per-family cap.
  for (const a of sorted) {
    if (picked.length >= limit) break;
    if (inPicked.has(a)) continue;
    if ((famCount.get(famOf(a)) ?? 0) >= perFamilyCap) continue;
    take(a);
  }
  return picked;
}

// Assign the "signal" badge relative to the whole edition so a "must read" always
// exists: the top-ranked story and any rated 5 are must-reads, 3+ are recommended.
export function assignSignals(stories: Story[]): Story[] {
  return stories.map((s, i) => ({
    ...s,
    signal: s.importance >= 5 || i === 0 ? "must-read" : s.importance >= 3 ? "recommended" : "all",
  }));
}

function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 70);
}

function dedupLinks(arts: Article[]): Article[] {
  const seen = new Set<string>();
  return arts.filter((a) => {
    const k = a.link.replace(/[?#].*$/, "").replace(/\/$/, "");
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function newestISO(arts: Article[]): string {
  return arts.reduce((m, a) => (a.publishedAt > m ? a.publishedAt : m), arts[0].publishedAt);
}

// Number of distinct outlet families covering a cluster — independent
// corroboration, ignoring a single paper's multiple feeds.
export function distinctOutlets(spec: ClusterSpec, candidates: Article[]): number {
  const families = new Set<string>();
  for (const i of spec.articleIds) {
    const a = candidates[i];
    if (a) families.add(outletFamily(a.source));
  }
  return families.size;
}

// Rank a cluster: the model's importance, plus a small bounded boost for how
// many independent outlets covered it (importance stays dominant). Tunable via
// OUTLET_WEIGHT / OUTLET_CAP env vars.
export function clusterScore(spec: ClusterSpec, candidates: Article[]): number {
  const weight = Number(process.env.OUTLET_WEIGHT ?? "0.3");
  const cap = Number(process.env.OUTLET_CAP ?? "5");
  const w = Number.isFinite(weight) ? weight : 0.3;
  const c = Number.isFinite(cap) ? cap : 5;
  return (spec.importance ?? 0) + w * Math.min(distinctOutlets(spec, candidates), c);
}

// Build the "Extras" reading list. `specs` must be sorted by importance desc.
// The first `primaryCount` clusters already became full stories; the rest become
// extras *as clusters* (keeping every source link), then articles that were
// never clustered are appended as single-article items. Ranked, de-duplicated
// and capped, so the lowest-value tail is dropped.
export function buildExtras(
  specs: ClusterSpec[],
  candidates: Article[],
  primaryCount: number,
  priorityOf: Map<string, number>,
  limit = 30,
): ExtraItem[] {
  const used = new Set<number>();
  for (const s of specs) for (const i of s.articleIds) used.add(i);

  const items: ExtraItem[] = [];
  const seenTitles = new Set<string>();
  const push = (title: string, arts: Article[]) => {
    const key = normTitle(title);
    if (!key || seenTitles.has(key) || !arts.length) return;
    seenTitles.add(key);
    items.push({ title, date: newestISO(arts), articles: arts });
  };

  for (const s of specs.slice(primaryCount)) {
    push(
      s.headline,
      dedupLinks(s.articleIds.map((i) => candidates[i]).filter(Boolean)),
    );
  }

  const leftovers = candidates
    .map((a, i) => ({ a, i }))
    .filter(({ i }) => !used.has(i))
    .sort((x, y) => {
      const px = priorityOf.get(x.a.sourceId) ?? 3;
      const py = priorityOf.get(y.a.sourceId) ?? 3;
      if (px !== py) return px - py;
      return new Date(y.a.publishedAt).getTime() - new Date(x.a.publishedAt).getTime();
    });
  for (const { a } of leftovers) push(a.title, [a]);

  return items.slice(0, limit);
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
- Produce 12 to 24 clusters. The app features the most important ~16 as full stories and lists the rest as a lighter "Extras" reading list, so cluster the tail too rather than dropping it; a single-article cluster is fine when nothing else matches.
- Weight stories by UPSC relevance: polity, economy, IR, environment, security, science & tech, society, culture, geography, agriculture.
- Spread importance across the full 1-5 range. Rate at least one story 5 (a genuine must-read for the exam), several 4, and the rest lower; do not rate everything the same.
- Build each story from articles by DIFFERENT outlets where possible. When several outlets cover the same event, merge them; do not let one newspaper's many items dominate a story.
- Prefer widely-accessible outlets; if a story is covered by both a paywalled paper and a free one, include both links but do not treat the paywalled one as the only source.
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
