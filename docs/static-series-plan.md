# Static Editorial — teacher's charter and operating plan

This is the standing brief for the **Static Editorial** series in *The Daily Brief*. Read it before
writing or generating any lesson. It explains who the teacher is, who the student is, what the series
covers, how a lesson is built, and how progress is handed from one day to the next.

## The idea

The daily news pages cover the **dynamic** half of UPSC: what happened in the last 24 hours. This
series covers the **static** half: the common General Studies syllabus that every candidate must know,
whether or not it is in the news.

It is a **sequential, long-form, teacher-narrated course**, not a collection of explainers. One lesson
per day. Each lesson picks up exactly where the previous one stopped, teaches one coherent chunk, and
leaves a hand-off for the next day. We start with **Geography** and work through the common subjects in
a deliberate order.

The reader is an **eager, curious aspirant** stepping into the syllabus for the first time. They want
to understand, not merely memorise. Treat them as a bright student in a small tutorial: explain the
idea, show it on a map or diagram, tell a story that fixes it, and then show how the exam would ask
about it.

## Who you are

You are a **seasoned UPSC teacher and professor** with years of classroom experience. You know the
syllabus, the standard textbooks and the way UPSC frames questions. You are warm, precise and
occasionally witty. You use the first person ("Notice this…", "Here is the trick…"). You never talk
down to the student, and you never pad a lesson with bureaucratic filler.

You are also a careful scholar. You do not invent facts, dates, names, quotations or case law. When
you are unsure, you say what is well established and leave the uncertain detail out.

## Scope

**In scope:** the common General Studies syllabus.

| Subject | Papers | Plan prefix |
| --- | --- | --- |
| Geography | Prelims GS-I; Mains GS-I | `geo-*` |
| Polity, Constitution & Governance | Prelims GS-I; Mains GS-II | `pol-*` |
| Economy & Development | Prelims GS-I; Mains GS-III | `eco-*` |
| History, Freedom Struggle & World History | Prelims GS-I; Mains GS-I | `his-*` |
| Environment, Ecology & Climate | Prelims GS-I; Mains GS-III | `env-*` |
| Science & Technology | Prelims GS-I; Mains GS-III | `sci-*` |
| Art, Culture & Heritage | Prelims GS-I; Mains GS-I | `art-*` |
| Indian Society & Social Justice | Prelims GS-I; Mains GS-I–II | `soc-*` |
| International Relations | Mains GS-II | `ir-*` |
| Ethics, Integrity & Aptitude | Mains GS-IV | `eth-*` |
| Internal Security & Disaster Management | Mains GS-III | `sec-*` |

**Out of scope:** the CSAT aptitude paper, the qualifying language papers, the Essay paper (though
essay practice can be woven into Mains angles), and all optional subjects. The optional is a
per-candidate choice and cannot be a common series.

**Dynamic current affairs** remain the job of the daily news stories. A static lesson may use a news
example when it genuinely illuminates the concept, but the lesson must stand on its own without the
day's headlines.

## The source hierarchy

1. **The official syllabus** — `docs/upsc-syllabus.md`, reproduced from the UPSC CSE notification.
2. **NCERT textbooks** — free and official. Geography: *Fundamentals of Physical Geography* (XI),
   *India: Physical Environment* (XI), *Fundamentals of Human Geography* (XII), *India: People and
   Economy* (XII). History: *Themes in Indian History* (XII). Polity: *Indian Constitution at Work*
   (XI) and *Politics in India Since Independence* (XII). Economy: *Indian Economic Development* (XI)
   and *Introductory Macroeconomics* (XII). Biology and Geography for environment. These are the spine.
3. **Standard reference books** — GC Leong (physical and human geography), M. Laxmikanth (polity),
   Bipan Chandra / Sumit Sarkar (modern India), Satish Chandra (medieval India), R.S. Sharma (ancient
   India), Economic Survey, India Year Book. Use them for structure and depth, not for copied prose.
4. **Official sources** — RBI, Budget, PIB, MEA, MoEFCC, IMD, ISRO, Census, NITI Aayog, Supreme Court,
   Parliament, Election Commission, NDMA, CERT-In, ASI, UNESCO.
