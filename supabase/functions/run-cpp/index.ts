// Supabase Edge Function: run-cpp
// Compiles and runs C++ for the Competitive Coding section by proxying to the
// Compiler Explorer (godbolt.org) execution API. Edge Functions run Deno and
// cannot invoke gcc directly, so compilation + execution happen in Godbolt's
// sandbox. (The public Piston API went whitelist-only in Feb 2026; Godbolt is a
// free, no-key, well-funded alternative that supports stdin.)
//
// The browser/desktop app calls this via
//   supabase.functions.invoke('run-cpp', { body: { source, stdin } })
// and gets back { compile_output, compile_code, stdout, stderr, code }.
//
// Deploy:
//   supabase functions deploy run-cpp --no-verify-jwt
// No secret required. To swap to a self-hosted Judge0/Piston later, only this
// file and src/lib/cppRunner.js change.
//
// With no Supabase configured, the client never calls this — cppRunner returns
// an "unavailable" message and the rest of the app is unaffected.

const COMPILER = "g132"; // gcc 13.2 on Compiler Explorer
const GODBOLT_URL = `https://godbolt.org/api/compiler/${COMPILER}/compile`;
const MAX_SOURCE_BYTES = 50_000;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "content-type": "application/json" },
  });
}

// Godbolt returns stdout/stderr as arrays of { text } lines.
function joinLines(arr: unknown): string {
  if (!Array.isArray(arr)) return "";
  return arr.map((l) => (l && typeof l === "object" ? (l as { text?: string }).text ?? "" : String(l))).join("\n");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const { source, stdin } = await req.json();
    if (!source || typeof source !== "string") {
      return json({ error: "missing source" }, 400);
    }
    if (source.length > MAX_SOURCE_BYTES) {
      return json({ error: "source too large" }, 413);
    }

    const resp = await fetch(GODBOLT_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        source,
        lang: "c++",
        allowStoreCodeDebug: true,
        options: {
          userArguments: "-O2 -std=c++17",
          executeParameters: { args: [], stdin: typeof stdin === "string" ? stdin : "" },
          filters: { execute: true, binary: true },
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
    const compileOut = joinLines(data?.stderr).trim(); // compiler diagnostics live in top-level stderr
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
