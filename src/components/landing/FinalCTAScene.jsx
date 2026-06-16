import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function FinalCTAScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [40, 0]);

  return (
    <div
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-32"
      style={{ background: "#0a0a0a", borderTop: "1px solid #111" }}
    >
      {/* Ghost text bg */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          fontSize: "clamp(6rem, 18vw, 18rem)",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px #141414",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        BUILD
      </div>

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(184,255,0,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Horizontal line */}
      <div
        className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #b8ff0015, transparent)" }}
      />

      {/* Content */}
      <motion.div style={{ opacity, scale, y }} className="relative z-10 text-center max-w-3xl mx-auto">
        <div
          className="font-mono text-xs tracking-widest uppercase mb-8"
          style={{ color: "#b8ff00" }}
        >
          § READY TO START
        </div>

        <h2
          className="font-display font-black leading-none mb-6"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
            letterSpacing: "-0.03em",
            color: "#e8e8e8",
          }}
        >
          Stop watching.<br />
          <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>
            Start building.
          </span>
        </h2>

        <p
          className="font-display text-lg mb-12 mx-auto"
          style={{ color: "#e8e8e8", maxWidth: "42ch", fontWeight: 400, lineHeight: 1.6 }}
        >
          Free forever. No setup required. Open your first lesson and write code in under 30 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{
                background: "#b8ff00",
                color: "#0a0a0a",
                border: "1px solid #b8ff00",
                fontWeight: 700,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(184,255,0,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Browse Projects →
            </button>
          </Link>

          <Link to={createPageUrl("AITrack")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{ color: "#c4c4c4", border: "1px solid #1e1e1e" }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#333";
                e.currentTarget.style.color = "#e8e8e8";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#1e1e1e";
                e.currentTarget.style.color = "#c4c4c4";
              }}
            >
              AI Track
            </button>
          </Link>
        </div>

        {/* Three micro-stats */}
        <div className="flex flex-wrap items-center justify-center gap-8">
          {[
            ["Free", "forever"],
            ["No setup", "required"],
            ["Code in", "30 seconds"],
          ].map(([top, bot]) => (
            <div key={top} className="text-center">
              <div className="font-display font-bold text-sm" style={{ color: "#ccc" }}>{top}</div>
              <div className="font-mono text-xs" style={{ color: "#e8e8e8" }}>{bot}</div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-20 font-mono text-xs tracking-widest"
          style={{ color: "#e8e8e8" }}
        >
          © 2026 codeflow &nbsp;·&nbsp; crafted with insomnia and strong opinions
          <span
            className="ml-4 cursor-pointer select-none transition-all duration-500"
            style={{ color: "#111" }}
            title="you found it"
            onMouseEnter={e => { e.currentTarget.style.color = "#b8ff00"; e.currentTarget.style.letterSpacing = "0.4em"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#111"; e.currentTarget.style.letterSpacing = ""; }}
          >▸</span>
        </div>
      </motion.div>
    </div>
  );
}