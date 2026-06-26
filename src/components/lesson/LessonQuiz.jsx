import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trace } from "@/components/lesson/trace/theme";

export default function LessonQuiz({ questions }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!questions || questions.length === 0) return null;

  const score = submitted
    ? questions.filter((q, i) => answers[i] === q.correct_index).length
    : 0;

  const handleSubmit = () => setSubmitted(true);
  const handleReset = () => { setAnswers({}); setSubmitted(false); };

  return (
    <div style={{ border: `1px solid ${trace.border}` }}>
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: `1px solid ${trace.border}`, background: trace.terminal }}
      >
        <div className="flex items-center gap-3">
          <div
            className="font-sans text-xs tracking-widest uppercase px-2 py-1"
            style={{ color: trace.lime, border: `1px solid ${trace.lime}33`, background: trace.limeFaint }}
          >
            QUIZ
          </div>
          <span className="font-sans text-xs" style={{ color: trace.muted }}>
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
        </div>
        {submitted && (
          <div className="flex items-center gap-4">
            <span
              className="font-sans text-sm font-bold"
              style={{ color: score === questions.length ? trace.ok : score >= questions.length / 2 ? trace.warn : trace.fail }}
            >
              {score}/{questions.length}
            </span>
            <button
              onClick={handleReset}
              className="font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-colors"
              style={{ color: trace.muted, border: `1px solid ${trace.border}` }}
              onMouseEnter={e => e.currentTarget.style.color = trace.dim}
              onMouseLeave={e => e.currentTarget.style.color = trace.muted}
            >
              Retry
            </button>
          </div>
        )}
      </div>

      <div className="divide-y" style={{ borderColor: trace.border }}>
        {questions.map((q, qi) => {
          const selected = answers[qi];
          const isCorrect = submitted && selected === q.correct_index;
          const isWrong = submitted && selected !== undefined && selected !== q.correct_index;

          return (
            <div key={qi} className="px-6 py-6">
              <div className="flex gap-3 mb-4">
                <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: trace.muted }}>
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <p className="font-display text-sm leading-relaxed" style={{ color: trace.text, fontWeight: 500 }}>
                  {q.question}
                </p>
              </div>

              <div className="space-y-2 ml-8">
                {q.options?.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isThisCorrect = submitted && oi === q.correct_index;
                  const isThisWrong = submitted && isSelected && oi !== q.correct_index;

                  let borderColor = trace.border;
                  let bgColor = "transparent";
                  let textColor = trace.faint;
                  let dotColor = trace.borderStrong;

                  if (isSelected && !submitted) { borderColor = trace.borderActive; textColor = trace.text; dotColor = trace.dim; }
                  if (isThisCorrect && submitted) { borderColor = `${trace.ok}55`; bgColor = trace.okWash; textColor = trace.ok; dotColor = trace.ok; }
                  if (isThisWrong) { borderColor = `${trace.fail}33`; bgColor = trace.failWash; textColor = trace.fail; dotColor = trace.fail; }
                  if (submitted && !isSelected && !isThisCorrect) { textColor = trace.muted; }

                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                      disabled={submitted}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 transition-all duration-150"
                      style={{ border: `1px solid ${borderColor}`, background: bgColor, cursor: submitted ? "default" : "pointer" }}
                    >
                      <span
                        className="flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ border: `1.5px solid ${dotColor}`, background: isSelected ? dotColor : "transparent" }}
                      >
                        {isSelected && !submitted && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: trace.bg }} />
                        )}
                        {isThisCorrect && submitted && (
                          <span className="font-sans text-xs leading-none" style={{ color: trace.bg, fontSize: "8px" }}>✓</span>
                        )}
                        {isThisWrong && (
                          <span className="font-sans text-xs leading-none" style={{ color: trace.bg, fontSize: "8px" }}>✕</span>
                        )}
                      </span>
                      <span className="font-display text-sm" style={{ color: textColor, fontWeight: 400 }}>
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {submitted && q.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden ml-8 mt-3"
                  >
                    <div
                      className="px-4 py-3"
                      style={{
                        borderLeft: `2px solid ${isCorrect ? trace.ok : trace.fail}`,
                        background: isCorrect ? trace.okWash : trace.failWash,
                      }}
                    >
                      <div
                        className="font-sans text-xs tracking-widest uppercase mb-1"
                        style={{ color: isCorrect ? trace.ok : trace.fail }}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </div>
                      <p className="font-display text-xs leading-relaxed" style={{ color: trace.dim, fontWeight: 400 }}>
                        {q.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="px-6 py-4" style={{ borderTop: `1px solid ${trace.border}`, background: trace.terminal }}>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
            className="font-sans text-xs tracking-widest uppercase px-6 py-3 transition-all duration-150"
            style={{
              background: Object.keys(answers).length === questions.length ? trace.lime : trace.surface,
              color: Object.keys(answers).length === questions.length ? trace.bg : trace.muted,
              border: "1px solid transparent",
              fontWeight: 700,
              cursor: Object.keys(answers).length < questions.length ? "not-allowed" : "pointer",
            }}
          >
            Check Answers
          </button>
          <span className="font-sans text-xs ml-4" style={{ color: trace.muted }}>
            {Object.keys(answers).length}/{questions.length} answered
          </span>
        </div>
      )}
    </div>
  );
}
