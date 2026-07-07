import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

export default function DragToBin({ title, bins = [], items = [], onComplete }) {
  const [placed, setPlaced] = useState({});
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  const unplaced = items.filter((it) => !placed[it.id]);
  const allPlaced = unplaced.length === 0;

  const place = (binId) => {
    if (!selected) return;
    setPlaced((p) => ({ ...p, [selected]: binId }));
    setSelected(null);
    setChecked(false);
  };

  const reset = () => { setPlaced({}); setSelected(null); setChecked(false); };

  const check = () => {
    setChecked(true);
    const correct = items.every((it) => placed[it.id] === it.bin);
    if (correct) onComplete && onComplete();
  };

  const correctCount = items.filter((it) => placed[it.id] === it.bin).length;

  return (
    <div className="my-7" style={{ border: `1px solid ${trace.border}`, background: trace.raised }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${trace.border}` }}>
        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: trace.lime }}>
          SORT IT, {title}
        </span>
        {checked && (
          <span className="font-sans text-xs" style={{ color: correctCount === items.length ? trace.ok : trace.fail }}>
            {correctCount}/{items.length} correct
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-5 min-h-[40px]">
          {unplaced.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelected(selected === it.id ? null : it.id)}
              className="font-mono text-xs px-3 py-2 transition-all"
              style={{
                background: selected === it.id ? trace.limeFaint : trace.raised,
                border: selected === it.id ? `1px solid ${trace.lime}` : `1px solid ${trace.borderStrong}`,
                color: selected === it.id ? trace.lime : trace.text,
                cursor: "pointer",
              }}
            >
              {it.text}
            </button>
          ))}
          {allPlaced && <span className="font-sans text-xs" style={{ color: '#FFFFFF' }}>all sorted, check your answer</span>}
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${bins.length}, 1fr)` }}>
          {bins.map((bin) => {
            const binItems = items.filter((it) => placed[it.id] === bin.id);
            return (
              <div
                key={bin.id}
                onClick={() => place(bin.id)}
                className="px-3 py-3 transition-all"
                style={{
                  border: selected ? `1px dashed ${trace.lime}66` : `1px solid ${trace.border}`,
                  background: selected ? trace.limeFaint : trace.surface,
                  minHeight: 92,
                  cursor: selected ? "pointer" : "default",
                }}
              >
                <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: '#FFFFFF' }}>{bin.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {binItems.map((it) => {
                    const ok = it.bin === bin.id;
                    return (
                      <span
                        key={it.id}
                        onClick={(e) => { e.stopPropagation(); setPlaced((p) => { const n = { ...p }; delete n[it.id]; return n; }); setChecked(false); }}
                        className="inline-flex items-center gap-1 font-mono text-xs px-2 py-1"
                        style={{
                          background: checked ? (ok ? trace.okWash : trace.failWash) : trace.raised,
                          border: `1px solid ${checked ? (ok ? trace.ok : trace.fail) : trace.borderStrong}`,
                          color: checked ? (ok ? trace.ok : trace.fail) : trace.text,
                          cursor: "pointer",
                        }}
                      >
                        {checked && (ok ? <Check size={10} /> : <X size={10} />)}
                        {it.text}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={check}
            disabled={!allPlaced}
            className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all disabled:opacity-30"
            style={{ background: trace.lime, color: trace.bg, fontWeight: 700, border: "none", cursor: allPlaced ? "pointer" : "not-allowed" }}
          >
            Check answer
          </button>
          <button onClick={reset} className="font-sans text-xs tracking-widest uppercase px-3 py-2" style={{ background: "transparent", border: `1px solid ${trace.borderStrong}`, color: '#FFFFFF', cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
