# CodeFlow Content Authoring Standard

Goal: every lesson reads with **GeeksforGeeks depth** and offers **zyBooks activity variety**. Minimal passive text — an interactive check every few sections. No emojis anywhere.

## File shape

Each module is `src/content/curriculum/module-0X.js`:

```js
export default {
  project: { id, title, description, difficulty, category, estimated_time, lessons_count, tags:[], order, cover_image:"" },
  lessons: [ /* lesson objects */ ]
};
```

`category` ∈ `foundations | prompting | chatbots_agents | rag_search | vision_multimodal | production_ops` (the single source of truth is `src/content/categories.js` — `CATEGORY_LABELS` / `CATEGORY_ORDER`). `difficulty` ∈ `beginner | intermediate | advanced`.

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
- `quiz_questions: [{ question, options:[4], correct_index, explanation }]` — 3 questions (renders as ZybooksQuiz)
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

> Code is **Python** (matches the AI/ML domain). Execution is LLM-simulated.

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

- Valid JS. After editing, `node -e "import('./src/content/curriculum/module-0X.js')"` must not throw.
- **No emojis** in any string.
- IDs stable and unique. `order` sequential from 1.
- Escape `$` in template literals as `\$` and backticks as needed.
- Use the existing Module 1 Lesson 2 ("Tokens") as the reference exemplar — it has every new block populated.
