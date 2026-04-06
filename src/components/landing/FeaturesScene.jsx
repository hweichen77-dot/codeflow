import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const FEATURES = [
  {
    num: "01",
    title: "Structured Curriculum",
    body: "Every topic is sequenced for maximum retention. No random YouTube rabbit holes. Just a clear path from zero to deployed.",
    tag: "LEARNING",
    accent: "#b8ff00",
  },
  {
    num: "02",
    title: "Hands-On Projects",
    body: "Build real things. Every module ends with a working project you can put in your portfolio. No toy examples.",
    tag: "BUILDING",
    accent: "#00d4ff",
  },
  {
    num: "03",
    title: "AI Tutor Built In",
    body: "Stuck? An AI tutor is watching your code and ready to guide — not give away the answer, but push you toward it.",
    tag: "SUPPORT",
    accent: "#b8ff00",
  },
  {
    num: "04",
    title: "Clear Skill Paths",
    body: "Coding or AI? Beginner or advanced? Follow a track or mix and match. The platform adapts to where you are.",
    tag: "DIRECTION",
    accent: "#00d4ff",
  },
];

// Each card occupies ~0.22 of scroll range, with generous overlap for readability
function FeatureCard({ feature, index, scrollYProgress }) {
  const isLast = index === FEATURES.length - 1;
  const inPoint = index * 0.22;
  const peakStart = inPoint + 0.1;
  const peakEnd = inPoint + 0.22;
  const outPoint = inPoint + 0.32;

  const cardOpacity = useTransform(
    scrollYProgress,
    isLast
      ? [inPoint, peakStart, 0.95]
      : [inPoint, peakStart, peakEnd, outPoint],
    isLast ? [0, 1, 1] : [0, 1, 1, 0.5]
  );
  const cardY = useTransform(scrollYProgress, [inPoint, peakStart], [50, 0]);
  const cardScale = useTransform(
    scrollYProgress,
    isLast ? [inPoint, peakStart] : [peakEnd, outPoint],
    isLast ? [0.97, 1] : [1, 0.96]
  );

  return (
    <motion.div
      style={{
        opacity: cardOpacity,
        y: cardY,
        scale: cardScale,
        zIndex: index + 1,
        position: "absolute",
        left: 0,
        right: 0,
      }}
    >
      <div
        className="max-w-2xl mx-auto p-10 md:p-14"
        style={{
          background: "#0d0d0d",
          border: "1px solid #1e1e1e",
          boxShadow: `0 0 80px rgba(0,0,0,0.7), 0 0 2px ${feature.accent}18`,
        }}
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <div
              className="font-mono font-bold mb-4"
              style={{ fontSize: "3.5rem", color: "#161616", letterSpacing: "-0.05em", lineHeight: 1 }}
            >
              {feature.num}
            </div>
            <span
              className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
              style={{ color: feature.accent, border: `1px solid ${feature.accent}33`, background: `${feature.accent}10` }}
            >
              {feature.tag}
            </span>
          </div>
          <div
            className="w-12 h-12 flex items-center justify-center"
            style={{ border: `1px solid ${feature.accent}22` }}
          >
            <div className="w-2.5 h-2.5" style={{ background: feature.accent }} />
          </div>
        </div>

        <h3
          className="font-display font-black mb-5"
          style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
        >
          {feature.title}
        </h3>
        <p
          className="font-display text-lg leading-relaxed"
          style={{ color: "#555", fontWeight: 400, maxWidth: "52ch" }}
        >
          {feature.body}
        </p>

        {/* Progress dots */}
        <div className="mt-10 flex items-center gap-4">
          <div className="flex gap-2">
            {FEATURES.map((_, i) => (
              <div
                key={i}
                className="h-0.5 transition-all duration-500"
                style={{
                  width: i <= index ? "28px" : "8px",
                  background: i <= index ? feature.accent : "#1e1e1e",
                }}
              />
            ))}
          </div>
          <span className="font-mono text-xs" style={{ color: "#2a2a2a" }}>
            {index + 1} / {FEATURES.length}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturesScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0]);
  // Background drifts up slower than content
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  return (
    <div ref={ref} style={{ height: "600vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center px-6"
        style={{ background: "#0a0a0a" }}
      >
        {/* Parallax bg */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(184,255,0,0.035) 0%, transparent 60%)",
            }}
          />
          {/* Subtle corner accents */}
          <div className="absolute top-0 left-0 w-64 h-64" style={{
            background: "radial-gradient(circle at 0% 0%, rgba(0,212,255,0.04) 0%, transparent 60%)"
          }} />
          <div className="absolute bottom-0 right-0 w-64 h-64" style={{
            background: "radial-gradient(circle at 100% 100%, rgba(184,255,0,0.04) 0%, transparent 60%)"
          }} />
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-6 text-center" style={{ color: "#2a2a2a" }}>
            § WHAT YOU GET
          </div>
          <div className="relative" style={{ minHeight: "460px" }}>
            {FEATURES.map((feature, i) => (
              <FeatureCard
                key={feature.num}
                feature={feature}
                index={i}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}