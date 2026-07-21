import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { tierColor, frameGradient } from "./rank";

export default function AvatarFrame({ tier = 1, initial = "?", src, size = 56, spin = true }) {
  const reduce = useReducedMotion();
  const color = tierColor(tier);
  const ring = Math.max(2, Math.round(size * 0.05));
  const ornate = tier >= 5;
  const elite = tier >= 7;
  const inner = size - ring * 2;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <motion.div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "9999px",
          background: frameGradient(tier),
          filter: elite ? `drop-shadow(0 0 10px ${color}88)` : ornate ? `drop-shadow(0 0 6px ${color}55)` : "none",
        }}
        animate={ornate && spin && !reduce ? { rotate: 360 } : {}}
        transition={ornate && spin && !reduce ? { duration: elite ? 8 : 12, repeat: Infinity, ease: "linear" } : {}}
      />
      {ornate && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: -Math.round(ring * 0.9),
            borderRadius: "9999px",
            border: `1px solid ${color}55`,
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: ring,
          width: inner,
          height: inner,
          borderRadius: "9999px",
          background: "#0C1210",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {src ? (
          <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span
            className="u-display"
            style={{ fontSize: size * 0.36, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", textTransform: "uppercase" }}
          >
            {String(initial).slice(0, 1)}
          </span>
        )}
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          minWidth: size * 0.32,
          height: size * 0.32,
          padding: "0 4px",
          borderRadius: "9999px",
          background: color,
          color: "#070B0A",
          fontSize: size * 0.2,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #070B0A",
          fontFamily: "'Spline Sans Mono Variable', ui-monospace, monospace",
        }}
      >
        {tier}
      </div>
    </div>
  );
}
