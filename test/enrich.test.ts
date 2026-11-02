import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, sanitizeArticleIds, buildHeuristicStories, outletFamily, tokenize, shortlistPerSource, preselectByHeadlines, assignSignals, buildExtras, distinctOutlets, clusterScore, type ClusterSpec } from "../scripts/lib/enrich";
import type { Article } from "../src/lib/types";

function makeArticle(overrides: Partial<Article> = {}): Article {
  return {
    id: "a1",
    title: "RBI holds the repo rate",
    link: "https://example.com/a",
    source: "The Hindu",
    sourceId: "the-hindu",
    region: "india",
    categories: ["economy"],
    publishedAt: "2026-10-31T04:00:00.000Z",
    snippet: "The MPC kept rates unchanged.",
    ...overrides,
  };
}

test("slugify lowercases and hyphenates", () => {
  assert.equal(slugify("RBI Holds the Repo Rate"), "rbi-holds-the-repo-rate");
});

test("slugify strips punctuation and collapses spaces", () => {
  assert.equal(slugify("India–EU: A 'landmark' pact!"), "indiaeu-a-landmark-pact");
});

test("slugify caps length and trims trailing hyphens", () => {
  const out = slugify("a".repeat(80));
  assert.ok(out.length <= 60);
  assert.ok(!out.endsWith("-"));
});

test("slugify returns empty string for empty input", () => {
  assert.equal(slugify(""), "");
});

test("sanitizeArticleIds keeps only in-range integers", () => {
  assert.deepEqual(sanitizeArticleIds([0, 2, 5, -1], 3), [0, 2]);
});

test("sanitizeArticleIds coerces numeric strings from the model", () => {
  assert.deepEqual(sanitizeArticleIds(["1", "2"], 3), [1, 2]);
});

test("sanitizeArticleIds drops non-numeric and non-array input", () => {
  assert.deepEqual(sanitizeArticleIds(["x", 1.5, undefined], 3), []);
  assert.deepEqual(sanitizeArticleIds(undefined, 3), []);
  assert.deepEqual(sanitizeArticleIds("nope", 3), []);
});

test("buildHeuristicStories maps articles into story shape", () => {
  const articles = Array.from({ length: 15 }, (_, i) =>
    makeArticle({ id: `a${i}`, title: `Headline number ${i}`, link: `https://example.com/${i}` }),
  );
  const stories = buildHeuristicStories(articles);
  assert.equal(stories.length, 12);
  const first = stories[0];
  assert.equal(first.signal, "recommended");
  assert.equal(first.region, "india");
  assert.equal(first.perspectives.length, 1);
  assert.equal(first.articles.length, 1);
  assert.ok(first.slug.length > 0);
});

test("buildHeuristicStories keeps global region for global articles", () => {
  const stories = buildHeuristicStories([makeArticle({ region: "global" })]);
  assert.equal(stories[0].region, "global");
});

test("outletFamily collapses multi-feed papers to one family", () => {
  assert.equal(outletFamily("The Hindu — World"), "The Hindu");
  assert.equal(outletFamily("Mint"), "Mint");
});

test("shortlistPerSource keeps each source's top slice by feed order", () => {
  const hindu = Array.from({ length: 20 }, (_, i) =>
    makeArticle({ id: `h${i}`, source: "The Hindu", sourceId: "the-hindu", link: `https://e.com/h${i}`, feedRank: i }),
  );
  const mint = [makeArticle({ id: "m0", source: "Mint", sourceId: "livemint", link: "https://e.com/m0", feedRank: 0 })];
  const out = shortlistPerSource([...hindu, ...mint], 0.2, 3, 10);
  const h = out.filter((a) => a.source === "The Hindu");
  assert.equal(h.length, 4, "20% of 20 = 4");
  assert.deepEqual(h.map((a) => a.feedRank), [0, 1, 2, 3], "kept the top of the feed");
  assert.equal(out.filter((a) => a.source === "Mint").length, 1);
});

test("preselectByHeadlines favours corroborated stories and uses every feed", () => {
  const mk = (id: string, source: string, sourceId: string, title: string) =>
    makeArticle({ id, source, sourceId, title, link: `https://e.com/${id}`, feedRank: 0 });
  const pool = [
    mk("a1", "The Hindu", "the-hindu", "Iran war escalates as tankers hit mines in Strait of Hormuz"),
    mk("b1", "Reuters", "reuters", "Tankers hit mines in Strait of Hormuz amid Iran war"),
    mk("c1", "BBC World", "bbc-world", "Iran war: tankers hit mines in Strait of Hormuz"),
    mk("d1", "Mint", "livemint", "Rupee slips against dollar on oil price worries"),
    mk("e1", "PIB", "pib", "Cabinet approves new scheme for rural water"),
  ];
  const priority = new Map([
    ["the-hindu", 1],
    ["reuters", 2],
    ["bbc-world", 3],
    ["livemint", 2],
    ["pib", 1],
  ]);
  const weight = new Map([["the-hindu", 1.2]]);
  const out = preselectByHeadlines(pool, priority, weight, 90, 10);
  const families = new Set(out.map((a) => outletFamily(a.source)));
  assert.equal(families.size, 5, "every feed contributes");
  assert.ok(out.some((a) => a.id === "b1") && out.some((a) => a.id === "c1"), "corroborated items kept");
});

