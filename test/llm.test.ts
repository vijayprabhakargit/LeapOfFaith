import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJsonLoose } from "../scripts/lib/llm";

test("parses plain JSON objects", () => {
  assert.deepEqual(parseJsonLoose('{"a":1}'), { a: 1 });
});

test("parses JSON arrays", () => {
  assert.deepEqual(parseJsonLoose("[1,2,3]"), [1, 2, 3]);
});

test("strips ```json fences", () => {
  const raw = '```json\n{"brief":["x"],"stories":[]}\n```';
  assert.deepEqual(parseJsonLoose(raw), { brief: ["x"], stories: [] });
});

test("strips bare ``` fences", () => {
  const raw = "```\n{\"ok\":true}\n```";
  assert.deepEqual(parseJsonLoose(raw), { ok: true });
});

test("recovers JSON embedded in prose", () => {
  const raw = 'Sure! Here is the result:\n{"level":3}\nHope that helps.';
  assert.deepEqual(parseJsonLoose(raw), { level: 3 });
});

test("recovers an array embedded in prose", () => {
  const raw = "Here you go: [{\"id\":\"a\"}] done";
  assert.deepEqual(parseJsonLoose(raw), [{ id: "a" }]);
});

test("throws when there is no JSON at all", () => {
  assert.throws(() => parseJsonLoose("no json here"));
});
