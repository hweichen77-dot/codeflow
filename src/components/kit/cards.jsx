import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function trackPointer(e) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}

export function BentoGrid({ children, className }) {
  return (
    <div className={cn("mx-auto grid max-w-6xl grid-cols-1 gap-4 md:auto-rows-[16rem] md:grid-cols-6", className)}>
      {children}
    </div>
  );
}

export function BentoCard({ title, body, img, span = "", className, children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      onMouseMove={trackPointer}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6",
        "transition-colors hover:border-[#5ED29C]/40",
        span,
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--x,50%)_var(--y,0%),rgba(94,210,156,.12),transparent_70%)]" />
      <div className="relative z-10 flex flex-1 flex-col">
        {title && (
          <h3 className="text-base font-medium" style={{ color: "var(--text-strong)" }}>
            {title}
          </h3>
        )}
        {body && (
          <p className="mt-2 max-w-xs text-sm" style={{ color: "var(--text-muted)" }}>
            {body}
          </p>
        )}
        {children}
      </div>
      {img && (
        <img
          src={img}
          alt=""
          className="pointer-events-none absolute -bottom-4 -right-4 w-2/3 rounded-tl-xl border-l border-t border-white/10 opacity-90 transition-transform duration-500 group-hover:-translate-y-1"
        />
      )}
    </motion.div>
  );
}

export function SpotlightCard({ children, className, glow = "rgba(94,210,156,.10)" }) {
  return (
    <div
      onMouseMove={trackPointer}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(500px circle at var(--x) var(--y), ${glow}, transparent 40%)` }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function GradientBorder({ children, className }) {
  return (
    <div className={cn("relative rounded-2xl p-[1.5px]", className)}>
      <div className="absolute inset-0 rounded-2xl [background:conic-gradient(from_var(--kit-a),#5ED29C,#34D0C4,#5ED29C)] [animation:kit-spin_4s_linear_infinite]" />
      <div className="relative rounded-[calc(1rem-1.5px)] bg-[#0C1210] p-6" style={{ color: "var(--text-primary)" }}>
        {children}
      </div>
    </div>
  );
}

export function CodeWindow({ file = "main.py", children, className }) {
  return (
    <div className={cn("overflow-hidden rounded-xl border border-white/10 bg-[#0d100e] shadow-2xl shadow-black/60", className)}>
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs" style={{ color: "var(--text-muted)" }}>
          {file}
        </span>
      </div>
      <pre className="overflow-x-auto p-5 text-[13px] leading-relaxed u-mono">{children}</pre>
    </div>
  );
}
