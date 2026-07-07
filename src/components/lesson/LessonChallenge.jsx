import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeEditor from "../editor/CodeEditor";
import { gradePython } from "../../lib/pyRunner";
import { gradeJava } from "../../lib/javaRunner";
import { gradeCpp } from "../../lib/cppRunner";
import { trace, traceStyles } from "./trace/theme";

const EXT = { python: "py", java: "java", cpp: "cpp" };

export default function LessonChallenge({ lesson }) {
  const [code, setCode] = useState(lesson.challenge_starter_code || "");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [passed, setPassed] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const hasChallenge = lesson.challenge_title || lesson.challenge_description;
  if (!hasChallenge) return null;

  const lang = lesson.challenge_language || lesson.language || "python";
  const grade = lang === "java" ? gradeJava : lang === "cpp" ? gradeCpp : gradePython;
  const ext = EXT[lang] || "py";

  const handleRun = async () => {
    setIsRunning(true);
    setPassed(false);
    setOutput("Running…");
    try {
      const { output: out, passed: ok, results, isError } = await grade(code, lesson.challenge_test_cases);
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

  return (
    <div style={{ ...traceStyles.panel }}>
      <div
        className="flex items-center gap-3 px-6 py-4"
        style={{ borderBottom: `1px solid ${trace.border}`, background: trace.surface, borderTopLeftRadius: 4, borderTopRightRadius: 4 }}
      >
        <div
          className="font-sans text-xs tracking-widest uppercase px-2 py-1"
          style={{ color: trace.lime, border: `1px solid ${trace.lime}44`, background: trace.limeFaint, borderRadius: 3 }}
        >
          ▸ RUN
        </div>
        <span className="font-display text-sm font-semibold" style={{ color: trace.text }}>
          {lesson.challenge_title}
        </span>
        <span className="font-sans ml-auto" style={{ fontSize: "0.625rem", letterSpacing: "0.08em", textTransform: "uppercase", color: '#FFFFFF' }}>
          {lang}
        </span>
      </div>

      <div className="px-6 py-5">
        <style>{`
          .lc-md { color:#FFFFFF; font-family: 'Hanken Grotesk Variable', system-ui, sans-serif; font-size: 0.875rem; line-height: 1.7; }
          .lc-md p { margin: 0 0 0.6rem; }
          .lc-md ul, .lc-md ol { margin: 0.3rem 0 0.7rem 1.2rem; }
          .lc-md li { margin-bottom: 0.2rem; }
          .lc-md strong { color: ${trace.text}; font-weight: 700; }
          .lc-md code { font-family: 'Spline Sans Mono Variable', ui-monospace, monospace; font-size: 0.82em; background: ${trace.surface}; color: ${trace.lime}; padding: 0.1em 0.35em; border-radius: 3px; border: 1px solid ${trace.border}; }
          .lc-md pre { font-family: 'Spline Sans Mono Variable', ui-monospace, monospace; font-size: 0.78rem; background: ${trace.terminal}; border: 1px solid ${trace.border}; padding: 0.75rem 0.9rem; overflow-x: auto; border-radius: 3px; margin: 0 0 0.7rem; color: ${trace.text}; }
        `}</style>

        {lesson.challenge_story && (
          <div className="mb-4 px-4 py-3" style={{ borderLeft: `2px solid ${trace.lime}`, background: trace.limeFaint, borderRadius: "2px" }}>
            <div className="lc-md" style={{ fontStyle: "italic" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.challenge_story}</ReactMarkdown>
            </div>
          </div>
        )}

        {lesson.challenge_statement ? (
          <div className="lc-md mb-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: ({ className, children }) => {
                  const isBlock = /language-/.test(className || "") || String(children).includes("\n");
                  return isBlock ? <pre><code>{children}</code></pre> : <code>{children}</code>;
                },
                pre: ({ children }) => <>{children}</>,
              }}
            >
              {lesson.challenge_statement}
            </ReactMarkdown>
          </div>
        ) : (
          lesson.challenge_description && (
            <p className="font-display text-sm leading-relaxed mb-5" style={{ color: '#FFFFFF', fontWeight: 400 }}>
              {lesson.challenge_description}
            </p>
          )
        )}

        {(lesson.challenge_input_format || lesson.challenge_output_format || lesson.challenge_constraints) && (
          <div className="mb-4 grid sm:grid-cols-2 gap-3">
            {lesson.challenge_input_format && (
              <div>
                <div className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: trace.lime }}>Input</div>
                <div className="lc-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.challenge_input_format}</ReactMarkdown></div>
              </div>
            )}
            {lesson.challenge_output_format && (
              <div>
                <div className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: trace.lime }}>Output</div>
                <div className="lc-md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.challenge_output_format}</ReactMarkdown></div>
              </div>
            )}
            {Array.isArray(lesson.challenge_constraints) && lesson.challenge_constraints.length > 0 && (
              <div className="sm:col-span-2">
                <div className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: trace.lime }}>Constraints</div>
                <ul className="space-y-0.5">
                  {lesson.challenge_constraints.map((c, i) => (
                    <li key={i} className="font-mono text-xs flex gap-2" style={{ color: '#FFFFFF' }}>
                      <span style={{ color: trace.lime }}>•</span><span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {lesson.challenge_test_cases?.length > 0 && (
          <div className="mb-5" style={{ ...traceStyles.terminal, overflow: "hidden" }}>
            <div
              className="px-4 py-2 font-sans text-xs tracking-widest uppercase"
              style={{ borderBottom: `1px solid ${trace.border}`, color: '#FFFFFF', background: trace.surface }}
            >
              test cases
            </div>
            {lesson.challenge_test_cases.map((tc, i) => (
              <div
                key={i}
                className="flex flex-wrap gap-6 px-4 py-3 font-mono text-xs"
                style={{ background: trace.terminal, borderBottom: i < lesson.challenge_test_cases.length - 1 ? `1px solid ${trace.border}` : "none" }}
              >
                <span style={{ color: '#FFFFFF' }}>#{i + 1}</span>
                <span><span style={{ color: '#FFFFFF' }}>in </span><span style={{ color: trace.text }}>{tc.input}</span></span>
                <span style={{ color: '#FFFFFF' }}>→</span>
                <span><span style={{ color: '#FFFFFF' }}>out </span><span style={{ color: trace.ok }}>{tc.expected_output}</span></span>
              </div>
            ))}
          </div>
        )}

        <div className="mb-4">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            output={output}
            isRunning={isRunning}
            filename={`challenge.${ext}`}
          />
        </div>

        <AnimatePresence>
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 px-5 py-4 flex items-center gap-3"
              style={{ border: `1px solid ${trace.lime}44`, background: trace.okWash, borderLeft: `2px solid ${trace.lime}`, borderRadius: "2px" }}
            >
              <CheckCircle2 size={18} color={trace.lime} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              <div>
                <div className="font-display font-bold text-sm" style={{ color: trace.text }}>Challenge complete.</div>
                <div className="font-display text-xs" style={{ color: '#FFFFFF' }}>All tests passed.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {lesson.challenge_solution_code && (
          <div>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150 mb-3"
              style={{
                borderRadius: "4px",
                border: `1px solid ${showSolution ? `${trace.lime}33` : trace.borderStrong}`,
                color: showSolution ? trace.lime : trace.dim,
                background: showSolution ? trace.limeFaint : "transparent",
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
                  <div style={{ ...traceStyles.terminal, overflow: "hidden" }}>
                    <div className="px-4 py-2.5" style={{ borderBottom: `1px solid ${trace.border}`, background: trace.surface }}>
                      <span className="font-sans text-xs tracking-widest uppercase" style={{ color: '#FFFFFF' }}>solution.{ext}</span>
                    </div>
                    <pre
                      className="font-mono overflow-x-auto p-5"
                      style={{ fontSize: "0.75rem", lineHeight: "1.7", color: trace.text }}
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
