import { test } from "node:test";
import assert from "node:assert/strict";
import { parseJsonLoose, chat, chatJson } from "../scripts/lib/llm";

test("parses plain JSON objects", () => {
  assert.deepEqual(parseJsonLoose('{"a":1}'), { a: 1 });
});

test("parses JSON arrays", () => {
  assert.deepEqual(parseJsonLoose("[1,2,3]"), [1, 2, 3]);
});

test("strips ```json fences", () => {
  const raw = '```json\n{"brief":["x"],"stories":[]}\n```';
  assert.deepEqual(parseJsonLoose(raw), { brief: ["x"], stories: [] });
});

test("strips bare ``` fences", () => {
  const raw = "```\n{\"ok\":true}\n```";
  assert.deepEqual(parseJsonLoose(raw), { ok: true });
});

test("recovers JSON embedded in prose", () => {
  const raw = 'Sure! Here is the result:\n{"level":3}\nHope that helps.';
  assert.deepEqual(parseJsonLoose(raw), { level: 3 });
});

test("recovers an array embedded in prose", () => {
  const raw = "Here you go: [{\"id\":\"a\"}] done";
  assert.deepEqual(parseJsonLoose(raw), [{ id: "a" }]);
});

test("throws when there is no JSON at all", () => {
  assert.throws(() => parseJsonLoose("no json here"));
});

// --- retry behaviour -------------------------------------------------------
// A transient provider failure must be retried inside the adapter, because a
// story that bubbles the error up used to become a dry-run placeholder.

const ENV = {
  LLM_PROVIDER: "openai",
  LLM_API_KEY: "test-key",
  LLM_MODEL: "test-model",
  LLM_BASE_URL: "https://llm.test/v1",
};

function withEnv(vars: Record<string, string>): () => void {
  const prev: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(vars)) {
    prev[k] = process.env[k];
    process.env[k] = v;
  }
  return () => {
    for (const k of Object.keys(vars)) {
      if (prev[k] === undefined) delete process.env[k];
      else process.env[k] = prev[k];
    }
  };
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

function completion(content: string): Response {
  return jsonResponse({ choices: [{ message: { content } }] });
}

function mockFetch(responses: Array<() => Response | Promise<Response>>) {
  const original = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = (async () => {
    const make = responses[Math.min(calls, responses.length - 1)];
    calls++;
    return make();
  }) as typeof fetch;
  return {
    calls: () => calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

test("chat retries a transient 429 and succeeds", async () => {
  const restoreEnv = withEnv(ENV);
  const mock = mockFetch([() => jsonResponse({ error: "rate limited" }, 429), () => completion('{"ok":true}')]);
  try {
    const out = await chat([{ role: "user", content: "hi" }]);
    assert.equal(out, '{"ok":true}');
    assert.equal(mock.calls(), 2, "one retry after the 429");
  } finally {
    mock.restore();
    restoreEnv();
  }
});

test("chat retries a network error and succeeds", async () => {
  const restoreEnv = withEnv(ENV);
  const mock = mockFetch([
    () => {
      throw new TypeError("fetch failed");
    },
    () => completion('{"ok":true}'),
  ]);
  try {
    const out = await chat([{ role: "user", content: "hi" }]);
    assert.equal(out, '{"ok":true}');
    assert.equal(mock.calls(), 2);
  } finally {
    mock.restore();
    restoreEnv();
  }
});

test("chat does not retry a non-retryable 401", async () => {
  const restoreEnv = withEnv(ENV);
  const mock = mockFetch([() => jsonResponse({ error: "unauthorized" }, 401)]);
  try {
    await assert.rejects(() => chat([{ role: "user", content: "hi" }]), /LLM 401/);
    assert.equal(mock.calls(), 1, "no retry for a 401");
  } finally {
    mock.restore();
    restoreEnv();
  }
});

test("chatJson re-asks once when the model returns malformed JSON", async () => {
  const restoreEnv = withEnv(ENV);
  const mock = mockFetch([() => completion("not json at all"), () => completion('{"ok":true}')]);
  try {
    const out = await chatJson<{ ok: boolean }>([{ role: "user", content: "hi" }]);
    assert.deepEqual(out, { ok: true });
    assert.equal(mock.calls(), 2, "one fresh call after the parse failure");
  } finally {
    mock.restore();
    restoreEnv();
  }
});
