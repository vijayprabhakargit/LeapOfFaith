import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

// Editions and quizzes are generated as JSON by scripts/generate.ts. They are
// read directly via fs in src/lib/editions.ts and src/lib/quizzes.ts, but
// registering the collections here keeps Astro's content layer happy and
// silences the auto-generation warning.
const editions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/editions" }),
});

const quizzes = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/quizzes" }),
});

export const collections = { editions, quizzes };
