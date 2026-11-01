import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Edition } from "./types";

const EDITIONS_DIR = join(process.cwd(), "src", "content", "editions");

let cache: Edition[] | null = null;

export function getAllEditions(): Edition[] {
  if (cache) return cache;
  if (!existsSync(EDITIONS_DIR)) {
    cache = [];
    return cache;
  }
  const files = readdirSync(EDITIONS_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f));
  const editions = files
    .map((f) => {
      try {
        return JSON.parse(readFileSync(join(EDITIONS_DIR, f), "utf8")) as Edition;
      } catch {
        return null;
      }
    })
    .filter((e): e is Edition => Boolean(e))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = editions;
  return cache;
}

export function getLatestEdition(): Edition | null {
  return getAllEditions()[0] ?? null;
}

export function getEdition(date: string): Edition | null {
  return getAllEditions().find((e) => e.date === date) ?? null;
}

export function getEditionDates(): string[] {
  return getAllEditions().map((e) => e.date);
}

export interface ArchiveMonth {
  month: string;
  label: string;
  editions: Edition[];
}

export function getArchiveByMonth(): ArchiveMonth[] {
  const map = new Map<string, Edition[]>();
  for (const e of getAllEditions()) {
    const month = e.date.slice(0, 7);
    if (!map.has(month)) map.set(month, []);
    map.get(month)!.push(e);
  }
  return [...map.entries()].map(([month, editions]) => ({
    month,
    label: new Date(`${month}-01T00:00:00Z`).toLocaleDateString("en-IN", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }),
    editions,
  }));
}
