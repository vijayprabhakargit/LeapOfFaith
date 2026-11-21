// Daily UPSC Prelims-style quiz generator.
//
// The quiz is generated from the editions already on disk: the last N days of
// briefs (default 7) are compacted into a prompt, the model writes 10 MCQs in
// the classic UPSC patterns, and the result is validated/deduped before being
// written to src/content/quizzes/<date>.json.
//
// The quiz is deliberately static: the site renders the questions and keeps the
// score in the browser session only. Nothing here stores a user's answers.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { Edition, Quiz, QuizQuestion } from "../../src/lib/types";
import { chatJson, type ChatMessage } from "./llm";

export const QUIZ_WINDOW_DAYS = 7;
export const QUIZ_MAX_QUESTIONS = 10;

const SYSTEM_PROMPT = `You are a UPSC Civil Services Prelims examiner with 20 years of experience.
You write exam-realistic GS Paper I multiple-choice questions grounded strictly in the supplied news briefs.
You never invent facts, names, dates or numbers.
You know the real paper's design: roughly half the questions are statement-based, about a third are direct factual,
and the rest are matching, assertion-reason, how-many and scenario questions. Polity and Economy together are
about 45% of the paper. Absolute words ("always", "only", "never"), entity swaps, partial truths and
constitutional-vs-statutory confusion are the standard traps.`;

function userPrompt(context: string, avoid: string[]): string {
  const avoidBlock = avoid.length
    ? `\n\nAVOID — already asked in the last ${QUIZ_WINDOW_DAYS} days. Do not repeat or closely paraphrase:\n${avoid.map((q) => `- ${q}`).join("\n")}`
    : "";
  return `Write a ${QUIZ_MAX_QUESTIONS}-question UPSC Prelims GS Paper I quiz from the briefs below.

QUESTION BLUEPRINT (follow it closely; substitute the nearest available subject if a brief is thin):
1. Polity — statement-based "Which of the following statements is/are correct?" with 3 statements and combination options.
2. Economy — statement-based "Which of the following statements is/are correct?" with 2-3 statements.
3. Environment — "How many of the above statements are correct?" with 3 statements and options Only one / Only two / All three / None.
4. Geography — direct factual single-answer.
5. History/Culture — matching pairs ("Consider the following pairs... How many of the above pairs are correctly matched?").
6. Science & Technology — assertion-reason using Statement-I and Statement-II.
7. International Relations — direct factual single-answer.
8. Polity or Economy — "Which of the following statements is/are NOT correct?" with 3 statements.
9. Current affairs + static link — a scenario or applied question.
10. Mixed — direct factual or conceptual.

FORMAT RULES
- Statement-based: 2-4 numbered statements; options are combinations such as "1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3". Use "Select the correct answer using the code given below".
- How-many: 3 numbered statements; options "Only one", "Only two", "All three", "None".
- Assertion-reason: "Statement-I: ... Statement-II: ... Which one of the following is correct in respect of the above statements?" Options: (a) Both Statement-I and Statement-II are correct and Statement-II explains Statement-I; (b) Both are correct but Statement-II does not explain Statement-I; (c) Statement-I is correct but Statement-II is incorrect; (d) Statement-I is incorrect but Statement-II is correct.
- Matching pairs: "Consider the following pairs: ... How many of the above pairs are correctly matched?" Options "Only one", "Only two", "All three", "None".
- Direct factual: one clear question with four plausible, same-length options.
- "NOT correct" questions: three statements; ask which is/are NOT correct; options are combinations.
- Avoid "all of the above" and "none of the above" as standalone options. Use "None" only in how-many/matching options.
- Spread the correct answer across A, B, C and D. Do not cluster on one letter.
- Use the standard UPSC traps: absolute words, entity swaps, partial truths, constitutional-vs-statutory confusion, current-affairs headline traps. Do not make every statement false or every statement true.

CONTENT RULES
- Ground every question in the supplied briefs. You may use well-established static GS knowledge for the static/GS questions, but the current-affairs questions must come from the briefs.
- Roughly 25% Polity, 20% Economy, 15% Environment, 15% Geography, 10% History/Culture, 10% Science & Technology, 5% IR. Polity and Economy together should be about 45%.
- About a quarter of the questions should be current affairs; the rest should be static/GS linked to the news.
- Each explanation must be 1-3 sentences, state why the correct option is right and, where useful, why the main trap is wrong. Cite the relevant news or concept.
- Topic must be one of: Polity & Governance, Economy, Environment & Ecology, Geography, History & Culture, Science & Technology, International Relations, Society & Social Justice, Agriculture.

Return STRICT JSON:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "answer": 0,
      "explanation": "string",
      "topic": "string"
    }
  ]
}

BRIEFS
${context}${avoidBlock}`;
}

