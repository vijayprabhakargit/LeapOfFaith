import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  normalizeQuestionText,
  coerceAnswer,
  dedupeQuestions,
  normalizeQuiz,
  buildQuizContext,
  readRecentEditions,
  readPreviousQuestions,
  resolveQuizCount,
  QUIZ_MIN_QUESTIONS,
  QUIZ_MAX_QUESTIONS,
  QUIZ_DEFAULT_QUESTIONS,
} from "../scripts/lib/quiz";
import type { Edition, Quiz, QuizQuestion } from "../src/lib/types";

function makeQuestion(overrides: Partial<QuizQuestion> = {}): QuizQuestion {
  return {
    id: 1,
    question: "Which of the following statements is/are correct?",
    options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
    answer: 0,
    explanation: "Only statements 1 and 2 are correct.",
    topic: "Polity & Governance",
    ...overrides,
  };
}

function makeEdition(date: string, overrides: Partial<Edition> = {}): Edition {
  return {
    date,
    generatedAt: `${date}T06:00:00.000Z`,
    windowStart: `${date}T00:00:00.000Z`,
    windowEnd: `${date}T23:59:59.000Z`,
    stats: { feeds: 1, articles: 1, stories: 1 },
    brief: [`Brief for ${date}.`],
    stories: [
      {
        id: "s1",
        slug: `headline-${date}`,
        headline: `Headline for ${date}`,
        kicker: "Kicker",
        category: "Polity & Governance",
        region: "india",
        importance: 1,
        signal: "must-read",
        summary: "A summary long enough to be useful for the quiz generator.",
        whyItMatters: "Why it matters.",
        perspectives: [],
        articles: [],
        static: [
          {
            topic: "Fundamental Rights",
            paper: "GS-II",
            syllabusNode: "Polity",
            whatIsIt: "Rights",
            background: "Background",
            whyInNews: "In the news",
            keyTerms: ["Article 14"],
          },
        ],
        prelims: ["Prelims pointer"],
        mainsQuestion: "Mains question?",
        tags: ["polity"],
        readMinutes: 4,
      },
    ],
    onThisDay: [],
    ...overrides,
  };
}

