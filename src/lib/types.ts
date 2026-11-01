// Shared data model used by both the generator (scripts/) and the site (src/).
// An Edition is one day's newspaper; it is serialised to
// src/content/editions/<date>.json by scripts/generate.ts.

export type Region = "india" | "global";

export type Lean =
  | "official"
  | "centre"
  | "left"
  | "right"
  | "independent"
  | "global-north"
  | "global-south"
  | "regional"
  | "unknown";

export interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceId: string;
  region: Region;
  categories: string[];
  publishedAt: string;
  snippet: string;
}

export interface Perspective {
  source: string;
  region: string;
  lean: Lean;
  take: string;
  link: string;
  isRegional?: boolean;
}

export interface StaticLink {
  topic: string;
  paper: string;
  syllabusNode: string;
  whatIsIt: string;
  background: string;
  geography?: string;
  socioEconomic?: string;
  whyInNews: string;
  wayForward?: string;
  keyTerms: string[];
  prelimsPointers?: string[];
  mainsAngle?: string;
}

export interface Story {
  id: string;
  slug: string;
  headline: string;
  kicker: string;
  category: string;
  region: Region;
  importance: number;
  signal: "must-read" | "recommended" | "all";
  summary: string;
  whyItMatters: string;
  perspectives: Perspective[];
  articles: Article[];
  static: StaticLink[];
  prelims: string[];
  mainsQuestion?: string;
  tags: string[];
  readMinutes: number;
}

export interface OnThisDayItem {
  year: string;
  title: string;
  description: string;
  category: "event" | "birth" | "death" | "discovery";
  upscLink?: string;
}

export interface Edition {
  date: string;
  generatedAt: string;
  windowStart: string;
  windowEnd: string;
  stats: { feeds: number; articles: number; stories: number };
  brief: string[];
  stories: Story[];
  onThisDay: OnThisDayItem[];
  // Articles that did not make it into a story — a safety net so nothing
  // important is missed. Optional for backward compatibility.
  extras?: Article[];
}
