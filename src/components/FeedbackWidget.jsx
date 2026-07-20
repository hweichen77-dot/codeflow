import React, { useState } from 'react'
import { font } from "@/lib/tokens";
import { track } from '@/lib/analytics'
import { supabase } from '@/api/supabaseClient'

const LABEL = font.body

const KINDS = [
  { key: 'bug', label: 'Bug' },
  { key: 'idea', label: 'Idea' },
  { key: 'content', label: 'Lesson issue' },
]

export default function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [kind, setKind] = useState('bug')
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')

  const toggle = () => {
    setOpen((v) => {
      if (!v) track('feedback_open')
      return !v
    })
  }

  const submit = async (e) => {
    e.preventDefault()
    const body = text.trim()
    if (!body || status === 'sending') return
    track('feedback_submit', { kind })
    setStatus('sending')

    try {
      const { data, error } = await supabase.functions.invoke('feedback', {
        body: { kind, text: body, page: window.location.pathname, ua: navigator.userAgent },
      })
      if (error || data?.error) throw error || new Error(data.error)
      setStatus('sent')
      setText('')
      setTimeout(() => { setOpen(false); setStatus('idle') }, 1200)
    } catch {
      setStatus('error')
    }
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
          background: open ? '#17201C' : '#5ED29C',
          color: open ? '#5ED29C' : '#070B0A',
          border: '1px solid #5ED29C55',
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
            background: '#070B0A',
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
                    color: kind === k.key ? '#070B0A' : '#8EA098',
                    background: kind === k.key ? '#5ED29C' : 'transparent',
                    border: '1px solid #26302B',
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
                  : 'What would make Compilearn better?'
              }
              className="w-full px-3 py-2 font-display text-sm outline-none mb-3"
              style={{ background: '#070B0A', border: '1px solid #26302B', color: '#ECF3EF', resize: 'vertical' }}
            />

            <div className="flex items-center justify-between">
              <span
                className="font-sans text-xs"
                style={{ color: status === 'error' ? '#E8735A' : '#8EA098', fontFamily: LABEL }}
                role="status"
              >
                {status === 'sent' ? 'Thanks — sent!' : status === 'error' ? "Couldn't send — try again" : ''}
              </span>
              <button
                type="submit"
                disabled={!text.trim() || status === 'sending'}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 transition-all"
                style={{
                  background: text.trim() && status !== 'sending' ? '#5ED29C' : '#17201C',
                  color: text.trim() && status !== 'sending' ? '#070B0A' : '#8EA098',
                  fontWeight: 700,
                  cursor: text.trim() && status !== 'sending' ? 'pointer' : 'not-allowed',
                  fontFamily: LABEL,
                }}
              >
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : 'Send →'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
