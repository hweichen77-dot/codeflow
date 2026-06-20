// Supabase Edge Function: invoke-llm
// Routes code-execution-simulation (and any LLM prompt) through Anthropic,
// keeping the API key server-side. The browser/desktop app calls this via
// supabase.functions.invoke('invoke-llm', { body: { prompt } }).
//
// Deploy (auth required — verify_jwt=true is the default and is set in
// config.toml; do NOT pass --no-verify-jwt):
//   supabase functions deploy invoke-llm
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase secrets set ALLOWED_ORIGIN=https://<your-site>      # CORS lock
//   supabase secrets set FUNCTION_SHARED_SECRET=<random>          # optional
//
// Then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time so the
// client picks it up. With no Supabase configured, the app falls back to an
// offline message (the UI never crashes).
//
// Hardening: this endpoint is an Anthropic relay on the owner's key, so it is
// gated by a valid Supabase JWT (or a shared-secret header), a per-caller rate
// limit, a prompt-size cap, and an origin-locked CORS policy.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const MODEL = "claude-haiku-4-5-20251001";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FUNCTION_SHARED_SECRET = Deno.env.get("FUNCTION_SHARED_SECRET");
// Lock CORS to the site origin. Falls back to the deployed GitHub Pages site.
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://hweichen77-dot.github.io";

const MAX_PROMPT_CHARS = 8000; // ~8KB prompt cap

// Per-caller fixed-window rate limit (best-effort; in-memory per edge worker).
const RATE_LIMIT_MAX = 20; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // per minute
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

// Validate the caller: a shared-secret header OR a verifiable Supabase JWT.
// Returns the user id (or "secret") on success, null on failure.
async function authenticate(req: Request): Promise<string | null> {
  if (FUNCTION_SHARED_SECRET) {
    const provided = req.headers.get("x-function-secret");
    if (provided && provided === FUNCTION_SHARED_SECRET) return "secret";
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  const token = authHeader.slice("Bearer ".length).trim();
  // The anon key is also sent as a Bearer token by supabase-js; reject it so a
  // bare anon key cannot stand in for a logged-in user.
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

  // Require a valid caller before doing any work.
  const caller = await authenticate(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  // Best-effort per-caller rate limit (per edge worker / in-memory).
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const rlKey = caller === "secret" ? `ip:${ip}` : `user:${caller}`;
  if (rateLimited(rlKey)) return json({ error: "rate limit exceeded" }, 429);

  try {
    const { prompt, max_tokens } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return json({ error: "missing prompt" }, 400);
    }
    if (prompt.length > MAX_PROMPT_CHARS) {
      return json({ error: "prompt too large" }, 413);
    }
    if (!ANTHROPIC_API_KEY) {
      return json({ text: "AI exec endpoint is not configured (ANTHROPIC_API_KEY unset)." });
    }

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: Math.min(Number(max_tokens) || 1024, 4096),
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json({ error: `anthropic ${resp.status}`, detail }, 502);
    }

    const data = await resp.json();
    const text = data?.content?.[0]?.text ?? "";
    return json({ text });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
