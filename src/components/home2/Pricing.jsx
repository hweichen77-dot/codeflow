import React from "react";

const freeFeatures = [
  "3 full projects included",
  "AI tutor (limited questions)",
  "Community access",
  "No time limits",
];

const proFeatures = [
  "Everything in free",
  "Unlimited projects",
  "Unlimited AI tutor",
  "Priority support",
  "Project portfolio page",
  "New projects monthly",
];

function CheckIcon() {
  return <span style={{ color: "#b8ff00", fontWeight: 700, marginRight: "10px" }}>✓</span>;
}

export default function Pricing() {
  return (
    <section id="pricing" style={{
      borderTop: "1px solid #1a1a1a",
      padding: "96px 2rem",
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Label */}
        <div style={{
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#525252",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "48px",
          textAlign: "center",
        }}>
          Simple pricing. No tricks.
        </div>

        <div className="cf-pricing" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

          {/* Free */}
          <div style={{
            background: "#111111",
            border: "1px solid #262626",
            borderRadius: "12px",
            padding: "36px",
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#525252", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              Free
            </div>
            <div style={{ color: "#f0f0f0", fontSize: "36px", fontWeight: 800, fontFamily: "Georgia, serif", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              $0
            </div>
            <div style={{ color: "#525252", fontSize: "13px", marginBottom: "32px", fontFamily: "monospace" }}>/ month</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "36px" }}>
              {freeFeatures.map(f => (
                <div key={f} style={{ color: "#a3a3a3", fontSize: "14px" }}>
                  <CheckIcon />{f}
                </div>
              ))}
            </div>
            <button style={{
              width: "100%",
              background: "transparent",
              color: "#f0f0f0",
              border: "1px solid #404040",
              borderRadius: "8px",
              padding: "13px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#666"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#404040"}
            >
              Start free
            </button>
          </div>

          {/* Pro */}
          <div style={{
            background: "#111111",
            border: "1px solid #b8ff00",
            borderRadius: "12px",
            padding: "36px",
            position: "relative",
          }}>
            <div style={{
              position: "absolute",
              top: "-12px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#b8ff00",
              color: "#0a0a0a",
              fontFamily: "monospace",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "4px 12px",
              borderRadius: "999px",
            }}>
              Most popular
            </div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#b8ff00", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>
              Pro
            </div>
            <div style={{ color: "#f0f0f0", fontSize: "36px", fontWeight: 800, fontFamily: "Georgia, serif", letterSpacing: "-0.03em", marginBottom: "6px" }}>
              $12
            </div>
            <div style={{ color: "#525252", fontSize: "13px", marginBottom: "32px", fontFamily: "monospace" }}>/ month</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "13px", marginBottom: "36px" }}>
              {proFeatures.map(f => (
                <div key={f} style={{ color: "#a3a3a3", fontSize: "14px" }}>
                  <CheckIcon />{f}
                </div>
              ))}
            </div>
            <button style={{
              width: "100%",
              background: "#b8ff00",
              color: "#0a0a0a",
              border: "none",
              borderRadius: "8px",
              padding: "13px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "#caff35"}
              onMouseLeave={e => e.currentTarget.style.background = "#b8ff00"}
            >
              Go Pro
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}