import React, { useState } from 'react'
import LABS from '@/content/playgroundLabs'
import LlmPlayground from '@/components/lesson/LlmPlayground'
import useDocumentHead from '@/lib/useDocumentHead'
import { Stagger, StaggerItem, HoverCard } from '@/lib/motion'

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
      </StaggerItem>

      <StaggerItem className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6" as="div">
        <nav className="flex md:flex-col gap-2 overflow-x-auto">
          {LABS.map((lab) => {
            const on = lab.id === active.id
            return (
              <HoverCard
                key={lab.id}
                as="button"
                type="button"
                onClick={() => setActiveId(lab.id)}
                className="text-left px-3 py-3 rounded-lg border shrink-0 transition-colors"
                style={{
                  borderColor: on ? '#5a4a20' : '#241f14',
                  background: on ? '#211c12' : 'transparent',
                }}
              >
                <div className="text-sm font-semibold" style={{ color: on ? '#F3EEE2' : '#D6CDB8' }}>{lab.title}</div>
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
