# Leap of Faith — The Daily Brief

**Leap of Faith** is the project; **The Daily Brief** is the paper it prints every morning.

A daily, AI-curated **current-affairs newspaper for UPSC Civil Services preparation**, inspired by
[The Daily Diff](https://tdd.cat/). It stitches the day's news across trusted sources into single stories,
shows you **multiple perspectives** on each story, and then links the story back to the **static syllabus** —
history, geography, polity, socio-economics, prelims facts and a mains question.

> Dynamic first, static linked in. One place to read the world.

---

## What you get, every morning

Each edition (last 24 hours of news) is one newspaper page with:

- **Today's brief** — 3–5 bullets of the day's exam-relevant agenda.
- **Stories** — de-duplicated and stitched across sources (the same event from several outlets becomes one story).
- **Multiple perspectives** — a neutral one-line framing of how each source covered the story, with links.
- **Fresh angles** — for stories tied to a country (e.g. the US–Iran story), the generator pulls that country's
  own press via a Google-News locale feed, so you see a non-Indian perspective too.
- **The static syllabus behind the story** — a collapsible panel per story: what it is, its background
  (when it came, by whom), geography, socio-economic context, key terms, prelims pointers and a mains angle.
- **Prelims — remember this** and **Mains practice** — ready-made revision pointers and a question.
- **On this day** — history from the Wikimedia "On this day" feed, curated for syllabus relevance.
- **Tags** — every story is tagged; browse them in a **client-side tag cloud** (`/tags/`) with a time
  filter (all time / 1–12 months / custom range). Clicking a tag lists its stories in place, and the
  state lives in the URL (`/tags/?tag=iran&range=6m`) so it's shareable.
- **Filters + search** — by section, "must read", or free text; a reading-progress bar; light / dark themes.

Copyright-safe by design: we store only short excerpts and **always link back to the publisher**.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure your LLM (copy and edit)
cp .env.example .env        # then paste your API key

# 3. Generate today's edition (last 24h)
npm run generate

# 4. Preview
npm run dev                 # http://localhost:4321
```

A **sample edition** (`src/content/editions/2026-10-31.json`) ships with the repo so the site renders
before your first run. Delete it whenever you like.

### Useful commands

| Command | What it does |
| --- | --- |
| `npm run generate` | Generate today's edition (IST) from the last 24h |
| `npm run generate:day -- --day 2026-11-01` | Generate a specific date |
| `npm run generate:dry` | No LLM — heuristic run, validates feeds only |
| `npm run generate -- --no-regional` | Skip the dynamic country-perspective lookups |
| `npm run dev` | Local preview |
| `npm run build` | Production build to `dist/` |
| `npm run check` | Type-check |
| `npm test` | Run the unit tests (Node's built-in runner via tsx) |
| `npm run deploy` | Deploy `dist/` to Cloudflare Pages |

---

## Testing

```bash
npm test
```

The unit tests run on Node's built-in test runner (via `tsx`) and need no network. They cover the
pure logic: `slugify`, knowledge-card matching, Google-News URL building and locale fallback,
IST date formatting, edition loading / archive grouping, loose JSON parsing, and article-id
sanitising. Add new tests under `test/` and list the file in the `test` script in `package.json`.

---

## Reliability notes

- **Abortable network.** Every feed fetch **and** every LLM/Wikimedia call has a hard timeout
  (`scripts/lib/fetchFeeds.ts`, `scripts/lib/llm.ts`, `scripts/lib/onthisday.ts`), so one stalled
  source can never hang a daily run.
- **Backfills are anchored.** `npm run generate:day -- --day <date>` anchors the 24-hour news window
  to that date rather than today, so historical editions get the right articles.
- **Graceful degradation.** Without an LLM key the pipeline still runs (heuristic, unstitched), and a
  source that fails is skipped rather than aborting the edition.

---

## Choosing your LLM

The generator is provider-agnostic. This project is configured for **OpenRouter → DeepSeek V4.1 Flash**;
set these in `.env` (or as GitHub Action secrets):

```ini
LLM_PROVIDER=openrouter
LLM_MODEL=deepseek/deepseek-v4.1-flash
LLM_API_KEY=sk-or-...       # or OPENROUTER_API_KEY
```

Any provider works — `openai` / `anthropic` / `gemini` / `openrouter`, or `compatible` + `LLM_BASE_URL`
for any OpenAI-compatible server (Ollama, vLLM, LM Studio, etc.), so you can run it fully locally at
zero API cost. If OpenRouter exposes a different slug for the model, use that slug for `LLM_MODEL`.
Without a key the site still builds — it just falls back to a heuristic, unstitched feed.

---

## Sources

Curated in [`config/sources.ts`](config/sources.ts) — edit freely. Currently covers:

**Core factual:** The Hindu (+ World, Opinion), The Indian Express (+ Explained), Mint, Business Standard,
The Hindu BusinessLine, ThePrint, The Tribune, Deccan Herald, The Telegraph (India) ·
**Primary/official:** PIB, PRS, RBI, Sansad TV ·
**Legal/policy:** LiveLaw, Bar & Bench, Supreme Court Observer, Vidhi, CSEP ·
**Environment/analysis:** Down To Earth, Mongabay India, India Water Portal, Carbon Brief, ORF,
The Conversation, Nature · **Global wires:** Reuters, BBC World ·
**Perspective (opinion):** Newslaundry, The News Minute, Scroll.in, The Wire, India Global Review.

Muted by default (kept in the file with `enabled: false`): Dekoder, The Red Mike (Hindi) and the Dhruv
Rathee channel — high-noise / opinion for an exam brief.

Notes on feeds:

- Newslaundry / The News Minute / Down To Earth run on Quintype, whose site feed is empty for
  anonymous fetchers — we use their stable S3 Atom mirrors.
- The Wire, ORF, PRS and Dekoder no longer expose RSS — we use a Google-News `site:` feed instead
  (the same copyright-safe pattern as the reference project).
- The dynamic per-story perspective feature uses Google-News locale feeds
  (`hl`/`gl`/`ceid`), configured in `GOOGLE_NEWS_LOCALES`.

The static knowledge base that grounds the "static syllabus" panels lives in
[`config/syllabus.ts`](config/syllabus.ts) — a growing set of UPSC concept cards. Add your own
revision notes there and they will appear in the brief.

---

## Automation (GitHub Actions → Cloudflare Pages)

[`.github/workflows/daily.yml`](.github/workflows/daily.yml) runs **daily at 00:43 UTC (≈6:13 AM IST)** — an
off-peak minute, so GitHub's best-effort scheduler is less likely to delay or drop it:

1. installs deps, 2. generates the edition, 3. builds the site, 4. commits the new edition back
(`[skip ci]`), 5. deploys `dist/` to Cloudflare Pages.

It also **runs on every push to `main`**, but on a push it only **builds and deploys the latest
committed edition** — no regeneration, so no token cost. That way code or UI changes go live
immediately instead of waiting for the next morning. The daily edition commit carries `[skip ci]`, so
it never re-triggers a build.

Add these repository **secrets** (Settings → Secrets → Actions):

| Secret | Purpose |
| --- | --- |
| `LLM_PROVIDER`, `LLM_MODEL`, `LLM_API_KEY` | your model (or a provider-specific key var) |
| `CLOUDFLARE_API_TOKEN` | Pages deploy token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account id |

Create a Cloudflare Pages project named **`leap-of-faith`** (Direct Upload) once, then the workflow
keeps it updated. You can also trigger a run manually from the Actions tab, optionally for a past date.
(The Pages project name is the deploy target used by `npm run deploy` and the `wrangler-action` step;
the site's public brand is **Leap of Faith — The Daily Brief**. To use a different project name,
update it in both places.)

The public URL is **https://leapoffaith.fyi** — set as `site` in `astro.config.mjs` so canonical, RSS and
OpenGraph URLs use it. To attach the domain, open the Pages project → **Custom domains → Set up a custom
domain** and add `leapoffaith.fyi` (and optionally `www.leapoffaith.fyi`); Cloudflare creates the DNS
record and TLS certificate automatically, and `public/_redirects` forwards `www` to the apex.

To run it on your own machine instead, schedule `npm run generate; npm run build` with Windows Task
Scheduler and open `dist/index.html`.

---

## Project layout

```
config/
  sources.ts        # curated feeds + Google-News locale patterns
  syllabus.ts       # UPSC syllabus map + static knowledge cards
scripts/
  generate.ts       # the daily pipeline entrypoint
  lib/
    fetchFeeds.ts   # abortable RSS/Atom fetch + normalise + Google-News
    enrich.ts       # clustering + story stitching + static linking
    llm.ts          # provider-agnostic JSON chat (openai/anthropic/gemini/…)
    onthisday.ts    # Wikimedia "On this day" + curation
src/
  content/editions/ # generated editions (one JSON per day)
  components/       # StoryCard, Controls, OnThisDay, EditionView
  layouts/          # BaseLayout (masthead, theme, progress)
  pages/            # index, editions/[date], archive, rss.xml, editions/latest.json
  lib/              # types, edition loader, formatters
  styles/global.css # the newsprint design system
test/               # unit tests (node --test via tsx)
```

## Feeds & outputs

- `/rss.xml` — recent stories
- `/editions/latest.json` — latest edition as JSON
- `/editions/<date>/` — a specific edition
- `/archive/` — every edition

---

## Roadmap

- **Cheaper / free inference.** The generator is provider-agnostic, so the daily model can be swapped
  with config only, no code changes: OpenRouter `:free` model variants, the Google Gemini free tier
  (`LLM_PROVIDER=gemini`), or Groq's free tier (`LLM_PROVIDER=compatible` +
  `LLM_BASE_URL=https://api.groq.com/openai/v1`). Fully local models (Ollama / vLLM) work the same way
  and are ideal if you run the job on your own machine instead of GitHub Actions.

  > **Note on GitHub's own AI:** GitHub Models — the free, OpenAI-compatible GitHub inference API —
  > was **retired on 30 July 2026**, and GitHub Copilot is not a runtime inference API, so neither can
  > back this generator. GitHub's suggested successor, **Azure AI Foundry**, is usable but would need a
  > small provider adapter addition.

- **PDF edition** — a print-ready A4 page per day (the newsprint `@media print` styles already exist).
- **Wider regional perspectives** — extend `GOOGLE_NEWS_LOCALES` and add stream-language sources.
- **Expand the curated source list** — grow `SOURCES` in `config/sources.ts` with more Indian and global
  outlets, official/primary feeds (PIB, PRS, gazettes, state bulletins), state-level press and sector
  beats, and tune each source's priority per section.
- **Tune the curation ranking** — improve candidate selection and story importance: recency weighting, a
  prominence signal (e.g. Google-News top stories), stronger cross-outlet stitching, and canonicalising /
  de-duplicating tags (currently free-form model output). Likely touches `scripts/lib/enrich.ts`
  (`selectCandidates`, the clustering + enrich prompts) and `scripts/generate.ts` (limits, per-family cap).
- **Revision tools** — export each story's static links + prelims pointers into a spaced-revision list.

---

## License

Open source under the [MIT License](LICENSE) — free to use, modify and share.

## Contributing

Contributions are welcome, especially from fellow aspirants:

- **Add a trusted source** — append to `SOURCES` in [`config/sources.ts`](config/sources.ts)
  (prefer a native RSS/Atom URL).
- **Improve the static linking** — add or refine a knowledge card in
  [`config/syllabus.ts`](config/syllabus.ts).
- **Polish the paper** — the newsprint design system lives in `src/styles/global.css`.

Fork, make your change, then run `npm test`, `npm run check` and `npm run build` before opening a
pull request. Bug reports and source suggestions via Issues are just as welcome.

Not affiliated with UPSC. Built for daily revision.
