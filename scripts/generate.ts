import { mkdir, writeFile, readdir, unlink } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Load .env (if present) without a dependency.
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
loadDotEnv(join(root, ".env"));

function loadDotEnv(path: string) {
  try {
    if (!existsSync(path)) return;
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* ignore */
  }
}

import type { Edition, Story } from "../src/lib/types";
import { ENABLED_SOURCES, GOOGLE_NEWS_LOCALES } from "../config/sources";
import { fetchFeeds, fetchGoogleNewsArticles } from "./lib/fetchFeeds";
import { clusterArticles, enrichStory, buildHeuristicStories, type ClusterSpec } from "./lib/enrich";
import { fetchOnThisDay } from "./lib/onthisday";
import { llmConfigured, describeLlm } from "./lib/llm";

interface Args {
  day?: string;
  hours: number;
  dryRun: boolean;
  noRegional: boolean;
}

function parseArgs(argv: string[]): Args {
  const args: Args = { hours: 24, dryRun: false, noRegional: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--day") args.day = argv[++i];
    else if (a === "--hours") args.hours = Number(argv[++i]) || 24;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--no-regional") args.noRegional = true;
  }
  return args;
}

function istDate(now = new Date()): string {
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.day || istDate();
  // When backfilling a specific day, anchor the window to that day (00:30 IST)
  // rather than wall-clock now, so a historical edition is filled with the
  // articles published around that date, not today's.
  const now = args.day ? new Date(`${args.day}T00:30:00+05:30`) : new Date();
  const windowStart = new Date(now.getTime() - args.hours * 60 * 60 * 1000);

  const canLlm = !args.dryRun && llmConfigured();
  console.log(`\n📰 The Daily Brief — edition ${date}`);
  console.log(`   window: last ${args.hours}h   llm: ${canLlm ? describeLlm() : args.dryRun ? "dry-run" : "NOT CONFIGURED → falling back to heuristic"}\n`);

  // 1. Fetch -----------------------------------------------------------------
  console.log("→ Fetching feeds…");
  const { articles, ok, failed } = await fetchFeeds(undefined, args.hours, now.getTime());
  console.log(`   ${ok.length}/${ENABLED_SOURCES.length} feeds ok, ${articles.length} articles in window`);
  for (const f of failed) console.warn(`   ⚠ ${f.source.name}: ${f.error}`);

  if (!articles.length) {
    console.error("   ✖ No articles found. Aborting.");
    process.exitCode = 1;
    return;
  }

  // Rank candidates: source priority first, then recency.
  const priorityOf = new Map(ENABLED_SOURCES.map((s) => [s.id, s.priority]));
  const ranked = [...articles].sort((a, b) => {
    const pa = priorityOf.get(a.sourceId) ?? 3;
    const pb = priorityOf.get(b.sourceId) ?? 3;
    if (pa !== pb) return pa - pb;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
  const candidates = ranked.slice(0, 60);

  // 2. Cluster ---------------------------------------------------------------
  let brief: string[] = [];
  let specs: ClusterSpec[] = [];
  if (canLlm) {
    console.log("→ Clustering stories with the model…");
    try {
      const clustered = await clusterArticles(candidates);
      brief = clustered.brief || [];
      specs = clustered.stories;
      console.log(`   ${specs.length} stories identified`);
    } catch (err) {
      console.warn(`   ⚠ clustering failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 3. Enrich ----------------------------------------------------------------
  let stories: Story[] = [];
  if (specs.length) {
    console.log("→ Stitching + static-linking each story…");
    stories = await mapLimit(specs, 3, async (spec) => {
      const storyArticles = spec.articleIds.map((i) => candidates[i]).filter(Boolean);
      // Only look up a regional perspective when the country is one we have a
      // locale for, otherwise the label would not match the outlets returned.
      const country = spec.countryFocus && GOOGLE_NEWS_LOCALES[spec.countryFocus] ? spec.countryFocus : undefined;
      let regionals: typeof storyArticles = [];
      if (!args.noRegional && country) {
        const query = storyArticles[0]?.title?.split(" ").slice(0, 8).join(" ") || spec.headline;
        regionals = await fetchGoogleNewsArticles(query, country, 48, 3, now.getTime());
      }
      try {
        return await enrichStory({ ...spec, countryFocus: country }, storyArticles, regionals);
      } catch (err) {
        console.warn(`   ⚠ enrich failed for "${spec.headline}": ${err instanceof Error ? err.message : err}`);
        return buildHeuristicStories(storyArticles)[0];
      }
    });
  } else {
    console.log("→ No LLM clustering; building heuristic stories.");
    stories = buildHeuristicStories(candidates);
    brief = [
      `${articles.length} articles collected across ${ok.length} feeds in the last ${args.hours} hours.`,
      "Configure an LLM provider in .env to unlock story stitching and static-syllabus links.",
    ];
  }

  stories = stories
    .filter((s): s is Story => Boolean(s))
    .sort((a, b) => b.importance - a.importance);

  // 4. On This Day -----------------------------------------------------------
  console.log("→ Building 'On This Day'…");
  const onThisDay = await fetchOnThisDay(new Date(`${date}T06:00:00+05:30`), canLlm);
  console.log(`   ${onThisDay.length} entries`);

  // 5. Compose + write -------------------------------------------------------
  const edition: Edition = {
    date,
    generatedAt: now.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: now.toISOString(),
    stats: { feeds: ok.length, articles: articles.length, stories: stories.length },
    brief,
    stories,
    onThisDay,
  };

  const outDir = join(root, "src", "content", "editions");
  await mkdir(outDir, { recursive: true });
  const outFile = join(outDir, `${date}.json`);
  await writeFile(outFile, JSON.stringify(edition, null, 2), "utf8");
  console.log(`\n✔ Wrote ${outFile}`);
  console.log(`   ${stories.length} stories · ${onThisDay.length} on-this-day entries\n`);

  // 6. Prune very old editions (keep last 400).
  try {
    const files = (await readdir(outDir)).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
    if (files.length > 400) {
      for (const f of files.slice(0, files.length - 400)) await unlink(join(outDir, f));
    }
  } catch {
    /* non-fatal */
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
