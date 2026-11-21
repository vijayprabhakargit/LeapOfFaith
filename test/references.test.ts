import { test } from "node:test";
import assert from "node:assert/strict";
import type { StaticLink, Story } from "../src/lib/types";
import {
  buildReferenceIndex,
  citationAnchor,
  referenceAnchor,
  referencesForStaticLink,
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

const RBI = "rbi-monetary-policy";
const RBI_LINK = staticLink("RBI & Monetary Policy", "Indian Economy — Banking & Monetary Policy");
const RBI_COUNT = CARD_REFERENCES[RBI].length;

test("referencesForStaticLink uses curated refs for a matching card", () => {
  const refs = referencesForStaticLink(RBI_LINK);
  assert.ok(refs.length >= 2);
  assert.ok(refs.some((r) => r.href === "https://www.rbi.org.in/"));
});

test("referencesForStaticLink returns no references for an unmatched topic", () => {
  const refs = referencesForStaticLink(staticLink("Quantum Widgets", "Miscellaneous"));
  assert.deepEqual(refs, []);
});

test("buildReferenceIndex numbers by first appearance and dedupes by href", () => {
  const stories = [
    story("a", "Story A", [RBI_LINK]),
    story("b", "Story B", [staticLink("Quantum Widgets", "Miscellaneous")]),
  ];
  const index = buildReferenceIndex(stories);
  assert.equal(index.entries.length, RBI_COUNT);
  assert.deepEqual(
    index.entries.map((e) => e.n),
    Array.from({ length: RBI_COUNT }, (_, i) => i + 1),
  );
  assert.deepEqual(index.byStoryIndex.get(0), [Array.from({ length: RBI_COUNT }, (_, i) => i + 1)]);
  // The unmatched static link cites nothing rather than a search result.
  assert.deepEqual(index.byStoryIndex.get(1), [[]]);
});

test("a reference cited by two stories keeps one number and gains two citations", () => {
  const index = buildReferenceIndex([story("a", "Story A", [RBI_LINK]), story("b", "Story B", [RBI_LINK])]);
  assert.equal(index.entries.length, RBI_COUNT);
  for (const entry of index.entries) {
    assert.equal(entry.citations.length, 2);
    assert.equal(new Set(entry.citations.map((c) => c.anchor)).size, 2);
  }
  // Both stories cite the same numbers.
  assert.deepEqual(index.byStoryIndex.get(0), index.byStoryIndex.get(1));
});

test("the same reference cited twice inside one story does not duplicate its number", () => {
  const index = buildReferenceIndex([story("a", "Story A", [RBI_LINK, RBI_LINK])]);
  assert.equal(index.entries.length, RBI_COUNT);
  const numbers = Array.from({ length: RBI_COUNT }, (_, i) => i + 1);
  assert.deepEqual(index.byStoryIndex.get(0), [numbers, numbers]);
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
  const kinds = new Set(["official", "wiki", "report", "book"]);
  for (const [id, refs] of Object.entries(CARD_REFERENCES)) {
    assert.ok(refs.length > 0, `${id} has no references`);
    for (const ref of refs) {
      assert.ok(ref.label.trim().length > 0, `${id} has an empty label`);
      assert.ok(ref.href.startsWith("https://"), `${id} has a non-https href: ${ref.href}`);
      assert.ok(kinds.has(ref.kind), `${id} has an unknown kind: ${ref.kind}`);
    }
  }
});

test("no curated reference points at a search-results page", () => {
  for (const [id, refs] of Object.entries(CARD_REFERENCES)) {
    for (const ref of refs) {
      assert.ok(!/\/w\/index\.php\?search=/.test(ref.href), `${id} has a search href: ${ref.href}`);
      assert.ok(!/google\.[^/]+\/search/.test(ref.href), `${id} has a search href: ${ref.href}`);
    }
  }
});

test("book references are present and point at Wikipedia article pages", () => {
  const books = Object.values(CARD_REFERENCES).flat().filter((r) => r.kind === "book");
  assert.ok(books.length > 0, "expected at least one book reference");
  for (const book of books) {
    assert.ok(book.href.startsWith("https://en.wikipedia.org/wiki/"), `book href is not a Wikipedia article: ${book.href}`);
    assert.ok(!book.href.includes("(disambiguation)"), `book href is a disambiguation page: ${book.href}`);
  }
});
