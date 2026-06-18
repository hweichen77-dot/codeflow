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

The Competitive Coding problems compile + run **C++** server-side via a Supabase
Edge Function that proxies to the Compiler Explorer (godbolt.org) execution API
— no compiler runs in the browser, and no extra API key is needed.

Deploy the function (one-time):

```
supabase functions deploy run-cpp --no-verify-jwt
```

That's it — `run-cpp` needs no secret. Once `VITE_SUPABASE_URL` /
`VITE_SUPABASE_ANON_KEY` are set at build time (same as auth) and the function
is deployed, the C++ editor in `/Competitive` compiles, runs, and grades
submissions against each problem's hidden test cases.

If Supabase is **not** configured, the Competitive section still renders fully
(problem statements, write code, reveal editorial/solution) and shows a "C++
runner offline" notice instead of judging. The AI **Challenges** are Python and
run fully offline in the browser via Pyodide — they never depend on this.

To swap the upstream compiler later (e.g. self-hosted Piston or Judge0), only
`supabase/functions/run-cpp/index.ts` and `src/lib/cppRunner.js` change.
