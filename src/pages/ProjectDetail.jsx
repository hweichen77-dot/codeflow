import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";
import LessonExplanation from "../components/lesson/LessonExplanation";
import LessonQuiz from "../components/lesson/LessonQuiz";
import LessonChallenge from "../components/lesson/LessonChallenge";
import { runCodeInSandbox } from "../lib/codeRunner";

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
  const lessonStartTime = useRef(Date.now());
  const wrongAttempts = useRef(0);

  const queryClient = useQueryClient();

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: project, isLoading: loadingProject } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.filter({ id: projectId });
      return projects[0];
    },
    enabled: !!projectId,
  });

  const { data: lessons = [], isLoading: loadingLessons } = useQuery({
    queryKey: ["lessons", projectId],
    queryFn: () => base44.entities.Lesson.filter({ project_id: projectId }, "order"),
    enabled: !!projectId,
  });

  const { data: progress = [] } = useQuery({
    queryKey: ["user-progress", projectId, user?.email],
    queryFn: () => base44.entities.UserProgress.filter({ user_email: user.email, project_id: projectId }),
    enabled: !!user && !!projectId,
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
        await base44.entities.UserProgress.update(existing.id, progressData);
      } else {
        await base44.entities.UserProgress.create({
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
    if (user && activeLesson) completeMutation.mutate(activeLesson.id);
  };

  const goToNextLesson = () => {
    if (activeLessonIndex < lessons.length - 1) {
      setActiveLessonId(lessons[activeLessonIndex + 1].id);
    }
  };

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;

  if (loadingProject || loadingLessons) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0a" }}
      >
        <div className="font-mono text-xs tracking-widest uppercase animate-pulse" style={{ color: "#333" }}>
          Loading module...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#444" }}>404 — NOT FOUND</div>
        <Link to={createPageUrl("Projects")}>
          <button className="font-mono text-xs tracking-widest uppercase px-5 py-2" style={{ color: "#b8ff00", border: "1px solid #b8ff0033" }}>
            ← Back to Projects
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
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
            style={{ color: "#333" }}
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
                  style={{ fontSize: "4rem", lineHeight: 1, color: "#1a1a1a", letterSpacing: "-0.05em" }}
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
              <p className="font-display text-sm leading-relaxed" style={{ color: "#555", fontWeight: 400, maxWidth: "55ch" }}>
                {project.description}
              </p>
            </div>

            {/* Progress indicator — dot trail */}
            <div className="flex flex-col items-end gap-3">
              <div className="font-mono text-xs tracking-widest uppercase" style={{ color: "#333" }}>
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
              <div className="font-mono text-xs" style={{ color: "#222" }}>
                {project.estimated_time ? `~${project.estimated_time}min` : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto px-8 lg:px-16 py-10">
        <div className="grid lg:grid-cols-[220px_1fr] gap-10">

          {/* Sidebar — notebook spine */}
          <div className="relative">
            <div
              className="sticky top-20"
              style={{ borderLeft: "1px solid #1a1a1a", paddingLeft: "1.25rem" }}
            >
              {/* Vertical label */}
              <div
                className="font-mono text-xs tracking-widest uppercase mb-5"
                style={{ color: "#2a2a2a" }}
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
                          style={{ color: completed ? "#b8ff00" : active ? "#555" : "#222" }}
                        >
                          {completed ? "✓" : String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-display text-xs leading-snug transition-colors duration-150"
                          style={{
                            color: active ? "#e8e8e8" : completed ? "#666" : "#333",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          {lesson.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main content */}
          <div>
            <AnimatePresence mode="wait">
              {activeLesson && (
                <motion.div
                  key={activeLesson.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-8"
                >
                  {/* Lesson header */}
                  <div style={{ borderBottom: "1px solid #1a1a1a", paddingBottom: "2rem" }}>
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className="font-mono font-bold"
                        style={{ fontSize: "3rem", lineHeight: 1, color: "#141414", letterSpacing: "-0.05em" }}
                      >
                        {String(activeLessonIndex + 1).padStart(2, "0")}
                      </span>
                      <div>
                        {activeLesson.concept && (
                          <div
                            className="font-mono text-xs tracking-widest uppercase mb-1"
                            style={{ color: "#b8ff00" }}
                          >
                            {activeLesson.concept}
                          </div>
                        )}
                        <h2
                          className="font-display font-black leading-tight"
                          style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)", color: "#e8e8e8", letterSpacing: "-0.03em" }}
                        >
                          {activeLesson.title}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Explanation — document style */}
                  <div
                    className="rounded px-8 py-8"
                    style={{ background: "#ffffff", border: "1px solid #e5e5e5" }}
                  >
                    <LessonExplanation
                      explanation={activeLesson.explanation || ""}
                      concept={null}
                    />
                  </div>

                  {/* Quiz section */}
                  {activeLesson.quiz_questions?.length > 0 && (
                    <LessonQuiz questions={activeLesson.quiz_questions} />
                  )}

                  {/* Coding challenge section */}
                  <LessonChallenge lesson={activeLesson} />

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

                  {/* Action row */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
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
                                <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#333" }}>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-display text-sm leading-relaxed" style={{ color: "#666", fontWeight: 400 }}>
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
                            <span className="font-mono text-xs tracking-widest uppercase" style={{ color: "#555" }}>
                              Solution
                            </span>
                            <span className="font-mono text-xs px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                              JS
                            </span>
                          </div>
                          <pre
                            className="font-mono overflow-x-auto p-5"
                            style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#888" }}
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