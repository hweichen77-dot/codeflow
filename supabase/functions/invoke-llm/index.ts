import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Powers the code-editor "Explain" feature (AIExplainModal / CodeEditor).
// Uses the free Groq backend — same provider as ai-tutor / llm-playground — so
// there is no paid Anthropic spend. Get a free key at
// https://console.groq.com/keys and set it as GROQ_API_KEY.
const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const MODEL = Deno.env.get("GROQ_MODEL") ?? "llama-3.3-70b-versatile";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FUNCTION_SHARED_SECRET = Deno.env.get("FUNCTION_SHARED_SECRET");
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://hweichen77-dot.github.io";

const MAX_PROMPT_CHARS = 8000;

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

// Per-isolate global circuit breaker. The per-user/IP limiter bounds one caller;
// this bounds the worst-case fan-out any single isolate can drive at the free
// Groq backend even under many accounts / spoofed IPs. Ceiling, not exact quota.
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

const cors = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-function-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Vary": "Origin",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

async function authenticate(req: Request): Promise<string | null> {
  if (FUNCTION_SHARED_SECRET) {
    const provided = req.headers.get("x-function-secret");
    if (provided && provided === FUNCTION_SHARED_SECRET) return "secret";
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  if (token === SUPABASE_ANON_KEY) return null;

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const caller = await authenticate(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const rlKey = caller === "secret" ? `ip:${ip}` : `user:${caller}`;
  if (rateLimited(rlKey)) return json({ error: "rate limit exceeded" }, 429);
  if (globalLimited()) return json({ error: "service busy, try again shortly" }, 429);

  try {
    const { prompt, max_tokens } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return json({ error: "missing prompt" }, 400);
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      return json({ error: "prompt too large" }, 413);
    }
    if (!GROQ_API_KEY) {
      return json({ text: "AI exec endpoint is not configured (GROQ_API_KEY unset)." });
    }

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: Math.min(Number(max_tokens) || 1024, 4096),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      console.error(`groq ${resp.status}: ${detail.slice(0, 500)}`);
      return json({ error: "upstream model error" }, 502);
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return json({ text });
  } catch (e) {
    console.error("invoke-llm error:", e);
    return json({ error: "internal error" }, 500);
  }
});