// Read the editions for the `days`-day window ending on `endDate` (inclusive).
// Missing days are skipped so a backfill or a skipped workflow run still works.
export function readRecentEditions(editionsDir: string, endDate: string, days = QUIZ_WINDOW_DAYS): Edition[] {
  const end = new Date(`${endDate}T00:00:00Z`);
  if (Number.isNaN(end.getTime())) return [];
  const start = new Date(end.getTime() - (days - 1) * 86_400_000);
  const out: Edition[] = [];
  for (let t = start.getTime(); t <= end.getTime(); t += 86_400_000) {
    const date = new Date(t).toISOString().slice(0, 10);
    const file = join(editionsDir, `${date}.json`);
    if (!existsSync(file)) continue;
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8")) as Edition;
      if (parsed && parsed.date === date && Array.isArray(parsed.stories)) out.push(parsed);
    } catch {
      /* ignore a corrupt edition file */
    }
  }
  return out;
}

// Question texts from the previous `days` quizzes, so the model can avoid them.
export function readPreviousQuestions(quizzesDir: string, beforeDate: string, days = QUIZ_WINDOW_DAYS): string[] {
  const end = new Date(`${beforeDate}T00:00:00Z`);
  if (Number.isNaN(end.getTime())) return [];
  const out: string[] = [];
  for (let i = 1; i <= days; i++) {
    const date = new Date(end.getTime() - i * 86_400_000).toISOString().slice(0, 10);
    const file = join(quizzesDir, `${date}.json`);
    if (!existsSync(file)) continue;
    try {
      const parsed = JSON.parse(readFileSync(file, "utf8")) as Quiz;
      for (const q of parsed.questions ?? []) {
        if (typeof q.question === "string" && q.question.trim()) out.push(q.question.trim());
      }
    } catch {
      /* ignore a corrupt quiz file */
    }
  }
  return out;
}

// Compact the editions into a prompt-sized context. Only the top stories per
// edition are included (the generator already orders stories by importance),
// and long summaries are truncated. The static links and prelims pointers are
// kept because they are the grounding for the GS questions.
export function buildQuizContext(editions: Edition[], maxStoriesPerEdition = 8): string {
  const parts: string[] = [];
  for (const ed of editions) {
    const stories = ed.stories.slice(0, maxStoriesPerEdition);
    const lines = stories.map((s) => {
      const summary = s.summary.length > 240 ? `${s.summary.slice(0, 237)}…` : s.summary;
      const prelims = (s.prelims ?? []).slice(0, 3).join(" | ");
      const statics = (s.static ?? []).slice(0, 2).map((st) => st.topic).join(" | ");
      const bits = [
        `- [${s.category}] ${s.headline}`,
        `  ${summary}`,
        prelims ? `  Prelims: ${prelims}` : "",
        statics ? `  Static: ${statics}` : "",
      ].filter(Boolean);
      return bits.join("\n");
    });
    parts.push(`### ${ed.date}\nBrief: ${(ed.brief ?? []).join(" ")}\n${lines.join("\n")}`);
  }
  return parts.join("\n\n");
}

