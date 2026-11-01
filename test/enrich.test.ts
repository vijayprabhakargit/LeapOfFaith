import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, sanitizeArticleIds, buildHeuristicStories, outletFamily, selectCandidates, assignSignals, selectExtras } from "../scripts/lib/enrich";
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

test("selectCandidates round-robins across outlets and caps each family", () => {
  const hindu = Array.from({ length: 10 }, (_, i) =>
    makeArticle({ id: `h${i}`, source: "The Hindu", sourceId: "the-hindu", link: `https://e.com/h${i}`, publishedAt: new Date(Date.UTC(2026, 9, 31, 10, i)).toISOString() }),
  );
  const ie = Array.from({ length: 2 }, (_, i) =>
    makeArticle({ id: `ie${i}`, source: "The Indian Express", sourceId: "indian-express", link: `https://e.com/ie${i}` }),
  );
  const pib = [makeArticle({ id: "p1", source: "PIB (Press Information Bureau)", sourceId: "pib", link: "https://e.com/p1" })];
  const priority = new Map([
    ["the-hindu", 1],
    ["indian-express", 1],
    ["pib", 1],
  ]);

  const picked = selectCandidates([...hindu, ...ie, ...pib], priority, 20, 4);
  const families = picked.map((a) => outletFamily(a.source));
  const count = (f: string) => families.filter((x) => x === f).length;

  assert.equal(count("The Hindu"), 4, "Hindu capped at 4 despite 10 articles");
  assert.equal(count("The Indian Express"), 2);
  assert.equal(count("PIB (Press Information Bureau)"), 1);
  assert.equal(picked.length, 7);
});

test("selectCandidates respects the overall limit", () => {
  const articles = Array.from({ length: 30 }, (_, i) =>
    makeArticle({ id: `a${i}`, source: `Paper ${i}`, sourceId: `p${i}`, link: `https://e.com/${i}` }),
  );
  const priority = new Map(articles.map((a) => [a.sourceId, 3]));
  assert.equal(selectCandidates(articles, priority, 5, 4).length, 5);
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

test("selectExtras skips used links and collapses duplicate titles", () => {
  const articles = [
    makeArticle({ id: "1", title: "Big story", link: "https://e.com/1", sourceId: "the-hindu" }),
    makeArticle({ id: "2", title: "Big story", link: "https://e.com/2", sourceId: "the-print" }),
    makeArticle({ id: "3", title: "Another angle", link: "https://e.com/3", sourceId: "pib" }),
    makeArticle({ id: "4", title: "Used elsewhere", link: "https://e.com/used", sourceId: "pib" }),
  ];
  const priority = new Map([
    ["the-hindu", 1],
    ["the-print", 2],
    ["pib", 1],
  ]);
  const extras = selectExtras(articles, new Set(["https://e.com/used"]), priority, 10);
  assert.ok(extras.every((a) => a.link !== "https://e.com/used"));
  assert.equal(extras.filter((a) => a.title === "Big story").length, 1);
});

test("selectExtras respects the limit", () => {
  const articles = Array.from({ length: 40 }, (_, i) =>
    makeArticle({ id: `a${i}`, title: `Headline ${i}`, link: `https://e.com/${i}` }),
  );
  const priority = new Map([["the-hindu", 1]]);
  assert.equal(selectExtras(articles, new Set(), priority, 5).length, 5);
});
