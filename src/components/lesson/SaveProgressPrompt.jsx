import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { track, trackFunnel } from '@/lib/analytics'
import { createPageUrl } from '@/utils'

const ACCENT = '#5ED29C'

export default function SaveProgressPrompt({ labId, solvedCount, totalLabs }) {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  if (isAuthenticated) return null

  const remaining = Math.max(totalLabs - solvedCount, 0)

  const go = () => {
    track('signup_prompt_clicked', { lab: labId, solved_count: solvedCount })
    trackFunnel('signup', { source: 'playground_win', lab: labId })
    navigate(createPageUrl('login'))
  }

  return (
    <div className="rounded-xl p-4 mt-4" style={{ background: 'rgba(94,210,156,0.06)', border: `1px solid ${ACCENT}44` }}>
      <p className="text-sm" style={{ color: '#ECF3EF', lineHeight: 1.6 }}>
        Your progress is saved in this browser only. Make an account and it follows you to any device,
        {remaining > 0 ? ` along with the ${remaining} harder labs after this one.` : ' along with every lab you finish next.'}
      </p>
      <div className="flex flex-wrap items-center gap-3 mt-3">
        <button
          type="button"
          onClick={go}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold"
          style={{ background: ACCENT, color: '#0a1410' }}
        >
          Save my progress <ArrowRight size={15} />
        </button>
        <span className="text-xs" style={{ color: '#9FB3AA' }}>Takes one tap with Google. Keep playing without it if you prefer.</span>
      </div>
    </div>
  )
}
