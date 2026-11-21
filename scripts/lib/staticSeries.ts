// Daily generator for the Static Editorial series.
//
// The curriculum lives in config/staticSeries.ts; progress lives in
// data/static-series/progress.json. Each run picks the first lesson that has not
// been completed, asks the model for one long-form teacher's lesson, validates
// and sanitises it, writes src/content/static-lessons/<date>.json, then advances
// the progress file and rewrites the human-readable hand-off and tracker.
//
// Failure is never fatal to the edition: generate.ts catches it and keeps the
// current edition.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type {
  Reference,
  StaticLesson,
  StaticLessonBlock,
  StaticLessonExam,
  StaticLessonFigure,
  StaticLessonHandoff,
  StaticLessonSection,
  StaticSeriesProgress,
  StaticSeriesProgressEntry,
} from "../../src/lib/types";
import { CURRICULUM, SERIES_SUBJECTS, type SeriesLesson, type SeriesUnit } from "../../config/staticSeries";
import { chatJson, type ChatMessage } from "./llm";

export const STATIC_LESSONS_DIR = join("src", "content", "static-lessons");
export const STATIC_PROGRESS_FILE = join("data", "static-series", "progress.json");
export const STATIC_HANDOFF_FILE = join("docs", "static-series", "handoff.md");
export const STATIC_TRACKER_FILE = join("docs", "static-series", "progress.md");

export interface PlannedLesson {
  unit: SeriesUnit;
  lesson: SeriesLesson;
  // 1-based position inside the unit.
  lessonNumber: number;
  // 1-based position across the entire curriculum.
  seriesLessonNumber: number;
}

export function flattenPlan(curriculum: SeriesUnit[] = CURRICULUM): PlannedLesson[] {
  const out: PlannedLesson[] = [];
  for (const unit of curriculum) {
    unit.lessons.forEach((lesson, i) => {
      out.push({ unit, lesson, lessonNumber: i + 1, seriesLessonNumber: out.length + 1 });
    });
  }
  return out;
}

export function emptyProgress(): StaticSeriesProgress {
  return {
    version: 1,
    startedOn: null,
    updatedAt: new Date(0).toISOString(),
    completed: [],
    current: null,
    lastHandoff: null,
  };
}

export function readProgress(path: string): StaticSeriesProgress {
  if (!existsSync(path)) return emptyProgress();
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as Partial<StaticSeriesProgress>;
    if (parsed && parsed.version === 1 && Array.isArray(parsed.completed)) {
      return {
        version: 1,
        startedOn: typeof parsed.startedOn === "string" ? parsed.startedOn : null,
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString(),
        completed: parsed.completed.filter(
          (e): e is StaticSeriesProgressEntry =>
            Boolean(e && typeof e.lessonId === "string" && typeof e.unitId === "string" && typeof e.date === "string"),
        ),
        current: parsed.current && typeof parsed.current.lessonId === "string" ? parsed.current : null,
        lastHandoff: parsed.lastHandoff ?? null,
      };
    }
  } catch {
    /* fall through to a fresh progress file */
  }
  return emptyProgress();
}

