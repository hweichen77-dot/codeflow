import React from "react";
import { font } from "@/lib/tokens";
import { useNavigate } from "react-router-dom";
import { track } from "@/lib/analytics";

const display = font.display;
const body = font.body;

export default function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section style={{ background: "#070B0A", borderBottom: "1px solid #111917" }}>
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
            <span style={{ height: "1px", width: "46px", background: "#5ED29C" }} />
            <span style={{
              fontFamily: body,
              fontSize: "0.72rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#2E8B7A",
              fontWeight: 500,
            }}>
              No. 05, Start now
            </span>
          </div>
          <h2 style={{
            fontFamily: display,
            fontWeight: 740,
            fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
            color: "#ECF3EF",
            letterSpacing: "-0.03em",
            lineHeight: 1.02,
            margin: 0,
          }}>
            Build your first<br />project today.
          </h2>
        </div>

        <div style={{ paddingBottom: "6px" }}>
          <p style={{ fontFamily: body, color: "#FFFFFF", fontSize: "1.05rem", lineHeight: 1.62, maxWidth: "40ch", margin: "0 0 28px" }}>
            Pick a track, write the first line, run it. No setup and no credit
            card.
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            <button
              style={{
                fontFamily: body,
                fontWeight: 600,
                fontSize: "0.95rem",
                background: "#5ED29C",
                color: "#070B0A",
                border: "1px solid transparent",
                borderRadius: "2px",
                padding: "14px 28px",
                cursor: "pointer",
                transition: "transform .15s",
              }}
              onClick={() => { track("cta_click", { cta: "start_track", location: "final_cta" }); navigate("/login"); }}
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
                color: "#FFFFFF",
                cursor: "pointer",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "#26302B",
                padding: "14px 4px",
                transition: "color .15s",
              }}
              onClick={() => { track("cta_click", { cta: "browse_projects", location: "final_cta" }); navigate("/ProjectDetail?id=ai-01"); }}
              onMouseEnter={e => { e.currentTarget.style.color = "#5ED29C"; e.currentTarget.style.textDecorationColor = "#5ED29C"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#B7C6BE"; e.currentTarget.style.textDecorationColor = "#26302B"; }}
            >
              Browse projects
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
