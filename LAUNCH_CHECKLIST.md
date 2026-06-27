# CodeFlow — Launch Checklist

Status snapshot (Jun 27 2026): app live on GitHub Pages, download site live on
Vercel, v0.16.4, Google-only auth, sync security closed. One hard gate remains:
**cloud sync has never been verified end-to-end by a real signed-in user.**

---

## A. Sync gate — MUST pass before inviting users

This is the only true launch blocker. Do it manually (can't be done headless —
email confirmation blocks token acquisition; Google sign-in is the real path).

1. [ ] Open the live app in a clean browser (incognito):
       `https://hweichen77-dot.github.io/codeflow/`
2. [ ] Sign in with Google. Confirm: redirect returns to app, no error, you land
       signed-in (avatar/name shows).
3. [ ] Complete one lesson and one challenge. Confirm the pass/grade shows.
4. [ ] Hard-reload the page. Confirm progress is still there (came from server,
       not just localStorage).
5. [ ] Open the app on a **second device or browser**, sign in with the same
       Google account. Confirm the same progress appears → proves server write +
       read both work.
6. [ ] In Supabase → Table editor → `user_state`: confirm exactly one row for
       your user id, `updated_at` recent.
7. [ ] Sign out, reload. Confirm it drops to guest/local cleanly (no crash, no
       leaked data from the previous user).

If step 4 or 5 fails → sync is broken; every user silently loses progress. Do
NOT launch until fixed.

## B. Pre-launch housekeeping

8. [ ] Delete test user `codeflow-synctest-0625@gmail.com` from Supabase → Auth.
9. [ ] Decide email-confirmation policy in Supabase (Google sign-in bypasses it;
       only matters if email/password is ever re-enabled — it currently isn't).
10. [ ] Spot-check the **Java** runner live: open one AP CS A lesson, run a Java
        challenge in the browser, confirm it compiles/grades (Godbolt path).
        Judge0 is the fallback if flaky.
11. [ ] Spot-check **C++** (Compiler Explorer) and **Python** (Pyodide) each on
        one live challenge.
12. [ ] Confirm download links on the site point at the latest release. Re-run
        `node website/build.mjs` after any new app release, then redeploy Vercel.
        (Site currently shows v0.15.0 download links while app is v0.16.4 — bump.)

## C. Domain + brand (before any paid/press push)

13. [ ] Buy `codeflow.app`. Point Vercel site + GitHub Pages app to it (the HTML
        already references `https://codeflow.app/` in OG/canonical tags).
14. [ ] Add a real `og-image.png` at the site root (OG tags reference it; verify
        it 200s, else social shares look broken).
15. [ ] Verify the new `/teachers` page renders on Vercel after deploy.

## D. Analytics ready (so day-1 data is usable)

16. [ ] Confirm PostHog is receiving events from prod (fire a `lesson_start` by
        starting a lesson, see it land in PostHog Live Events within ~1 min).
17. [ ] Build the activation funnel in PostHog (see `marketing/analytics-funnel.md`).
18. [ ] Confirm Sentry is receiving events (trigger a handled test error or check
        the release shows up).

## E. Go / no-go

- [ ] A (sync gate) fully green → **GO for soft launch.**
- [ ] B + D done → safe to drive traffic and read the funnel.
- [ ] C done → ready for the teacher push and any press/Product Hunt.

Sequence: A → B/D → soft launch (seed communities) → read funnel → C → teacher +
content push.
