import { getLevel, LEVELS } from "./XPLevelBar";
import { namespacedKey } from "../../lib/progressStats";
import { getSolvedLabs } from "../../lib/playgroundProgress";
import { getChallengeStats } from "../../api/progressStore";

export const RANK_TIER_COLORS = {
  1: "#5ED29C",
  2: "#54D3AC",
  3: "#45CBB8",
  4: "#34D0C4",
  5: "#31C2C9",
  6: "#5ED29C",
  7: "#7FE0B0",
};

export function tierColor(tier) {
  return RANK_TIER_COLORS[tier] || RANK_TIER_COLORS[7];
}

export function frameGradient(tier) {
  if (tier >= 7) return "conic-gradient(from 210deg, #7FE0B0, #34D0C4, #5ED29C, #7FE0B0)";
  if (tier >= 5) return "conic-gradient(from 160deg, #5ED29C, #34D0C4, #5ED29C)";
  if (tier >= 3) return "linear-gradient(135deg, #45CBB8, #34D0C4)";
  return "linear-gradient(135deg, #5ED29C, #2E8B7A)";
}

export const RANKS = LEVELS.map((l) => ({
  tier: l.level,
  name: l.name,
  min: l.min,
  max: l.max,
  color: RANK_TIER_COLORS[l.level] || RANK_TIER_COLORS[7],
}));

export function rankInfo(totalXP = 0) {
  const xp = Math.max(0, Math.round(totalXP || 0));
  const lvl = getLevel(xp);
  const next = LEVELS.find((l) => l.min > lvl.min) || lvl;
  const isMax = lvl.max === Infinity;
  const span = isMax ? 1 : lvl.max - lvl.min;
  const pct = isMax ? 100 : Math.min(100, Math.max(0, Math.round(((xp - lvl.min) / span) * 100)));
  const toNext = isMax ? 0 : Math.max(0, lvl.max - xp);
  return {
    xp,
    tier: lvl.level,
    name: lvl.name,
    color: tierColor(lvl.level),
    nextName: next.name,
    nextColor: tierColor(next.level),
    isMax,
    pct,
    toNext,
    floor: lvl.min,
    ceil: isMax ? xp : lvl.max,
  };
}

export const DIFFICULTY_XP = { beginner: 10, intermediate: 25, advanced: 60 };

export function estXpForDifficulty(difficulty) {
  return DIFFICULTY_XP[difficulty] || DIFFICULTY_XP.beginner;
}

export function estProjectXp(project) {
  return estXpForDifficulty(project?.difficulty) * (project?.lessons_count || 0);
}

const XP_CACHE = () => namespacedKey("codeflow_xp_cache");

export function cacheXp(totalXP) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(XP_CACHE(), String(Math.round(totalXP || 0))); } catch { }
}

export function readCachedXp() {
  if (typeof window === "undefined") return 0;
  let cached = 0;
  try { cached = parseInt(localStorage.getItem(XP_CACHE()) || "0", 10) || 0; } catch { }
  let derived = 0;
  try {
    const labs = getSolvedLabs().length * 10;
    const challenges = (getChallengeStats().completed || 0) * 10;
    derived = labs + challenges;
  } catch { }
  return Math.max(cached, derived);
}
