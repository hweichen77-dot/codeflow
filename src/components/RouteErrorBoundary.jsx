import React from 'react'
import { font } from "@/lib/tokens";
import { captureError } from '@/lib/monitoring'

const LABEL = font.body
const SERIF = font.display

const CHUNK_ERROR =
  /Loading chunk|ChunkLoadError|dynamically imported module|Failed to fetch dynamically imported|Importing a module script failed/i

const RELOAD_KEY = 'codeflow:chunk-reload-at'
const RELOAD_COOLDOWN_MS = 10000

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
      try {
        const last = Number(sessionStorage.getItem(RELOAD_KEY) || 0)
        if (Date.now() - last > RELOAD_COOLDOWN_MS) {
          sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
          window.location.reload()
          return
        }
      } catch {  }
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
        <div className="w-full max-w-md p-10 text-center" style={{ border: '1px solid #17201C', background: '#070B0A' }}>
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#FF6B5C', fontFamily: LABEL }}>
            THIS PAGE HIT A SNAG
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ECF3EF', margin: '0 0 10px', lineHeight: 1.15 }}>
            Couldn&apos;t load this page.
          </h1>
          <p className="font-display text-sm mb-7" style={{ color: '#FFFFFF' }}>
            Your progress is saved. Try again, or pick another page from the menu.
          </p>
          <button
            onClick={this.handleRetry}
            className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
            style={{ background: '#5ED29C', color: '#070B0A', fontWeight: 700, fontFamily: LABEL }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }
}
