# De-AI Audit — Common AI-App Tells vs. CodeFlow

Report only. No code changed. Goal: catalog the common tells of AI-generated
apps, then locate them in CodeFlow with evidence, ranked, with a fix plan.

## TL;DR
CodeFlow's earlier de-AI redesign (warm amber, Bricolage/Hanken, sharp corners)
was genuinely thorough — the **live** surfaces are clean: no glassmorphism, no
Inter, no purple, no fabricated social proof, under-commented code (the opposite
of typical AI verbosity). The remaining tells cluster into five buckets:

1. **Dead legacy code** still in the repo carries the *worst* tells (purple/cyan, fake testimonials, invented stats).
2. **The `§` + ALL-CAPS kicker** stamped on every section — over-uniform → reads templated. Strongest *live* visual tell.
3. **Em-dash overuse + "X, not Y" antithesis rhythm** — strongest *live* copy tell.
4. **Styling architecture** — 1,345 inline-style objects, 1,196 raw hex, font constants duplicated in 21 files, while a token file already exists unused.
5. **Glyph tics** — `→` on ~28 CTAs, `✓/✗` text glyphs alongside lucide icons; a broken emoji-strip residue.

---

## Part A — Common tells of AI-generated apps (research)

### Design / UI
- Generic palette: purple/indigo→violet gradients (`#6366f1`, `#8b5cf6`, `#6C5CE7`), neon-on-dark duotones.
- Glassmorphism (backdrop-blur translucent cards), soft borders, floating panels — "premium with one CSS rule."
- **Inter** (and now **Instrument Sans**) as the default "AI startup" typeface.
- Identical 2×2 **bento** card grids; dead-centered hero; uniform icon-in-circle feature rows; everything `rounded-2xl`.
- Side-tab accent borders, sparkline widgets (named Claude-Code "UI slop" tells).
- Stock icon sets (lucide/heroicons: Brain/Zap/Sparkles/Target).
- Over-uniform spacing — consistent but no rhythm/intent.

### Copy / content
- Buzzwords: seamless, elevate, unleash, supercharge, leverage, empower, robust, cutting-edge, delve, harness, world-class, transform, "take it to the next level."
- The word **"quiet"** ("quiet confidence") — Feb-2026 cross-model tell.
- **Em-dash overuse**; "not just X, but Y" / "It's not about X, it's about Y" antithesis.
- Rule-of-three everywhere; excessive parallelism.
- Fabricated social proof: invented personas + roles, made-up stats ("10,000+ users", "99.9%").
- Generic CTAs ("Get Started", "Start your journey", "Learn more").
- Longer than it should be (LLMs generate by default; humans prune); excited but non-specific ("amazing", "journey").
- Over-formal support tone; emoji + exclamation spam.

### Code
- Over-commenting: banner/divider comments, docstrings on trivial fns restating the obvious.
- Defensive overkill: try/catch around non-throwing code, uniform empty `catch {}`, null-guards everywhere.
- Repetitive/under-abstracted: high variable reuse, copy-pasted constants instead of shared modules.
- Generic naming: `handleClick`, `data`, `result`, `temp`, `utils` dumping grounds.
- Hallucinated APIs/libs; leftover `console.log`, TODO, commented-out blocks.

Sources: Forbes (Feb 2026 tells), Originality.AI, "Claude Code UI Slop Is Killing
Your Front-End Taste" (productivetechtalk), Medium "Obvious Signs Your App Was
Built With AI", arXiv 2508.21634 / 2508.14727 (AI-code defect studies).

---

## Part B — CodeFlow findings (evidence)

Routing fact that shapes severity: `src/pages/Home.jsx` imports **only** `home2/*`.
`components/home/*`, `components/landing/*`, `shared/ProjectCard.jsx`,
`UserNotRegisteredError.jsx` are **unimported dead code**. `[DEAD]` = ships in repo
but not on any live surface.

### P0 — Dead legacy code carrying the worst tells → delete
- `components/shared/ProjectCard.jsx:86` — `bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE]` classic AI indigo→violet gradient; `:49,53,75,82` indigo `#6C5CE7` accent — contradicts amber brand. `[DEAD]`
- `components/landing/*` — off-brand neon cyan `#00d4ff` as 2nd accent (`ProgressScene.jsx:15-17`, `HeroScene.jsx:76`, `FeaturesScene.jsx:17`, `SocialProofScene.jsx:15`). `[DEAD]`
- `components/landing/SocialProofScene.jsx:4-23` — **fabricated testimonials** ("Alex R. — Career changer → junior dev", "Got a callback a week later"). `[DEAD]`
- `components/landing/ProgressScene.jsx:5-8` — invented stats ("94% Avg Completion", "8+ Projects", "37 AI Concepts"). `components/home/HeroSection.jsx:146` — "1K+ Learners". `[DEAD]`
- `components/UserNotRegisteredError.jsx:5-8` — generic light slate error card (`from-white to-slate-50`, `bg-orange-100` icon circle). `[DEAD]`

