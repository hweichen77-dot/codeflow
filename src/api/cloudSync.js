import { supabase, auth as supaAuth } from './supabaseClient'
import { queryClientInstance } from '../lib/query-client'
import {
  PROGRESS_KEY,
  CAPSTONE_KEY,
  CHALLENGES_KEY,
  PROGRESS_CHANGED_EVENT,
} from './progressStore'
import { getStreakSyncState } from '../lib/progressStats'

const STATE_VERSION = 1
const DEBOUNCE_MS = 1500

let activeUserId = null
let detachListener = null
let pushTimer = null
let pushing = false
let dirty = false

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
  try { window.localStorage.setItem(key, JSON.stringify(arr)) } catch {  }
}

const readStreak = () => {
  try { return getStreakSyncState() } catch { return null }
}

const collectLocalState = () => ({
  version: STATE_VERSION,
  progress: readArr(PROGRESS_KEY),
  capstones: readArr(CAPSTONE_KEY),
  challenges: readArr(CHALLENGES_KEY),
  streak: readStreak(),
})

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

const mergeStreak = (a, b) => {
  if (!a) return b || null
  if (!b) return a
  const recent = (b.lastVisit || '') > (a.lastVisit || '') ? b : a
  return {
    current: recent.current || 0,
    lastVisit: recent.lastVisit || null,
    longest: Math.max(a.longest || 0, b.longest || 0),
  }
}

const mergeState = (local, remote) => {
  if (!remote) return local
  return {
    version: STATE_VERSION,
    progress: mergeProgress(local.progress, remote.progress),
    capstones: mergeById(local.capstones, remote.capstones),
    challenges: mergeChallenges(local.challenges, remote.challenges),
    streak: mergeStreak(local.streak, remote.streak),
  }
}

async function fetchRemote(userId) {
  const { data, error } = await supabase
    .from('user_state').select('state').eq('user_id', userId).single()
  if (error && error.code !== 'PGRST116') throw error
  return data?.state || null
}

async function upsertRemote(userId, state) {
  const { error } = await supabase
    .from('user_state')
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() })
  if (error) throw error
}

export async function pushState() {
  if (!activeUserId) return
  if (pushing) { dirty = true; return }
  pushing = true
  dirty = false
  try {
    await upsertRemote(activeUserId, collectLocalState())
  } catch {  } finally {
    pushing = false
    if (dirty) scheduleSync()
  }
}

function scheduleSync() {
  if (!activeUserId) return
  if (pushTimer) clearTimeout(pushTimer)
  pushTimer = setTimeout(() => { pushTimer = null; pushState() }, DEBOUNCE_MS)
}

export async function pullAndMerge(userId) {
  if (!supaAuth.isConfigured || !userId) return false
  let remote
  try { remote = await fetchRemote(userId) } catch { return false }
  const local = collectLocalState()
  const merged = mergeState(local, remote)
  writeArr(PROGRESS_KEY, merged.progress)
  writeArr(CAPSTONE_KEY, merged.capstones)
  writeArr(CHALLENGES_KEY, merged.challenges)
  try { queryClientInstance.invalidateQueries() } catch {  }
  try { await upsertRemote(userId, merged) } catch {  }
  return true
}

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

export async function deactivateSync() {
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null }
  try { await pushState() } catch {  }
  if (detachListener) { detachListener(); detachListener = null }
  activeUserId = null
  dirty = false
}
