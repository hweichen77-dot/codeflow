import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

export default function CheckBlock({ questions, sectionNumber, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState({});
  const totalQuestions = questions?.length || 0;
  const allChecked = Object.keys(checked).length === totalQuestions;
  const correctCount = Object.values(checked).filter(Boolean).length;

  if (!questions || questions.length === 0) return null;

  const handleSelect = (qi, oi) => {
    if (checked[qi] !== undefined) return;
    setAnswers({ ...answers, [qi]: oi });
  };

  const handleCheck = (qi) => {
    const isCorrect = answers[qi] === questions[qi].correct_index;
    const updated = { ...checked, [qi]: isCorrect };
    setChecked(updated);
    if (Object.keys(updated).length === totalQuestions && onComplete) {
      onComplete(Object.values(updated).filter(Boolean).length, totalQuestions);
    }
  };

  return (
    <div style={{ ...traceStyles.panel, marginTop: "24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid ${trace.border}` }}>
        <div style={{ width: "4px", background: trace.lime, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ ...traceStyles.monoLabel, lineHeight: 1.2 }}>
              ▸ CHECK
            </div>
            <div style={{ width: "1px", height: "28px", background: trace.border }} />
            <span style={{ fontSize: "0.875rem", color: '#FFFFFF' }}>
              {sectionNumber}: Quiz
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {allChecked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  fontFamily: trace.mono, fontSize: "0.7rem", fontWeight: 700,
                  color: correctCount === totalQuestions ? trace.ok : trace.fail,
                  background: correctCount === totalQuestions ? trace.okWash : trace.failWash,
                  border: `1px solid ${correctCount === totalQuestions ? trace.ok : trace.fail}`,
                  padding: "3px 10px", borderRadius: "3px",
                }}
              >
                {correctCount}/{totalQuestions}
                <Check size={12} strokeWidth={3} />
              </motion.div>
            )}
            <div style={{
              width: "32px", height: "32px", borderRadius: "4px",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: allChecked ? trace.lime : trace.surface,
            }}>
              {allChecked && <Check size={20} color={trace.bg} strokeWidth={3} />}
            </div>
          </div>
        </div>
      </div>

      {questions.map((q, qi) => {
        const isChecked = checked[qi] !== undefined;
        const isCorrect = checked[qi] === true;

        return (
          <motion.div
            key={qi}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.07 }}
            style={{
              padding: "20px 28px", borderBottom: `1px solid ${trace.border}`,
              background: isChecked ? (isCorrect ? trace.okWash : trace.failWash) : "transparent",
              transition: "background 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.9375rem", color: trace.text, lineHeight: 1.6, margin: "0 0 14px" }}>
                  <span style={{ color: '#FFFFFF', marginRight: "8px" }}>{qi + 1})</span>
                  {q.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "24px" }}>
                  {q.options?.map((opt, oi) => {
                    const isSelected = answers[qi] === oi;
                    const isThisCorrect = isChecked && oi === q.correct_index;
                    const isThisWrong = isChecked && isSelected && oi !== q.correct_index;

                    return (
                      <motion.label
                        key={oi}
                        animate={isThisCorrect ? { x: [0, 4, 0] } : isThisWrong ? { x: [0, -4, 4, -4, 0] } : {}}
                        transition={{ duration: 0.4 }}
                        onClick={() => handleSelect(qi, oi)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          cursor: isChecked ? "default" : "pointer",
                          padding: "6px 10px", fontSize: "0.9375rem",
                          color: isThisCorrect ? trace.ok : isThisWrong ? trace.fail : trace.text,
                          fontWeight: isThisCorrect ? 600 : 400,
                          borderRadius: "4px",
                          background: isThisCorrect ? trace.okWash : isThisWrong ? trace.failWash : isSelected ? trace.surface : "transparent",
                          border: isThisCorrect ? `1px solid ${trace.ok}` : isThisWrong ? `1px solid ${trace.fail}` : "1px solid transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <span
                          style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            border: `2px solid ${isThisCorrect ? trace.ok : isThisWrong ? trace.fail : isSelected ? trace.dim : trace.borderStrong}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && (
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isThisCorrect ? trace.ok : isThisWrong ? trace.fail : trace.dim }} />
                          )}
                        </span>
                        {opt}
                        {isThisCorrect && <Check size={15} strokeWidth={3} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                        {isThisWrong && <X size={15} strokeWidth={3} style={{ marginLeft: "auto", flexShrink: 0 }} />}
                      </motion.label>
                    );
                  })}
                </div>
                {!isChecked && answers[qi] !== undefined && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCheck(qi)}
                    style={{
                      marginTop: "12px", marginLeft: "24px",
                      background: trace.lime, color: trace.bg, border: "none", borderRadius: "4px",
                      padding: "7px 20px", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    Check Answer
                  </motion.button>
                )}
                <AnimatePresence>
                  {isChecked && q.explanation && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      style={{
                        display: "flex", alignItems: "flex-start", gap: "6px",
                        fontSize: "0.8125rem",
                        color: isCorrect ? trace.ok : trace.fail,
                        marginTop: "10px", marginLeft: "24px", lineHeight: 1.6,
                        background: isCorrect ? trace.okWash : trace.failWash,
                        padding: "8px 12px", borderRadius: "4px",
                        borderLeft: `3px solid ${isCorrect ? trace.ok : trace.fail}`,
                      }}
                    >
                      {isCorrect
                        ? <Check size={15} strokeWidth={3} style={{ flexShrink: 0, marginTop: "2px" }} />
                        : <X size={15} strokeWidth={3} style={{ flexShrink: 0, marginTop: "2px" }} />}
                      <span>{isCorrect ? "Correct! " : "Incorrect. "}{q.explanation}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                animate={{ scale: isChecked ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isChecked ? (isCorrect ? trace.ok : trace.fail) : trace.surface,
                }}
              >
                {isChecked && (isCorrect
                  ? <Check size={18} color={trace.bg} strokeWidth={3} />
                  : <X size={18} color={trace.bg} strokeWidth={3} />)}
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {allChecked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: "14px 28px", borderTop: `1px solid ${trace.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: "0.8125rem", color: '#FFFFFF' }}>
            {correctCount === totalQuestions ? "Perfect score!" : `Keep practicing — review the explanations above.`}
          </span>
          <span style={{ fontSize: "0.8125rem", color: trace.lime, fontWeight: 700 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </motion.div>
      )}
    </div>
  );
}
