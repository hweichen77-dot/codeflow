import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

const CODING_TOPICS = ["Variables & Functions", "DOM & Browser APIs", "React & Components", "Data Structures", "Algorithms"];
const AI_TOPICS = ["How Models Work", "Prompt Engineering", "Embeddings & Vectors", "RAG Systems", "Fine-Tuning"];

// Sub-components to avoid hook-in-callback violations
function LeftPanel({ scrollYProgress }) {
  const x = useTransform(scrollYProgress, [0.15, 0.55], ["0%", "-6%"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  return (
    <motion.div
      style={{ x }}
      className="absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-12 lg:px-20"
    >
      <motion.div style={{ opacity }} className="relative z-10 text-left max-w-xs">
        {/* Ghost bg text */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            fontSize: "clamp(5rem, 12vw, 11rem)",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: "1px #161616",
            letterSpacing: "-0.05em",
            top: "-2rem",
            left: "-1rem",
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          CODE
        </div>
        <div className="relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#555" }}>PATH 01</div>
          <h3
            className="font-display font-black mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
          >
            Coding
          </h3>
          <p className="font-display text-base mb-6" style={{ color: "#444", fontWeight: 400 }}>
            From HTML & JavaScript to React and algorithms. Build real projects, not toy examples.
          </p>
          <motion.div style={{ opacity: contentOpacity }} className="space-y-2.5 mb-8">
            {CODING_TOPICS.map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="font-mono text-xs" style={{ color: "#b8ff0066" }}>→</span>
                <span className="font-mono text-xs" style={{ color: "#555" }}>{t}</span>
              </div>
            ))}
          </motion.div>
          <motion.div style={{ opacity: contentOpacity }}>
            <Link to={createPageUrl("Projects")}>
              <button
                className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200"
                style={{ border: "1px solid #b8ff0033", color: "#b8ff00", background: "#b8ff0010" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#b8ff0020"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#b8ff0010"; }}
              >
                View Projects →
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function RightPanel({ scrollYProgress }) {
  const x = useTransform(scrollYProgress, [0.15, 0.55], ["0%", "6%"]);
  const opacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  return (
    <motion.div
      style={{ x }}
      className="absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 lg:px-20"
    >
      <motion.div style={{ opacity }} className="relative z-10 text-right max-w-xs ml-auto">
        {/* Ghost bg text */}
        <div
          className="absolute pointer-events-none select-none"
          style={{
            fontSize: "clamp(5rem, 12vw, 11rem)",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 900,
            color: "transparent",
            WebkitTextStroke: "1px #161616",
            letterSpacing: "-0.05em",
            top: "-2rem",
            right: "-1rem",
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          AI
        </div>
        <div className="relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#555" }}>PATH 02</div>
          <h3
            className="font-display font-black mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
          >
            AI / ML
          </h3>
          <p className="font-display text-base mb-6" style={{ color: "#444", fontWeight: 400 }}>
            From neural network basics to fine-tuning LLMs. Deploy real AI-powered apps.
          </p>
          <motion.div style={{ opacity: contentOpacity }} className="space-y-2.5 mb-8">
            {AI_TOPICS.map((t) => (
              <div key={t} className="flex items-center justify-end gap-3">
                <span className="font-mono text-xs" style={{ color: "#555" }}>{t}</span>
                <span className="font-mono text-xs" style={{ color: "#b8ff0066" }}>→</span>
              </div>
            ))}
          </motion.div>
          <motion.div style={{ opacity: contentOpacity }} className="flex justify-end">
            <Link to={createPageUrl("AITrack")}>
              <button
                className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-200"
                style={{ border: "1px solid #b8ff0033", color: "#b8ff00", background: "#b8ff0010" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#b8ff0020"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#b8ff0010"; }}
              >
                View AI Track →
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Divider({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0.08, 0.25], [0, 1]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-20"
    >
      <div className="w-full h-full" style={{ background: "linear-gradient(to bottom, transparent, #b8ff0055, #b8ff00, #b8ff0055, transparent)" }} />
    </motion.div>
  );
}

function IntroLabel({ scrollYProgress }) {
  const opacity = useTransform(scrollYProgress, [0.05, 0.18, 0.28], [0, 1, 0]);
  return (
    <motion.div
      style={{ opacity }}
      className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
    >
      <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#b8ff00" }}>§ CHOOSE YOUR PATH</div>
      <h2
        className="font-display font-black text-center"
        style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
      >
        Two tracks.<br />One platform.
      </h2>
    </motion.div>
  );
}

export default function PathSplitScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax bg glow
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.88, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} style={{ height: "400vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        {/* Parallax background glow */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 90% 60% at 50% 50%, rgba(184,255,0,0.04) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full h-full relative">
          <Divider scrollYProgress={scrollYProgress} />
          <IntroLabel scrollYProgress={scrollYProgress} />
          <LeftPanel scrollYProgress={scrollYProgress} />
          <RightPanel scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}