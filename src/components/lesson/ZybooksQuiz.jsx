import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ZybooksQuiz({ questions, sectionNumber, onComplete }) {
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
    <div style={{ background: "#ffffff", border: "1px solid #e4e4e7", borderRadius: "4px", marginTop: "24px", marginBottom: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid #e4e4e7" }}>
        <div style={{ width: "4px", background: "#ea580c", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#18181b", lineHeight: 1.2 }}>
                PARTICIPATION
              </div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#18181b", lineHeight: 1.2 }}>
                ACTIVITY
              </div>
            </div>
            <div style={{ width: "1px", height: "28px", background: "#e4e4e7" }} />
            <span style={{ fontSize: "0.875rem", color: "#52525b" }}>
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
                  fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700,
                  color: correctCount === totalQuestions ? "#059669" : "#ea580c",
                  background: correctCount === totalQuestions ? "#05966914" : "#ea580c14",
                  border: `1px solid ${correctCount === totalQuestions ? "#05966933" : "#ea580c33"}`,
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
              background: allChecked ? "#ea580c" : "#e4e4e7",
            }}>
              {allChecked && <Check size={20} color="#fff" strokeWidth={3} />}
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
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
              padding: "20px 28px", borderBottom: "1px solid #e4e4e7",
              background: isChecked ? (isCorrect ? "#05966908" : "#dc262608") : "#ffffff",
              transition: "background 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.9375rem", color: "#18181b", lineHeight: 1.6, margin: "0 0 14px" }}>
                  <span style={{ color: "#52525b", marginRight: "8px" }}>{qi + 1})</span>
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
                          color: isThisCorrect ? "#059669" : isThisWrong ? "#dc2626" : "#18181b",
                          fontWeight: isThisCorrect ? 600 : 400,
                          borderRadius: "4px",
                          background: isThisCorrect ? "#05966914" : isThisWrong ? "#dc262614" : isSelected ? "#f6f6f7" : "transparent",
                          border: isThisCorrect ? "1px solid #05966933" : isThisWrong ? "1px solid #dc262633" : "1px solid transparent",
                          transition: "all 0.2s",
                        }}
                      >
                        <span
                          style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            border: `2px solid ${isThisCorrect ? "#059669" : isThisWrong ? "#dc2626" : isSelected ? "#6b7280" : "#d4d4d8"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && (
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: isThisCorrect ? "#059669" : isThisWrong ? "#dc2626" : "#6b7280" }} />
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
                      background: "#ea580c", color: "#ffffff", border: "none", borderRadius: "4px",
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
                        color: isCorrect ? "#059669" : "#dc2626",
                        marginTop: "10px", marginLeft: "24px", lineHeight: 1.6,
                        background: isCorrect ? "#05966914" : "#dc262614",
                        padding: "8px 12px", borderRadius: "4px",
                        borderLeft: `3px solid ${isCorrect ? "#059669" : "#dc2626"}`,
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
                  background: isChecked ? (isCorrect ? "#059669" : "#dc2626") : "#e4e4e7",
                }}
              >
                {isChecked && (isCorrect
                  ? <Check size={18} color="#fff" strokeWidth={3} />
                  : <X size={18} color="#fff" strokeWidth={3} />)}
              </motion.div>
            </div>
          </motion.div>
        );
      })}

      {/* Footer */}
      {allChecked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: "14px 28px", borderTop: "1px solid #e4e4e7", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: "0.8125rem", color: "#52525b" }}>
            {correctCount === totalQuestions ? "Perfect score!" : `Keep practicing — review the explanations above.`}
          </span>
          <span style={{ fontSize: "0.8125rem", color: "#ea580c", fontWeight: 700 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </motion.div>
      )}
    </div>
  );
}