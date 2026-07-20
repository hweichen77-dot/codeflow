import React from 'react'
import { font } from "@/lib/tokens";
import { captureError } from '@/lib/monitoring'

const MONO = font.mono
const LABEL = font.body
const SERIF = font.display

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
        style={{ background: '#070B0A' }}
      >
        <div
          className="w-full max-w-md p-10 text-center"
          style={{ border: '1px solid #17201C', background: '#070B0A' }}
        >
          <div
            className="font-sans text-xs tracking-widest uppercase mb-3"
            style={{ color: '#FF6B5C', fontFamily: LABEL }}
          >
            SOMETHING BROKE
          </div>
          <h1
            style={{
              fontFamily: SERIF,
              fontSize: '1.8rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: '#ECF3EF',
              margin: '0 0 12px',
              lineHeight: 1.15,
            }}
          >
            This page hit an unexpected error.
          </h1>
          <p
            className="font-display text-sm mb-7"
            style={{ color: '#FFFFFF' }}
          >
            Your progress is saved. Try again, or head back to the start.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={this.handleReset}
              className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{ background: '#5ED29C', color: '#070B0A', fontWeight: 700, fontFamily: LABEL }}
            >
              Try again
            </button>
            <button
              onClick={this.handleReload}
              className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{ color: '#FFFFFF', border: '1px solid #26302B', fontFamily: LABEL }}
            >
              Go home
            </button>
          </div>
          {import.meta.env.DEV && this.state.error && (
            <pre
              className="mt-6 text-left overflow-auto"
              style={{ color: '#FFFFFF', fontSize: '11px', fontFamily: MONO, maxHeight: '160px' }}
            >
              {String(this.state.error?.stack || this.state.error)}
            </pre>
          )}
        </div>
      </div>
    )
  }
}
