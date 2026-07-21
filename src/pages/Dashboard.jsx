import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, BookOpen, FolderGit2, ArrowRight, Zap } from "lucide-react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getLevel } from "../components/gamification/XPLevelBar";
import { getStreak, namespacedKey } from "../lib/progressStats";
import { useAuth } from "../lib/AuthContext";
import { UserChallenges } from "../api/supabaseClient";
import { getChallengeStats } from "../api/progressStore";
import { getLessonPath } from "../content";
import LevelUpModal from "../components/gamification/LevelUpModal";
import { getStreakInfo } from "../lib/progressStats";
import { shouldShowWeeklyRecap } from "../lib/retention";
import DailyGoal from "../components/retention/DailyGoal";
import ReviewSection from "../components/retention/ReviewSection";
import WeeklyRecapModal from "../components/retention/WeeklyRecapModal";
import RankWheel from "../components/gamification/RankWheel";
import AvatarFrame from "../components/gamification/AvatarFrame";
import SkillMap from "../components/gamification/SkillMap";
import StreakCalendar from "../components/retention/StreakCalendar";
import ActivityFeed from "../components/retention/ActivityFeed";
import { RANKS, rankInfo, cacheXp } from "../components/gamification/rank";
import { CountUp } from "@/components/kit";
import "@/styles/landing.css";

