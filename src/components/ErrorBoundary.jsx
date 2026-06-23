import React from 'react'
import { captureError } from '@/lib/monitoring'

const MONO = "'Spline Sans Mono', ui-monospace, monospace"
const SERIF = "'Bricolage Grotesque', system-ui, sans-serif"

// Top-level crash guard. Without it, any render-time exception unmounts the
// whole React tree and leaves users staring at a blank #root — the single
// worst first-run experience. This catches it, reports to monitoring, and
// offers a recovery path instead.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    captureError(error, { componentStack: info?.componentStack })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    window.location.href = import.meta.env.BASE_URL || '/'
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#15130E' }}
      >
        <div
          className="w-full max-w-md p-10 text-center"
          style={{ border: '1px solid #262219', background: '#131009' }}
        >
          <div
            className="font-mono text-xs tracking-widest uppercase mb-3"
            style={{ color: '#FF6B5C', fontFamily: MONO }}
          >
            § SOMETHING BROKE
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#F2EDE2',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            This page hit an unexpected error.
          </h1>
          <p
            className="font-display text-sm mb-7"
            style={{ color: '#C9C1B2' }}
          >
            Your progress is saved. Try again, or head back to the start.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{ background: '#E8A33C', color: '#15130E', fontWeight: 700, fontFamily: MONO }}
            >
              Try again
            </button>
            <button
              onClick={this.handleReload}
              className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{ color: '#C9C1B2', border: '1px solid #34302A', fontFamily: MONO }}
            >
              Go home
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre
              className="mt-6 text-left overflow-auto"
              style={{ color: '#8F8779', fontSize: '11px', fontFamily: MONO, maxHeight: '160px' }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
