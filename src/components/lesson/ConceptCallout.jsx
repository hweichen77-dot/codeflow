import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, AlertTriangle, BookOpen, Zap, ChevronDown } from "lucide-react";

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    label: "TIP",
    bg: "#4d7c0f0d",
    border: "#4d7c0f33",
    accent: "#4d7c0f",
    labelColor: "#4d7c0f",
  },
  warning: {
    icon: AlertTriangle,
    label: "WATCH OUT",
    bg: "#ea580c0d",
    border: "#ea580c33",
    accent: "#ea580c",
    labelColor: "#ea580c",
  },
  analogy: {
    icon: BookOpen,
    label: "REAL-WORLD ANALOGY",
    bg: "#2563eb0d",
    border: "#2563eb33",
    accent: "#2563eb",
    labelColor: "#2563eb",
  },
  insight: {
    icon: Zap,
    label: "KEY INSIGHT",
    bg: "#9333ea0d",
    border: "#9333ea33",
    accent: "#9333ea",
    labelColor: "#9333ea",
  },
};

export function ConceptCallout({ type = "tip", title, children, collapsible = false }) {
  const [open, setOpen] = useState(true);
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.tip;
  const Icon = style.icon;

  return (
    <div
      className="my-5 rounded"
      style={{
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderLeft: `3px solid ${style.accent}`,
      }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        onClick={collapsible ? () => setOpen(o => !o) : undefined}
        style={{ cursor: collapsible ? "pointer" : "default" }}
      >
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color: style.accent, flexShrink: 0 }} />
          <span className="font-mono text-xs tracking-widest uppercase" style={{ color: style.labelColor }}>
            {style.label}
            {title && <span style={{ color: "#52525b", marginLeft: "0.5rem", textTransform: "none", fontFamily: "inherit", letterSpacing: 0 }}>— {title}</span>}
          </span>
        </div>
        {collapsible && (
          <ChevronDown
            size={13}
            style={{
              color: "#6b7280",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
        )}
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 font-display text-sm leading-relaxed"
              style={{ color: "#3f3f46", fontWeight: 400, borderTop: `1px solid ${style.border}` , paddingTop: "0.75rem" }}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function KeyTerms({ terms }) {
  if (!terms?.length) return null;
  return (
    <div className="my-5 p-4 rounded" style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}>
      <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#6b7280" }}>
        Key Terms
      </div>
      <div className="space-y-2">
        {terms.map((term, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#4d7c0f" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="font-mono text-xs font-bold" style={{ color: "#18181b" }}>
                {term.term}
              </span>
              <span className="font-display text-xs leading-relaxed ml-2" style={{ color: "#52525b" }}>
                — {term.definition}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConceptDiagram({ steps, title }) {
  if (!steps?.length) return null;
  return (
    <div className="my-5 p-4 rounded" style={{ background: "#ffffff", border: "1px solid #e4e4e7" }}>
      {title && (
        <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#6b7280" }}>
          {title}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div
              className="px-3 py-2 text-center rounded"
              style={{ background: "#f6f6f7", border: "1px solid #e4e4e7", minWidth: "80px" }}
            >
              <div className="font-mono text-xs font-bold" style={{ color: "#4d7c0f" }}>
                {step.label}
              </div>
              {step.desc && (
                <div className="font-display text-xs mt-0.5" style={{ color: "#52525b", fontSize: "0.7rem" }}>
                  {step.desc}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <span className="font-mono text-xs" style={{ color: "#9ca3af" }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}