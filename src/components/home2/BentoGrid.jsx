import React from "react";

const card = {
  background: "#111111",
  border: "1px solid #262626",
  borderRadius: "12px",
  padding: "28px",
};

function CodeMockup() {
  return (
    <div style={{
      background: "#0d0d0d",
      border: "1px solid #1e1e1e",
      borderRadius: "8px",
      padding: "16px",
      fontFamily: "monospace",
      fontSize: "12.5px",
      lineHeight: 1.8,
      marginTop: "20px",
    }}>
      <div style={{ color: "#888888", marginBottom: "6px" }}>// lesson_03.js</div>
      <div><span style={{ color: "#c084fc" }}>async function</span> <span style={{ color: "#60a5fa" }}>analyzeText</span><span style={{ color: "#a3a3a3" }}>(input) {"{"}</span></div>
      <div style={{ paddingLeft: "18px" }}>
        <span style={{ color: "#a3a3a3" }}>const result = </span>
        <span style={{ color: "#34d399" }}>await</span>
        <span style={{ color: "#a3a3a3" }}> openai.</span>
        <span style={{ color: "#60a5fa" }}>chat</span>
        <span style={{ color: "#a3a3a3" }}>({"{"})</span>
      </div>
      <div style={{ paddingLeft: "36px" }}>
        <span style={{ color: "#b8ff00" }}>model</span>
        <span style={{ color: "#a3a3a3" }}>: </span>
        <span style={{ color: "#86efac" }}>"gpt-4o-mini"</span>
        <span style={{ color: "#a3a3a3" }}>,</span>
      </div>
      <div style={{ paddingLeft: "36px" }}>
        <span style={{ color: "#b8ff00" }}>messages</span>
        <span style={{ color: "#a3a3a3" }}>: [{"{"}role: </span>
        <span style={{ color: "#86efac" }}>"user"</span>
        <span style={{ color: "#a3a3a3" }}>, content: input{"}"}]</span>
      </div>
      <div style={{ paddingLeft: "18px" }}><span style={{ color: "#a3a3a3" }}>{"})"}</span></div>
      <div style={{ paddingLeft: "18px" }}>
        <span style={{ color: "#34d399" }}>return</span>
        <span style={{ color: "#a3a3a3" }}> result.choices[0].message.content</span>
      </div>
      <div><span style={{ color: "#a3a3a3" }}>{"}"}</span></div>
      <div style={{
        marginTop: "12px",
        padding: "10px",
        background: "#0a0a0a",
        border: "1px solid #1a1a1a",
        borderRadius: "4px",
        color: "#86efac",
        fontSize: "11px",
      }}>
        ✓ Output: "Sentiment is positive with 94% confidence."
      </div>
    </div>
  );
}

const projects = [
  "AI writing assistant",
  "Semantic search engine",
  "Chatbot with memory",
  "Image classifier",
  "Code reviewer",
];

const aiFeatures = [
  { icon: "💬", label: "Ask anything" },
  { icon: "🔧", label: "Get unstuck" },
  { icon: "🚀", label: "Build faster" },
];

export default function BentoGrid() {
  return (
    <section id="learn" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem 96px" }}>
      <div className="cf-bento" style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, 1fr)",
        gridTemplateRows: "auto auto",
        gap: "16px",
      }}>

        {/* LARGE: Learn by doing */}
        <div style={{ ...card, gridColumn: "span 7" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#b8ff00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
            CORE EXPERIENCE
          </div>
          <h3 style={{ color: "#f0f0f0", fontSize: "22px", fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Learn by doing, not watching.
          </h3>
          <p style={{ color: "#a3a3a3", fontSize: "14px", lineHeight: 1.7, margin: 0, maxWidth: "380px" }}>
            Every lesson is a real task. Write the code, run it, see what breaks.
            We guide you through it — not past it.
          </p>
          <CodeMockup />
        </div>

        {/* TALL: Real projects */}
        <div style={{ ...card, gridColumn: "span 5", gridRow: "span 2" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#b8ff00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
            PROJECT LIBRARY
          </div>
          <h3 style={{ color: "#f0f0f0", fontSize: "20px", fontWeight: 700, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            Real projects, real skills.
          </h3>
          <p style={{ color: "#c0c0c0", fontSize: "14px", lineHeight: 1.65, margin: "0 0 28px" }}>
            Not toy examples. These are things you'd actually put on a portfolio.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {projects.map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ color: "#b8ff00", fontSize: "16px", lineHeight: 1 }}>✓</span>
                <span style={{ color: "#d4d4d4", fontSize: "15px", fontWeight: 500 }}>{p}</span>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "auto",
            paddingTop: "40px",
            borderTop: "1px solid #1e1e1e",
            marginTop: "36px",
          }}>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#525252", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "8px" }}>
              Skill level
            </div>
            {["Beginner", "Intermediate", "Advanced"].map((lvl, i) => (
              <div key={lvl} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{
                  height: "4px",
                  flex: 1,
                  background: "#1e1e1e",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}>
                  <div style={{
                    height: "100%",
                    width: `${[40, 70, 90][i]}%`,
                    background: i === 0 ? "#b8ff00" : i === 1 ? "#7acc00" : "#4d9900",
                    borderRadius: "2px",
                  }} />
                </div>
                <span style={{ color: "#888888", fontSize: "12px", fontFamily: "monospace", minWidth: "80px" }}>{lvl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WIDE: AI guidance */}
        <div style={{ ...card, gridColumn: "span 4" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#b8ff00", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "14px" }}>
            AI TUTOR
          </div>
          <h3 style={{ color: "#f0f0f0", fontSize: "18px", fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            AI-powered guidance.
          </h3>
          <p style={{ color: "#c0c0c0", fontSize: "13px", lineHeight: 1.65, margin: "0 0 22px" }}>
            Stuck? Ask your AI tutor. It knows what lesson you're on and won't just give you the answer.
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {aiFeatures.map(f => (
              <div key={f.label} style={{
                display: "flex",
                alignItems: "center",
                gap: "7px",
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                borderRadius: "6px",
                padding: "8px 12px",
                flex: 1,
                minWidth: "100px",
              }}>
                <span style={{ fontSize: "16px" }}>{f.icon}</span>
                <span style={{ color: "#c0c0c0", fontSize: "12px", fontWeight: 500 }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SMALL: Learner count */}
        <div style={{ ...card, gridColumn: "span 4", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ color: "#b8ff00", fontSize: "42px", fontWeight: 800, lineHeight: 1, fontFamily: "Georgia, serif", letterSpacing: "-0.03em" }}>
            2,400+
          </div>
          <div style={{ color: "#c0c0c0", fontSize: "14px", marginTop: "8px", fontWeight: 500 }}>
            learners building with AI
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#888888", marginTop: "4px" }}>
            and growing every week
          </div>
        </div>

        {/* SMALL: Beginner friendly */}
        <div style={{ ...card, gridColumn: "span 4", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "28px" }}>🌱</div>
          <div>
            <div style={{ color: "#f0f0f0", fontSize: "16px", fontWeight: 700, marginBottom: "6px", letterSpacing: "-0.01em" }}>
              Beginner friendly.
            </div>
            <div style={{ color: "#c0c0c0", fontSize: "13px", lineHeight: 1.6 }}>
              No CS degree needed. If you can Google something, you can learn here.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}