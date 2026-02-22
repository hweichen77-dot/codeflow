import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Code, Trophy, Users } from "lucide-react";

const paths = [
  {
    id: 1,
    title: "Complete Beginner",
    description: "Never written a line of code? Start here.",
    projects: ["Your First Website", "Interactive Quiz", "Todo App"],
    time: "2-3 weeks",
    icon: Code,
    color: "#6C5CE7",
  },
  {
    id: 2,
    title: "Some Experience",
    description: "Know the basics? Build something cooler.",
    projects: ["Weather Dashboard", "Recipe Finder", "Task Manager"],
    time: "3-4 weeks",
    icon: Trophy,
    color: "#00B894",
  },
  {
    id: 3,
    title: "Ready for Challenges",
    description: "Test your skills with harder problems.",
    projects: ["E-commerce Store", "Social App", "Game Engine"],
    time: "4-6 weeks",
    icon: Users,
    color: "#FDCB6E",
  },
];

export default function StatsSection() {
  const [selectedPath, setSelectedPath] = useState(1);

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Pick your path
            </h2>
            <p className="text-xl text-gray-600">
              Everyone starts somewhere. Where are you?
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {paths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              onClick={() => setSelectedPath(path.id)}
              className={`relative cursor-pointer p-8 rounded-3xl border-2 transition-all duration-300 ${
                selectedPath === path.id
                  ? 'border-gray-900 shadow-2xl scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
              }`}
              style={{
                backgroundColor: selectedPath === path.id ? `${path.color}05` : 'white'
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${path.color}20` }}
              >
                <path.icon className="w-8 h-8" style={{ color: path.color }} />
              </div>

              <h3 className="text-2xl font-bold mb-2">{path.title}</h3>
              <p className="text-gray-600 mb-6">{path.description}</p>

              <div className="space-y-3 mb-6">
                {path.projects.map((project, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 
                      className="w-5 h-5 mt-0.5 flex-shrink-0" 
                      style={{ color: path.color }}
                    />
                    <span className="text-sm text-gray-700">{project}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">Estimated time</span>
                <span className="text-sm font-bold" style={{ color: path.color }}>
                  {path.time}
                </span>
              </div>

              {selectedPath === path.id && (
                <motion.div
                  layoutId="selected"
                  className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: path.color }}
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-500 mb-6">
            Not sure? That's totally fine—browse all projects and pick what interests you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}