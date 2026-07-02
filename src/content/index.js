import m1 from './curriculum/module-01.js'
import m2 from './curriculum/module-02.js'
import m3 from './curriculum/module-03.js'
import m4 from './curriculum/module-04.js'
import m5 from './curriculum/module-05.js'
import m6 from './curriculum/module-06.js'
import m7 from './curriculum/module-07.js'
import m8 from './curriculum/module-08.js'
import m9 from './curriculum/module-09.js'
import m10 from './curriculum/module-10.js'
import m11 from './curriculum/module-11.js'
import m12 from './curriculum/module-12.js'
import m13 from './curriculum/module-13.js'
import m14 from './curriculum/module-14.js'
import m15 from './curriculum/module-15.js'
import m16 from './curriculum/module-16.js'
import m17 from './curriculum/module-17.js'
import m18 from './curriculum/module-18.js'
import m19 from './curriculum/module-19.js'
import m20 from './curriculum/module-20.js'
import m21 from './curriculum/module-21.js'
import m22 from './curriculum/module-22.js'

import BRIEFS from './briefs.js'

import { MODULES as CSP_MODULES, BRIEFS as CSP_BRIEFS } from './csp/index.js'
import { MODULES as CSA_MODULES, BRIEFS as CSA_BRIEFS } from './csa/index.js'

export {
  COMPETITIVE,
  COMPETITIVE_TOPICS,
  COMPETITIVE_DIFFICULTIES,
  getCompetitive,
} from './competitive/index.js'

const AI_MODULES = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16, m17, m18, m19, m20, m21, m22]
const MODULES = [...AI_MODULES, ...CSP_MODULES, ...CSA_MODULES]
const ALL_BRIEFS = { ...BRIEFS, ...CSP_BRIEFS, ...CSA_BRIEFS }

export const PROJECTS = MODULES.map(m => ({ ...m.project, brief: ALL_BRIEFS[m.project.id] || null }))
export const LESSONS = MODULES.flatMap(m => m.lessons)

const XP_BY_DIFFICULTY = { beginner: 15, intermediate: 25, advanced: 40 }

export const CHALLENGES = LESSONS.filter(l => l.challenge_title).map((l, i) => {
  // eslint-disable-next-line -- runtime fallback; project is always found in practice
  const project =  (PROJECTS.find(p => p.id === l.project_id) || {})
  const difficulty = l.challenge_difficulty || project.difficulty || 'beginner'
  const topic = (project.tags && project.tags[0]) || project.category || 'ai'
  return {
    id: l.id + '-ch',
    title: l.challenge_title,
    description: l.challenge_description,
    difficulty,
    category: project.category || 'foundations',
    topic,
    xp: l.challenge_xp || XP_BY_DIFFICULTY[difficulty] || 15,
    order: (project.order || 0) * 100 + (l.order || i),
    language: l.challenge_language || l.language || 'python',
    starter_code: l.challenge_starter_code,
    solution_code: l.challenge_solution_code,
    test_cases: l.challenge_test_cases,
    story: l.challenge_story || null,
    statement: l.challenge_statement || null,
    input_format: l.challenge_input_format || null,
    output_format: l.challenge_output_format || null,
    constraints: l.challenge_constraints || null,
    examples: l.challenge_examples || null,
    notes: l.challenge_notes || null,
    hints: l.challenge_hints || null,
    project_id: l.project_id,
    project_title: project.title,
  }
})

export const getProject = (id) => PROJECTS.find(p => p.id === id)
export const getLessonsByProject = (id) =>
  LESSONS.filter(l => l.project_id === id).sort((a, b) => (a.order || 0) - (b.order || 0))
export const getLesson = (id) => LESSONS.find(l => l.id === id)

// ---------------------------------------------------------------------------
// Slugs + per-lesson route map (for SEO-friendly /learn/:project/:lesson URLs).
// Identity stays `id`-based; slugs are a stable, keyword-rich addressing layer
// derived from titles, with deterministic de-duplication.
// ---------------------------------------------------------------------------
export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'x'

const _projIdToSlug = {}
const _projSlugToId = {}
for (const p of PROJECTS) {
  let s = slugify(p.title)
  if (_projSlugToId[s] && _projSlugToId[s] !== p.id) s = `${s}-${slugify(p.id)}`
  _projSlugToId[s] = p.id
  _projIdToSlug[p.id] = s
}

const _lessonKeyToId = {}   // "projectSlug/lessonSlug" -> lessonId
const _lessonIdToRoute = {} // lessonId -> { projectSlug, lessonSlug }
for (const p of PROJECTS) {
  const projectSlug = _projIdToSlug[p.id]
  const used = {}
  for (const l of getLessonsByProject(p.id)) {
    let s = slugify(l.title)
    if (used[s]) s = `${s}-${l.order || Object.keys(used).length}`
    used[s] = 1
    _lessonKeyToId[`${projectSlug}/${s}`] = l.id
    _lessonIdToRoute[l.id] = { projectSlug, lessonSlug: s }
  }
}

export const getProjectSlug = (projectId) => _projIdToSlug[projectId] || null
export const getProjectBySlug = (projectSlug) => getProject(_projSlugToId[projectSlug])
export const getLessonRoute = (lessonId) => _lessonIdToRoute[lessonId] || null
export const getLessonPath = (lessonId) => {
  const r = _lessonIdToRoute[lessonId]
  return r ? `/learn/${r.projectSlug}/${r.lessonSlug}` : null
}
export const resolveLessonSlugs = (projectSlug, lessonSlug) => {
  const projectId = _projSlugToId[projectSlug] || null
  const lessonId = _lessonKeyToId[`${projectSlug}/${lessonSlug}`] || null
  return { projectId, lessonId }
}

// Flat manifest consumed by the build-time prerender + sitemap generator.
export const LESSON_ROUTES = LESSONS.map(l => {
  const r = _lessonIdToRoute[l.id] || {}
  const project = getProject(l.project_id) || {}
  return {
    lessonId: l.id,
    projectId: l.project_id,
    projectSlug: r.projectSlug || null,
    lessonSlug: r.lessonSlug || null,
    path: r.projectSlug ? `/learn/${r.projectSlug}/${r.lessonSlug}` : null,
    title: l.title,
    concept: l.concept || '',
    projectTitle: project.title || '',
    category: project.category || '',
    explanation: l.explanation || '',
    challengeTitle: l.challenge_title || '',
  }
})
