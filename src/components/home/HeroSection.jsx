import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "CodeFlow learner";
  
  useEffect(() => {
    if (!isTyping) return;
    if (typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.slice(0, typedText.length + 1));
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(() => setIsTyping(false), 1000);
    }
  }, [typedText, isTyping]);

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-36">
      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, #6C5CE7 1px, transparent 1px),
            linear-gradient(to bottom, #6C5CE7 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block mb-4">
                <span className="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                  100% Free • No Credit Card
                </span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
                Don't just
                <br />
                <span className="relative inline-block">
                  watch.
                  <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C60 2 140 2 198 10" stroke="#6C5CE7" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
                <br />
                <span className="text-[#6C5CE7]">Build.</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mb-8 max-w-lg">
                Real coding skills come from building real stuff. Jump into hands-on projects, 
                not endless videos.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link to={createPageUrl("Projects")}>
                  <Button 
                    size="lg" 
                    className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white h-14 px-8 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all group"
                  >
                    Start Building
                    <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to={createPageUrl("Challenges")}>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="h-14 px-6 text-base font-medium rounded-2xl border-2 border-gray-300 hover:border-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-all"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Quick Challenge
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 border-2 border-white" />
                  </div>
                  <span className="font-medium">1000+ learners</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★★★★★</span>
                  <span className="font-medium ml-1">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right - Interactive code demo */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-[#0D1117] rounded-3xl shadow-2xl border border-gray-800 overflow-hidden">
              {/* Terminal header */}
              <div className="bg-[#161B22] px-4 py-3 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-xs text-gray-500 font-mono">hello.js</span>
                <div className="w-16" />
              </div>
              
              {/* Code content */}
              <div className="p-6 font-mono text-sm leading-loose">
                <div className="mb-3">
                  <span className="text-gray-500">1</span>
                  <span className="ml-4 text-purple-400">const</span>
                  <span className="text-blue-300"> greet</span>
                  <span className="text-gray-400"> = (</span>
                  <span className="text-orange-300">name</span>
                  <span className="text-gray-400">) =&gt; {"{"}</span>
                </div>
                <div className="mb-3 pl-8">
                  <span className="text-gray-500">2</span>
                  <span className="ml-4 text-purple-400">return</span>
                  <span className="text-green-400"> `Hello, </span>
                  <span className="text-gray-400">${"{"}</span>
                  <span className="text-orange-300">name</span>
                  <span className="text-gray-400">{"}"}</span>
                  <span className="text-green-400">!`</span>
                  <span className="text-gray-400">;</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500">3</span>
                  <span className="ml-4 text-gray-400">{"}"};</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500">4</span>
                </div>
                <div>
                  <span className="text-gray-500">5</span>
                  <span className="ml-4 text-blue-300">greet</span>
                  <span className="text-gray-400">(</span>
                  <span className="text-green-400">"</span>
                  <motion.span 
                    className="text-green-400"
                    animate={{ opacity: [1, 1, 0.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    {typedText}
                    <span className="animate-pulse">|</span>
                  </motion.span>
                  <span className="text-green-400">"</span>
                  <span className="text-gray-400">);</span>
                </div>
                
                {/* Output */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-6 p-3 bg-[#161B22] rounded-lg border border-gray-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-gray-400">Output:</span>
                  </div>
                  <div className="text-green-400">
                    Hello, {typedText || "CodeFlow learner"}!
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900">Code runs!</div>
                  <div className="text-xs text-gray-500">Live preview</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}