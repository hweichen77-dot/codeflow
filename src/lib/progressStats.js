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
const MAX_FREEZES = 3;

function dayGap(lastVisit, now = new Date()) {
  if (!lastVisit) return Infinity;
  const from = new Date(lastVisit);
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((b - a) / 86400000);
}

function readStreak() {
  try { return JSON.parse(localStorage.getItem(streakKey()) || "{}"); } catch { return {}; }
}

export function getStreak() {
  const data = readStreak();
  const gap = dayGap(data.lastVisit);

  if (gap <= 1) return data.streak || 0;
  if (gap === 2 && (data.freezes || 0) > 0) return data.streak || 0;
  return 0;
}

export function touchStreak() {
  try {
    const data = readStreak();
    const gap = dayGap(data.lastVisit);
    const prev = data.streak || 0;
    let freezes = data.freezes || 0;
    let streak;
    if (data.lastVisit == null) streak = 1;
    else if (gap === 0) streak = prev || 1;
    else if (gap === 1) streak = prev + 1;
    else if (gap === 2 && freezes > 0) { freezes -= 1; streak = prev + 1; }
    else streak = 1;

    if (streak > prev && streak % 5 === 0) freezes = Math.min(MAX_FREEZES, freezes + 1);
    const longest = Math.max(data.longest || 0, streak);
    localStorage.setItem(streakKey(), JSON.stringify({ lastVisit: new Date().toDateString(), streak, freezes, longest }));
    return streak;
  } catch {
    return 0;
  }
}

export function getStreakInfo() {
  const data = readStreak();
  const current = getStreak();
  const gap = dayGap(data.lastVisit);
  return {
    current,
    freezes: data.freezes || 0,
    longest: Math.max(data.longest || 0, current),
    activeToday: gap === 0,
    atRisk: current > 0 && gap !== 0,
  };
}

export function getStreakSyncState() {
  const data = readStreak();
  const current = getStreak();
  let lastVisit = null;
  if (data.lastVisit) {
    const d = new Date(data.lastVisit);
    if (!Number.isNaN(d.getTime())) lastVisit = d.toISOString().slice(0, 10);
  }
  return { current, longest: Math.max(data.longest || 0, current), lastVisit };
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
