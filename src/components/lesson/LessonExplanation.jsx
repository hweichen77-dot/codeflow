import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";

// Keywords to auto-bold in paragraph text
const KEYWORDS = [
  "variable", "variables", "function", "functions", "array", "arrays",
  "loop", "loops", "object", "objects", "string", "strings", "integer", "integers",
  "boolean", "booleans", "class", "classes", "method", "methods", "parameter", "parameters",
  "argument", "arguments", "return", "returns", "constant", "constants",
  "algorithm", "algorithms", "data structure", "data structures", "recursion", "recursive",
  "iteration", "iterative", "conditional", "conditionals", "operator", "operators",
  "index", "indices", "element", "elements", "syntax", "statement", "statements",
  "expression", "expressions", "value", "values", "type", "types", "scope",
  "callback", "promise", "async", "await", "event", "events", "DOM",
  "component", "components", "state", "props", "hook", "hooks",
  "pointer", "pointers", "memory", "stack", "queue", "tree", "graph",
  "node", "nodes", "edge", "edges", "vertex", "vertices",
  "input", "output", "console", "terminal", "compiler", "interpreter",
  "binary", "hexadecimal", "decimal", "null", "undefined", "exception", "error",
];

const KEYWORD_REGEX = new RegExp(
  `\\b(${KEYWORDS.map(k => k.replace(/\s+/g, "\\s+")).join("|")})\\b`,
  "gi"
);

function BoldKeywords({ children }) {
  if (typeof children !== "string") return <>{children}</>;
  const parts = children.split(KEYWORD_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        KEYWORD_REGEX.test(part) ? (
          <strong key={i} className="font-semibold text-gray-900">{part}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function processChildren(children) {
  if (!children) return children;
  if (typeof children === "string") return <BoldKeywords>{children}</BoldKeywords>;
  if (Array.isArray(children)) return children.map((child, i) => 
    typeof child === "string" ? <BoldKeywords key={i}>{child}</BoldKeywords> : child
  );
  return children;
}

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "").toUpperCase() || "JS";
  const code = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add line numbers
  const lines = code.split("\n");

  return (
    <div className="my-5 rounded-md overflow-hidden border border-[#3a3a4a] bg-[#1E1E2E]">
      <div className="flex items-center justify-between px-4 py-2 bg-[#252535] border-b border-[#3a3a4a]">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-white/10"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <span className="text-xs font-bold text-white bg-[#6C5CE7] px-2 py-0.5 rounded">{lang}</span>
        </div>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="select-none text-gray-600 w-7 flex-shrink-0 text-right mr-4 text-xs leading-6">
                {i + 1}
              </span>
              <span className="text-[#CDD6F4] leading-6">{line || " "}</span>
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
    <div className="lesson-content">
      <style>{`
        .lesson-content {
          font-family: 'Inter', system-ui, sans-serif;
          color: #1a1a2e;
          line-height: 1.8;
        }
        .lesson-content h2 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #111;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          border-bottom: none;
        }
        .lesson-content h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: #222;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .lesson-content p {
          font-size: 1rem;
          color: #2d2d2d;
          margin-bottom: 1rem;
          line-height: 1.85;
        }
        .lesson-content ul, .lesson-content ol {
          margin: 0.75rem 0 1rem 1.5rem;
        }
        .lesson-content li {
          margin-bottom: 0.35rem;
          color: #2d2d2d;
          font-size: 1rem;
        }
        .lesson-content strong {
          font-weight: 600;
          color: #111;
        }
        .lesson-content .inline-code {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.82em;
          background: #e8e6f0;
          color: #4a4080;
          padding: 0.1em 0.45em;
          border-radius: 4px;
          border: 1px solid #d0cce8;
          white-space: nowrap;
        }
      `}</style>

      {concept && (
        <div className="mb-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#6C5CE7] bg-[#6C5CE7]/10 px-3 py-1.5 rounded-full border border-[#6C5CE7]/20">
            {concept}
          </span>
        </div>
      )}

      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3 first:mt-0">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-800 text-base leading-[1.85] mb-4">{processChildren(children)}</p>
          ),
          code: ({ inline, className, children }) =>
            inline ? (
              <code className="inline-code font-semibold">{children}</code>
            ) : (
              <CodeBlock className={className}>{children}</CodeBlock>
            ),
          pre: ({ children }) => <>{children}</>,
          ul: ({ children }) => (
            <ul className="list-disc ml-6 my-3 space-y-1.5">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal ml-6 my-3 space-y-1.5">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-800 text-base leading-relaxed">{processChildren(children)}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#6C5CE7] pl-4 my-4 italic text-gray-600">
              {children}
            </blockquote>
          ),
        }}
      >
        {explanation}
      </ReactMarkdown>
    </div>
  );
}