// TRACE — CodeFlow's unified dark lesson surface.
//
// Single source of truth for the lesson reading experience. Replaces the old
// "white reading panel in a dark shell" (a zyBooks clone) with one flat dark
// editorial surface using a debugger/terminal metaphor. Components import these
// tokens into their inline styles — matching the codebase's inline-style
// convention (CSS vars can't feed the conditional ternaries these components use).
//
// Brand: lime (#b8ff00) + mono + the "§" section motif on near-black.

export const trace = Object.freeze({
  // ── Surfaces ────────────────────────────────────────────────────────────────
  bg: '#0a0a0a',          // page / shell
  raised: '#111111',      // cards, activity panels
  surface: '#161616',     // inset surfaces (code chips, inputs)
  terminal: '#0d0d0d',    // fenced code / output blocks (matches CodeEditor)

  // ── Lines ─────────────────────────────────────────────────────────────────
  border: '#1e1e1e',      // hairline
  borderStrong: '#2a2a2a',// default control border
  borderActive: '#3a3a3a',// hover

  // ── Text ────────────────────────────────────────────────────────────────────
  text: '#e8e8e8',        // primary body
  dim: '#a0a0a0',         // secondary
  faint: '#6a6a6a',       // tertiary / captions
  muted: '#444444',       // disabled / step dots

  // ── Brand + state (all tuned for legibility on near-black) ───────────────────
  lime: '#b8ff00',        // primary accent
  limeDim: '#9fd80a',     // accent on lighter inset
  limeFaint: '#b8ff0014', // accent wash (background tint)
  ok: '#b8ff00',          // pass / correct
  okWash: '#b8ff0010',
  fail: '#ff5c5c',        // fail / incorrect (legible on dark, unlike #dc2626)
  failWash: '#ff5c5c12',
  warn: '#ffb300',        // caution
  info: '#7cc4ff',        // neutral highlight (was #2563eb blue)

  // ── Fonts (match tailwind.config.js + .reader-surface) ───────────────────────
  mono: "'IBM Plex Mono', 'Space Mono', monospace",
  serif: "'IBM Plex Serif', Georgia, serif",
  sans: "'IBM Plex Sans', system-ui, sans-serif",
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
