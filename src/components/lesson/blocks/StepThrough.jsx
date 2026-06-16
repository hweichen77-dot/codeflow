import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";

/**
 * StepThrough — zyBooks-style animation player.
 * Step through a process with play / prev / next. All steps must be viewed
 * for the learner to "complete" it (onComplete fires once the last step is seen).
 *
 * props:
 *   title: string
 *   steps: [{ label, detail, code }]
 *   onComplete?: () => void
 */
export default function StepThrough({ title, steps = [], onComplete }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [seen, setSeen] = useState(() => new Set([0]));
  const timer = useRef(null);
  const firedRef = useRef(false);

  const atEnd = i >= steps.length - 1;

  useEffect(() => {
    setSeen((prev) => {
      const next = new Set(prev);
      next.add(i);
      return next;
    });
  }, [i]);

  useEffect(() => {
    if (seen.size === steps.length && !firedRef.current) {
      firedRef.current = true;
      onComplete && onComplete();
    }
  }, [seen, steps.length, onComplete]);

  useEffect(() => {
    if (!playing) return;
    if (atEnd) { setPlaying(false); return; }
    timer.current = setTimeout(() => setI((v) => Math.min(v + 1, steps.length - 1)), 1400);
    return () => clearTimeout(timer.current);
  }, [playing, i, atEnd, steps.length]);

  const step = steps[i] || {};

  return (
    <div className="my-7" style={{ border: "1px solid #e4e4e7", background: "#ffffff" }}>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #ececef" }}>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#2563eb" }}>
          ANIMATION — {title}
        </span>
        <span className="font-mono text-xs" style={{ color: "#6b7280" }}>
          STEP {i + 1} / {steps.length}
        </span>
      </div>

      {/* Stage */}
      <div className="px-6 py-7" style={{ minHeight: 168 }}>
        {/* progress dots */}
        <div className="flex gap-1.5 mb-5">
          {steps.map((_, k) => (
            <div
              key={k}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{ background: k <= i ? "#2563eb" : "#e4e4e7" }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="font-display font-bold text-lg mb-2" style={{ color: "#18181b" }}>
              {step.label}
            </div>
            <p className="font-display text-sm leading-relaxed" style={{ color: "#3f3f46" }}>
              {step.detail}
            </p>
            {step.code && (
              <pre
                className="mt-4 px-4 py-3 overflow-x-auto font-mono text-xs"
                style={{ background: "#f6f6f7", border: "1px solid #e4e4e7", color: "#166534", lineHeight: 1.7 }}
              >
                {step.code}
              </pre>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 px-5 py-3" style={{ borderTop: "1px solid #ececef" }}>
        <Ctl onClick={() => { setPlaying(false); setI(0); }} aria-label="Restart"><RotateCcw size={13} /></Ctl>
        <Ctl onClick={() => { setPlaying(false); setI((v) => Math.max(v - 1, 0)); }} disabled={i === 0} aria-label="Previous"><ChevronLeft size={15} /></Ctl>
        <button
          onClick={() => { if (atEnd) { setI(0); setPlaying(true); } else setPlaying((p) => !p); }}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all"
          style={{ background: "#2563eb", color: "#ffffff", fontWeight: 700, border: "none", cursor: "pointer" }}
        >
          {playing ? <Pause size={13} /> : <Play size={13} />}
          {playing ? "Pause" : atEnd ? "Replay" : "Play"}
        </button>
        <Ctl onClick={() => { setPlaying(false); setI((v) => Math.min(v + 1, steps.length - 1)); }} disabled={atEnd} aria-label="Next"><ChevronRight size={15} /></Ctl>
        {seen.size === steps.length && (
          <span className="ml-auto font-mono text-xs tracking-widest uppercase" style={{ color: "#4d7c0f" }}>
            ✓ viewed
          </span>
        )}
      </div>
    </div>
  );
}

function Ctl({ children, ...props }) {
  return (
    <button
      {...props}
      className="flex items-center justify-center w-8 h-8 transition-all disabled:opacity-30"
      style={{ background: "transparent", border: "1px solid #d4d4d8", color: "#52525b", cursor: props.disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
}
