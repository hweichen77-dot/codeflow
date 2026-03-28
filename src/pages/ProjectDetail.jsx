import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ArrowLeft, Lightbulb, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CodeEditor from "../components/editor/CodeEditor";
import AIChatbot from "../components/chat/AIChatbot";
import LessonExplanation from "../components/lesson/LessonExplanation";

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
    queryFn: () =>
      base44.entities.UserProgress.filter({ user_email: user.email, project_id: projectId }),
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
    }
  }, [activeLessonId, activeLesson?.id]);

  const isCompleted = (lessonId) => progress.some((p) => p.lesson_id === lessonId && p.completed);

  const completeMutation = useMutation({
    mutationFn: async (lessonId) => {
      const existing = progress.find((p) => p.lesson_id === lessonId);
      if (existing) {
        await base44.entities.UserProgress.update(existing.id, {
          completed: true, user_code: code, completed_date: new Date().toISOString(),
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: user.email, lesson_id: lessonId, project_id: projectId,
          completed: true, user_code: code, completed_date: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user-progress", projectId] }),
  });

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a JavaScript code executor simulator. Execute the following JavaScript code and return ONLY the console output. If there are errors, show the error message. Do not explain anything, just show what would appear in the console.

Code:
\`\`\`javascript
${code}
\`\`\`

Expected output format: Just the raw console output, one line per console.log statement. If there's an error, prefix with "Error: "`,
      });
      setOutput(result || "No output");
    } catch {
      setOutput("Error: Could not run code. Please try again.");
    }
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="font-mono text-sm" style={{ color: "#333" }}>
          <span className="animate-pulse">loading module</span>
          <span className="cursor-blink">_</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="text-center">
          <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#333" }}>
            404
          </div>
          <Link to={createPageUrl("Projects")}>
            <button
              className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all"
              style={{ border: "1px solid #1e1e1e", color: "#555" }}
            >
              ← Back to Projects
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-20 flex items-center justify-between px-8 lg:px-16 py-4"
        style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-6">
          <Link
            to={createPageUrl("Projects")}
            className="font-mono text-xs tracking-widest uppercase transition-all duration-150"
            style={{ color: "#333" }}
            onMouseEnter={e => e.currentTarget.style.color = "#888"}
            onMouseLeave={e => e.currentTarget.style.color = "#333"}
          >
            ← Projects
          </Link>
          <div className="w-px h-4" style={{ background: "#1e1e1e" }} />
          <span className="font-display font-bold text-sm" style={{ color: "#666", letterSpacing: "-0.01em" }}>
            {project.title}
          </span>
        </div>

        {/* Progress indicator — dot trail */}
        <div className="hidden md:flex items-center gap-2">
          {lessons.map((l, i) => {
            const done = isCompleted(l.id);
            const active = l.id === activeLessonId;
            return (
              <button
                key={l.id}
                onClick={() => setActiveLessonId(l.id)}
                className="transition-all duration-150"
                title={l.title}
                style={{
                  width: active ? "1.5rem" : "0.4rem",
                  height: "0.4rem",
                  background: active ? "#b8ff00" : done ? "#b8ff0066" : "#1e1e1e",
                  boxShadow: active ? "0 0 8px rgba(184,255,0,0.4)" : "none",
                }}
              />
            );
          })}
          <span className="font-mono text-xs ml-3" style={{ color: "#333" }}>
            {completedCount}/{totalLessons}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar — lesson list */}
        <div
          className="hidden lg:flex flex-col flex-shrink-0"
          style={{
            width: "280px",
            borderRight: "1px solid #1a1a1a",
            background: "#080808",
            position: "sticky",
            top: "57px",
            height: "calc(100vh - 57px)",
            overflowY: "auto",
          }}
        >
          {/* Sidebar header */}
          <div
            className="px-6 py-5"
            style={{ borderBottom: "1px solid #1a1a1a" }}
          >
            <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#b8ff00" }}>
              Module
            </div>
            <div
              className="font-display font-bold text-sm leading-snug"
              style={{ color: "#888", letterSpacing: "-0.02em" }}
            >
              {project.title}
            </div>
          </div>

          {/* Lesson list */}
          <div className="flex-1 py-2">
            {lessons.map((lesson, i) => {
              const done = isCompleted(lesson.id);
              const active = lesson.id === activeLessonId;
              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className="w-full text-left px-6 py-4 transition-all duration-150 relative group"
                  style={{
                    background: active ? "#0d0d0d" : "transparent",
                    borderBottom: "1px solid #0f0f0f",
                  }}
                >
                  {active && (
                    <div
                      className="absolute left-0 top-0 bottom-0 w-px"
                      style={{ background: "#b8ff00" }}
                    />
                  )}
                  <div className="flex items-start gap-3">
                    {/* Number */}
                    <span
                      className="font-mono text-xs flex-shrink-0 mt-0.5"
                      style={{ color: active ? "#b8ff00" : done ? "#b8ff0044" : "#2a2a2a" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-display text-sm font-medium leading-snug truncate"
                        style={{
                          color: active ? "#e8e8e8" : done ? "#555" : "#444",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {lesson.title}
                      </div>
                      {lesson.concept && (
                        <div className="font-mono text-xs mt-1" style={{ color: "#2a2a2a" }}>
                          {lesson.concept}
                        </div>
                      )}
                    </div>
                    {done && (
                      <span
                        className="flex-shrink-0 w-1.5 h-1.5 mt-1.5"
                        style={{ background: "#b8ff0066" }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {activeLesson && (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Lesson header */}
                <div
                  className="px-8 lg:px-16 py-12"
                  style={{ borderBottom: "1px solid #1a1a1a" }}
                >
                  <div className="flex items-start gap-8 max-w-4xl">
                    {/* Big lesson number */}
                    <div
                      className="font-mono font-bold flex-shrink-0 leading-none"
                      style={{
                        fontSize: "5rem",
                        color: "#141414",
                        letterSpacing: "-0.05em",
                        lineHeight: 1,
                        marginTop: "-0.5rem",
                      }}
                    >
                      {String(activeLessonIndex + 1).padStart(2, "0")}
                    </div>
                    <div>
                      {activeLesson.concept && (
                        <div
                          className="font-mono text-xs tracking-widest uppercase mb-3"
                          style={{ color: "#b8ff00" }}
                        >
                          {activeLesson.concept}
                        </div>
                      )}
                      <h2
                        className="font-display font-black leading-none"
                        style={{
                          fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                          color: "#e8e8e8",
                          letterSpacing: "-0.03em",
                        }}
                      >
                        {activeLesson.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 lg:px-16 py-12 max-w-4xl">

                  {/* Lesson explanation */}
                  {activeLesson.explanation && (
                    <div className="mb-12">
                      <LessonExplanation
                        explanation={activeLesson.explanation}
                        concept={null}
                      />
                    </div>
                  )}

                  {/* Code editor */}
                  <div className="mb-8">
                    <div
                      className="font-mono text-xs tracking-widest uppercase mb-4"
                      style={{ color: "#333" }}
                    >
                      Your workspace
                    </div>
                    <CodeEditor
                      code={code}
                      onChange={setCode}
                      onRun={handleRun}
                      output={output}
                      isRunning={isRunning}
                      filename={`lesson_${String(activeLessonIndex + 1).padStart(2, "0")}.js`}
                    />
                  </div>

                  {/* Action row */}
                  <div className="flex flex-wrap items-center gap-3 mb-8">
                    {activeLesson.hints && activeLesson.hints.length > 0 && (
                      <button
                        onClick={() => setShowHints(!showHints)}
                        className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
                        style={{
                          border: `1px solid ${showHints ? "#b8ff0033" : "#1e1e1e"}`,
                          color: showHints ? "#b8ff00" : "#444",
                          background: showHints ? "#b8ff0010" : "transparent",
                        }}
                      >
                        {showHints ? "hide hints" : "/ hints"}
                      </button>
                    )}

                    {activeLesson.solution_code && (
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="font-mono text-xs tracking-widest uppercase px-5 py-3 transition-all duration-150"
                        style={{
                          border: `1px solid ${showSolution ? "#b8ff0033" : "#1e1e1e"}`,
                          color: showSolution ? "#b8ff00" : "#444",
                          background: showSolution ? "#b8ff0010" : "transparent",
                        }}
                      >
                        {showSolution ? "hide solution" : "/ solution"}
                      </button>
                    )}

                    <div className="flex-1" />

                    {user && !isCompleted(activeLesson.id) && (
                      <button
                        onClick={handleComplete}
                        className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-150"
                        style={{
                          border: "1px solid #1e1e1e",
                          color: "#666",
                          background: "transparent",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = "#b8ff0033";
                          e.currentTarget.style.color = "#b8ff00";
                          e.currentTarget.style.background = "#b8ff0010";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = "#1e1e1e";
                          e.currentTarget.style.color = "#666";
                          e.currentTarget.style.background = "transparent";
                        }}
                      >
                        ✓ mark complete
                      </button>
                    )}

                    {isCompleted(activeLesson.id) && (
                      <span className="font-mono text-xs tracking-widest uppercase px-4 py-2"
                        style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                        ✓ complete
                      </span>
                    )}

                    {activeLessonIndex < lessons.length - 1 && (
                      <button
                        onClick={goToNextLesson}
                        className="font-mono text-xs tracking-widest uppercase px-6 py-3 transition-all duration-150"
                        style={{
                          background: "#b8ff00",
                          color: "#0a0a0a",
                          border: "1px solid #b8ff00",
                          fontWeight: 700,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.boxShadow = "0 0 20px rgba(184,255,0,0.2)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.boxShadow = "";
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        Next lesson →
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
                        className="mb-6 overflow-hidden"
                      >
                        <div style={{ border: "1px solid #1e1e1e", borderLeft: "2px solid #b8ff00" }}>
                          <div
                            className="px-6 py-3 font-mono text-xs tracking-widest uppercase"
                            style={{ borderBottom: "1px solid #1a1a1a", color: "#b8ff00", background: "#0d0d0d" }}
                          >
                            hints
                          </div>
                          <div className="px-6 py-5 space-y-3">
                            {activeLesson.hints.map((hint, i) => (
                              <div key={i} className="flex gap-4">
                                <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#333" }}>
                                  {String(i + 1).padStart(2, "0")}
                                </span>
                                <p className="font-display text-sm" style={{ color: "#666", fontWeight: 400 }}>
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
                        className="mb-6 overflow-hidden"
                      >
                        <div style={{ border: "1px solid #1e1e1e" }}>
                          <div
                            className="px-5 py-3 flex items-center gap-3"
                            style={{ borderBottom: "1px solid #1a1a1a", background: "#0a0a0a" }}
                          >
                            <div className="flex gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                              <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                              <span className="w-2 h-2 rounded-full" style={{ background: "#2a2a2a" }} />
                            </div>
                            <span className="font-mono text-xs" style={{ color: "#333" }}>solution.js</span>
                          </div>
                          <pre
                            className="font-mono overflow-x-auto py-5 px-6"
                            style={{ fontSize: "0.75rem", lineHeight: "1.7", color: "#888", background: "#0d0d0d" }}
                          >
                            {activeLesson.solution_code}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Chatbot */}
      <AIChatbot
        context={activeLesson?.explanation || ""}
        lessonTitle={activeLesson?.title || project.title}
      />
    </div>
  );
}