import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function StreakBadge({ completedCount }) {
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Track streak using localStorage
    const today = new Date().toDateString();
    const data = JSON.parse(localStorage.getItem("codeflow_streak") || "{}");
    const lastVisit = data.lastVisit;
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (lastVisit === today) {
      setStreakDays(data.streak || 1);
    } else if (lastVisit === yesterday) {
      const newStreak = (data.streak || 0) + 1;
      localStorage.setItem("codeflow_streak", JSON.stringify({ lastVisit: today, streak: newStreak }));
      setStreakDays(newStreak);
    } else {
      localStorage.setItem("codeflow_streak", JSON.stringify({ lastVisit: today, streak: 1 }));
      setStreakDays(1);
    }
  }, []);

  const streakEmoji = streakDays >= 7 ? "🔥" : streakDays >= 3 ? "⚡" : "✦";

  return (
    <div className="flex items-center gap-4 mb-5">
      {/* Streak */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-3 py-1.5"
        style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}
      >
        <span style={{ fontSize: "0.75rem" }}>{streakEmoji}</span>
        <div>
          <div className="font-mono text-xs font-bold" style={{ color: streakDays >= 3 ? "#b8ff00" : "#888" }}>
            {streakDays}d streak
          </div>
        </div>
      </motion.div>

      {/* Lessons done */}
      <div className="flex items-center gap-2 px-3 py-1.5" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
        <span style={{ fontSize: "0.75rem" }}>🏆</span>
        <div className="font-mono text-xs font-bold" style={{ color: "#888" }}>
          {completedCount} done
        </div>
      </div>
    </div>
  );
}