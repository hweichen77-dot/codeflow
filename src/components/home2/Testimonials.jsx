import React from "react";

const display = "'Bricolage Grotesque', system-ui, sans-serif";
const body = "'Hanken Grotesk', system-ui, sans-serif";
const mono = "'Spline Sans Mono', monospace";

export default function Testimonials() {
  return (
    <section style={{ borderBottom: "1px solid #221F18" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "96px 2rem" }}>
        {/* section head */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px" }}>
          <span style={{
            fontFamily: mono,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "#D4882E",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>
            04 — In their words
          </span>
        </div>

        {/* lead pull-quote — large, asymmetric */}
        <div className="cf-quotes" style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "64px",
          alignItems: "start",
        }}>
          <figure style={{ margin: 0 }}>
            <span style={{ fontFamily: display, color: "#34302A", fontSize: "3rem", lineHeight: 0.6, display: "block" }}>
              &#8220;
            </span>
            <blockquote style={{
              fontFamily: display,
              fontWeight: 500,
              fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: "#ECE7DC",
              margin: "8px 0 24px",
            }}>
              Two months of YouTube and I built nothing. Two weeks on CodeFlow
              and I had an AI tool I <em style={{ fontStyle: "italic", color: "#E8A33C", fontWeight: 500 }}>actually use.</em>
            </blockquote>
            <figcaption style={{ fontFamily: mono, fontSize: "0.8rem", color: "#756C5C", letterSpacing: "0.04em" }}>
              Marcus T. — freelance designer
            </figcaption>
          </figure>

          {/* two smaller stacked quotes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
            <SmallQuote
              quote="The tutor doesn't give you the answer — it makes you think it through. That's the difference between learning and copying."
              who="Priya S. — PM, fintech"
            />
            <SmallQuote
              quote="I was intimidated by AI APIs. Now I've shipped three projects with them. Approachable without dumbing it down."
              who="Daniel W. — engineering student"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SmallQuote({ quote, who }) {
  return (
    <figure style={{ margin: 0, borderTop: "1px solid #221F18", paddingTop: "24px" }}>
      <blockquote style={{
        fontFamily: body,
        fontSize: "1.05rem",
        lineHeight: 1.6,
        color: "#A39B8C",
        margin: "0 0 16px",
      }}>
        {quote}
      </blockquote>
      <figcaption style={{ fontFamily: mono, fontSize: "0.78rem", color: "#756C5C", letterSpacing: "0.04em" }}>
        {who}
      </figcaption>
    </figure>
  );
}
