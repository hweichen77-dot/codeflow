import React from "react";
import { motion } from "framer-motion";

const stats = [
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Prerequisites" },
  { value: "∞", label: "Projects to build" },
  { value: "24/7", label: "Learn anytime" },
];

export default function StatsSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#6C5CE7] to-[#5A4BD1] rounded-3xl p-10 md:p-14 shadow-xl shadow-purple-200/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-purple-200 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}