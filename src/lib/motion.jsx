import React from "react";
import { motion, useReducedMotion } from "framer-motion";

// Shared animation primitives so every page gets the same tactile feel as the
// dashboard. All primitives honor prefers-reduced-motion (animations collapse to
// static output for users who ask for reduced motion).

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } },
};

export const staggerContainer = (stagger = 0.07, delay = 0.04) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// Route-level entrance. Wrap page content once (keyed by route) for a clean
// fade + slide-up on every navigation.
export function PageTransition({ children, pageKey }) {
  const rm = useReducedMotion();
  if (rm) return <>{children}</>;
  return (
    <motion.div
      key={pageKey}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Container whose direct <StaggerItem> children cascade in as it scrolls into
// view. `as` lets it be a section/ul/etc.
export function Stagger({ children, className, style, stagger = 0.07, delay = 0.04, as = "div", once = true }) {
  const rm = useReducedMotion();
  const M = motion[as] || motion.div;
  if (rm) {
    const Plain = as;
    return <Plain className={className} style={style}>{children}</Plain>;
  }
  return (
    <M
      className={className}
      style={style}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, style, as = "div" }) {
  const rm = useReducedMotion();
  const M = motion[as] || motion.div;
  if (rm) {
    const Plain = as;
    return <Plain className={className} style={style}>{children}</Plain>;
  }
  return (
    <M className={className} style={style} variants={fadeUp}>
      {children}
    </M>
  );
}

// Card that lifts + gets a warm glow on hover.
export function HoverCard({ children, className, style, glow = "#E8A33C", lift = -4, as = "div", ...rest }) {
  const rm = useReducedMotion();
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      style={style}
      whileHover={rm ? undefined : { y: lift }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onMouseEnter={(e) => { if (!rm) e.currentTarget.style.boxShadow = `0 12px 40px -12px ${glow}55`; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
      {...rest}
    >
      {children}
    </M>
  );
}

// Progress/level bar that fills from 0 to pct% when scrolled into view.
export function AnimatedBar({ pct = 0, className, style, color = "#E8A33C", duration = 1 }) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ background: color, ...style }}
      initial={rm ? false : { width: 0 }}
      whileInView={{ width: `${pct}%` }}
      viewport={{ once: true }}
      transition={{ duration: rm ? 0 : duration, ease: "easeOut" }}
    />
  );
}

// Continuous glow pulse (e.g. streak flame).
export function Pulse({ children, color = "#FF7A3D", className, style }) {
  const rm = useReducedMotion();
  if (rm) return <span className={className} style={style}>{children}</span>;
  return (
    <motion.span
      className={className}
      style={{ display: "inline-flex", ...style }}
      animate={{
        scale: [1, 1.15, 1],
        filter: [`drop-shadow(0 0 2px ${color}88)`, `drop-shadow(0 0 10px ${color})`, `drop-shadow(0 0 2px ${color}88)`],
      }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
