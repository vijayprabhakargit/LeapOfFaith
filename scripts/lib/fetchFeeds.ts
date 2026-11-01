import Parser from "rss-parser";
import type { Article } from "../../src/lib/types";
import { ENABLED_SOURCES, type Source, googleNewsUrl } from "../../config/sources";

const parser: Parser = new Parser({
  customFields: { item: [["media:content", "mediaContent"]] },
});

const FETCH_TIMEOUT_MS = 12000;
const MAX_SNIPPET = 320;

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 TheDailyBrief/1.0",
  Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
  "Accept-Language": "en-IN,en;q=0.9",
  "Cache-Control": "no-cache",
};

// Hard, abortable fetch — rss-parser's own timeout does not reliably abort
// stalled sockets, which is what can hang a build.
async function fetchXml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal, redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

function decodeEntities(input: string): string {
  return input
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;|&#x27;/gi, "'")
    .replace(/&#8217;|&rsquo;/gi, "’")
    .replace(/&#8220;|&ldquo;/gi, "“")
    .replace(/&#8221;|&rdquo;/gi, "”")
    .replace(/&#8211;|&ndash;/gi, "–")
    .replace(/&#8212;|&mdash;/gi, "—")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function snippet(text: string): string {
  const clean = decodeEntities(text || "");
  if (clean.length <= MAX_SNIPPET) return clean;
  const cut = clean.slice(0, MAX_SNIPPET);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 200 ? lastSpace : MAX_SNIPPET)}…`;
}

function toArticle(source: Source, item: any): Article | null {
  const link: string = item.link || item.guid || "";
  const title: string = decodeEntities(item.title || "");
  if (!link || !title) return null;
  const dateStr = item.isoDate || item.pubDate || item.pubdate || "";
  const publishedAt = dateStr && !Number.isNaN(Date.parse(dateStr)) ? new Date(dateStr).toISOString() : new Date().toISOString();
  return {
    id: `${source.id}:${Buffer.from(link).toString("base64url").slice(0, 24)}`,
    title,
    link,
    source: source.name,
    sourceId: source.id,
    region: source.region,
    categories: source.categories,
    publishedAt,
    snippet: snippet(item.contentSnippet || item.content || item.summary || item["media:description"] || ""),
  };
}

export interface FetchResult {
  articles: Article[];
  ok: Source[];
  failed: { source: Source; error: string }[];
}

export async function fetchFeeds(
  sources: Source[] = ENABLED_SOURCES,
  windowHours = 24,
  referenceMs = Date.now(),
): Promise<FetchResult> {
  const cutoff = referenceMs - windowHours * 60 * 60 * 1000;
  const articles: Article[] = [];
  const ok: Source[] = [];
  const failed: { source: Source; error: string }[] = [];

  await Promise.all(
    sources.map(async (source) => {
      try {
        const xml = await fetchXml(source.rss);
        const feed = await parser.parseString(xml);
        ok.push(source);
        for (const item of feed.items || []) {
          const article = toArticle(source, item);
          if (!article) continue;
          if (new Date(article.publishedAt).getTime() < cutoff) continue;
          articles.push(article);
        }
      } catch (err) {
        failed.push({ source, error: err instanceof Error ? err.message : String(err) });
      }
    }),
  );

  // De-duplicate by normalised URL.
  const seen = new Set<string>();
  const deduped = articles.filter((a) => {
    const key = a.link.replace(/[?#].*$/, "").replace(/\/$/, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { articles: deduped, ok, failed };
}

// Google News search feed — used to pull a *country-specific* set of outlets
// for a story so we can show a genuinely different perspective. Google News
// titles are "Headline - Outlet", which we split to attribute the outlet.
export async function fetchGoogleNewsArticles(
  query: string,
  localeKey: string,
  windowHours = 48,
  limit = 6,
  referenceMs = Date.now(),
): Promise<Article[]> {
  const cutoff = referenceMs - windowHours * 60 * 60 * 1000;
  const pseudo: Source = {
    id: `gnews-${localeKey}`,
    name: `Google News (${localeKey})`,
    homepage: "https://news.google.com/",
    rss: googleNewsUrl(query, localeKey),
    region: "global",
    lean: "unknown",
    categories: [],
    priority: 4,
    enabled: true,
  };
  try {
    const xml = await fetchXml(pseudo.rss);
    const feed = await parser.parseString(xml);
    const out: Article[] = [];
    for (const item of feed.items || []) {
      const raw = decodeEntities(item.title || "");
      const sep = raw.lastIndexOf(" - ");
      const outlet = sep > 0 ? raw.slice(sep + 3).trim() : "regional outlet";
      const headline = sep > 0 ? raw.slice(0, sep).trim() : raw;
      if (!item.link || !headline) continue;
      const publishedAt = item.isoDate ? new Date(item.isoDate).toISOString() : new Date().toISOString();
      if (new Date(publishedAt).getTime() < cutoff) continue;
      out.push({
        id: `gnews:${Buffer.from(item.link).toString("base64url").slice(0, 20)}`,
        title: headline,
        link: item.link,
        source: outlet,
        sourceId: pseudo.id,
        region: "global",
        categories: [],
        publishedAt,
        snippet: snippet(item.contentSnippet || item.content || ""),
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