export function writeProgress(path: string, progress: StaticSeriesProgress): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(progress, null, 2)}\n`, "utf8");
}

export function completedLessonIds(progress: StaticSeriesProgress): Set<string> {
  return new Set(progress.completed.map((entry) => entry.lessonId));
}

export function findNextLesson(
  progress: StaticSeriesProgress,
  curriculum: SeriesUnit[] = CURRICULUM,
): PlannedLesson | null {
  const done = completedLessonIds(progress);
  return flattenPlan(curriculum).find((item) => !done.has(item.lesson.id)) ?? null;
}

export function nextAfter(
  planned: PlannedLesson,
  progress: StaticSeriesProgress,
  curriculum: SeriesUnit[] = CURRICULUM,
): PlannedLesson | null {
  const flat = flattenPlan(curriculum);
  const done = completedLessonIds(progress);
  done.add(planned.lesson.id);
  return flat.find((item) => !done.has(item.lesson.id)) ?? null;
}

export function countCompleted(progress: StaticSeriesProgress): number {
  return progress.completed.length;
}

export function unitProgress(
  unit: SeriesUnit,
  progress: StaticSeriesProgress,
): { done: number; total: number; status: "done" | "started" | "not-started" } {
  const done = completedLessonIds(progress);
  const completed = unit.lessons.filter((lesson) => done.has(lesson.id)).length;
  return {
    done: completed,
    total: unit.lessons.length,
    status: completed === unit.lessons.length ? "done" : completed > 0 ? "started" : "not-started",
  };
}

// ---- Prompt -----------------------------------------------------------------

function referenceBlock(references: Reference[]): string {
  return references.map((r, i) => `[${i + 1}] ${r.label} — ${r.href} (${r.kind})`).join("\n");
}

function previousHandoffBlock(progress: StaticSeriesProgress): string {
  const h = progress.lastHandoff;
  if (!h) return "This is the first lesson. There is no previous hand-off.";
  return [
    `Previous lesson (${h.date}, ${h.lessonId}) ended with:`,
    `Covered: ${h.covered.join(" | ")}`,
    `Next (as promised): ${h.next}`,
    `Notes: ${h.notes}`,
  ].join("\n");
}

export function buildStaticLessonMessages(planned: PlannedLesson, progress: StaticSeriesProgress): ChatMessage[] {
  const { unit, lesson, lessonNumber, seriesLessonNumber } = planned;
  const next = nextAfter(planned, progress);
  const system = `You are a seasoned UPSC teacher and professor writing the daily "Static Editorial" for The Daily Brief.
You are not a summariser. You are a teacher with a blackboard: you explain patiently, narrate the idea as a story, use concrete analogies and Indian examples, and leave the student feeling that a difficult idea has become obvious.
Your reader is an eager, curious aspirant who is stepping into the syllabus for the first time and wants depth, not a bullet-point list.

NON-NEGOTIABLE RULES
- Teach exactly the assigned lesson scope. Do not wander into the next lesson; end with a short bridge to it.
- Ground every factual claim in the supplied standard sources, official material, or well-established textbook knowledge. Never invent dates, names, numbers, cases or quotations.
- This is a static-syllabus series. You may draw a current-affairs parallel only when it genuinely illuminates the concept.
- No plagiarism and no long excerpts. Explain in your own words.
- Be accurate, calm and vivid. Prefer a concrete example over an abstract definition.
- Return only the JSON object requested. No markdown fences, no commentary outside the JSON.`;

  const user = `Write Lesson ${seriesLessonNumber} of the Static Editorial series.

SERIES POSITION
- Subject: ${unit.subject}
- Paper: ${unit.paper}
- Unit: ${unit.title} (${unit.id}), lesson ${lessonNumber} of ${unit.lessons.length}
- Syllabus node: ${unit.syllabusNode}
- Unit's promise: ${unit.blurb}

THIS LESSON
- Title: ${lesson.title}
- Scope (teach all of this, and only this): ${lesson.scope}
- Questions the student must be able to answer afterwards:
${lesson.keyQuestions.map((q) => `  - ${q}`).join("\n")}
- Suggested visuals (use 1–3 of these; redesign freely if a clearer visual occurs to you):
${lesson.figureIdeas.length ? lesson.figureIdeas.map((f) => `  - ${f}`).join("\n") : "  - One diagram or map that makes the core idea visible."}

STANDARD SOURCES FOR THIS UNIT
${unit.sources.map((s) => `- ${s}`).join("\n")}

CONTINUITY
${previousHandoffBlock(progress)}
- Do not repeat the previous lesson. Begin by connecting to it in one sentence, then move on.
- The next lesson will be: ${next ? `${next.lesson.title} — ${next.lesson.scope}` : "the end of this unit; write a closing bridge."}

CURATED REFERENCES (choose from these only; never output a URL yourself)
${referenceBlock(unit.references)}

