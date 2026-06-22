// Cloud progress sync for signed-in (email/OAuth) accounts.
//
// Progress normally lives only in localStorage (see progressStore.js), which is
// lost on cache-clear or device switch. When a real account is active we mirror
// that same local state into a single per-user JSONB row (`public.user_state`)
// and merge it back on sign-in — giving durable, cross-device progress without
// rewriting the local-first store the whole app is built on.
//
// Guest mode and the unconfigured static build never touch the network: every
// entry point bails unless Supabase is configured AND a user id is active.
import { supabase, auth as supaAuth } from './supabaseClient'
import {
  PROGRESS_KEY,
  CAPSTONE_KEY,
  CHALLENGES_KEY,
  PROGRESS_CHANGED_EVENT,
} from './progressStore'

const STATE_VERSION = 1
const DEBOUNCE_MS = 1500

let activeUserId = null
let detachListener = null
let pushTimer = null
let pushing = false

const readArr = (key) => {
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeArr = (key, arr) => {
  try { window.localStorage.setItem(key, JSON.stringify(arr)) } catch { /* ignore */ }
}

const collectLocalState = () => ({
  version: STATE_VERSION,
  progress: readArr(PROGRESS_KEY),
  capstones: readArr(CAPSTONE_KEY),
  challenges: readArr(CHALLENGES_KEY),
})

// ── Merge: union by id; for challenges, "completed" beats "in_progress" and the
//    earliest completion timestamp wins (first time you solved it is the truth).
const mergeById = (a = [], b = []) => {
  const out = new Map()
  for (const row of [...a, ...b]) {
    if (!row || row.id == null) continue
    out.set(row.id, out.has(row.id) ? { ...out.get(row.id), ...row } : row)
  }
  return [...out.values()]
}

const mergeChallenges = (a = [], b = []) => {
  const out = new Map()
  for (const row of [...a, ...b]) {
    if (!row || row.id == null) continue
    const prev = out.get(row.id)
    if (!prev) { out.set(row.id, { ...row }); continue }
    const status = prev.status === 'completed' || row.status === 'completed' ? 'completed' : row.status || prev.status
    const stamps = [prev.completed_at, row.completed_at].filter(Boolean).sort()
    out.set(row.id, { ...prev, ...row, status, completed_at: stamps[0] || null })
  }
  return [...out.values()]
}

const mergeState = (local, remote) => {
  if (!remote) return local
  return {
    version: STATE_VERSION,
    progress: mergeById(local.progress, remote.progress),
    capstones: mergeById(local.capstones, remote.capstones),
    challenges: mergeChallenges(local.challenges, remote.challenges),
  }
}

async function fetchRemote(userId) {
  const { data, error } = await supabase
    .from('user_state').select('state').eq('user_id', userId).single()
  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no row yet
  return data?.state || null
}

async function upsertRemote(userId, state) {
  const { error } = await supabase
    .from('user_state')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() })
  if (error) throw error
}

/** Push current local state to the cloud (debounced via scheduleSync). */
export async function pushState() {
  if (!activeUserId || pushing) return
  pushing = true
  try {
    await upsertRemote(activeUserId, collectLocalState())
  } catch { /* offline / transient — next change reschedules */ } finally {
    pushing = false
  }
}

function scheduleSync() {
  if (!activeUserId) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => { pushTimer = null; pushState() }, DEBOUNCE_MS)
}

/** Pull remote state and merge it into local storage. Returns true if changed. */
export async function pullAndMerge(userId) {
  if (!supaAuth.isConfigured || !userId) return false
  let remote
  try { remote = await fetchRemote(userId) } catch { return false }
  const local = collectLocalState()
  const merged = mergeState(local, remote)
  writeArr(PROGRESS_KEY, merged.progress)
  writeArr(CAPSTONE_KEY, merged.capstones)
  writeArr(CHALLENGES_KEY, merged.challenges)
  // Push the merged result so the cloud reflects local-only progress too.
  try { await upsertRemote(userId, merged) } catch { /* ignore */ }
  return true
}

/**
 * Turn on sync for a signed-in user: merge cloud↔local once, then mirror every
 * subsequent local change up. Safe to call repeatedly with the same id.
 */
export async function activateSync(userId) {
  if (!supaAuth.isConfigured || !userId || typeof window === 'undefined') return
  if (activeUserId === userId) return
  activeUserId = userId

  await pullAndMerge(userId)

  if (!detachListener) {
    const handler = () => scheduleSync()
    window.addEventListener(PROGRESS_CHANGED_EVENT, handler)
    detachListener = () => window.removeEventListener(PROGRESS_CHANGED_EVENT, handler)
  }
}

/** Turn off sync (called on sign-out). Flushes any pending push first. */
export function deactivateSync() {
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null }
  if (detachListener) { detachListener(); detachListener = null }
  activeUserId = null
}
