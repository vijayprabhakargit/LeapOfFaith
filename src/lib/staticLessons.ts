import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { StaticLesson, StaticSeriesProgress } from "./types";

const LESSONS_DIR = join(process.cwd(), "src", "content", "static-lessons");
const PROGRESS_FILE = join(process.cwd(), "data", "static-series", "progress.json");

let cache: StaticLesson[] | null = null;

export function getAllStaticLessons(): StaticLesson[] {
  if (cache) return cache;
  if (!existsSync(LESSONS_DIR)) {
    cache = [];
    return cache;
  }
  const files = readdirSync(LESSONS_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const lessons = files
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(LESSONS_DIR, f), "utf8")) as StaticLesson;
      } catch {
        return null;
      }
    })
    .filter((l): l is StaticLesson => Boolean(l && l.date && l.title))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = lessons;
  return cache;
}

export function getLatestStaticLesson(): StaticLesson | null {
  return getAllStaticLessons()[0] ?? null;
}

export function getStaticLesson(date: string): StaticLesson | null {
  return getAllStaticLessons().find((l) => l.date === date) ?? null;
}

export function getStaticLessonDates(): string[] {
  return getAllStaticLessons().map((l) => l.date);
}

export function getStaticProgress(): StaticSeriesProgress {
  const empty: StaticSeriesProgress = {
    version: 1,
    startedOn: null,
    updatedAt: "",
    completed: [],
    current: null,
    lastHandoff: null,
  };
  if (!existsSync(PROGRESS_FILE)) return empty;
  try {
    const parsed = JSON.parse(readFileSync(PROGRESS_FILE, "utf8")) as StaticSeriesProgress;
    if (parsed && parsed.version === 1 && Array.isArray(parsed.completed)) return parsed;
  } catch {
    /* ignore a corrupt progress file at build time */
  }
  return empty;
}