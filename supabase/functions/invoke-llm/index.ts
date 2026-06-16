// Supabase Edge Function: invoke-llm
// Routes code-execution-simulation (and any LLM prompt) through Anthropic,
// keeping the API key server-side. The browser/desktop app calls this via
// supabase.functions.invoke('invoke-llm', { body: { prompt } }).
//
// Deploy:
//   supabase functions deploy invoke-llm --no-verify-jwt
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Then set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time so the
// client picks it up. With no Supabase configured, the app falls back to an
// offline message (the UI never crashes).

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const MODEL = "claude-haiku-4-5-20251001";

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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const { prompt, max_tokens } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return json({ error: "missing prompt" }, 400);
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
