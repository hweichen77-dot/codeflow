import React, { useState, useRef } from "react";
import { Play, RotateCcw, Copy, Check, Loader2 } from "lucide-react";

export default function CodeEditor({ code, onChange, onRun, output, isRunning, filename = "exercise.js" }) {
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  const lines = (code || "").split("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      onChange(newCode);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div
      className="overflow-hidden"
      style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#2a2a2a" }} />
          </div>
          <span className="font-mono text-xs" style={{ color: "#333" }}>
            ~/codeflow/{filename}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="font-mono text-xs px-3 py-1.5 transition-all duration-150"
            style={{
              color: copied ? "#b8ff00" : "#444",
              border: `1px solid ${copied ? "#b8ff0033" : "#1e1e1e"}`,
              background: copied ? "#b8ff0010" : "transparent",
            }}
          >
            {copied ? "copied!" : "copy"}
          </button>
          <button
            onClick={() => onChange("")}
            className="font-mono text-xs px-3 py-1.5 transition-all duration-150"
            style={{ color: "#333", border: "1px solid #1e1e1e" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#333"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
          >
            reset
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="font-mono text-xs tracking-widest uppercase px-5 py-1.5 transition-all duration-150 disabled:opacity-50"
            style={{
              background: "#b8ff00",
              color: "#0a0a0a",
              fontWeight: 700,
              border: "1px solid #b8ff00",
            }}
            onMouseEnter={e => {
              if (!isRunning) {
                e.currentTarget.style.boxShadow = "0 0 20px rgba(184,255,0,0.2)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            {isRunning ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#0a0a0a" }}
                />
                running
              </span>
            ) : (
              "▶ run"
            )}
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex relative" style={{ minHeight: "280px", maxHeight: "500px" }}>
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="font-mono text-right select-none overflow-hidden flex-shrink-0 py-5 px-4"
          style={{
            fontSize: "0.75rem",
            lineHeight: "1.6rem",
            color: "#2a2a2a",
            borderRight: "1px solid #1a1a1a",
            width: "3rem",
          }}
        >
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          className="flex-1 bg-transparent font-mono py-5 pl-4 pr-5 resize-none outline-none overflow-auto"
          style={{
            fontSize: "0.8125rem",
            lineHeight: "1.6rem",
            color: "#c8c8c8",
            caretColor: "#b8ff00",
          }}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Output panel */}
      {output !== undefined && output !== null && (
        <div style={{ borderTop: "1px solid #1a1a1a" }}>
          {/* Output header */}
          <div
            className="flex items-center gap-3 px-5 py-2.5"
            style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#b8ff00" }}
            />
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#333" }}>
              output
            </span>
          </div>
          <div
            className="font-mono py-5 px-5 overflow-auto"
            style={{ fontSize: "0.75rem", lineHeight: "1.6", minHeight: "60px", maxHeight: "180px", background: "#080808" }}
          >
            {output.split("\n").map((line, i) => (
              <div
                key={i}
                style={{
                  color: line.startsWith("Error") || line.startsWith("❌")
                    ? "#ff6b6b"
                    : "#b8ff00",
                }}
              >
                {line || "\u00a0"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}