import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Supabase is dormant in the static build. createClient() throws "supabaseUrl is required"
// when env vars are absent — and that throw happens at module load, crashing the whole app.
// Without credentials, export a no-op stub so importers degrade gracefully instead.
const makeStub = () => ({
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
    signOut: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ data: null, error: new Error('Supabase not configured') }),
  },
  from: () => {
    const result = Promise.resolve({ data: [], error: null })
    const chain = {
      select: () => chain, insert: () => chain, update: () => chain, delete: () => chain,
      upsert: () => chain, eq: () => chain, order: () => chain,
      single: async () => ({ data: null, error: null }),
      then: (resolve, reject) => result.then(resolve, reject),
    }
    return chain
  },
})

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : makeStub()

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const auth = {
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email, password, name) =>
    supabase.auth.signUp({ email, password, options: { data: { name: name || '' } } }),
  signInWithGoogle: () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined'
          ? `${window.location.origin}${import.meta.env.BASE_URL || '/'}`
          : undefined,
      },
    }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (cb) => supabase.auth.onAuthStateChange(cb),
  resetPassword: (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}${import.meta.env.BASE_URL || '/'}` : undefined,
    }),
  isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
}

// ── Challenges ────────────────────────────────────────────────────────────────
export const Challenges = {
  list: async (filters = {}) => {
    let q = supabase.from('challenges').select('*')
    if (filters.category) q = q.eq('category', filters.category)
    if (filters.difficulty) q = q.eq('difficulty', filters.difficulty)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  get: async (id) => {
    const { data, error } = await supabase.from('challenges').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  seed: async (challenges) => {
    const { error } = await supabase.from('challenges').upsert(challenges)
    if (error) throw error
  }
}

// ── User Challenge Progress ───────────────────────────────────────────────────
export const UserChallenges = {
  list: async (userId) => {
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenges(*)')
      .eq('user_id', userId)
    if (error) throw error
    return data || []
  },
  upsert: async (userId, challengeId, updates) => {
    const payload = {
      user_id: userId,
      challenge_id: challengeId,
      ...updates,
      updated_at: new Date().toISOString()
    }
    if (updates.status === 'completed' && !updates.completed_at) {
      payload.completed_at = new Date().toISOString()
    }
    const { data, error } = await supabase.from('user_challenges').upsert(payload).select().single()
    if (error) throw error
    return data
  }
}

// ── Projects (Portfolio) ──────────────────────────────────────────────────────
export const Projects = {
  list: async (userId) => {
    const { data, error } = await supabase
      .from('projects').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  create: async (project) => {
    const { data, error } = await supabase.from('projects').insert(project).select().single()
    if (error) throw error
    return data
  },
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('projects').update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw error
    return data
  },
  delete: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }
}

// ── Tracks ────────────────────────────────────────────────────────────────────
export const Tracks = {
  list: async () => {
    const { data, error } = await supabase.from('tracks').select('*').order('order_index')
    if (error) throw error
    return data || []
  }
}

// ── User Track Progress ───────────────────────────────────────────────────────
export const UserTracks = {
  get: async (userId, trackId) => {
    const { data, error } = await supabase
      .from('user_tracks').select('*').eq('user_id', userId).eq('track_id', trackId).single()
    if (error && error.code !== 'PGRST116') throw error
    return data || { current_lesson_index: 0, completed: false }
  },
  update: async (userId, trackId, updates) => {
    const { data, error } = await supabase
      .from('user_tracks')
      .upsert({ user_id: userId, track_id: trackId, ...updates, updated_at: new Date().toISOString() })
      .select().single()
    if (error) throw error
    return data
  }
}
