import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";

export default function CTASection() {
  return (
    <section
      className="relative py-40 overflow-hidden"
      style={{ borderTop: "1px solid #262219", background: "#15130E" }}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        style={{
          fontSize: "clamp(8rem, 20vw, 20rem)",
          fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "1px #262219",
          letterSpacing: "-0.05em",
          lineHeight: 1,
        }}
      >
        CODE
      </div>

      <div
        className="absolute left-16 right-16 top-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, #E8A33C20, transparent)" }}
      />

      <div className="relative max-w-7xl mx-auto px-8 lg:px-16 text-center">
        <div
          className="font-mono text-xs tracking-widest uppercase mb-8"
          style={{ color: "#E8A33C" }}
        >
          § 03 — START NOW
        </div>

        <h2
          className="font-display font-black leading-none mb-8 mx-auto"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            letterSpacing: "-0.02em",
            color: "#ECE7DC",
            maxWidth: "14ch",
          }}
        >
          Stop watching.<br />
          <span style={{ WebkitTextStroke: "1.5px #E8A33C", color: "transparent" }}>
            Start building.
          </span>
        </h2>

        <p
          className="font-display text-lg mb-14 mx-auto"
          style={{ color: "#BBB3A4", maxWidth: "40ch", fontWeight: 400 }}
        >
          Free forever. No setup. Open your first lesson in under 30 seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-sm tracking-widest uppercase px-10 py-5 transition-all duration-200"
              style={{
                background: "#E8A33C",
                color: "#15130E",
                border: "1px solid #E8A33C",
                fontWeight: 700,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(232,163,60,0.3)";
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
                color: "#BBB3A4",
                border: "1px solid #262219",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#3A352D";
                e.currentTarget.style.color = "#ECE7DC";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#262219";
                e.currentTarget.style.color = "#BBB3A4";
                e.currentTarget.style.transform = "";
              }}
            >
              Daily Challenges
            </button>
          </Link>
        </div>

        <div
          className="mt-20 font-mono text-xs tracking-widest"
          style={{ color: "#ECE7DC" }}
        >
          © 2026 codeflow &nbsp;·&nbsp; crafted with insomnia and strong opinions
          <span
            className="ml-4 cursor-pointer select-none transition-all duration-500"
            style={{ color: "#ECE7DC" }}
            title="you found it"
            onMouseEnter={e => {
              e.currentTarget.style.color = "#E8A33C";
              e.currentTarget.style.letterSpacing = "0.4em";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#ECE7DC";
              e.currentTarget.style.letterSpacing = "";
            }}
          >▸</span>
        </div>
      </div>
    </section>
  );
}