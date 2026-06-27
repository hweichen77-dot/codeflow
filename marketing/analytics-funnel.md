# CodeFlow — Analytics, UTM & Funnel

Analytics = PostHog (US cloud). Initialized in `src/lib/analytics.js`:
`capture_pageview: false`, `autocapture: false`, session recording off — so we
only get the events we explicitly fire. `sanitize_properties` strips OAuth tokens
and URL fragments before anything leaves the browser.

## Events already instrumented (no new code needed)

| Event | Fired from | Props |
|---|---|---|
| `$pageview` | route changes (`trackPageview`) | `$current_url` (sanitized), `page` |
| `onboarding_shown` / `onboarding_complete` | `WelcomeModal.jsx` | `started` |
| `guest_start` | `AuthContext.jsx` | — |
| `sign_in_start` | `AuthContext.jsx` | `method: google` |
| `sign_in` / `sign_up` | `AuthContext.jsx` | `method` |
| `lesson_start` | `ProjectDetail.jsx` | `lesson_id`, `project_id` |
| `lesson_complete` | `ProjectDetail.jsx` | `lesson_id`, `project_id`, `time_spent_seconds` |
| `challenge_complete` | `progressStore.js` | `id` |
| `feedback_open` / `feedback_submit` | `FeedbackWidget.jsx` | `kind` |

## The activation funnel (build this in PostHog)

PostHog → Product Analytics → New Funnel. Steps in order:

1. `$pageview`  (landed)
2. `lesson_start`  (tried)
3. `lesson_complete`  (activated ← this is the north-star numerator)
4. `sign_in`  (retained intent)

Conversion window: 1 day. Breakdown by `utm_source` (see below) to compare
channels. Watch step 1→2 (does the landing convince anyone to start?) and step
2→3 (is the first lesson too hard / buggy?). Those two are where launch traffic
will leak.

Secondary funnels worth saving:
- Onboarding: `onboarding_shown` → `onboarding_complete` → `lesson_start`
- Sign-in path: `sign_in_start` → `sign_in` (gap here = OAuth is failing)

## North-star + guardrail metrics

- **Activation rate** = unique users with `lesson_complete` ÷ unique users with
  `$pageview`. Optimize this, not signups.
- **D1 / D7 retention** — PostHog Retention, returning event = `lesson_start`.
- **Sign-in adoption** = users with `sign_in` ÷ activated users.
- **OAuth health** = `sign_in` ÷ `sign_in_start` (should be ~1; a low ratio means
  the Google redirect is broken — ties to the sync gate).

## UTM scheme (channel attribution)

PostHog automatically parses `utm_source`, `utm_medium`, `utm_campaign`,
`utm_term`, `utm_content` out of `$current_url` and sets them as person
properties — so tagging links is all that's required; no code change. (Confirmed:
`trackPageview` passes `$current_url` and `sanitizeUrl` keeps utm params, only
stripping the hash and OAuth tokens.)

**Convention:**
- `utm_source` = the specific place (`hn`, `reddit`, `tiktok`, `producthunt`,
  `teachers`, `youtube`)
- `utm_medium` = the class of channel (`social`, `outreach`, `referral`, `web`)
- `utm_campaign` = the specific push (`showhn`, `learnprogramming`, `apstudents`,
  `csmajors`, `ap_teachers`, `shorts`, `ph_launch`)

**Canonical links** (swap host to `https://codeflow.app/` once domain is live):

```
HN          …/?utm_source=hn&utm_medium=social&utm_campaign=showhn
r/learnprog …/?utm_source=reddit&utm_medium=social&utm_campaign=learnprogramming
r/APStudents…/?utm_source=reddit&utm_medium=social&utm_campaign=apstudents
r/csMajors  …/?utm_source=reddit&utm_medium=social&utm_campaign=csmajors
Teachers    …/teachers?utm_source=teachers&utm_medium=outreach&utm_campaign=ap_teachers
TikTok/YT   …/?utm_source=tiktok&utm_medium=social&utm_campaign=shorts
ProductHunt …/?utm_source=producthunt&utm_medium=social&utm_campaign=ph_launch
```

## Dashboard to build (one screen, check daily)

Tiles:
1. Funnel: landed → start → complete → sign_in (last 7d)
2. Activation rate trend (line, daily)
3. New users by `utm_source` (bar)
4. Funnel breakdown by `utm_source` (which channel actually activates, not just
   which sends clicks)
5. D7 retention curve
6. `feedback_submit` count + a table of recent feedback (`kind`)
7. OAuth health: `sign_in` ÷ `sign_in_start` (number)

Decision rule for launch: drive one channel, read tiles 3–4, fix the worst
step in tile 1, then scale the channel that activates best.
