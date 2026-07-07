import React from "react";
import { font } from "@/lib/tokens";

const display = font.display;
const body = font.body;

const tracks = [
  {
    n: "01",
    title: "AI Engineering",
    desc: "Model calls, embeddings, retrieval, and agents. You build tools you run.",
    badge: "Python",
    clay: true,
  },
  {
    n: "02",
    title: "AP CS Principles",
    desc: "Big Ideas 1, 5: how data, code, and the internet become the machine underneath.",
    badge: "Python",
  },
  {
    n: "03",
    title: "AP CS A",
    desc: "Primitive types, iteration, classes, recursion: the unit that makes it click.",
    badge: "Java",
    clay: true,
  },
  {
    n: "04",
    title: "Competitive Coding",
    desc: "USACO/CF-depth problems with stdin judging. Graphs, DP, and the patterns that win.",
    badge: "C++",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" style={{ borderBottom: "1px solid #221F18" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "96px 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px" }}>
          <span style={{
            fontFamily: body,
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            color: "#D4882E",
            textTransform: "uppercase",
            fontWeight: 500,
          }}>
            03
          </span>
          <h2 style={{
            fontFamily: display,
            fontWeight: 720,
            letterSpacing: "-0.025em",
            fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)",
            color: "#ECE7DC",
            margin: 0,
          }}>
            Four tracks, one engine
          </h2>
        </div>

        <div className="cf-track" style={{ display: "flex", flexDirection: "column" }}>
          {tracks.map((t, i) => (
            <TrackRow key={t.n} {...t} last={i === tracks.length - 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrackRow({ n, title, desc, badge, clay, last }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="cf-track-row"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "32px",
        alignItems: "center",
        padding: "32px 0",
        paddingLeft: hover ? "12px" : "0",
        borderTop: "1px solid #221F18",
        borderBottom: last ? "1px solid #221F18" : "none",
        transition: "padding .2s",
      }}
    >
      <div style={{
        fontFamily: body,
        fontSize: "0.92rem",
        color: hover ? "#E8A33C" : "#756C5C",
        width: "2.4em",
        transition: "color .15s",
      }}>
        {n}
      </div>
      <div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: "1.22rem", letterSpacing: "-0.01em", color: "#ECE7DC" }}>
          {title}
        </div>
        <div style={{ fontFamily: body, color: "#FFFFFF", fontSize: "0.92rem", marginTop: "3px", maxWidth: "60ch" }}>
          {desc}
        </div>
      </div>
      <div style={{
        fontFamily: body,
        fontSize: "0.68rem",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: clay ? "#C2643C" : "#A39B8C",
        border: clay ? "1px solid rgba(194,100,60,0.4)" : "1px solid #34302A",
        padding: "4px 10px",
        borderRadius: "2px",
        whiteSpace: "nowrap",
      }}>
        {badge}
      </div>
    </div>
  );
}
