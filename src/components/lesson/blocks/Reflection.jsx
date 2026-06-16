import React, { useState } from "react";

/**
 * Reflection — short-answer / "explain in your own words" prompt (zyBooks
 * reflection). Credit for trying; a model answer is revealed after submitting.
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
    <div className="my-7" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
      <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#36d399" }}>REFLECT</span>
      </div>
      <div className="p-5">
        <p className="font-display text-sm mb-3" style={{ color: "#ddd", fontWeight: 500 }}>{prompt}</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={submitted}
          rows={3}
          placeholder="Write a sentence or two in your own words…"
          className="w-full px-4 py-3 font-display text-sm resize-none outline-none"
          style={{ background: "#080808", border: "1px solid #222", color: "#e8e8e8" }}
        />
        {!submitted ? (
          <button
            onClick={submit}
            disabled={text.trim().length < 8}
            className="mt-3 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all disabled:opacity-30"
            style={{ background: "#36d399", color: "#04130d", fontWeight: 700, border: "none", cursor: text.trim().length < 8 ? "not-allowed" : "pointer" }}
          >
            Submit
          </button>
        ) : (
          <div className="mt-4">
            <div className="font-mono text-xs tracking-widest uppercase mb-1.5" style={{ color: "#36d399" }}>✓ Logged — one way to put it</div>
            <p className="font-display text-sm leading-relaxed px-4 py-3" style={{ color: "#aaa", background: "#08130d", border: "1px solid #36d39922" }}>{sampleAnswer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
