import React from "react";

const testimonials = [
  {
    quote: "I spent two months on YouTube tutorials and never built anything. Two weeks on CodeFlow and I had a working AI tool I actually use.",
    name: "Marcus T.",
    role: "Freelance designer",
  },
  {
    quote: "The AI tutor is what got me. It doesn't just give you the answer — it makes you think through it. That's the difference between learning and copying.",
    name: "Priya S.",
    role: "Product manager, fintech",
  },
  {
    quote: "I was intimidated by AI APIs. Now I've shipped three projects using them. CodeFlow made it feel approachable without dumbing it down.",
    name: "Daniel W.",
    role: "Engineering student",
  },
];

export default function Testimonials() {
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 2rem" }}>
      {/* Label */}
      <div style={{
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#d4d4d4",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: "48px",
      }}>
        What learners say
      </div>

      <div className="cf-testimonials" style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
      }}>
        {testimonials.map((t) => (
          <div
            key={t.name}
            style={{
              background: "#111111",
              border: "1px solid #262626",
              borderRadius: "12px",
              padding: "28px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <p style={{
              color: "#d4d4d4",
              fontSize: "15px",
              lineHeight: 1.75,
              margin: 0,
              fontStyle: "italic",
              flexGrow: 1,
            }}>
              "{t.quote}"
            </p>
            <div>
              <div style={{ color: "#f0f0f0", fontSize: "14px", fontWeight: 600 }}>{t.name}</div>
              <div style={{ color: "#d4d4d4", fontSize: "12px", fontFamily: "monospace", marginTop: "3px" }}>{t.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}