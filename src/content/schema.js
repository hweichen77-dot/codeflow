
import { z } from "zod";
import { CATEGORY_ORDER, DIFFICULTIES } from "./categories.js";

const difficulty = z.enum(["beginner", "intermediate", "advanced"]);
const category = z.enum( (CATEGORY_ORDER));
const trackEnum = z.enum(["ai", "apcsp", "apcsa"]);
const languageEnum = z.enum(["python", "java", "cpp"]);

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

export const LessonSchema = z
  .object({
    id: z.string().min(1),
    project_id: z.string().min(1),
    order: z.number(),
    title: z.string().min(1),
    concept: z.string().optional(),
    xp_reward: z.number().optional(),
    explanation: z.string().min(1),
    language: languageEnum.optional(),
    challenge_language: languageEnum.optional(),
    starter_code: z.string().optional(),
    solution_code: z.string().optional(),
    expected_output: z.string().optional(),
    illustrative: z.boolean().optional(),
    hints: z.array(z.string()).optional(),
    challenge_title: z.string().optional(),
    challenge_test_cases: z.array(testCase).optional(),
  })
  .passthrough();

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
    starter_cpp: z.string().optional(),
    solution_cpp: z.string().optional(),
    test_cases: z.array(testCase).optional(),
  })
  .passthrough();

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

export { DIFFICULTIES };
