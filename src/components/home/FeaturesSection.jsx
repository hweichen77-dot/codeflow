import React, { useState } from "react";
import { Rocket, Code2, Lightbulb, Target } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Rocket,
    title: "Build While You Learn",
    description: "Skip the boring theory dumps. Start with a project idea, then learn exactly what you need as you build it.",
    demo: "Project: Portfolio Website → Learn HTML, CSS as you go",
    color: "#6C5CE7",
  },
  {
    icon: Code2,
    title: "Live Code Playground",
    description: "Write code, hit run, see results instantly. No setup, no downloads, no mysterious errors.",
    demo: "console.log('It just works') ✓",
    color: "#00B894",
  },
  {
    icon: Lightbulb,
    title: "Get Unstuck Fast",
    description: "Stuck? Get contextual hints, see explanations, or peek at solutions. Learn at your pace.",
    demo: "Hint 1/3 → Show solution → Got it!",
    color: "#FDCB6E",
  },
  {
    icon: Target,
    title: "Practice with Purpose",
    description: "Bite-sized challenges that actually matter. Build muscle memory by solving real problems.",
    demo: "Completed: 12 challenges → Next level unlocked",
    color: "#FF7675",
  },
];

export default function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-20 md:py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
              How it actually works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              No fluff. No gatekeeping. Just you, your browser, and projects worth building.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setActiveFeature(index)}
              className="group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"
                style={{ backgroundColor: feature.color }}
              />
              
              <div className="relative">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon 
                    className="w-7 h-7" 
                    style={{ color: feature.color }}
                  />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div 
                  className="inline-block px-4 py-2 rounded-lg font-mono text-sm border-2 transition-all"
                  style={{ 
                    borderColor: activeFeature === index ? feature.color : '#E5E7EB',
                    backgroundColor: activeFeature === index ? `${feature.color}10` : 'transparent',
                    color: activeFeature === index ? feature.color : '#6B7280'
                  }}
                >
                  {feature.demo}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-3 px-8 py-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">5min</div>
                <div className="text-xs text-gray-500">To first project</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">$0</div>
                <div className="text-xs text-gray-500">Forever free</div>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Setup required</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}