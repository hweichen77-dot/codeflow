// Error monitoring. Sentry when VITE_SENTRY_DSN is set; otherwise a no-op.
//
// @sentry/react is imported DYNAMICALLY (not at module top) for two reasons:
//   1. It pulls in React at module-eval time (forwardRef); bundling it into the
//      generic vendor chunk races React's own chunk and crashes the app.
//   2. The dormant/static build (no DSN) then never downloads Sentry at all.
const DSN = import.meta.env.VITE_SENTRY_DSN || ''

export const monitoringEnabled = Boolean(DSN) && typeof window !== 'undefined'

let Sentry = null
let started = false

export function initMonitoring() {
  if (!monitoringEnabled || started) return
  started = true
  import('@sentry/react')
    .then((mod) => {
      Sentry = mod
      mod.init({
        dsn: DSN,
        environment: import.meta.env.MODE,
        release: __APP_VERSION__,
        // Conservative defaults — turn up sampling once real traffic arrives.
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      })
    })
    .catch(() => { /* ignore — monitoring is best-effort */ })
}

/** Report a caught error. No-op when monitoring is off or not yet loaded. */
export function captureError(error, context) {
  if (!monitoringEnabled) {
    // Still surface it in dev so failures aren't swallowed silently.
    if (import.meta.env.DEV) console.error('[captureError]', error, context)
    return
  }
  try {
    Sentry?.captureException(error, context ? { extra: context } : undefined)
  } catch { /* ignore */ }
}

/** Attach the signed-in user to error reports. */
export function setMonitoringUser(user) {
  if (!monitoringEnabled) return
  try {
    Sentry?.setUser(user ? { id: user.id, email: user.email } : null)
  } catch { /* ignore */ }
}
