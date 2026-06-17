import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/api/apiClient";
import { createPageUrl } from "../utils";
import { useAuth } from "../lib/AuthContext";
import { summarize, touchStreak } from "../lib/progressStats";

const MONO = "'Space Mono', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

function StatCard({ label, value, sub, accent = "#b8ff00" }) {
  return (
    <div className="p-6" style={{ border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
      <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#c4c4c4", fontFamily: MONO }}>
        {label}
      </div>
      <div className="font-mono font-bold" style={{ fontSize: "2rem", lineHeight: 1, color: accent, letterSpacing: "-0.03em" }}>
        {value}
      </div>
      {sub && <div className="font-mono text-xs mt-2" style={{ color: "#888", fontFamily: MONO }}>{sub}</div>}
    </div>
  );
}

export default function AuthHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => { touchStreak(); }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [ps, ls] = await Promise.all([
          api.entities.Project.list("order"),
          api.entities.Lesson.list("order"),
        ]);
        let pr = [];
        if (user?.email) {
          pr = await api.entities.UserProgress.filter({ user_email: user.email });
        }
        if (!active) return;
        setProjects(ps); setLessons(ls); setProgress(pr);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user?.email]);

  const firstName = (user?.name || user?.email?.split("@")[0] || "learner").split(" ")[0];

  const {
    completed, totalXP, lvl, nextLvl, lvlPct, streak,
    projectStats, projectsDone: projectsCompleted, resume,
  } = summarize(progress, projects, lessons);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase animate-pulse" style={{ color: "#888", fontFamily: MONO }}>
          Loading your progress…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: "#0a0a0a" }}>
      <div className="max-w-5xl mx-auto">
        {/* Greeting */}
        <div className="mb-10">
          <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#b8ff00", fontFamily: MONO }}>
            {greeting}
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: "2.6rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#f0f0f0", margin: 0, lineHeight: 1.05 }}>
            Welcome back, {firstName}.
          </h1>
          <p className="font-display text-sm mt-3" style={{ color: "#d4d4d4" }}>
            {completed.length > 0
              ? `You've completed ${completed.length} lesson${completed.length === 1 ? "" : "s"} and earned ${totalXP} XP. Keep the streak alive.`
              : "Let's start your first lesson and begin tracking your progress."}
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid gap-4 mb-10" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <StatCard label="Level" value={lvl.name} sub={`${totalXP} XP total`} accent={lvl.color || "#b8ff00"} />
          <StatCard label="Day streak" value={streak} sub={streak > 0 ? "Don't break it" : "Start today"} accent="#ffb300" />
          <StatCard label="Lessons done" value={completed.length} sub={`${lessons.length} total`} />
          <StatCard label="Projects done" value={projectsCompleted} sub={`${projects.length} total`} accent="#60a5fa" />
        </div>

        {/* Level progress bar */}
        <div className="p-6 mb-10" style={{ border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#c4c4c4", fontFamily: MONO }}>
              Level {lvl.name}
            </span>
            <span className="font-mono text-xs" style={{ color: "#888", fontFamily: MONO }}>
              {lvl.max === Infinity ? "MAX" : `${lvl.max - totalXP} XP to ${nextLvl.name}`}
            </span>
          </div>
          <div style={{ height: "8px", background: "#1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${lvlPct}%`, height: "100%", background: "linear-gradient(90deg, #4d7c0f, #b8ff00)", borderRadius: "4px", transition: "width .6s ease" }} />
          </div>
        </div>

        {/* Continue learning */}
        {resume && (
          <div className="mb-10">
            <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: "#888", fontFamily: MONO }}>
              {resume.done > 0 ? "Continue learning" : "Start here"}
            </div>
            <Link
              to={`${createPageUrl("ProjectDetail")}?id=${resume.id}`}
              className="block p-6 transition-all duration-150"
              style={{ border: "1px solid #b8ff0033", background: "#b8ff0008" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#b8ff0014"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#b8ff0008"; e.currentTarget.style.transform = ""; }}
            >
              <div className="flex items-center justify-between gap-6">
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: "1.5rem", fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.01em" }}>
                    {resume.title}
                  </div>
                  <div className="font-mono text-xs mt-2" style={{ color: "#c4c4c4", fontFamily: MONO }}>
                    {resume.done}/{resume.total} lessons · {resume.pct}% complete
                  </div>
                </div>
                <span className="font-mono text-sm tracking-widest uppercase px-5 py-3 flex-shrink-0"
                  style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700, fontFamily: MONO }}>
                  {resume.done > 0 ? "Resume →" : "Begin →"}
                </span>
              </div>
            </Link>
          </div>
        )}

        {/* All tracks/projects */}
        <div>
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#888", fontFamily: MONO }}>
            Your projects
          </div>
          <div className="space-y-0">
            {projectStats.map((p, i) => {
              const isDone = p.total > 0 && p.done === p.total;
              return (
                <Link
                  key={p.id}
                  to={`${createPageUrl("ProjectDetail")}?id=${p.id}`}
                  className="flex items-center gap-4 px-5 py-4 transition-all duration-150"
                  style={{ borderBottom: "1px solid #141414", background: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#0d0d0d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span className="font-mono text-xs w-7 flex-shrink-0" style={{ color: "#666", fontFamily: MONO }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm font-medium truncate" style={{ color: isDone ? "#b8ff00" : "#e8e8e8" }}>
                      {p.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0" style={{ width: "180px" }}>
                    <div className="flex-1" style={{ height: "5px", background: "#1a1a1a", borderRadius: "3px", overflow: "hidden" }}>
                      <div style={{ width: `${p.pct}%`, height: "100%", background: isDone ? "#b8ff00" : "#4d7c0f", borderRadius: "3px" }} />
                    </div>
                    <span className="font-mono text-xs w-12 text-right" style={{ color: "#c4c4c4", fontFamily: MONO }}>
                      {p.pct}%
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
