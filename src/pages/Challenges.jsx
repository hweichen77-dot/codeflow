import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, Search, Trophy, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const difficultyColors = {
  easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  hard: "bg-red-50 text-red-700 border-red-200",
};

const categoryLabels = {
  html_css: "HTML & CSS",
  javascript: "JavaScript",
  react: "React",
  python: "Python",
  general: "General",
};

export default function Challenges() {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");

  const { data: challenges = [], isLoading } = useQuery({
    queryKey: ["challenges"],
    queryFn: () => base44.entities.Challenge.list("order"),
  });

  const filtered = challenges.filter((c) => {
    const matchSearch =
      !search || c.title?.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty =
      difficulty === "all" || c.difficulty === difficulty;
    return matchSearch && matchDifficulty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-[#6C5CE7]" />
          <span className="text-sm font-medium text-[#6C5CE7]">Practice makes perfect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Challenges</h1>
        <p className="text-gray-500 text-lg max-w-lg">
          Sharpen your skills with focused coding challenges.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search challenges..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl border-gray-200"
          />
        </div>
        <div className="flex gap-2">
          {["all", "easy", "medium", "hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                difficulty === d
                  ? "bg-[#6C5CE7] text-white shadow-md shadow-purple-200/50"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No challenges found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((challenge, i) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link to={createPageUrl(`ChallengeDetail?id=${challenge.id}`)}>
                <div className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 p-5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C5CE7]/10 to-[#A29BFE]/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#6C5CE7]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-[#6C5CE7] transition-colors truncate">
                      {challenge.title}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant="outline" className="text-xs text-gray-500 hidden sm:inline-flex">
                      {categoryLabels[challenge.category] || challenge.category}
                    </Badge>
                    <Badge className={`${difficultyColors[challenge.difficulty]} border text-xs`}>
                      {challenge.difficulty}
                    </Badge>
                    {challenge.xp_reward && (
                      <span className="text-xs font-medium text-[#6C5CE7]">
                        +{challenge.xp_reward} XP
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#6C5CE7] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}