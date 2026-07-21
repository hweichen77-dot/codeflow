import React from "react";
import { motion } from "framer-motion";
import { Check, FlaskConical, Flame } from "lucide-react";
import { getSolvedLabs } from "@/lib/playgroundProgress";
import { getStreakInfo } from "@/lib/progressStats";

const C = {
  panel: "#0C1210",
  border: "#17201C",
  green: "#5ED29C",
  teal: "#34D0C4",
  amber: "#F5A524",
  text: "#fff",
  t92: "rgba(255,255,255,.92)",
  t62: "rgba(255,255,255,.62)",
};

function relTime(ts) {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function ActivityFeed({ progress = [], lessons = [], limit = 6 }) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const streak = getStreakInfo();

  const events = progress
    .filter((p) => p.completed && p.completed_date)
    .map((p) => ({
      ts: new Date(p.completed_date).getTime(),
      kind: "lesson",
      title: byId.get(p.lesson_id)?.title || byId.get(p.lesson_id)?.name || "a lesson",
      xp: p.points_earned || 10,
    }))
    .filter((e) => !Number.isNaN(e.ts))
    .sort((a, b) => b.ts - a.ts)
    .slice(0, limit);

  const labs = getSolvedLabs().length;

  const empty = events.length === 0 && labs === 0;

  return (
    <div className="rounded-2xl p-5" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
      <h3 className="u-display mb-4" style={{ fontSize: "0.95rem", fontWeight: 700, color: C.text }}>
        Recent activity
      </h3>

      {empty ? (
        <p className="text-sm" style={{ color: C.t62 }}>
          Complete a lesson or solve a lab to start your activity log.
        </p>
      ) : (
        <div className="flex flex-col">
          {streak.current > 0 && (
            <Row
              icon={<Flame size={14} style={{ color: C.amber, fill: C.amber }} />}
              accent={C.amber}
              label={<><span style={{ color: C.t92 }}>On a </span><span style={{ color: C.amber, fontWeight: 700 }}>{streak.current}-day streak</span></>}
              meta={streak.activeToday ? "active today" : "keep it alive"}
              first
            />
          )}
          {events.map((e, i) => (
            <Row
              key={i}
              icon={<Check size={14} color="#070B0A" strokeWidth={3} />}
              iconBg={C.green}
              accent={C.green}
              label={<><span style={{ color: C.t92 }}>Completed </span><span style={{ color: C.text, fontWeight: 600 }}>{e.title}</span></>}
              meta={`+${e.xp} XP · ${relTime(e.ts)}`}
            />
          ))}
          {labs > 0 && (
            <Row
              icon={<FlaskConical size={13} style={{ color: C.teal }} />}
              accent={C.teal}
              label={<><span style={{ color: C.text, fontWeight: 600 }}>{labs}</span><span style={{ color: C.t92 }}> playground lab{labs > 1 ? "s" : ""} solved</span></>}
              meta="live playground"
            />
          )}
        </div>
      )}
    </div>
  );
}

function Row({ icon, iconBg, accent, label, meta, first }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-3 py-2.5"
      style={{ borderTop: first ? "none" : `1px solid ${C.border}` }}
    >
      <span
        className="inline-flex items-center justify-center rounded-md shrink-0"
        style={{ width: 24, height: 24, background: iconBg || `${accent}18`, border: iconBg ? "none" : `1px solid ${accent}55` }}
      >
        {icon}
      </span>
      <span className="flex-1 text-sm truncate">{label}</span>
      <span className="u-mono shrink-0" style={{ fontSize: "0.68rem", color: C.t62 }}>{meta}</span>
    </motion.div>
  );
}
