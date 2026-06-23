// TRACE — CodeFlow's unified dark lesson surface.
//
// Single source of truth for the lesson reading experience. Replaces the old
// "white reading panel in a dark shell" (a zyBooks clone) with one flat dark
// editorial surface using a debugger/terminal metaphor. Components import these
// tokens into their inline styles — matching the codebase's inline-style
// convention (CSS vars can't feed the conditional ternaries these components use).
//
// Brand: warm amber (#E8A33C) + Bricolage/Hanken + the "§" motif on warm near-black.

export const trace = Object.freeze({
  // ── Surfaces (warm near-black, tinted toward amber — not cold gray) ──────────
  bg: '#15130E',          // page / shell
  raised: '#1C1A14',      // cards, activity panels
  surface: '#221F18',     // inset surfaces (code chips, inputs)
  terminal: '#131009',    // fenced code / output blocks (matches CodeEditor)

  // ── Lines ─────────────────────────────────────────────────────────────────
  border: '#262219',      // hairline
  borderStrong: '#34302A',// default control border
  borderActive: '#46413A',// hover

  // ── Text (warm off-white) ───────────────────────────────────────────────────
  text: '#ECE7DC',        // primary body
  dim: '#A39B8C',         // secondary
  faint: '#756C5C',       // tertiary / captions
  muted: '#4A453C',       // disabled / step dots

  // ── Brand + state. Single muted amber accent (replaces neon lime). ───────────
  lime: '#E8A33C',        // primary accent (name kept; value is amber)
  limeDim: '#C78A2E',     // accent on lighter inset
  limeFaint: '#E8A33C14', // accent wash (background tint)
  ok: '#E8A33C',          // pass / correct
  okWash: '#E8A33C12',
  fail: '#FF6B5C',        // fail / incorrect (warm coral, legible on dark)
  failWash: '#FF6B5C14',
  warn: '#E0B341',        // caution (warm gold)
  info: '#C2643C',        // secondary highlight (warm clay, replaces cold blue)

  // ── Fonts (match tailwind.config.js + index.css) ─────────────────────────────
  mono: "'Spline Sans Mono', ui-monospace, monospace",
  serif: "'Bricolage Grotesque', system-ui, sans-serif",
  sans: "'Hanken Grotesk', system-ui, sans-serif",
})

// Reusable style fragments — spread into style={{ ... }} for consistency.
export const traceStyles = Object.freeze({
  // Card / activity panel.
  panel: {
    background: trace.raised,
    border: `1px solid ${trace.border}`,
    borderRadius: '4px',
  },
  // Inset terminal surface (code, output).
  terminal: {
    background: trace.terminal,
    border: `1px solid ${trace.border}`,
    borderRadius: '4px',
  },
  // The "§ LABEL" uppercase mono tag used on every activity header.
  monoLabel: {
    fontFamily: trace.mono,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: trace.lime,
  },
  // Small pill (difficulty, xp, status).
  pill: {
    fontFamily: trace.mono,
    fontSize: '0.625rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '3px',
    border: `1px solid ${trace.borderStrong}`,
    color: trace.dim,
  },
  // Text input / textarea on dark.
  field: {
    background: trace.surface,
    border: `1px solid ${trace.borderStrong}`,
    color: trace.text,
    fontFamily: trace.mono,
    outline: 'none',
  },
})

// Accent color for an activity "kind" — used for the left rule on panels so the
// different block types stay visually distinct without the old zyBooks colors.
export const kindAccent = Object.freeze({
  drill: trace.lime,
  check: trace.lime,
  trace: trace.info,
  challenge: trace.lime,
  reflect: trace.warn,
  example: trace.dim,
})
