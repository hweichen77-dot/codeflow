import React, { useState } from "react";
import { api } from "@/api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../editor/CodeEditor";

export default function LessonChallenge({ lesson }) {
  const [code, setCode] = useState(lesson.challenge_starter_code || "");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const hasChallenge = lesson.challenge_title || lesson.challenge_description;
  if (!hasChallenge) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setPassed(false);
    try {
      let testInfo = "";
      if (lesson.challenge_test_cases?.length > 0) {
        testInfo = `\n\nTest cases:\n${lesson.challenge_test_cases
          .map((tc, i) => `Test ${i + 1}: Input: ${tc.input}, Expected: ${tc.expected_output}`)
          .join("\n")}`;
      }

      const result = await api.integrations.Core.InvokeLLM({
        prompt: `You are a code execution simulator. Run the following Python code and return the output.${testInfo}

Code:
\`\`\`python
${code}
\`\`\`

Return ONLY this JSON:
- output: what would print to console
- tests_passed: true if all test cases pass (or true if no test cases)
- test_results: brief summary of test results`,
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
      setOutput("Error: Could not run code.");
    }
    setIsRunning(false);
  };

  return (
    <div style={{ border: "1px solid #1e1e1e" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: "1px solid #1e1e1e", background: "#0d0d0d" }}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase px-2 py-1"
          style={{ color: "#ffb300", border: "1px solid #ffb30033", background: "#ffb30010" }}
        >
          CHALLENGE
        </div>
        <span className="font-display text-sm font-semibold" style={{ color: "#ccc" }}>
          {lesson.challenge_title}
        </span>
      </div>

      <div className="px-6 py-5">
        {/* Description */}
        {lesson.challenge_description && (
          <p className="font-display text-sm leading-relaxed mb-5" style={{ color: "#888", fontWeight: 400 }}>
            {lesson.challenge_description}
          </p>
        )}

        {/* Test cases */}
        {lesson.challenge_test_cases?.length > 0 && (
          <div className="mb-5" style={{ border: "1px solid #1a1a1a" }}>
            <div
              className="px-4 py-2 font-mono text-xs tracking-widest uppercase"
              style={{ borderBottom: "1px solid #1a1a1a", color: "#333", background: "#0a0a0a" }}
            >
              test cases
            </div>
            {lesson.challenge_test_cases.map((tc, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-6 px-4 py-3 font-mono text-xs"
                style={{ borderBottom: i < lesson.challenge_test_cases.length - 1 ? "1px solid #111" : "none" }}
              >
                <span style={{ color: "#2a2a2a" }}>#{i + 1}</span>
                <span><span style={{ color: "#444" }}>in </span><span style={{ color: "#888" }}>{tc.input}</span></span>
                <span style={{ color: "#2a2a2a" }}>→</span>
                <span><span style={{ color: "#444" }}>out </span><span style={{ color: "#b8ff00" }}>{tc.expected_output}</span></span>
              </div>
            ))}
          </div>
        )}

        {/* Editor */}
        <div className="mb-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            output={output}
            isRunning={isRunning}
            filename="challenge.js"
          />
        </div>

        {/* Pass banner */}
        <AnimatePresence>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-5 py-4 flex items-center gap-3"
              style={{ border: "1px solid #b8ff0033", background: "#b8ff0008", borderLeft: "2px solid #b8ff00" }}
            >
              <span style={{ color: "#b8ff00" }}>✓</span>
              <div>
                <div className="font-display font-bold text-sm" style={{ color: "#e8e8e8" }}>Challenge complete.</div>
                <div className="font-display text-xs" style={{ color: "#666" }}>All tests passed.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Solution toggle */}
        {lesson.challenge_solution_code && (
          <div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150 mb-3"
              style={{
                border: `1px solid ${showSolution ? "#b8ff0033" : "#1e1e1e"}`,
                color: showSolution ? "#b8ff00" : "#444",
                background: showSolution ? "#b8ff0010" : "transparent",
              }}
            >
              {showSolution ? "Hide Solution" : "/ Solution"}
            </button>
            <AnimatePresence>
              {showSolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                    <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #1a1a1a" }}>
                      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#555" }}>solution.js</span>
                    </div>
                    <pre
                      className="font-mono overflow-x-auto p-5"
                      style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#888" }}
                    >
                      {lesson.challenge_solution_code}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}