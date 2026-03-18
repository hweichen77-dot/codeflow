import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const MONOGRAMS = [
  { initials: "SC", bg: "#221a3d" },
  { initials: "AJ", bg: "#1a3226" },
  { initials: "MR", bg: "#3a1e1e" },
];

const CODE_LINES = [
  { ln: 1, tokens: [{ c: "text-purple-400", t: "const " }, { c: "text-[#7dd3fc]", t: "skills" }, { c: "text-gray-500", t: " = [" }] },
  { ln: 2, tokens: [{ c: "text-gray-700 pl-8", t: "" }, { c: "text-green-400", t: '"HTML"' }, { c: "text-gray-600", t: ", " }, { c: "text-green-400", t: '"CSS"' }, { c: "text-gray-600", t: "," }] },
  { ln: 3, tokens: [{ c: "text-gray-700 pl-8", t: "" }, { c: "text-green-400", t: '"JavaScript"' }, { c: "text-gray-600", t: ", " }, { c: "text-green-400", t: '"React"' }] },
  { ln: 4, tokens: [{ c: "text-gray-500", t: "];" }] },
  { ln: 5, tokens: [] },
  { ln: 6, tokens: [{ c: "text-purple-400", t: "function " }, { c: "text-yellow-300", t: "buildProject" }, { c: "text-gray-500", t: "(" }, { c: "text-orange-300", t: "name" }, { c: "text-gray-500", t: ") {" }] },
  { ln: 7, tokens: [{ c: "text-purple-400 pl-8", t: "return " }, { c: "text-gray-500", t: "{" }] },
  { ln: 8, tokens: [{ c: "text-[#7dd3fc] pl-16", t: "name" }, { c: "text-gray-600", t: "," }] },
  { ln: 9, tokens: [{ c: "text-[#7dd3fc] pl-16", t: "skills" }, { c: "text-gray-600", t: "," }] },
  { ln: 10, tokens: [{ c: "text-[#7dd3fc] pl-16", t: "deployed" }, { c: "text-gray-500", t: ": " }, { c: "text-purple-400", t: "true" }] },
  { ln: 11, tokens: [{ c: "text-gray-500 pl-8", t: "}" }] },
  { ln: 12, tokens: [{ c: "text-gray-500", t: "}" }] },
  { ln: 13, tokens: [] },
  { ln: 14, tokens: [{ c: "text-[#7dd3fc]", t: "buildProject" }, { c: "text-gray-500", t: "(" }, { c: "text-green-400", t: '"My Portfolio"' }, { c: "text-gray-500", t: ");" }] },
];

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const fullText = "CodeFlow learner";

  useEffect(() => {
    if (typedText.length < fullText.length) {
      const t = setTimeout(() => setTypedText(fullText.slice(0, typedText.length + 1)), 80);
      return () => clearTimeout(t);
    }
  }, [typedText]);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial purple ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 65% 50%, rgba(91,79,233,0.09) 0%, transparent 70%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9]" />
              <span className="text-xs font-medium text-gray-400 tracking-widest uppercase">
                Free forever · No credit card
              </span>
            </div>

            <h1 className="font-black leading-[0.93] tracking-[-0.03em] mb-8">
              <span className="text-white block" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}>
                Don't just
              </span>
              <span className="text-white block" style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)" }}>
                watch.
              </span>
              <span
                className="block"
                style={{
                  fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
                  WebkitTextStroke: "2px #5B4FE9",
                  color: "transparent",
                }}
              >
                Build.
              </span>
            </h1>

            <p className="text-[1.05rem] text-gray-300 font-light leading-relaxed mb-10 max-w-sm">
              Real coding skills come from building real stuff. Jump into hands-on projects, not endless videos.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-12">
              <Link to={createPageUrl("Projects")}>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#5B4FE9] text-white text-sm font-semibold rounded-[4px] border border-[#7066f5]/40 hover:bg-[#4d42d4] transition-colors">
                  Start Building
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to={createPageUrl("Challenges")}>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 text-gray-400 text-sm font-medium rounded-[4px] border border-white/10 hover:border-white/20 hover:text-gray-200 transition-colors">
                  Quick Challenge
                </button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {MONOGRAMS.map(({ initials, bg }) => (
                    <div
                      key={initials}
                      className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: bg }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-400">1,000+ learners</span>
              </div>

              <div className="w-px h-4 bg-white/10" />

              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="12" height="12" viewBox="0 0 14 14" fill="none">
                      <path
                        d="M7 1L8.8 5.2L13.4 5.6L10.1 8.5L11.1 13L7 10.5L2.9 13L3.9 8.5L0.6 5.6L5.2 5.2L7 1Z"
                        fill="#5B4FE9"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-400">
                  4.9 ·{" "}
                  <span className="italic text-gray-400">"Best way to actually learn to code"</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right: code editor */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative lg:mr-[-3rem] xl:mr-[-6rem]"
          >
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ boxShadow: "0 0 80px 16px rgba(91,79,233,0.18)" }}
            />

            <div className="relative bg-[#0c0c13] rounded-xl border border-white/[0.07] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-[#0f0f18] border-b border-white/[0.05]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                  <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                </div>
                <span className="text-xs text-gray-600 font-mono">project.js</span>
                <div className="w-16" />
              </div>

              {/* Code lines */}
              <div className="p-5 font-mono text-[13px] leading-[1.75]">
                {CODE_LINES.map(({ ln, tokens }) => (
                  <div key={ln} className="flex gap-4">
                    <span className="select-none text-gray-700 text-[11px] w-4 flex-shrink-0 leading-[1.75]">
                      {ln}
                    </span>
                    <span className="leading-[1.75]">
                      {tokens.length === 0 ? (
                        "\u00a0"
                      ) : (
                        tokens.map((tok, j) => (
                          <span key={j} className={tok.c}>
                            {tok.t}
                          </span>
                        ))
                      )}
                    </span>
                  </div>
                ))}

                {/* Output */}
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] text-gray-600 font-mono">Output</span>
                  </div>
                  <div className="font-mono text-xs text-gray-500 leading-[1.7]">
                    <div className="text-gray-500">{"{"}</div>
                    <div className="pl-4">
                      <span className="text-gray-600">name: </span>
                      <span className="text-green-400">"My Portfolio"</span>
                      <span className="text-gray-700">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-gray-600">skills: </span>
                      <span className="text-green-400">["HTML", "CSS", ...]</span>
                      <span className="text-gray-700">,</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-gray-600">deployed: </span>
                      <span className="text-purple-400">true</span>
                    </div>
                    <div className="text-gray-500">{"}"}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}