import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { font } from "@/lib/tokens";
import { Stagger, StaggerItem, HoverCard, AnimatedBar, Pulse, CountUp } from "@/lib/motion";

// Shared UI kit — the dashboard's card design language, reusable app-wide.
// Deep off-black surfaces, warm borders, tiny uppercase eyebrow labels, amber/
// gold/emerald accents. Cards lift + glow on hover; grids stagger in.

export const KIT = {
  bg: "#15130E",
  card: "#1B1913",
  cardHi: "#221F17",
  border: "#2A261D",
  borderHi: "#3A3428",
  amber: "#E8A33C",
  amberBright: "#F5B942",
  gold: "#F2C94C",
  goldGrad: "linear-gradient(135deg, #F2C94C 0%, #E8A33C 55%, #B4741E 100%)",
  mono: "'Spline Sans Mono Variable', ui-monospace, monospace",
  ember: "#FF7A3D",
  emerald: "#4CC98A",
  white: "#FFFFFF",
  text: "#F2EDE2",
  dim: "#B9B1A2",
};

// Tiny uppercase tracked label with a gold terminal-prompt caret — the recurring
// signature motif, stamped on every section label across the app.
export function Eyebrow({ children, color = KIT.dim, className = "", style, caret = true }) {
  return (
    <div className={`text-[11px] tracking-[0.18em] uppercase inline-flex items-center gap-1.5 ${className}`}
      style={{ color, fontFamily: KIT.mono, ...style }}>
      {caret && <span aria-hidden="true" style={{ color: KIT.amber, fontWeight: 700 }}>&#9656;</span>}
      {children}
    </div>
  );
}

// Base surface card. Lifts + warm-glows on hover unless hover={false}.
export function Card({ children, className = "", style, accent = KIT.amber, hover = true, as = "div", ...rest }) {
  const base = { background: KIT.card, border: `1px solid ${KIT.border}`, borderRadius: 16, ...style };
  if (!hover) {
    const Tag = as;
    return <Tag className={className} style={base} {...rest}>{children}</Tag>;
  }
  return (
    <HoverCard as={as} className={`cf-scan-host ${className}`} style={base} glow={accent} {...rest}>
      {children}
    </HoverCard>
  );
}

// Stat card: eyebrow label, big value, sub-label, accent icon (+optional badge
// or pulsing icon). Matches the dashboard stat cards exactly.
export function StatCard({ label, value, sub, icon: Icon, accent = KIT.amber, badge, pulse = false, className = "" }) {
  return (
    <Card accent={accent} className={`p-5 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <Eyebrow>{label}</Eyebrow>
        {Icon && (pulse ? (
          <Pulse color={accent}><Icon size={18} style={{ color: accent }} /></Pulse>
        ) : (
          <span className="relative inline-flex items-center justify-center">
            <Icon size={18} style={{ color: accent }} />
            {badge != null && (
              <span className="absolute -top-2 -right-2 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center"
                style={{ background: accent, color: KIT.bg }}>{badge}</span>
            )}
          </span>
        ))}
      </div>
      <div style={{ fontFamily: font.display, fontSize: "1.7rem", fontWeight: 800, color: KIT.white, lineHeight: 1 }}>
        {/^\d+$/.test(String(value)) ? <CountUp to={Number(value)} /> : value}
      </div>
      {sub && <div className="mt-1.5 text-xs" style={{ color: KIT.dim }}>{sub}</div>}
    </Card>
  );
}

// Responsive stat-card grid that staggers its children in.
export function StatGrid({ children, cols = 4, className = "" }) {
  const col = cols === 3 ? "lg:grid-cols-3" : cols === 2 ? "lg:grid-cols-2" : "lg:grid-cols-4";
  return (
    <Stagger as="div" className={`grid grid-cols-2 ${col} gap-4 ${className}`}>
      {React.Children.map(children, (child) => <StaggerItem>{child}</StaggerItem>)}
    </Stagger>
  );
}

// Pill progress bar with animated fill. Amber->gold by default; pass color for
// a solid (e.g. emerald for "complete").
export function ProgressBar({ pct = 0, color, height = 10, track = "#0F0D08", glow = true, className = "", style }) {
  const fill = color || KIT.goldGrad;
  return (
    <div className={`w-full rounded-full overflow-hidden ${className}`} style={{ height, background: track, ...style }}>
      <AnimatedBar pct={pct} color={fill} className="h-full rounded-full"
        style={{ boxShadow: glow ? `0 0 12px ${KIT.amber}55` : "none" }} />
    </div>
  );
}

// Primary amber call-to-action with a sliding arrow. Renders a Link (to) or a
// button (onClick).
export function PrimaryButton({ children, to, onClick, arrow = true, className = "", type = "button" }) {
  const style = { background: KIT.goldGrad, color: KIT.bg };
  const cls = `group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-sans text-sm font-bold tracking-wide uppercase transition-all duration-200 ${className}`;
  const enter = (e) => { e.currentTarget.style.filter = "brightness(1.08)"; e.currentTarget.style.boxShadow = `0 10px 30px -8px ${KIT.amber}aa`; };
  const leave = (e) => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = "none"; };
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1.5" />}
    </>
  );
  if (to) return <Link to={to} className={cls} style={style} onMouseEnter={enter} onMouseLeave={leave}>{inner}</Link>;
  return <button type={type} onClick={onClick} className={cls} style={style} onMouseEnter={enter} onMouseLeave={leave}>{inner}</button>;
}

// Larger feature/hero card (the "Continue Learning" panel): warm gradient,
// eyebrow, big title, and freeform content (progress, meta, CTA).
export function HeroCard({ eyebrow, title, children, className = "", style }) {
  return (
    <div className={`rounded-2xl p-6 lg:p-8 relative overflow-hidden ${className}`}
      style={{ background: "linear-gradient(135deg, #1F1B12 0%, #17140E 100%)", border: `1px solid ${KIT.borderHi}`, ...style }}>
      <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${KIT.amber}22, transparent 70%)` }} />
      <div className="relative">
        {eyebrow && <Eyebrow color={KIT.amber} className="mb-2">{eyebrow}</Eyebrow>}
        {title && (
          <h2 style={{ fontFamily: font.display, fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: KIT.white, letterSpacing: "-0.02em", margin: 0 }}>
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  );
}

// Section header: eyebrow + optional big editorial title, for page tops.
export function SectionHeader({ eyebrow, title, sub, className = "" }) {
  return (
    <div className={className}>
      {eyebrow && <Eyebrow color={KIT.amber} className="mb-3">{eyebrow}</Eyebrow>}
      {title && (
        <h1 style={{ fontFamily: font.display, fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 800, letterSpacing: "-0.03em", color: KIT.white, lineHeight: 1.1, margin: 0 }}>
          {title}
        </h1>
      )}
      {sub && <p className="mt-3 text-base" style={{ color: KIT.dim, fontFamily: font.display }}>{sub}</p>}
    </div>
  );
}
