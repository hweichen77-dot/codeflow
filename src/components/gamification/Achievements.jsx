import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { computeAchievements } from "../../lib/achievements";
import { showXPToast } from "./XPToast";

const SEEN_KEY = "codeflow_achievements_seen";

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function Achievements({ progress = [], projects = [], streak = 0, capstones = [] }) {
  const achievements = computeAchievements({ progress, projects, streak, capstones });
  const announced = useRef(false);

  useEffect(() => {
    if (announced.current) return;
    if (!projects.length) return;
    announced.current = true;

    const seen = readSeen();
    const unlockedIds = achievements.filter((a) => a.unlocked).map((a) => a.id);
    const fresh = achievements.filter((a) => a.unlocked && !seen.includes(a.id));

    fresh.forEach((a, i) => {
      setTimeout(() => {
        showXPToast(`Achievement: ${a.title}`, 0, a.icon);
      }, 400 + i * 900);
    });

    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(unlockedIds));
    } catch {
    }
  }, [achievements, projects.length]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>
          ACHIEVEMENTS
        </div>
        <div className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
          {unlockedCount} / {achievements.length}
        </div>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-0"
        style={{ border: "1px solid #17201C" }}
      >
        {achievements.map((a, i) => {
          const cols = 4;
          const row = Math.floor(i / cols);
          const lastRow = Math.floor((achievements.length - 1) / cols);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-5 flex flex-col items-center text-center"
              style={{
                borderRight: (i % cols !== cols - 1) ? "1px solid #17201C" : "none",
                borderBottom: row < lastRow ? "1px solid #17201C" : "none",
                background: a.unlocked ? "#070B0A" : "transparent",
                opacity: a.unlocked ? 1 : 0.4,
              }}
              title={a.desc}
            >
              <div
                style={{
                  fontSize: "1.75rem",
                  marginBottom: "8px",
                  filter: a.unlocked ? "none" : "grayscale(1)",
                }}
              >
                {a.icon}
              </div>
              <div
                className="font-display text-sm font-bold mb-1"
                style={{ color: a.unlocked ? "#ECF3EF" : "#B7C6BE", letterSpacing: "-0.01em" }}
              >
                {a.title}
              </div>
              <div
                className="font-sans"
                style={{ fontSize: "0.65rem", color: a.unlocked ? "#CBD6D0" : "#B7C6BE", lineHeight: 1.4 }}
              >
                {a.unlocked ? a.desc : "LOCKED"}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
