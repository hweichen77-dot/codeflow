import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const STEPS = [
  {
    label: "STEP 01 — CONCEPT",
    title: "Understand the theory",
    body: "Every lesson starts with clear explanations. No jargon. No assumptions.",
    code: `# What is a neural network?
# A function that learns from data

def predict(inputs, weights):
    return sum(i * w for i, w in
               zip(inputs, weights))`,
    outputLabel: null,
  },
  {
    label: "STEP 02 — CODE",
    title: "Write real code",
    body: "Starter code, inline hints, AI tutor available. The editor runs in the browser.",
    code: `import openai

client = openai.OpenAI()

response = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[{"role": "user",
             "content": "Hello!"}]
)
print(response.choices[0].message.content)`,
    outputLabel: "OUTPUT",
    output: `> "Hello! How can I help you today?"`,
  },
  {
    label: "STEP 03 — RESULT",
    title: "See the output",
    body: "Run code, see results instantly. AI grades your solution and gives feedback.",
    code: `✓ Test 1 passed — API returns string
✓ Test 2 passed — message not empty
✓ Test 3 passed — response < 1s

Score: 100/100
XP earned: +25`,
    outputLabel: "LESSON COMPLETE",
    isResult: true,
  },
];

function StepIndicator({ index, step, scrollYProgress }) {
  const start = index * 0.25;
  const bg = useTransform(scrollYProgress, [start + 0.02, start + 0.12], ["#1e1e1e", "#b8ff00"]);
  const color = useTransform(scrollYProgress, [start + 0.02, start + 0.12], ["#333", "#0a0a0a"]);
  return (
    <div className="flex items-center gap-2">
      <motion.div
        style={{ background: bg, color }}
        className="w-6 h-6 flex items-center justify-center font-mono text-xs font-bold"
      >
        {index + 1}
      </motion.div>
      <span className="font-mono text-xs hidden sm:block" style={{ color: "#2a2a2a" }}>
        {step.label.split("—")[1]?.trim()}
      </span>
    </div>
  );
}

function StepCard({ index, step, scrollYProgress }) {
  const isLast = index === STEPS.length - 1;
  const inPoint = index * 0.25;
  const peakStart = inPoint + 0.08;
  const peakEnd = inPoint + 0.28;
  const outPoint = inPoint + 0.38;

  const opacity = useTransform(
    scrollYProgress,
    isLast ? [inPoint, peakStart, 0.95] : [inPoint, peakStart, peakEnd, outPoint],
    isLast ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [inPoint, peakStart], [32, 0]);

  return (
    <motion.div
      style={{ opacity, y, position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none" }}
    >
      <div className="p-6 md:p-8">
        <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#b8ff00" }}>
          {step.label}
        </div>
        <div className="mb-6">
          <h3 className="font-display font-bold text-2xl mb-2" style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}>
            {step.title}
          </h3>
          <p className="font-display text-base" style={{ color: "#555", fontWeight: 400 }}>
            {step.body}
          </p>
        </div>
        <div className="p-5 mb-4" style={{ background: "#080808", border: "1px solid #1a1a1a" }}>
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto" style={{ color: step.isResult ? "#b8ff00" : "#888" }}>
            {step.code}
          </pre>
        </div>
        {step.outputLabel && (
          <div className="flex items-center gap-3 px-3 py-2" style={{ border: "1px solid #1e1e1e" }}>
            <span
              className="font-mono text-xs tracking-widest uppercase px-2 py-0.5"
              style={{
                color: step.isResult ? "#b8ff00" : "#888",
                border: `1px solid ${step.isResult ? "#b8ff0033" : "#2a2a2a"}`,
                background: step.isResult ? "#b8ff0010" : "transparent",
              }}
            >
              {step.outputLabel}
            </span>
            {step.output && (
              <span className="font-mono text-xs" style={{ color: "#555" }}>{step.output}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function LearningScene() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const sceneOpacity = useTransform(scrollYProgress, [0, 0.04, 0.9, 1], [0, 1, 1, 0]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);

  // Orbiting dots
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div ref={ref} style={{ height: "600vh" }}>
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center"
        style={{ background: "#080808", paddingTop: "8vh" }}
      >
        {/* Parallax bg grid */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184,255,0,0.025) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184,255,0,0.025) 1px, transparent 1px)
              `,
              backgroundSize: "100px 100px",
            }}
          />
        </motion.div>

        {/* Slower glow layer */}
        <motion.div style={{ y: bgY2 }} className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,212,255,0.04) 0%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Orbiting accent rings */}
        <motion.div
          style={{ rotate: orbitRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[600px] h-[600px] rounded-full"
            style={{ border: "1px solid rgba(184,255,0,0.04)" }}
          />
        </motion.div>
        <motion.div
          style={{ rotate: orbitRotate }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="w-[900px] h-[900px] rounded-full"
            style={{ border: "1px solid rgba(0,212,255,0.025)" }}
          />
          {/* dot on ring */}
          <div
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: "#b8ff00", top: "calc(50% - 300px)", left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 8px #b8ff00" }}
          />
        </motion.div>

        {/* Scan lines */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          {[30, 60, 75].map((pct, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-px"
              style={{ top: `${pct}%`, background: `linear-gradient(90deg, transparent, rgba(184,255,0,0.04), transparent)` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 4 + i * 0.8, repeat: Infinity, delay: i * 0.6 }}
            />
          ))}
        </motion.div>

        <motion.div style={{ opacity: sceneOpacity }} className="w-full max-w-5xl mx-auto px-6 relative z-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-10 text-center" style={{ color: "#2a2a2a" }}>
            § THE LEARNING EXPERIENCE
          </div>

          <div className="flex items-center justify-center gap-10 mb-12">
            {STEPS.map((s, i) => (
              <StepIndicator key={i} index={i} step={s} scrollYProgress={scrollYProgress} />
            ))}
          </div>

          <div
            className="relative mx-auto"
            style={{ border: "1px solid #1e1e1e", background: "#0d0d0d", maxWidth: "700px", boxShadow: "0 40px 100px rgba(0,0,0,0.7)" }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#b8ff00" }} />
              <span className="font-mono text-xs ml-4" style={{ color: "#2a2a2a" }}>lesson_01.py</span>
            </div>
            <div className="relative" style={{ minHeight: "340px" }}>
              {STEPS.map((s, i) => (
                <StepCard key={i} index={i} step={s} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}