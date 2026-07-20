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
            background: "#070B0A",
            borderTop: "1px solid #17201C",
            borderLeft: "2px solid #5ED29C",
          }}
        >
          <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: "#5ED29C" }}>AI</span>
          <p className="font-sans text-xs flex-1 leading-relaxed" style={{ color: "#FFFFFF" }}>
            {hint}
          </p>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onExplain}
              className="font-sans text-xs px-2 py-1 transition-colors"
              style={{ color: "#FFFFFF", border: "1px solid #17201C" }}
              onMouseEnter={e => e.currentTarget.style.color = "#5ED29C"}
              onMouseLeave={e => e.currentTarget.style.color = "#B7C6BE"}
            >
              how?
            </button>
            <button
              onClick={onDismiss}
              className="font-sans text-xs"
              style={{ color: "#ECF3EF" }}
              onMouseEnter={e => e.currentTarget.style.color = "#B7C6BE"}
              onMouseLeave={e => e.currentTarget.style.color = "#ECF3EF"}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}