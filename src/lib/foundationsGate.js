// Foundations hard-gate.
//
// Intermediate/advanced modules stay locked until the learner finishes most of
// the beginner-tier "foundations" modules. Shared by the two list pages
// (Projects, AITrack) that render the gate badge + block navigation, and by
// ProjectDetail which enforces the same rule on direct/deep links so the gate
// can't be bypassed by typing the URL.

const GATED_DIFFICULTIES = new Set(["intermediate", "advanced"]);

// Fraction of beginner modules that must be complete before foundations count
// as finished. 60% keeps it from being all-or-nothing while still requiring
// real progress.
const FOUNDATIONS_THRESHOLD = 0.6;

// foundationsAreFinished(beginnerProjects, isDone)
//   beginnerProjects: array of beginner-tier project objects
//   isDone: (project) => boolean — whether that project is complete
export function foundationsAreFinished(beginnerProjects, isDone) {
  if (beginnerProjects.length === 0) return true;
  const done = beginnerProjects.filter(isDone).length;
  return done >= Math.ceil(beginnerProjects.length * FOUNDATIONS_THRESHOLD);
}

// isModuleGated({ finished, done, difficulty })
//   finished: result of foundationsAreFinished
//   done: whether this module is already complete (always reachable once done)
//   difficulty: the module's difficulty tier
export function isModuleGated({ finished, done, difficulty }) {
  return !finished && !done && GATED_DIFFICULTIES.has(difficulty);
}
