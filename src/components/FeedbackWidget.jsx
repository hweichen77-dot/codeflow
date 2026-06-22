import React, { useState } from 'react'
import { track } from '@/lib/analytics'

const MONO = "'Space Mono', monospace"
const REPO = 'hweichen77-dot/codeflow'

const KINDS = [
  { key: 'bug', label: 'Bug' },
  { key: 'idea', label: 'Idea' },
  { key: 'content', label: 'Lesson issue' },
]

// Floating "send feedback" control. Early users WILL hit rough edges; without a
// one-tap channel that friction turns into silent churn. Submitting opens a
// prefilled GitHub issue (no backend required) and falls back to mailto.
export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState('bug')
  const [text, setText] = useState('')

  const toggle = () => {
    setOpen((v) => {
      if (!v) track('feedback_open')
      return !v
    })
  }

  const submit = (e) => {
    e.preventDefault()
    const body = text.trim()
    if (!body) return
    track('feedback_submit', { kind })

    const title = `[${kind}] ${body.slice(0, 60)}${body.length > 60 ? '…' : ''}`
    const issueBody = `${body}\n\n---\n- Page: ${window.location.pathname}\n- Type: ${kind}\n- UA: ${navigator.userAgent}`
    const url =
      `https://github.com/${REPO}/issues/new` +
      `?title=${encodeURIComponent(title)}` +
      `&body=${encodeURIComponent(issueBody)}` +
      `&labels=${encodeURIComponent(kind === 'bug' ? 'bug' : 'feedback')}`

    window.open(url, '_blank', 'noopener,noreferrer')
    setText('')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={toggle}
        aria-label="Send feedback"
        aria-expanded={open}
        className="fixed z-[80] font-mono text-xs tracking-widest uppercase transition-all duration-150"
        style={{
          right: '20px',
          bottom: '20px',
          padding: '12px 16px',
          background: open ? '#1a1a1a' : '#b8ff00',
          color: open ? '#b8ff00' : '#0a0a0a',
          border: '1px solid #b8ff0055',
          fontWeight: 700,
          fontFamily: MONO,
          boxShadow: '0 6px 24px rgba(0,0,0,0.5)',
        }}
      >
        {open ? '× Close' : '✦ Feedback'}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Send feedback"
          className="fixed z-[80]"
          style={{
            right: '20px',
            bottom: '72px',
            width: 'min(360px, calc(100vw - 40px))',
            background: '#0d0d0d',
            border: '1px solid #1f1f1f',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          <form onSubmit={submit} style={{ padding: '20px' }}>
            <div
              className="font-mono text-xs tracking-widest uppercase mb-3"
              style={{ color: '#c4c4c4', fontFamily: MONO }}
            >
              Tell us what's up
            </div>

            <div className="flex gap-1 mb-3">
              {KINDS.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => setKind(k.key)}
                  className="font-mono px-3 py-2 transition-all"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: kind === k.key ? '#0a0a0a' : '#888',
                    background: kind === k.key ? '#b8ff00' : 'transparent',
                    border: '1px solid #2a2a2a',
                    fontFamily: MONO,
                  }}
                >
                  {k.label}
                </button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
              rows={4}
              placeholder={
                kind === 'bug'
                  ? 'What went wrong, and what did you expect?'
                  : kind === 'content'
                  ? 'Which lesson, and what was confusing or wrong?'
                  : 'What would make CodeFlow better?'
              }
              className="w-full px-3 py-2 font-display text-sm outline-none mb-3"
              style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#e8e8e8', resize: 'vertical' }}
            />

            <div className="flex items-center justify-between">
              <a
                href="mailto:hello@codeflow.app"
                className="font-mono text-xs"
                style={{ color: '#888', fontFamily: MONO }}
              >
                or email us
              </a>
              <button
                type="submit"
                disabled={!text.trim()}
                className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
                style={{
                  background: text.trim() ? '#b8ff00' : '#1a1a1a',
                  color: text.trim() ? '#0a0a0a' : '#888',
                  fontWeight: 700,
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: MONO,
                }}
              >
                Send →
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