test("tokenize drops stopwords and short words", () => {
  assert.deepEqual(tokenize("The Iran war and the Strait of Hormuz"), ["iran", "war", "strait", "hormuz"]);
});

test("assignSignals guarantees a must-read and tiers the rest", () => {
  const base = buildHeuristicStories([
    makeArticle({ id: "x", title: "Top story" }),
    makeArticle({ id: "y", title: "Second" }),
    makeArticle({ id: "z", title: "Third" }),
  ]);
  const stories = assignSignals([
    { ...base[0], importance: 4 },
    { ...base[1], importance: 4 },
    { ...base[2], importance: 2 },
  ]);
  assert.equal(stories[0].signal, "must-read", "top-ranked story is a must-read");
  assert.equal(stories[1].signal, "recommended");
  assert.equal(stories[2].signal, "all");
});

test("assignSignals marks any importance-5 story as must-read", () => {
  const base = buildHeuristicStories([makeArticle(), makeArticle({ id: "b", title: "B" })]);
  const stories = assignSignals([{ ...base[0], importance: 4 }, { ...base[1], importance: 5 }]);
  assert.equal(stories[1].signal, "must-read");
});

test("buildExtras turns overflow clusters into multi-source items", () => {
  const candidates = [
    makeArticle({ id: "a0", title: "Top story", link: "https://e.com/0", source: "The Hindu", sourceId: "the-hindu" }),
    makeArticle({ id: "a1", title: "Hormuz mines", link: "https://e.com/1", source: "ThePrint", sourceId: "the-print" }),
    makeArticle({ id: "a2", title: "Hormuz tankers", link: "https://e.com/2", source: "Reuters", sourceId: "the-wire" }),
    makeArticle({ id: "a3", title: "Leftover one", link: "https://e.com/3", source: "Mint", sourceId: "livemint" }),
  ];
  const specs: ClusterSpec[] = [
    { headline: "Top story", kicker: "P · x", category: "polity", region: "india", importance: 5, articleIds: [0] },
    { headline: "Hormuz shipping", kicker: "IR · y", category: "ir", region: "global", importance: 3, articleIds: [1, 2] },
  ];
  const priority = new Map([
    ["the-hindu", 1],
    ["the-print", 2],
    ["the-wire", 3],
    ["livemint", 2],
  ]);
  const extras = buildExtras(specs, candidates, 1, priority, 30);
  assert.equal(extras.length, 2);
  assert.equal(extras[0].title, "Hormuz shipping");
  assert.equal(extras[0].articles.length, 2, "overflow cluster keeps both sources");
  assert.equal(extras[1].title, "Leftover one");
  assert.equal(extras[1].articles.length, 1);
});

test("buildExtras respects the limit and de-duplicates titles", () => {
  const candidates = Array.from({ length: 40 }, (_, i) =>
    makeArticle({ id: `a${i}`, title: `Headline ${i}`, link: `https://e.com/${i}` }),
  );
  const priority = new Map([["the-hindu", 1]]);
  assert.equal(buildExtras([], candidates, 0, priority, 5).length, 5);
});

test("clusterScore boosts clusters covered by more distinct outlets", () => {
  const candidates = [
    makeArticle({ id: "a0", source: "The Hindu", sourceId: "the-hindu", link: "https://e.com/0" }),
    makeArticle({ id: "a1", source: "ThePrint", sourceId: "the-print", link: "https://e.com/1" }),
    makeArticle({ id: "a2", source: "Mint", sourceId: "livemint", link: "https://e.com/2" }),
  ];
  const solo: ClusterSpec = { headline: "Solo", kicker: "k", category: "polity", region: "india", importance: 3, articleIds: [0] };
  const wide: ClusterSpec = { headline: "Wide", kicker: "k", category: "ir", region: "global", importance: 3, articleIds: [0, 1, 2] };
  assert.equal(distinctOutlets(solo, candidates), 1);
  assert.equal(distinctOutlets(wide, candidates), 3);
  assert.ok(clusterScore(wide, candidates) > clusterScore(solo, candidates));
  // importance stays dominant: a thin important story still beats a trivial wide one
  const thinImportant: ClusterSpec = { headline: "Imp", kicker: "k", category: "polity", region: "india", importance: 5, articleIds: [0] };
  const wideTrivial: ClusterSpec = { headline: "Triv", kicker: "k", category: "culture", region: "india", importance: 1, articleIds: [0, 1, 2] };
  assert.ok(clusterScore(thinImportant, candidates) > clusterScore(wideTrivial, candidates));
});

test("clusterScore counts outlet families, not feeds", () => {
  const candidates = [
    makeArticle({ source: "The Hindu", sourceId: "the-hindu", link: "https://e.com/0" }),
    makeArticle({ source: "The Hindu — World", sourceId: "the-hindu-world", link: "https://e.com/1" }),
    makeArticle({ source: "The Hindu — Opinion", sourceId: "the-hindu-editorial", link: "https://e.com/2" }),
  ];
  const spec: ClusterSpec = { headline: "H", kicker: "k", category: "polity", region: "india", importance: 4, articleIds: [0, 1, 2] };
  assert.equal(distinctOutlets(spec, candidates), 1, "three Hindu feeds = one family");
});
