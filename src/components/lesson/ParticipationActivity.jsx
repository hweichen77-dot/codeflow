import React, { useState } from "react";
import { Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trace, traceStyles } from "@/components/lesson/trace/theme";

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
      padding: "20px 28px", borderBottom: `1px solid ${trace.border}`,
      background: checked ? (isCorrect ? trace.okWash : trace.failWash) : trace.raised,
      transition: "background 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: trace.text, lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: trace.faint, marginRight: "8px" }}>{index})</span>
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
                    background: isThisCorrect ? trace.ok : isThisWrong ? trace.fail : isSelected ? trace.borderActive : trace.surface,
                    color: isThisCorrect ? trace.bg : isThisWrong ? "#fff" : isSelected ? trace.text : trace.dim,
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
                background: trace.lime, color: trace.bg, border: "none", borderRadius: "2px",
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
                  fontSize: "0.8125rem", color: isCorrect ? trace.ok : trace.fail,
                  marginTop: "10px", marginLeft: "24px", lineHeight: 1.6,
                  background: isCorrect ? trace.okWash : trace.failWash,
                  padding: "8px 12px", borderRadius: "4px",
                  borderLeft: `3px solid ${isCorrect ? trace.ok : trace.fail}`,
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
            background: checked ? (isCorrect ? trace.ok : trace.fail) : trace.surface,
          }}
        >
          {checked && <Check size={18} color={isCorrect ? trace.bg : "#fff"} strokeWidth={3} />}
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
      padding: "20px 28px", borderBottom: `1px solid ${trace.border}`,
      background: checked ? (isCorrect ? trace.okWash : trace.failWash) : trace.raised,
      transition: "background 0.3s ease",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "0.9375rem", color: trace.text, lineHeight: 1.6, margin: "0 0 14px" }}>
            <span style={{ color: trace.faint, marginRight: "8px" }}>{index})</span>
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
                fontFamily: trace.mono,
                border: `1px solid ${checked ? (isCorrect ? trace.ok : trace.fail) : trace.borderStrong}`,
                borderRadius: "2px", padding: "9px 14px", fontSize: "0.875rem",
                lineHeight: 1.5, minHeight: "40px",
                width: "260px", outline: "none", color: trace.text,
                background: checked ? (isCorrect ? trace.okWash : trace.failWash) : trace.surface,
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
                    background: input.trim() ? trace.lime : trace.muted,
                    color: input.trim() ? trace.bg : trace.faint, border: "none", borderRadius: "2px",
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
                  style={{ fontSize: "0.8125rem", color: trace.faint, background: "none", border: "none", cursor: "pointer", fontWeight: 500, textDecoration: "underline" }}
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
                    fontSize: "0.8125rem", color: isCorrect ? trace.ok : trace.fail,
                    marginTop: "10px", lineHeight: 1.6,
                    background: isCorrect ? trace.okWash : trace.failWash,
                    padding: "8px 12px", borderRadius: "4px",
                    borderLeft: `3px solid ${isCorrect ? trace.ok : trace.fail}`,
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
            background: checked ? (isCorrect ? trace.ok : trace.fail) : trace.surface,
          }}
        >
          {checked && <Check size={18} color={isCorrect ? trace.bg : "#fff"} strokeWidth={3} />}
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
    <div style={{ background: trace.raised, border: `1px solid ${trace.border}`, borderRadius: "4px", marginTop: "24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "stretch", borderBottom: `1px solid ${trace.border}` }}>
        <div style={{ width: "4px", background: trace.lime, flexShrink: 0 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1, padding: "10px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ ...traceStyles.monoLabel, lineHeight: 1.25 }}>
              DRILL §{sectionNumber}.{activityIndex}
            </div>
            <div style={{ width: "1px", height: "28px", background: trace.borderStrong }} />
            <span style={{ fontSize: "0.875rem", color: trace.dim }}>
              {activity.activity_title}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {allAnswered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  fontFamily: trace.mono, fontSize: "0.7rem", fontWeight: 700,
                  color: correctCount === totalQuestions ? trace.ok : trace.warn,
                  background: correctCount === totalQuestions ? trace.okWash : trace.failWash,
                  border: `1px solid ${correctCount === totalQuestions ? trace.ok : trace.warn}`,
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
                background: allAnswered ? trace.lime : trace.surface,
              }}
            >
              {allAnswered && <Check size={20} color={trace.bg} strokeWidth={3} />}
            </motion.div>
          </div>
        </div>
      </div>

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

      {allAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ padding: "12px 28px", borderTop: `1px solid ${trace.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <span style={{ fontSize: "0.8125rem", color: trace.faint }}>
            {correctCount === totalQuestions ? " All correct!" : "Nice effort — review the explanations above."}
          </span>
          <span style={{ fontSize: "0.8125rem", color: trace.lime, fontWeight: 600 }}>
            {correctCount}/{totalQuestions} correct
          </span>
        </motion.div>
      )}
    </div>
  );
}