const C = {
  bg: "#070B0A",
  card: "#0C1210",
  cardHover: "#111917",
  border: "#17201C",
  borderHi: "#3A3020",
  amber: "#5ED29C",
  amberBright: "#7FE0B0",
  gold: "#7FE0B0",
  ember: "#FF7A3D",
  emerald: "#5FBF7E",
  white: "#ECF3EF",
  text: "#ECF3EF",
  dim: "#B7C6BE",
};

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const { user: supabaseUser } = useAuth();
  const [challengeStats, setChallengeStats] = useState({ completed: 0, inProgress: 0, streak: 0 });

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => { api.auth.redirectToLogin(); });
  }, []);

  useEffect(() => {
    const local = getChallengeStats();
    setChallengeStats(local);
    const sid = supabaseUser?.id;
    if (!sid || String(sid).startsWith("local-")) return;
    UserChallenges.list(supabaseUser.id).then(items => {
      const completed = items.filter(i => i.status === "completed").length;
      const inProgress = items.filter(i => i.status === "in_progress").length;
      const completedDays = new Set(items.filter(i => i.completed_at).map(i => new Date(i.completed_at).toDateString()));
      let streak = 0;
      const cursor = new Date();
      while (completedDays.has(cursor.toDateString())) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      setChallengeStats({
        completed: Math.max(local.completed, completed),
        inProgress: Math.max(local.inProgress, inProgress),
        streak: Math.max(local.streak, streak),
      });
    }).catch(() => {});
  }, [supabaseUser]);

  const { data: progressRaw = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });
  const { data: projectsRaw = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const { data: allLessonsRaw = [] } = useQuery({
    queryKey: ["all-lessons"],
    queryFn: () => api.entities.Lesson.list("order"),
  });

  const progress = (Array.isArray(progressRaw) ? progressRaw : []).filter(Boolean);
  const projects = (Array.isArray(projectsRaw) ? projectsRaw : []).filter(Boolean);
  const allLessons = (Array.isArray(allLessonsRaw) ? allLessonsRaw : []).filter(Boolean);

  const [levelUp, setLevelUp] = useState(null);
  const [showRecap, setShowRecap] = useState(false);
  useEffect(() => {
    if (progress.length && shouldShowWeeklyRecap(progress)) setShowRecap(true);
  }, [progress]);
  useEffect(() => {
    if (!user || progress.length === 0) return;
    const xp = progress.filter(p => p.completed).reduce((s, p) => s + (p.points_earned || 10), 0);
    cacheXp(xp);
    const currentLevel = getLevel(xp).level;
    const key = namespacedKey("codeflow_last_level");
    let lastSeen = 0;
    try { lastSeen = parseInt(localStorage.getItem(key) || "0", 10) || 0; } catch {  }
    if (currentLevel > lastSeen) {
      if (lastSeen > 0) setLevelUp(currentLevel);
      try { localStorage.setItem(key, String(currentLevel)); } catch {  }
    }
  }, [user, progress]);

  if (!user) return null;

  const completedProgress = progress.filter(p => p.completed);
  const completedLessonIds = new Set(completedProgress.map(p => p.lesson_id));
  const completedLessons = Math.max(completedProgress.length, challengeStats.completed);
  const totalXP = completedProgress.length
    ? completedProgress.reduce((s, p) => s + (p.points_earned || 10), 0)
    : completedLessons * 10;
  const streak = Math.max(getStreak(), challengeStats.streak);
  const streakInfo = getStreakInfo();
  const welcomeSub = streakInfo.atRisk && streakInfo.current > 0
    ? `You're on a ${streakInfo.current}-day streak. Do one lesson today to keep it alive.`
    : streakInfo.current > 1
    ? `${streakInfo.current}-day streak going. ${completedLessons} lessons, ${totalXP} XP so far.`
    : `You've completed ${completedLessons} ${completedLessons === 1 ? "lesson" : "lessons"} and earned ${totalXP} XP. Start a streak today.`;

  const lessonsByProject = (projId) =>
    allLessons.filter(l => l.project_id === projId).sort((a, b) => (a.order || 0) - (b.order || 0));
  const completedProjects = projects.filter(proj => {
    const done = progress.filter(p => p.project_id === proj.id && p.completed).length;
    return proj.lessons_count && done >= proj.lessons_count;
  }).length;

  let nextStep = null;
  for (const proj of projects) {
    const ls = lessonsByProject(proj.id);
    if (!ls.length) continue;
    const firstIncomplete = ls.find(l => !completedLessonIds.has(l.id));
    if (firstIncomplete) { nextStep = { project: proj, lesson: firstIncomplete, lessons: ls }; break; }
  }
  const heroProject = nextStep?.project || projects[0] || null;
  const heroLessons = nextStep?.lessons || (heroProject ? lessonsByProject(heroProject.id) : []);
  const heroDone = heroProject ? heroLessons.filter(l => completedLessonIds.has(l.id)).length : 0;
  const heroTotal = heroLessons.length || heroProject?.lessons_count || 0;
  const heroPct = heroTotal ? Math.round((heroDone / heroTotal) * 100) : 0;

  const firstName = user.name?.split(" ")[0] || user.email?.split("@")[0] || "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const rank = rankInfo(totalXP);

  const stats = [
    { key: "xp", label: "Total XP", value: totalXP, count: true, sub: rank.isMax ? "max rank" : `${rank.toNext} to next rank`, icon: Zap, accent: C.gold },
    { key: "streak", label: "Day streak", value: streak, count: true, sub: streak > 0 ? "keep it lit" : "start one today", icon: Flame, accent: "#F5A524", pulse: true },
    { key: "lessons", label: "Lessons done", value: completedLessons, count: true, sub: "keep going", icon: BookOpen, accent: C.amber },
    { key: "projects", label: "Projects done", value: completedProjects, count: true, sub: `${projects.length} total`, icon: FolderGit2, accent: C.emerald },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 220, damping: 22 } } };

  return (
    <div className="min-h-screen relative" style={{ background: C.bg }}>
      {}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)",
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)` }} />

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        {}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-4">
          <AvatarFrame tier={rank.tier} initial={firstName} size={64} />
          <div className="min-w-0">
            <div className="text-sm mb-1" style={{ color: C.dim, fontFamily: font.display }}>{greeting}</div>
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: C.white, lineHeight: 1.08, margin: 0 }}>
              Welcome back, <span className="cl-grad">{firstName}</span>.
            </h1>
          </div>
        </motion.div>
        <p className="mt-3 text-base" style={{ color: C.dim, fontFamily: font.display }}>{welcomeSub}</p>

        {}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="mt-10 grid gap-5 lg:grid-cols-[auto_1fr] items-center rounded-2xl p-6"
          style={{ background: "linear-gradient(135deg, #111917 0%, #0C1210 100%)", border: `1px solid ${C.border}` }}>
          <div className="flex justify-center">
            <RankWheel totalXP={totalXP} size={172} />
          </div>
          <div>
            <h2 className="u-display" style={{ fontSize: "1.05rem", fontWeight: 700, color: C.white, margin: "0 0 4px" }}>Rank ladder</h2>
            <p className="text-xs mb-4" style={{ color: C.dim }}>Each rank costs more XP than the last. Harder content pays out more, so the climb accelerates.</p>
            <div className="flex flex-col gap-1.5">
              {RANKS.map((r) => {
                const isCurrent = r.tier === rank.tier;
                const reached = totalXP >= r.min;
                return (
                  <div key={r.tier} className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={{ background: isCurrent ? `${r.color}14` : "transparent", border: `1px solid ${isCurrent ? r.color + "55" : "transparent"}` }}>
                    <span className="u-mono text-center shrink-0" style={{ width: 20, fontSize: "0.72rem", color: reached ? r.color : C.dim }}>{r.tier}</span>
                    <span className="flex-1 text-sm" style={{ color: reached ? C.white : C.dim, fontWeight: isCurrent ? 700 : 500 }}>{r.name}</span>
                    <span className="u-mono tabular-nums shrink-0" style={{ fontSize: "0.72rem", color: reached ? r.color : C.dim }}>
                      {r.min === 0 ? "0" : `${r.min.toLocaleString()}`}{r.max === Infinity ? "+" : ""} XP
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {}
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.key}
                variants={item}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-5 transition-shadow duration-200"
                style={{ background: C.card, border: `1px solid ${C.border}` }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 12px 40px -12px ${s.accent}55`; e.currentTarget.style.borderColor = `${s.accent}66`; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs" style={{ color: C.dim }}>{s.label}</span>
                  {s.pulse ? (
                    <motion.span
                      animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85], filter: [`drop-shadow(0 0 2px ${s.accent}88)`, `drop-shadow(0 0 10px ${s.accent})`, `drop-shadow(0 0 2px ${s.accent}88)`] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      style={{ display: "inline-flex" }}
                    >
                      <Icon size={18} style={{ color: s.accent }} />
                    </motion.span>
                  ) : (
                    <Icon size={18} style={{ color: s.accent }} />
                  )}
                </div>
                <div style={{ fontFamily: font.display, fontSize: "1.7rem", fontWeight: 800, color: C.white, lineHeight: 1 }}>
                  {s.count ? <CountUp to={s.value} /> : s.value}
                </div>
                <div className="mt-1.5 text-xs" style={{ color: C.dim }}>{s.sub}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {}
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <StreakCalendar />
          <DailyGoal />
        </div>

        {}
        {heroProject && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8 rounded-2xl p-6 lg:p-8 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #111917 0%, #0C1210 100%)", border: `1px solid ${C.borderHi}` }}>
            <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full" style={{ background: `radial-gradient(circle, ${C.amber}22, transparent 70%)` }} />
            <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div className="flex-1">
                <div className="text-sm mb-2" style={{ color: C.amber, fontWeight: 600 }}>Continue learning</div>
                <h2 style={{ fontFamily: font.display, fontSize: "clamp(1.5rem, 3vw, 2.1rem)", fontWeight: 800, color: C.white, letterSpacing: "-0.02em", margin: 0 }}>
                  {heroProject.title || heroProject.name || "Your next project"}
                </h2>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1.5 w-40 rounded-full overflow-hidden" style={{ background: "#050807" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${heroPct}%` }} transition={{ duration: 0.9, delay: 0.5 }}
                      className="h-full rounded-full" style={{ background: C.emerald }} />
                  </div>
                  <span className="text-xs" style={{ color: C.dim }}>{heroDone}/{heroTotal} lessons · {heroPct}% complete</span>
                </div>
              </div>
              <ResumeButton to={getLessonPath(nextStep?.lesson?.id) || "#"} />
            </div>
          </motion.div>
        )}

        {}
        {heroLessons.length > 0 && (
          <div className="mt-10">
            <h2 className="u-display mb-4" style={{ fontSize: "1.05rem", fontWeight: 700, color: C.white }}>
              {heroProject?.title || "Lessons"}
            </h2>
            <div className="flex flex-col gap-1.5">
              {heroLessons.slice(0, 6).map((lesson, i) => {
                const done = completedLessonIds.has(lesson.id);
                const isNext = nextStep?.lesson?.id === lesson.id;
                return (
                  <LessonRow key={lesson.id || i} index={i} lesson={lesson} done={done} isNext={isNext} />
                );
              })}
            </div>
          </div>
        )}
        {}
        {projects.length > 0 && (
          <div className="mt-14">
            <h2 className="u-display" style={{ fontSize: "1.35rem", fontWeight: 800, color: C.white, letterSpacing: "-0.02em", margin: "0 0 4px" }}>
              Skill map
            </h2>
            <p className="text-sm mb-6" style={{ color: C.dim }}>
              Pick any unlocked path. Finish a unit to open the next.
            </p>
            <SkillMap projects={projects} lessons={allLessons} completedLessonIds={completedLessonIds} />
          </div>
        )}

        {}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <ActivityFeed progress={progress} lessons={allLessons} />
          <ReviewSection lessons={allLessons} progress={progress} />
        </div>
      </div>

      {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
      {showRecap && <WeeklyRecapModal progress={progress} onClose={() => setShowRecap(false)} />}
    </div>
  );
}

