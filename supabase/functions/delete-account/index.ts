// Self-serve account + data deletion (GDPR Art. 17 / CCPA right to delete).
//
// The caller proves identity with its own Supabase access token (Authorization:
// Bearer <jwt>). We resolve the user id from that token, then use the service
// role to delete the auth user — which cascades to user_state, user_challenges,
// user_tracks, and projects via their ON DELETE CASCADE foreign keys.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by the platform; no
// extra secret to configure. Deploy WITH jwt verification (default) so only a
// signed-in user can reach it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (b: unknown, status = 200) =>
    new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });

  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return json({ error: "missing bearer token" }, 401);

  // Resolve the caller from their own token — never trust a uid from the body.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });
  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  const uid = userData?.user?.id;
  if (userErr || !uid) return json({ error: "invalid token" }, 401);

  // Cascades remove all owned rows (FKs reference auth.users on delete cascade).
  const { error: delErr } = await admin.auth.admin.deleteUser(uid);
  if (delErr) {
    console.error("delete-account failed:", delErr.message);
    return json({ error: "deletion failed" }, 500);
  }
  return json({ deleted: true });
});
