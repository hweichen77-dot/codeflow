import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { rankInfo } from "./rank";

const EASE = [0.16, 1, 0.3, 1];

export default function RankWheel({ totalXP = 0, size = 168, showNext = true }) {
  const reduce = useReducedMotion();
  const info = rankInfo(totalXP);
  const sw = Math.max(6, Math.round(size * 0.055));
  const r = (size - sw) / 2 - 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (info.pct / 100) * circ;
  const gid = `rankwheel-${info.tier}`;

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <defs>
            <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={info.color} />
              <stop offset="100%" stopColor={info.nextColor} />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#17201C" strokeWidth={sw} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: reduce ? offset : circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.9, ease: EASE }}
            style={{ filter: `drop-shadow(0 0 6px ${info.color}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div
            className="u-mono"
            style={{ fontSize: "0.62rem", letterSpacing: "0.22em", color: info.color, textTransform: "uppercase" }}
          >
            Rank {info.tier}
          </div>
          <div
            className="u-display"
            style={{ fontSize: size > 150 ? "1.5rem" : "1.15rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.05, marginTop: 2 }}
          >
            {info.name}
          </div>
          <div className="u-mono" style={{ fontSize: "0.68rem", color: "rgba(255,255,255,.62)", marginTop: 4 }}>
            {info.xp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {showNext && (
        <div className="mt-3 text-center">
          {info.isMax ? (
            <span className="u-mono" style={{ fontSize: "0.72rem", color: info.color }}>
              Top rank reached
            </span>
          ) : (
            <span className="u-mono" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,.62)" }}>
              {info.toNext.toLocaleString()} XP to{" "}
              <span style={{ color: info.nextColor, fontWeight: 600 }}>{info.nextName}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
