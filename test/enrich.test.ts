import { test } from "node:test";
import assert from "node:assert/strict";
import { slugify, sanitizeArticleIds, buildHeuristicStories } from "../scripts/lib/enrich";
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
