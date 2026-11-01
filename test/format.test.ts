import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDateLong, formatDateShort, formatIndianDate, hostOf } from "../src/lib/format";

test("formatDateLong renders the IST weekday and month", () => {
  const out = formatDateLong("2026-10-31");
  assert.match(out, /Saturday/);
  assert.match(out, /October/);
  assert.match(out, /2026/);
});

test("formatDateShort uses a compact form", () => {
  const out = formatDateShort("2026-10-31");
  assert.match(out, /31/);
  assert.match(out, /Oct/);
});

test("formatIndianDate is DD/MM/YYYY", () => {
  assert.equal(formatIndianDate("2026-10-31"), "31/10/2026");
});

test("hostOf strips www and handles bad input", () => {
  assert.equal(hostOf("https://www.thehindu.com/news/x"), "thehindu.com");
  assert.equal(hostOf("https://indianexpress.com/a"), "indianexpress.com");
  assert.equal(hostOf("not a url"), "source");
});
