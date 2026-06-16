import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * WorkedExample — GfG-style input → reasoning → output triad with escalating
 * difficulty. Reasoning is revealed step by step so learners try first.
 *
 * props:
 *   number, difficulty ("easy"|"medium"|"hard"), prompt
 *   steps: string[]   (revealed one at a time)
 *   output: string
 */
const DIFF = {
  easy: { c: "#36d399", label: "EASY" },
  medium: { c: "#f0c000", label: "MEDIUM" },
  hard: { c: "#ff6b35", label: "HARD" },
};

export default function WorkedExample({ number, difficulty = "easy", prompt, steps = [], output }) {
  const [revealed, setRevealed] = useState(0);
  const [showOut, setShowOut] = useState(false);
  const d = DIFF[difficulty] || DIFF.easy;

  return (
    <div className="my-6" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#888" }}>
          WORKED EXAMPLE {number}
        </span>
        <span className="font-mono text-xs px-2 py-0.5" style={{ color: d.c, border: `1px solid ${d.c}44` }}>{d.label}</span>
      </div>

      <div className="p-5">
        <div className="font-mono text-xs tracking-widest uppercase mb-1.5" style={{ color: "#666" }}>INPUT</div>
        <pre className="px-4 py-3 mb-4 overflow-x-auto font-mono text-xs" style={{ background: "#080808", border: "1px solid #1a1a1a", color: "#e8e8e8", whiteSpace: "pre-wrap" }}>{prompt}</pre>

        <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#666" }}>REASONING</div>
        <div className="space-y-2 mb-3">
          {steps.slice(0, revealed).map((s, i) => (
            <div key={i} className="flex gap-3 font-display text-sm" style={{ color: "#bbb" }}>
              <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#60a5fa" }}>{i + 1}.</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
        {revealed < steps.length ? (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase px-3 py-1.5 mb-4"
            style={{ background: "transparent", border: "1px solid #222", color: "#60a5fa", cursor: "pointer" }}
          >
            <ChevronDown size={12} /> Reveal next step
          </button>
        ) : null}

        {revealed >= steps.length && (
          <>
            <div className="font-mono text-xs tracking-widest uppercase mb-1.5 mt-2" style={{ color: "#666" }}>OUTPUT</div>
            {showOut ? (
              <pre className="px-4 py-3 overflow-x-auto font-mono text-xs" style={{ background: "#08120a", border: "1px solid #b8ff0033", color: "#b8ff00", whiteSpace: "pre-wrap" }}>{output}</pre>
            ) : (
              <button onClick={() => setShowOut(true)} className="font-mono text-xs tracking-widest uppercase px-3 py-1.5" style={{ background: "transparent", border: "1px solid #b8ff0033", color: "#b8ff00", cursor: "pointer" }}>
                Reveal output
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
