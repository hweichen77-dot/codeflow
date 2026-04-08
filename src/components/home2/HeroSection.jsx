import React from "react";

export default function HeroSection() {
  return (
    <section style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "100px 2rem 96px",
      textAlign: "center",
    }}>
      {/* Label */}
      <div style={{
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#b8ff00",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginBottom: "32px",
        fontWeight: 500,
      }}>
        // learn ai. build real things.
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "clamp(2.8rem, 6vw, 5rem)",
        fontWeight: 800,
        lineHeight: 1.12,
        letterSpacing: "-0.025em",
        color: "#f0f0f0",
        margin: "0 0 28px",
      }}>
        The fastest way to go from{" "}
        <span style={{ color: "#b8ff00" }}>curious</span> to{" "}
        <span style={{ color: "#b8ff00" }}>capable</span>.
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: "18px",
        color: "#c0c0c0",
        lineHeight: 1.7,
        maxWidth: "560px",
        margin: "0 auto 44px",
        fontWeight: 400,
      }}>
        CodeFlow teaches you how to use AI tools and build actual projects —
        not just watch videos.
      </p>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginBottom: "20px" }}>
        <button style={{
          background: "#b8ff00",
          color: "#0a0a0a",
          border: "none",
          borderRadius: "8px",
          padding: "14px 28px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#caff35"}
          onMouseLeave={e => e.currentTarget.style.background = "#b8ff00"}
        >
          Start for free
        </button>
        <button style={{
          background: "transparent",
          color: "#f0f0f0",
          border: "1px solid #404040",
          borderRadius: "8px",
          padding: "14px 28px",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#666"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#404040"}
        >
          See how it works
        </button>
      </div>

      <p style={{ fontSize: "13px", color: "#777777", fontWeight: 400 }}>
        No credit card required
      </p>
    </section>
  );
}