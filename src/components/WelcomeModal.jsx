import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { createPageUrl } from '@/utils'
import { track } from '@/lib/analytics'

const MONO = "'Spline Sans Mono', ui-monospace, monospace"
const SERIF = "'Bricolage Grotesque', system-ui, sans-serif"
const ONBOARDED_KEY = 'codeflow_onboarded_v1'

const STEPS = [
  { n: '01', t: 'Learn by building', d: 'No passive videos. Every lesson ends in code you run in the browser.' },
  { n: '02', t: 'Solve challenges', d: 'Short problems with real test cases. Earn XP, build a streak, level up.' },
  { n: '03', t: 'Ship projects', d: 'Capstones turn skills into a portfolio you can actually point to.' },
]

// First-run welcome. Without it, new users land on a cold dashboard and bounce.
// Shows once per browser (or per account, post-merge), gated on being signed in.
export default function WelcomeModal() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let seen = true
    try { seen = window.localStorage.getItem(ONBOARDED_KEY) === '1' } catch { /* ignore */ }
    if (!seen) {
      setOpen(true)
      track('onboarding_shown')
    }
  }, [isAuthenticated])

  const dismiss = (started) => {
    try { window.localStorage.setItem(ONBOARDED_KEY, '1') } catch { /* ignore */ }
    track('onboarding_complete', { started: Boolean(started) })
    setOpen(false)
    if (started) navigate(createPageUrl('AITrack'))
  }

  if (!open) return null

  const firstName = (user?.name || user?.email?.split('@')[0] || 'there').split(' ')[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to CodeFlow"
      className="fixed inset-0 z-[90] flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(false) }}
    >
      <div className="w-full max-w-lg p-10" style={{ border: '1px solid #2A261E', background: '#131009', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }}>
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#E8A33C', fontFamily: MONO }}>
          § WELCOME TO CODEFLOW
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#F2EDE2', lineHeight: 1.12, margin: '0 0 8px' }}>
          Hey {firstName} — here&apos;s the idea.
        </h1>
        <p className="font-display text-sm mb-7" style={{ color: '#C9C1B2' }}>
          Three things make CodeFlow work. Then you&apos;re off.
        </p>

        <div className="space-y-4 mb-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="font-mono text-sm flex-shrink-0" style={{ color: '#9A6A1F', fontFamily: MONO, width: '28px' }}>
                {s.n}
              </span>
              <div>
                <div className="font-display text-sm font-medium" style={{ color: '#F2EDE2' }}>{s.t}</div>
                <div className="font-mono text-xs mt-1" style={{ color: '#BBB3A4', fontFamily: MONO, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => dismiss(false)}
            className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all"
            style={{ color: '#8F8779', border: '1px solid #34302A', fontFamily: MONO }}
          >
            I&apos;ll look around
          </button>
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="font-mono text-sm tracking-widest uppercase px-7 py-3 transition-all"
            style={{ background: '#E8A33C', color: '#15130E', fontWeight: 700, fontFamily: MONO }}
          >
            Start learning →
          </button>
        </div>
      </div>
    </div>
  )
}