function withTempDir(fn: (dir: string) => void) {
  const dir = mkdtempSync(join(tmpdir(), "lof-quiz-"));
  try {
    fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// --- normalizeQuestionText ------------------------------------------------

test("normalizeQuestionText lowercases and collapses punctuation", () => {
  assert.equal(
    normalizeQuestionText("Which of the following statements is/are correct?"),
    "which of the following statements is are correct",
  );
});

test("normalizeQuestionText returns empty string for blank input", () => {
  assert.equal(normalizeQuestionText("   "), "");
});

// --- coerceAnswer ---------------------------------------------------------

test("coerceAnswer accepts letters A-D", () => {
  assert.equal(coerceAnswer("A"), 0);
  assert.equal(coerceAnswer("b"), 1);
  assert.equal(coerceAnswer(" C "), 2);
  assert.equal(coerceAnswer("D"), 3);
});

test("coerceAnswer accepts integer and numeric-string indices", () => {
  assert.equal(coerceAnswer(0), 0);
  assert.equal(coerceAnswer(3), 3);
  assert.equal(coerceAnswer("2"), 2);
});

test("coerceAnswer rejects out-of-range and non-numeric values", () => {
  assert.equal(coerceAnswer(4), null);
  assert.equal(coerceAnswer(-1), null);
  assert.equal(coerceAnswer("E"), null);
  assert.equal(coerceAnswer("x"), null);
  assert.equal(coerceAnswer(null), null);
  assert.equal(coerceAnswer(1.5), null);
});

test("coerceAnswer accepts labelled option forms", () => {
  assert.equal(coerceAnswer("Option A"), 0);
  assert.equal(coerceAnswer("(b)"), 1);
  assert.equal(coerceAnswer("C."), 2);
  assert.equal(coerceAnswer("d)"), 3);
  assert.equal(coerceAnswer("Option D:"), 3);
});

test("coerceAnswer does not treat statement text as an option label", () => {
  assert.equal(coerceAnswer("1 and 2 only"), null);
});

// --- dedupeQuestions ------------------------------------------------------

test("dedupeQuestions drops questions already in the avoid list", () => {
  const q = makeQuestion();
  assert.deepEqual(dedupeQuestions([q], [q.question]), []);
});

test("dedupeQuestions drops duplicates inside the new set", () => {
  const q = makeQuestion();
  const dup = makeQuestion({ question: "Which of the following statements is/are correct?" });
  assert.equal(dedupeQuestions([q, dup], []).length, 1);
});

test("dedupeQuestions keeps distinct questions and preserves order", () => {
  const a = makeQuestion({ question: "Question A?" });
  const b = makeQuestion({ question: "Question B?" });
  const out = dedupeQuestions([a, b], []);
  assert.deepEqual(
    out.map((q) => q.question),
    ["Question A?", "Question B?"],
  );
});

// --- normalizeQuiz --------------------------------------------------------

test("normalizeQuiz accepts a valid payload and numbers ids", () => {
  const quiz = normalizeQuiz(
    { questions: [makeQuestion({ question: "Question A?" }), makeQuestion({ question: "Question B?" })] },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.equal(quiz!.date, "2026-11-21");
  assert.equal(quiz!.windowStart, "2026-11-15");
  assert.equal(quiz!.windowEnd, "2026-11-21");
  assert.deepEqual(
    quiz!.questions.map((q) => q.id),
    [1, 2],
  );
});

test("normalizeQuiz drops invalid questions but keeps the rest", () => {
  const quiz = normalizeQuiz(
    {
      questions: [
        makeQuestion({ question: "Valid?" }),
        { question: "Too few options", options: ["A", "B"], answer: 0 },
        { question: "Bad answer", options: ["A", "B", "C", "D"], answer: "E" },
        makeQuestion({ question: "Also valid?" }),
      ],
    },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.deepEqual(
    quiz!.questions.map((q) => q.question),
    ["Valid?", "Also valid?"],
  );
});

test("normalizeQuiz applies avoid and caps at maxQuestions", () => {
  const quiz = normalizeQuiz(
    {
      questions: [
        makeQuestion({ question: "Repeated?" }),
        makeQuestion({ question: "Fresh 1?" }),
        makeQuestion({ question: "Fresh 2?" }),
      ],
    },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21", avoid: ["Repeated?"], maxQuestions: 1 },
  );
  assert.ok(quiz);
  assert.equal(quiz!.questions.length, 1);
  assert.equal(quiz!.questions[0].question, "Fresh 1?");
});

test("normalizeQuiz returns null for non-object or empty payloads", () => {
  const opts = { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" };
  assert.equal(normalizeQuiz(null, opts), null);
  assert.equal(normalizeQuiz([], opts), null);
  assert.equal(normalizeQuiz({ questions: "nope" }, opts), null);
  assert.equal(normalizeQuiz({ questions: [] }, opts), null);
  assert.equal(normalizeQuiz({ questions: [{}] }, opts), null);
});

test("normalizeQuiz defaults a missing topic to Current Affairs", () => {
  const quiz = normalizeQuiz(
    { questions: [{ question: "Q?", options: ["A", "B", "C", "D"], answer: 1 }] },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.equal(quiz!.questions[0].topic, "Current Affairs");
});

test("normalizeQuiz caps at the default count", () => {
  const questions = Array.from({ length: QUIZ_DEFAULT_QUESTIONS + 5 }, (_, i) => makeQuestion({ question: `Q${i}?` }));
  const quiz = normalizeQuiz({ questions }, { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" });
  assert.ok(quiz);
  assert.equal(quiz!.questions.length, QUIZ_DEFAULT_QUESTIONS);
});

// --- resolveQuizCount -----------------------------------------------------

test("resolveQuizCount defaults to 15 when unset or blank", () => {
  assert.equal(resolveQuizCount(undefined), 15);
  assert.equal(resolveQuizCount(""), 15);
  assert.equal(resolveQuizCount("   "), 15);
});

test("resolveQuizCount clamps to the 10-15 band", () => {
  assert.equal(resolveQuizCount("10"), QUIZ_MIN_QUESTIONS);
  assert.equal(resolveQuizCount("15"), QUIZ_MAX_QUESTIONS);
  assert.equal(resolveQuizCount("12"), 12);
  assert.equal(resolveQuizCount("5"), QUIZ_MIN_QUESTIONS);
  assert.equal(resolveQuizCount("40"), QUIZ_MAX_QUESTIONS);
});

test("resolveQuizCount ignores non-numeric values", () => {
  assert.equal(resolveQuizCount("lots"), QUIZ_DEFAULT_QUESTIONS);
  assert.equal(resolveQuizCount("12.5"), QUIZ_DEFAULT_QUESTIONS);
});

test("normalizeQuiz resolves an answer given as the option text", () => {
  const quiz = normalizeQuiz(
    {
      questions: [
        {
          question: "Which statements are correct?",
          options: ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"],
          answer: "2 and 3 only",
        },
      ],
    },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.equal(quiz!.questions[0].answer, 1);
});

test("normalizeQuiz accepts options keyed A-D", () => {
  const quiz = normalizeQuiz(
    {
      questions: [
        {
          question: "Capital of Australia?",
          options: { A: "Sydney", B: "Canberra", C: "Melbourne", D: "Perth" },
          answer: "B",
        },
      ],
    },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.deepEqual(quiz!.questions[0].options, ["Sydney", "Canberra", "Melbourne", "Perth"]);
  assert.equal(quiz!.questions[0].answer, 1);
});

test("normalizeQuiz accepts a bare array and a nested {quiz:{questions}} payload", () => {
  const opts = { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" };
  const fromArray = normalizeQuiz([makeQuestion({ question: "Array?" })], opts);
  assert.ok(fromArray);
  assert.equal(fromArray!.questions[0].question, "Array?");

  const fromNested = normalizeQuiz({ quiz: { questions: [makeQuestion({ question: "Nested?" })] } }, opts);
  assert.ok(fromNested);
  assert.equal(fromNested!.questions[0].question, "Nested?");
});

test("normalizeQuiz strips option letter markers without touching statement text", () => {
  const quiz = normalizeQuiz(
    {
      questions: [
        {
          question: "Q?",
          options: ["A) 1 and 2 only", "B) 2 and 3 only", "C) 1 and 3 only", "D) 1, 2 and 3"],
          answer: "A",
        },
      ],
    },
    { date: "2026-11-21", windowStart: "2026-11-15", windowEnd: "2026-11-21" },
  );
  assert.ok(quiz);
  assert.deepEqual(quiz!.questions[0].options, ["1 and 2 only", "2 and 3 only", "1 and 3 only", "1, 2 and 3"]);
});

// --- buildQuizContext -----------------------------------------------------

test("buildQuizContext includes the brief and story headlines", () => {
  const context = buildQuizContext([makeEdition("2026-11-20")]);
  assert.match(context, /### 2026-11-20/);
  assert.match(context, /Brief for 2026-11-20/);
  assert.match(context, /Headline for 2026-11-20/);
  assert.match(context, /Prelims: Prelims pointer/);
  assert.match(context, /Static: Fundamental Rights/);
});

test("buildQuizContext truncates long summaries", () => {
  const edition = makeEdition("2026-11-20");
  edition.stories[0].summary = "x".repeat(400);
  const context = buildQuizContext([edition]);
  assert.ok(!context.includes("x".repeat(400)));
  assert.ok(context.includes("…"));
});

// --- readRecentEditions ---------------------------------------------------

test("readRecentEditions reads the inclusive window and skips missing days", () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, "2026-11-20.json"), JSON.stringify(makeEdition("2026-11-20")));
    writeFileSync(join(dir, "2026-11-18.json"), JSON.stringify(makeEdition("2026-11-18")));
    writeFileSync(join(dir, "2026-11-10.json"), JSON.stringify(makeEdition("2026-11-10")));
    const editions = readRecentEditions(dir, "2026-11-20", 7);
    assert.deepEqual(
      editions.map((e) => e.date),
      ["2026-11-18", "2026-11-20"],
    );
  });
});

test("readRecentEditions ignores corrupt files and returns [] for a bad date", () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, "2026-11-20.json"), "{ not json");
    assert.deepEqual(readRecentEditions(dir, "2026-11-20", 7), []);
    assert.deepEqual(readRecentEditions(dir, "not-a-date", 7), []);
  });
});

// --- readPreviousQuestions ------------------------------------------------

test("readPreviousQuestions collects questions from earlier quizzes", () => {
  withTempDir((dir) => {
    const quiz: Quiz = {
      date: "2026-11-20",
      generatedAt: "2026-11-20T06:00:00.000Z",
      title: "Daily Prelims Quiz",
      windowStart: "2026-11-14",
      windowEnd: "2026-11-20",
      questions: [makeQuestion({ question: "Yesterday's question?" })],
    };
    writeFileSync(join(dir, "2026-11-20.json"), JSON.stringify(quiz));
    const avoid = readPreviousQuestions(dir, "2026-11-21", 7);
    assert.deepEqual(avoid, ["Yesterday's question?"]);
  });
});

test("readPreviousQuestions ignores the current date and corrupt files", () => {
  withTempDir((dir) => {
    writeFileSync(join(dir, "2026-11-21.json"), "{ broken");
    assert.deepEqual(readPreviousQuestions(dir, "2026-11-21", 7), []);
  });
});
