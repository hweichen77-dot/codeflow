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
      style={{ border: `1px solid ${isMatch ? "#E8A33C44" : "#FF6B5C33"}`, background: "#15130E" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ borderBottom: `1px solid ${isMatch ? "#E8A33C22" : "#FF6B5C22"}` }}
      >
        <span style={{ fontSize: "0.7rem" }}>{isMatch ? "✓" : "✗"}</span>
        <span className="font-sans text-xs tracking-widest uppercase" style={{ color: isMatch ? "#E8A33C" : "#FF6B5C" }}>
          {isMatch ? "Output matches expected" : "Output doesn't match yet"}
        </span>
      </div>
      <div className="grid grid-cols-2 divide-x" style={{ borderColor: "#262219" }}>
        <div className="px-4 py-3">
          <div className="font-sans text-xs mb-2" style={{ color: "#FFFFFF" }}>YOURS</div>
          <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: isMatch ? "#E8A33C" : "#ff9999", fontSize: "0.7rem" }}>
            {actualOutput}
          </pre>
        </div>
        <div className="px-4 py-3">
          <div className="font-sans text-xs mb-2" style={{ color: "#FFFFFF" }}>EXPECTED</div>
          <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: "#FFFFFF", fontSize: "0.7rem" }}>
            {expectedOutput}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}