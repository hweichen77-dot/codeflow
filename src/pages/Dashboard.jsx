import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";

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

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Page header */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#2a2a2a" }}>§ DASHBOARD</div>
          <h1
            className="font-display font-black leading-none mb-2"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em", color: "#e8e8e8" }}
          >
            {user.full_name?.split(" ")[0] || "Learner"}
          </h1>
          <p className="font-display text-sm" style={{ color: "#444", fontWeight: 400 }}>
            {user.email}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-12 space-y-12">

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-0" style={{ border: "1px solid #1a1a1a" }}>
          {[
            { val: completedLessons, label: "Lessons Done" },
            { val: completedProjects.length, label: "Projects Complete" },
            { val: inProgressProjects.length, label: "In Progress" },
            { val: `${overallPct}%`, label: "Overall Progress" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="p-6"
              style={{ borderRight: i < 3 ? "1px solid #1a1a1a" : "none", borderBottom: "none" }}
            >
              <div
                className="font-display font-black leading-none mb-2"
                style={{ fontSize: "2.5rem", color: "#e8e8e8", letterSpacing: "-0.04em" }}
              >
                {stat.val}
              </div>
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#333" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Activity heatmap */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#2a2a2a" }}>
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
                      color: "#2a2a2a",
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
                    <div key={i} className="font-mono" style={{ height: "11px", width: "12px", fontSize: "8px", color: "#2a2a2a", display: "flex", alignItems: "center" }}>
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
            <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#2a2a2a" }}>
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
                          style={{ color: "#888", letterSpacing: "-0.02em" }}
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
                      <span className="font-mono text-xs transition-colors duration-150 group-hover:text-white" style={{ color: "#2a2a2a" }}>
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
            <div className="font-mono text-xs tracking-widest uppercase mb-6" style={{ color: "#2a2a2a" }}>
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
                  <span className="font-display text-sm font-medium" style={{ color: "#555" }}>
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
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#2a2a2a" }}>
              NO ACTIVITY YET
            </div>
            <p className="font-display text-base mb-8" style={{ color: "#444", fontWeight: 400 }}>
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