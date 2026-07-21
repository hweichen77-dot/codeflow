import { touchStreak } from '../lib/progressStats'
import { recordActivity } from '../lib/retention'
import { track } from '../lib/analytics'

export const PROGRESS_KEY = 'codeflow_progress_v1'
export const CAPSTONE_KEY = 'codeflow_capstones_v1'
export const CHALLENGES_KEY = 'codeflow_challenges_v1'

export const PROGRESS_CHANGED_EVENT = 'codeflow:progress-changed'
const emitChange = () => {
  if (typeof window === 'undefined') return
  try { window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT)) } catch {  }
}

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

let storageErrorNotified = false
const writeArr = (key, arr) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(key, JSON.stringify(arr))
    emitChange()
  } catch {
    if (!storageErrorNotified) {
      storageErrorNotified = true
      try { window.dispatchEvent(new Event('codeflow:storage-error')) } catch {  }
    }
  }
}

export function clearAllProgress() {
  if (typeof window === 'undefined') return
  for (const key of [PROGRESS_KEY, CAPSTONE_KEY, CHALLENGES_KEY]) {
    try { window.localStorage.removeItem(key) } catch {  }
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

export function markChallengeComplete(id) {
  if (!id) return null
  const rows = readArr(CHALLENGES_KEY)
  const idx = rows.findIndex((r) => r.id === id)
  const wasNew = idx === -1 || rows[idx].status !== 'completed'
  const completed_at = new Date().toISOString()
  if (idx === -1) {
    rows.push({ id, status: 'completed', completed_at })
  } else {
    rows[idx] = { ...rows[idx], status: 'completed', completed_at }
  }
  writeArr(CHALLENGES_KEY, rows)
  try { touchStreak() } catch {  }
  if (wasNew) {
    try { recordActivity('challenge') } catch {  }
    try { track('challenge_complete', { id }) } catch {  }
  }
  return rows.find((r) => r.id === id) || null
}

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

export function getChallengeStats() {
  const rows = readArr(CHALLENGES_KEY)
  const completed = rows.filter((r) => r.status === 'completed').length
  const inProgress = rows.filter((r) => r.status === 'in_progress').length
  const completedDays = new Set(
    rows
      .filter((r) => r.completed_at)
      .map((r) => new Date(r.completed_at).toDateString())
  )
  let streak = 0
  const cursor = new Date()
  while (completedDays.has(cursor.toDateString())) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
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
