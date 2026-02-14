import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-purple-200/40 to-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gradient-to-tr from-purple-100/30 to-pink-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C5CE7]/8 border border-[#6C5CE7]/15 text-[#6C5CE7] text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Free &amp; beginner-friendly
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6"
          >
            Learn to code
            <br />
            by{" "}
            <span className="bg-gradient-to-r from-[#6C5CE7] to-[#A29BFE] bg-clip-text text-transparent">
              building things
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl mx-auto mb-10"
          >
            Stop watching tutorials. Start building real projects with
            interactive lessons, instant feedback, and guided challenges.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to={createPageUrl("Projects")}>
              <Button className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white h-12 px-7 text-base font-semibold rounded-xl shadow-xl shadow-purple-200/50 hover:shadow-purple-300/60 transition-all">
                Start Learning
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to={createPageUrl("Challenges")}>
              <Button variant="outline" className="h-12 px-7 text-base font-medium rounded-xl border-gray-200 hover:border-gray-300 text-gray-600">
                <Play className="w-4 h-4 mr-2" />
                Try a Challenge
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Code Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 md:mt-20 max-w-3xl mx-auto"
        >
          <div className="bg-[#1E1E2E] rounded-2xl shadow-2xl shadow-gray-900/20 overflow-hidden border border-gray-800">
            {/* Window Chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-700/50">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              <span className="ml-3 text-xs text-gray-500 font-mono">index.js</span>
            </div>
            {/* Code */}
            <div className="p-5 sm:p-6 font-mono text-sm sm:text-base leading-relaxed">
              <div>
                <span className="text-[#C678DD]">function</span>{" "}
                <span className="text-[#61AFEF]">greet</span>
                <span className="text-gray-400">(</span>
                <span className="text-[#E5C07B]">name</span>
                <span className="text-gray-400">)</span>{" "}
                <span className="text-gray-400">{"{"}</span>
              </div>
              <div className="pl-6">
                <span className="text-[#C678DD]">return</span>{" "}
                <span className="text-[#98C379]">`Hello, </span>
                <span className="text-gray-400">{"${"}</span>
                <span className="text-[#E5C07B]">name</span>
                <span className="text-gray-400">{"}"}</span>
                <span className="text-[#98C379]">! 👋`</span>
                <span className="text-gray-400">;</span>
              </div>
              <div>
                <span className="text-gray-400">{"}"}</span>
              </div>
              <div className="mt-3">
                <span className="text-[#61AFEF]">console</span>
                <span className="text-gray-400">.</span>
                <span className="text-[#61AFEF]">log</span>
                <span className="text-gray-400">(</span>
                <span className="text-[#61AFEF]">greet</span>
                <span className="text-gray-400">(</span>
                <span className="text-[#98C379]">"CodeFlow"</span>
                <span className="text-gray-400">));</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-[#00B894]">
                <span className="text-gray-500">▸</span>
                Hello, CodeFlow! 👋
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}