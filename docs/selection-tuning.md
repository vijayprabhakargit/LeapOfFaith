# Selection tuning: a wider Hindu / Indian Express pull

**Status: evaluated, not implemented.** The idea is to read more of the two
"core" papers for UPSC — The Hindu and The Indian Express — so a paper-heavy day
is covered end-to-end, instead of only its top 20% like every other feed.

## The proposal

Today `shortlistPerSource(articles, 0.2, 3, 10)` keeps each **outlet family's**
top ~20% by feed order (`scripts/lib/enrich.ts`). The idea: keep 20% for all
feeds, but raise **The Hindu** and **The Indian Express** to ~80%, let their
articles stitch into stories (possibly single-source ones), and raise the story
count a little to absorb the extra articles.

## What we measured (live fetch, 2026-11-05)

35/35 feeds OK, **1,134 articles in the 24 h window**. The two "boost" families:

| Outlet family | Feeds | Articles in window |
| --- | --- | --- |
| The Indian Express | 2 (`feed`, `explained`) | 203 |
| The Hindu | 3 (`national`, `world`, `opinion`) | 115 |

> Note: selection groups by **outlet family**, so "80% for The Hindu" means 80% of
> all three Hindu feeds combined, not 80% per feed.

### The catch: the percentage alone changes nothing

`preselectByHeadlines(...)` caps the cluster input at **90 candidates total** and
**10 per family**. Both families already hit the 10-cap at 20%, so raising the
percentage only pads a shortlist that is then trimmed away:

| Scenario | Shortlist | Candidates | Hindu/IE in candidates | Cluster input (tokens) |
| --- | --- | --- | --- | --- |
| Current (20%, cap 10) | 170 | 90 | 20 | ~4,870 |
| 80% only, no other change | 268 | 90 | 20 | ~5,060 |
| 80% + candidate limit 120, family cap 25 | 268 | 120 | 50 | ~6,410 |
| 80% + candidate limit 150, family cap 35 | 268 | 150 | 70 | ~7,690 |
| 80% + candidate limit 180, family cap 45 | 268 | 180 | 90 | ~9,110 |

To actually get more Hindu/IE articles into stories we must **also** raise the
candidate limit and the per-family cap, and likely `PRIMARY_STORIES`
(currently 16, `scripts/generate.ts`).

## Token / load impact

Current per edition (measured from a generated edition + prompt construction):

| Stage | Input | Output |
| --- | --- | --- |
| Clustering (90 candidates) | ~4,900 | ~2,500 |
| Enrich (16 stories) | ~21,600 | ~27,500 |
| On This Day | ~1,200 | ~600 |
| **Total** | | **~58,000 tokens/edition** |

With a realistic boost — candidate limit ~120–150, family cap ~25–35,
`PRIMARY_STORIES` ~20–22, and average articles/story rising from ~5.1 to ~6.5 —
the daily total lands around **~75,000–95,000 tokens**, roughly **1.3×–1.7×**
today. In absolute terms that is **+17k to +37k tokens/day**; at flash-tier
pricing the marginal cost is small (multiply by your provider's per-token rate).
Clustering is barely affected (it is capped); the cost is almost entirely in
enrich, because we write up more stories that each cite more articles.

## Recommendation

Feasible and cheap in absolute terms, but **not a one-line percentage change** —
it needs a per-family selector plus higher caps. If we do it:

- Model it as `BOOST: { family: { pct, maxPer } }` so `shortlistPerSource` keeps
  per-family controls instead of one global `pct`, and give
  `preselectByHeadlines` a per-family cap (or a family → cap map) rather than a
  single `perFamilyCap`.
- Start modest: candidate limit ~120, family cap ~25, `PRIMARY_STORIES` ~20.
  That already puts ~50 Hindu/IE articles into the pool for ~6.4k cluster tokens.
- Expect more **single-source stories** (Hindu-only or IE-only). That is fine for
  breadth, but the cluster prompt should explicitly allow it and the story card
  should read well with one perspective.
- Watch for redundancy: two "core" papers covered end-to-end will surface more
  near-duplicate items; the existing cross-source stitching and `clusterScore`
  should absorb most of it, but worth an audit after the first runs.
- Re-run this measurement on a slow news day too — the 203/115 split above is a
  busy day and is not guaranteed.
