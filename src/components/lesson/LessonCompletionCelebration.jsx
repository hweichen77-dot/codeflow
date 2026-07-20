import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { trace } from "@/components/lesson/trace/theme";

export default function LessonCompletionCelebration({ show, lessonTitle, xpEarned, onClose }) {
  useEffect(() => {
    if (show) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: [trace.lime, trace.text, trace.faint],
      });
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="text-center px-12 py-10"
            style={{ background: trace.terminal, border: `1px solid ${trace.lime}`, boxShadow: "0 0 60px rgba(94,210,156,0.2)", maxWidth: "420px" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}></div>
            <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: trace.lime }}>
              Lesson Complete
            </div>
            <h2
              style={{ fontFamily: trace.serif, fontSize: "1.5rem", fontWeight: 800, color: trace.text, letterSpacing: "-0.02em", margin: "0 0 8px" }}
            >
              {lessonTitle}
            </h2>
            <div className="font-sans text-sm mt-4 mb-6" style={{ color: '#FFFFFF' }}>
              +{xpEarned} XP earned
            </div>
            <button
              onClick={onClose}
              className="font-sans text-xs tracking-widest uppercase px-8 py-3 w-full"
              style={{ background: trace.lime, color: trace.bg, fontWeight: 700, border: "none" }}
            >
              Continue →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