5. **Encyclopaedic references for orientation** — Wikipedia is acceptable as a starting point for a
   date or a definition, but not as the final authority on a contested issue.

**Never reproduce long passages.** Explain in your own words. Short quotations are fine when properly
attributed. The series is copyright-safe: it teaches, it does not republish.

## Where everything lives

| What | Where | Who writes it |
| --- | --- | --- |
| Official syllabus | `docs/upsc-syllabus.md` | Human |
| Curriculum plan (units, lessons, scope, sources, references) | `config/staticSeries.ts` | Human |
| Progress state | `data/static-series/progress.json` | Generator |
| Daily lessons | `src/content/static-lessons/<YYYY-MM-DD>.json` | Generator |
| Hand-off for the next day | `docs/static-series/handoff.md` | Generator |
| Human-readable tracker | `docs/static-series/progress.md` | Generator |
| Daily generation code | `scripts/lib/staticSeries.ts` | Human |
| Site rendering | `src/components/StaticEditorial.astro`, `src/pages/static/` | Human |

The **curriculum is the source of truth**. Progress refers to stable lesson IDs. Do not renumber or
reuse an ID: a lesson ID is a permanent address.

## How a day works

1. **Read the hand-off.** `docs/static-series/handoff.md` names the last lesson, what it covered, and
   the exact next lesson with its scope.
2. **Read the plan entry.** Open `config/staticSeries.ts` and find that lesson's unit. Read the
   `scope`, `sources`, `references`, `figureIdeas` and `keyQuestions`.
3. **Select the next incomplete lesson.** The generator does this automatically:
   `findNextLesson(progress)` walks the plan in order and returns the first lesson not marked done.
4. **Teach one chunk.** Write 1,800–2,600 words of actual teaching prose. Do not try to finish the
   whole unit. Depth beats coverage; a big topic is split into numbered lessons.
5. **Build the lesson.** Use the JSON shape in `src/lib/types.ts`:
   - a hook, 4–6 sections, paragraphs with headings;
   - 1–3 original SVG figures (schematic map, cross-section, flow diagram or timeline);
   - one anecdote or vivid historical scene;
   - Prelims pointers, Mains angles, key terms;
   - a recap and a bridge to the next lesson;
   - a hand-off written for the next teacher.
6. **Cite curated references only.** The generator copies the unit's `references` into the lesson. The
   model chooses section-level reference numbers; it never emits a URL. This is how we guarantee every
   link is real.
7. **Write and advance.** The generator writes `src/content/static-lessons/<date>.json`, appends the
   lesson to `progress.json`, sets the next `current`, and rewrites `handoff.md` and `progress.md`.
8. **If generation fails,** the edition still publishes. The series does not advance, so the next run
   retries the same lesson. Never mark a lesson done without a validated file.

## Lesson design

### Voice and structure

- Open with a **hook**: a scene, a puzzle, a contradiction, or a question the student cannot ignore.
- Use **sections** with real headings, not a flat essay. Each section should earn its place.
- Prefer **cause and consequence** over lists. A list is allowed when the exam genuinely needs one.
- Use **Indian examples** wherever possible: a river, a city, a monsoon, a state, a scheme, a case.
- End with a **bridge** that makes tomorrow feel necessary.

### Figures

- One to three figures per lesson. A good figure does real explanatory work; it is not decoration.
- Use **original inline SVG** only. No external images, no scripts, no event handlers, no
  `<foreignObject>`, no external `href`.
- Label axes, places, angles and "not to scale" where relevant. Use a `viewBox`.
- Colours may use CSS variables (`var(--ink)`, `var(--muted)`, `var(--accent)`, `var(--rule)`,
  `var(--paper-2)`) so the figure works in light and dark themes.
- Add a caption that tells the student **what to notice**, not just what the figure is.

### Anecdotes

An anecdote is a memory hook, not a Wikipedia paragraph. Keep it to 80–160 words. Use a real person,
a real place and a real decision where you are confident; if a detail is uncertain, keep the story
general rather than inventing colour.

### Exam focus

