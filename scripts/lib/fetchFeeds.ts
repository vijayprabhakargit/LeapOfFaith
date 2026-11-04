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

// Abortable fetch with bounded retries. rss-parser's own timeout does not
// reliably abort stalled sockets, and many feeds return transient 429/5xx under
// burst — so we hard-timeout, then retry a few times with backoff + jitter
// (honouring Retry-After). Permanent errors (e.g. 403/404) are not retried.
const MAX_ATTEMPTS = 3;
const TRANSIENT_STATUS = new Set([429, 500, 502, 503, 504]);

interface HttpError extends Error {
  status?: number;
  retryAfterMs?: number;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOnce(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers: HEADERS, signal: controller.signal, redirect: "follow" });
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`) as HttpError;
      err.status = res.status;
      const ra = Number(res.headers.get("retry-after"));
      if (Number.isFinite(ra) && ra > 0) err.retryAfterMs = ra * 1000;
      throw err;
    }
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchXml(url: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await fetchOnce(url);
    } catch (err) {
      lastErr = err;
      const e = err as HttpError;
      const transient = e.status === undefined || TRANSIENT_STATUS.has(e.status);
      if (!transient || attempt === MAX_ATTEMPTS) break;
      const backoff = e.retryAfterMs ?? 400 * 2 ** (attempt - 1);
      await sleep(backoff + Math.random() * 250);
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

// Concurrency-capped async map — fetching 35 feeds at once spikes request bursts
// and invites 429/503s; a small cap smooths that out.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

const FEED_CONCURRENCY = 6;

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

function toArticle(source: Source, item: any, rank: number): Article | null {
  const link: string = item.link || item.guid || "";
  let title: string = decodeEntities(item.title || "");
  let articleSource = source.name;
  // Google-News items are titled "Headline - Outlet"; split so we attribute the
  // real outlet instead of the feed wrapper.
  if (source.viaGoogle) {
    const sep = title.lastIndexOf(" - ");
    if (sep > 0) {
      const outlet = title.slice(sep + 3).trim();
      if (outlet) {
        articleSource = outlet;
        title = title.slice(0, sep).trim();
      }
    }
  }
  if (!link || !title) return null;
  const dateStr = item.isoDate || item.pubDate || item.pubdate || "";
  const publishedAt = dateStr && !Number.isNaN(Date.parse(dateStr)) ? new Date(dateStr).toISOString() : new Date().toISOString();
  return {
    id: `${source.id}:${Buffer.from(link).toString("base64url").slice(0, 24)}`,
    title,
    link,
    source: articleSource,
    sourceId: source.id,
    region: source.region,
    categories: source.categories,
    publishedAt,
    snippet: snippet(item.contentSnippet || item.content || item.summary || item["media:description"] || ""),
    feedRank: rank,
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

  await mapLimit(sources, FEED_CONCURRENCY, async (source) => {
      try {
        const xml = await fetchXml(source.rss);
        const feed = await parser.parseString(xml);
        ok.push(source);
        (feed.items || []).forEach((item: any, idx: number) => {
          const article = toArticle(source, item, idx);
          if (!article) return;
          if (new Date(article.publishedAt).getTime() < cutoff) return;
          articles.push(article);
        });
      } catch (err) {
        // Some publishers block datacenter IPs (e.g. indianexpress.com returns
        // 403 to GitHub Actions runners). Fall back to a Google-News site feed
        // so the source still contributes to the brief.
        if (!source.viaGoogle) {
          const alt = await fetchViaGoogle(source, cutoff);
          if (alt.length) {
            console.log(`   ↺ ${source.name}: direct feed failed, used Google News fallback (${alt.length} items)`);
            ok.push(source);
            articles.push(...alt);
            return;
          }
        }
        failed.push({ source, error: err instanceof Error ? err.message : String(err) });
      }
  });

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

function safeHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// Google-News site: feed — a resilient fallback for direct feeds that are
// blocked from datacenter IPs. Articles keep the original source's identity so
// attribution and source-balancing still work.
async function fetchViaGoogle(source: Source, cutoff: number): Promise<Article[]> {
  const domain = safeHost(source.homepage);
  if (!domain) return [];
  try {
    const xml = await fetchXml(googleNewsUrl(`site:${domain}`, "india", "2d"));
    const feed = await parser.parseString(xml);
    const out: Article[] = [];
    for (const item of feed.items || []) {
      const raw = decodeEntities(item.title || "");
      const sep = raw.lastIndexOf(" - ");
      const headline = sep > 0 ? raw.slice(0, sep).trim() : raw;
      if (!item.link || !headline) continue;
      const publishedAt = item.isoDate ? new Date(item.isoDate).toISOString() : new Date().toISOString();
      if (new Date(publishedAt).getTime() < cutoff) continue;
      out.push({
        id: `${source.id}:g:${Buffer.from(item.link).toString("base64url").slice(0, 20)}`,
        title: headline,
        link: item.link,
        source: source.name,
        sourceId: source.id,
        region: source.region,
        categories: source.categories,
        publishedAt,
        snippet: snippet(item.contentSnippet || item.content || ""),
        feedRank: out.length,
      });
      if (out.length >= 20) break;
    }
    return out;
  } catch {
    return [];
  }
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
        feedRank: out.length,
      });
      if (out.length >= limit) break;
    }
    return out;
  } catch {
    return [];
  }
}
