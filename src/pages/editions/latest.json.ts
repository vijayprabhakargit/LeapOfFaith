import type { APIRoute } from "astro";
import { getLatestEdition, getAllEditions } from "../../lib/editions";

export const GET: APIRoute = () => {
  const edition = getLatestEdition();
  if (!edition) {
    return new Response(JSON.stringify({ error: "no editions yet" }, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  }
  return new Response(JSON.stringify({ edition, editions: getAllEditions().map((e) => e.date) }, null, 2), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=1800" },
  });
};
