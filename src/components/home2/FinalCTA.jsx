import React from "react";
import { useNavigate } from "react-router-dom";

const display = "'Bricolage Grotesque', system-ui, sans-serif";
const body = "'Hanken Grotesk', system-ui, sans-serif";
const mono = "'Spline Sans Mono', monospace";

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{ background: "#131009", borderBottom: "1px solid #221F18" }}>
      <div className="cf-cta" style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "112px 2rem",
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr",
        gap: "48px",
        alignItems: "end",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ height: "1px", width: "46px", background: "#E8A33C" }} />
            <span style={{
              fontFamily: mono,
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#D4882E",
              fontWeight: 500,
            }}>
              No. 05 — Start now
            </span>
          </div>
          <h2 style={{
            fontFamily: display,
            fontWeight: 740,
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            color: "#ECE7DC",
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            margin: 0,
          }}>
            Build your first<br />project today.
          </h2>
        </div>

        <div style={{ paddingBottom: "6px" }}>
          <p style={{ fontFamily: body, color: "#A39B8C", fontSize: "1.05rem", lineHeight: 1.62, maxWidth: "40ch", margin: "0 0 28px" }}>
            Pick a track, write the first line, run it. No setup, no friction —
            and no credit card.
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={{
                fontFamily: body,
                fontWeight: 600,
                fontSize: "0.95rem",
                background: "#E8A33C",
                color: "#15130E",
                border: "1px solid transparent",
                borderRadius: "2px",
                padding: "14px 28px",
                cursor: "pointer",
                transition: "transform .15s",
              }}
              onClick={() => navigate("/login")}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              Start a track
            </button>
            <button
              style={{
                fontFamily: body,
                fontWeight: 600,
                fontSize: "0.95rem",
                background: "none",
                border: "none",
                color: "#A39B8C",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "#34302A",
                padding: "14px 4px",
                transition: "color .15s",
              }}
              onClick={() => navigate("/ProjectDetail?id=ai-01")}
              onMouseEnter={e => { e.currentTarget.style.color = "#E8A33C"; e.currentTarget.style.textDecorationColor = "#E8A33C"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#A39B8C"; e.currentTarget.style.textDecorationColor = "#34302A"; }}
            >
              Browse projects
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
