import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Global XP toast queue
let toastListeners = [];
export function showXPToast(message, xp, emoji = "⚡") {
  const id = Date.now() + Math.random();
  toastListeners.forEach(fn => fn({ id, message, xp, emoji }));
}

export default function XPToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const listener = (toast) => {
      setToasts(prev => [...prev, toast]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 2800);
    };
    toastListeners.push(listener);
    return () => { toastListeners = toastListeners.filter(l => l !== listener); };
  }, []);

  return (
    <div style={{ position: "fixed", top: "80px", right: "24px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px", pointerEvents: "none" }}>
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            style={{
              background: "#0d0d0d",
              border: "1px solid #b8ff0033",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "200px",
            }}
          >
            <span style={{ fontSize: "1.25rem" }}>{toast.emoji}</span>
            <div>
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>
                +{toast.xp} XP
              </div>
              <div className="font-display text-xs" style={{ color: "#999", fontWeight: 400 }}>
                {toast.message}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}