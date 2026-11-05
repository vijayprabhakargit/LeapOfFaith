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
  // Position in the source's feed (0 = first, i.e. its front page). Used as a
  // cheap "importance" signal during selection.
  feedRank?: number;
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

// A lighter-weight item for the "Extras" reading list. Usually one article,
// but a cluster of articles covering the same event keeps all its source links.
export interface ExtraItem {
  title: string;
  date: string;
  articles: Article[];
}

// One row per feed we fetched for an edition: the display name, the feed URL
// itself (so a reader can open it and see the last ~24h of items), and how many
// in-window articles that feed contributed. Powers the page behind the edition's
// "N articles" stat, justifying where the articles came from — without storing
// every article URL.
export interface FeedStat {
  source: string;
  rss: string;
  count: number;
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
  // Lower-priority clusters + leftover articles — a safety net so nothing
  // important is missed. Older editions stored a flat Article[]; the site
  // normalises both shapes.
  extras?: ExtraItem[];
  // Per-feed article counts for the window. Optional: older editions predate it.
  feeds?: FeedStat[];
}
