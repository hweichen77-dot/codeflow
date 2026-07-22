import React, { useState } from 'react'
import { Shield, ShieldAlert, CheckCircle2 } from 'lucide-react'
import { runPlayground, gradePlayground } from '@/lib/llmPlayground'
import { markLabSolved, isLabSolved, getSolvedLabs } from '@/lib/playgroundProgress'
import { track, trackFunnel } from '@/lib/analytics'
import ShareResult from './ShareResult'
import SaveProgressPrompt from './SaveProgressPrompt'
import { submitLabScore } from '@/lib/leaderboard'
import LabLeaderboard from './LabLeaderboard'

export default function LlmPlayground({ lab, labIndex, labCount }) {
  const [systemPrompt, setSystemPrompt] = useState('')
  const [state, setState] = useState({ status: 'idle' })
  const [result, setResult] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [solved, setSolved] = useState(() => isLabSolved(lab.id))
  const [hasRun, setHasRun] = useState(false)
  const [boardKey, setBoardKey] = useState(0)
  const [justSolved, setJustSolved] = useState(false)

  const run = async () => {
    if (!hasRun) {
      setHasRun(true)
      try { trackFunnel('playStart', { lab: lab.id }) } catch {  }
    }
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
    if (graded.allPass) {
      const isNew = markLabSolved(lab.id)
      setSolved(true)
      setJustSolved(isNew)
    }
    try {
      track('playground_run', { lab: lab.id, passed: graded.passed, total: graded.total })
      if (graded.allPass) {
        track('playground_solved', { lab: lab.id, prompt_chars: systemPrompt.trim().length })
        trackFunnel('challengeComplete', { lab: lab.id, prompt_chars: systemPrompt.trim().length })
        submitLabScore({ labId: lab.id, promptChars: systemPrompt.trim().length, attacksHeld: graded.total })
          .then(() => setBoardKey((k) => k + 1))
      }
    } catch {  }
  }

  const amber = '#5ED29C'
  const held = '#4CC98A'
  const broken = '#FF6B5C'

  return (
    <div className="rounded-xl border p-5 md:p-6" style={{ borderColor: '#2a2519', background: '#0C1210' }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest" style={{ color: amber }}>
            {labIndex && labCount ? `Lab ${labIndex} of ${labCount}` : 'Red-team lab'}
          </div>
          <h3 className="text-xl font-bold mt-1 inline-flex items-center gap-2" style={{ color: '#ECF3EF' }}>
            {lab.title}
            {solved && <CheckCircle2 size={18} style={{ color: held }} aria-label="Solved" />}
          </h3>
          <p className="text-sm mt-1" style={{ color: '#FFFFFF' }}>{lab.tagline}</p>
        </div>
        <div className="flex items-center gap-2">
          {lab.difficulty && (
            <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide"
              style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>{lab.difficulty}</span>
          )}
          <span className="text-[11px] px-2 py-1 rounded-md border uppercase tracking-wide inline-flex items-center gap-1"
            style={{ borderColor: '#3a331f', color: '#FFFFFF' }}>
            <ShieldAlert size={11} style={{ color: amber }} /> {lab.inputs.length} attacks
          </span>
        </div>
      </div>

      <p className="text-sm mt-4 leading-relaxed" style={{ color: '#FFFFFF' }}>{lab.brief}</p>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="llm-system-prompt" className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#FFFFFF' }}>
            Your defensive system prompt
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
          id="llm-system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder={lab.placeholder}
          rows={5}
          className="w-full rounded-lg p-3 text-sm font-mono resize-y focus:outline-none focus:border-[#5ED29C]"
          style={{ background: '#050807', color: '#ECF3EF', border: '1px solid #2a2519' }}
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
          {state.status === 'running' ? 'Running the attacks…' : 'Run the attacks ▶'}
        </button>
      </div>

      {state.status === 'error' && (
        <p className="text-sm mt-3 p-3 rounded-md" style={{ background: '#2a1512', color: '#F0A89C' }}>{state.error}</p>
      )}
      {state.status === 'unconfigured' && (
        <div className="text-sm mt-3 p-3 rounded-md" style={{ background: '#211c12', color: '#FFFFFF' }}>
          <strong>Live grading isn’t switched on yet.</strong> {state.error} Once the site owner sets the
          <code className="mx-1 px-1 rounded" style={{ background: '#050807' }}>GROQ_API_KEY</code>
          on the <code className="mx-1 px-1 rounded" style={{ background: '#050807' }}>llm-playground</code> function, this lab runs against a real model.
        </div>
      )}

      {result && (
        <div className="mt-5">
          {}
          <div className="rounded-xl p-4 mb-4" style={{ background: result.allPass ? '#12200f' : '#1B1913', border: `1px solid ${result.allPass ? '#2f5a25' : '#26302B'}` }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest" style={{ color: result.allPass ? held : amber }}>
                  {result.allPass ? 'All attacks held' : 'Score'}
                </div>
                <div className="mt-1" style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF', lineHeight: 1 }}>
                  Held {result.passed}/{result.total} attacks
                </div>
              </div>
              <ShareResult lab={lab} passed={result.passed} total={result.total} allPass={result.allPass} />
            </div>
            {}
            {result.allPass && (
              <SaveProgressPrompt labId={lab.id} solvedCount={getSolvedLabs().length} totalLabs={labCount || 0} />
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              {result.graded.map((g, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold"
                  style={{ background: g.pass ? '#16301c' : '#301616', color: g.pass ? held : broken, border: `1px solid ${g.pass ? '#244a1c' : '#4a2020'}` }}>
                  {g.pass ? <Shield size={12} /> : <ShieldAlert size={12} />}
                  Attack {i + 1}
                </div>
              ))}
            </div>
            {result.allPass && (
              <p className="text-sm mt-3" style={{ color: '#9FE0A8' }}>{lab.successNote}</p>
            )}
          </div>

          {}
          <div className="space-y-3">
            {result.graded.map((g, i) => (
              <div key={i} className="rounded-lg p-3" style={{ background: '#050807', border: '1px solid #221d12' }}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: g.pass ? '#16301c' : '#301616', color: g.pass ? held : broken }}>
                    {g.pass ? 'HELD' : 'BROKEN'}
                  </span>
                  <span className="text-xs font-mono" style={{ color: '#FFFFFF' }}>attack {i + 1}: {g.input}</span>
                </div>
                <pre className="text-sm mt-2 whitespace-pre-wrap font-mono" style={{ color: '#FFFFFF' }}>
                  {g.output || g.error || '(empty)'}
                </pre>
                {!g.pass && g.reasons?.length > 0 && (
                  <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>× {g.reasons.join(' · ')}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <LabLeaderboard lab={lab} refreshKey={boardKey} />
    </div>
  )
}
