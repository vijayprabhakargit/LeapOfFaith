import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAllEditions,
  getLatestEdition,
  getEdition,
  getEditionDates,
  getArchiveByMonth,
} from "../src/lib/editions";

test("getAllEditions loads the seed edition and sorts newest first", () => {
  const editions = getAllEditions();
  assert.ok(editions.length >= 1);
  for (let i = 1; i < editions.length; i++) {
    assert.ok(editions[i - 1].date >= editions[i].date, "editions not sorted desc");
  }
});

test("getLatestEdition returns the newest edition", () => {
  const latest = getLatestEdition();
  assert.ok(latest);
  assert.equal(latest!.date, getAllEditions()[0].date);
});

test("getEdition finds a known date and misses cleanly", () => {
  const dates = getEditionDates();
  assert.ok(dates.length >= 1);
  assert.ok(getEdition(dates[0]));
  assert.equal(getEdition("1900-01-01"), null);
});

test("getArchiveByMonth groups editions under their month", () => {
  const months = getArchiveByMonth();
  assert.ok(months.length >= 1);
  for (const m of months) {
    assert.match(m.month, /^\d{4}-\d{2}$/);
    assert.ok(m.label.length > 0);
    for (const e of m.editions) assert.equal(e.date.slice(0, 7), m.month);
  }
});

test("seed edition has the expected shape", () => {
  const edition = getAllEditions().find((e) => e.date === "2026-10-31") ?? getAllEditions()[0];
  assert.ok(edition.stories.length > 0);
  assert.ok(Array.isArray(edition.brief));
  assert.ok(Array.isArray(edition.onThisDay));
  const story = edition.stories[0];
  assert.ok(story.headline);
  assert.ok(story.summary);
  assert.ok(Array.isArray(story.perspectives));
  assert.ok(Array.isArray(story.static));
  assert.equal(typeof story.importance, "number");
});
