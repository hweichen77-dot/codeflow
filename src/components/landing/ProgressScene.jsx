import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const STATS = [
  { label: "Projects Built", value: "8+", description: "End-to-end working applications" },
  { label: "AI Concepts", value: "37", description: "Lessons across the AI track" },
  { label: "Skill Tracks", value: "2", description: "Coding and AI/ML paths" },
  { label: "Avg Completion", value: "94%", description: "Students who start, finish" },
];

const BARS = [
  { label: "HTML & CSS", width: 95, color: "#b8ff00" },
  { label: "JavaScript", width: 88, color: "#b8ff00" },
  { label: "React", width: 80, color: "#b8ff00" },
  { label: "AI Fundamentals", width: 75, color: "#00d4ff" },
  { label: "Prompt Engineering", width: 70, color: "#00d4ff" },
  { label: "RAG & Embeddings", width: 62, color: "#00d4ff" },
];

function SkillBar({ bar, index, scrollYProgress }) {
  const inStart = 0.07 + index * 0.05;
  const inEnd = inStart + 0.2;
  const width = useTransform(scrollYProgress, [inStart, inEnd], ["0%", `${bar.width}%`]);
  const opacity = useTransform(scrollYProgress, [inStart - 0.03, inStart + 0.09], [0, 1]);
  return (
    <motion.div style={{ opacity }}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs" style={{ color: "#555" }}>{bar.label}</span>
        <span className="font-mono text-xs" style={{ color: bar.color }}>{bar.width}%</span>
      </div>
      <div className="h-0.5 w-full" style={{ background: "#111" }}>
        <motion.div
          className="h-full"
          style={{
            width,
            background: bar.color,
            boxShadow: `0 0 10px ${bar.color}55`,
          }}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ stat, index, scrollYProgress }) {
  const inStart = 0.1 + index * 0.06;
  const opacity = useTransform(scrollYProgress, [inStart, inStart + 0.15], [0, 1]);
  const y = useTransform(scrollYProgress, [inStart, inStart + 0.15], [24, 0]);
  return (
    <motion.div
      style={{
        opacity,
        y,
        borderRight: index % 2 === 0 ? "1px solid #1a1a1a" : "none",
        borderBottom: index < 2 ? "1px solid #1a1a1a" : "none",
      }}
      className="p-6 md:p-8"
    >
      <div
        className="font-display font-black mb-1"
        style={{ fontSize: "3rem", letterSpacing: "-0.04em", color: "#b8ff00", lineHeight: 1 }}
      >
        {stat.value}
      </div>
      <div className="font-display font-bold text-sm mb-1" style={{ color: "#ccc" }}>
        {stat.label}
      </div>
      <div className="font-display text-xs" style={{ color: "#444", fontWeight: 400 }}>
        {stat.description}
      </div>
    </motion.div>
  );
}

export default function ProgressScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0, 1, 1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "45%"]);

  // Expanding pulse ring on scroll
  const ringScale = useTransform(scrollYProgress, [0.05, 0.6], [0.5, 2.5]);
  const ringOpacity = useTransform(scrollYProgress, [0.05, 0.2, 0.6], [0, 0.08, 0]);

  // Heading fade in
  const headingOpacity = useTransform(scrollYProgress, [0.03, 0.14], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.03, 0.14], [30, 0]);

  return (
    <div ref={ref} style={{ height: "500vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-end justify-center px-6"
        style={{ background: "#080808", paddingBottom: "8vh" }}
      >
        {/* Parallax horizontal lines */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(184,255,0,0.025) 1px, transparent 1px)`,
              backgroundSize: "100% 80px",
            }}
          />
        </motion.div>

        {/* Slower glow */}
        <motion.div style={{ y: bgY2 }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 110% 70% at 50% 115%, rgba(184,255,0,0.07) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Scroll-expanding pulse ring */}
        <motion.div
          style={{ scale: ringScale, opacity: ringOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-96 h-96 rounded-full"
            style={{ border: "1px solid #b8ff00" }}
          />
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: "2px",
                height: "2px",
                background: i % 2 === 0 ? "#b8ff00" : "#00d4ff",
                left: (13 * i + 8) % 100 + "%",
                top: (17 * i + 5) % 100 + "%",
                borderRadius: "50%",
              }}
              animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.4 }}
            />
          ))}
        </div>

        <div className="w-full max-w-5xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-12 text-center" style={{ color: "#2a2a2a" }}>
            § YOUR GROWTH
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <motion.div style={{ opacity: headingOpacity, y: headingY }}>
                <h2
                  className="font-display font-black mb-10"
                  style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
                >
                  Skills you'll gain.<br />
                  <span style={{ WebkitTextStroke: "1px #b8ff00", color: "transparent" }}>Measurably.</span>
                </h2>
              </motion.div>
              <div className="space-y-5">
                {BARS.map((bar, i) => (
                  <SkillBar key={bar.label} bar={bar} index={i} scrollYProgress={scrollYProgress} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-0" style={{ border: "1px solid #1a1a1a" }}>
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}