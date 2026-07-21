import React, { useState, useRef, useEffect, useCallback } from "react";
import { api, aiAvailable } from "@/api/apiClient";
import CodeAnalysis from "./CodeAnalysis";
import AIExplainModal from "./AIExplainModal";
import { highlight, langFromFilename } from "./highlight";

const EDITOR_BG = "#1e1e1e";
const FONT_SIZE = "16px";
const LINE_HEIGHT = "1.6";
const MONO = "'Spline Sans Mono Variable', ui-monospace, 'SF Mono', Menlo, monospace";

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
  onSubmit,
  isSubmitting = false,
  submitResults = null,
  runLabel = "run",
}) {
  const [copied, setCopied] = useState(false);
  const [aiHint, setAiHint] = useState(null);
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [review, setReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightRef = useRef(null);
  const analysisTimer = useRef(null);

  const twoTier = typeof onSubmit === "function";
  const lang = langFromFilename(filename);
  const lines = (code || "").split("\n");
  const highlighted = highlight(code, lang);

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

  useEffect(() => {
    setReview(null);
  }, [submitResults]);

  const requestReview = async () => {
    setReviewLoading(true);
    setReview(null);
    try {
      const result = await api.integrations.Core.InvokeLLM({
        prompt: `You are a senior code reviewer. Review this ${lang} solution for the exercise "${lessonTitle || filename}".
\`\`\`${lang}
${code}
\`\`\`
Give concise feedback in three labeled parts, one to two sentences each:
Readability: ...
Maintainability: ...
Performance: ...
Be direct and specific to the code shown. Under 130 words total.`,
        max_tokens: 320,
      });
      setReview(typeof result === "string" ? result : result?.text || "");
    } catch (e) {
      setReview("Could not reach the reviewer right now.");
    }
    setReviewLoading(false);
  };

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
    const ta = textareaRef.current;
    if (lineNumbersRef.current && ta) lineNumbersRef.current.scrollTop = ta.scrollTop;
    if (highlightRef.current && ta) {
      highlightRef.current.style.transform = `translate(${-ta.scrollLeft}px, ${-ta.scrollTop}px)`;
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
            {!twoTier && (
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
            )}
          </div>
        </div>

        <div className="flex relative" style={{ minHeight: "280px", maxHeight: "500px", background: EDITOR_BG }}>
          <div
            ref={lineNumbersRef}
            className="text-right select-none overflow-hidden flex-shrink-0 py-5 px-4"
            style={{ fontFamily: MONO, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT, color: "#858585", borderRight: "1px solid #2a2a2a", width: "3.5rem" }}
          >
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <div className="relative flex-1 overflow-hidden">
            <pre
              ref={highlightRef}
              aria-hidden="true"
              className="absolute top-0 left-0 m-0 py-5 pl-4 pr-5 pointer-events-none"
              style={{ fontFamily: MONO, fontSize: FONT_SIZE, lineHeight: LINE_HEIGHT, whiteSpace: "pre", color: "#d4d4d4", willChange: "transform" }}
              dangerouslySetInnerHTML={{ __html: highlighted + "\n" }}
            />
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              aria-label={`Code editor for ${filename}`}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className="absolute inset-0 w-full h-full bg-transparent py-5 pl-4 pr-5 resize-none outline-none overflow-auto"
              style={{
                fontFamily: MONO,
                fontSize: FONT_SIZE,
                lineHeight: LINE_HEIGHT,
                whiteSpace: "pre",
                color: "transparent",
                WebkitTextFillColor: "transparent",
                caretColor: "#5ED29C",
              }}
            />
          </div>
        </div>

        {twoTier && (
          <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: "1px solid #17201C", background: "#070B0A" }}>
            <button
              onClick={onRun}
              disabled={isRunning}
              className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150 disabled:opacity-50"
              style={{ color: "#ECF3EF", border: "1px solid #26302B", background: "transparent" }}
              onMouseEnter={e => { if (!isRunning) e.currentTarget.style.borderColor = "#3a463f"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#26302B"; }}
            >
              {isRunning ? "running…" : `▶ ${runLabel}`}
            </button>
            <button
              onClick={onSubmit}
              disabled={isSubmitting || isRunning}
              className="font-sans text-xs tracking-widest uppercase px-6 py-2 transition-all duration-150 disabled:opacity-50"
              style={{ background: "#56BD5B", color: "#04140A", fontWeight: 700, border: "1px solid #56BD5B" }}
              onMouseEnter={e => { if (!isSubmitting) { e.currentTarget.style.boxShadow = "0 0 20px rgba(86,189,91,0.25)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = ""; }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: "#04140A" }} />
                  submitting
                </span>
              ) : "submit ▸"}
            </button>
          </div>
        )}

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
              <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECF3EF" }}>{twoTier ? "console" : "output"}</span>
            </div>
            <div
              className="font-mono py-5 px-5 overflow-auto"
              style={{ fontSize: "0.8125rem", lineHeight: "1.6", minHeight: "60px", maxHeight: "180px", background: "#080808" }}
            >
              {output.split("\n").map((line, i) => (
                <div
                  key={i}
                  style={{ color: line.startsWith("Error") || line.startsWith("[error]") ? "#FF6B5C" : "#5ED29C" }}
                >
                  {line || " "}
                </div>
              ))}
            </div>
          </div>
        )}

        {submitResults && (
          <SubmitResults
            results={submitResults}
            onReview={requestReview}
            review={review}
            reviewLoading={reviewLoading}
            reviewAvailable={aiAvailable}
          />
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

function SubmitResults({ results, onReview, review, reviewLoading, reviewAvailable }) {
  const rows = results.results || [];
  const total = rows.length || results.total || 0;
  const passedCount = rows.filter((r) => r.ok).length;
  const allPass = results.passed && (total === 0 || passedCount === total);
  const firstError = rows.findIndex((r) => !r.ok);
  const pct = typeof results.percentile === "number" ? results.percentile : null;

  return (
    <div style={{ borderTop: "1px solid #17201C" }}>
      <div className="flex items-center justify-between px-5 py-2.5" style={{ background: "#070B0A", borderBottom: "1px solid #17201C" }}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: allPass ? "#56BD5B" : "#FF6B5C" }} />
          <span className="font-sans text-xs tracking-widest uppercase" style={{ color: allPass ? "#56BD5B" : "#FF6B5C" }}>
            {allPass ? "accepted" : "failed"}
          </span>
        </div>
        <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>
          {passedCount}/{total} tests passed
        </span>
      </div>

      {pct != null && allPass && (
        <div className="px-5 py-3" style={{ borderBottom: "1px solid #17201C", background: "#080808" }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>runtime</span>
            <span className="font-sans text-xs" style={{ color: "#56BD5B" }}>beats {pct}%</span>
          </div>
          <div style={{ height: 6, background: "#17201C", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: "#56BD5B" }} />
          </div>
        </div>
      )}

      <div className="py-2" style={{ background: "#080808" }}>
        {rows.length === 0 && (
          <div className="px-5 py-3 font-mono text-xs" style={{ color: "#B7C6BE" }}>No test cases to grade.</div>
        )}
        {rows.map((r, i) => {
          const isFirstError = i === firstError;
          return (
            <div
              key={i}
              className="px-5 py-2.5"
              style={{
                borderLeft: isFirstError ? "2px solid #FF6B5C" : "2px solid transparent",
                background: isFirstError ? "#FF6B5C0a" : "transparent",
              }}
            >
              <div className="flex items-center gap-3 font-mono text-xs">
                <span style={{ color: r.ok ? "#56BD5B" : "#FF6B5C", fontWeight: 700 }}>{r.ok ? "✓" : "✕"}</span>
                <span style={{ color: "#ECF3EF" }}>{r.name || `Test ${i + 1}`}</span>
              </div>
              {!r.ok && (
                <div className="mt-1.5 ml-6 font-mono text-xs space-y-0.5">
                  <div style={{ color: "#B7C6BE" }}>expected: <span style={{ color: "#5ED29C" }}>{fmt(r.expected)}</span></div>
                  <div style={{ color: "#B7C6BE" }}>actual:   <span style={{ color: "#FF6B5C" }}>{fmt(r.got)}</span></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {reviewAvailable && (
        <div className="px-5 py-3" style={{ borderTop: "1px solid #17201C", background: "#070B0A" }}>
          {!review && !reviewLoading && (
            <button
              onClick={onReview}
              className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
              style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#5ED29C66"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#5ED29C33"}
            >
              AI code review
            </button>
          )}
          {reviewLoading && (
            <div className="flex items-center gap-2 font-sans text-xs" style={{ color: "#ECF3EF" }}>
              <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ background: "#5ED29C" }} />
              reviewing your code…
            </div>
          )}
          {review && (
            <div>
              <div className="font-sans text-xs mb-2" style={{ color: "#5ED29C" }}>AI review</div>
              <div className="font-display text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                {review}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function fmt(v) {
  const s = String(v == null ? "" : v);
  return s.length > 200 ? s.slice(0, 200) + "…" : s || "(empty)";
}
