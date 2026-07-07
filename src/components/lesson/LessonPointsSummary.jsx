import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

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
        colors: ["#E8A33C", "#C2643C", "#f59e0b", "#f97316"],
        ticks: 200,
      });
    }
  }, [allDone]);

  const items = [
    { label: "Reading", done: readingComplete, pts: 2 },
    { label: "Participation Activities", done: participationComplete, pts: 3 },
    { label: "Quiz", done: quizComplete, pts: 3 },
    { label: "Coding Challenge", done: challengeComplete, pts: 2 },
  ];

  return (
    <div style={{ ...traceStyles.terminal, overflow: "hidden", fontFamily: trace.mono }}>
      <div style={{ padding: "20px 28px", borderBottom: `1px solid ${trace.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ ...traceStyles.monoLabel, color: trace.lime, fontSize: "0.8125rem", textTransform: "none", letterSpacing: "0.04em" }}>
              {allDone ? "> RUN COMPLETE" : "> RUN IN PROGRESS"}
            </div>
            <div style={{ fontSize: "0.75rem", color: '#FFFFFF', marginTop: "6px", fontFamily: trace.mono }}>
              {lessonTitle}
            </div>
            {allDone && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: trace.lime, marginTop: "8px", fontFamily: trace.mono, fontSize: "0.7rem", letterSpacing: "0.12em" }}
              >
                ✓ LESSON COMPLETE, ALL TASKS PASSED
              </motion.div>
            )}
          </div>
          <div style={{ textAlign: "right", fontFamily: trace.mono }}>
            <div style={{ fontSize: "0.7rem", color: '#FFFFFF', textTransform: "uppercase", letterSpacing: "0.1em" }}>
              XP
            </div>
            <div style={{ fontSize: "1.35rem", fontWeight: 700, color: allDone ? trace.lime : trace.text, letterSpacing: "-0.02em" }}>
              {earnedPoints} <span style={{ fontSize: "0.85rem", color: '#FFFFFF', fontWeight: 400 }}>/ {totalPoints}</span>
            </div>
          </div>
        </div>

        <div style={{ height: "6px", background: trace.surface, borderRadius: "3px", marginTop: "14px", overflow: "hidden", border: `1px solid ${trace.border}` }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              background: `linear-gradient(90deg, ${trace.limeDim}, ${trace.lime})`,
              borderRadius: "3px",
            }}
          />
        </div>
      </div>

      <div style={{ padding: "16px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: trace.mono, fontSize: "0.8125rem" }}
            >
              <span style={{ color: item.done ? trace.text : trace.muted }}>
                <span style={{ color: item.done ? trace.lime : trace.muted, marginRight: "8px" }}>
                  {item.done ? "[x]" : "[ ]"}
                </span>
                {item.label}
              </span>
              <AnimatePresence>
                {item.done ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ color: trace.lime, fontWeight: 700 }}
                  >
                    +{item.pts} XP
                  </motion.span>
                ) : (
                  <span key="todo" style={{ color: '#FFFFFF' }}>
                    {item.pts} XP
                  </span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {nextLessonTitle && (
        <div style={{ padding: "14px 28px", borderTop: `1px solid ${trace.border}`, textAlign: "right" }}>
          <button
            onClick={onNextLesson}
            style={{
              fontFamily: trace.mono,
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#15130E",
              background: trace.lime,
              border: "none",
              borderRadius: "4px",
              padding: "8px 18px",
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: "6px",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {nextLessonTitle} →
          </button>
        </div>
      )}
    </div>
  );
}
