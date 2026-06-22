import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, AlertTriangle, BookOpen, Zap, ChevronDown } from "lucide-react";
import { trace } from "@/components/lesson/trace/theme";

const CALLOUT_STYLES = {
  tip: {
    icon: Lightbulb,
    label: "TIP",
    bg: trace.limeFaint,
    border: trace.border,
    accent: trace.lime,
    labelColor: trace.lime,
  },
  warning: {
    icon: AlertTriangle,
    label: "WATCH OUT",
    bg: trace.failWash,
    border: trace.border,
    accent: trace.warn,
    labelColor: trace.warn,
  },
  analogy: {
    icon: BookOpen,
    label: "REAL-WORLD ANALOGY",
    bg: trace.raised,
    border: trace.border,
    accent: trace.info,
    labelColor: trace.info,
  },
  insight: {
    icon: Zap,
    label: "KEY INSIGHT",
    bg: trace.limeFaint,
    border: trace.border,
    accent: trace.lime,
    labelColor: trace.lime,
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
            {title && <span style={{ color: trace.faint, marginLeft: "0.5rem", textTransform: "none", fontFamily: "inherit", letterSpacing: 0 }}>— {title}</span>}
          </span>
        </div>
        {collapsible && (
          <ChevronDown
            size={13}
            style={{
              color: trace.faint,
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
              style={{ color: trace.text, fontWeight: 400, borderTop: `1px solid ${style.border}` , paddingTop: "0.75rem" }}
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
    <div className="my-5 p-4 rounded" style={{ background: trace.raised, border: `1px solid ${trace.border}` }}>
      <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: trace.faint }}>
        Key Terms
      </div>
      <div className="space-y-2">
        {terms.map((term, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: trace.lime }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <span className="font-mono text-xs font-bold" style={{ color: trace.text }}>
                {term.term}
              </span>
              <span className="font-display text-xs leading-relaxed ml-2" style={{ color: trace.dim }}>
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
    <div className="my-5 p-4 rounded" style={{ background: trace.raised, border: `1px solid ${trace.border}` }}>
      {title && (
        <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: trace.faint }}>
          {title}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-1">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <div
              className="px-3 py-2 text-center rounded"
              style={{ background: trace.surface, border: `1px solid ${trace.border}`, minWidth: "80px" }}
            >
              <div className="font-mono text-xs font-bold" style={{ color: trace.lime }}>
                {step.label}
              </div>
              {step.desc && (
                <div className="font-display text-xs mt-0.5" style={{ color: trace.dim, fontSize: "0.7rem" }}>
                  {step.desc}
                </div>
              )}
            </div>
            {i < steps.length - 1 && (
              <span className="font-mono text-xs" style={{ color: trace.faint }}>→</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
