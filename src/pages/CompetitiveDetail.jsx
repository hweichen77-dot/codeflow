import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#15130E" }}>
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Competitive")}>
          <button className="font-sans text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#E8A33C", border: "1px solid #E8A33C33" }}>
            ← Back to Competitive
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#15130E", minHeight: "100vh" }}>
      <div className="relative pt-20" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10">
          <Link to={createPageUrl("Competitive")} className="font-sans text-xs tracking-widest uppercase mb-8 inline-block" style={{ color: "#FFFFFF" }}>
            ← Competitive
          </Link>
          <div className="flex items-start gap-5">
            <span className="font-sans font-bold flex-shrink-0" style={{ fontSize: "3.5rem", lineHeight: 1, color: "#ECE7DC", letterSpacing: "-0.05em" }}>
              {DIFF_NUM[problem.difficulty] || "01"}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="font-sans text-xs tracking-widest uppercase px-2.5 py-1" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
                  {problem.difficulty}
                </span>
                <span className="font-sans text-xs" style={{ color: "#C9C1B2" }}>{problem.algorithm_focus}</span>
              </div>
              <h1 style={{ fontFamily: font.display, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: 0 }}>
                {problem.title}
              </h1>
              <div className="flex items-center gap-4 mt-3 font-sans text-xs" style={{ color: "#8F8779" }}>
                {problem.time_limit_ms && <span>⏱ {problem.time_limit_ms} ms</span>}
                {problem.memory_limit_mb && <span>▤ {problem.memory_limit_mb} MB</span>}
                <span>C++17</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10 space-y-8">
        <ProblemStatement problem={problem} />

        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRun}
          output={output}
          isRunning={isRunning}
          filename="solution.cpp"
        />

        <AnimatePresence>
          {passed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-4 px-6 py-5" style={{ border: "1px solid #E8A33C33", background: "#E8A33C08" }}>
              <span className="font-sans text-sm" style={{ color: "#E8A33C" }}>✓</span>
              <div>
                <div className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#E8A33C" }}>Accepted</div>
                <div className="font-display text-sm" style={{ color: "#BBB3A4", fontWeight: 400 }}>All test cases passed. Clean.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-wrap gap-3">
          {problem.editorial && (
            <button onClick={() => setShowEditorial(!showEditorial)} className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150" style={{ color: showEditorial ? "#E8A33C" : "#FFFFFF", border: `1px solid ${showEditorial ? "#E8A33C33" : "#262219"}`, background: showEditorial ? "#E8A33C10" : "transparent" }}>
              {showEditorial ? "— Editorial" : "+ Editorial"}
            </button>
          )}
          {problem.solution_cpp && (
            <button onClick={() => setShowSolution(!showSolution)} className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150" style={{ color: "#ECE7DC", border: "1px solid #262219" }}>
              {showSolution ? "— Solution" : "Show Solution"}
            </button>
          )}
        </div>

        <AnimatePresence>
          {showEditorial && problem.editorial && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div style={{ border: "1px solid #262219", background: "#131009" }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #262219" }}>
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#E8A33C" }}>Editorial</span>
                </div>
                <p className="font-display text-sm leading-relaxed px-5 py-4" style={{ color: "#A8A092", fontWeight: 400 }}>
                  {problem.editorial}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSolution && problem.solution_cpp && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div style={{ border: "1px solid #262219", background: "#131009" }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #262219" }}>
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>Solution</span>
                  <span className="font-sans text-xs px-2 py-0.5" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>C++</span>
                </div>
                <pre className="font-mono overflow-x-auto p-5" style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#C2BAAA" }}>
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
