/**
 * Single source of truth for learner progress numbers — used by AuthHome,
 * Dashboard, the AI Track page and the streak badge so they never disagree.
 */
import { getLevel, LEVELS } from "../components/gamification/XPLevelBar";

const STREAK_KEY = "codeflow_streak";

/** Read the current streak without mutating it (display-safe). */
export function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastVisit === today || data.lastVisit === yesterday) return data.streak || 0;
    return 0;
  } catch {
    return 0;
  }
}

/** Record a visit for today, advancing or resetting the streak. Call once per session. */
export function touchStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = 1;
    if (data.lastVisit === today) streak = data.streak || 1;
    else if (data.lastVisit === yesterday) streak = (data.streak || 0) + 1;
    localStorage.setItem(STREAK_KEY, JSON.stringify({ lastVisit: today, streak }));
    return streak;
  } catch {
    return 0;
  }
}

/**
 * Compute a full progress summary from raw progress rows + content.
 * @param {Array} progress  UserProgress rows for the active account
 * @param {Array} projects  PROJECTS
 * @param {Array} lessons   LESSONS
 */
export function summarize(progress = [], projects = [], lessons = []) {
  const completed = progress.filter((p) => p.completed);
  const completedLessonIds = new Set(completed.map((p) => p.lesson_id));
  const totalXP = completed.reduce((s, p) => s + (p.points_earned || 10), 0);

  const lvl = getLevel(totalXP);
  const nextLvl = LEVELS.find((l) => l.min > lvl.min) || lvl;
  const lvlPct = lvl.max === Infinity
    ? 100
    : Math.min(100, Math.round(((totalXP - lvl.min) / (lvl.max - lvl.min)) * 100));

  const projectStats = projects.map((p) => {
    const pls = lessons.filter((l) => l.project_id === p.id);
    const done = pls.filter((l) => completedLessonIds.has(l.id)).length;
    return { ...p, total: pls.length, done, pct: pls.length ? Math.round((done / pls.length) * 100) : 0 };
  });

  const projectsDone = projectStats.filter((p) => p.total > 0 && p.done === p.total).length;
  const projectsStarted = projectStats.filter((p) => p.done > 0).length;
  const overallPct = lessons.length ? Math.round((completed.length / lessons.length) * 100) : 0;

  // Resume target: first started-but-unfinished, else first not-started, else first.
  const inProgress = projectStats.find((p) => p.done > 0 && p.done < p.total);
  const notStarted = projectStats.find((p) => p.total > 0 && p.done === 0);
  const resume = inProgress || notStarted || projectStats[0] || null;

  return {
    completed,
    completedCount: completed.length,
    completedLessonIds,
    totalXP,
    lvl,
    nextLvl,
    lvlPct,
    streak: getStreak(),
    projectStats,
    projectsDone,
    projectsStarted,
    overallPct,
    resume,
  };
}
