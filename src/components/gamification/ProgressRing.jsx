import React from "react";
import { motion } from "framer-motion";

/**
 * SVG circular progress ring.
 * @param {number} percent 0-100
 * @param {number} size diameter in px
 * @param {string} color stroke color of the filled arc
 */
export default function ProgressRing({
  percent = 0,
  size = 44,
  color = "#b8ff00",
  track = "#1a1a1a",
  strokeWidth,
  showLabel = true,
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const sw = strokeWidth || Math.max(3, Math.round(size * 0.09));
  const radius = (size - sw) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
      title={`${pct}% complete`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={track}
          strokeWidth={sw}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
      </svg>
      {showLabel && (
        <div
          className="font-mono"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.26,
            color: pct === 100 ? color : "#d4d4d4",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          {pct === 100 ? "✓" : `${pct}%`}
        </div>
      )}
    </div>
  );
}
