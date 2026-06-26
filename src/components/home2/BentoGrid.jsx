import React from "react";

const display = "'Bricolage Grotesque', system-ui, sans-serif";
const body = "'Hanken Grotesk', system-ui, sans-serif";
const mono = "'Spline Sans Mono', monospace";

const idx = {
  fontFamily: body,
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  color: "#D4882E",
  textTransform: "uppercase",
  fontWeight: 500,
};

export default function BentoGrid() {
  return (
    <section id="learn" style={{ borderBottom: "1px solid #221F18" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "96px 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px" }}>
          <span style={idx}>02 — The reading surface</span>
        </div>

        <div className="cf-lesson" style={{
          display: "grid",
          gridTemplateColumns: "64px 1fr",
          gap: "32px",
        }}>
          <div className="cf-gutter" style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: "2.6rem",
            color: "#34302A",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}>
            03
          </div>

          <div>
            <h3 style={{
              fontFamily: display,
              fontWeight: 700,
              fontSize: "1.7rem",
              letterSpacing: "-0.02em",
              color: "#ECE7DC",
              margin: "0 0 16px",
            }}>
              Prompts as programs
            </h3>
            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#A39B8C", margin: "0 0 24px", lineHeight: 1.62 }}>
              A model call is just a <b style={{ color: "#ECE7DC", fontWeight: 600 }}>function</b> with a fuzzy
              contract: you hand it text, it hands back text. The craft is writing
              the input so the output is predictable — the same discipline you'd
              apply to any <Code>def</Code> you ship.
            </p>
            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#A39B8C", margin: "0 0 24px", lineHeight: 1.62 }}>
              You don't watch this. You run it, read the output, change one line,
              run it again — and watch the behavior move.
            </p>

            <div style={{
              margin: "32px 0",
              background: "#1C1A14",
              border: "1px solid #34302A",
              borderRadius: "4px",
              padding: "32px",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <span style={{
                  fontFamily: body,
                  fontSize: "0.7rem",
                  color: "#15130E",
                  background: "#E8A33C",
                  padding: "2px 7px",
                  borderRadius: "2px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                }}>
                  03.1
                </span>
                <span style={{ fontFamily: display, fontWeight: 700, fontSize: "0.95rem", color: "#ECE7DC" }}>
                  Check
                </span>
              </div>
              <div style={{ fontFamily: body, fontWeight: 500, marginBottom: "16px", color: "#ECE7DC" }}>
                Why treat a prompt like code?
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <Opt k="A">Because the model memorizes your wording</Opt>
                <Opt k="B" correct>Because small input changes change the output</Opt>
                <Opt k="C">Because prompts have to be valid Python</Opt>
              </div>
            </div>

            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#A39B8C", margin: 0, lineHeight: 1.62 }}>
              Next you'll <b style={{ color: "#ECE7DC", fontWeight: 600 }}>trace</b> how the same prompt drifts
              across two models — and learn to pin it down.
            </p>
          </div>
        </div>

        <div className="cf-pillars" style={{
          marginTop: "80px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "48px",
        }}>
          <Pillar n="01" title="Run, don't watch">
            Every lesson is a real task. Write the code, run it, see what breaks.
            We guide you through it — not past it.
          </Pillar>
          <Pillar n="02" title="Real projects">
            Not toy examples. A sentiment classifier, a semantic search engine, a
            chatbot with memory — things you'd put on a portfolio.
          </Pillar>
          <Pillar n="03" title="A tutor that won't cheat">
            Stuck? The tutor knows your lesson and nudges your thinking. It won't
            hand you the answer.
          </Pillar>
        </div>
      </div>
    </section>
  );
}

function Code({ children }) {
  return (
    <code style={{
      fontFamily: mono,
      fontSize: "0.86em",
      background: "#221F18",
      color: "#E8A33C",
      padding: "1px 6px",
      borderRadius: "3px",
      border: "1px solid #262219",
    }}>
      {children}
    </code>
  );
}

function Opt({ k, children, correct }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "13px 16px",
      background: "#15130E",
      border: correct ? "1px solid #E8A33C" : "1px solid #262219",
      borderRadius: "3px",
      ...(correct ? { background: "rgba(232,163,60,0.10)" } : {}),
    }}>
      <span style={{ fontFamily: body, fontSize: "0.78rem", color: correct ? "#E8A33C" : "#756C5C", width: "1.2em" }}>
        {k}
      </span>
      <span style={{ fontFamily: body, color: "#ECE7DC", fontSize: "0.95rem" }}>{children}</span>
    </div>
  );
}

function Pillar({ n, title, children }) {
  return (
    <div style={{ borderTop: "1px solid #221F18", paddingTop: "24px" }}>
      <div style={{ fontFamily: body, fontSize: "0.92rem", color: "#756C5C", marginBottom: "16px" }}>{n}</div>
      <h4 style={{
        fontFamily: display,
        fontWeight: 700,
        fontSize: "1.22rem",
        letterSpacing: "-0.01em",
        color: "#ECE7DC",
        margin: "0 0 10px",
      }}>
        {title}
      </h4>
      <p style={{ fontFamily: body, color: "#A39B8C", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}
