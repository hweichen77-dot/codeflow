import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function CTASection() {
  return (
    <section
      className="relative py-40 overflow-hidden"
      style={{ borderTop: "1px solid #1a1a1a", background: "#0a0a0a" }}
    >
      {/* Large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          fontSize: "clamp(8rem, 20vw, 20rem)",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px #1a1a1a",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        CODE
      </div>

      {/* Horizontal accent line */}
      <div
        className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #b8ff0020, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 text-center">
        <div
          className="font-mono text-xs tracking-widest uppercase mb-8"
          style={{ color: "#b8ff00" }}
        >
          § 03 — START NOW
        </div>

        <h2
          className="font-display font-black leading-none mb-8 mx-auto"
          style={{
            fontSize: "clamp(3rem, 7vw, 6rem)",
            letterSpacing: "-0.04em",
            color: "#e8e8e8",
            maxWidth: "14ch",
          }}
        >
          Stop watching.<br />
          <span style={{ WebkitTextStroke: "1.5px #b8ff00", color: "transparent" }}>
            Start building.
          </span>
        </h2>

        <p
          className="font-display text-lg mb-14 mx-auto"
          style={{ color: "#555", maxWidth: "40ch", fontWeight: 400 }}
        >
          Free forever. No setup. Open your first lesson in under 30 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{
                background: "#b8ff00",
                color: "#0a0a0a",
                border: "1px solid #b8ff00",
                fontWeight: 700,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(184,255,0,0.3)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              Browse Projects →
            </button>
          </Link>
          <Link to={createPageUrl("Challenges")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{
                background: "transparent",
                color: "#555",
                border: "1px solid #1e1e1e",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#333";
                e.currentTarget.style.color = "#e8e8e8";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#1e1e1e";
                e.currentTarget.style.color = "#555";
                e.currentTarget.style.transform = "";
              }}
            >
              Daily Challenges
            </button>
          </Link>
        </div>

        {/* Footer note */}
        <div
          className="mt-20 font-mono text-xs tracking-widest uppercase"
          style={{ color: "#222" }}
        >
          © 2026 CodeFlow &nbsp;·&nbsp; Learn to build &nbsp;·&nbsp; Free forever
        </div>
      </div>
    </section>
  );
}