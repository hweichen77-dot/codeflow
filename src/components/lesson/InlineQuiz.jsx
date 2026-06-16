import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle, XCircle } from "lucide-react";

/**
 * A quick inline "check your understanding" mini quiz
 * that can be embedded inside lesson explanations.
 */
export default function InlineQuiz({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const answered = revealed && selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div
      className="my-6 rounded"
      style={{ border: "1px solid #e4e4e7", background: "#ffffff" }}
    >
      {/* Header */}
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: "1px solid #ececef" }}>
        <span className="font-mono text-xs tracking-widest uppercase flex items-center gap-1.5" style={{ color: "#52525b" }}>
          <Sparkles size={12} style={{ color: "#52525b" }} />
          Check Your Understanding
        </span>
      </div>

      <div className="px-4 py-4">
        <p className="font-display text-sm font-semibold mb-3" style={{ color: "#18181b" }}>
          {question}
        </p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            let bg = "#f6f6f7";
            let border = "#e4e4e7";
            let color = "#3f3f46";

            if (revealed) {
              if (i === correctIndex) {
                bg = "#0596690d"; border = "#05966960"; color = "#059669";
              } else if (i === selected && i !== correctIndex) {
                bg = "#dc26260d"; border = "#dc262660"; color = "#dc2626";
              }
            } else if (selected === i) {
              border = "#a1a1aa"; color = "#18181b";
            }

            return (
              <button
                key={i}
                onClick={() => !revealed && setSelected(i)}
                className="w-full text-left px-3 py-2.5 rounded transition-all duration-150 font-display text-sm"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: revealed ? "default" : "pointer" }}
              >
                <span className="font-mono text-xs mr-2" style={{ color: "#6b7280" }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            className="mt-3 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
            style={{ color: "#ffffff", border: "1px solid #4d7c0f", background: "#4d7c0f" }}
          >
            Check Answer
          </button>
        )}

        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 px-3 py-2.5 rounded"
              style={{
                background: isCorrect ? "#0596690d" : "#dc26260d",
                border: `1px solid ${isCorrect ? "#05966940" : "#dc262640"}`,
              }}
            >
              <div
                className="font-mono text-xs font-bold mb-1 flex items-center gap-1.5"
                style={{ color: isCorrect ? "#059669" : "#dc2626" }}
              >
                {isCorrect ? <CheckCircle size={13} /> : <XCircle size={13} />}
                {isCorrect ? "Correct!" : "Not quite"}
              </div>
              {explanation && (
                <p className="font-display text-xs leading-relaxed" style={{ color: "#52525b" }}>
                  {explanation}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}