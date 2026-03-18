import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
    <section className="py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <h2
            className="font-black text-white tracking-[-0.03em] leading-[0.93] mb-8"
            style={{ fontSize: "clamp(3rem, 6vw, 5.5rem)" }}
          >
            Stop thinking<br />about it.
            <br />
            <span
              style={{
                WebkitTextStroke: "2px #5B4FE9",
                color: "transparent",
              }}
            >
              Start building.
            </span>
          </h2>

          <p className="text-gray-500 font-light text-base leading-relaxed mb-10 max-w-sm">
            Your first project is one click away. No credit card, no email verification, no friction.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-12">
            <Link to={createPageUrl("Projects")}>
              <button className="inline-flex items-center gap-2 px-7 py-3 bg-[#5B4FE9] text-white text-sm font-semibold rounded-[4px] border border-[#7066f5]/40 hover:bg-[#4d42d4] transition-colors">
                Browse Projects
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to={createPageUrl("Challenges")}>
              <button className="inline-flex items-center px-7 py-3 text-gray-400 text-sm font-medium rounded-[4px] border border-white/10 hover:border-white/20 hover:text-gray-200 transition-colors">
                Try a quick challenge
              </button>
            </Link>
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-6 mb-16">
            {["100% Free", "No Signup Needed", "Start in 30 Seconds"].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#5B4FE9]" />
                <span className="text-xs text-gray-600">{item}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="p-5 rounded-lg bg-[#111118] border border-white/[0.06] max-w-md">
            <p className="text-gray-400 text-sm italic leading-relaxed mb-4">
              "I went from zero coding knowledge to building my own portfolio site in 2 weeks. This is exactly what I needed."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#221a3d] flex items-center justify-center text-[10px] font-bold text-[#9B91F5] border border-white/10">
                SC
              </div>
              <div>
                <div className="text-sm font-semibold text-white">Sarah Chen</div>
                <div className="text-xs text-gray-600">Career Switcher</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}