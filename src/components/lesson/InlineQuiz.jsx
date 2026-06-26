import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

export default function InlineQuiz({ question, options, correctIndex, explanation }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const answered = revealed && selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div
      className="my-6 rounded"
      style={{ border: `1px solid ${trace.border}`, background: trace.raised }}
    >
      <div className="px-4 py-2.5 flex items-center gap-2" style={{ borderBottom: `1px solid ${trace.border}` }}>
        <span
          className="font-sans text-xs tracking-widest uppercase flex items-center gap-1.5"
          style={{ color: trace.lime, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          ▸ CHECK
        </span>
      </div>

      <div className="px-4 py-4">
        <p className="font-display text-sm font-semibold mb-3" style={{ color: trace.text }}>
          {question}
        </p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            let bg = trace.surface;
            let border = trace.borderStrong;
            let color = trace.dim;

            if (revealed) {
              if (i === correctIndex) {
                bg = trace.okWash; border = trace.ok; color = trace.ok;
              } else if (i === selected && i !== correctIndex) {
                bg = trace.failWash; border = trace.fail; color = trace.fail;
              }
            } else if (selected === i) {
              border = trace.borderActive; color = trace.text;
            }

            return (
              <button
                key={i}
                onClick={() => !revealed && setSelected(i)}
                className="w-full text-left px-3 py-2.5 rounded transition-all duration-150 font-display text-sm"
                style={{ background: bg, border: `1px solid ${border}`, color, cursor: revealed ? "default" : "pointer" }}
              >
                <span className="font-sans text-xs mr-2" style={{ color: trace.faint }}>
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
            className="mt-3 font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
            style={{ color: trace.bg, border: `1px solid ${trace.lime}`, background: trace.lime }}
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
                background: isCorrect ? trace.okWash : trace.failWash,
                border: `1px solid ${isCorrect ? trace.ok : trace.fail}`,
              }}
            >
              <div
                className="font-sans text-xs font-bold mb-1 flex items-center gap-1.5"
                style={{ color: isCorrect ? trace.ok : trace.fail }}
              >
                {isCorrect ? <CheckCircle size={13} /> : <XCircle size={13} />}
                {isCorrect ? "Correct!" : "Not quite"}
              </div>
              {explanation && (
                <p className="font-display text-xs leading-relaxed" style={{ color: trace.dim }}>
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
