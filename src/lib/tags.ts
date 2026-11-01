import { getAllEditions } from "./editions";
import { tagSlug } from "./format";

export interface TagStory {
  date: string;
  slug: string;
  headline: string;
  category: string;
}

export interface TagEntry {
  tag: string;
  slug: string;
  count: number;
  stories: TagStory[];
}

let cache: TagEntry[] | null = null;

// Every tag used across every edition, with the stories that carry it.
// Powers the archive tag cloud and the per-tag listing pages.
export function getTagIndex(): TagEntry[] {
  if (cache) return cache;
  const map = new Map<string, { tag: string; stories: TagStory[] }>();
  for (const edition of getAllEditions()) {
    for (const story of edition.stories) {
      for (const raw of story.tags || []) {
        const tag = raw.trim();
        if (!tag) continue;
        const slug = tagSlug(tag);
        if (!slug) continue;
        const entry = map.get(slug) ?? { tag, stories: [] };
        entry.stories.push({
          date: edition.date,
          slug: story.slug,
          headline: story.headline,
          category: story.category,
        });
        map.set(slug, entry);
      }
    }
  }
  cache = [...map.entries()]
    .map(([slug, v]) => ({
      slug,
      tag: v.tag,
      count: v.stories.length,
      stories: v.stories.sort((a, b) => (a.date < b.date ? 1 : -1)),
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  return cache;
}

export function getTagBySlug(slug: string): TagEntry | null {
  return getTagIndex().find((t) => t.slug === slug) ?? null;
}
