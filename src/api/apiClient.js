import { UserProgress, CapstoneSubmission } from './progressStore.js'
import { getProfile, setProfile, clear as clearProfile } from './localProfile.js'
import { auth } from './supabaseClient'

let _contentPromise = null
const loadContent = () => {
  if (!_contentPromise) _contentPromise = import('@/content/index.js')
  return _contentPromise
}

const DIFF_RANK = { beginner: 0, intermediate: 1, advanced: 2 }
const diffRank = (x) => DIFF_RANK[x?.difficulty] ?? 0

const sortList = (arr, sort) => {
  if (!sort || typeof sort !== 'string') return arr
  if (sort === 'order') {
    return [...arr].sort((a, b) => (diffRank(a) - diffRank(b)) || ((a.order || 0) - (b.order || 0)))
  }
  if (sort === 'difficulty') {
    return [...arr].sort((a, b) => (diffRank(a) - diffRank(b)) || ((a.order || 0) - (b.order || 0)))
  }
  const desc = sort.startsWith('-')
  const field = desc ? sort.slice(1) : sort
  const sorted = [...arr].sort((a, b) => {
    const av = a[field]
    const bv = b[field]
    if (av === bv) return 0
    return av > bv ? 1 : -1
  })
  return desc ? sorted.reverse() : sorted
}

const Project = {
  list: async (sort) => {
    const { PROJECTS } = await loadContent()
    return sortList([...PROJECTS], sort || 'order')
  },
  filter: async (q) => {
    const { PROJECTS } = await loadContent()
    return q?.id ? PROJECTS.filter((p) => p.id === q.id) : [...PROJECTS]
  },
  get: async (id) => {
    const { getProject } = await loadContent()
    return getProject(id)
  },
}

const Lesson = {
  list: async (sort) => {
    const { LESSONS } = await loadContent()
    return sortList([...LESSONS], sort || 'order')
  },
  filter: async (q) => {
    const { LESSONS, getLessonsByProject } = await loadContent()
    return q?.project_id
      ? getLessonsByProject(q.project_id)
      : q?.id
        ? LESSONS.filter((l) => l.id === q.id)
        : [...LESSONS]
  },
}

const Challenge = {
  list: async (sort) => {
    const { CHALLENGES } = await loadContent()
    return sortList([...CHALLENGES], sort || 'order')
  },
  filter: async (q) => {
    const { CHALLENGES } = await loadContent()
    return q?.id ? CHALLENGES.filter((c) => c.id === q.id) : [...CHALLENGES]
  },
}

const OFFLINE_MSG =
  "The AI tutor isn't available right now. You can still read the lesson, write code, and run it — your code runs for real."

export const aiAvailable = auth.isConfigured

const InvokeLLM = async ({ prompt, max_tokens } = {}) => {
  try {
    const { supabase } = await import('./supabaseClient')
    if (supabase?.functions?.invoke && prompt) {
      const { data, error } = await supabase.functions.invoke('invoke-llm', {
        body: { prompt, max_tokens },
      })
      if (!error && data?.text) return data.text
    }
  } catch {
  }
  return OFFLINE_MSG
}

export const api = {
  auth: {
    me: async () => {
      const p = getProfile()
      if (!p) throw Object.assign(new Error('no profile'), { status: 401 })
      return { ...p }
    },
    logout: () => {
      clearProfile()
      if (typeof window !== 'undefined') window.location.reload()
    },
    redirectToLogin: () => {
    },
    setProfile,
  },
  entities: { Project, Lesson, Challenge, UserProgress, CapstoneSubmission },
  integrations: { Core: { InvokeLLM } },
  functions: { invoke: async () => ({ ok: false, offline: true }) },
  appLogs: { logUserInApp: async () => {} },
}

export { Project, Lesson, Challenge }
export { UserProgress, CapstoneSubmission }
