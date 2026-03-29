import React, { useState } from "react";

const PATHS = [
  {
    level: "00",
    label: "BEGINNER",
    title: "From nothing to functional",
    desc: "HTML, CSS, and vanilla JavaScript. Build a portfolio site and a working calculator from scratch.",
    projects: ["Portfolio Site", "JavaScript Calculator", "Weather App"],
    time: "~4 weeks",
    accent: "#b8ff00",
  },
  {
    level: "01",
    label: "INTERMEDIATE",
    title: "Components and state",
    desc: "React fundamentals, hooks, and state management. Build a full Todo app with persistent storage.",
    projects: ["React Todo App", "CSS Animation Lab"],
    time: "~3 weeks",
    accent: "#b8ff00",
  },
  {
    level: "02",
    label: "ADVANCED",
    title: "Production-quality code",
    desc: "Async JavaScript, APIs, and real-world patterns. Connect to live data sources and deploy.",
    projects: ["Quiz Platform", "API-powered app"],
    time: "~4 weeks",
    accent: "#b8ff00",
  },
];

export default function StatsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative py-32" style={{ background: "#080808", borderTop: "1px solid #1a1a1a" }}>
      <div className="max-w-7xl mx-auto px-8 lg:px-16">

        <div className="flex items-start gap-8 mb-20">
          <div
            className="font-mono text-xs tracking-widest uppercase pt-1 flex-shrink-0"
            style={{ color: "#2a2a2a", width: "4rem" }}
          >
            § 02
          </div>
          <div>
            <h2
              className="font-display font-black leading-none mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
            >
              Learning paths
            </h2>
            <p className="font-display text-base" style={{ color: "#555" }}>
              Pick your level. Every path ends with something deployed.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-0" style={{ border: "1px solid #1a1a1a" }}>
          <div style={{ borderRight: "1px solid #1a1a1a" }}>
            {PATHS.map((path, i) => (
              <button
                key={path.level}
                onClick={() => setActive(i)}
                className="w-full text-left p-8 transition-all duration-200 relative group"
                style={{
                  background: active === i ? "#0d0d0d" : "transparent",
                  borderBottom: i < PATHS.length - 1 ? "1px solid #1a1a1a" : "none",
                }}
              >
                {active === i && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-px"
                    style={{ background: "#b8ff00" }}
                  />
                )}

                <div className="flex items-start gap-5">
                  <span
                    className="font-mono font-bold text-4xl leading-none flex-shrink-0"
                    style={{
                      color: active === i ? "#1e1e1e" : "#141414",
                      letterSpacing: "-0.05em",
                    }}
                  >
                    {path.level}
                  </span>
                  <div>
                    <div
                      className="font-mono text-xs tracking-widest uppercase mb-1"
                      style={{ color: active === i ? "#b8ff00" : "#333" }}
                    >
                      {path.label}
                    </div>
                    <div
                      className="font-display font-bold text-lg leading-snug"
                      style={{ color: active === i ? "#e8e8e8" : "#3a3a3a", letterSpacing: "-0.02em" }}
                    >
                      {path.title}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-10" style={{ background: "#0d0d0d" }}>
            <div
              className="font-mono text-xs tracking-widest uppercase mb-6"
              style={{ color: "#b8ff00" }}
            >
              PATH {PATHS[active].level} — {PATHS[active].label}
            </div>

            <p
              className="font-display text-lg leading-relaxed mb-10"
              style={{ color: "#888", fontWeight: 400 }}
            >
              {PATHS[active].desc}
            </p>

            <div className="mb-8">
              <div
                className="font-mono text-xs tracking-widest uppercase mb-4"
                style={{ color: "#333" }}
              >
                INCLUDED PROJECTS
              </div>
              <div className="space-y-2">
                {PATHS[active].projects.map((project, i) => (
                  <div key={project} className="flex items-center gap-4">
                    <span className="font-mono text-xs" style={{ color: "#444" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-px" style={{ background: "#1e1e1e" }} />
                    <span
                      className="font-display text-sm font-medium"
                      style={{ color: "#e8e8e8" }}
                    >
                      {project}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="inline-flex items-center gap-3 px-4 py-2"
              style={{ border: "1px solid #1e1e1e", background: "#0a0a0a" }}
            >
              <span className="font-mono text-xs" style={{ color: "#444" }}>EST. DURATION</span>
              <span className="font-mono text-sm font-bold" style={{ color: "#b8ff00" }}>
                {PATHS[active].time}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}