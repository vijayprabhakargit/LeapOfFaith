import { test } from "node:test";
import assert from "node:assert/strict";
import type { StaticLink, Story } from "../src/lib/types";
import {
  buildReferenceIndex,
  citationAnchor,
  referenceAnchor,
  referencesForStaticLink,
  wikipediaSearch,
} from "../src/lib/references";
import { CARD_REFERENCES, KNOWLEDGE_CARDS } from "../config/syllabus";

function staticLink(topic: string, syllabusNode = "General Studies"): StaticLink {
  return {
    topic,
    paper: "GS-III",
    syllabusNode,
    whatIsIt: "What it is.",
    background: "Background.",
    whyInNews: "Why in news.",
    keyTerms: [],
  };
}

function story(slug: string, headline: string, links: StaticLink[]): Story {
  return {
    id: slug,
    slug,
    headline,
    kicker: "Kicker",
    category: "polity",
    region: "india",
    importance: 5,
    signal: "must-read",
    summary: "Summary.",
    whyItMatters: "Why.",
    perspectives: [],
    articles: [],
    static: links,
    prelims: [],
    tags: [],
    readMinutes: 3,
  };
}

test("referencesForStaticLink uses curated refs for a matching card", () => {
  const refs = referencesForStaticLink(staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy"));
  assert.ok(refs.length >= 2);
  assert.ok(refs.some((r) => r.href === "https://www.rbi.org.in/"));
  assert.ok(refs.every((r) => r.kind !== "search"));
});

test("referencesForStaticLink falls back to a Wikipedia search for an unmatched topic", () => {
  const refs = referencesForStaticLink(staticLink("Quantum Widgets", "Miscellaneous"));
  assert.equal(refs.length, 1);
  assert.equal(refs[0].kind, "search");
  assert.equal(refs[0].href, wikipediaSearch("Quantum Widgets").href);
  assert.ok(refs[0].href.startsWith("https://en.wikipedia.org/w/index.php?search="));
});

test("buildReferenceIndex numbers by first appearance and dedupes by href", () => {
  const stories = [
    story("a", "Story A", [staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy")]),
    story("b", "Story B", [staticLink("Quantum Widgets", "Miscellaneous")]),
  ];
  const index = buildReferenceIndex(stories);
  // Three curated RBI refs, then one search fallback.
  assert.equal(index.entries.length, 4);
  assert.deepEqual(
    index.entries.map((e) => e.n),
    [1, 2, 3, 4],
  );
  assert.deepEqual(index.byStoryIndex.get(0), [[1, 2, 3]]);
  assert.deepEqual(index.byStoryIndex.get(1), [[4]]);
});

test("a reference cited by two stories keeps one number and gains two citations", () => {
  const link = staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy");
  const index = buildReferenceIndex([story("a", "Story A", [link]), story("b", "Story B", [link])]);
  assert.equal(index.entries.length, 3);
  for (const entry of index.entries) {
    assert.equal(entry.citations.length, 2);
    assert.equal(new Set(entry.citations.map((c) => c.anchor)).size, 2);
  }
  // Both stories cite the same numbers.
  assert.deepEqual(index.byStoryIndex.get(0), index.byStoryIndex.get(1));
});

test("the same reference cited twice inside one story does not duplicate its number", () => {
  const link = staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy");
  const index = buildReferenceIndex([story("a", "Story A", [link, link])]);
  assert.equal(index.entries.length, 3);
  assert.deepEqual(index.byStoryIndex.get(0), [
    [1, 2, 3],
    [1, 2, 3],
  ]);
  for (const entry of index.entries) {
    assert.equal(entry.citations.length, 2);
  }
});

test("citation anchors are unique per static link and reference", () => {
  const link = staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy");
  const index = buildReferenceIndex([story("a", "Story A", [link, link])]);
  const anchors = index.entries.flatMap((e) => e.citations.map((c) => c.anchor));
  assert.equal(new Set(anchors).size, anchors.length);
  assert.equal(anchors[0], citationAnchor(0, 0, 1));
  assert.equal(referenceAnchor(1), "ref-1");
});

test("an edition with no static links produces an empty index", () => {
  const index = buildReferenceIndex([story("a", "Story A", [])]);
  assert.deepEqual(index.entries, []);
  assert.deepEqual(index.byStoryIndex.get(0), []);
});

test("every curated reference card id exists in KNOWLEDGE_CARDS", () => {
  const ids = new Set(KNOWLEDGE_CARDS.map((c) => c.id));
  for (const id of Object.keys(CARD_REFERENCES)) {
    assert.ok(ids.has(id), `CARD_REFERENCES has unknown card id: ${id}`);
  }
});

test("every curated reference has a non-empty label, https href and known kind", () => {
  const kinds = new Set(["official", "wiki", "report", "book", "search"]);
  for (const [id, refs] of Object.entries(CARD_REFERENCES)) {
    assert.ok(refs.length > 0, `${id} has no references`);
    for (const ref of refs) {
      assert.ok(ref.label.trim().length > 0, `${id} has an empty label`);
      assert.ok(ref.href.startsWith("https://"), `${id} has a non-https href: ${ref.href}`);
      assert.ok(kinds.has(ref.kind), `${id} has an unknown kind: ${ref.kind}`);
    }
  }
});
