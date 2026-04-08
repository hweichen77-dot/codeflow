import React from "react";

export default function FinalCTA() {
  return (
    <section style={{
      borderTop: "2px solid #f59e0b",
      background: "#0d0d0d",
      padding: "100px 2rem",
      textAlign: "center",
    }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 800,
          color: "#f0f0f0",
          letterSpacing: "-0.025em",
          lineHeight: 1.2,
          margin: "0 0 20px",
        }}>
          Ready to actually learn AI?
        </h2>
        <p style={{
          color: "#c0c0c0",
          fontSize: "17px",
          lineHeight: 1.7,
          margin: "0 0 40px",
        }}>
          Start with a free project. No setup, no friction.
        </p>
        <button style={{
          background: "#f59e0b",
          color: "#0a0a0a",
          border: "none",
          borderRadius: "8px",
          padding: "16px 36px",
          fontSize: "16px",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#fbbf24"}
          onMouseLeave={e => e.currentTarget.style.background = "#f59e0b"}
        >
          Build your first project
        </button>
      </div>
    </section>
  );
}