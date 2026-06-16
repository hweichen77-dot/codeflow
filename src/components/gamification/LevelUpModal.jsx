import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { LEVELS, getLevel } from "./XPLevelBar";

export { LEVELS, getLevel };

/**
 * Full-screen celebratory level-up modal.
 * @param {boolean} show
 * @param {number} level    new level number
 * @param {function} onClose
 */
export default function LevelUpModal({ show, level, onClose }) {
  const lvl = LEVELS.find((l) => l.level === level) || LEVELS[LEVELS.length - 1];

  useEffect(() => {
    if (!show) return;
    const burst = () => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.55 },
        colors: [lvl.color, "#ffffff", "#b8ff00"],
      });
    };
    burst();
    const t1 = setTimeout(burst, 250);
    const t2 = setTimeout(burst, 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [show, lvl.color]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(5,5,5,0.85)",
            backdropFilter: "blur(6px)",
            padding: "24px",
          }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              padding: "48px 40px 40px",
              background: "#0a0a0a",
              border: `1px solid ${lvl.color}55`,
              boxShadow: `0 0 80px ${lvl.color}22`,
            }}
          >
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${lvl.color}, transparent)` }}
            />

            <div
              className="font-mono text-xs tracking-widest uppercase mb-6"
              style={{ color: "#c4c4c4" }}
            >
              § LEVEL UP
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 16 }}
              style={{
                width: "96px",
                height: "96px",
                margin: "0 auto 24px",
                borderRadius: "6px",
                background: lvl.color + "18",
                border: `1.5px solid ${lvl.color}66`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: "0.7rem", color: lvl.color, letterSpacing: "0.1em" }}
              >
                LVL
              </div>
              <div
                className="font-mono font-bold"
                style={{ fontSize: "2.75rem", color: lvl.color, lineHeight: 1 }}
              >
                {lvl.level}
              </div>
            </motion.div>

            <h2
              style={{
                fontFamily: "'Syne', Georgia, serif",
                fontSize: "2.25rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: lvl.color,
                margin: "0 0 8px",
              }}
            >
              {lvl.name}
            </h2>
            <p
              className="font-display text-sm"
              style={{ color: "#d4d4d4", fontWeight: 400, margin: "0 0 32px" }}
            >
              You've reached a new level. Keep building.
            </p>

            <button
              onClick={onClose}
              className="font-mono text-xs tracking-widest uppercase px-8 py-4 transition-all duration-150"
              style={{ background: lvl.color, color: "#0a0a0a", fontWeight: 700, width: "100%" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 32px ${lvl.color}33`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Continue →
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
