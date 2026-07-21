import React, { useState, useEffect, useRef } from "react";
import "@/styles/landing.css";
import { api } from "@/api/apiClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { createPageUrl } from "../utils";
import { resolveLessonSlugs, getLessonPath } from "@/content";
import useDocumentHead from "@/lib/useDocumentHead";
import { touchStreak } from "@/lib/progressStats";
import { recordActivity } from "@/lib/retention";
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
import { Stagger, StaggerItem } from "@/lib/motion";

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

  const saveToPortfolioIfFinished = async (lessonId) => {
    if (!project || project.kind !== "product" || !user) return;
    const doneIds = new Set(progress.filter((p) => p.completed).map((p) => p.lesson_id));
    doneIds.add(lessonId);
    const total = project.lessons_count || lessons.length;
    if (doneIds.size < total) return;
    const existing = await api.entities.CapstoneSubmission.filter({ user_email: user.email, project_id: projectId });
    if (existing && existing.length) return;
    await api.entities.CapstoneSubmission.create({
      user_email: user.email,
      project_id: projectId,
      project_title: project.title,
      description: project.description,
      is_public: false,
    });
    try { track("project_complete", { project_id: projectId }); } catch {  }
  };

  const completeMutation = useMutation({
    mutationFn: async (lessonId) => {
      const timeSpent = Math.round((Date.now() - lessonStartTime.current) / 1000);
      const existing = progress.find((p) => p.lesson_id === lessonId);
      const progressData = {
        completed: true,
        user_code: code,
        points_earned: activeLesson?.xp_reward || 10,
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
        try { recordActivity('lesson'); } catch {  }
        try { touchStreak(); } catch {  }
        try { track('lesson_complete', { lesson_id: lessonId, project_id: projectId, time_spent_seconds: timeSpent }); } catch {  }
        try { await saveToPortfolioIfFinished(lessonId); } catch {  }
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [activeLessonId]);

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

  const [splitPct, setSplitPct] = useState(52);
  const splitRef = useRef(null);
  const dragging = useRef(false);
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current || !splitRef.current) return;
      const r = splitRef.current.getBoundingClientRect();
      const pct = ((e.clientX - r.left) / r.width) * 100;
      setSplitPct(Math.min(66, Math.max(34, pct)));
    };
    const onUp = () => { dragging.current = false; document.body.style.userSelect = ""; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, []);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-base)" }}>
        <div className="u-mono t-muted text-xs animate-pulse">Loading module…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-base)" }}>
        <div className="u-mono t-body text-xs">404 · not found</div>
        <Link to={createPageUrl("Projects")}>
          <button className="u-mono text-xs px-5 py-2" style={{ color: "var(--accent)", border: "1px solid var(--accent)", borderRadius: 8 }}>
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
  const isAiTrack = (project.track || "ai") === "ai" && project.kind !== "product";
  const beginnerProjects = allProjects.filter(
    (p) => p.difficulty === "beginner" && (p.track || "ai") === "ai" && p.kind !== "product"
  );
  const moduleGated = isAiTrack && isModuleGated({
    finished: foundationsAreFinished(beginnerProjects, projectCompleted),
    done: projectCompleted(project),
    difficulty: project.difficulty,
  });

  if (moduleGated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-5 px-8 text-center" style={{ background: "var(--bg-base)" }}>
        <div className="u-mono text-xs" style={{ color: "var(--accent)" }}>Module locked</div>
        <h1 className="u-display t-strong" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", maxWidth: "32rem" }}>
          Finish the Foundations first.
        </h1>
        <p className="t-body" style={{ maxWidth: "32rem" }}>
          "{project.title}" builds on the beginner modules. Complete most of the
          Foundations track and this unlocks automatically.
        </p>
        <Link to={createPageUrl("Projects")}>
          <button className="u-mono text-xs px-5 py-2.5 mt-2" style={{ color: "var(--accent)", border: "1px solid var(--accent)", background: "rgba(94,210,156,0.10)", borderRadius: 8 }}>
            ← Back to Foundations
          </button>
        </Link>
      </div>
    );
  }

  const handsOn = !!activeLesson && !activeLesson.illustrative && (activeLesson.starter_code || activeLesson.solution_code);
  const hasChallenge = !!activeLesson && !activeLesson.illustrative && !!activeLesson.challenge_title;
  const showSplit = handsOn || hasChallenge;

  const readingBlock = activeLesson && (
    <>
      {activeLessonIndex === 0 && <ProjectBrief brief={project?.brief} />}

      <div style={{ marginBottom: "8px" }}>
        <div className="u-mono" style={{ fontSize: "0.6875rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: trace.lime, marginBottom: "6px" }}>
          § {String(activeLessonIndex + 1).padStart(2, "0")} &nbsp;▸&nbsp; {activeLesson.xp_reward || 10} XP
        </div>
        <h2 className="u-display t-strong" style={{ fontSize: "1.8rem", margin: 0, lineHeight: 1.15 }}>
          {activeLesson.title}
        </h2>
      </div>

      <div style={{ borderTop: `1px solid ${trace.border}`, paddingTop: "28px" }}>
        {activeLesson.concept && (
          <h3 className="t-strong" style={{ fontFamily: trace.serif, fontSize: "1.15rem", fontWeight: 600, margin: "0 0 16px" }}>
            {activeLesson.concept}
          </h3>
        )}

        <RichLessonPanel lesson={activeLesson} />

        {!readingDone && (
          <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${trace.border}` }}>
            <button
              onClick={() => { setReadingDone(true); setEarnedPoints(p => p + 2); showXPToast("Reading complete!", 2, ""); }}
              className="u-mono"
              style={{ background: "transparent", color: trace.lime, border: `1px solid ${trace.lime}55`, borderRadius: "8px", padding: "10px 28px", fontSize: "0.8125rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}
            >
              ✓ mark read (+2 XP)
            </button>
          </div>
        )}
        {readingDone && (
          <div className="u-mono" style={{ textAlign: "center", marginTop: "24px", paddingTop: "20px", borderTop: `1px solid ${trace.border}`, color: trace.ok, fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
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
          {!showSplit && <LessonChallenge lesson={activeLesson} />}
        </div>
      </div>
    </>
  );

  const editorBlock = activeLesson && handsOn && (
    <>
      <CodeEditor
        fill
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
        <OutputComparison actualOutput={output} expectedOutput={activeLesson.expected_output} />
      )}
    </>
  );

  const rightBlock = handsOn ? editorBlock : (hasChallenge ? <LessonChallenge lesson={activeLesson} fill /> : null);

  const footerBlock = activeLesson && (
    <>
      <LessonPointsSummary
        lessonTitle={activeLesson.title}
        sectionNumber={activeLessonIndex + 1}
        totalPoints={activeLesson.xp_reward || 10}
        earnedPoints={earnedPoints}
        readingComplete={readingDone}
        quizComplete={quizDone}
        participationComplete={participationDone}
        challengeComplete={challengeDone}
        showParticipation={!!(activeLesson.participation_activities?.length)}
        showQuiz={!!(activeLesson.quiz_questions?.length)}
        showChallenge={!!activeLesson.challenge_title && !activeLesson.illustrative}
        nextLessonTitle={activeLessonIndex < lessons.length - 1 ? lessons[activeLessonIndex + 1].title : null}
        onNextLesson={goToNextLesson}
      />

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {user?.role === "admin" && (
          <>
            <button
              onClick={handleExpandLesson}
              disabled={expandingLesson}
              className="u-mono text-xs px-4 py-2.5 transition-all duration-150"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: 8, opacity: expandingLesson ? 0.5 : 1 }}
            >
              {expandingLesson ? "Expanding…" : "Expand with AI"}
            </button>
            <button
              onClick={handleEnrichLesson}
              disabled={enrichingLesson}
              className="u-mono text-xs px-4 py-2.5 transition-all duration-150"
              style={{ color: "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: 8, opacity: enrichingLesson ? 0.5 : 1 }}
            >
              {enrichingLesson ? "Enriching…" : "Enrich with AI"}
            </button>
          </>
        )}
        {activeLesson.hints && activeLesson.hints.length > 0 && (
          <button
            onClick={() => setShowHints(!showHints)}
            className="u-mono text-xs px-4 py-2.5 transition-all duration-150"
            style={{
              color: showHints ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${showHints ? "var(--accent)" : "var(--border-subtle)"}`,
              background: showHints ? "rgba(94,210,156,0.10)" : "transparent",
              borderRadius: 8,
            }}
          >
            {showHints ? "− Hints" : "+ Hints"}
          </button>
        )}
        {activeLesson.solution_code && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="u-mono text-xs px-4 py-2.5 transition-all duration-150"
            style={{ color: showSolution ? "var(--text-primary)" : "var(--text-muted)", border: "1px solid var(--border-subtle)", borderRadius: 8 }}
          >
            {showSolution ? "− Solution" : "Show Solution"}
          </button>
        )}

        <div className="flex-1" />

        {user && !isCompleted(activeLesson.id) && (
          <button
            onClick={handleComplete}
            className="u-mono text-xs px-5 py-2.5 transition-all duration-150"
            style={{ color: "var(--accent)", border: "1px solid var(--accent)", background: "rgba(94,210,156,0.10)", borderRadius: 8 }}
          >
            ✓ Mark Complete
          </button>
        )}
        {activeLessonIndex < lessons.length - 1 && (
          <button
            onClick={goToNextLesson}
            className="u-mono text-xs px-5 py-2.5 transition-all duration-150"
            style={{ color: "var(--bg-base)", background: "var(--accent)", border: "1px solid var(--accent)", fontWeight: 700, borderRadius: 8 }}
          >
            Next →
          </button>
        )}
      </div>

      <AnimatePresence>
        {showHints && activeLesson.hints && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-raised)", borderRadius: 12, overflow: "hidden", marginTop: 12 }}>
              <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="u-mono text-xs" style={{ color: "var(--accent)" }}>Hints</span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {activeLesson.hints.map((hint, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="u-mono text-xs flex-shrink-0 mt-0.5 t-muted">{String(i + 1).padStart(2, "0")}</span>
                    <p className="t-body text-sm leading-relaxed">{hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSolution && activeLesson.solution_code && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div style={{ border: "1px solid var(--border-subtle)", background: "var(--bg-raised)", borderRadius: 12, overflow: "hidden", marginTop: 12 }}>
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <span className="u-mono text-xs t-body">Solution</span>
              </div>
              <pre className="u-mono overflow-x-auto p-5 t-body" style={{ fontSize: "0.75rem", lineHeight: "1.7" }}>
                {activeLesson.solution_code}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <XPToastContainer />
      <BadgeUnlock completedCount={completedCount} />
      <LessonCompletionCelebration
        show={showCelebration}
        lessonTitle={activeLesson?.title || ""}
        xpEarned={activeLesson?.xp_reward || 10}
        onClose={() => { setShowCelebration(false); showXPToast("Lesson Complete!", activeLesson?.xp_reward || 10, ""); }}
      />

      <div className="relative" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-8">
          <Link
            to={createPageUrl("Projects")}
            className="u-mono text-xs mb-5 inline-block transition-colors duration-150 t-muted"
          >
            ← Projects
          </Link>

          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-end">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <span className="u-display t-strong" style={{ fontSize: "3rem", lineHeight: 1, letterSpacing: "-0.05em" }}>
                  {DIFFICULTY_NUM[project.difficulty] || "00"}
                </span>
                <div>
                  <span className="u-mono t-muted" style={{ fontSize: 12 }}>
                    {project.difficulty} · {project.category?.replace("_", "/")}
                  </span>
                  <h1 className="u-display t-strong" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.5rem)", margin: "2px 0 0" }}>
                    {project.title}
                  </h1>
                </div>
              </div>
              <p className="t-body" style={{ maxWidth: "55ch", lineHeight: 1.55 }}>{project.description}</p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-2.5">
              <div className="u-mono text-xs t-muted">{completedCount}/{totalLessons} complete</div>
              <div className="flex gap-1" style={{ maxWidth: 260, flexWrap: "wrap" }}>
                {lessons.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveLessonId(l.id)}
                    title={`Lesson ${i + 1}: ${l.title}`}
                    aria-label={`Go to lesson ${i + 1}`}
                    className="transition-all duration-200"
                    style={{
                      width: 22, height: 4, borderRadius: 2,
                      background: isCompleted(l.id) ? "var(--accent)" : l.id === activeLessonId ? "var(--text-muted)" : "var(--border-subtle)",
                    }}
                  />
                ))}
              </div>
              {project.estimated_time ? <div className="u-mono text-xs t-muted">~{project.estimated_time}min</div> : null}
            </div>
          </div>
        </div>
      </div>

      <div className={`px-6 sm:px-10 lg:px-16 py-8 ${focusMode ? "mx-auto" : ""}`} style={{ maxWidth: focusMode ? 960 : "none" }}>
        <div className={`grid gap-10 ${focusMode ? "" : "lg:grid-cols-[220px_minmax(0,1fr)]"}`} style={{ gridTemplateColumns: focusMode ? "1fr" : undefined }}>
          {!focusMode && (
            <aside className="relative hidden lg:block" style={{ width: 220 }} aria-label="Lessons in this module">
              <div className="sticky top-16" style={{ borderLeft: "1px solid var(--border-subtle)", paddingLeft: "1.25rem" }}>
                <StreakBadge completedCount={completedCount} />
                <div className="u-mono t-muted mb-4" style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>Lessons</div>
                <Stagger as="div" className="space-y-0">
                  {lessons.map((lesson, i) => {
                    const completed = isCompleted(lesson.id);
                    const active = lesson.id === activeLessonId;
                    return (
                      <StaggerItem key={lesson.id} as="div">
                        <button
                          onClick={() => setActiveLessonId(lesson.id)}
                          className="w-full text-left py-3 transition-all duration-150 relative"
                          style={{ borderBottom: "1px solid var(--border-subtle)" }}
                        >
                          {active && <div className="absolute left-[-1.25rem] top-0 bottom-0 w-px" style={{ background: "var(--accent)" }} />}
                          <div className="flex items-start gap-3">
                            <span className="u-mono text-xs flex-shrink-0 mt-0.5" style={{ color: completed ? "var(--accent)" : active ? "var(--text-primary)" : "var(--text-muted)" }}>
                              {completed ? "✓" : String(i + 1).padStart(2, "0")}
                            </span>
                            <div>
                              <span className="text-xs leading-snug block" style={{ color: active ? "var(--text-strong)" : "var(--text-muted)", fontWeight: active ? 600 : 400 }}>
                                {lesson.title}
                              </span>
                              <span className="u-mono" style={{ fontSize: 9, color: completed ? "var(--accent)" : "var(--text-muted)" }}>
                                {lesson.xp_reward || 10} pts
                              </span>
                            </div>
                          </div>
                        </button>
                      </StaggerItem>
                    );
                  })}
                </Stagger>
              </div>
            </aside>
          )}

          <div>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              {showNavHint ? (
                <button onClick={dismissNavHint} className="u-mono text-xs px-3 py-1.5" style={{ color: "var(--text-muted)", border: "1px solid var(--border-subtle)", background: "var(--bg-raised)", borderRadius: 8 }} title="Dismiss hint">
                  ← → to navigate lessons
                </button>
              ) : <span />}
              <button
                onClick={toggleFocusMode}
                className="u-mono text-xs px-3 py-1.5"
                style={{ color: focusMode ? "var(--accent)" : "var(--text-muted)", border: `1px solid ${focusMode ? "var(--accent)" : "var(--border-subtle)"}`, background: focusMode ? "rgba(94,210,156,0.10)" : "var(--bg-raised)", borderRadius: 8 }}
                title="Toggle focus mode"
              >
                {focusMode ? "◇ Exit Focus" : "◆ Focus Mode"}
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
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
                  className="reader-surface"
                >
                  {showSplit ? (
                    <>
                      <div ref={splitRef} className="hidden lg:flex items-start gap-0">
                        <section role="region" aria-label="Lesson" className="space-y-8" style={{ width: `${splitPct}%`, minWidth: 0 }}>
                          {readingBlock}
                          {footerBlock}
                        </section>
                        <div
                          role="separator"
                          aria-orientation="vertical"
                          aria-label="Resize panes"
                          onPointerDown={() => { dragging.current = true; document.body.style.userSelect = "none"; }}
                          className="group self-stretch flex items-center justify-center cursor-col-resize"
                          style={{ width: 18, flexShrink: 0, alignSelf: "stretch" }}
                        >
                          <div className="h-12 w-1 rounded-full bg-white/20 transition-colors group-hover:bg-[#5ED29C]" />
                        </div>
                        <section role="region" aria-label="Code editor" className="flex flex-col" style={{ flex: 1, minWidth: 0, position: "sticky", top: 64, height: "calc(100vh - 96px)" }}>
                          {rightBlock}
                        </section>
                      </div>
                      <div className="lg:hidden space-y-8">
                        <section role="region" aria-label="Lesson" className="space-y-8">{readingBlock}</section>
                        <section role="region" aria-label="Code editor" className="space-y-6">{rightBlock}</section>
                        {footerBlock}
                      </div>
                    </>
                  ) : (
                    <section role="region" aria-label="Lesson" className="measure mx-auto space-y-8" style={{ maxWidth: 720 }}>
                      {readingBlock}
                      {footerBlock}
                    </section>
                  )}
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
