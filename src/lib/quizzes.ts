import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Quiz } from "./types";

const QUIZZES_DIR = join(process.cwd(), "src", "content", "quizzes");

let cache: Quiz[] | null = null;

export function getAllQuizzes(): Quiz[] {
  if (cache) return cache;
  if (!existsSync(QUIZZES_DIR)) {
    cache = [];
    return cache;
  }
  const files = readdirSync(QUIZZES_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const quizzes = files
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(QUIZZES_DIR, f), "utf8")) as Quiz;
      } catch {
        return null;
      }
    })
    .filter((q): q is Quiz => Boolean(q))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = quizzes;
  return cache;
}

export function getLatestQuiz(): Quiz | null {
  return getAllQuizzes()[0] ?? null;
}

export function getQuiz(date: string): Quiz | null {
  return getAllQuizzes().find((q) => q.date === date) ?? null;
}

export function getQuizDates(): string[] {
  return getAllQuizzes().map((q) => q.date);
}
