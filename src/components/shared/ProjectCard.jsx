import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const categoryLabels = {
  html_css: "HTML & CSS",
  javascript: "JavaScript",
  react: "React",
  python: "Python",
  general: "General",
};

const difficultyColors = {
  beginner: "bg-emerald-50 text-emerald-700 border-emerald-200",
  intermediate: "bg-amber-50 text-amber-700 border-amber-200",
  advanced: "bg-red-50 text-red-700 border-red-200",
};

export default function ProjectCard({ project, index = 0, completedCount = 0 }) {
  const progress = project.lessons_count
    ? Math.round((completedCount / project.lessons_count) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
        <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/80 transition-all duration-300 h-full flex flex-col">
          {/* Cover */}
          <div className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
            {project.cover_image ? (
              <img
                src={project.cover_image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-gray-300" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className={`${difficultyColors[project.difficulty]} border text-xs font-medium`}>
                {project.difficulty}
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[#6C5CE7] uppercase tracking-wider">
                {categoryLabels[project.category] || project.category}
              </span>
            </div>
            <h3 className="text-lg font-semibold mb-2 group-hover:text-[#6C5CE7] transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-2">
              {project.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-gray-400">
                {project.estimated_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {project.estimated_time} min
                  </span>
                )}
                {project.lessons_count && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    {project.lessons_count} lessons
                  </span>
                )}
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#6C5CE7] group-hover:translate-x-1 transition-all" />
            </div>

            {/* Progress bar */}
            {progress > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium text-[#6C5CE7]">{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}