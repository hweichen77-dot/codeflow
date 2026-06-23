import React from "react";
import { useNavigate } from "react-router-dom";

const display = "'Bricolage Grotesque', system-ui, sans-serif";
const body = "'Hanken Grotesk', system-ui, sans-serif";
const mono = "'Spline Sans Mono', monospace";

const tiers = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    blurb: "Enough to ship something real and decide it's for you.",
    features: ["3 full projects", "AI tutor (limited)", "Community access", "No time limits"],
    cta: "Start free",
    primary: false,
  },
  {
    name: "Pro",
    price: "$12",
    cadence: "/ month",
    blurb: "For when you want the whole library and an unlimited tutor.",
    features: ["Everything in Free", "Unlimited projects", "Unlimited AI tutor", "Portfolio page", "New projects monthly"],
    cta: "Go Pro",
    primary: true,
  },
];

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <section id="pricing" style={{ borderBottom: "1px solid #221F18" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "96px 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px" }}>
          <span style={{
            fontFamily: mono,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "#D4882E",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>
            06 — Honest pricing
          </span>
        </div>

        <div className="cf-pricing" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
          {tiers.map((t, i) => (
            <div
              key={t.name}
              style={{
                padding: "8px 48px",
                paddingLeft: i === 0 ? "0" : "48px",
                paddingRight: i === 0 ? "48px" : "0",
                borderRight: i === 0 ? "1px solid #221F18" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "8px" }}>
                <h3 style={{ fontFamily: display, fontWeight: 740, fontSize: "1.5rem", letterSpacing: "-0.02em", color: "#ECE7DC", margin: 0 }}>
                  {t.name}
                </h3>
                {t.primary && (
                  <span style={{ fontFamily: mono, fontSize: "0.68rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#E8A33C" }}>
                    Most popular
                  </span>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontFamily: display, fontWeight: 760, fontSize: "2.6rem", letterSpacing: "-0.03em", color: t.primary ? "#E8A33C" : "#ECE7DC", lineHeight: 1 }}>
                  {t.price}
                </span>
                <span style={{ fontFamily: mono, fontSize: "0.8rem", color: "#756C5C" }}>{t.cadence}</span>
              </div>

              <p style={{ fontFamily: body, color: "#A39B8C", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 28px", maxWidth: "40ch" }}>
                {t.blurb}
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {t.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "baseline", gap: "12px", fontFamily: body, color: "#ECE7DC", fontSize: "0.95rem" }}>
                    <span style={{ fontFamily: mono, color: "#E8A33C", fontSize: "0.8rem" }}>§</span>
                    {f}
                  </div>
                ))}
              </div>

              <button
                style={t.primary ? {
                  fontFamily: body, fontWeight: 600, fontSize: "0.95rem", background: "#E8A33C", color: "#15130E",
                  border: "1px solid transparent", borderRadius: "2px", padding: "13px 26px", cursor: "pointer", transition: "transform .15s",
                } : {
                  fontFamily: body, fontWeight: 600, fontSize: "0.95rem", background: "transparent", color: "#ECE7DC",
                  border: "1px solid #34302A", borderRadius: "2px", padding: "13px 26px", cursor: "pointer", transition: "border-color .15s",
                }}
                onClick={() => navigate("/login")}
                onMouseEnter={e => {
                  if (t.primary) e.currentTarget.style.transform = "translateY(-2px)";
                  else e.currentTarget.style.borderColor = "#756C5C";
                }}
                onMouseLeave={e => {
                  if (t.primary) e.currentTarget.style.transform = "none";
                  else e.currentTarget.style.borderColor = "#34302A";
                }}
              >
                {t.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
