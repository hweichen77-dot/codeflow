// Product analytics. PostHog when VITE_POSTHOG_KEY is set; otherwise every call
// is a silent no-op so the static / unconfigured build behaves exactly as before.
//
// posthog-js is imported DYNAMICALLY so the dormant build never downloads it and
// it stays out of the eager vendor chunk. Events fired before the module finishes
// loading are buffered and flushed on init.
const KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com'

export const analyticsEnabled = Boolean(KEY) && typeof window !== 'undefined'

let posthog = null
let started = false
const queue = []

function flush() {
  if (!posthog) return
  while (queue.length) {
    const [fn, args] = queue.shift()
    try { posthog[fn](...args) } catch { /* ignore */ }
  }
}

function enqueue(fn, ...args) {
  if (!analyticsEnabled) return
  if (posthog) { try { posthog[fn](...args) } catch { /* ignore */ } }
  else if (started) queue.push([fn, args]) // loading — buffer until ready
}

export function initAnalytics() {
  if (!analyticsEnabled || started) return
  started = true
  import('posthog-js')
    .then((mod) => {
      posthog = mod.default || mod
      posthog.init(KEY, {
        api_host: HOST,
        capture_pageview: false, // we send our own SPA pageviews via NavigationTracker
        persistence: 'localStorage', // no third-party cookies
        autocapture: false, // explicit events only — keeps the event stream legible
      })
      flush()
    })
    .catch(() => { /* never let analytics break the app */ })
}

/** Track a named product event. Safe to call whether or not analytics is on. */
export function track(event, props = {}) {
  enqueue('capture', event, props)
}

/** Tie subsequent events to a stable user id (called on sign-in). */
export function identify(id, traits = {}) {
  if (!id) return
  enqueue('identify', id, traits)
}

/** Drop the identity link (called on sign-out). */
export function resetIdentity() {
  enqueue('reset')
}

/** SPA pageview. */
export function trackPageview(name) {
  enqueue('capture', '$pageview', { $current_url: window.location.href, page: name || undefined })
}
