// AP Computer Science Principles — module aggregator.
// Each module file exports default { project, lessons } like the AI curriculum,
// with project.track === 'apcsp' and project.unit === the Big Idea label.
//
// NOTE: explicit static imports (NOT import.meta.glob) — the Node validate/verify
// scripts import this under plain Node where glob is undefined. As each Big Idea
// module is authored (Phase 4), add its import to MODULES below.
export const MODULES = []

export { default as BRIEFS } from './briefs.js'
