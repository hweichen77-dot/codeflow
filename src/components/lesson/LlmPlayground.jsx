import React, { useState } from 'react'
import { runPlayground, gradePlayground } from '@/lib/llmPlayground'
import { track } from '@/lib/analytics'

// Interactive, auto-graded LLM lab: the learner writes a system prompt, it runs
// against a live model over the lab's (often adversarial) inputs, and each real
// output is graded against the lab's rules. This is CodeFlow's differentiator, // no other learn-to-code platform grades against live model behavior.
export default function LlmPlayground({ lab }) {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [state, setState] = useState({ status: 'idle' }) // idle | running | done | error | unconfigured
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [copied, setCopied] = useState(false)

  const run = async () => {
    setState({ status: 'running' })
    setResult(null)
    const res = await runPlayground({ systemPrompt, inputs: lab.inputs.map((i) => i.text) })
    if (!res.ok) {
      if (res.configured === false) { setState({ status: 'unconfigured', error: res.error }); return }
      setState({ status: 'error', error: res.error }); return
    }
    const graded = gradePlayground(res.results, lab.inputs)
    setResult({ ...graded, model: res.model })
    setState({ status: 'done' })
    try {
      track('playground_run', { lab: lab.id, passed: graded.passed, total: graded.total })
      if (graded.allPass) track('playground_solved', { lab: lab.id })
    } catch { /* analytics optional */ }
  }

  const share = async () => {
    const url = `${window.location.origin}${import.meta.env.BASE_URL || '/'}Playground`
    const text = `I just solved "${lab.title}" on CodeFlow — got a live LLM to ${lab.tagline.toLowerCase()}. Try it: ${url}`
    try {
      if (navigator.share) { await navigator.share({ title: 'CodeFlow', text, url }); return }
      await navigator.clipboard.writeText(text)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { /* user dismissed */ }
  }

  const amber = '#E8A33C'

  return (
    <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#2a2519', background: '#17140E' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: amber }}>Live LLM Lab</div>
          <h3 className="text-xl font-bold mt-1" style={{ color: '#F3EEE2' }}>{lab.title}</h3>
          <p className="text-sm mt-1" style={{ color: '#FFFFFF' }}>{lab.tagline}</p>
        </div>
        {lab.difficulty && (
          <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide"
            style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>{lab.difficulty}</span>
        )}
      </div>

      <p className="text-sm mt-4 leading-relaxed" style={{ color: '#FFFFFF' }}>{lab.brief}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
            Your system prompt
          </label>
          <button type="button" onClick={() => setShowHint((v) => !v)}
            className="text-xs underline" style={{ color: amber }}>
            {showHint ? 'Hide hint' : 'Need a hint?'}
          </button>
        </div>
        {showHint && (
          <p className="text-xs mb-2 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>{lab.hint}</p>
        )}
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder={lab.placeholder}
          rows={5}
          className="w-full rounded-lg p-3 text-sm font-mono resize-y focus:outline-none"
          style={{ background: '#0F0D08', color: '#F3EEE2', border: '1px solid #2a2519' }}
        />
      </div>

      <div className="flex items-center gap-3 mt-3">
        <button
          type="button"
          onClick={run}
          disabled={state.status === 'running' || !systemPrompt.trim()}
          className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
          style={{ background: amber, color: '#1a1509' }}
        >
          {state.status === 'running' ? 'Running against the model…' : 'Run ▶'}
        </button>
        {result && (
          <span className="text-sm font-semibold" style={{ color: result.allPass ? '#7FD18A' : '#E8A33C' }}>
            {result.passed}/{result.total} passed
          </span>
        )}
      </div>

      {state.status === 'error' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#2a1512', color: '#F0A89C' }}>{state.error}</p>
      )}
      {state.status === 'unconfigured' && (
        <div className="text-sm mt-3 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>
          <strong>Live grading isn’t switched on yet.</strong> {state.error} Once the site owner sets the
          <code className="mx-1 px-1 rounded" style={{ background: '#0F0D08' }}>GROQ_API_KEY</code>
          on the <code className="mx-1 px-1 rounded" style={{ background: '#0F0D08' }}>llm-playground</code> function, this lab runs against a real model.
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          {result.graded.map((g, i) => (
            <div key={i} className="rounded-lg p-3" style={{ background: '#0F0D08', border: '1px solid #221d12' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded"
                  style={{ background: g.pass ? '#16301c' : '#301616', color: g.pass ? '#7FD18A' : '#F0A89C' }}>
                  {g.pass ? 'PASS' : 'FAIL'}
                </span>
                <span className="text-xs font-mono" style={{ color: '#FFFFFF' }}>input: {g.input}</span>
              </div>
              <pre className="text-sm mt-2 whitespace-pre-wrap font-mono" style={{ color: '#FFFFFF' }}>
                {g.output || g.error || '(empty)'}
              </pre>
              {!g.pass && g.reasons?.length > 0 && (
                <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>× {g.reasons.join(' · ')}</p>
              )}
            </div>
          ))}

          {result.allPass && (
            <div className="rounded-lg p-4 mt-2" style={{ background: '#12200f', border: '1px solid #244a1c' }}>
              <p className="text-sm font-semibold" style={{ color: '#9FE0A8' }}>✓ Solved, {lab.successNote}</p>
              <button type="button" onClick={share}
                className="mt-3 px-3 py-1.5 rounded-md text-sm font-semibold"
                style={{ background: '#1c3316', color: '#9FE0A8', border: '1px solid #2f5a25' }}>
                {copied ? 'Copied!' : 'Share result ↗'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
