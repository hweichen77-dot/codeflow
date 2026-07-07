import React, { useState } from 'react'
import { font } from "@/lib/tokens";
import { track } from '@/lib/analytics'

const LABEL = font.body
const REPO = 'hweichen77-dot/codeflow'

const KINDS = [
  { key: 'bug', label: 'Bug' },
  { key: 'idea', label: 'Idea' },
  { key: 'content', label: 'Lesson issue' },
]

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
        className="fixed z-[80] font-sans text-xs tracking-widest uppercase transition-all duration-150"
        style={{
          left: '20px',
          bottom: '20px',
          padding: '12px 16px',
          background: open ? '#262219' : '#E8A33C',
          color: open ? '#E8A33C' : '#15130E',
          border: '1px solid #E8A33C55',
          fontWeight: 700,
          fontFamily: LABEL,
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
            left: '20px',
            bottom: '72px',
            width: 'min(360px, calc(100vw - 40px))',
            background: '#131009',
            border: '1px solid #2A261E',
            boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
          }}
        >
          <form onSubmit={submit} style={{ padding: '20px' }}>
            <div
              className="font-sans text-xs tracking-widest uppercase mb-3"
              style={{ color: '#FFFFFF', fontFamily: LABEL }}
            >
              Tell us what's up
            </div>

            <div className="flex gap-1 mb-3">
              {KINDS.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => setKind(k.key)}
                  className="font-sans px-3 py-2 transition-all"
                  style={{
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: kind === k.key ? '#15130E' : '#8F8779',
                    background: kind === k.key ? '#E8A33C' : 'transparent',
                    border: '1px solid #34302A',
                    fontFamily: LABEL,
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
              aria-label="Feedback message"
              rows={4}
              placeholder={
                kind === 'bug'
                  ? 'What went wrong, and what did you expect?'
                  : kind === 'content'
                  ? 'Which lesson, and what was confusing or wrong?'
                  : 'What would make CodeFlow better?'
              }
              className="w-full px-3 py-2 font-display text-sm outline-none mb-3"
              style={{ background: '#15130E', border: '1px solid #34302A', color: '#ECE7DC', resize: 'vertical' }}
            />

            <div className="flex items-center justify-between">
              <a
                href="mailto:hello@codeflow.app"
                className="font-sans text-xs"
                style={{ color: '#FFFFFF', fontFamily: LABEL }}
              >
                or email us
              </a>
              <button
                type="submit"
                disabled={!text.trim()}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
                style={{
                  background: text.trim() ? '#E8A33C' : '#262219',
                  color: text.trim() ? '#15130E' : '#8F8779',
                  fontWeight: 700,
                  cursor: text.trim() ? 'pointer' : 'not-allowed',
                  fontFamily: LABEL,
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
