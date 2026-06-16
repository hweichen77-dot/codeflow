import React, { useState, useMemo } from "react";

/**
 * InteractiveTokenizer — a live "tool" (zyBooks-style) for the Tokens lesson.
 * Type text → see an approximate token split, counts, and cost. Pure client-side
 * heuristic (NOT a real BPE tokenizer, but close enough to build intuition).
 */
const PALETTE = ["#b8ff00", "#60a5fa", "#cc66ff", "#ff6b35", "#36d399", "#f0c000"];

// Rough heuristic: whitespace+punct boundaries, then chop long word-pieces ~4 chars.
function tokenize(text) {
  if (!text) return [];
  const raw = text.match(/\s+|[a-zA-Z]+|[0-9]+|[^\sa-zA-Z0-9]/g) || [];
  const out = [];
  for (const chunk of raw) {
    if (/^\s+$/.test(chunk)) {
      // attach a leading space to the *next* token the way real tokenizers do
      out.push({ t: chunk.replace(/\n/g, "·").replace(/ /g, "␣"), kind: "space" });
    } else if (chunk.length <= 4) {
      out.push({ t: chunk, kind: "word" });
    } else {
      // split long words into ~4-char pieces
      for (let k = 0; k < chunk.length; k += 4) {
        out.push({ t: chunk.slice(k, k + 4), kind: "piece" });
      }
    }
  }
  return out;
}

const PRESETS = [
  "hello world",
  "antidisestablishmentarianism",
  "The model sees tokens, not letters.",
  " supercalifragilistic",
];

export default function InteractiveTokenizer() {
  const [text, setText] = useState("The model sees tokens, not letters.");
  const tokens = useMemo(() => tokenize(text), [text]);
  const visible = tokens.filter((t) => t.kind !== "space" || t.t.trim() !== "");
  const tokenCount = tokens.length;
  const charCount = text.length;
  const inCost = (tokenCount / 1_000_000) * 3; // $3 / M input tokens
  const ratio = charCount ? (charCount / Math.max(tokenCount, 1)).toFixed(1) : "0";

  return (
    <div className="my-7" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>
          TOOL — TOKENIZER PLAYGROUND
        </span>
        <span className="font-mono text-xs" style={{ color: "#555" }}>approximate</span>
      </div>

      <div className="p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          spellCheck={false}
          className="w-full px-4 py-3 font-mono text-sm resize-none outline-none"
          style={{ background: "#080808", border: "1px solid #222", color: "#e8e8e8" }}
        />

        {/* presets */}
        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setText(p)}
              className="font-mono text-xs px-2.5 py-1 transition-all"
              style={{ background: "transparent", border: "1px solid #222", color: "#888", cursor: "pointer", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* token chips */}
        <div className="flex flex-wrap gap-1.5 mt-5">
          {visible.map((tok, idx) => {
            const c = PALETTE[idx % PALETTE.length];
            return (
              <span
                key={idx}
                className="font-mono text-xs px-2 py-1"
                style={{ background: `${c}18`, border: `1px solid ${c}55`, color: c, whiteSpace: "pre" }}
                title={`token ${idx + 1}`}
              >
                {tok.t}
              </span>
            );
          })}
          {visible.length === 0 && (
            <span className="font-mono text-xs" style={{ color: "#555" }}>type something above…</span>
          )}
        </div>

        {/* stats */}
        <div className="grid grid-cols-4 gap-0 mt-5" style={{ border: "1px solid #1a1a1a" }}>
          <Stat label="Tokens" value={tokenCount} accent="#b8ff00" />
          <Stat label="Characters" value={charCount} />
          <Stat label="Chars / token" value={ratio} />
          <Stat label="Input cost" value={`$${inCost.toFixed(6)}`} accent="#60a5fa" last />
        </div>
        <p className="font-mono text-xs mt-3" style={{ color: "#555" }}>
          Notice: rare/long words shatter into many tiny pieces, while common words stay whole.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, last }) {
  return (
    <div className="px-4 py-3" style={{ borderRight: last ? "none" : "1px solid #1a1a1a" }}>
      <div className="font-display font-black" style={{ fontSize: "1.4rem", color: accent || "#e8e8e8", letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div className="font-mono text-xs tracking-widest uppercase mt-1" style={{ color: "#777" }}>{label}</div>
    </div>
  );
}
