import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initAnalytics } from '@/lib/analytics'
import { initMonitoring } from '@/lib/monitoring'

// Stand up observability before the app renders so early errors/events are caught.
// Both are no-ops unless their env vars (VITE_SENTRY_DSN / VITE_POSTHOG_KEY) are set.
initMonitoring()
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
