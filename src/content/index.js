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

import BRIEFS from './briefs.js'

const MODULES = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15, m16]

export const PROJECTS = MODULES.map(m => ({ ...m.project, brief: BRIEFS[m.project.id] || null }))
export const LESSONS = MODULES.flatMap(m => m.lessons)

// Derive a Challenge catalog from lessons that declare a challenge.
const XP_BY_DIFFICULTY = { beginner: 15, intermediate: 25, advanced: 40 }

export const CHALLENGES = LESSONS.filter(l => l.challenge_title).map((l, i) => {
  const project = PROJECTS.find(p => p.id === l.project_id) || {}
  const difficulty = project.difficulty || 'beginner'
  // Topic = the project's primary tag, falling back to its category.
  const topic = (project.tags && project.tags[0]) || project.category || 'ai'
  return {
    id: l.id + '-ch',
    title: l.challenge_title,
    description: l.challenge_description,
    difficulty,
    category: project.category || 'ai_ml',
    topic,
    xp: l.challenge_xp || XP_BY_DIFFICULTY[difficulty] || 15,
    // Global ordering so the catalog is stable and numbered sensibly.
    order: (project.order || 0) * 100 + (l.order || i),
    starter_code: l.challenge_starter_code,
    solution_code: l.challenge_solution_code,
    test_cases: l.challenge_test_cases,
    project_id: l.project_id,
    project_title: project.title,
  }
})

export const getProject = (id) => PROJECTS.find(p => p.id === id)
export const getLessonsByProject = (id) =>
  LESSONS.filter(l => l.project_id === id).sort((a, b) => (a.order || 0) - (b.order || 0))
export const getLesson = (id) => LESSONS.find(l => l.id === id)