WRITING BRIEF
- Length: 1,800–2,600 words of actual teaching prose (not counting JSON keys). Take your time.
- Shape: a hook, 4–6 sections with headings, a short anecdote set apart, an exam-focus box, a 4–6 point recap, and a one-paragraph "next time" bridge.
- Voice: first person teacher ("Notice this…", "Here is the trick…", "Imagine you are standing…"). Warm, precise, occasionally witty. Never condescending.
- Each section: 2–4 paragraphs, roughly 80–160 words each. Vary sentence length. Use Indian examples, place names and map intuition.
- Include 1–3 figures. Each figure is an original inline SVG (a schematic map, cross-section, flow diagram or timeline). Keep it simple, legible and honest: label "not to scale" where needed. No external images, no scripts, no <foreignObject>, no event handlers, no external hrefs. Use viewBox and presentation attributes; colors may use CSS variables such as var(--ink), var(--muted), var(--accent), var(--rule), var(--paper-2).
- Put a figure into the prose with a block: {"type":"figure","figureId":"the-id"}.
- Cite references at section level using their bracketed numbers from the curated list, e.g. "refs": [1, 3]. Only use supplied numbers.
- Anecdote: one specific, true story or vivid historical scene that fixes the idea in memory. If you are not certain of a detail, keep the anecdote general rather than inventing it.
- Exam focus: 3–5 Prelims pointers, 1–2 Mains angles (actual answer-ready questions), and 5–8 key terms with one-line meanings.
- Handoff: write it for the next teacher, not the reader. Say exactly what was covered, what comes next, and any callback or figure worth reusing.

RETURN THIS JSON SHAPE
{
  "title": "string",
  "subtitle": "string — one line, like a magazine dek",
  "hook": "string — 2–4 sentences that make the reader want to continue",
  "sections": [
    {
      "heading": "string",
      "refs": [1, 2],
      "blocks": [
        {"type": "paragraph", "text": "string"},
        {"type": "heading", "text": "optional sub-heading", "level": 3},
        {"type": "callout", "title": "string", "text": "string", "tone": "note|exam|warning"},
        {"type": "list", "items": ["string"], "ordered": false},
        {"type": "quote", "text": "string", "attribution": "string"},
        {"type": "figure", "figureId": "string"}
      ]
    }
  ],
  "figures": [
    {
      "id": "string",
      "kind": "map|diagram|timeline|chart",
      "title": "string",
      "caption": "string — explain what to notice",
      "alt": "string — one sentence for screen readers",
      "credit": "Original diagram for The Daily Brief",
      "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 800 420\" role=\"img\" aria-label=\"...\">...</svg>"
    }
  ],
  "anecdote": {"title": "string", "body": "string — 80–160 words"},
  "exam": {
    "prelims": ["string"],
    "mains": ["string"],
    "keyTerms": [{"term": "string", "meaning": "string"}]
  },
  "recap": ["string"],
  "nextUp": "string — one paragraph teasing the next lesson",
  "handoff": {
    "covered": ["string"],
    "next": "string",
    "notes": "string"
  }
}

