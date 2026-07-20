import React from 'react'
import ReactDOM from 'react-dom/client'

import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/inter/800.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
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
