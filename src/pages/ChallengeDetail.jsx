import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Lightbulb, Eye, EyeOff, Zap, Trophy, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";

const difficultyColors = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

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
    if (challenge?.starter_code) {
      setCode(challenge.starter_code);
    }
  }, [challenge?.id]);

  const handleRun = async () => {
    setIsRunning(true);
    setPassed(false);
    try {
      let testInfo = "";
      if (challenge.test_cases && challenge.test_cases.length > 0) {
        testInfo = `\n\nTest cases to verify:\n${challenge.test_cases
          .map((tc, i) => `Test ${i + 1}: Input: ${tc.input}, Expected: ${tc.expected_output}`)
          .join("\n")}`;
      }

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a code execution simulator. Execute the following JavaScript code and return the console output. Then check if it passes the test cases (if any).

Code:
\`\`\`javascript
${code}
\`\`\`
${testInfo}

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-[400px] rounded-2xl" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Challenge not found</p>
        <Link to={createPageUrl("Challenges")}>
          <Button variant="link" className="text-[#6C5CE7] mt-2">Back to Challenges</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to={createPageUrl("Challenges")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Challenges
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">{challenge.title}</h1>
        </div>
        <Badge className={`${difficultyColors[challenge.difficulty]} border w-fit`}>
          {challenge.difficulty}
        </Badge>
        {challenge.xp_reward && (
          <Badge variant="outline" className="text-[#6C5CE7] border-[#6C5CE7]/30 w-fit">
            +{challenge.xp_reward} XP
          </Badge>
        )}
      </div>

      <p className="text-gray-500 mb-6 ml-[52px]">{challenge.description}</p>

      {/* Test Cases */}
      {challenge.test_cases && challenge.test_cases.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Test Cases</h3>
          <div className="space-y-2">
            {challenge.test_cases.map((tc, i) => (
              <div key={i} className="flex items-center gap-4 text-sm font-mono bg-gray-50 rounded-xl px-4 py-2.5">
                <span className="text-gray-400 text-xs">#{i + 1}</span>
                <span className="text-gray-600">Input: <span className="text-gray-900">{tc.input}</span></span>
                <span className="text-gray-300">→</span>
                <span className="text-gray-600">Expected: <span className="text-[#00B894] font-medium">{tc.expected_output}</span></span>
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
      />

      {/* Success Banner */}
      <AnimatePresence>
        {passed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-3"
          >
            <Trophy className="w-6 h-6 text-[#00B894]" />
            <div>
              <p className="font-semibold text-emerald-800">Challenge Complete!</p>
              <p className="text-sm text-emerald-600">All tests passed. Great job!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-4">
        {challenge.hints && challenge.hints.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl text-gray-500"
            onClick={() => setShowHints(!showHints)}
          >
            <Lightbulb className="w-4 h-4" />
            {showHints ? "Hide Hints" : "Show Hints"}
          </Button>
        )}
        {challenge.solution_code && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl text-gray-500"
            onClick={() => setShowSolution(!showSolution)}
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? "Hide Solution" : "Show Solution"}
          </Button>
        )}
      </div>

      {/* Hints */}
      <AnimatePresence>
        {showHints && challenge.hints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 overflow-hidden"
          >
            <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Hints
            </h4>
            <ol className="list-decimal pl-5 space-y-2">
              {challenge.hints.map((hint, i) => (
                <li key={i} className="text-sm text-amber-700">{hint}</li>
              ))}
            </ol>
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
            className="mt-4 overflow-hidden"
          >
            <div className="bg-[#1E1E2E] rounded-2xl p-5 border border-gray-800">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Solution</h4>
              <pre className="font-mono text-sm text-[#CDD6F4] whitespace-pre-wrap">
                {challenge.solution_code}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}