import { getLevel, LEVELS } from "../components/gamification/XPLevelBar";

const STREAK_BASE = "codeflow_streak";
const PROFILE_KEY = "codeflow_profile_v1";

export function activeUserId() {
  if (typeof window === "undefined") return "guest";
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    const p = raw ? JSON.parse(raw) : null;
    return (p && (p.email || p.id)) || "guest";
  } catch {
    return "guest";
  }
}

export function namespacedKey(base, id) {
  return `${base}::${id || activeUserId()}`;
}

const streakKey = (id) => namespacedKey(STREAK_BASE, id);

export function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(streakKey()) || "{}");
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (data.lastVisit === today || data.lastVisit === yesterday) return data.streak || 0;
    return 0;
  } catch {
    return 0;
  }
}

export function touchStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(streakKey()) || "{}");
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    let streak = 1;
    if (data.lastVisit === today) streak = data.streak || 1;
    else if (data.lastVisit === yesterday) streak = (data.streak || 0) + 1;
    localStorage.setItem(streakKey(), JSON.stringify({ lastVisit: today, streak }));
    return streak;
  } catch {
    return 0;
  }
}

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
