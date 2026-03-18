import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Pick a project, not a tutorial",
    description:
      "Browse real projects — a portfolio site, a quiz app, a weather dashboard. You decide what to build. The lessons are woven around your goal, not the other way around.",
    snippet: {
      filename: "projects.js",
      lines: [
        { num: 1, tokens: [{ c: "text-gray-600", t: "// Choose what you want to build" }] },
        { num: 2, tokens: [{ c: "text-purple-400", t: "const " }, { c: "text-[#7dd3fc]", t: "goal" }, { c: "text-gray-500", t: " = " }, { c: "text-green-400", t: '"Portfolio Website"' }, { c: "text-gray-600", t: ";" }] },
        { num: 3, tokens: [] },
        { num: 4, tokens: [{ c: "text-[#7dd3fc]", t: "codeflow" }, { c: "text-gray-500", t: "." }, { c: "text-yellow-300", t: "start" }, { c: "text-gray-500", t: "(" }, { c: "text-[#7dd3fc]", t: "goal" }, { c: "text-gray-500", t: ");" }] },
        { num: 5, tokens: [{ c: "text-gray-600", t: "// → Lesson 1: HTML structure" }] },
        { num: 6, tokens: [{ c: "text-gray-600", t: "// → Lesson 2: CSS styling" }] },
        { num: 7, tokens: [{ c: "text-gray-600", t: "// → Lesson 3: Deploy it" }] },
      ],
    },
  },
  {
    number: "02",
    title: "Write code, see it run instantly",
    description:
      "No setup. No terminal rabbit holes. No mysterious 'module not found' errors. Write code in the browser, hit run, see output. Learning shouldn't have a barrier to entry.",
    snippet: {
      filename: "terminal",
      lines: [
        { num: 1, tokens: [{ c: "text-gray-600", t: "$ " }, { c: "text-gray-300", t: "run script.js" }] },
        { num: 2, tokens: [] },
        { num: 3, tokens: [{ c: "text-green-400", t: "✓ " }, { c: "text-gray-400", t: "Executing..." }] },
        { num: 4, tokens: [{ c: "text-[#7dd3fc]", t: "> " }, { c: "text-gray-300", t: "Hello, World!" }] },
        { num: 5, tokens: [] },
        { num: 6, tokens: [{ c: "text-green-400", t: "✓ " }, { c: "text-gray-500", t: "Done in 12ms" }] },
      ],
    },
  },
  {
    number: "03",
    title: "Get unstuck without losing momentum",
    description:
      "Contextual hints appear exactly when you need them. Step-by-step breakdowns. Peek at the solution when you're truly stuck. Keep moving — getting stuck shouldn't mean giving up.",
    snippet: {
      filename: "hint.js",
      lines: [
        { num: 1, tokens: [{ c: "text-gray-600", t: "// Hint 1: Use the + operator" }] },
        { num: 2, tokens: [{ c: "text-purple-400", t: "let " }, { c: "text-[#7dd3fc]", t: "result" }, { c: "text-gray-500", t: " = " }, { c: "text-orange-300", t: "a" }, { c: "text-gray-500", t: " + " }, { c: "text-orange-300", t: "b" }, { c: "text-gray-600", t: ";" }] },
        { num: 3, tokens: [] },
        { num: 4, tokens: [{ c: "text-[#7dd3fc]", t: "console" }, { c: "text-gray-500", t: "." }, { c: "text-yellow-300", t: "log" }, { c: "text-gray-500", t: "(" }, { c: "text-[#7dd3fc]", t: "result" }, { c: "text-gray-500", t: ");" }] },
        { num: 5, tokens: [{ c: "text-gray-600", t: "// → 15 ✓" }] },
      ],
    },
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-32 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium">
            How it works
          </p>
          <h2 className="text-4xl sm:text-5xl font-black text-white tracking-[-0.03em] leading-[1.05] max-w-lg">
            Learn by doing,<br />not watching.
          </h2>
        </motion.div>

        <div className="divide-y divide-white/[0.04]">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="grid md:grid-cols-[1fr_1fr] gap-12 py-14 items-center"
            >
              <div>
                <div className="text-xs font-mono text-[#5B4FE9] mb-4 tracking-widest">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 leading-snug tracking-tight">
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed font-light max-w-sm">
                  {step.description}
                </p>
              </div>

              <div className="bg-[#0d0d14] rounded-lg border border-white/[0.06] overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.05] bg-[#111118]">
                  <div className="w-2 h-2 rounded-full bg-white/10" />
                  <span className="text-xs font-mono text-gray-600">{step.snippet.filename}</span>
                </div>
                <div className="p-4 font-mono text-xs leading-[1.8]">
                  {step.snippet.lines.map(({ num, tokens }) => (
                    <div key={num} className="flex gap-3">
                      <span className="text-gray-700 select-none w-3 flex-shrink-0">{num}</span>
                      <span>
                        {tokens.length === 0
                          ? "\u00a0"
                          : tokens.map((tok, j) => (
                              <span key={j} className={tok.c}>
                                {tok.t}
                              </span>
                            ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-10 pt-14 border-t border-white/[0.04] mt-4"
        >
          {[
            { value: "5min", label: "To your first project" },
            { value: "$0", label: "Forever free" },
            { value: "0", label: "Setup required" },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-3xl font-black text-white tracking-tight">{value}</div>
              <div className="text-xs text-gray-400 mt-1">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}