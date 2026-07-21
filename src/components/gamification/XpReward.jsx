import React from "react";
import { Zap } from "lucide-react";
import { estXpForDifficulty } from "./rank";

function heat(xp) {
  if (xp >= 50) return { color: "#7FE0B0", weight: 800 };
  if (xp >= 20) return { color: "#34D0C4", weight: 700 };
  return { color: "#5ED29C", weight: 600 };
}

export default function XpReward({ xp, difficulty, size = "sm" }) {
  const value = xp != null ? xp : estXpForDifficulty(difficulty);
  const h = heat(value);
  const px = size === "lg" ? 15 : size === "md" ? 13 : 11;
  const icon = size === "lg" ? 14 : 11;
  return (
    <span
      className="inline-flex items-center gap-1 tabular-nums"
      style={{ color: h.color, fontWeight: h.weight, fontSize: px, fontFamily: "'Spline Sans Mono Variable', ui-monospace, monospace" }}
      title={`${value} XP reward`}
    >
      <Zap size={icon} style={{ fill: h.color, stroke: "none" }} />
      {value.toLocaleString()} XP
    </span>
  );
}
