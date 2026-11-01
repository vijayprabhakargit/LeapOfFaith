# AGENTS.md — Leap of Faith (The Daily Brief)

Guidance for AI agents working in this repository.

## What this project is

**Leap of Faith** is the project; **The Daily Brief** is the daily current-affairs newspaper it
generates. A static, edition-per-day **UPSC current-affairs newspaper**: Astro (static output)
renders JSON editions produced by a Node/TS generator. Deployed to Cloudflare Pages via GitHub Actions.

## The golden rules

1. **Never commit secrets.** All keys live in `.env` (git-ignored) locally and in GitHub Actions
   secrets in CI. `.env.example` documents the variables — keep it in sync.
2. **Copyright-safe output.** Store only short excerpts (≤ ~320 chars) and always link back to the
   publisher. Never reproduce full article bodies. This is a hard constraint; the reference project
   (The Daily Diff) works the same way.
3. **Editions are data, not code.** `src/content/editions/<YYYY-MM-DD>.json` are generated artifacts.
   Regenerate them with the generator; do not hand-edit except for the sample edition.
4. **Static-linking must stay accurate.** The LLM is grounded with cards from `config/syllabus.ts`.
   When adding a claim-worthy theme, add a knowledge card there rather than trusting the model.
5. **Provider-agnostic LLM.** All model calls go through `scripts/lib/llm.ts`. Do not hard-code a
   provider. New providers are added by extending `resolveConfig()` / the call functions.

## Common tasks

Regenerate today's edition: `npm run generate`
Validate feeds without spending tokens: `npm run generate:dry`
Type-check: `npm run check`
Run tests: `npm test`
Build: `npm run build`

There is no network-dependent test; `test/` covers the pure logic (slugify, knowledge-card
matching, Google-News URL building, date formatting, edition loading, loose JSON parsing, article-id
sanitising). Correctness is validated by `npm test`, `npm run check`, `npm run build`, and a
`npm run generate:dry` feed check.

## Data model

The single source of truth for shapes is `src/lib/types.ts` (`Edition`, `Story`, `StaticLink`,
`Perspective`, `OnThisDayItem`). The generator must produce JSON that matches it; the site reads it
via `src/lib/editions.ts`.

Tag browsing is **client-side by design**: `src/pages/tags/index.astro` embeds a JSON payload built by
`src/lib/tags.ts` and filters it in the browser (time range + selected tag live in the URL query). Do
**not** add a page-per-tag generator — that is what this replaced, and it doesn't scale.

## Adding a source

Append to `SOURCES` in `config/sources.ts`. Prefer a native RSS/Atom URL. If a publisher has no feed
(CMS empty-feed or no RSS), use a Google-News `site:` feed and set `viaGoogle: true`. Quintype-based
sites (Newslaundry, The News Minute, Down To Earth, India Water Portal) need their S3 Atom mirror:
`https://prod-qt-images.s3.amazonaws.com/production/<slug>/feed.xml`.

## Gotchas

- `rss-parser`'s built-in timeout does not reliably abort stalled sockets; all network fetches go
  through the abortable `fetchXml()` in `scripts/lib/fetchFeeds.ts`. Keep it that way.
- `astro check` needs `@types/node` (already a devDependency).
- The build works with **zero editions** (empty state on the home page).
- Retention: the generator prunes editions beyond the last 400.

## Editing conventions

- No comments in generated JSON; comments in TS/JS only where intent is non-obvious.
- Keep the newsprint design system centralised in `src/styles/global.css` (CSS custom properties).
