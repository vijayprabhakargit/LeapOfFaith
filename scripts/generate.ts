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

import type { Article, Edition, Story, FeedStat } from "../src/lib/types";
import { ENABLED_SOURCES, GOOGLE_NEWS_LOCALES } from "../config/sources";
import { fetchFeeds, fetchGoogleNewsArticles } from "./lib/fetchFeeds";
import { clusterArticles, enrichStory, buildHeuristicStories, buildFallbackStory, findPlaceholderStory, shortlistPerSource, preselectByHeadlines, assignSignals, buildExtras, clusterScore, buildFeedStats, CORE_PAPERS, type ClusterSpec } from "./lib/enrich";
import { fetchOnThisDay } from "./lib/onthisday";
import { llmConfigured, describeLlm } from "./lib/llm";
import { generateQuiz } from "./lib/quiz";

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

// The edition's news window ends at this fixed IST time on the edition date, so
// the window is identical no matter when the workflow is run: an edition covers
// exactly the 24 hours ending at this cutoff (e.g. 2026-11-14 → 13th 07:00 →
// 14th 07:00 IST). Set it to your normal publish time. A late run never shifts
// the window — news published after the cutoff flows into the next edition.
const EDITION_CUTOFF_IST = "07:00";

function editionWindowEnd(date: string): Date {
  return new Date(`${date}T${EDITION_CUTOFF_IST}:00+05:30`);
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

const STORY_ATTEMPTS = 2;
const STORY_RETRY_MS = 2500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enrichWithRetry(
  spec: ClusterSpec,
  storyArticles: Article[],
  regionals: Article[],
): Promise<Story> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < STORY_ATTEMPTS; attempt++) {
    try {
      return await enrichStory(spec, storyArticles, regionals);
    } catch (err) {
      lastErr = err;
      if (attempt < STORY_ATTEMPTS - 1) await sleep(STORY_RETRY_MS * (attempt + 1));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.day || istDate();
  // The window is pinned to a fixed IST cutoff on the edition date — never to
  // the run time — so running at 07:00 or 10:00 produces the same edition. This
  // also makes --day backfills reproducible.
  const windowEnd = editionWindowEnd(date);
  const windowStart = new Date(windowEnd.getTime() - args.hours * 60 * 60 * 1000);
  const generatedAt = new Date();

  const canLlm = !args.dryRun && llmConfigured();
  console.log(`\n📰 The Daily Brief — edition ${date}`);
  console.log(`   window: ${windowStart.toISOString()} → ${windowEnd.toISOString()} (fixed ${EDITION_CUTOFF_IST} IST cutoff)`);
  console.log(`   llm: ${canLlm ? describeLlm() : args.dryRun ? "dry-run" : "NOT CONFIGURED → falling back to heuristic"}\n`);

  // 1. Fetch -----------------------------------------------------------------
  console.log("→ Fetching feeds…");
  const fetched = await fetchFeeds(undefined, args.hours, windowEnd.getTime());
  // fetchFeeds only enforces the lower bound; drop anything published after the
  // cutoff so the window stays fixed regardless of when the workflow runs.
  const articles = fetched.articles.filter((a) => new Date(a.publishedAt).getTime() <= windowEnd.getTime());
  const { ok, failed } = fetched;
  console.log(`   ${ok.length}/${ENABLED_SOURCES.length} feeds ok, ${articles.length} articles in window`);
  for (const f of failed) console.warn(`   ⚠ ${f.source.name}: ${f.error}`);

  if (!articles.length) {
    console.error("   ✖ No articles found. Aborting.");
    process.exitCode = 1;
    return;
  }

  // Two-lane selection: a per-source shortlist (top ~20% by feed order, but
  // ~45% for the core papers — The Hindu, The Indian Express), then a smart
  // cross-source preselect at headline level (corroboration + priority +
  // weight). Only these go to the LLM; deeper diving happens later, and only for
  // the stories we actually run. CORE_PAPERS lifts both lanes for those two.
  const priorityOf = new Map(ENABLED_SOURCES.map((s) => [s.id, s.priority]));
  const weightOf = new Map(ENABLED_SOURCES.map((s) => [s.id, s.weight ?? 1]));
  const shortlist = shortlistPerSource(articles, 0.2, 3, 10, CORE_PAPERS);
  const candidates = preselectByHeadlines(shortlist, priorityOf, weightOf, 130, 10, CORE_PAPERS);
  console.log(`   shortlist ${shortlist.length} → ${candidates.length} candidates for clustering`);

  // 2. Cluster ---------------------------------------------------------------
  let brief: string[] = [];
  let specs: ClusterSpec[] = [];
  let clusteringFailed = false;
  if (canLlm) {
    console.log("→ Clustering stories with the model…");
    try {
      const clustered = await clusterArticles(candidates);
      brief = clustered.brief || [];
      specs = clustered.stories;
      console.log(`   ${specs.length} stories identified`);
    } catch (err) {
      clusteringFailed = true;
      console.warn(`   ⚠ clustering failed: ${err instanceof Error ? err.message : err}`);
      // Clustering is a single point of failure for the whole edition, so give it
      // one more attempt before falling back to a heuristic edition.
      try {
        await sleep(1500);
        const clustered = await clusterArticles(candidates);
        brief = clustered.brief || [];
        specs = clustered.stories;
        clusteringFailed = false;
        console.log(`   ✓ clustering recovered: ${specs.length} stories identified`);
      } catch (retryErr) {
        console.warn(`   ⚠ clustering retry failed: ${retryErr instanceof Error ? retryErr.message : retryErr}`);
      }
    }
    if (!specs.length) {
      clusteringFailed = true;
      console.warn("   ⚠ clustering returned no stories");
    }
  }

  // 3. Enrich ----------------------------------------------------------------
  // Rank clusters by score (importance + corroboration boost); the top slice
  // becomes the full stories, the rest feed the "Extras" list (as clusters,
  // keeping their source links).
  const PRIMARY_STORIES = 21;
  const rankedSpecs = [...specs].sort((a, b) => clusterScore(b, candidates) - clusterScore(a, candidates));

  let stories: Story[] = [];
  const failedStories: { index: number; spec: ClusterSpec; articles: Article[]; regionals: Article[] }[] = [];
  if (rankedSpecs.length) {
    const primary = rankedSpecs.slice(0, PRIMARY_STORIES);
    console.log(`→ Stitching + static-linking ${primary.length} primary stories of ${rankedSpecs.length} clusters…`);
    stories = await mapLimit(primary, 3, async (spec, index) => {
      const storyArticles = spec.articleIds.map((i) => candidates[i]).filter(Boolean);
      // Only look up a regional perspective when the country is one we have a
      // locale for, otherwise the label would not match the outlets returned.
      const country = spec.countryFocus && GOOGLE_NEWS_LOCALES[spec.countryFocus] ? spec.countryFocus : undefined;
      let regionals: typeof storyArticles = [];
      if (!args.noRegional && country) {
        const query = storyArticles[0]?.title?.split(" ").slice(0, 8).join(" ") || spec.headline;
        regionals = (await fetchGoogleNewsArticles(query, country, 48, 3, windowEnd.getTime())).filter(
          (a) => new Date(a.publishedAt).getTime() <= windowEnd.getTime(),
        );
      }
      const enrichedSpec = { ...spec, countryFocus: country };
      try {
        return await enrichWithRetry(enrichedSpec, storyArticles, regionals);
      } catch (err) {
        console.warn(`   ⚠ enrich failed for "${spec.headline}": ${err instanceof Error ? err.message : err}`);
        failedStories.push({ index, spec: enrichedSpec, articles: storyArticles, regionals });
        // Degraded but honest: real headline/sources, no dry-run placeholder.
        return buildFallbackStory(storyArticles, enrichedSpec);
      }
    });

    // The batch retry already runs inside each worker. This second, serial pass
    // gives a transient 429/timeout time to clear without regenerating the whole
    // edition — the same recovery the manual workflow rerun provides.
    if (failedStories.length) {
      console.log(`→ Retrying ${Math.min(failedStories.length, 3)} of ${failedStories.length} failed story/stories serially…`);
      for (const item of failedStories.slice(0, 3)) {
        try {
          const story = await enrichStory(item.spec, item.articles, item.regionals);
          stories[item.index] = story;
          console.log(`   ✓ recovered "${item.spec.headline}"`);
        } catch (err) {
          console.warn(`   ⚠ still failed "${item.spec.headline}": ${err instanceof Error ? err.message : err}`);
        }
      }
    }
  } else {
    if (canLlm && clusteringFailed) {
      console.error("   ✖ LLM clustering failed; refusing to write a placeholder edition. Re-run the workflow.");
      process.exitCode = 1;
      return;
    }
    console.log("→ No LLM clustering; building heuristic stories.");
    stories = buildHeuristicStories(candidates);
    brief = [
      `${articles.length} articles collected across ${ok.length} feeds in the last ${args.hours} hours.`,
      "Configure an LLM provider in .env to unlock story stitching and static-syllabus links.",
    ];
  }

  // Keep the cluster-score order (the enrich result preserves the primary order);
  // assignSignals marks the lead story — and any importance-5 story — as must-read.
  stories = assignSignals(stories.filter((s): s is Story => Boolean(s)));

  // 4. On This Day -----------------------------------------------------------
  console.log("→ Building 'On This Day'…");
  const onThisDay = await fetchOnThisDay(new Date(`${date}T06:00:00+05:30`), canLlm);
  console.log(`   ${onThisDay.length} entries`);

  // Extras: lower-priority clusters + leftover articles — the 80/20 tail.
  const extras = buildExtras(rankedSpecs, candidates, PRIMARY_STORIES, priorityOf, 30);
  const clustered = extras.filter((e) => e.articles.length > 1).length;
  console.log(`   ${extras.length} extras (${clustered} multi-source clusters)`);

  // 5. Compose + write -------------------------------------------------------
  // Per-feed article counts (feed URL + how many in-window articles it yielded),
  // so the edition page's "N articles" stat can justify where they came from.
  // We store no individual article URLs — just the feed links to open.
  const feeds: FeedStat[] = buildFeedStats(articles, ok);

  // Safety net: never commit a full-brief edition that still carries the
  // dry-run placeholder. A failed run leaves the previous edition in place.
  const placeholder = findPlaceholderStory(stories);
  if (canLlm && placeholder) {
    console.error(`   ✖ Refusing to write edition: placeholder text found in "${placeholder.headline}".`);
    process.exitCode = 1;
    return;
  }

  const edition: Edition = {
    date,
    generatedAt: generatedAt.toISOString(),
    windowStart: windowStart.toISOString(),
    windowEnd: windowEnd.toISOString(),
    stats: { feeds: ok.length, articles: articles.length, stories: stories.length },
    brief,
    stories,
    onThisDay,
    extras,
    feeds,
  };

  const outDir = join(root, "src", "content", "editions");
  await mkdir(outDir, { recursive: true });
  const outFile = join(outDir, `${date}.json`);
  await writeFile(outFile, JSON.stringify(edition, null, 2), "utf8");
  console.log(`\n✔ Wrote ${outFile}`);
  console.log(`   ${stories.length} stories · ${onThisDay.length} on-this-day entries\n`);

  // 6. Quiz ------------------------------------------------------------------
  // Generated from the last N days of editions (including today's). Optional:
  // a quiz failure never blocks the edition. Dry-run skips it entirely.
  if (canLlm) {
    console.log("→ Generating the daily quiz…");
    try {
      const quiz = await generateQuiz({
        date,
        editionsDir: outDir,
        quizzesDir: join(root, "src", "content", "quizzes"),
      });
      if (quiz) {
        const quizDir = join(root, "src", "content", "quizzes");
        await mkdir(quizDir, { recursive: true });
        await writeFile(join(quizDir, `${date}.json`), JSON.stringify(quiz, null, 2), "utf8");
        console.log(`   ✔ ${quiz.questions.length} questions written to src/content/quizzes/${date}.json`);
      } else {
        console.warn("   ⚠ quiz generation produced no usable questions; skipping");
      }
    } catch (err) {
      console.warn(`   ⚠ quiz generation failed: ${err instanceof Error ? err.message : err}`);
    }
  }

  // 7. Prune very old editions (keep last 400).
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
