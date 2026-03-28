import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";

const DIFF_NUM = { easy: "01", medium: "02", hard: "03" };

export default function ChallengeDetail() {
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get("id");

  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: async () => {
      const results = await base44.entities.Challenge.filter({ id: challengeId });
      return results[0];
    },
    enabled: !!challengeId,
  });

  useEffect(() => {
    if (challenge?.starter_code) setCode(challenge.starter_code);
  }, [challenge?.id]);

  const handleRun = async () => {
    setIsRunning(true);
    setPassed(false);
    try {
      let testInfo = "";
      if (challenge.test_cases && challenge.test_cases.length > 0) {
        testInfo = `\n\nTest cases:\n${challenge.test_cases
          .map((tc, i) => `Test ${i + 1}: Input: ${tc.input}, Expected: ${tc.expected_output}`)
          .join("\n")}`;
      }
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a code execution simulator. Execute the following JavaScript code and return the console output. Then check if it passes the test cases (if any).\n\nCode:\n\`\`\`javascript\n${code}\n\`\`\`\n${testInfo}\n\nReturn ONLY in this format:\nOUTPUT:\n[the console output here]\n\nTESTS:\n[PASS or FAIL for each test, or "No tests" if none]\n\nRESULT: [PASSED or FAILED]`,
        response_json_schema: {
          type: "object",
          properties: {
            output: { type: "string" },
            tests_passed: { type: "boolean" },
            test_results: { type: "string" },
          },
        },
      });
      const outputText = result.output || "No output";
      const testResults = result.test_results || "";
      setOutput(outputText + (testResults ? `\n\n${testResults}` : ""));
      setPassed(result.tests_passed === true);
    } catch {
      setOutput("Error: Could not run code. Please try again.");
    }
    setIsRunning(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase animate-pulse" style={{ color: "#333" }}>
          Loading challenge...
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#444" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Challenges")}>
          <button className="font-mono text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#b8ff00", border: "1px solid #b8ff0033" }}>
            ← Back to Challenges
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
          <Link
            to={createPageUrl("Challenges")}
            className="font-mono text-xs tracking-widest uppercase mb-8 inline-block transition-colors duration-150"
            style={{ color: "#333" }}
            onMouseEnter={e => e.currentTarget.style.color = "#b8ff00"}
            onMouseLeave={e => e.currentTarget.style.color = "#333"}
          >
            ← Challenges
          </Link>

          <div className="flex items-start gap-5">
            <span
              className="font-mono font-bold flex-shrink-0"
              style={{ fontSize: "3.5rem", lineHeight: 1, color: "#141414", letterSpacing: "-0.05em" }}
            >
              {DIFF_NUM[challenge.difficulty] || "01"}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="font-mono text-xs tracking-widest uppercase px-2.5 py-1"
                  style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                >
                  {challenge.difficulty}
                </span>
                {challenge.xp_reward && (
                  <span className="font-mono text-xs" style={{ color: "#444" }}>
                    +{challenge.xp_reward}xp
                  </span>
                )}
              </div>
              <h1
                className="font-display font-black leading-tight"
                style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
              >
                {challenge.title}
              </h1>
              <p className="font-display text-sm mt-2 leading-relaxed" style={{ color: "#555", fontWeight: 400 }}>
                {challenge.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10 space-y-8">
        {/* Test cases */}
        {challenge.test_cases && challenge.test_cases.length > 0 && (
          <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
            <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#444" }}>
                Test Cases
              </span>
            </div>
            <div className="px-5 py-4 space-y-2">
              {challenge.test_cases.map((tc, i) => (
                <div key={i} className="flex items-center gap-4 font-mono text-xs py-2" style={{ borderBottom: i < challenge.test_cases.length - 1 ? "1px solid #111" : "none" }}>
                  <span style={{ color: "#333" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ color: "#444" }}>in: <span style={{ color: "#888" }}>{tc.input}</span></span>
                  <span style={{ color: "#222" }}>→</span>
                  <span style={{ color: "#555" }}>expect: <span style={{ color: "#b8ff00" }}>{tc.expected_output}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        <CodeEditor
          code={code}
          onChange={setCode}
          onRun={handleRun}
          output={output}
          isRunning={isRunning}
          filename={`challenge.js`}
        />

        {/* Passed banner */}
        <AnimatePresence>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 px-6 py-5"
              style={{ border: "1px solid #b8ff0033", background: "#b8ff0008" }}
            >
              <span className="font-mono text-sm" style={{ color: "#b8ff00" }}>✓</span>
              <div>
                <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#b8ff00" }}>
                  Challenge Complete
                </div>
                <div className="font-display text-sm" style={{ color: "#666", fontWeight: 400 }}>
                  All tests passed. Well done.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          {challenge.hints && challenge.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
              style={{
                color: showHints ? "#b8ff00" : "#444",
                border: `1px solid ${showHints ? "#b8ff0033" : "#1e1e1e"}`,
                background: showHints ? "#b8ff0010" : "transparent",
              }}
            >
              {showHints ? "— Hints" : "+ Hints"}
            </button>
          )}
          {challenge.solution_code && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
              style={{ color: "#333", border: "1px solid #1a1a1a" }}
              onMouseEnter={e => e.currentTarget.style.color = "#888"}
              onMouseLeave={e => e.currentTarget.style.color = "#333"}
            >
              {showSolution ? "— Solution" : "Show Solution"}
            </button>
          )}
        </div>

        {/* Hints */}
        <AnimatePresence>
          {showHints && challenge.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>Hints</span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {challenge.hints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#333" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display text-sm leading-relaxed" style={{ color: "#666", fontWeight: 400 }}>
                        {hint}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution */}
        <AnimatePresence>
          {showSolution && challenge.solution_code && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                  <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#555" }}>Solution</span>
                  <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>JS</span>
                </div>
                <pre className="font-mono overflow-x-auto p-5" style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#888" }}>
                  {challenge.solution_code}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AIChatbot
        context={challenge?.description || ""}
        lessonTitle={challenge?.title || "Challenge"}
      />
    </div>
  );
}