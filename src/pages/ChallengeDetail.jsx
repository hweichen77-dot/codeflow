import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";

const DIFFICULTY_MARK = { easy: "▲", medium: "▲▲", hard: "▲▲▲" };
const DIFFICULTY_COLOR = { easy: "#b8ff00", medium: "#ffb300", hard: "#ff5555" };

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
      if (challenge.test_cases?.length > 0) {
        testInfo = `\n\nTest cases:\n${challenge.test_cases
          .map((tc, i) => `Test ${i + 1}: Input: ${tc.input}, Expected: ${tc.expected_output}`)
          .join("\n")}`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a code execution simulator. Execute the following JavaScript code and return the console output.${testInfo}

Code:
\`\`\`javascript
${code}
\`\`\`

Return ONLY in this format:
OUTPUT:
[the console output here]

TESTS:
[PASS or FAIL for each test, or "No tests" if none]

RESULT: [PASSED or FAILED]`,
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
        <div className="font-mono text-sm" style={{ color: "#333" }}>
          loading challenge<span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <Link to={createPageUrl("Challenges")}>
          <button
            className="font-mono text-xs tracking-widest uppercase px-6 py-3"
            style={{ border: "1px solid #1e1e1e", color: "#555" }}
          >
            ← Back to Challenges
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 px-8 lg:px-16 py-4 flex items-center justify-between"
        style={{ background: "rgba(10,10,10,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid #1a1a1a" }}
      >
        <Link
          to={createPageUrl("Challenges")}
          className="font-mono text-xs tracking-widest uppercase transition-colors"
          style={{ color: "#333" }}
          onMouseEnter={e => e.currentTarget.style.color = "#888"}
          onMouseLeave={e => e.currentTarget.style.color = "#333"}
        >
          ← Challenges
        </Link>
        <div className="flex items-center gap-4">
          <span
            className="font-mono text-xs"
            style={{ color: DIFFICULTY_COLOR[challenge.difficulty] || "#888" }}
          >
            {DIFFICULTY_MARK[challenge.difficulty] || ""}
          </span>
          {challenge.xp_reward && (
            <span className="font-mono text-xs" style={{ color: "#333" }}>
              +{challenge.xp_reward} XP
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 lg:px-16 py-16">
        {/* Challenge header */}
        <div className="mb-12">
          <div
            className="font-mono text-xs tracking-widest uppercase mb-4"
            style={{ color: DIFFICULTY_COLOR[challenge.difficulty] || "#b8ff00" }}
          >
            {challenge.difficulty} challenge
          </div>
          <h1
            className="font-display font-black leading-none mb-6"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em", color: "#e8e8e8" }}
          >
            {challenge.title}
          </h1>
          <p className="font-display text-base leading-relaxed" style={{ color: "#666", fontWeight: 400 }}>
            {challenge.description}
          </p>
        </div>

        {/* Test cases */}
        {challenge.test_cases?.length > 0 && (
          <div className="mb-10" style={{ border: "1px solid #1a1a1a" }}>
            <div
              className="px-6 py-3 font-mono text-xs tracking-widest uppercase"
              style={{ borderBottom: "1px solid #1a1a1a", color: "#333", background: "#0d0d0d" }}
            >
              test cases
            </div>
            <div>
              {challenge.test_cases.map((tc, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-center gap-6 px-6 py-4 font-mono text-sm"
                  style={{ borderBottom: i < challenge.test_cases.length - 1 ? "1px solid #0f0f0f" : "none" }}
                >
                  <span className="text-xs" style={{ color: "#2a2a2a" }}>#{i + 1}</span>
                  <div>
                    <span className="text-xs" style={{ color: "#444" }}>input </span>
                    <span className="text-xs" style={{ color: "#888" }}>{tc.input}</span>
                  </div>
                  <span style={{ color: "#2a2a2a" }}>→</span>
                  <div>
                    <span className="text-xs" style={{ color: "#444" }}>expected </span>
                    <span className="text-xs" style={{ color: "#b8ff00" }}>{tc.expected_output}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code editor */}
        <div className="mb-8">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            output={output}
            isRunning={isRunning}
            filename="challenge.js"
          />
        </div>

        {/* Success banner */}
        <AnimatePresence>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 px-6 py-5 flex items-center gap-4"
              style={{ border: "1px solid #b8ff0033", background: "#b8ff0008", borderLeft: "2px solid #b8ff00" }}
            >
              <span className="font-mono text-base" style={{ color: "#b8ff00" }}>✓</span>
              <div>
                <div className="font-display font-bold" style={{ color: "#e8e8e8" }}>All tests passed.</div>
                <div className="font-display text-sm" style={{ color: "#666" }}>Nice work. Challenge complete.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          {challenge.hints?.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
              style={{
                border: `1px solid ${showHints ? "#b8ff0033" : "#1e1e1e"}`,
                color: showHints ? "#b8ff00" : "#444",
                background: showHints ? "#b8ff0010" : "transparent",
              }}
            >
              {showHints ? "hide hints" : "/ hints"}
            </button>
          )}
          {challenge.solution_code && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
              style={{
                border: `1px solid ${showSolution ? "#b8ff0033" : "#1e1e1e"}`,
                color: showSolution ? "#b8ff00" : "#444",
                background: showSolution ? "#b8ff0010" : "transparent",
              }}
            >
              {showSolution ? "hide solution" : "/ solution"}
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
              className="mb-6 overflow-hidden"
            >
              <div style={{ border: "1px solid #1e1e1e", borderLeft: "2px solid #b8ff00" }}>
                <div
                  className="px-6 py-3 font-mono text-xs tracking-widest uppercase"
                  style={{ borderBottom: "1px solid #1a1a1a", color: "#b8ff00", background: "#0d0d0d" }}
                >
                  hints
                </div>
                <div className="px-6 py-5 space-y-3">
                  {challenge.hints.map((hint, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#333" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display text-sm" style={{ color: "#666", fontWeight: 400 }}>
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
              className="mb-6 overflow-hidden"
            >
              <div style={{ border: "1px solid #1e1e1e" }}>
                <div
                  className="px-5 py-3 flex items-center gap-3"
                  style={{ borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}
                >
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                    <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                    <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                  </div>
                  <span className="font-mono text-xs" style={{ color: "#333" }}>solution.js</span>
                </div>
                <pre
                  className="font-mono overflow-x-auto py-5 px-6"
                  style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#888", background: "#0d0d0d" }}
                >
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