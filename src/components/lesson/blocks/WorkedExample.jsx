import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

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
        <span className="font-sans text-xs px-2 py-0.5" style={{ color: d.c, border: `1px solid ${d.c}44`, fontFamily: trace.sans }}>{d.label}</span>
      </div>

      <div className="p-5">
        <div className="font-sans text-xs tracking-widest uppercase mb-1.5" style={{ color: '#FFFFFF', fontFamily: trace.sans }}>INPUT</div>
        <pre className="px-4 py-3 mb-4 overflow-x-auto font-mono text-xs" style={{ ...traceStyles.terminal, color: trace.text, whiteSpace: "pre-wrap", fontFamily: trace.mono }}>{prompt}</pre>

        <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: '#FFFFFF', fontFamily: trace.sans }}>REASONING</div>
        <div className="space-y-2 mb-3">
          {steps.slice(0, revealed).map((s, i) => (
            <div key={i} className="flex gap-3 font-display text-sm" style={{ color: '#FFFFFF' }}>
              <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: trace.lime, fontFamily: trace.sans }}>{i + 1}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
        {revealed < steps.length ? (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="flex items-center gap-1.5 font-sans text-xs tracking-widest uppercase px-3 py-1.5 mb-4"
            style={{ background: "transparent", border: `1px solid ${trace.borderStrong}`, color: trace.lime, cursor: "pointer", fontFamily: trace.sans }}
          >
            <ChevronDown size={12} /> Reveal next step
          </button>
        ) : null}

        {revealed >= steps.length && (
          <>
            <div className="font-sans text-xs tracking-widest uppercase mb-1.5 mt-2" style={{ color: '#FFFFFF', fontFamily: trace.sans }}>OUTPUT</div>
            {showOut ? (
              <pre className="px-4 py-3 overflow-x-auto font-mono text-xs" style={{ background: trace.terminal, border: `1px solid ${trace.lime}33`, color: trace.lime, whiteSpace: "pre-wrap", borderRadius: "4px", fontFamily: trace.mono }}>{output}</pre>
            ) : (
              <button onClick={() => setShowOut(true)} className="font-sans text-xs tracking-widest uppercase px-3 py-1.5" style={{ background: "transparent", border: `1px solid ${trace.lime}55`, color: trace.lime, cursor: "pointer", fontFamily: trace.sans }}>
                Reveal output
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
