import React, { useState, useEffect, useRef } from "react";
import { api } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";
import RichLessonPanel from "../components/lesson/RichLessonPanel";
import LessonEnhancements from "../components/lesson/LessonEnhancements";
import LessonBlocks from "../components/lesson/LessonBlocks";
import ProjectBrief from "../components/lesson/ProjectBrief";
import CheckBlock from "../components/lesson/CheckBlock";
import ParticipationActivity from "../components/lesson/ParticipationActivity";
import { trace } from "../components/lesson/trace/theme";
import LessonPointsSummary from "../components/lesson/LessonPointsSummary";
import LessonChallenge from "../components/lesson/LessonChallenge";
import { runCodeInSandbox } from "../lib/codeRunner";
import XPToastContainer, { showXPToast } from "../components/gamification/XPToast";
import XPLevelBar from "../components/gamification/XPLevelBar";
import StreakBadge from "../components/gamification/StreakBadge";
import BadgeUnlock from "../components/gamification/BadgeUnlock";
import OutputComparison from "../components/lesson/OutputComparison";
import LessonCompletionCelebration from "../components/lesson/LessonCompletionCelebration";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";

const DIFFICULTY_NUM = { beginner: "00", intermediate: "01", advanced: "02" };

export default function ProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");

  const [user, setUser] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [readingDone, setReadingDone] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const [participationDone, setParticipationDone] = useState(false);
  const [blocksDone, setBlocksDone] = useState(false);
  const [challengeDone, setChallengeReportDone] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const lessonStartTime = useRef(Date.now());
  const wrongAttempts = useRef(0);

  const queryClient = useQueryClient();

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const projects = await api.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: ["lessons", projectId],
    queryFn: () => api.entities.Lesson.filter({ project_id: projectId }, "order"),
    enabled: !!projectId,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["user-progress", projectId, user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email, project_id: projectId }),
    enabled: !!user && !!projectId,
  });

  // Foundations hard-gate enforcement for deep/direct links. We load every
  // project + the learner's full progress so we can compute the same gate the
  // list pages use and block entry into a still-locked module.
  const { data: allProjects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => api.entities.Project.list("order"),
  });
  const { data: allProgress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () => api.entities.UserProgress.filter({ user_email: user.email }),
    enabled: !!user,
  });

  useEffect(() => {
    if (lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId);
  const activeLessonIndex = lessons.findIndex((l) => l.id === activeLessonId);

  useEffect(() => {
    if (activeLesson) {
      const saved = progress.find((p) => p.lesson_id === activeLesson.id);
      setCode(saved?.user_code || activeLesson.starter_code || "");
      setOutput(null);
      setShowHints(false);
      setShowSolution(false);
      setReadingDone(false);
      setQuizDone(false);
      setParticipationDone(false);
      setBlocksDone(false);
      setChallengeReportDone(false);
      setEarnedPoints(saved?.points_earned || 0);
      lessonStartTime.current = Date.now();
      wrongAttempts.current = 0;
    }
  }, [activeLessonId, activeLesson?.id]);

  const isCompleted = (lessonId) => progress.some((p) => p.lesson_id === lessonId && p.completed);

  const completeMutation = useMutation({
    mutationFn: async (lessonId) => {
      const timeSpent = Math.round((Date.now() - lessonStartTime.current) / 1000);
      const existing = progress.find((p) => p.lesson_id === lessonId);
      const progressData = {
        completed: true,
        user_code: code,
        completed_date: new Date().toISOString(),
        wrong_attempts: wrongAttempts.current,
        hints_used: showHints ? (activeLesson?.hints?.length || 0) : 0,
        solution_viewed: showSolution,
        time_spent_seconds: timeSpent,
      };
      if (existing) {
        await api.entities.UserProgress.update(existing.id, progressData);
      } else {
        await api.entities.UserProgress.create({
          user_email: user.email, lesson_id: lessonId, project_id: projectId, ...progressData,
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress", projectId] }),
  });

  const handleRun = async () => {
    setIsRunning(true);
    const { output: result, isError } = await runCodeInSandbox(code);
    if (isError) wrongAttempts.current += 1;
    setOutput(result);
    setIsRunning(false);
  };

  const handleComplete = () => {
    if (user && activeLesson) {
      completeMutation.mutate(activeLesson.id);
      setShowCelebration(true);
    }
  };

  const goToNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonId(lessons[activeLessonIndex + 1].id);
    }
  };

  const goToPrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonId(lessons[activeLessonIndex - 1].id);
    }
  };

  // Focus mode — persisted preference.
  const [focusMode, setFocusMode] = useState(() => {
    try { return localStorage.getItem("codeflow_focus_mode") === "1"; } catch { return false; }
  });
  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      try { localStorage.setItem("codeflow_focus_mode", next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  // One-time keyboard-nav hint.
  const [showNavHint, setShowNavHint] = useState(() => {
    try { return localStorage.getItem("codeflow_navhint_seen") !== "1"; } catch { return true; }
  });
  const dismissNavHint = () => {
    setShowNavHint(false);
    try { localStorage.setItem("codeflow_navhint_seen", "1"); } catch { /* ignore */ }
  };

  // Keyboard navigation: ← previous, → next. Ignore when typing.
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target;
      const tag = t?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        t?.isContentEditable
      ) return;
      if (e.key === "ArrowRight") { goToNextLesson(); dismissNavHint(); }
      else if (e.key === "ArrowLeft") { goToPrevLesson(); dismissNavHint(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeLessonIndex, lessons]);

  const [expandingLesson, setExpandingLesson] = useState(false);
  const [enrichingLesson, setEnrichingLesson] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleEnrichLesson = async () => {
    if (!activeLesson) return;
    setEnrichingLesson(true);
    try {
      await api.functions.invoke("enrichLesson", { lessonId: activeLesson.id });
      queryClient.invalidateQueries({ queryKey: ["lessons", projectId] });
      showXPToast("Lesson enriched!", 0, "");
    } catch (e) {
      console.error(e);
    }
    setEnrichingLesson(false);
  };

  const handleExpandLesson = async () => {
    if (!activeLesson) return;
    setExpandingLesson(true);
    try {
      await api.functions.invoke("expandLesson", {
        lessonId: activeLesson.id,
        lessonTitle: activeLesson.title,
        concept: activeLesson.concept,
        explanation: activeLesson.explanation,
        starterCode: activeLesson.starter_code,
      });
      queryClient.invalidateQueries({ queryKey: ["lessons", projectId] });
      showXPToast("Lesson expanded!", 0, "");
    } catch (e) {
      console.error(e);
    }
    setExpandingLesson(false);
  };

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;
  const totalXP = progress.filter(p => p.completed).reduce((sum, p) => sum + (p.points_earned || 10), 0);

  if (loadingProject || loadingLessons) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <div className="font-mono text-xs tracking-widest uppercase animate-pulse" style={{ color: "#e8e8e8" }}>
          Loading module...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#e8e8e8" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Projects")}>
          <button className="font-mono text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#b8ff00", border: "1px solid #b8ff0033" }}>
            ← Back to Projects
          </button>
        </Link>
      </div>
    );
  }

  // Deep-link guard: enforce the same Foundations gate the list pages show, so
  // a still-locked module can't be opened by typing/sharing its URL. Mirrors
  // Projects.jsx getStatus (progress rows >= lessons_count === completed).
  const projectCompleted = (p) => {
    const pp = allProgress.filter((x) => x.project_id === p.id);
    return p.lessons_count ? pp.length >= p.lessons_count : false;
  };
  // The Foundations gate is an AI-track concept; AP CSP/CSA modules are never
  // gated by it. Only consider AI beginner modules when evaluating it.
  const isAiTrack = (project.track || "ai") === "ai";
  const beginnerProjects = allProjects.filter(
    (p) => p.difficulty === "beginner" && (p.track || "ai") === "ai"
  );
  const moduleGated = isAiTrack && isModuleGated({
    finished: foundationsAreFinished(beginnerProjects, projectCompleted),
    done: projectCompleted(project),
    difficulty: project.difficulty,
  });

  if (moduleGated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#ffb300" }}>
          🔒 Module Locked
        </div>
        <h1
          style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.15, maxWidth: "32rem" }}
        >
          Finish the Foundations first.
        </h1>
        <p className="font-display text-base" style={{ color: "#bbb", maxWidth: "32rem" }}>
          “{project.title}” builds on the beginner modules. Complete most of the
          Foundations track and this unlocks automatically.
        </p>
        <Link to={createPageUrl("Projects")}>
          <button className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 mt-2" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
            ← Back to Foundations
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      <XPToastContainer />
      <BadgeUnlock completedCount={completedCount} />
      <LessonCompletionCelebration
        show={showCelebration}
        lessonTitle={activeLesson?.title || ""}
        xpEarned={activeLesson?.xp_reward || 10}
        onClose={() => { setShowCelebration(false); showXPToast("Lesson Complete!", activeLesson?.xp_reward || 10, ""); }}
      />
      {/* Project header — full width banner */}
      <div
        className="relative pt-20"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />

        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10">
          <Link
            to={createPageUrl("Projects")}
            className="font-mono text-xs tracking-widest uppercase mb-6 inline-block transition-colors duration-150"
            style={{ color: "#e8e8e8" }}
            onMouseEnter={e => e.currentTarget.style.color = "#b8ff00"}
            onMouseLeave={e => e.currentTarget.style.color = "#333"}
          >
            ← Projects
          </Link>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="font-mono font-bold"
                  style={{ fontSize: "4rem", lineHeight: 1, color: "#e8e8e8", letterSpacing: "-0.05em" }}
                >
                  {DIFFICULTY_NUM[project.difficulty] || "00"}
                </span>
                <div>
                  <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#b8ff00" }}>
                    {project.difficulty} · {project.category?.replace("_", "/")}
                  </div>
                  <h1
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: 0 }}
                  >
                    {project.title}
                  </h1>
                </div>
              </div>
              <p className="font-display text-sm leading-relaxed" style={{ color: "#c4c4c4", fontWeight: 400, maxWidth: "55ch" }}>
                {project.description}
              </p>
            </div>

            {/* Progress indicator — dot trail */}
            <div className="flex flex-col items-end gap-3">
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#e8e8e8" }}>
                {completedCount}/{totalLessons} complete
              </div>
              <div className="flex gap-1.5">
                {lessons.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLessonId(l.id)}
                    title={`Lesson ${i + 1}: ${l.title}`}
                    className="transition-all duration-200"
                    style={{
                      width: "8px",
                      height: "8px",
                      background: isCompleted(l.id)
                        ? "#b8ff00"
                        : l.id === activeLessonId
                        ? "#888"
                        : "#1e1e1e",
                      border: l.id === activeLessonId ? "1px solid #888" : "1px solid transparent",
                    }}
                  />
                ))}
              </div>
              <div className="font-mono text-xs" style={{ color: "#e8e8e8" }}>
                {project.estimated_time ? `~${project.estimated_time}min` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div
        className="mx-auto px-8 lg:px-16 py-10 transition-all duration-300"
        style={{ maxWidth: focusMode ? "920px" : "80rem" }}
      >
        <div
          className="grid gap-10 transition-all duration-300"
          style={{ gridTemplateColumns: focusMode ? "1fr" : undefined }}
          data-focus={focusMode ? "1" : "0"}
        >
          {/* Sidebar — notebook spine (hidden in focus mode) */}
          {!focusMode && (
          <div className="relative" style={{ width: "220px" }}>
            <div
              className="sticky top-20"
              style={{ borderLeft: "1px solid #1a1a1a", paddingLeft: "1.25rem" }}
            >
              {/* Streak badges */}
              <StreakBadge completedCount={completedCount} />

              {/* Vertical label */}
              <div
                className="font-mono text-xs tracking-widest uppercase mb-5"
                style={{ color: "#c4c4c4" }}
              >
                LESSONS
              </div>

              <div className="space-y-0">
                {lessons.map((lesson, i) => {
                  const completed = isCompleted(lesson.id);
                  const active = lesson.id === activeLessonId;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className="w-full text-left py-3 transition-all duration-150 group relative"
                      style={{ borderBottom: "1px solid #111" }}
                    >
                      {/* Active left accent */}
                      {active && (
                        <div
                          className="absolute left-[-1.25rem] top-0 bottom-0 w-px"
                          style={{ background: "#b8ff00" }}
                        />
                      )}
                      <div className="flex items-start gap-3">
                        <span
                          className="font-mono text-xs flex-shrink-0 mt-0.5"
                          style={{ color: completed ? "#b8ff00" : active ? "#aaa" : "#555" }}
                        >
                          {completed ? "✓" : String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span
                            className="font-display text-xs leading-snug transition-colors duration-150 block"
                            style={{
                              color: active ? "#e8e8e8" : completed ? "#888" : "#aaa",
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            {lesson.title}
                          </span>
                          <span className="font-mono" style={{ fontSize: "9px", color: completed ? "#b8ff00" : "#666" }}>
                            {lesson.xp_reward || 10} pts
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          )}

          {/* Main content */}
          <div>
            {/* Focus mode toggle + keyboard-nav hint */}
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              {showNavHint ? (
                <button
                  onClick={dismissNavHint}
                  className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                  style={{ color: "#c4c4c4", border: "1px solid #1a1a1a", background: "#0d0d0d" }}
                  title="Dismiss hint"
                >
                  ← → to navigate lessons
                </button>
              ) : <span />}
              <button
                onClick={toggleFocusMode}
                className="font-mono text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                style={{
                  color: focusMode ? "#b8ff00" : "#666",
                  border: `1px solid ${focusMode ? "#b8ff0033" : "#1a1a1a"}`,
                  background: focusMode ? "#b8ff0010" : "#0d0d0d",
                }}
                title="Toggle focus mode"
              >
                {focusMode ? "◇ Exit Focus" : "◆ Focus Mode"}
              </button>
            </div>

            {/* XP Level Bar */}
            <div style={{ marginBottom: "20px" }}>
              <XPLevelBar totalXP={totalXP} earnedThisLesson={earnedPoints} />
            </div>

            <AnimatePresence mode="wait">
              {activeLesson && (
                <motion.div
                  key={activeLesson.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8 reader-surface"
                >
                  {/* Project brief — shown on the first lesson as the overview */}
                  {activeLessonIndex === 0 && <ProjectBrief brief={project?.brief} />}

                  {/* TRACE section header: § NN / TITLE  ▸ XP */}
                  <div style={{ marginBottom: "8px" }}>
                    <div className="font-mono" style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: trace.lime, marginBottom: "6px" }}>
                      § {String(activeLessonIndex + 1).padStart(2, "0")} &nbsp;▸&nbsp; {activeLesson.xp_reward || 10} XP
                    </div>
                    <h2 style={{
                      fontFamily: trace.serif,
                      fontSize: "1.55rem", fontWeight: 600, color: trace.text, letterSpacing: "-0.005em",
                      margin: 0, lineHeight: 1.35,
                    }}>
                      {activeLesson.title}
                    </h2>
                  </div>

                  {/* Rich lesson reading area — flat dark editorial surface (TRACE) */}
                  <div style={{ background: "transparent", borderTop: `1px solid ${trace.border}`, paddingTop: "28px" }}>
                    {activeLesson.concept && (
                      <h3 style={{
                        fontFamily: trace.serif,
                        fontSize: "1.15rem", fontWeight: 600, color: trace.text, margin: "0 0 16px",
                      }}>
                        {activeLesson.concept}
                      </h3>
                    )}

                    <RichLessonPanel lesson={activeLesson} />

                    {!readingDone && (
                      <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${trace.border}` }}>
                        <button
                          onClick={() => { setReadingDone(true); setEarnedPoints(p => p + 2); showXPToast("Reading complete!", 2, ""); }}
                          className="font-mono"
                          style={{
                            background: "transparent", color: trace.lime, border: `1px solid ${trace.lime}55`, borderRadius: "3px",
                            padding: "10px 28px", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                          }}
                        >
                          ✓ mark read (+2 XP)
                        </button>
                      </div>
                    )}
                    {readingDone && (
                      <div className="font-mono" style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${trace.border}`, color: trace.ok, fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        ✓ read (+2 XP)
                      </div>
                    )}

                    {activeLesson.participation_activities?.map((activity, ai) => (
                      <ParticipationActivity
                        key={ai}
                        activity={activity}
                        sectionNumber={`${activeLessonIndex + 1}.${ai + 1}`}
                        activityIndex={ai + 1}
                        onComplete={(correct, total) => {
                          if (!participationDone) {
                            setParticipationDone(true);
                            setEarnedPoints(p => p + 3);
                            showXPToast(`${correct}/${total} correct!`, 3, "");
                          }
                        }}
                      />
                    ))}

                  {/* Enhancements: callouts, video, key terms, diagram, inline quizzes */}
                  <div style={{ marginTop: "8px" }}>
                  <LessonEnhancements lesson={activeLesson} />

                  {/* New activity blocks: tools, animations, worked examples, tables, sort-it, reflect */}
                  <LessonBlocks
                    lesson={activeLesson}
                    onActivity={() => {
                      if (!blocksDone) {
                        setBlocksDone(true);
                        setEarnedPoints(p => p + 2);
                        showXPToast("Activity complete!", 2, "");
                      }
                    }}
                  />

                  {/* Quiz — TRACE check block */}
                  {activeLesson.quiz_questions?.length > 0 && (
                    <CheckBlock
                      questions={activeLesson.quiz_questions}
                      sectionNumber={`${activeLessonIndex + 1}`}
                      onComplete={(correct, total) => {
                        if (!quizDone) {
                          setQuizDone(true);
                          setEarnedPoints(p => p + 3);
                          showXPToast(`Quiz: ${correct}/${total} correct!`, 3, "");
                        }
                      }}
                    />
                  )}

                  {/* Coding challenge */}
                  <LessonChallenge lesson={activeLesson} />
                  </div>
                  </div>

                  {/* Code editor */}
                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    onRun={handleRun}
                    output={output}
                    isRunning={isRunning}
                    filename={`lesson_${String(activeLessonIndex + 1).padStart(2, "0")}.js`}
                    lessonTitle={activeLesson.title}
                    solutionCode={activeLesson.solution_code || ""}
                    enableAIAnalysis={!!activeLesson.solution_code}
                  />

                  {/* Output comparison */}
                  {output && activeLesson?.expected_output && (
                    <OutputComparison
                      actualOutput={output}
                      expectedOutput={activeLesson.expected_output}
                    />
                  )}

                  {/* Points summary — zybooks style */}
                  <LessonPointsSummary
                    lessonTitle={activeLesson.title}
                    sectionNumber={activeLessonIndex + 1}
                    totalPoints={activeLesson.xp_reward || 10}
                    earnedPoints={earnedPoints}
                    readingComplete={readingDone}
                    quizComplete={quizDone}
                    participationComplete={participationDone}
                    challengeComplete={challengeDone}
                    nextLessonTitle={activeLessonIndex < lessons.length - 1 ? lessons[activeLessonIndex + 1].title : null}
                    onNextLesson={goToNextLesson}
                  />

                  {/* Action row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={handleExpandLesson}
                          disabled={expandingLesson}
                          className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                          style={{
                            color: "#60a5fa", border: "1px solid #60a5fa33",
                            background: "#60a5fa10", opacity: expandingLesson ? 0.5 : 1,
                          }}
                        >
                          {expandingLesson ? " Expanding..." : " Expand with AI"}
                        </button>
                        <button
                          onClick={handleEnrichLesson}
                          disabled={enrichingLesson}
                          className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                          style={{
                            color: "#cc66ff", border: "1px solid #cc66ff33",
                            background: "#cc66ff10", opacity: enrichingLesson ? 0.5 : 1,
                          }}
                        >
                          {enrichingLesson ? " Enriching..." : " Enrich with AI"}
                        </button>
                      </>
                    )}
                    {activeLesson.hints && activeLesson.hints.length > 0 && (
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                        style={{
                          color: showHints ? "#b8ff00" : "#444",
                          border: `1px solid ${showHints ? "#b8ff0033" : "#1e1e1e"}`,
                          background: showHints ? "#b8ff0010" : "transparent",
                        }}
                      >
                        {showHints ? "— Hints" : "+ Hints"}
                      </button>
                    )}
                    {activeLesson.solution_code && (
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="font-mono text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                        style={{
                          color: showSolution ? "#888" : "#333",
                          border: `1px solid ${showSolution ? "#2a2a2a" : "#1a1a1a"}`,
                        }}
                      >
                        {showSolution ? "— Solution" : "Show Solution"}
                      </button>
                    )}

                    <div className="flex-1" />

                    {user && !isCompleted(activeLesson.id) && (
                      <button
                        onClick={handleComplete}
                        className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-150"
                        style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "#b8ff0020";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "#b8ff0010";
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        ✓ Mark Complete
                      </button>
                    )}
                    {activeLessonIndex < lessons.length - 1 && (
                      <button
                        onClick={goToNextLesson}
                        className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-150"
                        style={{ color: "#0a0a0a", background: "#b8ff00", border: "1px solid #b8ff00", fontWeight: 700 }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 6px 24px rgba(184,255,0,0.2)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        Next →
                      </button>
                    )}
                  </div>

                  {/* Hints panel */}
                  <AnimatePresence>
                    {showHints && activeLesson.hints && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                          <div className="px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#b8ff00" }}>
                              Hints
                            </span>
                          </div>
                          <div className="px-5 py-4 space-y-3">
                            {activeLesson.hints.map((hint, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#e8e8e8" }}>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-display text-sm leading-relaxed" style={{ color: "#c4c4c4", fontWeight: 400 }}>
                                  {hint}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Solution panel */}
                  <AnimatePresence>
                    {showSolution && activeLesson.solution_code && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #1a1a1a" }}>
                            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#c4c4c4" }}>
                              Solution
                            </span>
                            <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                              JS
                            </span>
                          </div>
                          <pre
                            className="font-mono overflow-x-auto p-5"
                            style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#d4d4d4" }}
                          >
                            {activeLesson.solution_code}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot
        context={activeLesson?.explanation || ""}
        lessonTitle={activeLesson?.title || project.title}
        lessonId={activeLesson?.id || ""}
        currentCode={code}
        lastOutput={output || ""}
      />
    </div>
  );
}