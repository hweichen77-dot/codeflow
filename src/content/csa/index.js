// AP Computer Science A — module aggregator (Java).
// Each module file exports default { project, lessons }, with
// project.track === 'apcsa', project.unit === the Unit label, and lessons that
// set language: 'java' (solutions declare `public class Main`).
//
// NOTE: explicit static imports (NOT import.meta.glob) — the Node validate/verify
// scripts import this under plain Node. As each Unit module is authored
// (Phase 5), add its import to MODULES below.
export const MODULES = []

export { default as BRIEFS } from './briefs.js'
