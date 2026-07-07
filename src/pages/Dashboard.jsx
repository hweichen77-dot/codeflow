import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { getLevel } from "../components/gamification/XPLevelBar";
import { getStreak, namespacedKey } from "../lib/progressStats";
import { useAuth } from "../lib/AuthContext";
import { UserChallenges } from "../api/supabaseClient";
import { getChallengeStats } from "../api/progressStore";
import ShareCard from "../components/ShareCard";
import ProgressRing from "../components/gamification/ProgressRing";
import Achievements from "../components/gamification/Achievements";
import LevelUpModal from "../components/gamification/LevelUpModal";
import XPToastContainer from "../components/gamification/XPToast";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const { user: supabaseUser } = useAuth();
  const [challengeStats, setChallengeStats] = useState({ completed: 0, inProgress: 0, streak: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => { api.auth.redirectToLogin(); });
  }, []);

  useEffect(() => {
    const local = getChallengeStats();
    setChallengeStats(local);

    const sid = supabaseUser?.id;
    if (!sid || String(sid).startsWith("local-")) { setStatsLoading(false); return; }

    UserChallenges.list(supabaseUser.id).then(items => {
      const completed = items.filter(i => i.status === 'completed').length;
      const inProgress = items.filter(i => i.status === 'in_progress').length;
      const completedDates = items
        .filter(i => i.completed_at)
        .map(i => new Date(i.completed_at).toDateString());
      const uniqueDates = [...new Set(completedDates)].sort().reverse();
      let streak = 0;
      const today = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);
        if (uniqueDates[i] === expected.toDateString()) streak++;
        else break;
      }
      setChallengeStats({
        completed: Math.max(local.completed, completed),
        inProgress: Math.max(local.inProgress, inProgress),
        streak: Math.max(local.streak, streak),
      });
      setStatsLoading(false);
    }).catch(() => setStatsLoading(false));
  }, [supabaseUser]);

  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });

  const { data: allLessons = [] } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: () => api.entities.Lesson.list("order"),
  });

  const { data: capstones = [] } = useQuery({
    queryKey: ["all-capstones", user?.email],
    queryFn: () => api.entities.CapstoneSubmission.filter({ user_email: user.email }),
    enabled: !!user,
  });

  const [levelUp, setLevelUp] = useState(null);

  useEffect(() => {
    if (!user || progress.length === 0) return;
    const xp = progress
      .filter((p) => p.completed)
      .reduce((sum, p) => sum + (p.points_earned || 10), 0);
    const currentLevel = getLevel(xp).level;
    const lastLevelKey = namespacedKey("codeflow_last_level");
    let lastSeen = 0;
    try {
      lastSeen = parseInt(localStorage.getItem(lastLevelKey) || "0", 10) || 0;
    } catch {  }

    if (currentLevel > lastSeen) {
      if (lastSeen > 0) setLevelUp(currentLevel);
      try { localStorage.setItem(lastLevelKey, String(currentLevel)); } catch {  }
    }
  }, [user, progress]);

  if (!user) return null;

  const completedProgress = progress.filter((p) => p.completed);
  const completedLessons = completedProgress.length;

  const activityMap = {};
  completedProgress.forEach((p) => {
    if (p.completed_date) {
      const day = p.completed_date.slice(0, 10);
      activityMap[day] = (activityMap[day] || 0) + 1;
    }
  });

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

  const streak = getStreak();

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

  const completedLessonIds = new Set(completedProgress.map((p) => p.lesson_id));
  const lessonsByProject = (projId) =>
    allLessons.filter((l) => l.project_id === projId).sort((a, b) => (a.order || 0) - (b.order || 0));
  const projectRingPct = (proj) => {
    const total = proj.lessons_count || lessonsByProject(proj.id).length;
    if (!total) return 0;
    const done = progress.filter((p) => p.project_id === proj.id && p.completed).length;
    return Math.round((done / total) * 100);
  };

  let nextStep = null;
  for (const proj of projects) {
    const ls = lessonsByProject(proj.id);
    if (ls.length === 0) continue;
    const firstIncomplete = ls.find((l) => !completedLessonIds.has(l.id));
    if (firstIncomplete) {
      const started = ls.some((l) => completedLessonIds.has(l.id)) || progress.length > 0;
      nextStep = { project: proj, lesson: firstIncomplete, started };
      break;
    }
  }
  const trackComplete = projects.length > 0 && allLessons.length > 0 && !nextStep;
  const nothingStarted = progress.length === 0;

  const struggledLessons = completedProgress.filter(
    (p) => p.solution_viewed || (p.wrong_attempts && p.wrong_attempts >= 3)
  ).length;
  const totalTimeMinutes = Math.round(
    completedProgress.reduce((s, p) => s + (p.time_spent_seconds || 0), 0) / 60
  );

  return (
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#FFFFFF" }}>DASHBOARD</div>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 8px" }}
          >
            {user.name?.split(" ")[0] || user.email?.split("@")[0] || "Learner"}
          </h1>
          <p className="font-display text-sm" style={{ color: "#FFFFFF", fontWeight: 400 }}>
            {user.email}
          </p>

          <div style={{ marginTop: "20px", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span className="font-sans text-xs" style={{ color: lvl.color }}>
                LVL {lvl.level}, {lvl.name}
              </span>
              <span className="font-sans text-xs" style={{ color: "#FFFFFF" }}>
                {totalXP} / {lvl.max === Infinity ? "∞" : lvl.max} XP
              </span>
            </div>
            <div style={{ height: "4px", background: "#262219", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${lvlPct}%`, background: lvl.color, borderRadius: "2px", transition: "width 1s ease" }} />
            </div>
            {nextLvl && (
              <div className="font-sans text-xs mt-1" style={{ color: "#FFFFFF" }}>
                {lvl.max - totalXP} XP to reach {nextLvl.name}
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <ShareCard
              name={user.name?.split(" ")[0] || user.email?.split("@")[0] || "Learner"}
              level={lvl.level}
              levelName={lvl.name}
              totalXP={totalXP}
              lessons={completedLessons}
              challenges={challengeStats.completed}
              streak={streak}
              overallPct={overallPct}
            />
          </div>
        </div>
      </div>

      <XPToastContainer />
      <LevelUpModal show={!!levelUp} level={levelUp} onClose={() => setLevelUp(null)} />

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-12 space-y-12">

        {trackComplete ? (
          <div
            className="px-8 py-8"
            style={{ border: "1px solid #E8A33C33", background: "#E8A33C08", borderLeft: "2px solid #E8A33C" }}
          >
            <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#E8A33C" }}>
              TRACK COMPLETE
            </div>
            <h2 style={{ fontFamily: font.display, fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", margin: "0 0 8px" }}>
              You finished every lesson.
            </h2>
            <p className="font-display text-sm" style={{ color: "#FFFFFF", fontWeight: 400 }}>
              Revisit a module, ship a capstone, or take on the challenges.
            </p>
          </div>
        ) : nextStep ? (
          <Link to={createPageUrl(`ProjectDetail?id=${nextStep.project.id}`)} className="group block">
            <div
              className="flex items-center gap-6 px-8 py-7 transition-all duration-150"
              style={{ border: "1px solid #262219", background: "#131009", borderLeft: "2px solid #E8A33C" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#101010"; e.currentTarget.style.borderColor = "#E8A33C33"; e.currentTarget.style.borderLeftColor = "#E8A33C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#131009"; e.currentTarget.style.borderColor = "#262219"; e.currentTarget.style.borderLeftColor = "#E8A33C"; }}
            >
              <ProgressRing percent={projectRingPct(nextStep.project)} size={56} color="#E8A33C" />
              <div className="flex-1 min-w-0">
                <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#E8A33C" }}>
                  {nothingStarted ? "START MODULE 1" : "CONTINUE WHERE YOU LEFT OFF"}
                </div>
                <h2
                  className="truncate transition-colors duration-150 group-hover:text-white"
                  style={{ fontFamily: font.display, fontSize: "1.3rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#F2EDE2", margin: "0 0 4px", lineHeight: 1.2 }}
                >
                  {nextStep.lesson.title}
                </h2>
                <p className="font-display text-sm truncate" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                  {nextStep.project.title}
                </p>
              </div>
              <span className="font-sans text-2xl transition-colors duration-150 group-hover:text-white flex-shrink-0" style={{ color: "#FFFFFF" }}>
                →
              </span>
            </div>
          </Link>
        ) : null}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0" style={{ border: "1px solid #262219" }}>
          {[
            { val: statsLoading ? ", " : challengeStats.completed, label: "Challenges Done", accent: "#E8A33C" },
            { val: statsLoading ? ", " : challengeStats.inProgress, label: "In Progress", accent: null },
            { val: `${totalXP}`, label: "Total XP", accent: "#E8A33C" },
            { val: `${streak}`, label: "Day Streak", accent: streak >= 3 ? "#ff6b35" : null },
            { val: `LVL ${lvl.level}`, label: lvl.name, accent: lvl.color },
            { val: `${overallPct}%`, label: "Overall Progress", accent: null },
          ].map((stat, i, arr) => (
            <div
              key={stat.label}
              className="p-6"
              style={{
                borderRight: i < arr.length - 1 ? "1px solid #262219" : "none",
                borderBottom: "none",
              }}
            >
              <div
                className="font-display font-black leading-none mb-2"
                style={{ fontSize: "2rem", color: stat.accent || "#ECE7DC", letterSpacing: "-0.04em" }}
              >
                {stat.val}
              </div>
              <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#FFFFFF" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {streak > 0 && (
          <div
            className="flex items-center gap-4 px-6 py-4"
            style={{
              border: `1px solid ${streak >= 7 ? "#ff6b3533" : "#262219"}`,
              background: streak >= 7 ? "#ff6b3508" : "#131009",
              borderLeft: `2px solid ${streak >= 7 ? "#ff6b35" : streak >= 3 ? "#E0B341" : "#34302A"}`,
            }}
          >
            <span style={{ fontSize: "1.5rem" }}></span>
            <div>
              <div className="font-sans text-xs tracking-widest uppercase mb-0.5" style={{ color: streak >= 7 ? "#ff6b35" : "#E0B341" }}>
                {streak >= 7 ? "ON FIRE" : streak >= 3 ? "BUILDING MOMENTUM" : "STREAK STARTED"}
              </div>
              <p className="font-display text-sm" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                {streak} day{streak !== 1 ? "s" : ""} in a row.{" "}
                {streak >= 7
                  ? "Exceptional consistency, keep it up."
                  : streak >= 3
                  ? "Come back tomorrow to grow your streak."
                  : "Every day counts. See you tomorrow."}
              </p>
            </div>
          </div>
        )}

        {struggledLessons > 0 && (
          <div>
            <div className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "#FFFFFF" }}>
              AI INSIGHTS
            </div>
            <div className="px-6 py-5" style={{ border: "1px solid #262219", background: "#131009", borderLeft: "2px solid #E0B341" }}>
              <div className="flex items-start gap-4">
                <span className="font-sans text-xs mt-0.5" style={{ color: "#E0B341" }}>AI</span>
                <div>
                  <p className="font-display text-sm mb-1" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                    You viewed solutions or had repeated errors on <span style={{ color: "#ECE7DC" }}>{struggledLessons} lesson{struggledLessons > 1 ? "s" : ""}</span>.
                  </p>
                  <p className="font-display text-xs" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                    Revisit those lessons, the concepts they cover are worth reinforcing before moving on.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="font-sans text-xs tracking-widest uppercase mb-6" style={{ color: "#FFFFFF" }}>
            ACTIVITY, LAST 52 WEEKS
          </div>
          <div
            className="p-6 overflow-x-auto"
            style={{ border: "1px solid #262219", background: "#131009" }}
          >
            <div style={{ minWidth: "600px" }}>
              <div className="flex mb-2" style={{ marginLeft: "2rem" }}>
                {monthLabels.map((m, idx) => (
                  <div
                    key={m.label + m.index}
                    className="font-sans text-xs"
                    style={{
                      color: "#FFFFFF",
                      marginLeft: idx === 0 ? 0 : `${(m.index - monthLabels[idx - 1].index) * 13}px`,
                    }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
              <div className="flex gap-0.5">
                <div className="flex flex-col gap-0.5 mr-2">
                  {["", "M", "", "W", "", "F", ""].map((d, i) => (
                    <div key={i} className="font-sans" style={{ height: "11px", width: "12px", fontSize: "8px", color: "#FFFFFF", display: "flex", alignItems: "center" }}>
                      {d}
                    </div>
                  ))}
                </div>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-0.5">
                    {week.map((day) => {
                      const isFuture = day.date > now.toISOString().slice(0, 10);
                      const bg = isFuture
                        ? "transparent"
                        : day.count === 0
                        ? "#1C1A14"
                        : day.count === 1
                        ? "#4a5c00"
                        : day.count <= 3
                        ? "#7a9900"
                        : "#E8A33C";
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

        {inProgressProjects.length > 0 && (
          <div>
            <div className="font-sans text-xs tracking-widest uppercase mb-6" style={{ color: "#FFFFFF" }}>
              CONTINUE LEARNING
            </div>
            <div style={{ border: "1px solid #262219" }}>
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
                      style={{ borderBottom: i < inProgressProjects.length - 1 ? "1px solid #1C1A14" : "none" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "#131009";
                        e.currentTarget.style.paddingLeft = "1.75rem";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.paddingLeft = "1.5rem";
                      }}
                    >
                      <ProgressRing percent={pct} size={40} color="#E8A33C" />
                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-bold text-base mb-2 transition-colors duration-150 group-hover:text-white truncate"
                          style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}
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
                                  background: di < Math.round(pct / 10) ? "#E8A33C" : "#262219",
                                }}
                              />
                            ))}
                          </div>
                          <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>
                            {project.doneCount}/{project.lessons_count}
                          </span>
                        </div>
                      </div>
                      <span className="font-sans text-xs transition-colors duration-150 group-hover:text-white" style={{ color: "#FFFFFF" }}>
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {completedProjects.length > 0 && (
          <div>
            <div className="font-sans text-xs tracking-widest uppercase mb-6" style={{ color: "#FFFFFF" }}>
              COMPLETED
            </div>
            <div className="space-y-2">
              {completedProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 px-6 py-4"
                  style={{ border: "1px solid #262219" }}
                >
                  <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>✓</span>
                  <span className="font-display text-sm font-medium" style={{ color: "#FFFFFF" }}>
                    {project.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <Achievements progress={progress} projects={projects} streak={streak} capstones={capstones} />

        {progress.length === 0 && (
          <div
            className="text-center py-20"
            style={{ border: "1px solid #262219" }}
          >
            <div className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "#FFFFFF" }}>
              NO ACTIVITY YET
            </div>
            <p className="font-display text-base mb-8" style={{ color: "#FFFFFF", fontWeight: 400 }}>
              Start your first project to track progress here.
            </p>
            <Link to={createPageUrl("Projects")}>
              <button
                className="font-sans text-xs tracking-widest uppercase px-8 py-4 transition-all duration-150"
                style={{ background: "#E8A33C", color: "#15130E", fontWeight: 700 }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(232,163,60,0.2)";
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