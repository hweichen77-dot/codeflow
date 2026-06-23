import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CodeAnalysis({ hint, onDismiss, onExplain }) {
  return (
    <AnimatePresence>
      {hint && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-start gap-3 px-4 py-3"
          style={{
            background: "#15130E",
            borderTop: "1px solid #262219",
            borderLeft: "2px solid #E0B341",
          }}
        >
          <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#E0B341" }}>AI</span>
          <p className="font-mono text-xs flex-1 leading-relaxed" style={{ color: "#C9C1B2" }}>
            {hint}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onExplain}
              className="font-mono text-xs px-2 py-1 transition-colors"
              style={{ color: "#BBB3A4", border: "1px solid #262219" }}
              onMouseEnter={e => e.currentTarget.style.color = "#E0B341"}
              onMouseLeave={e => e.currentTarget.style.color = "#BBB3A4"}
            >
              how?
            </button>
            <button
              onClick={onDismiss}
              className="font-mono text-xs"
              style={{ color: "#ECE7DC" }}
              onMouseEnter={e => e.currentTarget.style.color = "#BBB3A4"}
              onMouseLeave={e => e.currentTarget.style.color = "#ECE7DC"}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}