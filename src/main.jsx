import React from 'react'
import ReactDOM from 'react-dom/client'
// Self-hosted fonts (bundled woff2) so they render identically on web and in the
// desktop app, whose CSP forbids remote font loading.
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource-variable/spline-sans-mono'
import App from '@/App.jsx'
import '@/index.css'
import { initAnalytics } from '@/lib/analytics'
import { initMonitoring } from '@/lib/monitoring'

initMonitoring()
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
