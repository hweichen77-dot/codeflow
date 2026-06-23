import React from 'react'
import { captureError } from '@/lib/monitoring'

const LABEL = "'Hanken Grotesk', system-ui, sans-serif"
const SERIF = "'Bricolage Grotesque', system-ui, sans-serif"

// Matches the errors thrown when a hashed route chunk no longer exists — the
// classic "user has an old tab open after a deploy" failure. We ship on every
// change, so this WILL happen; a one-shot reload pulls the fresh index + chunks.
const CHUNK_ERROR =
  /Loading chunk|ChunkLoadError|dynamically imported module|Failed to fetch dynamically imported|Importing a module script failed/i

const RELOAD_GUARD = 'codeflow:chunk-reloaded'

// Route-level boundary. Sits inside <Suspense> so it catches both a rejected
// lazy() import (stale chunk after deploy → reload) and any render-time throw
// from a single page (e.g. one malformed challenge record) — isolating the
// failure to the content area instead of taking down the whole app shell.
export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    const isChunk = CHUNK_ERROR.test(String(error?.message || error?.name || ''))
    if (isChunk) {
      // Reload once to fetch the new build. The session guard prevents a reload
      // loop if the failure is something other than a genuinely-stale chunk.
      try {
        if (!sessionStorage.getItem(RELOAD_GUARD)) {
          sessionStorage.setItem(RELOAD_GUARD, '1')
          window.location.reload()
          return
        }
      } catch { /* sessionStorage unavailable — fall through to the fallback UI */ }
    }
    captureError(error, { componentStack: info?.componentStack, scope: 'route' })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex items-center justify-center px-6" style={{ minHeight: '60vh' }}>
        <div className="w-full max-w-md p-10 text-center" style={{ border: '1px solid #262219', background: '#131009' }}>
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#FF6B5C', fontFamily: LABEL }}>
            § THIS PAGE HIT A SNAG
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F2EDE2', margin: '0 0 10px', lineHeight: 1.15 }}>
            Couldn&apos;t load this page.
          </h1>
          <p className="font-display text-sm mb-7" style={{ color: '#C9C1B2' }}>
            Your progress is saved. Try again, or pick another page from the menu.
          </p>
          <button
            onClick={this.handleRetry}
            className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
            style={{ background: '#E8A33C', color: '#15130E', fontWeight: 700, fontFamily: LABEL }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
