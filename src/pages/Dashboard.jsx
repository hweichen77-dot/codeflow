import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { getLevel } from "../components/gamification/XPLevelBar";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => { base44.auth.redirectToLogin(); });
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => base44.entities.Project.list("order"),
  });

  if (!user) return null;

  const completedProgress = progress.filter((p) => p.completed);
  const completedLessons = completedProgress.length;

  // Activity map
  const activityMap = {};
  completedProgress.forEach((p) => {
    if (p.completed_date) {
      const day = p.completed_date.slice(0, 10);
      activityMap[day] = (activityMap[day] || 0) + 1;
    }
  });

  // Build last 52 weeks
  const weeks = [];
  const now = new Date();
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 364);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  let cur = new Date(startDate);
  while (cur <= now) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = cur.toISOString().slice(0, 10);
      week.push({ date: dateStr, count: activityMap[dateStr] || 0 });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  const monthLabels = [];
  weeks.forEach((week, i) => {
    const month = new Date(week[0].date).toLocaleString("default", { month: "short" });
    if (i === 0 || month !== monthLabels[monthLabels.length - 1]?.label) {
      monthLabels.push({ label: month, index: i });
    }
  });

  // XP: use stored points or fallback to 10 per lesson
  const totalXP = completedProgress.reduce((sum, p) => sum + (p.points_earned || 10), 0);
  const lvl = getLevel(totalXP);
  const nextLvl = [
    { level: 1, name: "Novice", min: 0, max: 50 },
    { level: 2, name: "Learner", min: 50, max: 150 },
    { level: 3, name: "Builder", min: 150, max: 300 },
    { level: 4, name: "Developer", min: 300, max: 500 },
    { level: 5, name: "Engineer", min: 500, max: 800 },
    { level: 6, name: "Architect", min: 800, max: 1200 },
    { level: 7, name: "Master", min: 1200, max: Infinity },
  ].find(l => l.min > lvl.min);
  const lvlPct = lvl.max === Infinity ? 100 : Math.min(100, Math.round(((totalXP - lvl.min) / (lvl.max - lvl.min)) * 100));

  // Streak: count consecutive days ending today (or yesterday) with activity
  const todayStr = new Date().toISOString().slice(0, 10);
  let streak = 0;
  let checkDate = new Date();
  // If no activity today, start checking from yesterday
  if (!activityMap[todayStr]) checkDate.setDate(checkDate.getDate() - 1);
  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    if (!activityMap[dateStr]) break;
    streak++;
    checkDate.setDate(checkDate.getDate() - 1);
  }

  const notStartedProjects = projects.filter((proj) => !progress.some((p) => p.project_id === proj.id));
  const inProgressProjects = projects
    .filter((proj) => {
      const pp = progress.filter((p) => p.project_id === proj.id && p.completed);
      return pp.length > 0 && (!proj.lessons_count || pp.length < proj.lessons_count);
    })
    .map((proj) => ({
      ...proj,
      doneCount: progress.filter((p) => p.project_id === proj.id && p.completed).length,
    }));
  const completedProjects = projects.filter((proj) => {
    const pp = progress.filter((p) => p.project_id === proj.id && p.completed);
    return proj.lessons_count && pp.length >= proj.lessons_count;
  });

  const totalAvailableLessons = projects.reduce((s, p) => s + (p.lessons_count || 0), 0);
  const overallPct = totalAvailableLessons ? Math.round((completedLessons / totalAvailableLessons) * 100) : 0;

  // Struggle signals: lessons where student viewed solution or had many wrong attempts
  const struggledLessons = completedProgress.filter(
    (p) => p.solution_viewed || (p.wrong_attempts && p.wrong_attempts >= 3)
  ).length;
  const totalTimeMinutes = Math.round(
    completedProgress.reduce((s, p) => s + (p.time_spent_seconds || 0), 0) / 60
  );

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Page header */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#666" }}>§ DASHBOARD</div>
          <h1
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: "0 0 8px" }}
          >
            {user.full_name?.split(" ")[0] || "Learner"}
          </h1>
          <p className="font-display text-sm" style={{ color: "#888", fontWeight: 400 }}>
            {user.email}
          </p>

          {/* Level progress bar */}
          <div style={{ marginTop: "20px", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span className="font-mono text-xs" style={{ color: lvl.color }}>
                LVL {lvl.level} — {lvl.name}
              </span>
              <span className="font-mono text-xs" style={{ color: "#555" }}>
                {totalXP} / {lvl.max === Infinity ? "∞" : lvl.max} XP
              </span>
            </div>
            <div style={{ height: "4px", background: "#1a1a1a", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${lvlPct}%`, background: lvl.color, borderRadius: "2px", transition: "width 1s ease" }} />
            </div>
            {nextLvl && (
              <div className="font-mono text-xs mt-1" style={{ color: "#444" }}>
                {lvl.max - totalXP} XP to reach {nextLvl.name}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-12 space-y-12">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0" style={{ border: "1px solid #1a1a1a" }}>
          {[
            { val: completedLessons, label: "Lessons Done", accent: null },
            { val: completedProjects.length, label: "Projects Done", accent: null },
            { val: `${totalXP}`, label: "Total XP", accent: "#b8ff00" },
            { val: `${streak}🔥`, label: "Day Streak", accent: streak >= 3 ? "#ff6b35" : null },
            { val: `LVL ${lvl.level}`, label: lvl.name, accent: lvl.color },
            { val: `${overallPct}%`, label: "Overall Progress", accent: null },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className="p-6"
              style={{
                borderRight: i < arr.length - 1 ? "1px solid #1a1a1a" : "none",
                borderBottom: "none",
              }}
            >
              <div
                className="font-display font-black leading-none mb-2"
                style={{ fontSize: "2rem", color: stat.accent || "#e8e8e8", letterSpacing: "-0.04em" }}
              >
                {stat.val}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#777" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Streak callout */}
        {streak > 0 && (
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{
              border: `1px solid ${streak >= 7 ? "#ff6b3533" : "#1a1a1a"}`,
              background: streak >= 7 ? "#ff6b3508" : "#0d0d0d",
              borderLeft: `2px solid ${streak >= 7 ? "#ff6b35" : streak >= 3 ? "#ffb300" : "#2a2a2a"}`,
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🔥</span>
            <div>
              <div className="font-mono text-xs tracking-widest uppercase mb-0.5" style={{ color: streak >= 7 ? "#ff6b35" : "#ffb300" }}>
                {streak >= 7 ? "ON FIRE" : streak >= 3 ? "BUILDING MOMENTUM" : "STREAK STARTED"}
              </div>
              <p className="font-display text-sm" style={{ color: "#aaa", fontWeight: 400 }}>
                {streak} day{streak !== 1 ? "s" : ""} in a row.{" "}
                {streak >= 7
                  ? "Exceptional consistency — keep it up."
                  : streak >= 3
                  ? "Come back tomorrow to grow your streak."
                  : "Every day counts. See you tomorrow."}
              </p>
            </div>
          </div>
        )}

        {/* Struggle signals */}
        {struggledLessons > 0 && (
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#666" }}>
              AI INSIGHTS
            </div>
            <div className="px-6 py-5" style={{ border: "1px solid #1a1a1a", background: "#0d0d0d", borderLeft: "2px solid #ffb300" }}>
              <div className="flex items-start gap-4">
                <span className="font-mono text-xs mt-0.5" style={{ color: "#ffb300" }}>AI</span>
                <div>
                  <p className="font-display text-sm mb-1" style={{ color: "#888", fontWeight: 400 }}>
                    You viewed solutions or had repeated errors on <span style={{ color: "#e8e8e8" }}>{struggledLessons} lesson{struggledLessons > 1 ? "s" : ""}</span>.
                  </p>
                  <p className="font-display text-xs" style={{ color: "#aaa", fontWeight: 400 }}>
                    Revisit those lessons — the concepts they cover are worth reinforcing before moving on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity heatmap */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#666" }}>
            ACTIVITY — LAST 52 WEEKS
          </div>
          <div
            className="p-6 overflow-x-auto"
            style={{ border: "1px solid #1a1a1a", background: "#0d0d0d" }}
          >
            <div style={{ minWidth: "600px" }}>
              {/* Month labels */}
              <div className="flex mb-2" style={{ marginLeft: "2rem" }}>
                {monthLabels.map((m, idx) => (
                  <div
                    key={m.label + m.index}
                    className="font-mono text-xs"
                    style={{
                      color: "#666",
                      marginLeft: idx === 0 ? 0 : `${(m.index - monthLabels[idx - 1].index) * 13}px`,
                    }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                {/* Day labels */}
                <div className="flex flex-col gap-0.5 mr-2">
                  {["", "M", "", "W", "", "F", ""].map((d, i) => (
                    <div key={i} className="font-mono" style={{ height: "11px", width: "12px", fontSize: "8px", color: "#666", display: "flex", alignItems: "center" }}>
                      {d}
                    </div>
                  ))}
                </div>
                {/* Grid */}
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day) => {
                      const isFuture = day.date > now.toISOString().slice(0, 10);
                      const bg = isFuture
                        ? "transparent"
                        : day.count === 0
                        ? "#111"
                        : day.count === 1
                        ? "#4a5c00"
                        : day.count <= 3
                        ? "#7a9900"
                        : "#b8ff00";
                      return (
                        <div
                          key={day.date}
                          title={day.count ? `${day.date}: ${day.count} lesson${day.count > 1 ? "s" : ""}` : day.date}
                          style={{
                            width: "11px",
                            height: "11px",
                            background: bg,
                            cursor: "default",
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* In progress */}
        {inProgressProjects.length > 0 && (
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#666" }}>
              CONTINUE LEARNING
            </div>
            <div style={{ border: "1px solid #1a1a1a" }}>
              {inProgressProjects.map((project, i) => {
                const pct = project.lessons_count ? Math.round((project.doneCount / project.lessons_count) * 100) : 0;
                return (
                  <Link
                    key={project.id}
                    to={createPageUrl(`ProjectDetail?id=${project.id}`)}
                    className="group block"
                  >
                    <div
                      className="flex items-center gap-6 px-6 py-5 transition-all duration-150"
                      style={{ borderBottom: i < inProgressProjects.length - 1 ? "1px solid #111" : "none" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#0d0d0d";
                        e.currentTarget.style.paddingLeft = "1.75rem";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.paddingLeft = "1.5rem";
                      }}
                    >
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-bold text-base mb-2 transition-colors duration-150 group-hover:text-white truncate"
                          style={{ color: "#bbb", letterSpacing: "-0.02em" }}
                        >
                          {project.title}
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {Array.from({ length: 10 }).map((_, di) => (
                              <div
                                key={di}
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  background: di < Math.round(pct / 10) ? "#b8ff00" : "#1a1a1a",
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>
                            {project.doneCount}/{project.lessons_count}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs transition-colors duration-150 group-hover:text-white" style={{ color: "#666" }}>
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed projects */}
        {completedProjects.length > 0 && (
          <div>
            <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#666" }}>
              COMPLETED
            </div>
            <div className="space-y-2">
              {completedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ border: "1px solid #1a1a1a" }}
                >
                  <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>✓</span>
                  <span className="font-display text-sm font-medium" style={{ color: "#aaa" }}>
                    {project.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {progress.length === 0 && (
          <div
            className="text-center py-20"
            style={{ border: "1px solid #1a1a1a" }}
          >
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#666" }}>
              NO ACTIVITY YET
            </div>
            <p className="font-display text-base mb-8" style={{ color: "#888", fontWeight: 400 }}>
              Start your first project to track progress here.
            </p>
            <Link to={createPageUrl("Projects")}>
              <button
                className="font-mono text-xs tracking-widest uppercase px-8 py-4 transition-all duration-150"
                style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700 }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(184,255,0,0.2)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              >
                Browse Projects →
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}