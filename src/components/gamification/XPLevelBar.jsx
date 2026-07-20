import React from "react";
import { motion } from "framer-motion";

export const LEVELS = [
  { level: 1, name: "Novice", min: 0, max: 50, color: "#FFFFFF" },
  { level: 2, name: "Learner", min: 50, max: 150, color: "#C2643C" },
  { level: 3, name: "Builder", min: 150, max: 300, color: "#D9A441" },
  { level: 4, name: "Developer", min: 300, max: 500, color: "#f59e0b" },
  { level: 5, name: "Engineer", min: 500, max: 800, color: "#f97316" },
  { level: 6, name: "Architect", min: 800, max: 1200, color: "#FF6B5C" },
  { level: 7, name: "Master", min: 1200, max: Infinity, color: "#5ED29C" },
];

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

export default function XPLevelBar({ totalXP = 0, earnedThisLesson = 0 }) {
  const lvl = getLevel(totalXP);
  const next = LEVELS.find(l => l.min > lvl.min) || lvl;
  const pct = lvl.max === Infinity ? 100 : Math.min(100, Math.round(((totalXP - lvl.min) / (lvl.max - lvl.min)) * 100));

  return (
    <div
      className="flex items-center gap-4 px-5 py-3"
      style={{ background: "#070B0A", border: "1px solid #17201C", borderRadius: "4px" }}
    >
      <div
        className="font-sans font-bold text-center flex-shrink-0"
        style={{
          width: "38px", height: "38px", borderRadius: "4px",
          background: lvl.color + "22", border: `1px solid ${lvl.color}44`,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ fontSize: "0.6rem", color: lvl.color, letterSpacing: "0.08em" }}>LVL</div>
        <div style={{ fontSize: "1rem", color: lvl.color, lineHeight: 1 }}>{lvl.level}</div>
      </div>

      <div style={{ flex: 1 }}>
        <div className="flex items-center justify-between mb-1.5">
          <div className="font-sans text-xs" style={{ color: lvl.color }}>
            {lvl.name}
          </div>
          <div className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
            {totalXP} / {lvl.max === Infinity ? "∞" : lvl.max} XP
          </div>
        </div>
        <div style={{ height: "3px", background: "#17201C", borderRadius: "2px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: lvl.color, borderRadius: "2px" }}
          />
        </div>
      </div>

      {earnedThisLesson > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-sans text-xs flex-shrink-0"
          style={{ color: "#5ED29C", background: "#5ED29C10", border: "1px solid #5ED29C33", padding: "3px 8px" }}
        >
          +{earnedThisLesson} this lesson
        </motion.div>
      )}
    </div>
  );
}