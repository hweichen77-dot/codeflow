import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Flame,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth
      .me()
      .then(setUser)
      .catch(() => {
        base44.auth.redirectToLogin();
      });
  }, []);

  const { data: progress = [] } = useQuery({
    queryKey: ["all-progress", user?.email],
    queryFn: () =>
      base44.entities.UserProgress.filter({
        user_email: user.email,
        completed: true,
      }),
    enabled: !!user,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["all-projects"],
    queryFn: () => base44.entities.Project.list("order"),
  });

  if (!user) return null;

  const completedLessons = progress.length;
  const projectsStarted = [...new Set(progress.map((p) => p.project_id))].length;
  const completedProjects = projects.filter((project) => {
    const projectProgress = progress.filter((p) => p.project_id === project.id);
    return project.lessons_count && projectProgress.length >= project.lessons_count;
  });

  const inProgressProjects = projects
    .filter((project) => {
      const projectProgress = progress.filter((p) => p.project_id === project.id);
      return projectProgress.length > 0 && (!project.lessons_count || projectProgress.length < project.lessons_count);
    })
    .map((project) => ({
      ...project,
      completed: progress.filter((p) => p.project_id === project.id).length,
    }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Greeting */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Welcome back, {user.full_name?.split(" ")[0] || "Learner"} 👋
        </h1>
        <p className="text-gray-500 text-lg">Here's your learning progress.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            icon: BookOpen,
            label: "Lessons Completed",
            value: completedLessons,
            color: "from-[#6C5CE7] to-[#A29BFE]",
            bg: "bg-purple-50",
          },
          {
            icon: Target,
            label: "Projects Started",
            value: projectsStarted,
            color: "from-blue-500 to-blue-400",
            bg: "bg-blue-50",
          },
          {
            icon: Trophy,
            label: "Projects Completed",
            value: completedProjects.length,
            color: "from-[#00B894] to-emerald-400",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl border border-gray-100 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            </div>
            <span className="text-3xl font-bold">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* In Progress Projects */}
      {inProgressProjects.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            Continue Learning
          </h2>
          <div className="space-y-3">
            {inProgressProjects.map((project) => {
              const percent = project.lessons_count
                ? Math.round((project.completed / project.lessons_count) * 100)
                : 0;
              return (
                <Link key={project.id} to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
                  <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all p-5 flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-[#6C5CE7] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {project.completed}/{project.lessons_count} lessons completed
                      </p>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                        <div
                          className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-[#6C5CE7] group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#00B894]" />
            Completed
          </h2>
          <div className="space-y-3">
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-[#00B894]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-400">{project.lessons_count} lessons</p>
                </div>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border">
                  Complete
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {progress.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No progress yet</h3>
          <p className="text-gray-500 mb-6">Start your first project and track your learning journey.</p>
          <Link to={createPageUrl("Projects")}>
            <Button className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-xl px-6">
              Browse Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}