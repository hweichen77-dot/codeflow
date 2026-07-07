import React, { useState } from 'react'
import LABS from '@/content/playgroundLabs'
import LlmPlayground from '@/components/lesson/LlmPlayground'
import useDocumentHead from '@/lib/useDocumentHead'

// The LLM Playground hub: pick a lab, write a system prompt, run it against a
// live model, get graded on the model's real behavior. CodeFlow's signature,
// no-other-platform-has-it feature.
export default function Playground() {
  const [activeId, setActiveId] = useState(LABS[0]?.id)
  const active = LABS.find((l) => l.id === activeId) || LABS[0]

  useDocumentHead({
    title: 'Live LLM Playground',
    description:
      'Write prompts, run them against a live language model, and get graded on how the model behaves. Learn prompt engineering, RAG grounding, injection defense, and structured output by doing.',
    path: '/Playground',
  })

  return (
    <div className="max-w-6xl mx-auto px-5 pt-24 pb-16">
      <header className="mb-8">
        <div className="text-xs font-bold uppercase tracking-widest" style={{ color: '#E8A33C' }}>
          Live LLM Playground
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mt-2" style={{ color: '#F3EEE2' }}>
          Learn AI by breaking real models
        </h1>
        <p className="mt-3 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: '#FFFFFF' }}>
          Every other course explains prompts. Here you <strong>write one, run it against a live model</strong>,
          and get graded on what the model does, including adversarial inputs designed to make it fail.
          No sign-in required.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        <nav className="flex md:flex-col gap-2 overflow-x-auto">
          {LABS.map((lab) => {
            const on = lab.id === active.id
            return (
              <button
                key={lab.id}
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
              </button>
            )
          })}
        </nav>

        <div>
          <LlmPlayground key={active.id} lab={active} />
        </div>
      </div>
    </div>
  )
}
