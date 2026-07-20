import React from "react";
import { font } from "@/lib/tokens";

const display = font.display;
const body = font.body;
const mono = font.mono;

const idx = {
  fontFamily: body,
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  color: "#2E8B7A",
  textTransform: "uppercase",
  fontWeight: 500,
};

export default function LessonShowcase() {
  return (
    <section id="learn" style={{ borderBottom: "1px solid #111917" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "96px 2rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "48px" }}>
          <span style={idx}>02, The reading surface</span>
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
            color: "#26302B",
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
              color: "#ECF3EF",
              margin: "0 0 16px",
            }}>
              Prompts as programs
            </h3>
            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#FFFFFF", margin: "0 0 24px", lineHeight: 1.62 }}>
              A model call is just a <b style={{ color: "#ECF3EF", fontWeight: 600 }}>function</b> with a fuzzy
              contract: you hand it text, it hands back text. The craft is writing
              the input so the output is predictable. Same discipline you'd
              apply to any <Code>def</Code> you ship.
            </p>
            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#FFFFFF", margin: "0 0 24px", lineHeight: 1.62 }}>
              You don't watch this. You run it, read the output, change one line,
              run it again, and watch the behavior move.
            </p>

            <div style={{
              margin: "32px 0",
              background: "#0C1210",
              border: "1px solid #26302B",
              borderRadius: "4px",
              padding: "32px",
            }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <span style={{
                  fontFamily: body,
                  fontSize: "0.7rem",
                  color: "#070B0A",
                  background: "#5ED29C",
                  padding: "2px 7px",
                  borderRadius: "2px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                }}>
                  03.1
                </span>
                <span style={{ fontFamily: display, fontWeight: 700, fontSize: "0.95rem", color: "#ECF3EF" }}>
                  Check
                </span>
              </div>
              <div style={{ fontFamily: body, fontWeight: 500, marginBottom: "16px", color: "#ECF3EF" }}>
                Why treat a prompt like code?
              </div>
              <div style={{ display: "grid", gap: "12px" }}>
                <Opt k="A">Because the model memorizes your wording</Opt>
                <Opt k="B" correct>Because small input changes change the output</Opt>
                <Opt k="C">Because prompts have to be valid Python</Opt>
              </div>
            </div>

            <p style={{ fontFamily: body, maxWidth: "68ch", color: "#FFFFFF", margin: 0, lineHeight: 1.62 }}>
              Next you'll <b style={{ color: "#ECF3EF", fontWeight: 600 }}>trace</b> how the same prompt drifts
              across two models, then learn to pin it down.
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
            We stay with you while you work through it.
          </Pillar>
          <Pillar n="02" title="Real projects">
            Things you'd put on a portfolio: a sentiment classifier, a semantic
            search engine, a chatbot with memory.
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
      background: "#111917",
      color: "#5ED29C",
      padding: "1px 6px",
      borderRadius: "3px",
      border: "1px solid #17201C",
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
      background: "#070B0A",
      border: correct ? "1px solid #5ED29C" : "1px solid #17201C",
      borderRadius: "3px",
      ...(correct ? { background: "rgba(94,210,156,0.10)" } : {}),
    }}>
      <span style={{ fontFamily: body, fontSize: "0.78rem", color: correct ? "#5ED29C" : "#7C8D85", width: "1.2em" }}>
        {k}
      </span>
      <span style={{ fontFamily: body, color: "#ECF3EF", fontSize: "0.95rem" }}>{children}</span>
    </div>
  );
}

function Pillar({ n, title, children }) {
  return (
    <div style={{ borderTop: "1px solid #111917", paddingTop: "24px" }}>
      <div style={{ fontFamily: body, fontSize: "0.92rem", color: "#FFFFFF", marginBottom: "16px" }}>{n}</div>
      <h4 style={{
        fontFamily: display,
        fontWeight: 700,
        fontSize: "1.22rem",
        letterSpacing: "-0.01em",
        color: "#ECF3EF",
        margin: "0 0 10px",
      }}>
        {title}
      </h4>
      <p style={{ fontFamily: body, color: "#FFFFFF", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
        {children}
      </p>
    </div>
  );
}
