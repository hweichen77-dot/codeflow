import React from "react";
import { motion } from "framer-motion";

function normalize(str) {
  return (str || "").trim().replace(/\s+/g, " ");
}

export default function OutputComparison({ actualOutput, expectedOutput }) {
  if (!actualOutput || !expectedOutput) return null;

  const isMatch = normalize(actualOutput) === normalize(expectedOutput);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3"
      style={{ border: `1px solid ${isMatch ? "#b8ff0044" : "#ff6b6b33"}`, background: "#0a0a0a" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ borderBottom: `1px solid ${isMatch ? "#b8ff0022" : "#ff6b6b22"}` }}
      >
        <span style={{ fontSize: "0.7rem" }}>{isMatch ? "✓" : "✗"}</span>
        <span className="font-mono text-xs tracking-widest uppercase" style={{ color: isMatch ? "#b8ff00" : "#ff6b6b" }}>
          {isMatch ? "Output matches expected" : "Output doesn't match yet"}
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: "#1a1a1a" }}>
        <div className="px-4 py-3">
          <div className="font-mono text-xs mb-2" style={{ color: "#555" }}>YOURS</div>
          <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: isMatch ? "#b8ff00" : "#ff9999", fontSize: "0.7rem" }}>
            {actualOutput}
          </pre>
        </div>
        <div className="px-4 py-3">
          <div className="font-mono text-xs mb-2" style={{ color: "#555" }}>EXPECTED</div>
          <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: "#888", fontSize: "0.7rem" }}>
            {expectedOutput}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}