import React, { useState, useEffect } from "react";
import "@/styles/landing.css";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import { Stagger, StaggerItem } from "@/lib/motion";
import { Card } from "@/components/ui/kit";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";
import ProblemStatement from "../components/challenge/ProblemStatement";
import { gradePython } from "../lib/pyRunner";
import { markChallengeComplete } from "../api/progressStore";

const DIFF_NUM = { beginner: "01", easy: "01", intermediate: "02", medium: "02", advanced: "03", hard: "03" };

export default function ChallengeDetail() {
  const params = new URLSearchParams(window.location.search);
  const challengeId = params.get("id");

  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showPrimer, setShowPrimer] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);

  const { data: challenge, isLoading } = useQuery({
    queryKey: ["challenge", challengeId],
    queryFn: async () => {
      const results = await api.entities.Challenge.filter({ id: challengeId });
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
    setOutput("Running…");
    try {
      const { output: out, passed: ok, results, isError } = await gradePython(code, challenge.test_cases);
      let text = out || "(no output)";
      if (results.length > 0) {
        const lines = results.map((r, i) =>
          `Test ${i + 1}: ${r.ok ? "PASS" : "FAIL"}` +
          (r.ok ? "" : `\n  expected: ${r.expected}\n  got:      ${r.got}`)
        );
        text += `\n\n${lines.join("\n")}`;
      }
      setOutput(text);
      const didPass = ok && !isError;
      setPassed(didPass);
      if (didPass && challengeId) markChallengeComplete(challengeId);
    } catch (e) {
      setOutput("Error: " + String(e?.message || e));
    }
    setIsRunning(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070B0A" }}>
        <div className="font-sans text-xs tracking-widest uppercase animate-pulse" style={{ color: "#ECF3EF" }}>
          Loading challenge...
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#070B0A" }}>
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECF3EF" }}>404, NOT FOUND</div>
        <Link to={createPageUrl("Challenges")}>
          <button className="font-sans text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#5ED29C", border: "1px solid #5ED29C33" }}>
            ← Back to Challenges
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#070B0A", minHeight: "100vh" }}>
      <div className="relative pt-20" style={{ borderBottom: "1px solid #17201C" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }} />

        <div className="max-w-5xl mx-auto px-8 lg:px-16 py-10">
          <Link
            to={createPageUrl("Challenges")}
            className="font-sans text-xs tracking-widest uppercase mb-8 inline-block transition-colors duration-150"
            style={{ color: "#ECF3EF" }}
            onMouseEnter={e => e.currentTarget.style.color = "#5ED29C"}
            onMouseLeave={e => e.currentTarget.style.color = "#CBD6D0"}
          >
            ← Challenges
          </Link>

          <div className="flex items-start gap-5">
            <span
              className="font-sans font-bold flex-shrink-0"
              style={{ fontSize: "3.5rem", lineHeight: 1, color: "#ECF3EF", letterSpacing: "-0.05em" }}
            >
              {DIFF_NUM[challenge.difficulty] || "01"}
            </span>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="font-sans text-xs tracking-widest uppercase px-2.5 py-1"
                  style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}
                >
                  {challenge.difficulty}
                </span>
                {challenge.xp && (
                  <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>
                    +{challenge.xp}xp
                  </span>
                )}
              </div>
              <h1
                style={{ fontFamily: font.display, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#ECF3EF", lineHeight: 1.12, margin: 0 }}
              >
                {challenge.title}
              </h1>
              <p className="font-display text-sm mt-2 leading-relaxed" style={{ color: "#ECF3EF", fontWeight: 400 }}>
                {challenge.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Stagger className="max-w-5xl mx-auto px-8 lg:px-16 py-10 space-y-8" as="div">
        <StaggerItem as="div" style={{ border: "1px solid #17201C", background: "#0C1210", borderRadius: 14, overflow: "hidden" }}>
          <button
            onClick={() => setShowPrimer(!showPrimer)}
            className="flex items-center justify-between w-full px-5 py-3 text-left"
            style={{ borderBottom: showPrimer ? "1px solid #17201C" : "none" }}
          >
            <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#5ED29C" }}>
              How this works
            </span>
            <span className="font-sans text-xs" style={{ color: "#ECF3EF" }}>
              {showPrimer ? ", " : "+"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {showPrimer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 py-4 space-y-2.5">
                  {[
                    "Your program reads its input from STDIN and prints answers to STDOUT.",
                    "The grader runs your code against each test case and compares your printed output to the expected output.",
                    "Start from the provided starter code, the input is already parsed for you. Just fill in the logic.",
                  ].map((line, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: "#5ED29C" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display text-sm leading-relaxed" style={{ color: "#ECF3EF", fontWeight: 400 }}>
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </StaggerItem>

        {challenge.statement && (
          <StaggerItem as="div">
            <ProblemStatement problem={challenge} />
          </StaggerItem>
        )}

        {!challenge.statement && challenge.test_cases && challenge.test_cases.length > 0 && (
          <StaggerItem as="div">
            <Card className="overflow-hidden">
              <div className="px-5 py-3" style={{ borderBottom: "1px solid #17201C" }}>
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECF3EF" }}>
                  Test Cases
                </span>
              </div>
              <div className="px-5 py-4 space-y-2">
                {challenge.test_cases.map((tc, i) => (
                  <div key={i} className="flex items-center gap-4 font-mono text-xs py-2" style={{ borderBottom: i < challenge.test_cases.length - 1 ? "1px solid #0C1210" : "none" }}>
                    <span style={{ color: "#ECF3EF" }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ color: "#ECF3EF" }}>in: <span style={{ color: "#ECF3EF" }}>{tc.input}</span></span>
                    <span style={{ color: "#ECF3EF" }}>→</span>
                    <span style={{ color: "#ECF3EF" }}>expect: <span style={{ color: "#5ED29C" }}>{tc.expected_output}</span></span>
                  </div>
                ))}
              </div>
            </Card>
          </StaggerItem>
        )}

        <StaggerItem as="div">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            output={output}
            isRunning={isRunning}
            filename={`challenge.py`}
          />
        </StaggerItem>

        <AnimatePresence>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 px-6 py-5"
              style={{ border: "1px solid #5ED29C33", background: "#5ED29C08", borderRadius: 14 }}
            >
              <span className="font-sans text-sm" style={{ color: "#5ED29C" }}>✓</span>
              <div>
                <div className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#5ED29C" }}>
                  Challenge Complete
                </div>
                <div className="font-display text-sm" style={{ color: "#ECF3EF", fontWeight: 400 }}>
                  All tests passed. Well done.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <StaggerItem as="div" className="flex flex-wrap gap-3">
          {challenge.hints && challenge.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="cl-lift font-sans text-xs tracking-widest uppercase px-4 py-2.5 rounded-[10px] transition-all duration-150"
              style={{
                color: showHints ? "#5ED29C" : "#B7C6BE",
                border: `1px solid ${showHints ? "#5ED29C33" : "#17201C"}`,
                background: showHints ? "#5ED29C10" : "transparent",
              }}
            >
              {showHints ? ", Hints" : "+ Hints"}
            </button>
          )}
          {challenge.solution_code && (
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="cl-lift font-sans text-xs tracking-widest uppercase px-4 py-2.5 rounded-[10px] transition-all duration-150"
              style={{ color: "#ECF3EF", border: "1px solid #17201C" }}
              onMouseEnter={e => e.currentTarget.style.color = "#CBD6D0"}
              onMouseLeave={e => e.currentTarget.style.color = "#ECF3EF"}
            >
              {showSolution ? ", Solution" : "Show Solution"}
            </button>
          )}
        </StaggerItem>

        <AnimatePresence>
          {showHints && challenge.hints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div style={{ border: "1px solid #17201C", background: "#0C1210", borderRadius: 14, overflow: "hidden" }}>
                <div className="px-5 py-3" style={{ borderBottom: "1px solid #17201C" }}>
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#5ED29C" }}>Hints</span>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {challenge.hints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: "#ECF3EF" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="font-display text-sm leading-relaxed" style={{ color: "#ECF3EF", fontWeight: 400 }}>
                        {hint}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSolution && challenge.solution_code && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div style={{ border: "1px solid #17201C", background: "#0C1210", borderRadius: 14, overflow: "hidden" }}>
                <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #17201C" }}>
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECF3EF" }}>Solution</span>
                  <span className="font-sans text-xs px-2 py-0.5" style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}>PY</span>
                </div>
                <pre className="font-mono overflow-x-auto p-5" style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#ECF3EF" }}>
                  {challenge.solution_code}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Stagger>

      <AIChatbot
        context={challenge?.description || ""}
        lessonTitle={challenge?.title || "Challenge"}
      />
    </div>
  );
}