import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div style={{
      padding: "20px 28px", borderBottom: "1px solid #e8e8e8",
      background: checked ? (isCorrect ? "#f9fff9" : "#fff9f9") : "#fff",
      transition: "background 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: "#333", lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: "#888", marginRight: "8px" }}>{index})</span>
            {question}
          </p>
          <div style={{ display: "flex", gap: "10px", marginLeft: "24px" }}>
            {["True", "False"].map((opt) => {
              const val = opt.toLowerCase();
              const isSelected = selected === val;
              const isThisCorrect = checked && val === correctAnswer;
              const isThisWrong = checked && isSelected && val !== correctAnswer;
              return (
                <motion.button
                  key={opt}
                  whileHover={!checked ? { scale: 1.04 } : {}}
                  whileTap={!checked ? { scale: 0.97 } : {}}
                  onClick={() => { if (!checked) setSelected(val); }}
                  style={{
                    padding: "8px 20px", fontSize: "0.875rem", fontWeight: 600,
                    borderRadius: "4px", cursor: checked ? "default" : "pointer", border: "none",
                    background: isThisCorrect ? "#2d7a3a" : isThisWrong ? "#e74c3c" : isSelected ? "#555" : "#e0e0e0",
                    color: isSelected || isThisCorrect || isThisWrong ? "#fff" : "#444",
                    transition: "all 0.2s",
                  }}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {!checked && selected !== null && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleCheck}
              style={{
                marginTop: "12px", marginLeft: "24px",
                background: "#cf6a2f", color: "#fff", border: "none", borderRadius: "4px",
                padding: "7px 20px", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              Check Answer
            </motion.button>
          )}

          <AnimatePresence>
            {checked && explanation && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                style={{
                  fontSize: "0.8125rem", color: isCorrect ? "#2d7a3a" : "#c0392b",
                  marginTop: "10px", marginLeft: "24px", lineHeight: 1.6,
                  background: isCorrect ? "#f0fff4" : "#fff0f0",
                  padding: "8px 12px", borderRadius: "4px",
                  borderLeft: `3px solid ${isCorrect ? "#2d7a3a" : "#c0392b"}`,
                }}
              >
                {isCorrect ? "✓ Correct! " : "✕ Incorrect. "}{explanation}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          animate={{ scale: checked ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: checked ? (isCorrect ? "#cf6a2f" : "#e74c3c") : "#e0e0e0",
          }}
        >
          {checked && <Check size={18} color="#fff" strokeWidth={3} />}
        </motion.div>
      </div>
    </div>
  );
}

function FillInQuestion({ index, question, correctAnswer, explanation, onAnswer }) {
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const isCorrect = checked && input.trim().toLowerCase() === correctAnswer.toLowerCase();
  const isWrong = checked && !isCorrect;

  const handleCheck = () => {
    setChecked(true);
    onAnswer(input.trim().toLowerCase() === correctAnswer.toLowerCase());
  };

  return (
    <div style={{
      padding: "20px 28px", borderBottom: "1px solid #e8e8e8",
      background: checked ? (isCorrect ? "#f9fff9" : "#fff9f9") : "#fff",
      transition: "background 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: "#333", lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: "#888", marginRight: "8px" }}>{index})</span>
            {question}
          </p>
          <div style={{ marginLeft: "24px" }}>
            <motion.input
              animate={checked && isWrong ? { x: [0, -5, 5, -5, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={checked}
              placeholder="Type your answer..."
              style={{
                border: `1px solid ${checked ? (isCorrect ? "#2d7a3a" : "#e74c3c") : "#ccc"}`,
                borderRadius: "4px", padding: "9px 14px", fontSize: "0.875rem",
                width: "240px", outline: "none", color: "#333",
                background: checked ? (isCorrect ? "#e8f5e9" : "#fde8e8") : "#fff",
                transition: "all 0.2s",
              }}
              onKeyDown={e => { if (e.key === "Enter" && !checked && input.trim()) handleCheck(); }}
            />
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "10px" }}>
              {!checked && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheck}
                  disabled={!input.trim()}
                  style={{
                    background: input.trim() ? "#cf6a2f" : "#ccc",
                    color: "#fff", border: "none", borderRadius: "4px",
                    padding: "7px 20px", fontSize: "0.8125rem", fontWeight: 700,
                    cursor: input.trim() ? "pointer" : "not-allowed",
                  }}
                >
                  Check Answer
                </motion.button>
              )}
              {!checked && (
                <button
                  onClick={() => { setInput(correctAnswer); setChecked(true); onAnswer(false); }}
                  style={{ fontSize: "0.8125rem", color: "#999", background: "none", border: "none", cursor: "pointer", fontWeight: 500, textDecoration: "underline" }}
                >
                  Show answer
                </button>
              )}
            </div>
            <AnimatePresence>
              {checked && explanation && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  style={{
                    fontSize: "0.8125rem", color: isCorrect ? "#2d7a3a" : "#c0392b",
                    marginTop: "10px", lineHeight: 1.6,
                    background: isCorrect ? "#f0fff4" : "#fff0f0",
                    padding: "8px 12px", borderRadius: "4px",
                    borderLeft: `3px solid ${isCorrect ? "#2d7a3a" : "#c0392b"}`,
                  }}
                >
                  {isCorrect ? "✓ Correct!" : `✕ The answer is: "${correctAnswer}". `}{explanation}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <motion.div
          animate={{ scale: checked ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.3 }}
          style={{
            flexShrink: 0, width: "32px", height: "32px", borderRadius: "4px",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: checked ? (isCorrect ? "#cf6a2f" : "#e74c3c") : "#e0e0e0",
          }}
        >
          {checked && <Check size={18} color="#fff" strokeWidth={3} />}
        </motion.div>
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
      {/* Header bar */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {allAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700,
                  color: correctCount === totalQuestions ? "#2d7a3a" : "#cf6a2f",
                  background: correctCount === totalQuestions ? "#e8f5e9" : "#fff5f0",
                  border: `1px solid ${correctCount === totalQuestions ? "#a5d6a7" : "#ffccbc"}`,
                  padding: "3px 10px", borderRadius: "3px",
                }}
              >
                {correctCount}/{totalQuestions} ✓
              </motion.div>
            )}
            <motion.div
              animate={{ scale: allAnswered ? [1, 1.25, 1] : 1 }}
              transition={{ duration: 0.4 }}
              style={{
                width: "32px", height: "32px", borderRadius: "4px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: allAnswered ? "#cf6a2f" : "#e0e0e0",
              }}
            >
              {allAnswered && <Check size={20} color="#fff" strokeWidth={3} />}
            </motion.div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: "12px 28px", borderTop: "1px solid #e8e8e8", display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: "0.8125rem", color: "#888" }}>
            {correctCount === totalQuestions ? "🎉 All correct!" : "Nice effort — review the explanations above."}
          </span>
          <span style={{ fontSize: "0.8125rem", color: "#cf6a2f", fontWeight: 600 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </motion.div>
      )}
    </div>
  );
}