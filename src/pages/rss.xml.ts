import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getAllEditions } from "../lib/editions";

export async function GET(context: APIContext) {
  const editions = getAllEditions();
  const items = editions.slice(0, 7).flatMap((edition) =>
    edition.stories.map((story) => ({
      title: story.headline,
      description: [
        story.summary,
        story.whyItMatters ? `\n\nWhy it matters: ${story.whyItMatters}` : "",
        story.static.length ? `\n\nStatic syllabus: ${story.static.map((s) => `${s.topic} (${s.paper})`).join("; ")}` : "",
      ]
        .filter(Boolean)
        .join(""),
      link: `/editions/${edition.date}/#story-${story.slug}`,
      pubDate: new Date(edition.generatedAt),
      categories: [story.category, story.region, ...story.tags],
    })),
  );

  return rss({
    title: "Leap of Faith — The Daily Brief",
    description:
      "A daily, AI-curated current-affairs newspaper for UPSC — stories stitched across trusted sources, with the static syllabus linked in.",
    site: context.site ?? "https://leapoffaith.fyi",
    items,
    customData: "<language>en-in</language>",
  });
}
