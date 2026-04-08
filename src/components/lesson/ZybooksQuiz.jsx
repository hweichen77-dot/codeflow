import React, { useState } from "react";
import { Check } from "lucide-react";

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
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px", marginTop: "24px", marginBottom: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid #e0e0e0" }}>
        <div style={{ width: "4px", background: "#cf6a2f", flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#333", lineHeight: 1.2 }}>
                PARTICIPATION
              </div>
              <div style={{ fontSize: "0.6875rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: "#333", lineHeight: 1.2 }}>
                ACTIVITY
              </div>
            </div>
            <div style={{ width: "1px", height: "28px", background: "#ddd" }} />
            <span style={{ fontSize: "0.875rem", color: "#555" }}>
              {sectionNumber}: Quiz
            </span>
          </div>
          <div style={{
            width: "32px", height: "32px", borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: allChecked ? "#cf6a2f" : "#e0e0e0",
          }}>
            {allChecked && <Check size={20} color="#fff" strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qi) => {
        const isChecked = checked[qi] !== undefined;
        const isCorrect = checked[qi] === true;

        return (
          <div key={qi} style={{ padding: "20px 28px", borderBottom: "1px solid #e8e8e8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.9375rem", color: "#333", lineHeight: 1.6, margin: "0 0 14px" }}>
                  <span style={{ color: "#888", marginRight: "8px" }}>{qi + 1})</span>
                  {q.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "24px" }}>
                  {q.options?.map((opt, oi) => {
                    const isSelected = answers[qi] === oi;
                    const isThisCorrect = isChecked && oi === q.correct_index;
                    const isThisWrong = isChecked && isSelected && oi !== q.correct_index;

                    return (
                      <label
                        key={oi}
                        onClick={() => handleSelect(qi, oi)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          cursor: isChecked ? "default" : "pointer",
                          padding: "4px 0", fontSize: "0.9375rem",
                          color: isThisCorrect ? "#2d7a3a" : isThisWrong ? "#c0392b" : "#333",
                          fontWeight: isThisCorrect ? 600 : 400,
                        }}
                      >
                        <span
                          style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            border: `2px solid ${isSelected ? "#555" : "#ccc"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          {isSelected && (
                            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#555" }} />
                          )}
                        </span>
                        {opt}
                      </label>
                    );
                  })}
                </div>
                {!isChecked && answers[qi] !== undefined && (
                  <button
                    onClick={() => handleCheck(qi)}
                    style={{
                      marginTop: "10px", marginLeft: "24px",
                      background: "#cf6a2f", color: "#fff", border: "none", borderRadius: "4px",
                      padding: "6px 16px", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    Check
                  </button>
                )}
                {isChecked && q.explanation && (
                  <p style={{
                    fontSize: "0.8125rem",
                    color: isCorrect ? "#2d7a3a" : "#c0392b",
                    marginTop: "10px", marginLeft: "24px", lineHeight: 1.5,
                  }}>
                    {isCorrect ? "✓ Correct. " : "✕ Incorrect. "}{q.explanation}
                  </p>
                )}
              </div>
              <div style={{
                flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isChecked ? (isCorrect ? "#cf6a2f" : "#e74c3c") : "#e0e0e0",
              }}>
                {isChecked && <Check size={18} color="#fff" strokeWidth={3} />}
              </div>
            </div>
          </div>
        );
      })}

      {/* Footer */}
      {allChecked && (
        <div style={{ padding: "12px 28px", borderTop: "1px solid #e8e8e8", textAlign: "right" }}>
          <span style={{ fontSize: "0.8125rem", color: "#cf6a2f", fontWeight: 600 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </div>
      )}
    </div>
  );
}