import React from "react";
import { Layers, Terminal, BookOpen, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Layers,
    title: "Project-Based Learning",
    description: "Build real projects step by step. Learn concepts by applying them immediately — no memorization required.",
    color: "from-purple-500 to-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Terminal,
    title: "Interactive Editor",
    description: "Write and run code in the browser with instant feedback, helpful error messages, and guided hints.",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: BookOpen,
    title: "Concept Walkthroughs",
    description: "Clear, visual explanations of variables, loops, functions, and more — broken into short, digestible lessons.",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Zap,
    title: "Guided Challenges",
    description: "Practice problems that reinforce every concept. Track your progress and build confidence with each win.",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Everything you need to start coding
          </h2>
          <p className="text-lg text-gray-500 max-w-lg mx-auto">
            A complete learning environment designed to make coding approachable and fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-7 border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                <feature.icon className={`w-6 h-6 bg-gradient-to-br ${feature.color} bg-clip-text text-purple-600`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}