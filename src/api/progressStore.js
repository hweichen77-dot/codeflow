// localStorage-backed entity stores that mimic the api entity API shape.
import { touchStreak } from '../lib/progressStats'

const PROGRESS_KEY = 'codeflow_progress_v1'
const CAPSTONE_KEY = 'codeflow_capstones_v1'
const CHALLENGES_KEY = 'codeflow_challenges_v1'

let counter = 0

const readArr = (key) => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const writeArr = (key, arr) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(arr))
  } catch {
    /* ignore */
  }
}

const matches = (row, query) => {
  if (!query) return true
  return Object.keys(query).every((k) => {
    const want = query[k]
    if (typeof want === 'boolean') return Boolean(row[k]) === want
    return row[k] === want
  })
}

const applySort = (rows, sort) => {
  if (!sort || typeof sort !== 'string') return rows
  const desc = sort.startsWith('-')
  const field = desc ? sort.slice(1) : sort
  const sorted = [...rows].sort((a, b) => {
    const av = a[field]
    const bv = b[field]
    if (av === bv) return 0
    return av > bv ? 1 : -1
  })
  return desc ? sorted.reverse() : sorted
}

const newId = (prefix) => `${prefix}-${Date.now()}-${counter++}`

export const UserProgress = {
  async filter(query, sort) {
    const rows = readArr(PROGRESS_KEY).filter((r) => matches(r, query))
    return applySort(rows, sort)
  },
  async create(data) {
    const rows = readArr(PROGRESS_KEY)
    const row = { id: newId('up'), ...data }
    rows.push(row)
    writeArr(PROGRESS_KEY, rows)
    return row
  },
  async update(id, patch) {
    const rows = readArr(PROGRESS_KEY)
    const idx = rows.findIndex((r) => r.id === id)
    if (idx === -1) return null
    rows[idx] = { ...rows[idx], ...patch }
    writeArr(PROGRESS_KEY, rows)
    return rows[idx]
  },
  async list(sort) {
    return applySort(readArr(PROGRESS_KEY), sort)
  },
}

/**
 * Guest-friendly, localStorage-backed challenge completion store.
 * Records form: { id, status: 'completed' | 'in_progress', completed_at }.
 * Used by ChallengeDetail (write) and Dashboard (read) so guest mode shows
 * real numbers instead of the Supabase-only path that returns nothing.
 */

/** Mark a challenge as completed (idempotent). Also advances the day streak. */
export function markChallengeComplete(id) {
  if (!id) return null
  const rows = readArr(CHALLENGES_KEY)
  const idx = rows.findIndex((r) => r.id === id)
  const completed_at = new Date().toISOString()
  if (idx === -1) {
    rows.push({ id, status: 'completed', completed_at })
  } else {
    rows[idx] = { ...rows[idx], status: 'completed', completed_at }
  }
  writeArr(CHALLENGES_KEY, rows)
  // Real learning activity → keep the streak alive on completion, not just on
  // visiting the home route.
  try { touchStreak() } catch { /* ignore */ }
  return rows.find((r) => r.id === id) || null
}

/** Mark a challenge as in-progress (only if not already completed). */
export function markChallengeInProgress(id) {
  if (!id) return null
  const rows = readArr(CHALLENGES_KEY)
  const idx = rows.findIndex((r) => r.id === id)
  if (idx === -1) {
    rows.push({ id, status: 'in_progress', completed_at: null })
  } else if (rows[idx].status !== 'completed') {
    rows[idx] = { ...rows[idx], status: 'in_progress' }
  }
  writeArr(CHALLENGES_KEY, rows)
  return rows.find((r) => r.id === id) || null
}

/** Aggregate challenge counts + a completion-date streak for the Dashboard. */
export function getChallengeStats() {
  const rows = readArr(CHALLENGES_KEY)
  const completed = rows.filter((r) => r.status === 'completed').length
  const inProgress = rows.filter((r) => r.status === 'in_progress').length
  const completedDates = rows
    .filter((r) => r.completed_at)
    .map((r) => new Date(r.completed_at).toDateString())
  const uniqueDates = [...new Set(completedDates)].sort().reverse()
  let streak = 0
  const today = new Date()
  for (let i = 0; i < uniqueDates.length; i++) {
    const expected = new Date(today)
    expected.setDate(today.getDate() - i)
    if (uniqueDates[i] === expected.toDateString()) streak++
    else break
  }
  return { completed, inProgress, streak }
}

export const CapstoneSubmission = {
  async filter(query, sort) {
    const rows = readArr(CAPSTONE_KEY).filter((r) => matches(r, query))
    return applySort(rows, sort)
  },
  async create(data) {
    const rows = readArr(CAPSTONE_KEY)
    const row = {
      id: newId('cap'),
      submitted_date: data.submitted_date || new Date().toISOString(),
      ...data,
    }
    rows.push(row)
    writeArr(CAPSTONE_KEY, rows)
    return row
  },
  async list(sort) {
    return applySort(readArr(CAPSTONE_KEY), sort)
  },
}
