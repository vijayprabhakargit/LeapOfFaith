import { test } from "node:test";
import assert from "node:assert/strict";
import { CATEGORIES, GS_PAPERS, KNOWLEDGE_CARDS, matchKnowledgeCards } from "../config/syllabus";

test("category keys are unique", () => {
  const keys = CATEGORIES.map((c) => c.key);
  assert.equal(new Set(keys).size, keys.length);
});

test("every knowledge card is well-formed", () => {
  const papers = Object.keys(GS_PAPERS);
  for (const card of KNOWLEDGE_CARDS) {
    assert.ok(card.id, `card missing id`);
    assert.ok(card.whatIsIt.length > 20, `${card.id} has thin whatIsIt`);
    assert.ok(card.background.length > 20, `${card.id} has thin background`);
    assert.ok(card.keyTerms.length > 0, `${card.id} has no key terms`);
    assert.ok(papers.includes(card.paper), `${card.id} has unknown paper ${card.paper}`);
    assert.ok(card.keywords.length > 0, `${card.id} has no keywords`);
  }
});

test("knowledge card ids are unique", () => {
  const ids = KNOWLEDGE_CARDS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("matchKnowledgeCards matches a monetary-policy story", () => {
  const matches = matchKnowledgeCards("RBI holds the repo rate as inflation cools");
  assert.ok(matches.length > 0);
  assert.equal(matches[0].id, "rbi-monetary-policy");
});

test("matchKnowledgeCards ignores irrelevant text", () => {
  assert.deepEqual(matchKnowledgeCards("zzzz qqqq nonsense"), []);
});

test("matchKnowledgeCards respects the limit", () => {
  const text = "parliament bill rbi inflation climate biodiversity monsoon agriculture";
  assert.ok(matchKnowledgeCards(text, 2).length <= 2);
});