export function normalizeQuestionText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// Drop questions already asked in the avoid list and duplicates inside the new
// set. The first occurrence wins.
export function dedupeQuestions(questions: QuizQuestion[], avoid: string[]): QuizQuestion[] {
  const seen = new Set(avoid.map(normalizeQuestionText).filter(Boolean));
  const out: QuizQuestion[] = [];
  for (const q of questions) {
    const key = normalizeQuestionText(q.question);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

// Accepts "A"/"B"/"C"/"D", "0".."3", and integer 0..3. Returns null otherwise.
export function coerceAnswer(value: unknown): number | null {
  if (typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3) return value;
  if (typeof value === "string") {
    const trimmed = value.trim().toUpperCase();
    const letter = { A: 0, B: 1, C: 2, D: 3 }[trimmed as "A" | "B" | "C" | "D"];
    if (letter !== undefined) return letter;
    const n = Number(trimmed);
    if (Number.isInteger(n) && n >= 0 && n <= 3) return n;
  }
  return null;
}

function cleanOptions(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const options = value
    .filter((o): o is string => typeof o === "string")
    .map((o) => o.trim())
    .filter(Boolean);
  if (options.length !== 4) return null;
  return options;
}

export interface NormalizeQuizOptions {
  date: string;
  windowStart: string;
  windowEnd: string;
  avoid?: string[];
  maxQuestions?: number;
}

// Validate the model's payload. Invalid questions are dropped rather than
// failing the whole quiz; if nothing usable remains, returns null.
export function normalizeQuiz(raw: unknown, opts: NormalizeQuizOptions): Quiz | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const list = (raw as { questions?: unknown }).questions;
  if (!Array.isArray(list)) return null;

  const questions: QuizQuestion[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object" || Array.isArray(item)) continue;
    const r = item as Record<string, unknown>;
    const question = typeof r.question === "string" ? r.question.trim() : "";
    const options = cleanOptions(r.options);
    const answer = coerceAnswer(r.answer);
    if (!question || !options || answer === null) continue;
    const explanation = typeof r.explanation === "string" ? r.explanation.trim() : "";
    const topic = typeof r.topic === "string" && r.topic.trim() ? r.topic.trim() : "Current Affairs";
    questions.push({
      id: questions.length + 1,
      question,
      options,
      answer,
      explanation,
      topic,
    });
  }

  const deduped = dedupeQuestions(questions, opts.avoid ?? []);
  const capped = deduped.slice(0, opts.maxQuestions ?? QUIZ_MAX_QUESTIONS);
  if (!capped.length) return null;
  // Re-number after dedupe/cap so ids stay contiguous.
  capped.forEach((q, i) => {
    q.id = i + 1;
  });

  return {
    date: opts.date,
    generatedAt: new Date().toISOString(),
    title: "Daily Prelims Quiz",
    windowStart: opts.windowStart,
    windowEnd: opts.windowEnd,
    questions: capped,
  };
}

export interface GenerateQuizOptions {
  date: string;
  editionsDir: string;
  quizzesDir: string;
  windowDays?: number;
  maxQuestions?: number;
}

// Read the window, build the prompt, call the model, validate. Returns null when
// there is nothing to quiz on or the model produced no usable questions.
export async function generateQuiz(opts: GenerateQuizOptions): Promise<Quiz | null> {
  const days = opts.windowDays ?? QUIZ_WINDOW_DAYS;
  const editions = readRecentEditions(opts.editionsDir, opts.date, days);
  if (!editions.length) return null;

  const avoid = readPreviousQuestions(opts.quizzesDir, opts.date, days);
  const context = buildQuizContext(editions);
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userPrompt(context, avoid) },
  ];

  const raw = await chatJson<unknown>(messages);
  return normalizeQuiz(raw, {
    date: opts.date,
    windowStart: editions[0].date,
    windowEnd: editions[editions.length - 1].date,
    avoid,
    maxQuestions: opts.maxQuestions ?? QUIZ_MAX_QUESTIONS,
  });
}
