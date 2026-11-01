// @ts-check
import { defineConfig } from "astro/config";

// The Daily Brief — a static, edition-per-day newspaper.
// Deployed to Cloudflare Pages. Content is generated as JSON files under
// src/content/editions/ by `npm run generate`.
export default defineConfig({
  site: "https://leap-of-faith.pages.dev",
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  server: { port: 4321 },
});
