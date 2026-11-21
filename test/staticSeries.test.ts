import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CURRICULUM, SERIES_SUBJECTS } from "../config/staticSeries";
import {
  buildStaticLessonMessages,
  emptyProgress,
  findNextLesson,
  flattenPlan,
  nextAfter,
  normalizeStaticLesson,
  sanitizeSvg,
  unitProgress,
} from "../scripts/lib/staticSeries";
import type { StaticSeriesProgress } from "../src/lib/types";

test("the static plan has unique unit and lesson ids", () => {
  const unitIds = CURRICULUM.map((u) => u.id);
  assert.equal(new Set(unitIds).size, unitIds.length, "duplicate unit id");
  const lessonIds = flattenPlan().map((p) => p.lesson.id);
  assert.equal(new Set(lessonIds).size, lessonIds.length, "duplicate lesson id");
});

test("every subject in the metadata has at least one unit", () => {
  for (const subject of SERIES_SUBJECTS) {
    assert.ok(
      CURRICULUM.some((u) => u.subjectKey === subject.key),
      `${subject.key} has no units`,
    );
  }
});

test("the first unit is geography, as the series promises", () => {
  const first = flattenPlan()[0];
  assert.equal(first.unit.subjectKey, "geography");
  assert.equal(first.lesson.id, "geo-foundations-1");
});

test("every unit is well-formed", () => {
  for (const unit of CURRICULUM) {
    assert.ok(unit.title.length > 3, `${unit.id} has no title`);
    assert.ok(unit.syllabusNode.length > 8, `${unit.id} has no syllabus node`);
    assert.ok(unit.sources.length > 0, `${unit.id} has no sources`);
    assert.ok(unit.lessons.length > 0, `${unit.id} has no lessons`);
    assert.ok(unit.references.length > 0, `${unit.id} has no references`);
    for (const ref of unit.references) {
      assert.match(ref.href, /^https:\/\//, `${unit.id} has a non-https reference`);
      assert.ok(["official", "wiki", "report", "book"].includes(ref.kind), `${unit.id} has an unknown ref kind`);
    }
    for (const lesson of unit.lessons) {
      assert.ok(lesson.title.length > 3, `${lesson.id} has no title`);
      assert.ok(lesson.scope.length > 20, `${lesson.id} has a thin scope`);
      assert.ok(lesson.keyQuestions.length > 0, `${lesson.id} has no key questions`);
    }
  }
});

test("findNextLesson walks the plan in order", () => {
  const flat = flattenPlan();
  assert.equal(findNextLesson(emptyProgress())?.lesson.id, flat[0].lesson.id);

  const progress: StaticSeriesProgress = {
    ...emptyProgress(),
    completed: [{ lessonId: flat[0].lesson.id, unitId: flat[0].unit.id, date: "2026-11-21" }],
  };
  assert.equal(findNextLesson(progress)?.lesson.id, flat[1].lesson.id);

  const allDone: StaticSeriesProgress = {
    ...emptyProgress(),
    completed: flat.map((p) => ({ lessonId: p.lesson.id, unitId: p.unit.id, date: "2026-11-21" })),
  };
  assert.equal(findNextLesson(allDone), null);
});

test("nextAfter skips the current lesson even before progress is written", () => {
  const flat = flattenPlan();
  assert.equal(nextAfter(flat[0], emptyProgress())?.lesson.id, flat[1].lesson.id);
});

test("unitProgress reports done, started and not-started", () => {
  const unit = CURRICULUM[0];
  const base = emptyProgress();
  assert.equal(unitProgress(unit, base).status, "not-started");

  const started: StaticSeriesProgress = {
    ...base,
    completed: [{ lessonId: unit.lessons[0].id, unitId: unit.id, date: "2026-11-21" }],
  };
  assert.equal(unitProgress(unit, started).status, "started");

  const done: StaticSeriesProgress = {
    ...base,
    completed: unit.lessons.map((l) => ({ lessonId: l.id, unitId: unit.id, date: "2026-11-21" })),
  };
  assert.equal(unitProgress(unit, done).status, "done");
});

test("the prompt includes the exact scope, sources and next lesson", () => {
  const planned = flattenPlan()[0];
  const messages = buildStaticLessonMessages(planned, emptyProgress());
  const user = messages.find((m) => m.role === "user")?.content ?? "";
  assert.match(user, /Latitude and longitude/); // the *next* lesson's scope
  assert.match(user, /The World Before the Map/);
  assert.match(user, /NCERT Class XI/);
  assert.match(user, /never output a URL/i);
});

test("sanitizeSvg rejects unsafe markup and strips event handlers", () => {
  assert.equal(sanitizeSvg("not an svg"), undefined);
  const dirty =
    '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect width="10" height="10" onload="alert(1)" /></svg>';
  const clean = sanitizeSvg(dirty);
  assert.ok(clean);
  assert.ok(!/script/i.test(clean!));
  assert.ok(!/onload/i.test(clean!));
});

test("normalizeStaticLesson validates, clamps citations and copies curated references", () => {
  const planned = flattenPlan()[0];
  const references = planned.unit.references;
  const raw = {
    title: "A test lesson",
    subtitle: "Testing the normaliser",
    hook: "A hook long enough to be useful to a reader who is about to learn something.",
    sections: [
      { heading: "One", refs: [1, 99], blocks: [{ type: "paragraph", text: "First paragraph." }] },
      { heading: "Two", blocks: [{ type: "paragraph", text: "Second paragraph." }] },
      { heading: "Three", blocks: [{ type: "figure", figureId: "missing" }, { type: "list", items: ["a", "b"] }] },
    ],
    figures: [
      {
        id: "f1",
        kind: "diagram",
        title: "A figure",
        caption: "What to notice",
        svg: '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" onload="x()" /></svg>',
      },
    ],
    exam: { prelims: ["p"], mains: ["m"], keyTerms: [{ term: "t", meaning: "m" }] },
    recap: ["r"],
    nextUp: "Next.",
    handoff: { covered: ["One"], next: "Two", notes: "Note" },
  };

  const lesson = normalizeStaticLesson(raw, { date: "2026-11-21", planned, references });
  assert.ok(lesson);
  assert.equal(lesson!.series.lessonId, planned.lesson.id);
  assert.deepEqual(lesson!.sections[0].refs, [1]);
  assert.equal(lesson!.references.length, references.length);
  assert.ok(lesson!.figures[0].svg);
  assert.ok(!/onload/i.test(lesson!.figures[0].svg!));
  // The figure block points at a missing figure and should be dropped.
  assert.ok(!lesson!.sections[2].blocks.some((b) => b.type === "figure"));
  assert.ok(lesson!.readMinutes >= 4);
});

test("the seeded lesson matches the plan and uses only curated references", () => {
  const lesson = JSON.parse(
    readFileSync(join(process.cwd(), "src", "content", "static-lessons", "2026-11-21.json"), "utf8"),
  ) as {
    series: { lessonId: string };
    references: { href: string }[];
  };
  const planned = flattenPlan().find((p) => p.lesson.id === lesson.series.lessonId);
  assert.ok(planned, "seeded lesson is not in the plan");
  const allowed = new Set(planned!.unit.references.map((r) => r.href));
  for (const ref of lesson.references) {
    assert.ok(allowed.has(ref.href), `seed lesson cites an uncurated reference: ${ref.href}`);
  }
});