QUALITY BAR
A student should finish this lesson able to explain the idea to a friend, place it on a map, answer a Prelims question on it, and see how it connects to the rest of the syllabus.`;

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

// ---- Validation -------------------------------------------------------------

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function textOf(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (Array.isArray(value)) return value.map(textOf).filter(Boolean).join("\n\n");
  if (value && typeof value === "object") {
    const o = value as Record<string, unknown>;
    return textOf(o.text ?? o.body ?? o.content ?? o.paragraph ?? "");
  }
  return "";
}

export function sanitizeSvg(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  let svg = value.trim();
  if (!/^<svg[\s>]/i.test(svg)) return undefined;
  svg = svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<foreignObject[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(?:href|xlink:href)\s*=\s*("|')\s*(?:javascript:|data:text\/html)[^"']*\1/gi, "");
  if (/<(script|iframe|foreignObject)\b|javascript:|on(?:load|error|click|mouseover)\s*=/i.test(svg)) return undefined;
  if (svg.length > 60000) return undefined;
  return svg;
}

function normalizeBlocks(value: unknown): StaticLessonBlock[] {
  const out: StaticLessonBlock[] = [];
  const push = (block: StaticLessonBlock) => {
    if (block.type === "paragraph" && !block.text) return;
    if (block.type === "heading" && !block.text) return;
    if (block.type === "callout" && !block.text) return;
    if (block.type === "list" && block.items.length === 0) return;
    if (block.type === "quote" && !block.text) return;
    if (block.type === "figure" && !block.figureId) return;
    out.push(block);
  };
  const walk = (item: unknown) => {
    if (typeof item === "string") {
      const text = item.trim();
      if (text) push({ type: "paragraph", text });
      return;
    }
    if (Array.isArray(item)) {
      for (const child of item) walk(child);
      return;
    }
    if (!item || typeof item !== "object") return;
    const o = item as Record<string, unknown>;
    const type = asString(o.type || o.kind).toLowerCase();
    if (type === "figure" || o.figureId) {
      push({ type: "figure", figureId: asString(o.figureId ?? o.id) });
      return;
    }
    if (type === "heading" || type === "subheading") {
      push({ type: "heading", text: textOf(o.text ?? o.heading), level: o.level === 4 ? 4 : 3 });
      return;
    }
    if (type === "callout" || type === "box" || type === "note") {
      push({
        type: "callout",
        title: asString(o.title) || "Note",
        text: textOf(o.text ?? o.body ?? o.content),
        tone: ["note", "exam", "anecdote", "warning"].includes(asString(o.tone)) ? (o.tone as any) : "note",
      });
      return;
    }
    if (type === "list" || type === "bullets") {
      const items = Array.isArray(o.items) ? o.items.map(textOf).filter(Boolean) : [];
      push({ type: "list", items, ordered: Boolean(o.ordered) });
      return;
    }
    if (type === "quote") {
      push({ type: "quote", text: textOf(o.text ?? o.quote), attribution: asString(o.attribution) || undefined });
      return;
    }
    const text = textOf(o.text ?? o.body ?? o.content ?? o.paragraph);
    if (text) push({ type: "paragraph", text });
  };

  const raw = Array.isArray(value) ? value : value == null ? [] : [value];
  for (const item of raw) walk(item);
  return out;
}

function normalizeFigures(value: unknown): StaticLessonFigure[] {
  if (!Array.isArray(value)) return [];
  const out: StaticLessonFigure[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const id = asString(o.id);
    if (!id || seen.has(id)) continue;
    const svg = sanitizeSvg(o.svg);
    const kindText = asString(o.kind).toLowerCase();
    const kind = ["map", "diagram", "timeline", "chart"].includes(kindText)
      ? (kindText as StaticLessonFigure["kind"])
      : "diagram";
    out.push({
      id,
      kind,
      title: asString(o.title) || "Figure",
      caption: asString(o.caption),
      alt: asString(o.alt) || undefined,
      credit: asString(o.credit) || "Original diagram for The Daily Brief",
      svg,
    });
    seen.add(id);
  }
  return out;
}

function normalizeSections(value: unknown, referenceCount: number): StaticLessonSection[] {
  if (!Array.isArray(value)) return [];
  const out: StaticLessonSection[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const heading = asString(o.heading ?? o.title);
    const blocks = normalizeBlocks(o.blocks ?? o.body ?? o.paragraphs ?? o.content);
    if (!heading || !blocks.length) continue;
    const rawRefs = Array.isArray(o.refs) ? o.refs : [];
    const refs = [...new Set(rawRefs.filter((n): n is number => Number.isInteger(n) && n >= 1 && n <= referenceCount))];
    out.push({ heading, blocks, refs: refs.length ? refs : undefined });
  }
  return out;
}

function normalizeExam(value: unknown): StaticLessonExam {
  const o = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const list = (v: unknown) => (Array.isArray(v) ? v.map(textOf).filter(Boolean) : []);
  const termsRaw = Array.isArray(o.keyTerms) ? o.keyTerms : Array.isArray(o.key_terms) ? o.key_terms : [];
  const keyTerms = termsRaw
    .map((t) => {
      if (typeof t === "string") {
        const [term, ...rest] = t.split(/[—:–-]/);
        return { term: term.trim(), meaning: rest.join(" ").trim() };
      }
      if (t && typeof t === "object") {
        const r = t as Record<string, unknown>;
        return { term: asString(r.term ?? r.name), meaning: asString(r.meaning ?? r.definition) };
      }
      return null;
    })
    .filter((t): t is { term: string; meaning: string } => Boolean(t && t.term));
  return {
    prelims: list(o.prelims ?? o.prelimsPointers),
    mains: list(o.mains ?? o.mainsQuestions),
    keyTerms,
  };
}

function normalizeHandoff(value: unknown, fallback: StaticLessonHandoff): StaticLessonHandoff {
  if (!value || typeof value !== "object") return fallback;
  const o = value as Record<string, unknown>;
  const covered = Array.isArray(o.covered) ? o.covered.map(textOf).filter(Boolean) : [];
  return {
    covered: covered.length ? covered : fallback.covered,
    next: asString(o.next) || fallback.next,
    notes: asString(o.notes) || fallback.notes,
  };
}

function wordCount(value: unknown): number {
  const text = typeof value === "string" ? value : (JSON.stringify(value) ?? "");
  return (text.match(/\S+/g) ?? []).length;
}

function countLessonWords(lesson: Partial<StaticLesson>): number {
  return [
    lesson.title,
    lesson.subtitle,
    lesson.hook,
    lesson.sections,
    lesson.anecdote,
    lesson.exam,
    lesson.recap,
    lesson.nextUp,
  ].reduce((sum, part) => sum + wordCount(part), 0);
}

export interface NormalizeLessonContext {
  date: string;
  planned: PlannedLesson;
  references: Reference[];
}

export function normalizeStaticLesson(raw: unknown, ctx: NormalizeLessonContext): StaticLesson | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const title = asString(o.title);
  const hook = textOf(o.hook ?? o.intro ?? o.opening);
  const sections = normalizeSections(o.sections ?? o.body ?? o.lesson, ctx.references.length);
  if (!title || !hook || sections.length < 3) return null;

  const figures = normalizeFigures(o.figures);
  const figureIds = new Set(figures.map((f) => f.id));
  for (const section of sections) {
    section.blocks = section.blocks.filter((b) => b.type !== "figure" || figureIds.has(b.figureId));
  }

  const next = ctx.planned;
  const fallbackHandoff: StaticLessonHandoff = {
    covered: sections.map((s) => s.heading),
    next: "Continue with the next planned lesson.",
    notes: `Lesson ${next.lessonNumber} of ${next.unit.title}; scope: ${next.lesson.scope}`,
  };
  const handoff = normalizeHandoff(o.handoff, fallbackHandoff);
  const anecdoteRaw = o.anecdote;
  const anecdote =
    anecdoteRaw && typeof anecdoteRaw === "object"
      ? {
          title: asString((anecdoteRaw as Record<string, unknown>).title) || "A teacher's aside",
          body: textOf((anecdoteRaw as Record<string, unknown>).body ?? (anecdoteRaw as Record<string, unknown>).text),
        }
      : typeof anecdoteRaw === "string" && anecdoteRaw.trim()
        ? { title: "A teacher's aside", body: anecdoteRaw.trim() }
        : undefined;

  const lesson: StaticLesson = {
    date: ctx.date,
    generatedAt: new Date().toISOString(),
    title,
    subtitle: asString(o.subtitle) || ctx.planned.lesson.title,
    readMinutes: 0,
    hook,
    sections,
    figures,
    anecdote: anecdote?.body ? anecdote : undefined,
    exam: (() => {
      const exam = normalizeExam(o.exam);
      if (!exam.prelims.length) exam.prelims = ctx.planned.lesson.keyQuestions;
      return exam;
    })(),
    recap: Array.isArray(o.recap) && o.recap.map(textOf).filter(Boolean).length
      ? o.recap.map(textOf).filter(Boolean)
      : sections.map((s) => s.heading),
    nextUp: asString(o.nextUp) || `Next time: ${next.lesson.title}.`,
    references: ctx.references,
    series: {
      subject: ctx.planned.unit.subject,
      subjectKey: ctx.planned.unit.subjectKey,
      paper: ctx.planned.unit.paper,
      unitId: ctx.planned.unit.id,
      unitTitle: ctx.planned.unit.title,
      lessonId: ctx.planned.lesson.id,
      lessonNumber: ctx.planned.lessonNumber,
      lessonCount: ctx.planned.unit.lessons.length,
      seriesLessonNumber: ctx.planned.seriesLessonNumber,
      syllabusNode: ctx.planned.unit.syllabusNode,
    },
    handoff,
  };
  lesson.readMinutes = Math.max(4, Math.round(countLessonWords(lesson) / 220));
  return lesson;
}

// ---- Writing ----------------------------------------------------------------

export interface GenerateStaticLessonOptions {
  root: string;
  date: string;
  // Regenerate even if a lesson file already exists for this date.
  force?: boolean;
  lessonsDir?: string;
  progressFile?: string;
  handoffFile?: string;
  trackerFile?: string;
}

export async function generateStaticLesson(opts: GenerateStaticLessonOptions): Promise<StaticLesson | null> {
  const lessonsDir = join(opts.root, opts.lessonsDir ?? STATIC_LESSONS_DIR);
  const progressFile = join(opts.root, opts.progressFile ?? STATIC_PROGRESS_FILE);
  const handoffFile = join(opts.root, opts.handoffFile ?? STATIC_HANDOFF_FILE);
  const trackerFile = join(opts.root, opts.trackerFile ?? STATIC_TRACKER_FILE);
  const lessonFile = join(lessonsDir, `${opts.date}.json`);

  if (existsSync(lessonFile) && !opts.force) {
    // A rerun of the same day's edition must not advance the series twice.
    writeTracker(trackerFile, readProgress(progressFile));
    return null;
  }

  const progress = readProgress(progressFile);
  const planned = findNextLesson(progress);
  if (!planned) {
    writeHandoff(handoffFile, progress, null, null);
    writeTracker(trackerFile, progress);
    return null;
  }

  const raw = await chatJson<unknown>(buildStaticLessonMessages(planned, progress));
  const lesson = normalizeStaticLesson(raw, {
    date: opts.date,
    planned,
    references: planned.unit.references,
  });
  if (!lesson) {
    console.warn("   ⚠ static lesson payload unusable; series did not advance");
    return null;
  }

  mkdirSync(lessonsDir, { recursive: true });
  writeFileSync(lessonFile, `${JSON.stringify(lesson, null, 2)}\n`, "utf8");

  const updated: StaticSeriesProgress = {
    version: 1,
    startedOn: progress.startedOn ?? opts.date,
    updatedAt: new Date().toISOString(),
    completed: [...progress.completed, { lessonId: planned.lesson.id, unitId: planned.unit.id, date: opts.date }],
    current: null,
    lastHandoff: {
      date: opts.date,
      lessonId: planned.lesson.id,
      covered: lesson.handoff.covered,
      next: lesson.handoff.next,
      notes: lesson.handoff.notes,
    },
  };
  const next = findNextLesson(updated);
  updated.current = next ? { unitId: next.unit.id, lessonId: next.lesson.id } : null;

  writeProgress(progressFile, updated);
  writeHandoff(handoffFile, updated, planned, lesson);
  writeTracker(trackerFile, updated);
  return lesson;
}

function writeHandoff(
  path: string,
  progress: StaticSeriesProgress,
  planned: PlannedLesson | null,
  lesson: StaticLesson | null,
): void {
  const next = findNextLesson(progress);
  const total = flattenPlan().length;
  const done = countCompleted(progress);
  const lines: string[] = [
    "# Static Editorial — hand-off",
    "",
    "> Generated by `scripts/lib/staticSeries.ts` after every lesson. Do not hand-edit:",
    "> it is the context the next day's teacher reads first.",
    "",
    `Last updated: ${progress.updatedAt}`,
    `Progress: ${done} of ${total} lessons complete.`,
    "",
  ];
  if (planned && lesson) {
    lines.push(
      "## Last lesson",
      "",
      `- **Date:** ${lesson.date}`,
      `- **Lesson:** ${lesson.title}`,
      `- **ID:** \`${lesson.series.lessonId}\` (${lesson.series.subject}, ${lesson.series.paper})`,
      `- **Unit:** ${lesson.series.unitTitle} — lesson ${lesson.series.lessonNumber} of ${lesson.series.lessonCount}`,
      `- **Syllabus node:** ${lesson.series.syllabusNode}`,
      "",
      "## What was covered",
      "",
      ...lesson.handoff.covered.map((c) => `- ${c}`),
      "",
      "## Notes for the next teacher",
      "",
      lesson.handoff.notes,
      "",
    );
  } else {
    lines.push("## Last lesson", "");
    if (progress.lastHandoff) {
      const lastPlanned = flattenPlan().find((p) => p.lesson.id === progress.lastHandoff!.lessonId);
      lines.push(
        `- **Date:** ${progress.lastHandoff.date}`,
        `- **Lesson:** ${lastPlanned?.lesson.title ?? progress.lastHandoff.lessonId}`,
        `- **ID:** \`${progress.lastHandoff.lessonId}\``,
        ...(lastPlanned
          ? [
              `- **Unit:** ${lastPlanned.unit.title} — lesson ${lastPlanned.lessonNumber} of ${lastPlanned.unit.lessons.length}`,
              `- **Subject / paper:** ${lastPlanned.unit.subject} / ${lastPlanned.unit.paper}`,
              `- **Syllabus node:** ${lastPlanned.unit.syllabusNode}`,
            ]
          : []),
        "",
        "## What was covered",
        "",
        ...progress.lastHandoff.covered.map((c) => `- ${c}`),
        "",
        "## Notes for the next teacher",
        "",
        progress.lastHandoff.notes,
        "",
      );
    } else {
      lines.push("No lesson has been generated yet.", "");
    }
  }

  lines.push("## Next lesson (pick up here)", "");
  if (next) {
    lines.push(
      `- **Lesson:** ${next.lesson.title}`,
      `- **ID:** \`${next.lesson.id}\``,
      `- **Unit:** ${next.unit.title} — lesson ${next.lessonNumber} of ${next.unit.lessons.length}`,
      `- **Subject / paper:** ${next.unit.subject} / ${next.unit.paper}`,
      `- **Syllabus node:** ${next.unit.syllabusNode}`,
      `- **Scope:** ${next.lesson.scope}`,
      `- **Sources:** ${next.unit.sources.join("; ")}`,
      "",
      "## Bridge to use",
      "",
      progress.lastHandoff?.next || lesson?.handoff.next || next.lesson.scope,
      "",
    );
  } else {
    lines.push("All planned lessons are complete. Add a new unit to `config/staticSeries.ts`.", "");
  }

  lines.push(
    "## How to continue",
    "",
    "1. Open `docs/static-series-plan.md` for the teacher's charter and style rules.",
    "2. Read `config/staticSeries.ts` for the exact lesson scope and sources.",
    "3. Run `npm run generate` — the generator picks the next incomplete lesson automatically.",
    "4. Do not edit `data/static-series/progress.json` by hand unless you are deliberately resetting or backfilling.",
    "",
  );
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"), "utf8");
}

