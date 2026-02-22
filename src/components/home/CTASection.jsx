import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  const [hovering, setHovering] = useState(false);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C5CE7]/5 via-transparent to-[#00B894]/5" />
      
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#6C5CE7] rounded-full blur-3xl opacity-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00B894] rounded-full blur-3xl opacity-20" />
            
            <div className="relative text-center">
              <motion.div
                animate={hovering ? { rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
                className="inline-block mb-6"
              >
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>

              <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
                Stop thinking about it.
                <br />
                <span className="bg-gradient-to-r from-[#6C5CE7] to-[#00B894] bg-clip-text text-transparent">
                  Start building.
                </span>
              </h2>

              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                Your first project is literally one click away. No credit card, no email verification, 
                no BS. Just you and code.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={createPageUrl("Projects")}>
                  <Button
                    size="lg"
                    onMouseEnter={() => setHovering(true)}
                    onMouseLeave={() => setHovering(false)}
                    className="bg-white text-gray-900 hover:bg-gray-100 h-16 px-10 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all group"
                  >
                    Browse Projects
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to={createPageUrl("Challenges")}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-16 px-8 text-lg font-semibold rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 transition-all"
                  >
                    Or try a quick challenge
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>No Signup Needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400" />
                  <span>Start in 30 Seconds</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-white rounded-2xl shadow-lg p-6 max-w-lg border border-gray-100">
            <p className="text-gray-700 italic mb-3">
              "I went from zero coding knowledge to building my own portfolio site in 2 weeks. 
              This is exactly what I needed."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Sarah Chen</div>
                <div className="text-sm text-gray-500">Career Switcher</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}