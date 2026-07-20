import React, { useState, useRef, useEffect, useCallback } from "react";
import { api, aiAvailable } from "@/api/apiClient";
import CodeAnalysis from "./CodeAnalysis";
import AIExplainModal from "./AIExplainModal";

export default function CodeEditor({
  code,
  onChange,
  onRun,
  output,
  isRunning,
  filename = "exercise.js",
  lessonTitle = "",
  solutionCode = "",
  enableAIAnalysis = false,
}) {
  const [copied, setCopied] = useState(false);
  const [aiHint, setAiHint] = useState(null);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const analysisTimer = useRef(null);

  const lines = (code || "").split("\n");

  const aiAnalysisOn = enableAIAnalysis && aiAvailable;

  const triggerAnalysis = useCallback(async (currentCode) => {
    if (!aiAnalysisOn || !solutionCode || currentCode.trim().length < 30) return;
    try {
      const result = await api.integrations.Core.InvokeLLM({
        prompt: `A student is working on a coding lesson: "${lessonTitle}".
Expected solution pattern:
\`\`\`
${solutionCode}
\`\`\`
Student's current code:
\`\`\`
${currentCode}
\`\`\`
If you notice ONE specific, actionable issue (logic error, infinite loop risk, wrong approach, off-by-one), reply with a single hint of max 15 words and nothing else. Be direct, not encouraging. If the code looks reasonable or is clearly incomplete/empty, reply with exactly: null`,
      });

      const hint = (typeof result === "string" ? result : result?.hint || "")
        .trim()
        .replace(/^["'`*\s]+|["'`*\s]+$/g, "");
      const looksOffline = /isn'?t available|not available|try again/i.test(hint);
      if (hint && !/^null\b/i.test(hint) && hint.length <= 140 && !looksOffline) {
        setAiHint(hint);
      }
    } catch (e) {
    }
  }, [aiAnalysisOn, solutionCode, lessonTitle]);

  useEffect(() => {
    if (!aiAnalysisOn) return;
    clearTimeout(analysisTimer.current);
    setAiHint(null);
    analysisTimer.current = setTimeout(() => triggerAnalysis(code), 2500);
    return () => clearTimeout(analysisTimer.current);
  }, [code, aiAnalysisOn, triggerAnalysis]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.target.blur();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.target;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (e.shiftKey) {
        const lineStart = code.lastIndexOf("\n", start - 1) + 1;
        let removed = 0;
        while (removed < 2 && code[lineStart + removed] === " ") removed++;
        if (removed === 0) return;
        const newCode = code.substring(0, lineStart) + code.substring(lineStart + removed);
        onChange(newCode);
        setTimeout(() => {
          target.selectionStart = Math.max(lineStart, start - removed);
          target.selectionEnd = Math.max(lineStart, end - removed);
        }, 0);
      } else {
        const newCode = code.substring(0, start) + "  " + code.substring(end);
        onChange(newCode);
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  const handleScroll = () => {
    if (lineNumbersRef.current && textareaRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <>
      <div className="overflow-hidden" style={{ border: "1px solid #17201C", background: "#070B0A" }}>
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid #17201C", background: "#070B0A" }}
        >
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#26302B" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#26302B" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#26302B" }} />
            </div>
            <span className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
              ~/compilearn/{filename}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="font-sans text-xs px-3 py-1.5 transition-all duration-150"
              style={{
                color: copied ? "#5ED29C" : "#B7C6BE",
                border: `1px solid ${copied ? "#5ED29C33" : "#17201C"}`,
                background: copied ? "#5ED29C10" : "transparent",
              }}
            >
              {copied ? "copied!" : "copy"}
            </button>
            <button
              onClick={() => onChange("")}
              className="font-sans text-xs px-3 py-1.5 transition-all duration-150"
              style={{ color: "#ECF3EF", border: "1px solid #17201C" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#CBD6D0"; e.currentTarget.style.borderColor = "#26302B"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#ECF3EF"; e.currentTarget.style.borderColor = "#17201C"; }}
            >
              reset
            </button>
            <button
              onClick={onRun}
              disabled={isRunning}
              className="font-sans text-xs tracking-widest uppercase px-5 py-1.5 transition-all duration-150 disabled:opacity-50"
              style={{ background: "#5ED29C", color: "#070B0A", fontWeight: 700, border: "1px solid #5ED29C" }}
              onMouseEnter={e => { if (!isRunning) { e.currentTarget.style.boxShadow = "0 0 20px rgba(94,210,156,0.2)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}
            >
              {isRunning ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: "#070B0A" }} />
                  running
                </span>
              ) : "▶ run"}
            </button>
          </div>
        </div>

        <div className="flex relative" style={{ minHeight: "280px", maxHeight: "500px" }}>
          <div
            ref={lineNumbersRef}
            className="font-mono text-right select-none overflow-hidden flex-shrink-0 py-5 px-4"
            style={{ fontSize: "0.75rem", lineHeight: "1.6rem", color: "#ECF3EF", borderRight: "1px solid #17201C", width: "3rem" }}
          >
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            aria-label={`Code editor for ${filename}`}
            className="flex-1 bg-transparent font-mono py-5 pl-4 pr-5 resize-none outline-none overflow-auto"
            style={{ fontSize: "0.8125rem", lineHeight: "1.6rem", color: "#FFFFFF", caretColor: "#5ED29C" }}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>

        {aiAnalysisOn && (
          <CodeAnalysis
            hint={aiHint}
            onDismiss={() => setAiHint(null)}
            onExplain={() => setShowExplainModal(true)}
          />
        )}

        {output !== undefined && output !== null && (
          <div role="status" aria-live="polite" style={{ borderTop: "1px solid #17201C" }}>
            <div className="flex items-center gap-3 px-5 py-2.5" style={{ background: "#070B0A", borderBottom: "1px solid #17201C" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#5ED29C" }} />
              <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECF3EF" }}>output</span>
            </div>
            <div
              className="font-mono py-5 px-5 overflow-auto"
              style={{ fontSize: "0.75rem", lineHeight: "1.6", minHeight: "60px", maxHeight: "180px", background: "#080808" }}
            >
              {output.split("\n").map((line, i) => (
                <div
                  key={i}
                  style={{ color: line.startsWith("Error") || line.startsWith("[error]") ? "#FF6B5C" : "#5ED29C" }}
                >
                  {line || "\u00a0"}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showExplainModal && aiHint && (
        <AIExplainModal
          hint={aiHint}
          studentCode={code}
          solutionCode={solutionCode}
          lessonTitle={lessonTitle}
          onClose={() => setShowExplainModal(false)}
        />
      )}
    </>
  );
}