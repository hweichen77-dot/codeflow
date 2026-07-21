import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, animate, useReducedMotion } from "framer-motion";
import { Flame, Snowflake } from "lucide-react";
import { getActivityLog, getDailyStatus, RETENTION_CHANGED_EVENT } from "@/lib/retention";
import { getStreakInfo, namespacedKey } from "@/lib/progressStats";

const C = {
  panel: "#0C1210",
  border: "#17201C",
  amber: "#F5A524",
  amberDim: "#7A5A22",
  green: "#5ED29C",
  text: "#fff",
  t62: "rgba(255,255,255,.62)",
};

const DAY = 86400000;
const dateKey = (d) => d.toISOString().slice(0, 10);
const DOW = ["S", "M", "T", "W", "T", "F", "S"];

const CELEBRATED = () => namespacedKey("codeflow_streak_celebrated");

function last7() {
  const out = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY);
    out.push({ key: dateKey(d), dow: DOW[d.getDay()], isToday: i === 0 });
  }
  return out;
}

export default function StreakCalendar() {
  const reduce = useReducedMotion();
  const [log, setLog] = useState(() => getActivityLog());
  const [streak, setStreak] = useState(() => getStreakInfo());
  const [daily, setDaily] = useState(() => getDailyStatus());
  const [celebrate, setCelebrate] = useState(false);
  const countRef = useRef(null);

  const refresh = useCallback(() => {
    setLog(getActivityLog());
    setStreak(getStreakInfo());
    setDaily(getDailyStatus());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(RETENTION_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(RETENTION_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let prev = 0;
    try { prev = parseInt(localStorage.getItem(CELEBRATED()) || "0", 10) || 0; } catch { }
    if (streak.current > prev && streak.current > 0) {
      setCelebrate(true);
      if (countRef.current && !reduce) {
        const c = animate(prev, streak.current, {
          duration: 0.9,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (v) => { if (countRef.current) countRef.current.textContent = String(Math.round(v)); },
        });
        c.then(() => {});
      }
      try { localStorage.setItem(CELEBRATED(), String(streak.current)); } catch { }
      const t = setTimeout(() => setCelebrate(false), 2600);
      return () => clearTimeout(t);
    }
    if (streak.current < prev) {
      try { localStorage.setItem(CELEBRATED(), String(streak.current)); } catch { }
    }
  }, [streak.current, reduce]);

  const days = last7();

  return (
    <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.span
            animate={streak.current > 0 && !reduce ? { scale: [1, 1.14, 1] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-flex" }}
          >
            <Flame size={18} style={{ color: streak.current > 0 ? C.amber : C.t62, fill: streak.current > 0 ? C.amber : "none" }} />
          </motion.span>
          <span className="u-display" style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text }}>
            <span ref={countRef}>{streak.current}</span> day streak
          </span>
        </div>
        {streak.freezes > 0 && (
          <span className="inline-flex items-center gap-1 u-mono" style={{ fontSize: "0.72rem", color: C.t62 }} title="Streak freezes cover one missed day each">
            <Snowflake size={13} style={{ color: C.amber }} />
            {streak.freezes} freeze{streak.freezes > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {days.map((d) => {
          const active = (log[d.key] || 0) > 0;
          return (
            <div key={d.key} className="flex flex-col items-center gap-1.5">
              <span className="u-mono" style={{ fontSize: "0.6rem", color: C.t62 }}>{d.dow}</span>
              <div
                className="w-full flex items-center justify-center rounded-md"
                style={{
                  aspectRatio: "1 / 1",
                  background: active ? `${C.amber}1F` : "#0A0F0D",
                  border: d.isToday ? `1px solid ${active ? C.amber : C.green}` : `1px solid ${active ? C.amber + "55" : C.border}`,
                }}
                title={active ? `${log[d.key]} on ${d.key}` : d.key}
              >
                {active && <Flame size={13} style={{ color: C.amber, fill: C.amber }} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-xs" style={{ color: daily.met ? C.green : streak.atRisk ? C.amber : C.t62 }}>
        {daily.met
          ? "Today's target met, streak locked in."
          : streak.atRisk
          ? `Earn ${(daily.goal - daily.done) * 10}+ XP today to keep your ${streak.current}-day streak.`
          : `Hit ${daily.goal} lesson${daily.goal > 1 ? "s" : ""} (~${daily.goal * 10} XP) today to advance your streak.`}
      </div>

      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 20% 22%, ${C.amber}22, transparent 60%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.4 }}
            />
            {!reduce && Array.from({ length: 8 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ top: 22, left: 26, width: 5, height: 5, background: C.amber }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: Math.cos((i / 8) * 6.28) * 60, y: Math.sin((i / 8) * 6.28) * 40, opacity: [0, 1, 0] }}
                transition={{ duration: 0.9, delay: i * 0.02 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
