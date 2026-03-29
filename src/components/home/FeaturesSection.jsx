import React from "react";

const FEATURES = [
  {
    num: "01",
    title: "Learn by building real projects",
    body: "No passive videos. Every lesson is a hands-on coding module with a real codebase attached. You ship something every session.",
    tag: "PROJECTS",
  },
  {
    num: "02",
    title: "Instant feedback on every line",
    body: "Run your code directly in the browser. See output, catch errors, understand what happened — without leaving the lesson.",
    tag: "EXECUTION",
  },
  {
    num: "03",
    title: "An AI tutor that actually explains",
    body: "Ask questions in plain English. Get precise answers in context of the exact lesson you're on — not generic documentation.",
    tag: "AI TOOLS",
  },
  {
    num: "04",
    title: "From zero to deployed in weeks",
    body: "A structured path from HTML basics to React apps, guided by actual milestones — not just a list of topics.",
    tag: "CURRICULUM",
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-32" style={{ background: "#0a0a0a" }}>
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: "#1a1a1a" }}
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <div className="flex items-start gap-8 mb-20">
          <div
            className="font-mono text-xs tracking-widest uppercase pt-1 flex-shrink-0"
            style={{ color: "#2a2a2a", width: "4rem" }}
          >
            § 01
          </div>
          <div>
            <h2
              className="font-display font-black leading-none mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
            >
              How it works
            </h2>
            <p className="font-display text-base" style={{ color: "#555" }}>
              Four principles. One outcome: you can actually code.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-0">
          {FEATURES.map((f, i) => (
            <div
              key={f.num}
              className="relative p-10 group transition-colors duration-300"
              style={{
                borderTop: "1px solid #1a1a1a",
                borderRight: i % 2 === 0 ? "1px solid #1a1a1a" : "none",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#0d0d0d"}
              onMouseLeave={e => e.currentTarget.style.background = ""}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-px transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: "#b8ff00" }}
              />

              <div className="flex items-start gap-6">
                <div
                  className="font-mono font-bold flex-shrink-0"
                  style={{ fontSize: "3rem", lineHeight: 1, color: "#1e1e1e", letterSpacing: "-0.05em" }}
                >
                  {f.num}
                </div>

                <div>
                  <div
                    className="font-mono text-xs tracking-widest uppercase mb-4"
                    style={{ color: "#b8ff00" }}
                  >
                    {f.tag}
                  </div>
                  <h3
                    className="font-display font-bold text-xl mb-3 leading-snug"
                    style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="font-display text-sm leading-relaxed"
                    style={{ color: "#666", fontWeight: 400 }}
                  >
                    {f.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-0" style={{ borderTop: "1px solid #1a1a1a" }} />
      </div>
    </section>
  );
}