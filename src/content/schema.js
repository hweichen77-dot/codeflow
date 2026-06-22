// Content schema (zod) — the documented shape of the data layer.
//
// Two top-level content variants live in this repo and they intentionally
// diverge; both are described here so the divergence is documented rather than
// implicit:
//
//   - Lesson / Project / Challenge  (curriculum, src/content/curriculum/*.js)
//       Code practice is keyed by the field name `starter_code` /
//       `solution_code` and is always Python, run via the in-browser sandbox.
//
//   - Problem                       (competitive, src/content/competitive/*.js)
//       Code is keyed by language suffix instead: `starter_cpp` /
//       `solution_cpp`. These are C++ problems judged by a different runner
//       (see CompetitiveDetail). This is why the runner selection forks: a
//       curriculum item carries `*_code`, a competitive Problem carries
//       `*_cpp`. The shapes below capture that split explicitly. (Normalizing
//       to a `code: { python, cpp }` map would require editing
//       CompetitiveDetail, which is out of scope, so the divergence is
//       documented and left intact at runtime.)
//
// validateContent() runs every lesson/project/challenge/problem through the
// matching schema with safeParse and returns collected errors instead of
// throwing, so it can never break the build. It is invoked from the
// `validate:content` npm script (scripts/validate-content.mjs).

import { z } from "zod";
import { CATEGORY_ORDER, DIFFICULTIES } from "./categories.js";

const difficulty = z.enum(["beginner", "intermediate", "advanced"]);
const category = z.enum(/** @type {[string, ...string[]]} */ (CATEGORY_ORDER));
// Curriculum is multi-track: the AI track (Python) plus AP Computer Science
// Principles (Python/pseudocode) and AP Computer Science A (Java). `track`
// scopes a project to its landing page; `language` selects the code runner.
const trackEnum = z.enum(["ai", "apcsp", "apcsa"]);
const languageEnum = z.enum(["python", "java", "cpp"]);

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {"beginner"|"intermediate"|"advanced"} difficulty
 * @property {string} category
 * @property {number} order
 */
export const ProjectSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    difficulty,
    category,
    estimated_time: z.number().optional(),
    lessons_count: z.number().optional(),
    tags: z.array(z.string()).optional(),
    order: z.number(),
    cover_image: z.string().optional(),
    // Track scoping (default "ai" at read time) + AP Big Idea / Unit label.
    track: trackEnum.optional(),
    unit: z.string().optional(),
  })
  .passthrough();

const testCase = z
  .object({
    input: z.string(),
    expected_output: z.string(),
    description: z.string().optional(),
  })
  .passthrough();

/**
 * @typedef {Object} Lesson
 * @property {string} id
 * @property {string} project_id
 * @property {number} order
 * @property {string} title
 * @property {string} explanation
 * @property {string} [starter_code]
 * @property {string} [solution_code]
 * @property {string} [expected_output]
 * @property {boolean} [illustrative]  true => non-deterministic / live-SDK lesson; expected_output is an example, not a gradable target.
 */
export const LessonSchema = z
  .object({
    id: z.string().min(1),
    project_id: z.string().min(1),
    order: z.number(),
    title: z.string().min(1),
    concept: z.string().optional(),
    xp_reward: z.number().optional(),
    explanation: z.string().min(1),
    // Runner language for this lesson's code practice/challenge. Defaults to
    // "python" at read time; CSA lessons set "java". challenge_language overrides
    // for the challenge specifically. Code stays keyed by `*_code` regardless.
    language: languageEnum.optional(),
    challenge_language: languageEnum.optional(),
    // Python code practice — keyed by `*_code` (curriculum convention).
    starter_code: z.string().optional(),
    solution_code: z.string().optional(),
    expected_output: z.string().optional(),
    // Live-SDK / non-deterministic lessons set this; expected_output is then an
    // illustrative example rather than an auto-gradable target.
    illustrative: z.boolean().optional(),
    hints: z.array(z.string()).optional(),
    // Optional embedded challenge fields (see ChallengeSchema for the derived
    // catalog shape in index.js).
    challenge_title: z.string().optional(),
    challenge_test_cases: z.array(testCase).optional(),
  })
  .passthrough();

/**
 * @typedef {Object} Challenge
 * @property {string} id
 * @property {string} title
 * @property {string} difficulty
 * @property {string} category
 * @property {string} topic
 */
export const ChallengeSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    difficulty: z.string(),
    category: z.string(),
    topic: z.string(),
    xp: z.number().optional(),
    order: z.number().optional(),
    language: languageEnum.optional(),
    starter_code: z.string().optional(),
    solution_code: z.string().optional(),
    test_cases: z.array(testCase).optional(),
    project_id: z.string().optional(),
  })
  .passthrough();

/**
 * Competitive-coding problem. Note the code fields use the `*_cpp` suffix, NOT
 * `*_code` — this is the documented divergence from curriculum Lessons.
 * @typedef {Object} Problem
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {string} topic
 * @property {string} difficulty
 * @property {string} [starter_cpp]
 * @property {string} [solution_cpp]
 */
export const ProblemSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    slug: z.string().min(1),
    topic: z.string().min(1),
    difficulty: z.enum(["easy", "medium", "hard"]),
    time_limit_ms: z.number().optional(),
    memory_limit_mb: z.number().optional(),
    tags: z.array(z.string()).optional(),
    statement: z.string().optional(),
    // C++ code practice — keyed by `*_cpp` (competitive convention).
    starter_cpp: z.string().optional(),
    solution_cpp: z.string().optional(),
    test_cases: z.array(testCase).optional(),
  })
  .passthrough();

/**
 * Validate every piece of content. Uses safeParse so it collects errors instead
 * of throwing; the caller decides whether to fail. Never breaks the build.
 *
 * @param {{ PROJECTS?: any[], LESSONS?: any[], CHALLENGES?: any[], COMPETITIVE?: any[] }} content
 * @returns {{ ok: boolean, errors: { kind: string, id: string, issues: any }[], counts: Record<string, number> }}
 */
export function validateContent({ PROJECTS = [], LESSONS = [], CHALLENGES = [], COMPETITIVE = [] } = {}) {
  const errors = [];

  const check = (kind, list, schema) => {
    for (const item of list) {
      const res = schema.safeParse(item);
      if (!res.success) {
        errors.push({ kind, id: item?.id ?? "<no id>", issues: res.error.issues });
      }
    }
  };

  check("project", PROJECTS, ProjectSchema);
  check("lesson", LESSONS, LessonSchema);
  check("challenge", CHALLENGES, ChallengeSchema);
  check("problem", COMPETITIVE, ProblemSchema);

  return {
    ok: errors.length === 0,
    errors,
    counts: {
      projects: PROJECTS.length,
      lessons: LESSONS.length,
      challenges: CHALLENGES.length,
      problems: COMPETITIVE.length,
    },
  };
}

// Keep the unused enum import meaningful for tooling / future use.
export { DIFFICULTIES };
