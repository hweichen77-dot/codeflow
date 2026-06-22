# CodeFlow Content Authoring Standard

Goal: every lesson reads with **GeeksforGeeks depth** and offers high **interactive variety**. Minimal passive text — an interactive check every few sections. No emojis anywhere.

Lessons render in the **TRACE** reading surface: a unified dark, debugger/terminal
style (not a light textbook page). Authors write the same data model; the renderer
applies the look. Activity blocks surface with CodeFlow's own labels — `DRILL §N.M`
(participation), `▸ CHECK` (quizzes), `TRACE` (step-throughs), `> RUN COMPLETE`
(points summary). Do not reference "zyBooks" anywhere.

## Tracks & languages

Content spans three tracks, scoped by `project.track`:
- `ai` (default) — the AI curriculum, Python. `src/content/curriculum/*.js`.
- `apcsp` — AP Computer Science Principles, Python + pseudocode-in-prose. `src/content/csp/*.js`.
- `apcsa` — AP Computer Science A, **Java**. `src/content/csa/*.js`.

A lesson's runnable code language is `lesson.language` (`python` | `java` | `cpp`,
default `python`); `lesson.challenge_language` overrides it for the challenge.
Code stays in `starter_code`/`solution_code`/`challenge_*_code` regardless of
language — the runner is chosen by the language field, not the field name.
Execution is **real**: Python via in-browser Pyodide, Java via a remote OpenJDK
judge, C++ via Compiler Explorer. Every reference solution is compiled/run against
its test cases in CI (`verify:solutions`), so solutions must actually pass.

**Java (CSA) rules:** solution and starter must declare `public class Main` with
`public static void main(String[] args)`, no `package` statement; read stdin with
`Scanner`. Stay within the AP CSA Java subset.

## File shape

Each module is `src/content/curriculum/module-0X.js`:

```js
export default {
  project: { id, title, description, difficulty, category, order, track, unit, tags:[], estimated_time, lessons_count, cover_image:"" },
  lessons: [ /* lesson objects */ ]
};
```

`category` is the single source of truth in `src/content/categories.js`
(`CATEGORY_LABELS` / `CATEGORY_ORDER`) — AI categories plus `apcsp` / `apcsa`.
`difficulty` ∈ `beginner | intermediate | advanced`. AP modules also set
`track` (`apcsp` | `apcsa`) and `unit` (the Big Idea / Unit label the AP CS hub
groups by).

> Competitive-coding **Problems** (`src/content/competitive/*.js`) are a separate shape: they use `difficulty ∈ easy | medium | hard`, a `topic` instead of `category`, and code fields suffixed by language (`starter_cpp` / `solution_cpp`) rather than `starter_code` / `solution_code`. See `src/content/schema.js` for both shapes.

## Lesson object — full field list

**Required core**
- `id` (e.g. `"ai-03-l2"`), `project_id`, `order`, `title`, `concept` (1–2 word tag), `xp_reward` (10)
- `explanation` — **markdown string, GfG depth.** See depth rules below.

**Depth + comprehension (keep, all already render)**
- `key_terms: [{ term, definition }]` — 3–5 glossary entries
- `callouts: [{ type, title, content, position }]` — type ∈ `analogy|insight|tip|warning`; position `before|after`. 2 per lesson.
- `concept_diagram: { title, steps:[{ label, desc }] }` — 4 steps
- `inline_quizzes: [{ question, options:[], correct_index, explanation }]` — quick mid-read check
- `quiz_questions: [{ question, options:[4], correct_index, explanation }]` — 3 questions (renders as the `▸ CHECK` block)
- `participation_activities: [{ activity_title, questions:[{ question, type, correct_answer, explanation }] }]` — type ∈ `true_false|fill_in`

**NEW activity blocks (render via LessonBlocks — add these for variety)**
- `tools: [{ type: "tokenizer" }]` — only when topic-relevant (currently only `tokenizer` exists)
- `step_throughs: [{ title, steps:[{ label, detail, code? }] }]` — 4-step animation of a process
- `worked_examples: [{ number, difficulty, prompt, steps:[], output }]` — GfG input→reasoning→output triad; 2 per lesson, escalating (`easy`→`medium`/`hard`)
- `comparison_tables: [{ title, columns:[], rows:[{ cells:[], highlight? }] }]` — contrast approaches; highlight the winner row
- `drag_to_bins: [{ title, bins:[{id,label}], items:[{id,text,bin}] }]` — classify 4–6 items into 2–3 bins
- `reflections: [{ prompt, sampleAnswer }]` — "explain in your own words"

**Code practice (keep)**
- `starter_code`, `solution_code`, `expected_output`, `hints:[3]`
- `challenge_title`, `challenge_description`, `challenge_starter_code`, `challenge_solution_code`, `challenge_test_cases:[{ input, expected_output, description }]`
- `challenge_language` — `python` (default) | `java` | `cpp`. Selects the grader.

> Challenges read **stdin** and print **stdout**; `challenge_test_cases` compare
> exact stdout (trailing whitespace per line and one trailing newline are
> ignored). The reference `challenge_solution_code` must pass every case — CI runs
> it for real.

## Depth rules for `explanation` (GfG standard)

1. **Hook** — concrete, surprising opening line (a real anecdote, a number, a failure).
2. `## What it is` — precise definition, bold the key term.
3. `## How it works` — mechanism, step by step.
4. At least **one fenced code or worked snippet** inline.
5. `## Why it matters` — cost / limits / failures / real use.
6. `## The mental model to keep` — one-line takeaway.
- Short paragraphs, frequent `##` headings, **bold** key terms, `inline code`. Bullet lists for enumerations. 350–600 words.

## Activity density target per lesson

Reading → tool/animation (when relevant) → inline_quiz → worked_examples → comparison_table → drag_to_bin → participation/quiz → reflection → code challenge.
Aim for **5–7 distinct interaction types** per lesson. Not every block fits every topic — pick what teaches.

## Hard rules

- `npm run validate:content` must pass (zod) and `npm run verify:solutions` must pass (every reference solution runs green; Java needs a local JDK or runs in CI).
- **No emojis** in any string.
- IDs stable and unique. `order` sequential from 1.
- AP module files may be authored as JSON (`export default { ... }`) to sidestep template-literal escaping; if you use template literals, escape `$` as `\$` and backticks as needed.
- Register new AP modules in `src/content/csp/index.js` or `src/content/csa/index.js`.
- Reference exemplars: Module 1 Lesson 2 ("Tokens") for AI depth; any `src/content/csa/*.js` lesson for the Java challenge shape.
