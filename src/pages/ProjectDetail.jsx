import React, { useState, useEffect, useRef } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { resolveLessonSlugs, getLessonPath } from "@/content";
import useDocumentHead from "@/lib/useDocumentHead";
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
import { runPython } from "../lib/pyRunner";
import XPToastContainer, { showXPToast } from "../components/gamification/XPToast";
import XPLevelBar from "../components/gamification/XPLevelBar";
import StreakBadge from "../components/gamification/StreakBadge";
import BadgeUnlock from "../components/gamification/BadgeUnlock";
import OutputComparison from "../components/lesson/OutputComparison";
import LessonCompletionCelebration from "../components/lesson/LessonCompletionCelebration";
import { foundationsAreFinished, isModuleGated } from "@/lib/foundationsGate";
import { track } from "@/lib/analytics";

const DIFFICULTY_NUM = { beginner: "00", intermediate: "01", advanced: "02" };

export default function ProjectDetail() {
  const params = new URLSearchParams(window.location.search);
  const { projectSlug, lessonSlug } = useParams();
  const routeResolved = projectSlug ? resolveLessonSlugs(projectSlug, lessonSlug) : {};
  const projectId = routeResolved.projectId || params.get("id");
  const initialLessonId = routeResolved.lessonId || null;

  const [user, setUser] = useState(null);
  const [activeLessonId, setActiveLessonId] = useState(initialLessonId);
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
      const wanted =
        initialLessonId && lessons.some((l) => l.id === initialLessonId)
          ? initialLessonId
          : lessons[0].id;
      setActiveLessonId(wanted);
    }
  }, [lessons, activeLessonId, initialLessonId]);

  const activeLesson = lessons.find((l) => l.id === activeLessonId);
  const activeLessonIndex = lessons.findIndex((l) => l.id === activeLessonId);

  // Keep the URL + document head in sync with the selected lesson so every
  // lesson is deep-linkable and shareable (only when viewing via /learn/...).
  useEffect(() => {
    if (!projectSlug || !activeLesson) return;
    const path = getLessonPath(activeLesson.id);
    if (path && window.location.pathname.endsWith(activeLesson.id) === false) {
      const full = `${import.meta.env.BASE_URL || "/"}`.replace(/\/$/, "") + path;
      if (window.location.pathname !== full) {
        window.history.replaceState(null, "", full);
      }
    }
  }, [activeLesson?.id, projectSlug]);

  useDocumentHead(
    activeLesson
      ? {
          title: activeLesson.title,
          description:
            (activeLesson.concept || activeLesson.explanation || "")
              .replace(/[#*`>\-\n]/g, " ")
              .replace(/\s+/g, " ")
              .trim()
              .slice(0, 155),
          path: getLessonPath(activeLesson.id),
        }
      : {}
  );

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
      try { track('lesson_start', { lesson_id: activeLesson.id, project_id: projectId }); } catch {  }
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
      if (!existing?.completed) {
        try { track('lesson_complete', { lesson_id: lessonId, project_id: projectId, time_spent_seconds: timeSpent }); } catch {  }
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress", projectId] }),
  });

  const handleRun = async () => {
    setIsRunning(true);
    const { output: result, isError } = await runPython(code);
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

  const [focusMode, setFocusMode] = useState(() => {
    try { return localStorage.getItem("codeflow_focus_mode") === "1"; } catch { return false; }
  });
  const toggleFocusMode = () => {
    setFocusMode((prev) => {
      const next = !prev;
      try { localStorage.setItem("codeflow_focus_mode", next ? "1" : "0"); } catch {  }
      return next;
    });
  };

  const [showNavHint, setShowNavHint] = useState(() => {
    try { return localStorage.getItem("codeflow_navhint_seen") !== "1"; } catch { return true; }
  });
  const dismissNavHint = () => {
    setShowNavHint(false);
    try { localStorage.setItem("codeflow_navhint_seen", "1"); } catch {  }
  };

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
        style={{ background: "#15130E" }}
      >
        <div className="font-sans text-xs tracking-widest uppercase animate-pulse" style={{ color: "#ECE7DC" }}>
          Loading module...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#15130E" }}>
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECE7DC" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Projects")}>
          <button className="font-sans text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#E8A33C", border: "1px solid #E8A33C33" }}>
            ← Back to Projects
          </button>
        </Link>
      </div>
    );
  }

  const projectCompleted = (p) => {
    const pp = allProgress.filter((x) => x.project_id === p.id);
    return p.lessons_count ? pp.length >= p.lessons_count : false;
  };
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
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center" style={{ background: "#15130E" }}>
        <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#E0B341" }}>
          Module Locked
        </div>
        <h1
          style={{ fontFamily: font.display, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.15, maxWidth: "32rem" }}
        >
          Finish the Foundations first.
        </h1>
        <p className="font-display text-base" style={{ color: "#A8A092", maxWidth: "32rem" }}>
          “{project.title}” builds on the beginner modules. Complete most of the
          Foundations track and this unlocks automatically.
        </p>
        <Link to={createPageUrl("Projects")}>
          <button className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 mt-2" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
            ← Back to Foundations
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#15130E", minHeight: "100vh" }}>
      <XPToastContainer />
      <BadgeUnlock completedCount={completedCount} />
      <LessonCompletionCelebration
        show={showCelebration}
        lessonTitle={activeLesson?.title || ""}
        xpEarned={activeLesson?.xp_reward || 10}
        onClose={() => { setShowCelebration(false); showXPToast("Lesson Complete!", activeLesson?.xp_reward || 10, ""); }}
      />
      <div
        className="relative pt-20"
        style={{ borderBottom: "1px solid #262219" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />

        <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10">
          <Link
            to={createPageUrl("Projects")}
            className="font-sans text-xs tracking-widest uppercase mb-6 inline-block transition-colors duration-150"
            style={{ color: "#ECE7DC" }}
            onMouseEnter={e => e.currentTarget.style.color = "#E8A33C"}
            onMouseLeave={e => e.currentTarget.style.color = "#3A352D"}
          >
            ← Projects
          </Link>

          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span
                  className="font-sans font-bold"
                  style={{ fontSize: "4rem", lineHeight: 1, color: "#ECE7DC", letterSpacing: "-0.05em" }}
                >
                  {DIFFICULTY_NUM[project.difficulty] || "00"}
                </span>
                <div>
                  <div className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#E8A33C" }}>
                    {project.difficulty} · {project.category?.replace("_", "/")}
                  </div>
                  <h1
                    style={{ fontFamily: font.display, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: 0 }}
                  >
                    {project.title}
                  </h1>
                </div>
              </div>
              <p className="font-display text-sm leading-relaxed" style={{ color: "#BBB3A4", fontWeight: 400, maxWidth: "55ch" }}>
                {project.description}
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div className="font-sans text-xs tracking-widest uppercase" style={{ color: "#ECE7DC" }}>
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
                        ? "#E8A33C"
                        : l.id === activeLessonId
                        ? "#8F8779"
                        : "#262219",
                      border: l.id === activeLessonId ? "1px solid #8F8779" : "1px solid transparent",
                    }}
                  />
                ))}
              </div>
              <div className="font-sans text-xs" style={{ color: "#ECE7DC" }}>
                {project.estimated_time ? `~${project.estimated_time}min` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="mx-auto px-8 lg:px-16 py-10 transition-all duration-300"
        style={{ maxWidth: focusMode ? "920px" : "80rem" }}
      >
        <div
          className="grid gap-10 transition-all duration-300"
          style={{ gridTemplateColumns: focusMode ? "1fr" : undefined }}
          data-focus={focusMode ? "1" : "0"}
        >
          {!focusMode && (
          <div className="relative" style={{ width: "220px" }}>
            <div
              className="sticky top-20"
              style={{ borderLeft: "1px solid #262219", paddingLeft: "1.25rem" }}
            >
              <StreakBadge completedCount={completedCount} />

              <div
                className="font-sans text-xs tracking-widest uppercase mb-5"
                style={{ color: "#BBB3A4" }}
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
                      style={{ borderBottom: "1px solid #1C1A14" }}
                    >
                      {active && (
                        <div
                          className="absolute left-[-1.25rem] top-0 bottom-0 w-px"
                          style={{ background: "#E8A33C" }}
                        />
                      )}
                      <div className="flex items-start gap-3">
                        <span
                          className="font-sans text-xs flex-shrink-0 mt-0.5"
                          style={{ color: completed ? "#E8A33C" : active ? "#A39B8C" : "#5A554B" }}
                        >
                          {completed ? "✓" : String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span
                            className="font-display text-xs leading-snug transition-colors duration-150 block"
                            style={{
                              color: active ? "#ECE7DC" : completed ? "#8F8779" : "#A39B8C",
                              fontWeight: active ? 600 : 400,
                            }}
                          >
                            {lesson.title}
                          </span>
                          <span className="font-sans" style={{ fontSize: "9px", color: completed ? "#E8A33C" : "#6E665A" }}>
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

          <div>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              {showNavHint ? (
                <button
                  onClick={dismissNavHint}
                  className="font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                  style={{ color: "#BBB3A4", border: "1px solid #262219", background: "#131009" }}
                  title="Dismiss hint"
                >
                  ← → to navigate lessons
                </button>
              ) : <span />}
              <button
                onClick={toggleFocusMode}
                className="font-sans text-xs tracking-widest uppercase px-3 py-1.5 transition-all duration-150"
                style={{
                  color: focusMode ? "#E8A33C" : "#6E665A",
                  border: `1px solid ${focusMode ? "#E8A33C33" : "#262219"}`,
                  background: focusMode ? "#E8A33C10" : "#131009",
                }}
                title="Toggle focus mode"
              >
                {focusMode ? "◇ Exit Focus" : "◆ Focus Mode"}
              </button>
            </div>

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
                  {activeLessonIndex === 0 && <ProjectBrief brief={project?.brief} />}

                  <div style={{ marginBottom: "8px" }}>
                    <div className="font-sans" style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: trace.lime, marginBottom: "6px" }}>
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
                          className="font-sans"
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
                      <div className="font-sans" style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${trace.border}`, color: trace.ok, fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
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

                  <div style={{ marginTop: "8px" }}>
                  <LessonEnhancements lesson={activeLesson} />

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

                  <LessonChallenge lesson={activeLesson} />
                  </div>
                  </div>

                  <CodeEditor
                    code={code}
                    onChange={setCode}
                    onRun={handleRun}
                    output={output}
                    isRunning={isRunning}
                    filename={`lesson_${String(activeLessonIndex + 1).padStart(2, "0")}.py`}
                    lessonTitle={activeLesson.title}
                    solutionCode={activeLesson.solution_code || ""}
                    enableAIAnalysis={!!activeLesson.solution_code}
                  />

                  {output && activeLesson?.expected_output && (
                    <OutputComparison
                      actualOutput={output}
                      expectedOutput={activeLesson.expected_output}
                    />
                  )}

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

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {user?.role === "admin" && (
                      <>
                        <button
                          onClick={handleExpandLesson}
                          disabled={expandingLesson}
                          className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                          style={{
                            color: "#C2643C", border: "1px solid #C2643C33",
                            background: "#C2643C10", opacity: expandingLesson ? 0.5 : 1,
                          }}
                        >
                          {expandingLesson ? " Expanding..." : " Expand with AI"}
                        </button>
                        <button
                          onClick={handleEnrichLesson}
                          disabled={enrichingLesson}
                          className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
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
                        className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                        style={{
                          color: showHints ? "#E8A33C" : "#4A453C",
                          border: `1px solid ${showHints ? "#E8A33C33" : "#262219"}`,
                          background: showHints ? "#E8A33C10" : "transparent",
                        }}
                      >
                        {showHints ? "— Hints" : "+ Hints"}
                      </button>
                    )}
                    {activeLesson.solution_code && (
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="font-sans text-xs tracking-widest uppercase px-4 py-2.5 transition-all duration-150"
                        style={{
                          color: showSolution ? "#8F8779" : "#3A352D",
                          border: `1px solid ${showSolution ? "#34302A" : "#262219"}`,
                        }}
                      >
                        {showSolution ? "— Solution" : "Show Solution"}
                      </button>
                    )}

                    <div className="flex-1" />

                    {user && !isCompleted(activeLesson.id) && (
                      <button
                        onClick={handleComplete}
                        className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-150"
                        style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "#E8A33C20";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "#E8A33C10";
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        ✓ Mark Complete
                      </button>
                    )}
                    {activeLessonIndex < lessons.length - 1 && (
                      <button
                        onClick={goToNextLesson}
                        className="font-sans text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-150"
                        style={{ color: "#15130E", background: "#E8A33C", border: "1px solid #E8A33C", fontWeight: 700 }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-1px)";
                          e.currentTarget.style.boxShadow = "0 6px 24px rgba(232,163,60,0.2)";
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

                  <AnimatePresence>
                    {showHints && activeLesson.hints && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div style={{ border: "1px solid #262219", background: "#131009" }}>
                          <div className="px-5 py-3" style={{ borderBottom: "1px solid #262219" }}>
                            <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#E8A33C" }}>
                              Hints
                            </span>
                          </div>
                          <div className="px-5 py-4 space-y-3">
                            {activeLesson.hints.map((hint, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: "#ECE7DC" }}>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-display text-sm leading-relaxed" style={{ color: "#BBB3A4", fontWeight: 400 }}>
                                  {hint}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showSolution && activeLesson.solution_code && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div style={{ border: "1px solid #262219", background: "#131009" }}>
                          <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid #262219" }}>
                            <span className="font-sans text-xs tracking-widest uppercase" style={{ color: "#BBB3A4" }}>
                              Solution
                            </span>
                            <span className="font-sans text-xs px-2 py-0.5" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
                              JS
                            </span>
                          </div>
                          <pre
                            className="font-mono overflow-x-auto p-5"
                            style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#C9C1B2" }}
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