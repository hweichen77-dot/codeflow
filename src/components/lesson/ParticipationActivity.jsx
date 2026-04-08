import React, { useState } from "react";
import { Check } from "lucide-react";

function TrueFalseQuestion({ index, question, correctAnswer, explanation, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && selected === correctAnswer;
  const isWrong = checked && selected !== correctAnswer;

  const handleCheck = () => {
    if (selected !== null) {
      setChecked(true);
      onAnswer(selected === correctAnswer);
    }
  };

  return (
    <div style={{ padding: "20px 28px", borderBottom: "1px solid #e8e8e8" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: "#333", lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: "#888", marginRight: "8px" }}>{index})</span>
            {question}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginLeft: "24px" }}>
            {["True", "False"].map((opt) => {
              const val = opt.toLowerCase();
              const isSelected = selected === val;
              return (
                <label
                  key={opt}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px", cursor: checked ? "default" : "pointer",
                    padding: "4px 0", fontSize: "0.9375rem", color: "#333",
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
          {checked && explanation && (
            <p style={{ fontSize: "0.8125rem", color: isCorrect ? "#2d7a3a" : "#c0392b", marginTop: "10px", marginLeft: "24px", lineHeight: 1.5 }}>
              {isCorrect ? "✓ Correct. " : "✕ Incorrect. "}{explanation}
            </p>
          )}
        </div>
        <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
          background: checked ? (isCorrect ? "#cf6a2f" : "#e74c3c") : "#e0e0e0",
        }}>
          {checked && <Check size={18} color="#fff" strokeWidth={3} />}
        </div>
      </div>
      {!checked && selected !== null && (
        <button onClick={handleCheck} style={{ marginTop: "8px", marginLeft: "24px", fontSize: "0.8125rem", color: "#2980b9", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontWeight: 500 }}>
          Check
        </button>
      )}
    </div>
  );
}

function FillInQuestion({ index, question, correctAnswer, explanation, onAnswer }) {
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const isCorrect = checked && input.trim().toLowerCase() === correctAnswer.toLowerCase();
  const isWrong = checked && !isCorrect;

  const handleCheck = () => {
    setChecked(true);
    onAnswer(input.trim().toLowerCase() === correctAnswer.toLowerCase());
  };

  return (
    <div style={{ padding: "20px 28px", borderBottom: "1px solid #e8e8e8" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: "#333", lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: "#888", marginRight: "8px" }}>{index})</span>
            {question}
          </p>
          <div style={{ marginLeft: "24px" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={checked}
              style={{
                border: `1px solid ${checked ? (isCorrect ? "#2d7a3a" : "#e74c3c") : "#ccc"}`,
                borderRadius: "4px", padding: "8px 12px", fontSize: "0.875rem",
                width: "200px", outline: "none", color: "#333",
                background: checked ? (isCorrect ? "#e8f5e9" : "#fde8e8") : "#fff",
              }}
              onKeyDown={e => { if (e.key === "Enter" && !checked) handleCheck(); }}
            />
            <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "10px" }}>
              {!checked && (
                <button
                  onClick={handleCheck}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? "#cf6a2f" : "#ccc",
                    color: "#fff", border: "none", borderRadius: "4px",
                    padding: "6px 16px", fontSize: "0.8125rem", fontWeight: 700,
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Check
                </button>
              )}
              {!checked && (
                <button
                  onClick={() => { setShowAnswer(true); setInput(correctAnswer); setChecked(true); onAnswer(false); }}
                  style={{ fontSize: "0.8125rem", color: "#2980b9", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
                >
                  Show answer
                </button>
              )}
            </div>
            {checked && explanation && (
              <p style={{ fontSize: "0.8125rem", color: isCorrect ? "#2d7a3a" : "#c0392b", marginTop: "10px", lineHeight: 1.5 }}>
                {isCorrect ? "✓ Correct!" : `✕ The answer is: ${correctAnswer}. `}{explanation}
              </p>
            )}
          </div>
        </div>
        <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center",
          background: checked ? (isCorrect ? "#cf6a2f" : "#e74c3c") : "#e0e0e0",
        }}>
          {checked && <Check size={18} color="#fff" strokeWidth={3} />}
        </div>
      </div>
    </div>
  );
}

export default function ParticipationActivity({ activity, sectionNumber, activityIndex, onComplete }) {
  const [answeredCorrectly, setAnsweredCorrectly] = useState({});
  const totalQuestions = activity.questions?.length || 0;
  const answeredCount = Object.keys(answeredCorrectly).length;
  const allAnswered = answeredCount === totalQuestions;
  const correctCount = Object.values(answeredCorrectly).filter(Boolean).length;

  const handleAnswer = (qIdx, correct) => {
    const updated = { ...answeredCorrectly, [qIdx]: correct };
    setAnsweredCorrectly(updated);
    if (Object.keys(updated).length === totalQuestions && onComplete) {
      onComplete(Object.values(updated).filter(Boolean).length, totalQuestions);
    }
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px", marginTop: "24px", marginBottom: "24px" }}>
      {/* Header bar — zybooks style */}
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
              {sectionNumber}.{activityIndex}: {activity.activity_title}
            </span>
          </div>
          <div style={{
            width: "32px", height: "32px", borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: allAnswered ? "#cf6a2f" : "#e0e0e0",
          }}>
            {allAnswered && <Check size={20} color="#fff" strokeWidth={3} />}
          </div>
        </div>
      </div>

      {/* Questions */}
      {activity.questions?.map((q, qi) => {
        if (q.type === "fill_in") {
          return (
            <FillInQuestion
              key={qi}
              index={qi + 1}
              question={q.question}
              correctAnswer={q.correct_answer}
              explanation={q.explanation}
              onAnswer={(correct) => handleAnswer(qi, correct)}
            />
          );
        }
        return (
          <TrueFalseQuestion
            key={qi}
            index={qi + 1}
            question={q.question}
            correctAnswer={q.correct_answer}
            explanation={q.explanation}
            onAnswer={(correct) => handleAnswer(qi, correct)}
          />
        );
      })}

      {/* Footer */}
      {allAnswered && (
        <div style={{ padding: "12px 28px", borderTop: "1px solid #e8e8e8", textAlign: "right" }}>
          <span style={{ fontSize: "0.8125rem", color: "#cf6a2f", fontWeight: 600 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </div>
      )}
    </div>
  );
}