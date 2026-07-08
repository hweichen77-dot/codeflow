
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const MODEL = Deno.env.get("GROQ_MODEL") ?? "llama-3.3-70b-versatile";
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://hweichen77-dot.github.io";

const MAX_SYSTEM_CHARS = 4000;
const MAX_INPUT_CHARS = 600;
const MAX_INPUTS = 3;
const MAX_TOKENS_CAP = 256;

const RATE_LIMIT_MAX = 6;
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

const GLOBAL_MAX_PER_WINDOW = 120;
let globalCount = 0;
let globalResetAt = 0;

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

function globalLimited(): boolean {
  const now = Date.now();
  if (now >= globalResetAt) {
    globalCount = 1;
    globalResetAt = now + RATE_LIMIT_WINDOW_MS;
    return false;
  }
  globalCount += 1;
  return globalCount > GLOBAL_MAX_PER_WINDOW;
}

function corsHeaders(origin: string | null) {

  const ok =
    origin &&
    (origin === ALLOWED_ORIGIN ||
      origin === "tauri://localhost" ||
      origin === "http://tauri.localhost" ||
      /^http:\/\/localhost(:\d+)?$/.test(origin) ||
      /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin));
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
  if (globalLimited()) return json({ error: "the playground is busy right now — try again shortly" }, 429);

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

  if (!GROQ_API_KEY) {
    return json({ configured: false, error: "Live grading is not configured yet (GROQ_API_KEY unset)." });
  }

  const maxTokens = Math.min(Number(payload.maxTokens) || 200, MAX_TOKENS_CAP);
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";

  try {
    const results = await Promise.all(
      inputs.map(async (input) => {
        const resp = await fetch(endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: input },
            ],
            max_tokens: maxTokens,
            temperature: 0.7,
          }),
        });
        if (!resp.ok) {
          const detail = await resp.text();
          console.error(`groq ${resp.status}: ${detail.slice(0, 500)}`);
          return { input, output: "", error: "model error" };
        }
        const data = await resp.json();

        const output = (data?.choices?.[0]?.message?.content || "").trim();
        return { input, output };
      }),
    );
    return json({ configured: true, model: MODEL, results });
  } catch (e) {
    console.error("llm-playground error:", e);
    return json({ error: "internal error" }, 500);
  }
});
