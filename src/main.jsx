import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import { initAnalytics } from '@/lib/analytics'
import { initMonitoring } from '@/lib/monitoring'

initMonitoring()
initAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
