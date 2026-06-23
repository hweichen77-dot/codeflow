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
import { queryClientInstance } from '../lib/query-client'
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
let dirty = false // a change landed mid-push; re-sync after the in-flight push

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

// Progress rows get a device-local generated id, so the same lesson completed on
// two devices produces two rows with different ids — a plain id-union would keep
// both, double-counting XP and mis-firing project-completion gates. Collapse by
// lesson_id (the stable natural key), keeping the completed/earliest version.
const mergeProgress = (a = [], b = []) => {
  const byLesson = new Map()
  for (const row of mergeById(a, b)) {
    if (!row) continue
    const key = row.lesson_id ?? row.id
    const prev = byLesson.get(key)
    if (!prev) { byLesson.set(key, row); continue }
    const stamps = [prev.completed_date, row.completed_date].filter(Boolean).sort()
    byLesson.set(key, {
      ...prev,
      ...row,
      completed: Boolean(prev.completed || row.completed),
      completed_date: stamps[0] || prev.completed_date || row.completed_date,
    })
  }
  return [...byLesson.values()]
}

const mergeState = (local, remote) => {
  if (!remote) return local
  return {
    version: STATE_VERSION,
    progress: mergeProgress(local.progress, remote.progress),
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
  if (!activeUserId) return
  // A push is already running — flag that newer state exists so we re-sync after,
  // instead of silently dropping the change that arrived mid-flight.
  if (pushing) { dirty = true; return }
  pushing = true
  dirty = false
  try {
    await upsertRemote(activeUserId, collectLocalState())
  } catch { /* offline / transient — next change reschedules */ } finally {
    pushing = false
    if (dirty) scheduleSync()
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
  // The page's React Query caches mounted with the pre-merge (often empty) local
  // data and won't refetch on their own (refetchOnWindowFocus is off). Invalidate
  // so the freshly-pulled cloud progress actually renders, instead of the user
  // seeing "0 complete" on a new device and assuming their work was lost.
  try { queryClientInstance.invalidateQueries() } catch { /* ignore */ }
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
export async function deactivateSync() {
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null }
  // Flush the latest local state up before we drop the active user, so a logout
  // right after an action doesn't strand that action un-synced.
  try { await pushState() } catch { /* ignore */ }
  if (detachListener) { detachListener(); detachListener = null }
  activeUserId = null
  dirty = false
}
