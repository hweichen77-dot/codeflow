import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Lightbulb,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import CodeEditor from "../components/editor/CodeEditor";

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

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
      base44.entities.UserProgress.filter({
        user_email: user.email,
        project_id: projectId,
      }),
    enabled: !!user && !!projectId,
  });

  // Set first lesson as active
  useEffect(() => {
    if (lessons.length > 0 && !activeLessonId) {
      setActiveLessonId(lessons[0].id);
    }
  }, [lessons, activeLessonId]);

  // Load code when lesson changes
  const activeLesson = lessons.find((l) => l.id === activeLessonId);
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
          completed: true,
          user_code: code,
          completed_date: new Date().toISOString(),
        });
      } else {
        await base44.entities.UserProgress.create({
          user_email: user.email,
          lesson_id: lessonId,
          project_id: projectId,
          completed: true,
          user_code: code,
          completed_date: new Date().toISOString(),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-progress", projectId] });
    },
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
    if (user && activeLesson) {
      completeMutation.mutate(activeLesson.id);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = lessons.findIndex((l) => l.id === activeLessonId);
    if (currentIndex < lessons.length - 1) {
      setActiveLessonId(lessons[currentIndex + 1].id);
    }
  };

  if (loadingProject || loadingLessons) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-5 w-96 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[400px] rounded-2xl" />
          <div className="lg:col-span-3 space-y-4">
            <Skeleton className="h-[300px] rounded-2xl" />
            <Skeleton className="h-[300px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Project not found</p>
        <Link to={createPageUrl("Projects")}>
          <Button variant="link" className="text-[#6C5CE7] mt-2">
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;
  const progressPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back + Title */}
      <div className="mb-8">
        <Link
          to={createPageUrl("Projects")}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold">{project.title}</h1>
          <Badge className={`${difficultyColors[project.difficulty]} border w-fit`}>
            {project.difficulty}
          </Badge>
        </div>
        <p className="text-gray-500">{project.description}</p>
        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
          {project.estimated_time && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {project.estimated_time} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> {totalLessons} lessons
          </span>
          {completedCount > 0 && (
            <span className="flex items-center gap-1 text-[#6C5CE7] font-medium">
              <CheckCircle2 className="w-4 h-4" /> {completedCount}/{totalLessons} done
            </span>
          )}
        </div>
        {/* Progress */}
        {progressPercent > 0 && (
          <div className="mt-4 max-w-md">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Lesson List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Lessons
            </h3>
            <div className="space-y-1">
              {lessons.map((lesson, i) => {
                const completed = isCompleted(lesson.id);
                const active = lesson.id === activeLessonId;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all ${
                      active
                        ? "bg-[#6C5CE7]/8 text-[#6C5CE7] font-medium"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {completed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#00B894] flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    )}
                    <span className="truncate">{lesson.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {activeLesson && (
              <motion.div
                key={activeLesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Explanation */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-xl font-bold mb-1">{activeLesson.title}</h2>
                  {activeLesson.concept && (
                    <Badge variant="outline" className="mb-4 text-xs text-gray-500">
                      Concept: {activeLesson.concept}
                    </Badge>
                  )}
                  <div className="prose prose-gray prose-sm max-w-none">
                    <ReactMarkdown>{activeLesson.explanation || ""}</ReactMarkdown>
                  </div>
                </div>

                {/* Code Editor */}
                <CodeEditor
                  code={code}
                  onChange={setCode}
                  onRun={handleRun}
                  output={output}
                  isRunning={isRunning}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  {/* Hints */}
                  {activeLesson.hints && activeLesson.hints.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl text-gray-500"
                      onClick={() => setShowHints(!showHints)}
                    >
                      <Lightbulb className="w-4 h-4" />
                      {showHints ? "Hide Hints" : "Show Hints"}
                    </Button>
                  )}

                  {/* Solution Toggle */}
                  {activeLesson.solution_code && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl text-gray-500"
                      onClick={() => setShowSolution(!showSolution)}
                    >
                      {showSolution ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                      {showSolution ? "Hide Solution" : "Show Solution"}
                    </Button>
                  )}

                  <div className="flex-1" />

                  {/* Complete & Next */}
                  {user && !isCompleted(activeLesson.id) && (
                    <Button
                      size="sm"
                      className="bg-[#00B894] hover:bg-[#00A383] text-white rounded-xl gap-2"
                      onClick={handleComplete}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Complete
                    </Button>
                  )}
                  {lessons.findIndex((l) => l.id === activeLessonId) <
                    lessons.length - 1 && (
                    <Button
                      size="sm"
                      className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-xl gap-2"
                      onClick={goToNextLesson}
                    >
                      Next Lesson
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Hints Panel */}
                <AnimatePresence>
                  {showHints && activeLesson.hints && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-amber-50 border border-amber-200 rounded-2xl p-5 overflow-hidden"
                    >
                      <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" /> Hints
                      </h4>
                      <ol className="list-decimal pl-5 space-y-2">
                        {activeLesson.hints.map((hint, i) => (
                          <li key={i} className="text-sm text-amber-700">
                            {hint}
                          </li>
                        ))}
                      </ol>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Solution Panel */}
                <AnimatePresence>
                  {showSolution && activeLesson.solution_code && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-[#1E1E2E] rounded-2xl p-5 border border-gray-800">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Solution</h4>
                        <pre className="font-mono text-sm text-[#CDD6F4] whitespace-pre-wrap">
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
  );
}