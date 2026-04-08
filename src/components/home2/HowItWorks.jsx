import React from "react";

const steps = [
  {
    num: "01",
    title: "Pick a project",
    desc: "Browse a library of real projects — from AI chatbots to code reviewers. Pick one that sounds interesting, not one that sounds safe.",
  },
  {
    num: "02",
    title: "Learn the AI tools you need",
    desc: "Each project teaches you exactly the tools it requires. No bloated curriculum. Just what matters for what you're building.",
  },
  {
    num: "03",
    title: "Ship something real",
    desc: "By the end, you have working code and a project you can show people. Not a certificate. Not a quiz score.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{
      borderTop: "1px solid #1a1a1a",
      borderBottom: "1px solid #1a1a1a",
      padding: "80px 2rem",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Label */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#888888",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "56px",
        }}>
          01 / 03 — the process
        </div>

        {/* Steps */}
        <div className="cf-steps" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "0",
        }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              style={{
                padding: "0 40px 0 0",
                borderRight: i < 2 ? "1px solid #1e1e1e" : "none",
                paddingRight: i < 2 ? "40px" : "0",
                paddingLeft: i > 0 ? "40px" : "0",
              }}
            >
              <div style={{
                fontFamily: "monospace",
                fontSize: "13px",
                color: "#b8ff00",
                fontWeight: 700,
                marginBottom: "16px",
                letterSpacing: "0.05em",
              }}>
                {step.num}
              </div>
              <h3 style={{
                color: "#f0f0f0",
                fontSize: "20px",
                fontWeight: 700,
                margin: "0 0 12px",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
              }}>
                {step.title}
              </h3>
              <p style={{
                color: "#c0c0c0",
                fontSize: "14px",
                lineHeight: 1.75,
                margin: 0,
              }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}