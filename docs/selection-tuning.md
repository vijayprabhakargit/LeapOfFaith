# Selection tuning: a wider Hindu / Indian Express pull

**Status: implemented (2026-11-05).** The core papers — The Hindu and The Indian
Express — are now read much more deeply than the rest, so a paper-heavy day is
covered more fully.

## What changed

Two selection controls live in `scripts/lib/enrich.ts` as `CORE_PAPERS` (keyed by
`outletFamily()`), and are applied in both selection lanes in
`scripts/generate.ts`:

| Knob | Everyone else | Core papers |
| --- | --- | --- |
| Shortlist fraction (Lane 1, `shortlistPerSource`) | 20% | **45%** |
| Shortlist cap (`maxPer`) | 10 | **60** |
| Preselect per-family cap (Lane 2, `preselectByHeadlines`) | 10 | **30** |
| Preselect total (`limit`) | was 90 → now **130** | — |
| `PRIMARY_STORIES` | was 16 → now **21** | — |

Selection groups by **outlet family**, so "The Hindu" means all three Hindu feeds
(national + world + opinion) combined, and "The Indian Express" its two feeds.

## Why 45%, not 80%

Because the shortlist cap (`maxPer`) binds first, the percentage barely matters
near the top. On a live pull: The Hindu 115 articles/24h → 45% = 52, 80% = 92
(cap 60); Indian Express 203 → 45% = 91, 80% = 163 (cap 60). Both fill the cap,
so 45% is the more conservative choice that lands in the same place.

**The real levers are the caps**, not the percentage — without raising
`preselectCap` (and the total `limit`), a bigger percentage changes nothing,
because preselect would still admit only 10 per family.

## Measured effect (live fetch, 2026-11-05, 1,117 articles)

| | Shortlist | Candidates | Families | Hindu | IE | Hindu+IE | Cluster in-tokens |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Before (90/10) | 166 | 90 | 27 | 10 | 10 | 20 | ~4,825 |
| After (130 + core) | 259 | 130 | 27 | 30 | 30 | **60** | ~6,937 |

All 27 families stay represented, so the extra breath for the core papers is
**additive**, not taken from other outlets.

## Cost

Clustering input grows ~44% (~+2,100 tokens) because the candidate pool went
90 → 130. The bigger term is enrichment: **21 stories instead of 16** (+31%),
each citing more articles. Overall expect roughly **1.3×–1.5×** the daily tokens
(~58k → ~75k–90k/edition). Clustering itself is capped, so most of the increase
is writing up more stories.

## Watch-outs

- More **single-source stories** (Hindu-only or IE-only). Expected and fine for
  breadth; the story card should still read well with one perspective.
- More near-duplicate items between the two core papers; the existing
  cross-source stitching and `clusterScore` should absorb most of it.
- Re-check the numbers on a slow news day — 203/115 above is a busy day.
- Tilting further: raise `preselectCap` (per core paper) and/or `PRIMARY_STORIES`
  before raising the percentage. Bumping the total `limit` is the main token lever.

## Reading the "N articles" stat

The number shown at the top of an edition is **every article fetched in the 24h
window** (`stats.articles = articles.length` in `scripts/generate.ts`), before any
shortlisting or preselect. The per-edition `/editions/<date>/articles/` page groups
that same set by feed, so its total matches the stat. The shortlist/preselect
counts above are internal and never appear on the site.