function ResumeButton({ to }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-sans text-sm font-bold tracking-wide uppercase transition-all duration-200 self-start"
      style={{ background: C.amber, color: C.bg }}
      onMouseEnter={(e) => { e.currentTarget.style.background = C.amberBright; e.currentTarget.style.boxShadow = `0 10px 30px -8px ${C.amber}aa`; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = C.amber; e.currentTarget.style.boxShadow = "none"; }}
    >
      Resume
      <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1.5" />
    </Link>
  );
}

function LessonRow({ index, lesson, done, isNext }) {
  const path = getLessonPath(lesson.id) || "#";
  const title = lesson.title || lesson.name || `Lesson ${index + 1}`;
  return (
    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
      <Link
        to={path}
        className="flex items-center gap-4 rounded-xl px-4 py-3.5 transition-colors duration-150"
        style={{ background: isNext ? "#201C13" : "transparent", border: `1px solid ${isNext ? C.borderHi : "transparent"}` }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.cardHover; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = isNext ? "#201C13" : "transparent"; }}
      >
        <span className="font-mono text-sm tabular-nums w-7 shrink-0" style={{ color: done ? C.emerald : C.dim }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm" style={{ color: C.white, fontFamily: font.display, fontWeight: done ? 400 : 500 }}>
          {title}
        </span>
        {done ? (
          <span className="text-[11px] font-semibold" style={{ color: C.emerald }}>Done</span>
        ) : isNext ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: C.amber }}>
            <Zap size={11} /> Up next
          </span>
        ) : (
          <div className="h-1 w-16 rounded-full overflow-hidden shrink-0" style={{ background: "#050807" }}>
            <div className="h-full rounded-full" style={{ width: "0%", background: C.amber }} />
          </div>
        )}
      </Link>
    </motion.div>
  );
}