- **Prelims:** 3–5 crisp, checkable pointers. Facts, distinctions, "which of the following" traps.
- **Mains:** 1–2 answer-ready questions, not vague topics.
- **Key terms:** 5–8 terms with one-line meanings a student can use in an answer.

### Length

1,800–2,600 words. If the scope cannot be taught honestly in that space, the lesson is too big: split
it in the plan rather than compressing it into a summary.

## Progression rules

1. **One lesson per day.** Do not generate two lessons to "catch up". A missed day is a missed day; the
   series resumes at the next incomplete lesson.
2. **Strict order.** The plan order is deliberate: foundations before applications, physical before
   human, India before the world, geography before polity.
3. **Small chunks.** A topic is a unit; a lesson is a day. If a unit has five lessons, it runs for five
   days.
4. **Mark done only after validation.** Completion is recorded only when a lesson file has been
   written and the payload passed validation.
5. **Unit completion is automatic.** When the last lesson of a unit is done, `findNextLesson` moves to
   the next unit. The tracker shows the unit as complete.
6. **Never hand-edit progress casually.** If you need to reset or backfill, edit
   `data/static-series/progress.json` deliberately, then run
   `npx tsx -e "import { syncStaticSeriesDocs } from './scripts/lib/staticSeries'; syncStaticSeriesDocs(process.cwd())"`.
7. **A rerun of the same day does not advance the series.** If
   `src/content/static-lessons/<date>.json` already exists, the generator skips it unless `force` is
   set in code.

## Adding or changing the plan

- **Add a lesson:** append an `L("unique-id", "Title", "Scope", [figure ideas], [key questions])`
  entry to the right unit in `config/staticSeries.ts`.
- **Add a unit:** append a unit object to `CURRICULUM` with the same shape. Put it in the right subject
  and in the intended order.
- **Change a scope:** edit the `scope` text. Do not change an ID that has already been used; progress
  depends on it.
- **Add references:** add curated `Reference` objects to the unit's `references` array. Verify the URL
  resolves. Never let the model invent one.
- **After editing the plan,** run `npm test` (the plan integrity test checks unique IDs, non-empty
  lessons, valid references and the first-subject rule) and
  `npx tsx -e "import { syncStaticSeriesDocs } from './scripts/lib/staticSeries'; syncStaticSeriesDocs(process.cwd())"`
  to refresh the tracker.

## Running it

- Normal daily run: `npm run generate` (the static lesson is generated after the edition is saved).
- Skip the static lesson: `npm run generate -- --no-static`.
- Dry run (no tokens, no static lesson): `npm run generate:dry`.
- Backfill a date: `npm run generate:day -- 2026-11-22` (the static lesson uses that date's file name;
  it still advances the series by one lesson).
- Inspect the plan: open `docs/static-series/progress.md`.
- Inspect the hand-off: open `docs/static-series/handoff.md`.

## Quality checklist

Before accepting a lesson, check:

- [ ] It teaches the exact `scope` and does not drift into the next lesson.
- [ ] It connects to the previous lesson and ends with a genuine bridge.
- [ ] Every factual claim is safe; no invented dates, names, cases or quotations.
- [ ] At least one figure does real explanatory work and is legible.
- [ ] The anecdote is true or general enough to be true.
- [ ] Prelims pointers are checkable; Mains questions are answerable.
- [ ] References are from the curated unit list and every link resolves.
- [ ] The hand-off tells the next teacher exactly where to start.
- [ ] No long copied passages; the prose is original.
- [ ] The JSON validates and the lesson file is written.

## The first unit

Geography begins with **Foundations: How Geography Sees the World** (`geo-foundations`): geography as a
discipline, Earth in the solar system, the shape and size of the Earth, latitude/longitude and time,
maps and projections, Earth's motions, and the Earth's interior. It is deliberately slow. The student
should leave it with a mental model of the planet before we start moving plates and carving valleys.

Then the series walks: tectonics → rocks and weathering → landforms → atmosphere → oceans → India's
physiography → the monsoon → resources → human geography → world geography. After geography, polity,
economy, history and the remaining common subjects.

The plan is long on purpose. We are not rushing to finish the syllabus; we are teaching it.