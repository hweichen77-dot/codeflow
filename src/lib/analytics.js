const KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

import { getAttribution } from './attribution'

export const OPT_OUT_KEY = 'codeflow.analyticsOptOut'

function attributionProps() {
  const a = getAttribution()
  const out = {}
  for (const [k, v] of Object.entries(a)) {
    if (k === 'first_seen' || k === 'landing_path') continue
    out[k] = v
  }
  return out
}

function signalsOptOut() {
  if (typeof window === 'undefined') return false
  try {
    if (window.localStorage.getItem(OPT_OUT_KEY) === '1') return true
  } catch {  }
  const nav = typeof navigator !== 'undefined' ? navigator : null
  if (!nav) return false
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1' || window.doNotTrack === '1'
}

export function isAnalyticsOptedOut() {
  return signalsOptOut()
}

export function setAnalyticsOptOut(optOut) {
  try {
    if (optOut) window.localStorage.setItem(OPT_OUT_KEY, '1')
    else window.localStorage.removeItem(OPT_OUT_KEY)
  } catch {  }
  if (optOut && posthog) {
    try { posthog.opt_out_capturing() } catch {  }
  }
}

export const analyticsEnabled = Boolean(KEY) && typeof window !== 'undefined' && !signalsOptOut()

const SENSITIVE_PARAMS = ['access_token', 'refresh_token', 'provider_token', 'provider_refresh_token', 'id_token', 'token', 'code']
function sanitizeUrl(value) {
  if (typeof value !== 'string' || !value) return value
  try {
    const u = new URL(value, window.location.origin)
    u.hash = ''
    for (const p of SENSITIVE_PARAMS) u.searchParams.delete(p)
    return u.toString()
  } catch {
    return value.split('#')[0]
  }
}
function sanitizeProperties(props) {
  if (!props) return props
  for (const k of Object.keys(props)) {
    if (typeof props[k] === 'string' && /url|referrer|pathname|href/i.test(k)) {
      props[k] = sanitizeUrl(props[k])
    }
  }
  return props
}

let posthog = null
let started = false
const queue = []

function flush() {
  if (!posthog) return
  while (queue.length) {
    const [fn, args] = queue.shift()
    try { posthog[fn](...args) } catch {  }
  }
}

function enqueue(fn, ...args) {
  if (!analyticsEnabled) return
  if (posthog) { try { posthog[fn](...args) } catch {  } }
  else if (started) queue.push([fn, args])
}

export function initAnalytics() {
  if (!analyticsEnabled || started) return
  started = true
  import('posthog-js')
    .then((mod) => {
      posthog = mod.default || mod
      posthog.init(KEY, {
        api_host: HOST,
        capture_pageview: false,
        persistence: 'localStorage',
        autocapture: false,
        disable_session_recording: true,
        sanitize_properties: sanitizeProperties,
      })
      flush()
    })
    .catch(() => {  })
}

export function track(event, props = {}) {
  enqueue('capture', event, { ...attributionProps(), ...props })
}

const FUNNEL = {
  landing: 'funnel_landing',
  playStart: 'funnel_play_start',
  challengeComplete: 'funnel_challenge_complete',
  signup: 'funnel_signup',
}

export function trackFunnel(step, props = {}) {
  const event = FUNNEL[step]
  if (!event) return
  track(event, props)
}

export function identify(id, traits = {}) {
  if (!id) return
  enqueue('identify', id, traits)
}

export function resetIdentity() {
  enqueue('reset')
}

export function trackPageview(name) {
  enqueue('capture', '$pageview', { $current_url: sanitizeUrl(window.location.href), page: name || undefined })
}
