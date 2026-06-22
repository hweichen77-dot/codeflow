import React, { useState } from "react";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

/**
 * Reflection — short-answer / "explain in your own words" prompt.
 * Credit for trying; a model answer is revealed after submitting.
 *
 * props: prompt, sampleAnswer, onComplete?
 */
export default function Reflection({ prompt, sampleAnswer, onComplete }) {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    if (text.trim().length < 8) return;
    setSubmitted(true);
    onComplete && onComplete();
  };

  return (
    <div className="my-7" style={{ ...traceStyles.panel }}>
      <div className="px-5 py-3" style={{ borderBottom: `1px solid ${trace.border}` }}>
        <span style={{ ...traceStyles.monoLabel, color: trace.warn }}>REFLECT</span>
      </div>
      <div className="p-5">
        <p className="font-display text-sm mb-3" style={{ color: trace.text, fontWeight: 500 }}>{prompt}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          rows={3}
          placeholder="Write a sentence or two in your own words…"
          className="w-full px-4 py-3 text-sm resize-none outline-none"
          style={{ ...traceStyles.field, lineHeight: 1.6, borderRadius: "4px" }}
        />
        {!submitted ? (
          <button
            onClick={submit}
            disabled={text.trim().length < 8}
            className="mt-3 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all disabled:opacity-30"
            style={{ background: trace.lime, color: trace.bg, fontWeight: 700, border: "none", cursor: text.trim().length < 8 ? "not-allowed" : "pointer", fontFamily: trace.mono }}
          >
            Submit
          </button>
        ) : (
          <div className="mt-4">
            <div className="font-mono text-xs tracking-widest uppercase mb-1.5" style={{ color: trace.lime, fontFamily: trace.mono }}>✓ Logged — one way to put it</div>
            <p className="font-display text-sm leading-relaxed px-4 py-3" style={{ color: trace.dim, background: trace.surface, border: `1px solid ${trace.lime}33`, borderRadius: "4px" }}>{sampleAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
