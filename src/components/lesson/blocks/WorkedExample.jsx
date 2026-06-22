import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

/**
 * WorkedExample — input → reasoning → output triad with escalating difficulty.
 * Reasoning is revealed step by step so learners try first.
 *
 * props:
 *   number, difficulty ("easy"|"medium"|"hard"), prompt
 *   steps: string[]   (revealed one at a time)
 *   output: string
 */
const DIFF = {
  easy: { c: trace.lime, label: "EASY" },
  medium: { c: trace.warn, label: "MEDIUM" },
  hard: { c: trace.fail, label: "HARD" },
};

export default function WorkedExample({ number, difficulty = "easy", prompt, steps = [], output }) {
  const [revealed, setRevealed] = useState(0);
  const [showOut, setShowOut] = useState(false);
  const d = DIFF[difficulty] || DIFF.easy;

  return (
    <div className="my-6" style={{ ...traceStyles.panel }}>
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: `1px solid ${trace.border}` }}>
        <span style={{ ...traceStyles.monoLabel }}>
          WORKED EXAMPLE {number}
        </span>
        <span className="font-mono text-xs px-2 py-0.5" style={{ color: d.c, border: `1px solid ${d.c}44`, fontFamily: trace.mono }}>{d.label}</span>
      </div>

      <div className="p-5">
        <div className="font-mono text-xs tracking-widest uppercase mb-1.5" style={{ color: trace.faint, fontFamily: trace.mono }}>INPUT</div>
        <pre className="px-4 py-3 mb-4 overflow-x-auto font-mono text-xs" style={{ ...traceStyles.terminal, color: trace.text, whiteSpace: "pre-wrap", fontFamily: trace.mono }}>{prompt}</pre>

        <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: trace.faint, fontFamily: trace.mono }}>REASONING</div>
        <div className="space-y-2 mb-3">
          {steps.slice(0, revealed).map((s, i) => (
            <div key={i} className="flex gap-3 font-display text-sm" style={{ color: trace.dim }}>
              <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: trace.lime, fontFamily: trace.mono }}>{i + 1}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
        {revealed < steps.length ? (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase px-3 py-1.5 mb-4"
            style={{ background: "transparent", border: `1px solid ${trace.borderStrong}`, color: trace.lime, cursor: "pointer", fontFamily: trace.mono }}
          >
            <ChevronDown size={12} /> Reveal next step
          </button>
        ) : null}

        {revealed >= steps.length && (
          <>
            <div className="font-mono text-xs tracking-widest uppercase mb-1.5 mt-2" style={{ color: trace.faint, fontFamily: trace.mono }}>OUTPUT</div>
            {showOut ? (
              <pre className="px-4 py-3 overflow-x-auto font-mono text-xs" style={{ background: trace.terminal, border: `1px solid ${trace.lime}33`, color: trace.lime, whiteSpace: "pre-wrap", borderRadius: "4px", fontFamily: trace.mono }}>{output}</pre>
            ) : (
              <button onClick={() => setShowOut(true)} className="font-mono text-xs tracking-widest uppercase px-3 py-1.5" style={{ background: "transparent", border: `1px solid ${trace.lime}55`, color: trace.lime, cursor: "pointer", fontFamily: trace.mono }}>
                Reveal output
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
