import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders a USACO / Codeforces-style problem statement for both AI challenges
 * and Competitive Coding problems. All sections are optional — pass only what a
 * problem has. Dark theme, lime accent, matching the challenge pages.
 *
 * problem: {
 *   story, statement, input_format, output_format,
 *   constraints: string[], examples: [{input, output, explanation}], notes
 * }
 */

function MD({ children }) {
  if (!children) return null;
  return (
    <div className="cf-md">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // react-markdown v9 dropped the `inline` prop: treat as a block only
          // when it carries a language class or spans multiple lines.
          code: ({ className, children }) => {
            const isBlock = /language-/.test(className || "") || String(children).includes("\n");
            return isBlock ? (
              <pre className="cf-pre"><code>{children}</code></pre>
            ) : (
              <code className="cf-code">{children}</code>
            );
          },
          pre: ({ children }) => <>{children}</>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

function Section({ label, children }) {
  if (!children) return null;
  return (
    <div className="mb-6">
      <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#b8ff00" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

export default function ProblemStatement({ problem }) {
  if (!problem) return null;
  const { story, statement, input_format, output_format, constraints, examples, notes } = problem;

  return (
    <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
      <style>{`
        .cf-md { color: #cfcfcf; font-family: 'IBM Plex Sans', system-ui, sans-serif; font-size: 0.9rem; line-height: 1.7; }
        .cf-md p { margin: 0 0 0.7rem; }
        .cf-md ul, .cf-md ol { margin: 0.4rem 0 0.8rem 1.25rem; }
        .cf-md li { margin-bottom: 0.25rem; }
        .cf-md strong { color: #f0f0f0; font-weight: 700; }
        .cf-code { font-family: 'IBM Plex Mono', monospace; font-size: 0.82em; background: #161616; color: #b8ff00; padding: 0.1em 0.35em; border-radius: 3px; border: 1px solid #242424; }
        .cf-pre { font-family: 'IBM Plex Mono', monospace; font-size: 0.78rem; line-height: 1.6; background: #080808; border: 1px solid #1e1e1e; padding: 0.85rem 1rem; overflow-x: auto; margin: 0 0 0.8rem; color: #ccc; }
      `}</style>

      <div className="px-6 lg:px-8 py-6">
        {story && (
          <div
            className="mb-6 px-4 py-3"
            style={{ borderLeft: "2px solid #b8ff00", background: "#b8ff0008", fontStyle: "italic" }}
          >
            <MD>{story}</MD>
          </div>
        )}

        <Section label="Problem"><MD>{statement}</MD></Section>
        <Section label="Input"><MD>{input_format}</MD></Section>
        <Section label="Output"><MD>{output_format}</MD></Section>

        {Array.isArray(constraints) && constraints.length > 0 && (
          <Section label="Constraints">
            <ul className="space-y-1">
              {constraints.map((c, i) => (
                <li key={i} className="font-mono text-xs flex gap-2" style={{ color: "#bbb" }}>
                  <span style={{ color: "#b8ff00" }}>•</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {Array.isArray(examples) && examples.length > 0 && (
          <Section label="Examples">
            <div className="space-y-4">
              {examples.map((ex, i) => (
                <div key={i} style={{ border: "1px solid #1a1a1a" }}>
                  <div className="grid grid-cols-2" style={{ borderBottom: ex.explanation ? "1px solid #1a1a1a" : "none" }}>
                    <div className="px-4 py-3" style={{ borderRight: "1px solid #1a1a1a" }}>
                      <div className="font-mono text-xs uppercase tracking-widest mb-1.5" style={{ color: "#777" }}>input</div>
                      <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: "#ddd", margin: 0 }}>{ex.input || "(none)"}</pre>
                    </div>
                    <div className="px-4 py-3">
                      <div className="font-mono text-xs uppercase tracking-widest mb-1.5" style={{ color: "#777" }}>output</div>
                      <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: "#b8ff00", margin: 0 }}>{ex.output}</pre>
                    </div>
                  </div>
                  {ex.explanation && (
                    <div className="px-4 py-2.5">
                      <span className="font-mono text-xs uppercase tracking-widest mr-2" style={{ color: "#777" }}>note</span>
                      <span className="font-display text-xs" style={{ color: "#aaa" }}>{ex.explanation}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {notes && <Section label="Notes"><MD>{notes}</MD></Section>}
      </div>
    </div>
  );
}
