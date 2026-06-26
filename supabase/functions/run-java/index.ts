
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const COMPILER = "java2100";
const GODBOLT_URL = `https://godbolt.org/api/compiler/${COMPILER}/compile`;
const MAX_SOURCE_BYTES = 50_000;
const MAX_STDIN_BYTES = 64_000;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const FUNCTION_SHARED_SECRET = Deno.env.get("FUNCTION_SHARED_SECRET");
const ALLOWED_ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "https://hweichen77-dot.github.io";

const RATE_LIMIT_MAX = 20;
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

function joinLines(arr: unknown): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((l) => (l && typeof l === "object" ? (l as { text?: string }).text ?? "" : String(l))).join("\n");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const caller = await authenticate(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const rlKey = caller === "secret" ? `ip:${ip}` : `user:${caller}`;
  if (rateLimited(rlKey)) return json({ error: "rate limit exceeded" }, 429);

  try {
    const { source, stdin } = await req.json();
    if (!source || typeof source !== "string") {
      return json({ error: "missing source" }, 400);
    }
    if (source.length > MAX_SOURCE_BYTES) {
      return json({ error: "source too large" }, 413);
    }
    if (typeof stdin === "string" && stdin.length > MAX_STDIN_BYTES) {
      return json({ error: "stdin too large" }, 413);
    }

    const resp = await fetch(GODBOLT_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        source,
        lang: "java",
        allowStoreCodeDebug: true,
        options: {
          userArguments: "",
          executeParameters: { args: [], stdin: typeof stdin === "string" ? stdin : "" },
          filters: { execute: true },
          tools: [],
          libraries: [],
        },
      }),
    });

    if (!resp.ok) {
      const detail = await resp.text();
      return json({ error: `godbolt ${resp.status}`, detail }, 502);
    }

    const data = await resp.json();
    const compileCode = data?.code ?? 0;
    const compileOut = joinLines(data?.stderr).trim();
    const exec = data?.execResult ?? {};

    return json({
      compile_output: compileOut,
      compile_code: compileCode,
      stdout: joinLines(exec.stdout),
      stderr: joinLines(exec.stderr),
      code: exec.code ?? (compileCode !== 0 ? compileCode : 0),
      timed_out: Boolean(exec.timedOut || data?.timedOut),
    });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});
