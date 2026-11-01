import type { OnThisDayItem } from "../../src/lib/types";
import { chatJson } from "./llm";

// Wikimedia "On this day" feed — free, no key, clean licensing (CC BY-SA).
// https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/{MM}/{DD}
interface WikiEvent {
  year?: number;
  text?: string;
  pages?: { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } }[];
}

interface WikiResponse {
  events?: WikiEvent[];
  births?: WikiEvent[];
  deaths?: WikiEvent[];
}

export async function fetchOnThisDay(date: Date, useLlm: boolean): Promise<OnThisDayItem[]> {
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/all/${mm}/${dd}`;

  let data: WikiResponse;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "TheDailyBrief/1.0 (UPSC study aggregator)" },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`wiki ${res.status}`);
    data = (await res.json()) as WikiResponse;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }

  const pool: OnThisDayItem[] = [];
  const push = (list: WikiEvent[] | undefined, category: OnThisDayItem["category"]) => {
    for (const e of list || []) {
      if (!e.text || !e.year) continue;
      pool.push({
        year: String(e.year),
        title: e.text.length > 110 ? `${e.text.slice(0, 107)}…` : e.text,
        description: e.text,
        category,
      });
    }
  };
  push(data.events, "event");
  push(data.births, "birth");
  push(data.deaths, "death");

  if (!pool.length) return [];

  if (!useLlm) {
    return pool.slice(0, 6);
  }

  const shortlist = pool.slice(0, 40);
  try {
    const system = `You curate an "On This Day" column for Indian Civil Services (UPSC) aspirants.
From the candidate list, pick the 5 most exam-relevant items (history, polity, science, world events, notable figures linked to India or global affairs).
For each, rewrite the description into 1-2 clear sentences and add "upscLink": a short phrase on why it matters for the syllabus (or null).
Return STRICT JSON: {"items":[{"year":string,"title":string,"description":string,"category":"event"|"birth"|"death"|"discovery","upscLink":string|null}]}`;
    const user = `Candidates:\n${shortlist
      .map((p, i) => `[${i}] (${p.category}, ${p.year}) ${p.description}`)
      .join("\n")}\n\nPick 5 and rewrite.`;
    const res = await chatJson<{ items: OnThisDayItem[] }>([
      { role: "system", content: system },
      { role: "user", content: user },
    ]);
    if (res.items?.length) return res.items.slice(0, 6);
  } catch {
    // fall through to raw pool
  }
  return pool.slice(0, 6);
}
