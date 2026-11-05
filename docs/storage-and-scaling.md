# Storage & scaling

How much we store, how fast it grows, when we would hit a limit, and what we do
then. Written for the Cloudflare Pages free plan we deploy on today.

> Last reviewed: 2026-11-05. Re-check Cloudflare's numbers at
> <https://developers.cloudflare.com/pages/platform/limits/> before acting on them —
> they change.

## TL;DR

- Cloudflare Pages (free) has **no total storage quota** — bandwidth and requests
  for static assets are unmetered. The real ceilings are **20,000 files per site**,
  **25 MiB per file**, and **500 builds/month**.
- The site uses the free plan comfortably: ~14 files and ~1.6 MB built for a
  handful of editions, ~2 files and ~290 KB added per edition.
- The **git repository** grows fastest (one `edition.json` per day, ~250 KB), not
  the deployed site. That is the number to watch: ~90 MB/year, capped near
  ~100 MB by the 400-edition retention.
- We deliberately **do not** store the ~900 individual article URLs per day. The
  "N articles" stat links to a per-feed breakdown (feed URL + count), which adds
  only ~5 KB per edition. See "Why not store every article" below.

## Cloudflare Pages — free plan limits

| Limit | Free | Notes |
| --- | --- | --- |
| Files per site | 20,000 | 100,000 on paid (set `PAGES_WRANGLER_MAJOR_VERSION=4`) |
| Max single file | 25 MiB | A single edition page is ~0.3 MiB — two orders of magnitude spare |
| Builds per month | 500 | **Not used** — we Direct Upload with `wrangler pages deploy`, so Cloudflare runs no build; this cap is for Git-connected CF builds |
| Bandwidth / requests | Unmetered | Static assets are free and unlimited |
| Custom domains | 100 / project | We use 1–2 |
| Projects | 100 / account | |
| `_redirects` | 2,000 static + 100 dynamic | We use 1 |
| Pages Functions | *not used* | Would share the Workers free quota (100k req/day) |

There is **no published total-size quota**. "Running out of storage" on Pages is
not the realistic failure mode; the file count and the repo are.

## What we actually store

Two separate things grow, and they are different sizes:

1. **The deployed site** (`dist/` → Cloudflare Pages). Built from the committed
   editions. Contains **no edition JSON** (only `/editions/latest.json`); each
   edition is baked into an HTML page.
2. **The repository** (`src/content/editions/<date>.json`, committed by the daily
   job). This is the source of truth and the fastest-growing thing we own.

### Measured footprint (build of 4 editions, 2026-11-05)

| Item | Size |
| --- | --- |
| `dist/` total | ~1.63 MB / 14 files |
| One full edition page (HTML) | ~277–310 KB |
| Fixed assets (CSS/JS/archive/tags/rss/favicon) | ~150 KB total |
| One `edition.json` (pretty-printed) | ~235–274 KB |
| Sample edition `edition.json` | ~18 KB |

An edition HTML page is dominated by the inlined `data-search` blob in
`StoryCard.astro` (the full text of every story, so client-side search works
without a server). That is the single biggest lever if a page ever gets too big.

### Growth per day

| Added per day | With feed-breakdown page (today) | If we stored every article (rejected) |
| --- | --- | --- |
| Deployed files | 2 (edition page + feed page) | 2 |
| Deployed size | ~290 KB | ~290 KB (article list baked into HTML) |
| Repo (`edition.json`) | ~255 KB | ~660 KB (**+~400 KB/day**) |

So the deployed site adds ~290 KB/day → ~105 MB/year; at the 400-edition
retention that plateaus near **~115 MB deployed**, which Cloudflare does not
charge for.

The repository adds ~255 KB/day → **~90 MB/year**, plateauing near **~100 MB**
with retention.

## When do we hit a limit?

- **File count (20,000):** never in practice. At ~9 files fixed and 2 files per
  edition, 20,000 files needs ~9,900 editions (~27 years), and retention caps us
  at ~807 files. **Not a risk.**
- **Single file (25 MiB):** never. Largest file is the edition page (~0.3 MiB).
- **Cloudflare builds/month (500):** does **not** apply to us. We build in GitHub
  Actions and upload `dist/` with `wrangler pages deploy` (Direct Upload), so
  Cloudflare never runs a build. That 500/month cap (and the 20-minute build
  timeout) is for Pages projects connected to a Git repo and built by Cloudflare.
- **GitHub Actions minutes:** this repository is **public**, so Actions minutes
  are **unlimited**. (The 2,000 min/month free allowance only applies to private
  repos.) Non-issue.
- **Repository size / build time:** the first thing that will actually hurt.
  `getAllEditions()` reads every `edition.json` into memory at build time. At the
  400-edition cap that is ~100 MB of JSON; comfortable on a GitHub-hosted runner
  (7 GB RAM), but it grows linearly and slows clones/builds.

### Where to check

| Signal | Where | Today |
| --- | --- | --- |
| Deployments (Cloudflare) | Dashboard → Workers & Pages → `leap-of-faith` → Deployments | 1 per daily run/push |
| Build runs & duration (GitHub) | Repo → **Actions** tab → a run (shows total time) | build ~4–5 s local; ~1–2 min on a runner with `npm ci` |
| GitHub Actions minutes | Repo → Settings → Billing (only matters if the repo goes private) | unlimited (public repo) |
| Deployed size / file count | The run's `wrangler pages deploy` output, or `dist/` locally | ~1.6 MB / ~14 files for 4 editions |
| Repository size | `git count-objects -vH` (or GitHub → repo home → *Code* size) | ~1.4 MB `.git`; grows ~90 MB/yr |

The realistic long-term pressure is **repo size and build time**, not any
Cloudflare quota.

## Why not store every article

The original idea was for the "N articles" stat to open a list of all ~900
article URLs. That would add ~400 KB to **every** `edition.json` (923 fetched
refs × ~440 bytes), taking the repo to ~660 KB/edition and ~265 MB at retention —
and ~265 MB of resident memory in `getAllEditions()` at build. Not worth it for a
list of links.

Instead, the per-edition page at `/editions/<date>/articles/` shows **one row per
feed** — the feed URL (clickable, opens the source's latest ~24 h of items) and
the count of in-window articles it contributed. That justifies the "N articles"
number, gives the reader the links, and costs ~5 KB per edition. The site-wide
`/sources/` page is the directory of publications (icon, name, homepage, RSS).

## Scaling plan

In rough order of when we would need them:

1. **Do nothing (now).** The feed-breakdown page is ~5 KB/edition; the free plan
   is nowhere near its limits. Keep the 400-edition retention in
   `scripts/generate.ts`.
2. **Shrink edition pages if they bite.** The `data-search` blob is the bulk of a
   ~280 KB page. Move search to a smaller index or load it lazily.
3. **Bound the repo/build.** If clones or builds slow down, lower retention (e.g.
   180 editions), and/or keep older editions out of the build path — store them
   outside `src/content/editions/` and serve the archive client-side from a JSON
   file in `public/`, or from object storage.
4. **Object storage for big payloads.** If we ever do want per-article data or
   the full archive, put it in **Cloudflare R2** (or any bucket) and link to it —
   do not inflate each `edition.json`.
5. **Paid Pages ($25/mo)** raises the file cap to 100,000 and builds to 5,000/mo
   if a real, measured limit is ever hit. No storage purchase needed.

## Invariants to keep

- `edition.json` stays **one file per day**, pretty-printed, no per-article bulk.
- The deployed `dist/` never ships the edition JSONs; only `latest.json`.
- Retention (`KEEP = 400`) is the knob that bounds repo size, not storage limits.
