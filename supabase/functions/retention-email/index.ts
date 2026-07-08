
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM = Deno.env.get("RETENTION_FROM") ?? "CodeFlow <onboarding@resend.dev>";
const TRIGGER_SECRET = Deno.env.get("RETENTION_TRIGGER_SECRET");
const SITE = Deno.env.get("SITE_URL") ?? "https://hweichen77-dot.github.io/codeflow/";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

function subjectAndBody({ name, streak, kind, resumeUrl }: { name?: string; streak?: number; kind?: string; resumeUrl?: string }) {
  const who = name ? escapeHtml(name.split(" ")[0]) : "there";
  const url = resumeUrl || SITE;
  if (kind === "goal") {
    return {
      subject: "One lesson keeps today going",
      html: `<p>Hi ${who},</p><p>You're one short of today's goal on CodeFlow. A single lesson takes a few minutes.</p><p><a href="${url}">Pick up where you left off</a>.</p>`,
    };
  }
  if (kind === "weekly") {
    return {
      subject: "Your week on CodeFlow",
      html: `<p>Hi ${who},</p><p>Here's a quick recap of your week. Ready for the next one?</p><p><a href="${url}">Keep learning</a>.</p>`,
    };
  }

  const s = streak && streak > 0 ? `${streak}-day` : "";
  return {
    subject: s ? `Keep your ${s} streak alive` : "Come back to CodeFlow",
    html: `<p>Hi ${who},</p><p>${s ? `Your ${s} streak is about to break.` : "It's been a bit."} One lesson keeps it going.</p><p><a href="${url}">Resume now</a>.</p>`,
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  if (!RESEND_API_KEY) return json({ configured: false, error: "RESEND_API_KEY not set" });

  let body: { email?: string; name?: string; streak?: number; kind?: string; resumeUrl?: string; secret?: string };
  try { body = await req.json(); } catch { return json({ error: "invalid JSON" }, 400); }

  if (!TRIGGER_SECRET || body.secret !== TRIGGER_SECRET) return json({ error: "unauthorized" }, 401);
  const email = String(body.email || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "invalid email" }, 400);

  const { subject, html } = subjectAndBody(body);
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [email], subject, html }),
    });
    if (!resp.ok) {
      const detail = await resp.text();
      console.error(`resend ${resp.status}: ${detail.slice(0, 300)}`);
      return json({ error: "send failed" }, 502);
    }
    return json({ sent: true });
  } catch (e) {
    console.error("retention-email error:", e);
    return json({ error: "internal error" }, 500);
  }
});
