import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "js";
  const code = String(children).replace(/\n$/, "");
  const lines = code.split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded" style={{ border: "1px solid #e0e0e0", background: "#f8f8f8" }}>
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid #e0e0e0", background: "#f0f0f0" }}
      >
        <span className="font-mono text-xs" style={{ color: "#999" }}>{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 font-mono text-xs transition-colors"
          style={{ color: copied ? "#2d8a4e" : "#999" }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto py-4 px-0">
        <code className="font-mono" style={{ fontSize: "0.8rem", lineHeight: "1.65" }}>
          {lines.map((line, i) => (
            <div key={i} className="flex px-4">
              <span
                className="select-none flex-shrink-0 text-right w-6 mr-4"
                style={{ color: "#ccc", fontSize: "0.7rem" }}
              >
                {i + 1}
              </span>
              <span style={{ color: "#333" }}>{line || " "}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function LessonExplanation({ explanation, concept }) {
  if (!explanation) return null;

  return (
    <div className="lesson-doc">
      <style>{`
        .lesson-doc {
          color: #1a1a1a;
          line-height: 1.75;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .lesson-doc h1 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111;
          margin-bottom: 1.25rem;
          margin-top: 0;
          letter-spacing: -0.01em;
          line-height: 1.3;
        }
        .lesson-doc h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #111;
          margin-top: 2rem;
          margin-bottom: 0.6rem;
          letter-spacing: 0;
          line-height: 1.4;
        }
        .lesson-doc h2:first-child { margin-top: 0; }
        .lesson-doc h3 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #222;
          margin-top: 1.5rem;
          margin-bottom: 0.4rem;
        }
        .lesson-doc p {
          font-size: 0.9375rem;
          color: #222;
          margin-bottom: 0.85rem;
          line-height: 1.75;
          font-weight: 400;
        }
        .lesson-doc ul {
          margin: 0.5rem 0 1rem 1.25rem;
          padding-left: 0;
          list-style: disc;
        }
        .lesson-doc ol {
          margin: 0.5rem 0 1rem 1.25rem;
          padding-left: 0;
          list-style: decimal;
        }
        .lesson-doc li {
          font-size: 0.9375rem;
          color: #222;
          margin-bottom: 0.3rem;
          padding-left: 0;
          position: relative;
          line-height: 1.7;
          font-weight: 400;
        }
        .lesson-doc strong, .lesson-doc b {
          font-weight: 700;
          color: #111;
        }
        .lesson-doc em {
          font-style: italic;
        }
        .lesson-doc code {
          font-family: 'Space Mono', 'Courier New', monospace;
          font-size: 0.8em;
          background: #f0f0f0;
          color: #c7254e;
          padding: 0.1em 0.35em;
          border-radius: 3px;
          border: 1px solid #e0e0e0;
        }
        .lesson-doc blockquote {
          border-left: 3px solid #cf6a2f;
          padding: 0.75rem 1.25rem;
          margin: 1.25rem 0;
          background: #fdf8f4;
          color: #444;
          font-style: normal;
        }
        .lesson-doc blockquote p { margin-bottom: 0; color: #444; }
        .lesson-doc hr {
          border: none;
          border-top: 1px solid #e5e5e5;
          margin: 1.75rem 0;
        }
        .lesson-doc table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.25rem;
          font-size: 0.875rem;
        }
        .lesson-doc th {
          background: #f5f5f5;
          border: 1px solid #ddd;
          padding: 0.5rem 0.75rem;
          font-weight: 700;
          text-align: left;
          color: #111;
        }
        .lesson-doc td {
          border: 1px solid #ddd;
          padding: 0.45rem 0.75rem;
          color: #333;
        }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          code: ({ inline, className, children }) =>
            inline ? (
              <code>{children}</code>
            ) : (
              <CodeBlock className={className}>{children}</CodeBlock>
            ),
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
          blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          hr: () => <hr />,
          table: ({ children }) => <table>{children}</table>,
          thead: ({ children }) => <thead>{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th>{children}</th>,
          td: ({ children }) => <td>{children}</td>,
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
}