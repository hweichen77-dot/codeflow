import React, { useState } from "react";
import { api } from "@/api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
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
    <div style={{ border: "1px solid #e4e4e7", borderRadius: "4px", background: "#ffffff" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase px-2 py-1"
          style={{ color: "#b45309", border: "1px solid #b4530933", background: "#b4530914" }}
        >
          CHALLENGE
        </div>
        <span className="font-display text-sm font-semibold" style={{ color: "#18181b" }}>
          {lesson.challenge_title}
        </span>
      </div>

      <div className="px-6 py-5">
        {/* Description */}
        {lesson.challenge_description && (
          <p className="font-display text-sm leading-relaxed mb-5" style={{ color: "#3f3f46", fontWeight: 400 }}>
            {lesson.challenge_description}
          </p>
        )}

        {/* Test cases */}
        {lesson.challenge_test_cases?.length > 0 && (
          <div className="mb-5" style={{ border: "1px solid #e4e4e7", borderRadius: "4px", overflow: "hidden" }}>
            <div
              className="px-4 py-2 font-mono text-xs tracking-widest uppercase"
              style={{ borderBottom: "1px solid #e4e4e7", color: "#6b7280", background: "#fafafa" }}
            >
              test cases
            </div>
            {lesson.challenge_test_cases.map((tc, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-6 px-4 py-3 font-mono text-xs"
                style={{ background: "#f6f6f7", borderBottom: i < lesson.challenge_test_cases.length - 1 ? "1px solid #e4e4e7" : "none" }}
              >
                <span style={{ color: "#6b7280" }}>#{i + 1}</span>
                <span><span style={{ color: "#6b7280" }}>in </span><span style={{ color: "#1f2937" }}>{tc.input}</span></span>
                <span style={{ color: "#6b7280" }}>→</span>
                <span><span style={{ color: "#6b7280" }}>out </span><span style={{ color: "#166534" }}>{tc.expected_output}</span></span>
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
              style={{ border: "1px solid #05966933", background: "#05966914", borderLeft: "2px solid #059669", borderRadius: "4px" }}
            >
              <CheckCircle2 size={18} color="#059669" strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <div>
                <div className="font-display font-bold text-sm" style={{ color: "#18181b" }}>Challenge complete.</div>
                <div className="font-display text-xs" style={{ color: "#52525b" }}>All tests passed.</div>
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
                borderRadius: "4px",
                border: `1px solid ${showSolution ? "#4d7c0f33" : "#d4d4d8"}`,
                color: showSolution ? "#4d7c0f" : "#3f3f46",
                background: showSolution ? "#4d7c0f14" : "transparent",
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
                  <div style={{ border: "1px solid #e4e4e7", borderRadius: "4px", overflow: "hidden", background: "#f6f6f7" }}>
                    <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #e4e4e7", background: "#fafafa" }}>
                      <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#6b7280" }}>solution.js</span>
                    </div>
                    <pre
                      className="font-mono overflow-x-auto p-5"
                      style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#1f2937" }}
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