### P1 — Strongest LIVE tells
- **`§` + ALL-CAPS kicker on every section** (templated): 29 `§` markers, 240 `uppercase`, 221 `tracking-widest`+`uppercase`. One per page, zero variation — `Dashboard.jsx:206 §DASHBOARD`, `Projects.jsx:96 §PROJECTS`, `AITrack.jsx:96 §AI TRACK`, `Challenges.jsx:67`, `Competitive.jsx:35`, `APCS.jsx:66`, `Portfolio.jsx:30`, `Privacy.jsx:26`, `Terms.jsx:26`, `AuthGate.jsx:78`, `WelcomeModal.jsx:54`, `ErrorBoundary.jsx:46`. Recurs 11-22× *within* single files.
- **Em-dash overuse + "X, not Y" rhythm** (live copy): `website/index.html` 17 dashes, `teachers.html` 15, `home2/BentoGrid.jsx` 6. `HeroSection.jsx:57`, `BentoGrid.jsx:54,59,111`, `HowItWorks.jsx:10,23,30` (every track desc same template), `FinalCTA.jsx:50`. Antithesis: `Testimonials.jsx:42` "We're building the opposite", `BentoGrid.jsx:58` "You don't watch this. You run it", `website/index.html:72,140`.

### P2 — Styling architecture (not user-visible; strong code-level "AI authored" tell + debt)
- **1,345 inline `style={{}}` objects** (ProjectDetail 59, Dashboard 59, ChallengeDetail 44). 42 mega-objects (6+ props inline). 95 `onMouseEnter/Leave` JS-hover handlers reimplementing `:hover`.
- **1,196 raw hex literals**; `#E8A33C` ×395 across 55 files; font stacks inline ×20+.
- **Font constants re-declared in 21 files** (`const LABEL/SERIF/DISPLAY/BODY/MONO`), with drift (`'Spline Sans Mono', monospace` vs `…, ui-monospace, monospace`).
- A real token file already exists — `components/lesson/trace/theme.js` (`lime:'#E8A33C'`, `border:'#262219'`, font stacks) — used only by `trace/` block. Routing the app through it erases P2 at once.

### P3 — Glyph tics + minor
- `→` appended to ~28 CTAs (`AuthHome.jsx:140`, `AuthGate.jsx:131,163`, `WelcomeModal.jsx:92`, `Dashboard.jsx:552`, `Portfolio.jsx:66`, `LevelUpModal.jsx:142`…).
- `✓/✗/✕` text glyphs in body UI *alongside* lucide `Check`/`X` icons (`OutputComparison.jsx:24`, `ParticipationActivity.jsx:85,189`, `LessonQuiz.jsx:105,108`, `ProgressRing.jsx:61`) — pick one convention.
- **Broken residue:** `gamification/StreakBadge.jsx:25` — `streakDays >= 7 ? "" : streakDays >= 3 ? "" : "✦"` — two empty strings where emojis were stripped → fingerprint of the de-AI pass, now a broken ternary.
- `home2/BentoGrid.jsx` — named after the "bento" cliché but renders an editorial surface + a 3-equal-column `Pillar` grid (`:103-121`, `repeat(3,1fr)`) — the one live layout cliché. Rename + vary.
- Repeated amber hairline `linear-gradient(90deg,transparent,#E8A33C,transparent)` copy-pasted as top border on 11 pages — on-brand but verbatim (templating signal).
- lucide stock set `Brain/Zap/Lightbulb/Target` (restrained, low severity).
- Empty/silent `catch {}` ×30 (mostly defensible localStorage guards; low value).

### What's already clean (do NOT touch)
- Zero glassmorphism / backdrop-blur; `.glow-lime` neutralized to none (`index.css:117-118`).
- No Inter/system fonts; Bricolage/Hanken/Spline enforced.
- No purple/violet in live code; amber-only brand.
- No gradient-text, no gradient buttons (flat `#E8A33C`).
- Live homepage uses asymmetric `1.35fr 1fr` hero + list rows (anti-cliché).
- Code is *under*-commented (~25 `//` in whole app), no over-abstraction, no leftover console.log.
- `home2/Testimonials.jsx` deliberately avoids fake humans — quotes attributed to "The CodeFlow mission".

---

## Part C — Fix plan (tiers, not yet executed)

- **Tier 1 (fast, high-signal):** delete P0 dead files; fix `StreakBadge.jsx:25`; trim em-dash density ~half + vary "X, not Y" in `home2/BentoGrid.jsx`, `home2/HowItWorks.jsx`, `website/*.html`; change one generic CTA `HomeNav.jsx:48 "Get Started"` → specific.
- **Tier 2 (live polish):** vary the `§`/ALL-CAPS kicker so it stops feeling stamped (drop on some sections, alternate treatment); rename `BentoGrid`; pick one status-glyph convention.
- **Tier 3 (architecture, larger):** introduce a shared `src/lib/tokens.js` (or adopt `trace/theme.js`), replace duplicated font constants + hottest hex literals; optionally migrate hover-via-JS to CSS classes. Big diff, no visual change, kills P2 — schedule deliberately.
