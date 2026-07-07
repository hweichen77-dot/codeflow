import React, { useState, useEffect, useRef } from "react";
import { api, aiAvailable } from "@/api/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export default function AIExplainModal({ hint, studentCode, solutionCode, lessonTitle, onClose }) {
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(aiAvailable);
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    dialogRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused.current?.focus) previouslyFocused.current.focus();
    };
  }, [onClose]);

  useEffect(() => {
    if (!aiAvailable) return;
    async function fetchExplanation() {
      setLoading(true);
      const result = await api.integrations.Core.InvokeLLM({
        prompt: `A student is learning "${lessonTitle}". The AI tutor flagged this issue in their code:

"${hint}"

Student's code:
\`\`\`
${studentCode}
\`\`\`

${solutionCode ? `Reference solution pattern:\n\`\`\`\n${solutionCode}\n\`\`\`` : ""}

Explain to the student in exactly 3 parts:
1. WHAT I NOTICED: The specific pattern in their code that triggered this hint (point to the exact line/expression)
2. WHY IT MATTERS: What will go wrong if they leave it, with a concrete example
3. THE CONCEPT: What programming concept this connects to and one sentence on how to think about it

Be direct and educational. Use code examples where helpful. Total response under 200 words.`,
      });
      setExplanation(result);
      setLoading(false);
    }
    fetchExplanation();
  }, [hint]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.85)" }}
        onClick={onClose}
      >
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="How the AI caught this issue"
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="w-full max-w-lg outline-none"
          style={{ background: "#1C1A14", border: "1px solid #34302A" }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #262219" }}>
            <div className="flex items-center gap-3">
              <span className="font-sans text-xs tracking-widest uppercase px-2 py-1" style={{ color: "#E0B341", border: "1px solid #E0B34133", background: "#E0B34110" }}>
                HOW DID I CATCH THIS?
              </span>
            </div>
            <button onClick={onClose} aria-label="Close dialog" style={{ color: "#FFFFFF" }} onMouseEnter={e => e.currentTarget.style.color = "#C9C1B2"} onMouseLeave={e => e.currentTarget.style.color = "#BBB3A4"}>
              <X size={16} />
            </button>
          </div>

          <div className="px-6 py-4" style={{ borderBottom: "1px solid #262219", background: "#131009" }}>
            <p className="font-sans text-xs" style={{ color: "#FFFFFF" }}>Flagged issue:</p>
            <p className="font-sans text-sm mt-1" style={{ color: "#E0B341" }}>"{hint}"</p>
          </div>

          <div className="px-6 py-5" style={{ minHeight: "180px" }}>
            {loading ? (
              <div className="flex items-center gap-3">
                <Loader2 size={14} className="animate-spin" style={{ color: "#E0B341" }} />
                <span className="font-sans text-xs" style={{ color: "#FFFFFF" }}>Analyzing your code...</span>
              </div>
            ) : (
              <div className="font-display text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                {explanation}
              </div>
            )}
          </div>

          <div className="px-6 py-3" style={{ borderTop: "1px solid #262219" }}>
            <p className="font-sans text-xs" style={{ color: "#ECE7DC" }}>
              The AI analyzed your code against the expected solution pattern to surface this.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}