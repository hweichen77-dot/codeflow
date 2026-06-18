import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import ProblemStatement from "../components/challenge/ProblemStatement";
import { getCompetitive } from "@/content";
import { gradeCpp } from "../lib/cppRunner";

const DIFF_NUM = { easy: "01", medium: "02", hard: "03" };

export default function CompetitiveDetail() {
  const params = new URLSearchParams(window.location.search);
  const problem = getCompetitive(params.get("id"));

  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [showEditorial, setShowEditorial] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (problem?.starter_cpp) setCode(problem.starter_cpp);
  }, [problem?.id]);

  const handleRun = async () => {
    setIsRunning(true);
    setPassed(false);
    setOutput("Compiling + running…");
    try {
      const { output: out, passed: ok, results, isError } = await gradeCpp(code, problem.test_cases);
      let text = out || "(no output)";
      if (results.length > 0) {
        const lines = results.map((r, i) =>
          `Test ${i + 1}: ${r.ok ? "PASS" : "FAIL"}` +
          (r.ok ? "" : `\n  expected: ${r.expected}\n  got:      ${r.got}`)
        );
        text += `\n\n${lines.join("\n")}`;
      }
      setOutput(text);
      setPassed(ok && !isError);
    } catch (e) {
      setOutput("Error: " + String(e?.message || e));
    }
    setIsRunning(false);
  };

  if (!problem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#c4c4c4" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Competitive")}>
          <button className="font-mono text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#b8ff00", border: "1px solid #b8ff0033" }}>
            ← Back to Competitive
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Header */}
      <div className="relative pt-20" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10">
          <Link to={createPageUrl("Competitive")} className="font-mono text-xs tracking-widest uppercase mb-8 inline-block" style={{ color: "#d4d4d4" }}>
            ← Competitive
          </Link>
          <div className="flex items-start gap-5">
            <span className="font-mono font-bold flex-shrink-0" style={{ fontSize: "3.5rem", lineHeight: 1, color: "#e8e8e8", letterSpacing: "-0.05em" }}>
              {DIFF_NUM[problem.difficulty] || "01"}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-mono text-xs tracking-widest uppercase px-2.5 py-1" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                  {problem.difficulty}
                </span>
                <span className="font-mono text-xs" style={{ color: "#d4d4d4" }}>{problem.algorithm_focus}</span>
              </div>
              <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: 0 }}>
                {problem.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 font-mono text-xs" style={{ color: "#888" }}>
                {problem.time_limit_ms && <span>⏱ {problem.time_limit_ms} ms</span>}
                {problem.memory_limit_mb && <span>▤ {problem.memory_limit_mb} MB</span>}
                <span>C++17</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10 space-y-8">
        {/* Problem statement */}
        <ProblemStatement problem={problem} />

        {/* Editor */}
        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRun}
          output={output}
          isRunning={isRunning}
          filename="solution.cpp"
        />

        {/* Passed banner */}
        <AnimatePresence>
          {passed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-4 px-6 py-5" style={{ border: "1px solid #b8ff0033", background: "#b8ff0008" }}>
              <span className="font-mono text-sm" style={{ color: "#b8ff00" }}>✓</span>
              <div>
                <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#b8ff00" }}>Accepted</div>
                <div className="font-display text-sm" style={{ color: "#c4c4c4", fontWeight: 400 }}>All test cases passed. Clean.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {problem.editorial && (
            <button onClick={() => setShowEditorial(!showEditorial)} className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150" style={{ color: showEditorial ? "#b8ff00" : "#c4c4c4", border: `1px solid ${showEditorial ? "#b8ff0033" : "#1e1e1e"}`, background: showEditorial ? "#b8ff0010" : "transparent" }}>
              {showEditorial ? "— Editorial" : "+ Editorial"}
            </button>
          )}
          {problem.solution_cpp && (
            <button onClick={() => setShowSolution(!showSolution)} className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150" style={{ color: "#e8e8e8", border: "1px solid #1a1a1a" }}>
              {showSolution ? "— Solution" : "Show Solution"}
            </button>
          )}
        </div>

        {/* Editorial */}
        <AnimatePresence>
          {showEditorial && problem.editorial && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>Editorial</span>
                </div>
                <p className="font-display text-sm leading-relaxed px-5 py-4" style={{ color: "#bbb", fontWeight: 400 }}>
                  {problem.editorial}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <AnimatePresence>
          {showSolution && problem.solution_cpp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#d4d4d4" }}>Solution</span>
                  <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>C++</span>
                </div>
                <pre className="font-mono overflow-x-auto p-5" style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#ccc" }}>
                  {problem.solution_cpp}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
