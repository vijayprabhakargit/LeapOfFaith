// Edition-level reference index for the static-syllabus panels.
//
// The static panels are the "go deeper" section of a story, so each one cites
// its sources. References are curated per knowledge card (config/syllabus.ts)
// or fall back to a Wikipedia search URL we build ourselves — the LLM never
// emits a URL, so every href here is real.
//
// Numbering is computed at render time in document order, deduped by href, so
// the superscripts and the References section are generated from one pass and
// cannot drift. One href gets one number, however many panels cite it.

import type { Reference, ReferenceKind, StaticLink, Story } from "./types";
import { matchKnowledgeCards, referencesForCard } from "../../config/syllabus";

export interface Citation {
  // Anchor id of the superscript instance that cites this reference.
  anchor: string;
  storyIndex: number;
  storySlug: string;
  storyHeadline: string;
  staticIdx: number;
  topic: string;
}

export interface ReferenceEntry {
  n: number;
  label: string;
  href: string;
  kind: ReferenceKind;
  citations: Citation[];
}

export interface ReferenceIndex {
  entries: ReferenceEntry[];
  // Story index -> per-static-link reference numbers, aligned with story.static.
  byStoryIndex: Map<number, number[][]>;
}

export function referenceAnchor(n: number): string {
  return `ref-${n}`;
}

export function citationAnchor(storyIndex: number, staticIdx: number, n: number): string {
  return `cite-${storyIndex}-${staticIdx}-${n}`;
}

// A Wikipedia search URL is always valid and never fabricated, so it is the
// safe fallback when a static topic matches no curated knowledge card.
export function wikipediaSearch(topic: string): Reference {
  return {
    label: `Wikipedia search: ${topic}`,
    href: `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(topic)}`,
    kind: "search",
  };
}

// Match the static link to its best knowledge card. The topic + syllabus node
// are precise enough to identify the card; the long body is deliberately not
// used, so a stray keyword in prose cannot pull in an unrelated card.
export function referencesForStaticLink(link: StaticLink): Reference[] {
  const [card] = matchKnowledgeCards(`${link.topic} ${link.syllabusNode}`, 1);
  const curated = card ? referencesForCard(card.id) : [];
  return curated.length > 0 ? curated : [wikipediaSearch(link.topic)];
}

export function buildReferenceIndex(stories: Story[]): ReferenceIndex {
  const entries: ReferenceEntry[] = [];
  const byHref = new Map<string, ReferenceEntry>();
  const byStoryIndex = new Map<number, number[][]>();

  stories.forEach((story, storyIndex) => {
    const perStatic: number[][] = story.static.map((link, staticIdx) => {
      const numbers: number[] = [];
      for (const ref of referencesForStaticLink(link)) {
        let entry = byHref.get(ref.href);
        if (!entry) {
          entry = { n: entries.length + 1, label: ref.label, href: ref.href, kind: ref.kind, citations: [] };
          byHref.set(ref.href, entry);
          entries.push(entry);
        }
        const n = entry.n;
        if (!numbers.includes(n)) numbers.push(n);
        entry.citations.push({
          anchor: citationAnchor(storyIndex, staticIdx, n),
          storyIndex,
          storySlug: story.slug,
          storyHeadline: story.headline,
          staticIdx,
          topic: link.topic,
        });
      }
      return numbers;
    });
    byStoryIndex.set(storyIndex, perStatic);
  });

  return { entries, byStoryIndex };
}
