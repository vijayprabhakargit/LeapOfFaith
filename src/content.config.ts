import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Editions are generated as JSON by scripts/generate.ts. They are read directly
// via fs in src/lib/editions.ts, but registering the collection here keeps
// Astro's content layer happy and silences the auto-generation warning.
const editions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/editions" }),
});

export const collections = { editions };
