import { namespacedKey } from "./progressStats";

export const RETENTION_CHANGED_EVENT = "codeflow:retention-changed";

const ACTIVITY_KEY = () => namespacedKey("codeflow_activity_v1");
const GOAL_KEY = () => namespacedKey("codeflow_daily_goal_v1");
const RECAP_KEY = () => namespacedKey("codeflow_recap_shown_v1");
const REVIEW_KEY = () => namespacedKey("codeflow_reviewed_v1");
const MILESTONE_KEY = () => namespacedKey("codeflow_milestones_v1");
const ONBOARD_KEY = () => namespacedKey("codeflow_onboarded_v1");

const DAY = 86400000;
export const todayKey = () => new Date().toISOString().slice(0, 10);
const dateKey = (d) => d.toISOString().slice(0, 10);

function read(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}
function write(key, val) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {  }
}
function emit() {
  try { window.dispatchEvent(new Event(RETENTION_CHANGED_EVENT)); } catch {  }
}

export function getActivityLog() {
  return read(ACTIVITY_KEY(), {});
}

export function recordActivity() {
  const log = getActivityLog();
  const k = todayKey();
  log[k] = (log[k] || 0) + 1;
  write(ACTIVITY_KEY(), log);
  emit();
  return log[k];
}

export function getTodayCount() {
  return getActivityLog()[todayKey()] || 0;
}

export function getDailyGoal() {
  const g = read(GOAL_KEY(), 1);
  return Math.max(1, Math.min(10, Number(g) || 1));
}
export function setDailyGoal(n) {
  write(GOAL_KEY(), Math.max(1, Math.min(10, Number(n) || 1)));
  emit();
}
export function getDailyStatus() {
  const goal = getDailyGoal();
  const done = getTodayCount();
  return { done, goal, met: done >= goal, pct: Math.min(100, Math.round((done / goal) * 100)) };
}

export function getWeeklyRecap(progress = []) {
  const log = getActivityLog();
  let activities = 0;
  const activeDays = new Set();
  let bestDay = { date: null, count: 0 };
  for (let i = 0; i < 7; i++) {
    const d = dateKey(new Date(Date.now() - i * DAY));
    const c = log[d] || 0;
    activities += c;
    if (c > 0) activeDays.add(d);
    if (c > bestDay.count) bestDay = { date: d, count: c };
  }
  const weekAgo = Date.now() - 7 * DAY;
  const recent = progress.filter((p) => p.completed && p.completed_date && new Date(p.completed_date).getTime() >= weekAgo);
  const lessons = recent.length;
  const xp = recent.reduce((s, p) => s + (p.points_earned || 10), 0);
  return { activities, activeDays: activeDays.size, bestDay, lessons, xp };
}

function isoWeek(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((t - yearStart) / DAY + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}
export function shouldShowWeeklyRecap(progress = []) {
  if (typeof window === "undefined") return false;
  const shown = read(RECAP_KEY(), null);
  const wk = isoWeek();
  if (shown === wk) return false;
  const recap = getWeeklyRecap(progress);
  return recap.activities > 0;
}
export function markWeeklyRecapShown() {
  write(RECAP_KEY(), isoWeek());
}

export function getReviewItems(lessons = [], progress = [], limit = 3) {
  const reviewed = read(REVIEW_KEY(), {});
  const now = Date.now();
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const due = [];
  for (const p of progress) {
    if (!p.completed || !p.lesson_id || !p.completed_date) continue;
    const age = now - new Date(p.completed_date).getTime();
    if (age < 3 * DAY) continue;
    const lastReviewed = reviewed[p.lesson_id] || 0;
    if (now - lastReviewed < 3 * DAY) continue;
    const lesson = byId.get(p.lesson_id);
    if (lesson) due.push({ lesson, age });
  }
  due.sort((a, b) => b.age - a.age);
  return due.slice(0, limit).map((d) => d.lesson);
}
export function markReviewed(lessonId) {
  const reviewed = read(REVIEW_KEY(), {});
  reviewed[lessonId] = Date.now();
  write(REVIEW_KEY(), reviewed);
  emit();
}

const STREAK_TIERS = [3, 7, 14, 30, 60, 100];
const LESSON_TIERS = [1, 5, 10, 25, 50, 100];
const LAB_TIERS = [1, 5, 10];

export function checkMilestones({ streak = 0, lessonsDone = 0, labsSolved = 0, level = 0 } = {}) {
  const seen = read(MILESTONE_KEY(), {});
  const fresh = [];
  const consider = (kind, tiers, value, label) => {
    for (const t of tiers) {
      if (value >= t) {
        const id = `${kind}-${t}`;
        if (!seen[id]) { seen[id] = Date.now(); fresh.push({ id, kind, tier: t, label: label(t) }); }
      }
    }
  };
  consider("streak", STREAK_TIERS, streak, (t) => `${t}-day streak`);
  consider("lessons", LESSON_TIERS, lessonsDone, (t) => (t === 1 ? "First lesson done" : `${t} lessons done`));
  consider("labs", LAB_TIERS, labsSolved, (t) => (t === 1 ? "First lab solved" : `${t} labs solved`));
  if (level >= 2) {
    const id = `level-${level}`;
    if (!seen[id]) { seen[id] = Date.now(); fresh.push({ id, kind: "level", tier: level, label: `Reached level ${level}` }); }
  }
  if (fresh.length) write(MILESTONE_KEY(), seen);

  return fresh.sort((a, b) => b.tier - a.tier)[0] || null;
}

export function seedMilestones(state) {
  if (read(MILESTONE_KEY(), null) != null) return;
  const seen = {};
  checkMilestones(state);
  write(MILESTONE_KEY(), read(MILESTONE_KEY(), seen));
}

export function isOnboarded() {
  return read(ONBOARD_KEY(), false) === true;
}
export function setOnboarded() {
  write(ONBOARD_KEY(), true);
  emit();
}
