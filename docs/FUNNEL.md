# Activation Funnel (PostHog)

Ordered events that make up the acquisition → activation funnel. Build the funnel
in PostHog (Product Analytics → Funnels) in this exact step order. Use a 7-day
conversion window unless noted.

| # | Event | Fired from | Key props |
|---|-------|-----------|-----------|
| 1 | `landing_view` | `src/pages/Home.jsx` (mount) | — |
| 2 | `cta_click` | hero + final CTA buttons | `cta`, `location` |
| 3 | `sign_in_start` / `guest_start` | `src/lib/AuthContext.jsx` | `method` |
| 4 | `sign_in` / `sign_up` | `src/lib/AuthContext.jsx` | `method` |
| 5 | `onboarding_shown` | `src/components/WelcomeModal.jsx` | — |
| 6 | `onboarding_complete` | `src/components/WelcomeModal.jsx` | `started` (bool) |
| 7 | `lesson_start` | `src/pages/ProjectDetail.jsx` | `lesson_id`, `project_id` |
| 8 | `lesson_complete` | `src/pages/ProjectDetail.jsx` | `lesson_id`, `project_id`, `time_spent_seconds` |

**Activation = reached step 8** (completed first lesson). That's the metric to move.

## Drop-off lenses
- **Top of funnel:** `landing_view → cta_click`. Low rate → hero copy / above-the-fold problem.
- **Auth wall:** `cta_click → sign_in_start → sign_in`. Drop between start and success = OAuth friction.
- **Onboarding:** `onboarding_shown → onboarding_complete{started:true}`. `started:false` means they dismissed via "I'll look around" — they skipped the guided start, watch whether they still reach `lesson_start`.
- **First lesson:** `lesson_start → lesson_complete`. Drop here = lesson too hard / editor friction. Cross-reference `progress_share` and `feedback_submit`.

## Breakdowns worth saving
- `cta_click` by `cta` + `location` → which CTA drives signups.
- Funnel by `$device_type` → mobile vs desktop activation gap.
- Funnel by `method` (google vs guest) → does guest mode help or leak.

## Other tracked events (not in funnel, useful for retention)
- `challenge_complete` `{id}` — engagement depth
- `progress_share` `{method, surface, level, lessons, challenges, streak}` — growth loop
- `feedback_open` / `feedback_submit` `{kind}` — qualitative signal

## Adding new events
Use `track(name, props)` from `src/lib/analytics.js`. Props are auto-sanitized
(URLs/tokens stripped). No PII in prop values. Update this table when you add one.
