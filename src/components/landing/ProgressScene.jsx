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

// Bar animates from 0 → target width as user scrolls in
// Using wider input ranges so animations pace slowly
function SkillBar({ bar, index, scrollYProgress }) {
  const inStart = 0.08 + index * 0.045;
  const inEnd = inStart + 0.18;
  const width = useTransform(scrollYProgress, [inStart, inEnd], ["0%", `${bar.width}%`]);
  const opacity = useTransform(scrollYProgress, [inStart - 0.04, inStart + 0.08], [0, 1]);
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
  const inStart = 0.12 + index * 0.055;
  const opacity = useTransform(scrollYProgress, [inStart, inStart + 0.14], [0, 1]);
  const y = useTransform(scrollYProgress, [inStart, inStart + 0.14], [24, 0]);
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
  // Background layers parallax
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Heading fade in early
  const headingOpacity = useTransform(scrollYProgress, [0.03, 0.15], [0, 1]);
  const headingY = useTransform(scrollYProgress, [0.03, 0.15], [30, 0]);

  return (
    <div ref={ref} style={{ height: "400vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center px-6"
        style={{ background: "#080808" }}
      >
        {/* Parallax background grid */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(184,255,0,0.025) 1px, transparent 1px)`,
              backgroundSize: "100% 80px",
            }}
          />
        </motion.div>

        {/* Parallax glow — drifts at different speed */}
        <motion.div style={{ y: glowY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 110% 70% at 50% 110%, rgba(184,255,0,0.06) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full max-w-5xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-12 text-center" style={{ color: "#2a2a2a" }}>
            § YOUR GROWTH
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Left: skill bars */}
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

            {/* Right: stats */}
            <div className="grid grid-cols-2 gap-0" style={{ border: "1px solid #1a1a1a" }}>
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}