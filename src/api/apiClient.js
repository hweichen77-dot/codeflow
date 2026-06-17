// Fully static, offline data layer. No api backend, no Supabase.
// Preserves the exact `api` shape the ~11 consumer files depend on.
import {
  PROJECTS,
  LESSONS,
  CHALLENGES,
  getProject,
  getLessonsByProject,
} from '@/content/index.js'
import { UserProgress, CapstoneSubmission } from './progressStore.js'
import { getProfile, setProfile, clear as clearProfile } from './localProfile.js'
import { auth } from './supabaseClient'

const sortList = (arr, sort) => {
  if (!sort || typeof sort !== 'string') return arr
  if (sort === 'order') {
    return [...arr].sort((a, b) => (a.order || 0) - (b.order || 0))
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
  list: async (sort) => sortList([...PROJECTS], sort || 'order'),
  filter: async (q) => (q?.id ? PROJECTS.filter((p) => p.id === q.id) : [...PROJECTS]),
  get: async (id) => getProject(id),
}

const Lesson = {
  list: async (sort) => sortList([...LESSONS], sort || 'order'),
  filter: async (q) =>
    q?.project_id
      ? getLessonsByProject(q.project_id)
      : q?.id
        ? LESSONS.filter((l) => l.id === q.id)
        : [...LESSONS],
}

const Challenge = {
  list: async (sort) => sortList([...CHALLENGES], sort || 'order'),
  filter: async (q) => (q?.id ? CHALLENGES.filter((c) => c.id === q.id) : [...CHALLENGES]),
}

// LLM bridge. When Supabase is configured, route prompts through the
// `invoke-llm` edge function (API key stays server-side). Otherwise degrade
// to an offline message so the UI never crashes.
const OFFLINE_MSG =
  "The AI tutor isn't available right now. You can still read the lesson, write code, and run it — your code runs for real."

// True only when Supabase is configured (the AI backend is reachable). The UI
// checks this to hide AI affordances instead of returning the offline string.
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
    /* fall through to offline */
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
      // Handled by AuthContext local prompt; no-op here.
    },
    setProfile, // expose for the local sign-in form
  },
  entities: { Project, Lesson, Challenge, UserProgress, CapstoneSubmission },
  integrations: { Core: { InvokeLLM } },
  functions: { invoke: async () => ({ ok: false, offline: true }) },
  appLogs: { logUserInApp: async () => {} },
}

// Named entity exports too, in case any file imports them directly.
export { Project, Lesson, Challenge }
export { UserProgress, CapstoneSubmission }
