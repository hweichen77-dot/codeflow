import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const QUOTES = [
  {
    text: "I tried three other platforms before this. None of them had me writing actual API calls on day two. This is different.",
    name: "Alex R.",
    role: "Career changer → junior dev",
    accent: "#b8ff00",
  },
  {
    text: "The AI track is what I was looking for. Every other resource was either too basic or dumped theory without code. Here it's hands-on from the first lesson.",
    name: "Sarah K.",
    role: "Data analyst learning ML",
    accent: "#00d4ff",
  },
  {
    text: "Built my first RAG system in week three. Put it in my portfolio. Got a callback a week later. Not saying correlation is causation, but.",
    name: "Dami O.",
    role: "CS student, intern at startup",
    accent: "#b8ff00",
  },
];

const MILESTONES = [
  { step: "DAY 1", text: "Write your first function and run it in the browser" },
  { step: "WEEK 1", text: "Build a working webpage from scratch, no templates" },
  { step: "WEEK 3", text: "Ship a React app with real data from an API" },
  { step: "MONTH 2", text: "Deploy an AI-powered app with your own prompting logic" },
];

function QuoteCard({ quote, index, scrollYProgress }) {
  const isLast = index === QUOTES.length - 1;
  const inPoint = index * 0.27;
  const peakStart = inPoint + 0.08;
  const peakEnd = inPoint + 0.3;
  const outPoint = inPoint + 0.4;

  const opacity = useTransform(
    scrollYProgress,
    isLast ? [inPoint, peakStart, 0.95] : [inPoint, peakStart, peakEnd, outPoint],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [inPoint, peakStart], [40, 0]);

  return (
    <motion.div style={{ opacity, y, position: "absolute", top: 0, left: 0, right: 0 }}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Opening quote mark */}
        <div
          className="font-display font-black mb-6 leading-none"
          style={{ fontSize: "6rem", color: quote.accent, opacity: 0.15, lineHeight: 1 }}
        >
          "
        </div>
        <blockquote
          className="font-display font-medium text-xl md:text-2xl leading-relaxed mb-8"
          style={{ color: "#ccc", letterSpacing: "-0.01em" }}
        >
          {quote.text}
        </blockquote>
        <div className="flex items-center gap-4">
          <div
            className="w-8 h-8 flex items-center justify-center font-mono text-xs font-bold"
            style={{ background: quote.accent, color: "#0a0a0a" }}
          >
            {quote.name[0]}
          </div>
          <div>
            <div className="font-display font-bold text-sm" style={{ color: "#e8e8e8" }}>{quote.name}</div>
            <div className="font-mono text-xs" style={{ color: "#444" }}>{quote.role}</div>
          </div>
          <div className="ml-auto">
            <div className="flex gap-1.5">
              {QUOTES.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{ background: i === index ? quote.accent : "#1e1e1e" }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SocialProofScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.9, 1], [0, 1, 1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "42%"]);

  // Ticker scrolls horizontally driven by scroll
  const tickerX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  const milestonesOpacity = useTransform(scrollYProgress, [0.75, 0.88], [0, 1]);

  return (
    <div ref={ref} style={{ height: "650vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ background: "#0a0a0a", paddingTop: "8vh" }}
      >
        {/* Parallax noise/grain bg */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(184,255,0,0.03) 0%, transparent 60%)",
            }}
          />
        </motion.div>

        <motion.div style={{ y: bgY2 }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 60% 50% at 70% 70%, rgba(0,212,255,0.03) 0%, transparent 60%)",
            }}
          />
          {/* Horizontal lines */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)`,
              backgroundSize: "100% 60px",
            }}
          />
        </motion.div>

        {/* Animated scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-px opacity-10"
            style={{ background: "linear-gradient(90deg, transparent, #b8ff00 40%, #b8ff00 60%, transparent)" }}
          />
        </div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full max-w-5xl mx-auto relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-16 text-center" style={{ color: "#2a2a2a" }}>
            § FROM THE COMMUNITY
          </div>

          {/* Quotes */}
          <div className="relative mb-24" style={{ minHeight: "260px" }}>
            {QUOTES.map((q, i) => (
              <QuoteCard key={i} quote={q} index={i} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          {/* Milestone timeline — fades in near end of scene */}
          <motion.div style={{ opacity: milestonesOpacity }}>
            <div className="font-mono text-xs tracking-widest uppercase mb-8 text-center" style={{ color: "#2a2a2a" }}>
              YOUR TIMELINE
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0" style={{ border: "1px solid #1a1a1a" }}>
              {MILESTONES.map((m, i) => (
                <div
                  key={m.step}
                  className="p-6 relative"
                  style={{ borderRight: i < 3 ? "1px solid #1a1a1a" : "none" }}
                >
                  <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#b8ff00" }}>
                    {m.step}
                  </div>
                  <p className="font-display text-sm leading-relaxed" style={{ color: "#555", fontWeight: 400 }}>
                    {m.text}
                  </p>
                  {/* connector dot */}
                  <div
                    className="absolute top-1/2 -right-1 w-2 h-2 -translate-y-1/2"
                    style={{ background: i < 3 ? "#b8ff00" : "transparent", zIndex: 2 }}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll-driven bottom ticker */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ borderTop: "1px solid #111" }}>
          <motion.div style={{ x: tickerX }} className="flex whitespace-nowrap py-3">
            {[...Array(4)].map((_, ri) => (
              <span key={ri} className="font-mono text-xs tracking-widest uppercase mr-16" style={{ color: "#1e1e1e" }}>
                STRUCTURE · PROJECTS · AI TRACK · CODE · BUILD · DEPLOY · LEARN · SHIP · STRUCTURE · PROJECTS · AI TRACK · CODE · BUILD · DEPLOY · LEARN · SHIP &nbsp;
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}