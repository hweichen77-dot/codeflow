import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BADGES = [
  { id: "first_lesson", label: "First Step", icon: "🚀", desc: "Complete your first lesson", threshold: 1 },
  { id: "five_lessons", label: "Getting Warm", icon: "🔥", desc: "Complete 5 lessons", threshold: 5 },
  { id: "ten_lessons", label: "On Fire", icon: "⚡", desc: "Complete 10 lessons", threshold: 10 },
  { id: "twenty_lessons", label: "Unstoppable", icon: "💥", desc: "Complete 20 lessons", threshold: 20 },
];

export default function BadgeUnlock({ completedCount }) {
  const [newBadge, setNewBadge] = useState(null);

  useEffect(() => {
    const unlocked = JSON.parse(localStorage.getItem("codeflow_badges") || "[]");
    const earned = BADGES.filter(b => completedCount >= b.threshold);
    const justUnlocked = earned.find(b => !unlocked.includes(b.id));
    if (justUnlocked) {
      setNewBadge(justUnlocked);
      localStorage.setItem("codeflow_badges", JSON.stringify([...unlocked, justUnlocked.id]));
      setTimeout(() => setNewBadge(null), 4000);
    }
  }, [completedCount]);

  return (
    <AnimatePresence>
      {newBadge && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-6 py-4"
          style={{
            background: "#0d0d0d",
            border: "1px solid #b8ff00",
            boxShadow: "0 0 40px rgba(184,255,0,0.15)",
          }}
        >
          <span style={{ fontSize: "2rem" }}>{newBadge.icon}</span>
          <div>
            <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>
              Badge Unlocked!
            </div>
            <div className="font-display font-bold text-sm" style={{ color: "#e8e8e8" }}>
              {newBadge.label}
            </div>
            <div className="font-mono text-xs" style={{ color: "#555" }}>
              {newBadge.desc}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}