import React, { useEffect, useState } from 'react'
import { font } from "@/lib/tokens";
import { useDialogA11y } from '@/lib/useDialogA11y'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { createPageUrl } from '@/utils'
import { track } from '@/lib/analytics'

const LABEL = font.body
const SERIF = font.display
const ONBOARDED_KEY = 'codeflow_onboarded_v1'

const STEPS = [
  { n: '01', t: 'Learn by building', d: 'Every lesson ends in code you run in the browser.' },
  { n: '02', t: 'Solve challenges', d: 'Short problems with real test cases. Earn XP, build a streak, level up.' },
  { n: '03', t: 'Ship projects', d: 'Capstones turn skills into a portfolio you can point to.' },
]

export default function WelcomeModal() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    let seen = true
    try { seen = window.localStorage.getItem(ONBOARDED_KEY) === '1' } catch {  }
    if (!seen) {
      setOpen(true)
      track('onboarding_shown')
    }
  }, [isAuthenticated])

  const dismiss = (started) => {
    try { window.localStorage.setItem(ONBOARDED_KEY, '1') } catch {  }
    track('onboarding_complete', { started: Boolean(started) })
    setOpen(false)
    if (started) navigate(createPageUrl('AITrack'))
  }

  const dialogRef = useDialogA11y(() => dismiss(false), open)

  if (!open) return null

  const firstName = (user?.name || user?.email?.split('@')[0] || 'there').split(' ')[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Compilearn"
      className="fixed inset-0 z-[90] flex items-center justify-center px-6"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(false) }}
    >
      <div ref={dialogRef} tabIndex={-1} className="w-full max-w-lg p-10" style={{ border: '1px solid #2A261E', background: '#070B0A', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', outline: 'none' }}>
        <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#5ED29C', fontFamily: LABEL }}>
          WELCOME TO CODEFLOW
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#ECF3EF', lineHeight: 1.12, margin: '0 0 8px' }}>
          Hey {firstName}, here&apos;s the idea.
        </h1>
        <p className="font-display text-sm mb-7" style={{ color: '#FFFFFF' }}>
          Three things make Compilearn work. Then you&apos;re off.
        </p>

        <div className="space-y-4 mb-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="font-sans text-sm flex-shrink-0" style={{ color: '#C6892A', fontFamily: LABEL, width: '28px' }}>
                {s.n}
              </span>
              <div>
                <div className="font-display text-sm font-medium" style={{ color: '#ECF3EF' }}>{s.t}</div>
                <div className="font-sans text-xs mt-1" style={{ color: '#FFFFFF', fontFamily: LABEL, lineHeight: 1.5 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => dismiss(false)}
            className="font-sans text-xs tracking-widest uppercase px-5 py-3 transition-all"
            style={{ color: '#FFFFFF', border: '1px solid #26302B', fontFamily: LABEL }}
          >
            I&apos;ll look around
          </button>
          <button
            type="button"
            onClick={() => dismiss(true)}
            className="font-sans text-sm tracking-widest uppercase px-7 py-3 transition-all"
            style={{ background: '#5ED29C', color: '#070B0A', fontWeight: 700, fontFamily: LABEL }}
          >
            Start learning →
          </button>
        </div>
      </div>
    </div>
  )
}
