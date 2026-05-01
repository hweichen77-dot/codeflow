import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function LessonCompletionCelebration({ show, lessonTitle, xpEarned, onClose }) {
  useEffect(() => {
    if (show) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#b8ff00", "#ffffff", "#888888"],
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
            style={{ background: "#0d0d0d", border: "1px solid #b8ff00", boxShadow: "0 0 60px rgba(184,255,0,0.2)", maxWidth: "420px" }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏆</div>
            <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b8ff00" }}>
              Lesson Complete
            </div>
            <h2
              style={{ fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 800, color: "#f0f0f0", letterSpacing: "-0.02em", margin: "0 0 8px" }}
            >
              {lessonTitle}
            </h2>
            <div className="font-mono text-sm mt-4 mb-6" style={{ color: "#555" }}>
              +{xpEarned} XP earned
            </div>
            <button
              onClick={onClose}
              className="font-mono text-xs tracking-widest uppercase px-8 py-3 w-full"
              style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700, border: "none" }}
            >
              Continue →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}