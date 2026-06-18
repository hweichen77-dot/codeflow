# Supabase email login — setup

The app ships with full email/password auth wired up, but **inert until you add
credentials**. Until then it runs in stub mode: email sign-in shows
"not configured", and **Continue as guest** works fully offline.

## 1. Get your project credentials

In the Supabase dashboard for your project:

- **Project URL** — Settings → API → `Project URL`
- **anon public key** — Settings → API → `Project API keys` → `anon` `public`

## 2. Create `.env.local`

In the repo root (this file is gitignored):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key...
```

Restart `npm run dev` (Vite only reads env at startup). For the Tauri desktop
build and the GitHub Pages website build, the same vars must be present in the
build environment (e.g. CI secrets) at `npm run build` time.

## 3. Enable Email auth in Supabase

Dashboard → Authentication → Providers → **Email**: enable it.

- **Email confirmation**: if ON, new sign-ups must click a confirmation link
  before they can sign in (the app shows "Check your inbox…"). If OFF, sign-up
  logs the user straight in.
- **Password reset / confirmation redirect**: Authentication → URL Configuration
  → add your site URLs to **Redirect URLs**, e.g.
  - `http://localhost:5173/codeflow/` (local dev)
  - `https://<user>.github.io/codeflow/` (website)
  - the Tauri app origin if you use deep links

## What works once configured

- Sign up / sign in with email + password
- Forgot password → reset email
- Session persists across reloads; **Exit** signs out
- Guest mode stays available alongside email login

## Notes / scope

- Learning **progress** (XP, lessons, streak) is currently stored **locally**,
  keyed by the account email. Email login provides identity + the personalized
  home screen; it does **not** yet sync progress across devices. Cross-device
  sync would use the `user_progress` Supabase tables already scaffolded in
  `src/api/supabaseClient.js`.

## C++ runner (Competitive Coding section)

**C++ judging works out of the box — no Supabase required.** The Competitive
Coding editor compiles and runs C++ by calling the Compiler Explorer
(godbolt.org) execute API **directly from the browser** (godbolt sends
`Access-Control-Allow-Origin: *`, so this works on the static site with no
backend and no API key). See `src/lib/cppRunner.js`.

### Optional: route C++ through Supabase instead

To proxy compilation server-side (rate-limit, log, or swap compiler centrally),
deploy the included `run-cpp` Edge Function. When `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` are set, `cppRunner` automatically prefers the Edge
Function and falls back to the direct call if it fails.

The repo is already initialized for this — `supabase/config.toml` sets
`verify_jwt = false` for `run-cpp` (it needs no secret). To deploy, run the
helper (uses the Supabase CLI via `npx`, nothing installed globally):

```
./scripts/deploy-supabase.sh
```

It logs you in, links your project, and runs
`supabase functions deploy run-cpp --no-verify-jwt`. Then set the two
`VITE_SUPABASE_*` vars (see `.env.local.example`) and rebuild.

To swap the upstream compiler later (self-hosted Piston or Judge0), only
`supabase/functions/run-cpp/index.ts` and the `runViaGodbolt` helper in
`src/lib/cppRunner.js` change.

The AI **Challenges** are Python and run fully offline via Pyodide — they never
depend on any of this.
