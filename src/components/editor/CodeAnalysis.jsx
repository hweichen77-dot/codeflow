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
            background: "#0a0a0a",
            borderTop: "1px solid #1e1e1e",
            borderLeft: "2px solid #ffb300",
          }}
        >
          <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#ffb300" }}>AI</span>
          <p className="font-mono text-xs flex-1 leading-relaxed" style={{ color: "#888" }}>
            {hint}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onExplain}
              className="font-mono text-xs px-2 py-1 transition-colors"
              style={{ color: "#555", border: "1px solid #1e1e1e" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ffb300"}
              onMouseLeave={e => e.currentTarget.style.color = "#555"}
            >
              how?
            </button>
            <button
              onClick={onDismiss}
              className="font-mono text-xs"
              style={{ color: "#333" }}
              onMouseEnter={e => e.currentTarget.style.color = "#666"}
              onMouseLeave={e => e.currentTarget.style.color = "#333"}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}