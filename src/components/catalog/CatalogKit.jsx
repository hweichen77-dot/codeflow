import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

export const TRACK_ACCENT = {
  ai: "#5ED29C",
  apcsp: "#4DA3FF",
  apcsa: "#A78BFA",
  projects: "#34D0C4",
  challenges: "#F472B6",
  competitive: "#FF6B5C",
};

export function CatalogPage({ children }) {
  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      {children}
    </div>
  );
}

export function CatalogHero({ title, lead, note, accent = "var(--accent)", children }) {
  return (
    <header
      className="relative px-6 sm:px-10 lg:px-16 pt-12 pb-10"
      style={{ borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div className="mx-auto max-w-6xl text-center">
        <h1
          className="u-display t-strong"
          style={{ fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)", margin: 0 }}
        >
          {title}
        </h1>
        {lead && (
          <p className="t-body measure mx-auto" style={{ fontSize: 18, lineHeight: 1.55, marginTop: 16 }}>
            {lead}
          </p>
        )}
        {note && (
          <p className="u-mono t-muted mx-auto" style={{ fontSize: 12, lineHeight: 1.6, marginTop: 16, maxWidth: "60ch" }}>
            {note}
          </p>
        )}
        {children}
      </div>
    </header>
  );
}

export function SearchInput({ value, onChange, placeholder = "Filter…" }) {
  return (
    <label
      className="flex items-center gap-2.5 px-3.5 h-11 flex-1 min-w-[12rem] max-w-sm"
      style={{
        border: "1px solid var(--border-subtle)",
        borderRadius: 12,
        background: "var(--bg-raised)",
      }}
    >
      <Search size={15} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="t-body w-full bg-transparent outline-none text-sm"
        style={{ caretColor: "var(--accent)" }}
      />
    </label>
  );
}

export function Facet({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label={label}>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className="u-mono text-xs px-3.5 h-8 transition-colors duration-150"
            style={{
              borderRadius: 9,
              border: `1px solid ${active ? "var(--accent)" : "var(--border-subtle)"}`,
              color: active ? "var(--accent)" : "var(--text-muted)",
              background: active ? "rgba(94,210,156,0.10)" : "transparent",
              letterSpacing: "0.04em",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function TagChips({ tags, active, onToggle }) {
  if (!tags?.length) return null;
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {tags.map((t) => {
        const on = active === t;
        return (
          <button
            key={t}
            onClick={() => onToggle(on ? null : t)}
            aria-pressed={on}
            className="u-mono transition-colors duration-150"
            style={{
              fontSize: 11,
              padding: "3px 9px",
              borderRadius: 7,
              border: `1px solid ${on ? "var(--accent-2)" : "var(--border-subtle)"}`,
              color: on ? "var(--accent-2)" : "var(--text-muted)",
              background: on ? "rgba(52,208,196,0.10)" : "transparent",
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

export function FilterToolbar({ children }) {
  return <div className="flex flex-wrap items-center gap-3 mb-6">{children}</div>;
}

export function CardGrid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
      {children}
    </div>
  );
}

const STATUS_STYLE = {
  completed: { color: "var(--run)", label: "Done" },
  in_progress: { color: "var(--accent)", label: "Active" },
  active: { color: "var(--accent)", label: "Active" },
  locked: { color: "var(--text-muted)", label: "Locked" },
  not_started: null,
};

function CardShell({ accent, gated, children, index }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative flex flex-col h-full overflow-hidden transition-transform duration-200"
      style={{
        background: "var(--bg-raised)",
        border: `1px solid ${hover && !gated ? "var(--border-default)" : "var(--border-subtle)"}`,
        borderRadius: 16,
        padding: 22,
        opacity: gated ? 0.6 : 1,
        transform: hover && !gated ? "translateY(-3px)" : "none",
        boxShadow: hover && !gated ? `0 16px 44px -18px ${accent}66` : "none",
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px transition-opacity duration-200"
        style={{ background: accent, opacity: hover && !gated ? 0.9 : 0.35 }}
      />
      {index != null && (
        <span
          aria-hidden="true"
          className="u-mono absolute right-4 top-3"
          style={{ fontSize: 12, color: "var(--text-muted)", opacity: 0.5, letterSpacing: "-0.03em" }}
        >
          {index}
        </span>
      )}
      {children}
    </article>
  );
}

export function CourseCard({
  to,
  onClick,
  accent = "var(--accent)",
  index,
  title,
  description,
  tags = [],
  meta = [],
  status,
  progressPct,
  gated,
  lockLabel = "Finish Foundations first",
}) {
  const st = gated ? STATUS_STYLE.locked : STATUS_STYLE[status];
  const body = (
    <CardShell accent={accent} gated={gated} index={index}>
      <div className="flex items-start justify-between gap-3 mb-2 pr-6">
        <h3 className="u-display t-strong" style={{ fontSize: 18, lineHeight: 1.2, margin: 0 }}>
          {title}
        </h3>
      </div>
      {description && (
        <p
          className="t-body"
          style={{ fontSize: 14, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {description}
        </p>
      )}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="u-mono"
              style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, border: `1px solid ${accent}40`, color: accent, background: `${accent}12` }}
            >
              {t}
            </span>
          ))}
        </div>
      )}
      {typeof progressPct === "number" && progressPct > 0 && progressPct < 100 && (
        <div className="mt-3 flex items-center gap-2.5">
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--border-subtle)" }}>
            <div className="h-full rounded-full" style={{ width: `${progressPct}%`, background: accent }} />
          </div>
          <span className="u-mono" style={{ fontSize: 11, color: accent }}>{progressPct}%</span>
        </div>
      )}
      <div
        className="flex items-center justify-between gap-3 mt-4 pt-3.5"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <span className="u-mono t-muted" style={{ fontSize: 12 }}>
          {gated ? lockLabel : meta.filter(Boolean).join("  ·  ")}
        </span>
        {st && (
          <span
            className="u-mono"
            style={{ fontSize: 11, color: st.color, padding: "2px 9px", borderRadius: 6, border: `1px solid ${st.color}`, letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          >
            {st.label}
          </span>
        )}
      </div>
    </CardShell>
  );

  if (gated) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-disabled="true"
        className="cursor-not-allowed"
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick?.(); }
        }}
      >
        {body}
      </div>
    );
  }
  return (
    <Link to={to} className="block h-full focus:outline-none">
      {body}
    </Link>
  );
}

export function EmptyState({ children = "No results match your filters." }) {
  return (
    <div className="text-center py-24">
      <p className="t-muted" style={{ fontSize: 15 }}>{children}</p>
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <CardGrid>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse"
          style={{ height: 168, background: "var(--bg-raised)", border: "1px solid var(--border-subtle)", borderRadius: 16 }}
        />
      ))}
    </CardGrid>
  );
}
