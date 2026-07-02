// Live LLM Playground runner.
//
// Powers CodeFlow's differentiator: lessons where a learner writes a real system
// prompt and it is executed against a live model over several (often adversarial)
// user inputs. The model's real outputs come back to the client, which grades
// them against the scenario's rules.
//
// Unlike invoke-llm (which requires a signed-in user), this endpoint is
// intentionally anon-friendly so guests can try it with no sign-in wall. Abuse
// is contained by: strict per-IP rate limiting, a hard cap on inputs per call,
// small max_tokens, a cheap model, and length caps on all user-supplied text.

// Google Gemini Flash — generous free tier keeps the playground $0 to run.
// Get a free key at https://aistudio.google.com/apikey and set it as GEMINI_API_KEY.
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
const MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.0-flash";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://hweichen77-dot.github.io";

const MAX_SYSTEM_CHARS = 4000;
const MAX_INPUT_CHARS = 600;
const MAX_INPUTS = 5;
const MAX_TOKENS_CAP = 320;

// Per-IP rate limit. Each request may fan out to MAX_INPUTS model calls, so keep
// the request budget modest.
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now >= entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

function corsHeaders(origin: string | null) {
  // Allow the configured origin plus localhost for local dev/preview.
  const ok =
    origin &&
    (origin === ALLOWED_ORIGIN || /^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin));
  return {
    "Access-Control-Allow-Origin": ok ? origin! : ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

Deno.serve(async (req: Request) => {
  const cors = corsHeaders(req.headers.get("Origin"));
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  if (rateLimited(`ip:${ip}`)) return json({ error: "rate limit exceeded — wait a minute and try again" }, 429);

  let payload: { systemPrompt?: string; inputs?: unknown; maxTokens?: number };
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid JSON body" }, 400);
  }

  const systemPrompt = typeof payload.systemPrompt === "string" ? payload.systemPrompt : "";
  if (!systemPrompt.trim()) return json({ error: "missing systemPrompt" }, 400);
  if (systemPrompt.length > MAX_SYSTEM_CHARS) return json({ error: "systemPrompt too long" }, 413);

  const rawInputs = Array.isArray(payload.inputs) ? payload.inputs : [];
  const inputs = rawInputs
    .filter((x) => typeof x === "string")
    .slice(0, MAX_INPUTS)
    .map((x) => (x as string).slice(0, MAX_INPUT_CHARS));
  if (inputs.length === 0) return json({ error: "provide 1–5 test inputs" }, 400);

  if (!GEMINI_API_KEY) {
    return json({ configured: false, error: "Live grading is not configured yet (GEMINI_API_KEY unset)." });
  }

  const maxTokens = Math.min(Number(payload.maxTokens) || 200, MAX_TOKENS_CAP);
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const results = await Promise.all(
      inputs.map(async (input) => {
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts: [{ text: input }] }],
            generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 },
          }),
        });
        if (!resp.ok) {
          const detail = await resp.text();
          return { input, output: "", error: `model error ${resp.status}`, detail: detail.slice(0, 300) };
        }
        const data = await resp.json();
        // Gemini may return multiple parts; concatenate any text parts. An empty
        // result usually means a safety block — the grader handles it as a fail.
        const parts = data?.candidates?.[0]?.content?.parts ?? [];
        const output = parts.map((p: { text?: string }) => p?.text || "").join("").trim();
        return { input, output };
      }),
    );
    return json({ configured: true, model: MODEL, results });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
