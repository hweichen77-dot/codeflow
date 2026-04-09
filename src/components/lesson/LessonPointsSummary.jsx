import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star } from "lucide-react";
import confetti from "canvas-confetti";

export default function LessonPointsSummary({
  lessonTitle,
  sectionNumber,
  totalPoints,
  earnedPoints,
  readingComplete,
  quizComplete,
  participationComplete,
  challengeComplete,
  nextLessonTitle,
  onNextLesson,
}) {
  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
  const allDone = pct === 100;
  const celebratedRef = useRef(false);

  useEffect(() => {
    if (allDone && !celebratedRef.current) {
      celebratedRef.current = true;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ["#b8ff00", "#60a5fa", "#f59e0b", "#f97316"],
        ticks: 200,
      });
    }
  }, [allDone]);

  const items = [
    { label: "Reading", done: readingComplete, pts: 2, emoji: "📖" },
    { label: "Participation Activities", done: participationComplete, pts: 3, emoji: "✏️" },
    { label: "Quiz", done: quizComplete, pts: 3, emoji: "🧩" },
    { label: "Coding Challenge", done: challengeComplete, pts: 2, emoji: "💻" },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #e8e8e8", background: allDone ? "#f0fff0" : "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#222", margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px" }}>
              {allDone && <span style={{ fontSize: "1.1rem" }}>🎉</span>}
              Activity summary: {lessonTitle}
            </h3>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-xs tracking-widest"
                style={{ color: "#2d7a3a", marginTop: "2px" }}
              >
                LESSON COMPLETE — AMAZING WORK!
              </motion.div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "1.35rem", fontWeight: 800, color: allDone ? "#2d7a3a" : "#222", letterSpacing: "-0.03em" }}>
              {earnedPoints} <span style={{ fontSize: "0.85rem", color: "#888", fontWeight: 400 }}>/ {totalPoints}</span>
            </div>
            <div style={{ fontSize: "0.7rem", color: "#aaa", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              points
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div style={{ height: "6px", background: "#e8e8e8", borderRadius: "3px", marginTop: "14px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: allDone
                ? "linear-gradient(90deg, #2d7a3a, #4caf50)"
                : `linear-gradient(90deg, #cf6a2f, #f59e0b)`,
              borderRadius: "3px",
            }}
          />
        </div>

        {/* Stars */}
        <div style={{ display: "flex", gap: "4px", marginTop: "10px" }}>
          {[1, 2, 3].map(star => (
            <motion.div
              key={star}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: pct >= star * 33 ? 1 : 0.5, opacity: pct >= star * 33 ? 1 : 0.2 }}
              transition={{ delay: star * 0.15, type: "spring", stiffness: 400 }}
            >
              <Star
                size={16}
                fill={pct >= star * 33 ? "#f59e0b" : "none"}
                color={pct >= star * 33 ? "#f59e0b" : "#ddd"}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div style={{ padding: "16px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <motion.div
                  animate={{ scale: item.done ? [1, 1.3, 1] : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: item.done ? "#2d7a3a" : "#e0e0e0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </motion.div>
                <span style={{ fontSize: "0.875rem", color: item.done ? "#222" : "#888", fontWeight: item.done ? 500 : 400 }}>
                  {item.emoji} {item.label}
                </span>
              </div>
              <AnimatePresence>
                {item.done ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ fontSize: "0.8125rem", color: "#2d7a3a", fontWeight: 700 }}
                  >
                    +{item.pts} pts
                  </motion.span>
                ) : (
                  <span key="todo" style={{ fontSize: "0.8125rem", color: "#bbb" }}>
                    {item.pts} pts
                  </span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Next section */}
      {nextLessonTitle && (
        <div style={{ padding: "14px 28px", borderTop: "1px solid #e8e8e8", textAlign: "right", background: allDone ? "#f9fff9" : "#fafafa" }}>
          <button
            onClick={onNextLesson}
            style={{
              fontSize: "0.875rem",
              color: allDone ? "#2d7a3a" : "#2980b9",
              background: "none", border: "none",
              cursor: "pointer", fontWeight: 600,
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {allDone ? "🏆 Next:" : "↓"} {nextLessonTitle} →
          </button>
        </div>
      )}
    </div>
  );
}