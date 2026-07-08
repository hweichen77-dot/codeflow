const KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

export const analyticsEnabled = Boolean(KEY) && typeof window !== 'undefined'

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
  enqueue('capture', event, props)
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
