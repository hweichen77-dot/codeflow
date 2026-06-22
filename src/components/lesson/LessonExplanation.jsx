import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

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
    <div
      className="my-5 rounded"
      style={{ border: `1px solid ${trace.border}`, background: trace.terminal }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: `1px solid ${trace.border}`, background: trace.terminal }}
      >
        <span
          className="font-mono text-xs"
          style={{ color: trace.lime, letterSpacing: "0.08em" }}
        >
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 font-mono text-xs transition-colors"
          style={{ color: copied ? trace.lime : trace.faint }}
          onMouseEnter={(e) => {
            if (!copied) e.currentTarget.style.color = trace.lime;
          }}
          onMouseLeave={(e) => {
            if (!copied) e.currentTarget.style.color = trace.faint;
          }}
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
                style={{ color: trace.faint, fontSize: "0.7rem" }}
              >
                {i + 1}
              </span>
              <span style={{ color: trace.text }}>{line || " "}</span>
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
          color: #e8e8e8;
          line-height: 1.75;
          font-family: 'IBM Plex Sans', system-ui, sans-serif;
        }
        .lesson-doc h1 {
          font-family: 'IBM Plex Serif', Georgia, serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #e8e8e8;
          margin-bottom: 1.25rem;
          margin-top: 0;
          letter-spacing: -0.005em;
          line-height: 1.3;
        }
        .lesson-doc h2 {
          font-family: 'IBM Plex Serif', Georgia, serif;
          font-size: 1.15rem;
          font-weight: 600;
          color: #e8e8e8;
          margin-top: 2rem;
          margin-bottom: 0.6rem;
          letter-spacing: 0;
          line-height: 1.4;
        }
        .lesson-doc h2:first-child { margin-top: 0; }
        .lesson-doc h3 {
          font-family: 'IBM Plex Serif', Georgia, serif;
          font-size: 1rem;
          font-weight: 600;
          color: #e8e8e8;
          margin-top: 1.5rem;
          margin-bottom: 0.4rem;
        }
        .lesson-doc p {
          font-size: 0.9375rem;
          color: #e8e8e8;
          margin-bottom: 0.85rem;
          line-height: 1.75;
          font-weight: 400;
        }
        .lesson-doc a {
          color: #b8ff00;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .lesson-doc a:hover { color: #b8ff00; }
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
          color: #e8e8e8;
          margin-bottom: 0.3rem;
          padding-left: 0;
          position: relative;
          line-height: 1.7;
          font-weight: 400;
        }
        .lesson-doc li::marker {
          color: #6a6a6a;
        }
        .lesson-doc strong, .lesson-doc b {
          font-weight: 700;
          color: #f0f0f0;
        }
        .lesson-doc em {
          font-style: italic;
        }
        .lesson-doc code {
          font-family: 'IBM Plex Mono', 'Courier New', monospace;
          font-size: 0.82em;
          background: #161616;
          color: #b8ff00;
          padding: 2px 6px;
          border-radius: 3px;
          border: 1px solid #1e1e1e;
        }
        .lesson-doc blockquote {
          border-left: 2px solid #b8ff00;
          padding: 0.75rem 1.25rem;
          margin: 1.25rem 0;
          background: #111111;
          color: #a0a0a0;
          font-style: normal;
        }
        .lesson-doc blockquote p { margin-bottom: 0; color: #a0a0a0; }
        .lesson-doc hr {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 1.75rem 0;
        }
        .lesson-doc table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0 1.25rem;
          font-size: 0.875rem;
        }
        .lesson-doc th {
          background: #161616;
          border: 1px solid #1e1e1e;
          padding: 0.5rem 0.75rem;
          font-weight: 700;
          text-align: left;
          color: #e8e8e8;
        }
        .lesson-doc td {
          border: 1px solid #1e1e1e;
          padding: 0.45rem 0.75rem;
          color: #e8e8e8;
        }
        .lesson-doc tbody tr:nth-child(even) td {
          background: #0d0d0d;
        }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          code: ({ className, children }) => {
            // react-markdown v9 dropped the `inline` prop. Treat as a block
            // only when it has a language class or spans multiple lines;
            // otherwise render a short snippet inline so prose stays flowing.
            const isBlock =
              /language-/.test(className || "") ||
              String(children).includes("\n");
            return isBlock ? (
              <CodeBlock className={className}>{children}</CodeBlock>
            ) : (
              <code>{children}</code>
            );
          },
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