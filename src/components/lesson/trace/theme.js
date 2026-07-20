
export const trace = Object.freeze({
  bg: '#070B0A',
  raised: '#0C1210',
  surface: '#111917',
  terminal: '#070B0A',

  border: '#17201C',
  borderStrong: '#26302B',
  borderActive: '#46413A',

  text: '#ECF3EF',
  dim: '#B7C6BE',
  faint: '#FFFFFF',
  muted: '#4A453C',

  lime: '#5ED29C',
  limeDim: '#C78A2E',
  limeFaint: '#5ED29C14',
  ok: '#5ED29C',
  okWash: '#5ED29C12',
  fail: '#FF6B5C',
  failWash: '#FF6B5C14',
  warn: '#5ED29C',
  info: '#C2643C',

  mono: "'Spline Sans Mono Variable', ui-monospace, monospace",
  serif: "'Inter', system-ui, sans-serif",
  sans: "'Inter', system-ui, sans-serif",
})

export const traceStyles = Object.freeze({
  panel: {
    background: trace.raised,
    border: `1px solid ${trace.border}`,
    borderRadius: '4px',
  },
  terminal: {
    background: trace.terminal,
    border: `1px solid ${trace.border}`,
    borderRadius: '4px',
  },
  monoLabel: {
    fontFamily: trace.sans,
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: trace.lime,
  },
  pill: {
    fontFamily: trace.sans,
    fontSize: '0.625rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: '3px',
    border: `1px solid ${trace.borderStrong}`,
    color: '#FFFFFF',
  },
  field: {
    background: trace.surface,
    border: `1px solid ${trace.borderStrong}`,
    color: trace.text,
    fontFamily: trace.mono,
    outline: 'none',
  },
})

export const kindAccent = Object.freeze({
  drill: trace.lime,
  check: trace.lime,
  trace: trace.info,
  challenge: trace.lime,
  reflect: trace.warn,
  example: trace.dim,
})
