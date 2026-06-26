
const GATED_DIFFICULTIES = new Set(["intermediate", "advanced"]);

const FOUNDATIONS_THRESHOLD = 0.6;

export function foundationsAreFinished(beginnerProjects, isDone) {
  if (beginnerProjects.length === 0) return true;
  const done = beginnerProjects.filter(isDone).length;
  return done >= Math.ceil(beginnerProjects.length * FOUNDATIONS_THRESHOLD);
}

export function isModuleGated({ finished, done, difficulty }) {
  return !finished && !done && GATED_DIFFICULTIES.has(difficulty);
}
