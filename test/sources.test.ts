import { test } from "node:test";
import assert from "node:assert/strict";
import { SOURCES, ENABLED_SOURCES, GOOGLE_NEWS_LOCALES, googleNewsUrl, youtubeFeed } from "../config/sources";

test("source ids are unique", () => {
  const ids = SOURCES.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every enabled source has an https feed and at least one category", () => {
  for (const s of ENABLED_SOURCES) {
    assert.match(s.rss, /^https:\/\//, `${s.id} rss not https`);
    assert.ok(s.categories.length > 0, `${s.id} has no categories`);
  }
});

test("googleNewsUrl encodes the query with the India locale by default", () => {
  const url = googleNewsUrl("india eu trade");
  assert.match(url, /news\.google\.com\/rss\/search\?q=/);
  assert.ok(url.includes(encodeURIComponent("india eu trade when:1d")));
  assert.ok(url.includes("ceid=IN:en"));
  assert.ok(url.includes("gl=IN"));
});

test("googleNewsUrl switches locale for a known country", () => {
  const url = googleNewsUrl("nuclear talks", "iran");
  assert.ok(url.includes("ceid=IR:en"));
  assert.ok(url.includes("gl=IR"));
});

test("googleNewsUrl falls back to India for an unknown country key", () => {
  const url = googleNewsUrl("floods", "atlantis");
  assert.ok(url.includes("ceid=IN:en"));
});

test("googleNewsUrl honours a custom window", () => {
  assert.ok(googleNewsUrl("x", "us", "7d").includes(encodeURIComponent("when:7d")));
});

test("GOOGLE_NEWS_LOCALES entries are well-formed", () => {
  for (const [key, loc] of Object.entries(GOOGLE_NEWS_LOCALES)) {
    assert.equal(loc.ceid, `${loc.gl}:${loc.ceid.split(":")[1]}`, `${key} ceid mismatch`);
    assert.ok(loc.hl && loc.gl, `${key} incomplete locale`);
  }
});

test("youtubeFeed builds a channel feed URL", () => {
  assert.equal(
    youtubeFeed("UC123"),
    "https://www.youtube.com/feeds/videos.xml?channel_id=UC123",
  );
});
