import { namespacedKey } from './progressStats'

const KEY = () => namespacedKey('codeflow_attribution')
const FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref']

function read() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY())
    const parsed = raw ? JSON.parse(raw) : null
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function firstTouchFromUrl() {
  const params = new URLSearchParams(window.location.search)
  const found = {}
  for (const field of FIELDS) {
    const value = params.get(field)
    if (value) found[field] = value.slice(0, 120)
  }
  if (Object.keys(found).length === 0) return null
  return found
}

function referrerHost() {
  try {
    if (!document.referrer) return null
    const host = new URL(document.referrer).host
    if (!host || host === window.location.host) return null
    return host
  } catch {
    return null
  }
}

export function captureAttribution() {
  if (typeof window === 'undefined') return null
  const existing = read()
  if (existing) return existing

  const tagged = firstTouchFromUrl()
  const host = referrerHost()
  if (!tagged && !host) return null

  const record = {
    ...(tagged || {}),
    ...(host ? { referrer_host: host } : {}),
    landing_path: window.location.pathname.slice(0, 160),
    first_seen: new Date().toISOString(),
  }
  try {
    window.localStorage.setItem(KEY(), JSON.stringify(record))
  } catch {  }
  return record
}

export function getAttribution() {
  return read() || {}
}
