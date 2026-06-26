const DSN = import.meta.env.VITE_SENTRY_DSN || ''

export const monitoringEnabled = Boolean(DSN) && typeof window !== 'undefined'

let Sentry = null
let started = false

// Defence-in-depth: redact secrets/PII from anything Sentry sends, in case a
// token or email lands in an error message, URL, or breadcrumb.
const REDACTIONS = [
  // OAuth / API secrets in query or fragment params
  [/\b(access_token|refresh_token|provider_token|provider_refresh_token|id_token|token|code|apikey|api_key)=[^&\s#"']+/gi, '$1=[REDACTED]'],
  // JWTs (Supabase access tokens, etc.)
  [/eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]'],
  // Email addresses
  [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[REDACTED_EMAIL]'],
]
function scrubString(s) {
  let out = s
  for (const [re, rep] of REDACTIONS) out = out.replace(re, rep)
  return out
}
function deepScrub(value, depth = 0, seen = new Set()) {
  if (depth > 6 || value == null) return value
  if (typeof value === 'string') return scrubString(value)
  if (typeof value !== 'object' || seen.has(value)) return value
  seen.add(value)
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = deepScrub(value[i], depth + 1, seen)
  } else {
    for (const k of Object.keys(value)) value[k] = deepScrub(value[k], depth + 1, seen)
  }
  return value
}

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
        sendDefaultPii: false,
        beforeSend: (event) => deepScrub(event),
        beforeBreadcrumb: (crumb) => deepScrub(crumb),
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
    Sentry?.setUser(user ? { id: user.id } : null)
  } catch {  }
}
