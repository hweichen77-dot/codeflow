import React, { useEffect, useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function HeroScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Content stays fully visible until 70% scroll, then fades — very slow exit
  const opacity = useTransform(scrollYProgress, [0, 0.65, 0.9], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -30]);

  // Parallax background layers — all move at different speeds
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.75], [0.5, 0]);

  // Animated ring that expands as user scrolls
  const ringScale = useTransform(scrollYProgress, [0, 0.5], [1, 2.2]);
  const ringOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5], [0, 0.12, 0]);

  return (
    <div ref={ref} style={{ height: "340vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#080808", paddingTop: "10vh" }}
      >
        {/* Parallax grid layer (moves slower) */}
        <motion.div
          style={{ opacity: gridOpacity, y: gridY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184,255,0,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184,255,0,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        {/* Expanding ring on scroll */}
        <motion.div
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-96 h-96 rounded-full"
            style={{ border: "1px solid #b8ff00" }}
          />
        </motion.div>

        {/* Radial glow — moves even slower */}
        <motion.div
          style={{ y: glowY }}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 100% 70% at 50% 60%, rgba(184,255,0,0.09) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) + "px",
                height: (i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1) + "px",
                background: i % 4 === 0 ? "#00d4ff" : "#b8ff00",
                left: (7 * i + 5) % 100 + "%",
                top: (11 * i + 10) % 100 + "%",
                opacity: 0.25,
              }}
              animate={{ y: [0, -28, 0], opacity: [0.1, 0.5, 0.1] }}
              transition={{
                duration: 4 + (i % 5) * 0.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.22,
              }}
            />
          ))}
        </div>

        {/* Horizontal scan lines that drift on scroll */}
        <motion.div style={{ y: glowY }} className="absolute inset-0 pointer-events-none">
          {[20, 45, 68, 82].map((pct, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{
                top: `${pct}%`,
                background: `linear-gradient(90deg, transparent, rgba(184,255,0,0.06), transparent)`,
              }}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>

        {/* Content — sits lower via padding-bottom on parent */}
        <motion.div
          style={{ scale, opacity, y }}
          className="relative z-10 text-center px-6 max-w-5xl mx-auto w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs tracking-widest uppercase mb-8"
            style={{ color: "#b8ff00" }}
          >
            § CodeFlow — The Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-black leading-none mb-8"
            style={{
              fontSize: "clamp(3.5rem, 9vw, 8rem)",
              letterSpacing: "-0.03em",
              color: "#e8e8e8",
            }}
          >
            Master Coding<br />
            <span style={{ WebkitTextStroke: "2px #b8ff00", color: "transparent" }}>
              and AI
            </span>{" "}
            in One Place.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-lg md:text-xl mb-12 mx-auto"
            style={{ color: "#555", maxWidth: "50ch", fontWeight: 400, lineHeight: 1.7 }}
          >
            Not courses. Not theory dumps. A hands-on progression from first principles to deployed AI — with code at every step.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link to={createPageUrl("Projects")}>
              <button
                className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
                style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700 }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(184,255,0,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Start Learning →
              </button>
            </Link>
            <Link to={createPageUrl("AITrack")}>
              <button
                className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
                style={{ color: "#555", border: "1px solid #1e1e1e" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#e8e8e8";
                  e.currentTarget.style.borderColor = "#333";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#555";
                  e.currentTarget.style.borderColor = "#1e1e1e";
                }}
              >
                View AI Track
              </button>
            </Link>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="mt-20 flex flex-col items-center gap-2"
          >
            <span className="font-mono text-xs tracking-widest" style={{ color: "#222" }}>SCROLL</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-px h-10"
              style={{ background: "linear-gradient(to bottom, #b8ff00, transparent)" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}