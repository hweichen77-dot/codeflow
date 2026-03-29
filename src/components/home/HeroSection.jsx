import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

const FULL_HEADLINE = "Build things\nthat matter.";
const TAGLINE = "A coding environment built for people who learn by doing — not watching.";

export default function HeroSection() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (typed.length < FULL_HEADLINE.length) {
      const delay = FULL_HEADLINE[typed.length] === "\n" ? 200 : 60;
      const t = setTimeout(() => setTyped(FULL_HEADLINE.slice(0, typed.length + 1)), delay);
      return () => clearTimeout(t);
    }
  }, [typed]);

  const lines = typed.split("\n");

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div
        className="absolute left-0 top-0 bottom-0 w-px"
        style={{ background: "linear-gradient(to bottom, transparent, #1e1e1e 20%, #1e1e1e 80%, transparent)" }}
      />

      <div
        className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-1/2 rotate-90 font-mono text-xs tracking-widest"
        style={{ color: "#2a2a2a", whiteSpace: "nowrap" }}
      >
        § 00 — INTRO
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 w-full pt-32 pb-24">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-20 items-start">

          <div>
            <div className="flex items-center gap-3 mb-12">
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: "#b8ff00" }}>
                CodeFlow
              </span>
              <span className="font-mono text-xs" style={{ color: "#2a2a2a" }}>///</span>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#444" }}>
                Learn by building
              </span>
            </div>

            <h1
              className="font-display font-black leading-none mb-10"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.02em", lineHeight: 1.05, color: "#e8e8e8" }}
            >
              {lines.map((line, i) => (
                <div key={i} className={i === 1 ? "relative" : ""}>
                  {i === 1 ? (
                    <>
                      <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>
                        {line || "\u00a0"}
                      </span>
                      {typed.length < FULL_HEADLINE.length || showCursor ? (
                        <span
                          className="cursor-blink inline-block w-0.5 h-[0.85em] ml-1 align-middle"
                          style={{ background: "#b8ff00", verticalAlign: "middle" }}
                        />
                      ) : null}
                    </>
                  ) : (
                    line || "\u00a0"
                  )}
                </div>
              ))}
            </h1>

            <p
              className="font-display text-lg leading-relaxed mb-12 max-w-sm"
              style={{ color: "#888", fontWeight: 400 }}
            >
              {TAGLINE}
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link to={createPageUrl("Projects")}>
                <button
                  className="font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-200"
                  style={{
                    background: "#b8ff00",
                    color: "#0a0a0a",
                    border: "1px solid #b8ff00",
                    fontWeight: 700,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(184,255,0,0.25)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  Start Building →
                </button>
              </Link>
              <Link to={createPageUrl("Challenges")}>
                <button
                  className="font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-200"
                  style={{
                    background: "transparent",
                    color: "#888",
                    border: "1px solid #2a2a2a",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#444";
                    e.currentTarget.style.color = "#e8e8e8";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#2a2a2a";
                    e.currentTarget.style.color = "#888";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  Try a Challenge
                </button>
              </Link>
            </div>

            <div className="flex items-center gap-8">
              {[
                { val: "1K+", label: "Learners" },
                { val: "6", label: "Projects" },
                { val: "Free", label: "Forever" },
              ].map((stat, i) => (
                <React.Fragment key={stat.label}>
                  {i > 0 && <div className="w-px h-8" style={{ background: "#1e1e1e" }} />}
                  <div>
                    <div
                      className="font-display font-black text-2xl leading-none mb-1"
                      style={{ color: "#e8e8e8" }}
                    >
                      {stat.val}
                    </div>
                    <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#444" }}>
                      {stat.label}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="relative lg:mt-8">
            <div
              className="absolute -inset-4 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse at center, rgba(184,255,0,0.04) 0%, transparent 70%)",
              }}
            />

            <div
              className="relative"
              style={{
                border: "1px solid #1e1e1e",
                background: "#0d0d0d",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3"
                style={{ borderBottom: "1px solid #1a1a1a", background: "#111" }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
                  </div>
                  <span className="font-mono text-xs" style={{ color: "#444" }}>~/codeflow/lesson_01.js</span>
                </div>
                <span
                  className="font-mono text-xs px-2 py-0.5"
                  style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                >
                  JS
                </span>
              </div>

              <div className="p-6 font-mono text-sm leading-7">
                <div>
                  <span style={{ color: "#555" }}>01</span>
                  <span style={{ color: "#555" }}> &nbsp; </span>
                  <span style={{ color: "#b8ff00" }}>const</span>
                  <span style={{ color: "#e8e8e8" }}> skills </span>
                  <span style={{ color: "#555" }}>= [</span>
                </div>
                {["'HTML & CSS'", "'JavaScript'", "'React'", "'AI Tools'"].map((s, i) => (
                  <div key={s}>
                    <span style={{ color: "#555" }}>0{i + 2}</span>
                    <span style={{ color: "#555" }}> &nbsp;&nbsp;&nbsp; </span>
                    <span style={{ color: "#b8ff0099" }}>{s}</span>
                    <span style={{ color: "#444" }}>,</span>
                  </div>
                ))}
                <div>
                  <span style={{ color: "#555" }}>06</span>
                  <span style={{ color: "#555" }}> &nbsp; </span>
                  <span style={{ color: "#555" }}>];</span>
                </div>
                <div><span style={{ color: "#333" }}>07</span></div>
                <div>
                  <span style={{ color: "#555" }}>08</span>
                  <span style={{ color: "#555" }}> &nbsp; </span>
                  <span style={{ color: "#b8ff00" }}>function</span>
                  <span style={{ color: "#e8e8e8" }}> build</span>
                  <span style={{ color: "#555" }}>(</span>
                  <span style={{ color: "#888" }}>skill</span>
                  <span style={{ color: "#555" }}>) &#123;</span>
                </div>
                <div>
                  <span style={{ color: "#555" }}>09</span>
                  <span style={{ color: "#555" }}> &nbsp;&nbsp;&nbsp; </span>
                  <span style={{ color: "#b8ff00" }}>return</span>
                  <span style={{ color: "#e8e8e8" }}> launch</span>
                  <span style={{ color: "#555" }}>(</span>
                  <span style={{ color: "#888" }}>skill</span>
                  <span style={{ color: "#555" }}>);</span>
                </div>
                <div>
                  <span style={{ color: "#555" }}>10</span>
                  <span style={{ color: "#555" }}> &nbsp; </span>
                  <span style={{ color: "#555" }}>&#125;</span>
                </div>
              </div>

              <div
                className="px-6 py-4"
                style={{ borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: "#b8ff00" }}
                  />
                  <span className="font-mono text-xs" style={{ color: "#555" }}>output</span>
                </div>
                <div className="font-mono text-xs leading-6" style={{ color: "#b8ff0099" }}>
                  <div>skill acquired: 'JavaScript'</div>
                  <div>project deployed: true</div>
                  <div style={{ color: "#444" }}>▶ next: lesson 02<span className="cursor-blink">_</span></div>
                </div>
              </div>
            </div>

            <div
              className="absolute -right-4 top-1/3 font-mono text-xs rotate-90 origin-right"
              style={{ color: "#2a2a2a", whiteSpace: "nowrap" }}
            >
              lesson_01.js — 10 lines
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "#1a1a1a" }}
      />
    </section>
  );
}