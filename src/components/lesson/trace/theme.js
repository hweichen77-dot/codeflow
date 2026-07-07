
export const trace = Object.freeze({
  bg: '#15130E',
  raised: '#1C1A14',
  surface: '#221F18',
  terminal: '#131009',

  border: '#262219',
  borderStrong: '#34302A',
  borderActive: '#46413A',

  text: '#ECE7DC',
  dim: '#A39B8C',
  faint: '#FFFFFF',
  muted: '#4A453C',

  lime: '#E8A33C',
  limeDim: '#C78A2E',
  limeFaint: '#E8A33C14',
  ok: '#E8A33C',
  okWash: '#E8A33C12',
  fail: '#FF6B5C',
  failWash: '#FF6B5C14',
  warn: '#E0B341',
  info: '#C2643C',

  mono: "'Spline Sans Mono Variable', ui-monospace, monospace",
  serif: "'Bricolage Grotesque Variable', system-ui, sans-serif",
  sans: "'Hanken Grotesk Variable', system-ui, sans-serif",
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
