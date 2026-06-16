import React, { useState } from "react";
import { Check, X } from "lucide-react";

/**
 * DragToBin — classify activity (zyBooks matching / drag-to-bin).
 * Click an item to select, click a bin to drop it there. Reliable on touch too.
 *
 * props:
 *   title: string
 *   bins: [{ id, label }]
 *   items: [{ id, text, bin }]   // bin = correct bin id
 *   onComplete?: () => void
 */
export default function DragToBin({ title, bins = [], items = [], onComplete }) {
  const [placed, setPlaced] = useState({}); // itemId -> binId
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
    <div className="my-7" style={{ border: "1px solid #e4e4e7", background: "#ffffff" }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #ececef" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#9333ea" }}>
          SORT IT — {title}
        </span>
        {checked && (
          <span className="font-mono text-xs" style={{ color: correctCount === items.length ? "#4d7c0f" : "#ea580c" }}>
            {correctCount}/{items.length} correct
          </span>
        )}
      </div>

      <div className="p-5">
        {/* unplaced pool */}
        <div className="flex flex-wrap gap-2 mb-5 min-h-[40px]">
          {unplaced.map((it) => (
            <button
              key={it.id}
              onClick={() => setSelected(selected === it.id ? null : it.id)}
              className="font-mono text-xs px-3 py-2 transition-all"
              style={{
                background: selected === it.id ? "#9333ea14" : "#f6f6f7",
                border: selected === it.id ? "1px solid #9333ea" : "1px solid #e4e4e7",
                color: selected === it.id ? "#9333ea" : "#3f3f46",
                cursor: "pointer",
              }}
            >
              {it.text}
            </button>
          ))}
          {allPlaced && <span className="font-mono text-xs" style={{ color: "#6b7280" }}>all sorted — check your answer</span>}
        </div>

        {/* bins */}
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${bins.length}, 1fr)` }}>
          {bins.map((bin) => {
            const binItems = items.filter((it) => placed[it.id] === bin.id);
            return (
              <div
                key={bin.id}
                onClick={() => place(bin.id)}
                className="px-3 py-3 transition-all"
                style={{
                  border: selected ? "1px dashed #9333ea66" : "1px solid #e4e4e7",
                  background: selected ? "#9333ea08" : "#fafafa",
                  minHeight: 92,
                  cursor: selected ? "pointer" : "default",
                }}
              >
                <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#52525b" }}>{bin.label}</div>
                <div className="flex flex-wrap gap-1.5">
                  {binItems.map((it) => {
                    const ok = it.bin === bin.id;
                    return (
                      <span
                        key={it.id}
                        onClick={(e) => { e.stopPropagation(); setPlaced((p) => { const n = { ...p }; delete n[it.id]; return n; }); setChecked(false); }}
                        className="inline-flex items-center gap-1 font-mono text-xs px-2 py-1"
                        style={{
                          background: "#f6f6f7",
                          border: `1px solid ${checked ? (ok ? "#4d7c0f55" : "#ea580c55") : "#e4e4e7"}`,
                          color: checked ? (ok ? "#4d7c0f" : "#ea580c") : "#3f3f46",
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
            className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all disabled:opacity-30"
            style={{ background: "#9333ea", color: "#ffffff", fontWeight: 700, border: "none", cursor: allPlaced ? "pointer" : "not-allowed" }}
          >
            Check answer
          </button>
          <button onClick={reset} className="font-mono text-xs tracking-widest uppercase px-3 py-2" style={{ background: "transparent", border: "1px solid #d4d4d8", color: "#52525b", cursor: "pointer" }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
