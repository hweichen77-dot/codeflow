import React from "react";
import { useNavigate } from "react-router-dom";

const display = "'Bricolage Grotesque', system-ui, sans-serif";
const body = "'Hanken Grotesk', system-ui, sans-serif";
const mono = "'Spline Sans Mono', monospace";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section style={{ borderBottom: "1px solid #221F18", overflow: "hidden" }}>
      <div className="cf-hero" style={{
        maxWidth: "1180px",
        margin: "0 auto",
        padding: "120px 2rem 96px",
        display: "grid",
        gridTemplateColumns: "1.35fr 1fr",
        gap: "48px",
        alignItems: "end",
      }}>
        {/* LEFT — editorial copy */}
        <div>
          {/* eyebrow with rule */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ height: "1px", width: "46px", background: "#E8A33C" }} />
            <span style={{
              fontFamily: mono,
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#D4882E",
              fontWeight: 500,
            }}>
              No. 01 — Learn by building
            </span>
          </div>

          {/* headline */}
          <h1 style={{
            fontFamily: display,
            fontWeight: 760,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            fontSize: "clamp(3rem, 7.5vw, 6rem)",
            color: "#ECE7DC",
            margin: 0,
          }}>
            From curious<br />to <em style={{ fontStyle: "italic", fontWeight: 500, color: "#E8A33C" }}>capable.</em>
          </h1>

          {/* lede */}
          <p style={{
            fontFamily: body,
            marginTop: "32px",
            maxWidth: "48ch",
            color: "#A39B8C",
            fontSize: "1.12rem",
            lineHeight: 1.62,
          }}>
            CodeFlow teaches you to use AI tools and ship real software — AI
            engineering, AP Computer Science, and competitive coding, with code
            you actually run at every step.
          </p>

          {/* actions */}
          <div style={{ marginTop: "44px", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={btnPrimary}
              onClick={() => navigate("/ProjectDetail?id=ai-01")}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              Start a track
            </button>
            <button
              style={btnGhost}
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#756C5C")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#34302A")}
            >
              Download for desktop
            </button>
            <button
              style={btnText}
              onClick={() => document.getElementById("learn")?.scrollIntoView({ behavior: "smooth" })}
              onMouseEnter={e => { e.currentTarget.style.color = "#E8A33C"; e.currentTarget.style.textDecorationColor = "#E8A33C"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#A39B8C"; e.currentTarget.style.textDecorationColor = "#34302A"; }}
            >
              See the curriculum
            </button>
          </div>
        </div>

        {/* RIGHT — terminal card */}
        <div style={{
          background: "#131009",
          border: "1px solid #34302A",
          borderRadius: "4px",
          overflow: "hidden",
          fontFamily: mono,
          fontSize: "0.84rem",
          boxShadow: "0 24px 60px -30px rgba(0,0,0,0.7)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "11px 14px",
            borderBottom: "1px solid #221F18",
          }}>
            <i style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#C2643C", display: "inline-block" }} />
            <i style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#34302A", display: "inline-block" }} />
            <i style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#34302A", display: "inline-block" }} />
            <span style={{ marginLeft: "8px", color: "#756C5C", fontSize: "0.74rem", letterSpacing: "0.04em" }}>
              sentiment.py — lesson 03
            </span>
          </div>
          <div style={{ padding: "18px 18px 20px", lineHeight: 1.85 }}>
            <span style={{ color: "#756C5C" }}># classify a line of text with one call</span><br />
            text <span style={{ color: "#E8A33C" }}>=</span> <span style={{ color: "#7FBF8F" }}>"I love this"</span><br />
            label <span style={{ color: "#E8A33C" }}>=</span> classify(text)<br />
            <span style={{ color: "#E8A33C" }}>print</span>(label, confidence)
            <span style={{
              color: "#ECE7DC",
              display: "block",
              marginTop: "6px",
              paddingTop: "8px",
              borderTop: "1px dashed #221F18",
            }}>
              positive · 0.94
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

const btnPrimary = {
  fontFamily: body,
  fontWeight: 600,
  fontSize: "0.95rem",
  borderRadius: "2px",
  cursor: "pointer",
  padding: "13px 26px",
  border: "1px solid transparent",
  background: "#E8A33C",
  color: "#15130E",
  transition: "transform .15s",
};
const btnGhost = {
  fontFamily: body,
  fontWeight: 600,
  fontSize: "0.95rem",
  borderRadius: "2px",
  cursor: "pointer",
  padding: "13px 26px",
  background: "transparent",
  color: "#ECE7DC",
  border: "1px solid #34302A",
  transition: "border-color .15s",
};
const btnText = {
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
  padding: "13px 4px",
  transition: "color .15s",
};