function writeTracker(path: string, progress: StaticSeriesProgress): void {
  const done = completedLessonIds(progress);
  const next = findNextLesson(progress);
  const total = flattenPlan().length;
  const completed = countCompleted(progress);
  const lines: string[] = [
    "# Static Editorial — curriculum tracker",
    "",
    "> Generated from `config/staticSeries.ts` and `data/static-series/progress.json`.",
    "> The plan is the source of truth; this page is a reading aid.",
    "",
    `**Progress:** ${completed} / ${total} lessons complete.`,
    next
      ? `**Next up:** ${next.lesson.title} (\`${next.lesson.id}\`) — ${next.unit.subject}, lesson ${next.lessonNumber} of ${next.unit.lessons.length}.`
      : "**Next up:** all planned lessons complete.",
    "",
    "## Subjects",
    "",
    ...SERIES_SUBJECTS.map((s) => {
      const units = CURRICULUM.filter((u) => u.subjectKey === s.key);
      const lessons = units.reduce((n, u) => n + u.lessons.length, 0);
      const finished = units.reduce((n, u) => n + u.lessons.filter((l) => done.has(l.id)).length, 0);
      return `- **${s.title}** — ${finished}/${lessons} lessons (${units.length} unit${units.length === 1 ? "" : "s"})`;
    }),
    "",
  ];

  for (const subject of SERIES_SUBJECTS) {
    const units = CURRICULUM.filter((u) => u.subjectKey === subject.key);
    if (!units.length) continue;
    lines.push(`## ${subject.title}`, "");
    for (const unit of units) {
      const up = unitProgress(unit, progress);
      const marker = up.status === "done" ? "✓ complete" : up.status === "started" ? "in progress" : "not started";
      lines.push(`### ${unit.title} — ${up.done}/${up.total} · ${marker}`, "", `_${unit.syllabusNode}_`, "");
      for (const lesson of unit.lessons) {
        const entry = progress.completed.find((e) => e.lessonId === lesson.id);
        const isNext = next?.lesson.id === lesson.id;
        const box = entry ? "[x]" : "[ ]";
        const suffix = entry ? ` — ${entry.date}` : isNext ? " — **next**" : "";
        lines.push(`- ${box} ${lesson.title} (\`${lesson.id}\`)${suffix}`);
      }
      lines.push("");
    }
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, lines.join("\n"), "utf8");
}

// Regenerate the human-readable hand-off and tracker from the current progress
// file. Useful after a manual reset, a backfill, or a seed commit.
export function syncStaticSeriesDocs(root: string): void {
  const progress = readProgress(join(root, STATIC_PROGRESS_FILE));
  writeHandoff(join(root, STATIC_HANDOFF_FILE), progress, null, null);
  writeTracker(join(root, STATIC_TRACKER_FILE), progress);
}