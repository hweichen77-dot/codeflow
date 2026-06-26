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
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      })
    })
    .catch(() => {  })
}

export function captureError(error, context) {
  if (!monitoringEnabled) {
    if (import.meta.env.DEV) console.error('[captureError]', error, context)
    return
  }
  try {
    Sentry?.captureException(error, context ? { extra: context } : undefined)
  } catch {  }
}

export function setMonitoringUser(user) {
  if (!monitoringEnabled) return
  try {
    Sentry?.setUser(user ? { id: user.id, email: user.email } : null)
  } catch {  }
}
