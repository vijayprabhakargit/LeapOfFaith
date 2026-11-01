// Provider-agnostic LLM adapter.
//
// Configure with environment variables (see .env.example):
//   LLM_PROVIDER = openai | anthropic | gemini | openrouter | compatible
//   LLM_MODEL    = e.g. gpt-4o-mini | claude-3-5-sonnet-latest | gemini-1.5-flash
//   LLM_API_KEY  = your key (or set the provider-specific var)
//   LLM_BASE_URL = only for provider=compatible / self-hosted
//
// The adapter always asks for JSON and returns a parsed object, so callers
// never have to deal with markdown fences or prose wrappers.

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ProviderConfig {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
}

function resolveConfig(): ProviderConfig {
  const provider = (process.env.LLM_PROVIDER || "openai").toLowerCase();
  const baseByProvider: Record<string, string> = {
    openai: "https://api.openai.com/v1",
    openrouter: "https://openrouter.ai/api/v1",
    compatible: process.env.LLM_BASE_URL || "http://localhost:11434/v1",
    anthropic: "https://api.anthropic.com/v1",
    gemini: "https://generativelanguage.googleapis.com/v1beta",
  };
  const keyByProvider: Record<string, string | undefined> = {
    openai: process.env.OPENAI_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
    anthropic: process.env.ANTHROPIC_API_KEY,
    gemini: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    compatible: process.env.LLM_API_KEY,
  };
  const defaultModel: Record<string, string> = {
    openai: "gpt-4o-mini",
    openrouter: "openai/gpt-4o-mini",
    anthropic: "claude-3-5-sonnet-latest",
    gemini: "gemini-2.0-flash",
    compatible: "llama3.1",
  };
  const apiKey = process.env.LLM_API_KEY || keyByProvider[provider] || "";
  const model = process.env.LLM_MODEL || defaultModel[provider] || "gpt-4o-mini";
  const baseUrl = (process.env.LLM_BASE_URL || baseByProvider[provider] || "").replace(/\/$/, "");
  return { provider, model, apiKey, baseUrl };
}

export function llmConfigured(): boolean {
  const c = resolveConfig();
  // Local/self-hosted servers legitimately need no key.
  if (c.provider === "compatible" && /localhost|127\.0\.0\.1/.test(c.baseUrl)) return true;
  return Boolean(c.apiKey);
}

export function describeLlm(): string {
  const c = resolveConfig();
  return `${c.provider}/${c.model}`;
}

export function parseJsonLoose(raw: string): unknown {
  let text = raw.trim();
  // Strip ```json ... ``` fences.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) text = fence[1].trim();
  // Fall back to the outermost {...} or [...] span.
  try {
    return JSON.parse(text);
  } catch {
    const firstBrace = text.search(/[[{]/);
    const lastBrace = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      return JSON.parse(text.slice(firstBrace, lastBrace + 1));
    }
    throw new Error("Model did not return parseable JSON");
  }
}

const LLM_TIMEOUT_MS = 60000;

// Abortable fetch so a provider that accepts the connection but never responds
// cannot hang the whole generation run.
async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callOpenAiCompatible(c: ProviderConfig, messages: ChatMessage[]): Promise<string> {
  const res = await fetchWithTimeout(`${c.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${c.apiKey}`,
    },
    body: JSON.stringify({
      model: c.model,
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  return data.choices?.[0]?.message?.content ?? "";
}

async function callAnthropic(c: ProviderConfig, messages: ChatMessage[]): Promise<string> {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const rest = messages.filter((m) => m.role !== "system");
  const res = await fetchWithTimeout(`${c.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": c.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: c.model,
      max_tokens: 8000,
      temperature: 0.3,
      system,
      messages: rest.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  return data.content?.[0]?.text ?? "";
}

async function callGemini(c: ProviderConfig, messages: ChatMessage[]): Promise<string> {
  const system = messages.filter((m) => m.role === "system").map((m) => m.content).join("\n\n");
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] }));
  const res = await fetchWithTimeout(`${c.baseUrl}/models/${c.model}:generateContent?key=${c.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: system ? { parts: [{ text: system }] } : undefined,
      contents,
      generationConfig: { temperature: 0.3, responseMimeType: "application/json" },
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function chat(messages: ChatMessage[]): Promise<string> {
  const c = resolveConfig();
  const run =
    c.provider === "anthropic" ? callAnthropic : c.provider === "gemini" ? callGemini : callOpenAiCompatible;
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await run(c, messages);
    } catch (err) {
      lastErr = err;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr));
}

export async function chatJson<T>(messages: ChatMessage[]): Promise<T> {
  const raw = await chat(messages);
  return parseJsonLoose(raw) as T;
}
