import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "").toUpperCase() || "JS";
  const code = String(children).replace(/\n$/, "");
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6" style={{ border: "1px solid #1e1e1e" }}>
      {/* Code block header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
          </div>
          <span className="font-mono text-xs" style={{ color: "#333" }}>code.{lang.toLowerCase()}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="font-mono text-xs px-3 py-1 transition-all duration-150"
            style={{
              color: copied ? "#b8ff00" : "#333",
              border: `1px solid ${copied ? "#b8ff0033" : "#1e1e1e"}`,
              background: copied ? "#b8ff0010" : "transparent",
            }}
          >
            {copied ? "copied!" : "copy"}
          </button>
          <span
            className="font-mono text-xs px-2 py-1"
            style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
          >
            {lang}
          </span>
        </div>
      </div>
      {/* Code content */}
      <div style={{ background: "#0d0d0d" }}>
        <pre className="overflow-x-auto py-5 px-0">
          <code className="font-mono" style={{ fontSize: "0.75rem", lineHeight: "1.7" }}>
            {lines.map((line, i) => (
              <div key={i} className="flex px-5">
                <span
                  className="select-none flex-shrink-0 text-right w-8 mr-5"
                  style={{ color: "#2a2a2a", fontSize: "0.7rem" }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "#aaaaaa" }}>{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default function LessonExplanation({ explanation, concept }) {
  if (!explanation) return null;

  return (
    <div className="lesson-prose">
      <style>{`
        .lesson-prose { color: #888; line-height: 1.8; }
        .lesson-prose h2 {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 800;
          color: #e8e8e8;
          letter-spacing: -0.03em;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          border: none;
          padding-bottom: 0;
        }
        .lesson-prose h2:first-child { margin-top: 0; }
        .lesson-prose h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #cccccc;
          letter-spacing: -0.02em;
          margin-top: 2rem;
          margin-bottom: 0.5rem;
        }
        .lesson-prose p {
          font-family: 'Syne', sans-serif;
          font-size: 0.9375rem;
          color: #777;
          margin-bottom: 1rem;
          line-height: 1.85;
          font-weight: 400;
        }
        .lesson-prose ul, .lesson-prose ol {
          margin: 0.75rem 0 1rem 0;
          padding-left: 0;
          list-style: none;
        }
        .lesson-prose li {
          font-family: 'Syne', sans-serif;
          font-size: 0.9375rem;
          color: #666;
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
          position: relative;
          line-height: 1.7;
          font-weight: 400;
        }
        .lesson-prose li::before {
          content: '—';
          position: absolute;
          left: 0;
          color: #333;
          font-family: 'Space Mono', monospace;
        }
        .lesson-prose strong {
          font-weight: 700;
          color: #aaa;
        }
        .lesson-prose blockquote {
          border-left: 2px solid #b8ff00;
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          color: #555;
          font-style: normal;
        }
        .lesson-prose hr {
          border: none;
          border-top: 1px solid #1a1a1a;
          margin: 2rem 0;
        }
        .lesson-mono {
          font-family: 'Space Mono', monospace;
          font-size: 0.75em;
          background: #111;
          color: #b8ff00;
          padding: 0.15em 0.4em;
          border: 1px solid #1e1e1e;
        }
      `}</style>

      {concept && (
        <div className="mb-6">
          <span
            className="font-mono text-xs tracking-widest uppercase px-3 py-1.5"
            style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
          >
            {concept}
          </span>
        </div>
      )}

      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3>{children}</h3>
          ),
          p: ({ children }) => (
            <p>{children}</p>
          ),
          code: ({ inline, className, children }) =>
            inline ? (
              <code className="lesson-mono">{children}</code>
            ) : (
              <CodeBlock className={className}>{children}</CodeBlock>
            ),
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong>{children}</strong>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          hr: () => <hr />,
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
}