import React, { useState, useEffect } from "react";
import { motion, useReducedMotion, animate } from "framer-motion";

const motionComponentCache = new WeakMap();
function resolveMotionComp(as) {
  if (typeof as === "string") return motion[as] || motion.div;
  if (typeof as !== "function" && typeof as !== "object") return motion.div;
  let m = motionComponentCache.get(as);
  if (!m) { m = motion.create(as); motionComponentCache.set(as, m); }
  return m;
}

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 24 } },
};

export const staggerContainer = (stagger = 0.07, delay = 0.04) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

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

export function Stagger({ children, className, style, stagger = 0.07, delay = 0.04, as = "div" }) {
  const rm = useReducedMotion();
  const M = resolveMotionComp(as);
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
      animate="show"
    >
      {children}
    </M>
  );
}

export function StaggerItem({ children, className, style, as = "div" }) {
  const rm = useReducedMotion();
  const M = resolveMotionComp(as);
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

export function HoverCard({ children, className, style, glow = "#5ED29C", lift = -4, as = "div", ...rest }) {
  const rm = useReducedMotion();
  const M = resolveMotionComp(as);
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

export function AnimatedBar({ pct = 0, className, style, color = "#5ED29C", duration = 1 }) {
  const rm = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ background: color, ...style }}
      initial={rm ? false : { width: 0 }}
      animate={{ width: `${pct}%` }}
      transition={{ duration: rm ? 0 : duration, ease: "easeOut" }}
    />
  );
}

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

export function CountUp({ to = 0, duration = 0.9, className, style }) {
  const rm = useReducedMotion();
  const [val, setVal] = useState(rm ? to : 0);
  useEffect(() => {
    if (rm) { setVal(to); return; }
    const controls = animate(0, to, { duration, ease: "easeOut", onUpdate: (v) => setVal(v) });
    return () => controls.stop();
  }, [to, rm, duration]);
  return <span className={className} style={style}>{Math.round(val)}</span>;
}
