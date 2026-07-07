import React, { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import LABS from '@/content/playgroundLabs'
import LlmPlayground from '@/components/lesson/LlmPlayground'
import useDocumentHead from '@/lib/useDocumentHead'
import { Stagger, StaggerItem, HoverCard } from '@/lib/motion'
import { ProgressBar, KIT } from '@/components/ui/kit'
import { getSolvedLabs, PLAYGROUND_CHANGED_EVENT } from '@/lib/playgroundProgress'

// The prompt-security playground: pick a lab, write a defensive system prompt,
// run it against a live model over a battery of adversarial attacks, and get a
// shareable HELD/BROKEN score. Free, no signup.
export default function Playground() {
  // Deep-link support: /Playground?lab=<id> opens that challenge (shared links).
  const initialId = (() => {
    try {
      const q = new URLSearchParams(window.location.search).get('lab')
      if (q && LABS.some((l) => l.id === q)) return q
    } catch { /* ignore */ }
    return LABS[0]?.id
  })()
  const [activeId, setActiveId] = useState(initialId)
  const active = LABS.find((l) => l.id === activeId) || LABS[0]

  // Completion: which labs the learner has solved (held all attacks).
  const [solvedIds, setSolvedIds] = useState(() => getSolvedLabs())
  useEffect(() => {
    const refresh = () => setSolvedIds(getSolvedLabs())
    window.addEventListener(PLAYGROUND_CHANGED_EVENT, refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener(PLAYGROUND_CHANGED_EVENT, refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [])
  const solvedCount = LABS.filter((l) => solvedIds.includes(l.id)).length
  const solvedPct = LABS.length ? Math.round((solvedCount / LABS.length) * 100) : 0

  useDocumentHead({
    title: 'Prompt Injection & LLM Security Practice',
    description:
      'Free, no-signup exercises to practice defending LLMs against real attacks. Write a system prompt, run it against a live model over adversarial inputs (prompt injection, jailbreaks, hallucination, RAG grounding), and get a shareable held/broken score.',
    path: '/Playground',
  })

  return (
    <Stagger className="max-w-6xl mx-auto px-5 pt-24 pb-16" as="div">
      <StaggerItem className="mb-8" as="header">
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#E8A33C' }}>
          Prompt-security playground
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: '#F3EEE2' }}>
          Can your prompt survive the attacks?
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
          Write a <strong>defensive system prompt</strong>, run it against a live model over a battery of real
          attacks, prompt injection, jailbreaks, hallucination, and get a <strong>held/broken score</strong> you
          can share. Free, no sign-in. This is prompt engineering the way it actually gets tested in production.
        </p>

        <div className="mt-6 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-[11px] tracking-[0.16em] uppercase" style={{ color: KIT.dim }}>
              Labs solved
            </span>
            <span className="font-sans text-xs" style={{ color: '#E8A33C' }}>
              {solvedCount}/{LABS.length}
            </span>
          </div>
          <ProgressBar pct={solvedPct} color={KIT.emerald} height={8} glow={false} />
        </div>
      </StaggerItem>

      <StaggerItem className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6" as="div">
        <nav className="flex md:flex-col gap-2 overflow-x-auto">
          {LABS.map((lab) => {
            const on = lab.id === active.id
            const done = solvedIds.includes(lab.id)
            return (
              <HoverCard
                key={lab.id}
                as="button"
                type="button"
                onClick={() => setActiveId(lab.id)}
                className="text-left px-3 py-3 rounded-lg border shrink-0 transition-colors"
                style={{
                  borderColor: on ? '#5a4a20' : done ? '#244a1c' : '#241f14',
                  background: on ? '#211c12' : 'transparent',
                }}
              >
                <div className="text-sm font-semibold inline-flex items-center gap-1.5" style={{ color: on ? '#F3EEE2' : '#D6CDB8' }}>
                  {done && <CheckCircle2 size={13} style={{ color: KIT.emerald }} />}
                  {lab.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#FFFFFF' }}>{lab.tagline}</div>
              </HoverCard>
            )
          })}
        </nav>

        <div>
          <LlmPlayground key={active.id} lab={active} />
        </div>
      </StaggerItem>
    </Stagger>
  )
}
