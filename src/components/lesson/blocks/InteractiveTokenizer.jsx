import React, { useState, useMemo } from "react";
import { trace } from "@/components/lesson/trace/theme";


function tokenize(text) {
  if (!text) return [];
  const raw = text.match(/\s+|[a-zA-Z]+|[0-9]+|[^\sa-zA-Z0-9]/g) || [];
  const out = [];
  for (const chunk of raw) {
    if (/^\s+$/.test(chunk)) {
      out.push({ t: chunk.replace(/\n/g, "·").replace(/ /g, "␣"), kind: "space" });
    } else if (chunk.length <= 4) {
      out.push({ t: chunk, kind: "word" });
    } else {
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
  const inCost = (tokenCount / 1_000_000) * 3;
  const ratio = charCount ? (charCount / Math.max(tokenCount, 1)).toFixed(1) : "0";

  return (
    <div className="my-7" style={{ border: `1px solid ${trace.border}`, background: trace.raised }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${trace.border}` }}>
        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: trace.lime }}>
          TOOL, TOKENIZER PLAYGROUND
        </span>
        <span className="font-sans text-xs" style={{ color: '#FFFFFF' }}>approximate</span>
      </div>

      <div className="p-5">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={2}
          spellCheck={false}
          className="w-full px-4 py-3 font-mono text-sm resize-none outline-none"
          style={{ background: trace.surface, border: `1px solid ${trace.borderStrong}`, color: trace.text }}
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setText(p)}
              className="font-mono text-xs px-2.5 py-1 transition-all"
              style={{ background: "transparent", border: `1px solid ${trace.borderStrong}`, color: '#FFFFFF', cursor: "pointer", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-5">
          {visible.map((tok, idx) => (
            <span
              key={idx}
              className="font-mono text-xs px-2 py-1"
              style={{ background: trace.surface, border: `1px solid ${trace.lime}55`, color: trace.lime, whiteSpace: "pre" }}
              title={`token ${idx + 1}`}
            >
              {tok.t}
            </span>
          ))}
          {visible.length === 0 && (
            <span className="font-sans text-xs" style={{ color: '#FFFFFF' }}>type something above…</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-0 mt-5" style={{ border: `1px solid ${trace.border}` }}>
          <Stat label="Tokens" value={tokenCount} accent={trace.lime} />
          <Stat label="Characters" value={charCount} />
          <Stat label="Chars / token" value={ratio} />
          <Stat label="Input cost" value={`$${inCost.toFixed(6)}`} accent={trace.info} last />
        </div>
        <p className="font-sans text-xs mt-3" style={{ color: '#FFFFFF' }}>
          Notice: rare/long words shatter into many tiny pieces, while common words stay whole.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, accent, last }) {
  return (
    <div className="px-4 py-3" style={{ borderRight: last ? "none" : `1px solid ${trace.border}` }}>
      <div className="font-display font-black" style={{ fontSize: "1.4rem", color: accent || trace.text, letterSpacing: "-0.03em", lineHeight: 1 }}>
        {value}
      </div>
      <div className="font-sans text-xs tracking-widest uppercase mt-1" style={{ color: '#FFFFFF' }}>{label}</div>
    </div>
  );
}
