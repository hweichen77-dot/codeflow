import React, { useState } from "react";
import { motion } from "framer-motion";

const paths = [
  {
    id: 1,
    tag: "Beginner",
    title: "Complete Beginner",
    description: "Never written a line of code? Start here.",
    projects: ["Your First Website", "Interactive Quiz", "Todo App"],
    time: "2–3 weeks",
  },
  {
    id: 2,
    tag: "Intermediate",
    title: "Some Experience",
    description: "Know the basics? Build something cooler.",
    projects: ["Weather Dashboard", "Recipe Finder", "Task Manager"],
    time: "3–4 weeks",
  },
  {
    id: 3,
    tag: "Advanced",
    title: "Ready for Challenges",
    description: "Test your skills with harder problems.",
    projects: ["E-commerce Store", "Social App", "Game Engine"],
    time: "4–6 weeks",
  },
];

export default function StatsSection() {
  const [selected, setSelected] = useState(1);

  return (
    <section className="py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">
            Learning paths
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-[1.05]">
            Pick your path.
          </h2>
          <p className="text-gray-300 font-light mt-4 text-sm">
            Everyone starts somewhere. Where are you?
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-3">
          {paths.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(path.id)}
              className={`relative p-6 rounded-lg border cursor-pointer transition-all duration-200 ${
                selected === path.id
                  ? "border-[#5B4FE9]/50 bg-[#5B4FE9]/[0.05]"
                  : "border-white/[0.06] bg-[#111118] hover:border-white/[0.12]"
              }`}
            >
              <div
                className={`inline-block text-[11px] font-mono px-2 py-0.5 rounded mb-5 ${
                  selected === path.id
                    ? "bg-[#5B4FE9]/20 text-[#9B91F5]"
                    : "bg-white/5 text-gray-600"
                }`}
              >
                {path.tag}
              </div>

              <h3 className="text-base font-bold text-white mb-1 tracking-tight">
                {path.title}
              </h3>
              <p className="text-sm text-gray-300 mb-6 font-light">{path.description}</p>

              <div className="space-y-2.5 mb-6">
                {path.projects.map((project) => (
                  <div key={project} className="flex items-center gap-2.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                        selected === path.id ? "bg-[#5B4FE9]" : "bg-gray-700"
                      }`}
                    />
                    <span className="text-sm text-gray-300">{project}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                <span className="text-xs text-gray-400">Est. time</span>
                <span className="text-xs font-mono text-gray-300">{path.time}</span>
              </div>

              {selected === path.id && (
                <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#5B4FE9]" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs text-gray-400 mt-8"
        >
          Not sure? Browse all projects and pick what interests you.
        </motion.p>
      </div>
    </section>
  );
}