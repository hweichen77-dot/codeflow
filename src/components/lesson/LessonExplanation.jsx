import React from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, Lightbulb, Code2 } from "lucide-react";

const sectionColors = [
  { bg: "bg-violet-50", border: "border-violet-200", icon: "text-violet-500", header: "text-violet-700" },
  { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-500", header: "text-blue-700" },
  { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-500", header: "text-emerald-700" },
  { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600", header: "text-amber-700" },
];

function parseExplanation(text) {
  if (!text) return [];
  // Split by ## headings
  const parts = text.split(/(?=^## )/m);
  return parts
    .map((part) => {
      const lines = part.trim().split("\n");
      const firstLine = lines[0];
      if (firstLine.startsWith("## ")) {
        return {
          heading: firstLine.replace("## ", "").trim(),
          body: lines.slice(1).join("\n").trim(),
        };
      }
      return { heading: null, body: part.trim() };
    })
    .filter((s) => s.body || s.heading);
}

export default function LessonExplanation({ explanation, concept }) {
  const sections = parseExplanation(explanation);

  return (
    <div className="space-y-5">
      {/* Concept badge */}
      {concept && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] text-xs font-semibold border border-[#6C5CE7]/20">
            <BookOpen className="w-3.5 h-3.5" />
            {concept}
          </span>
        </div>
      )}

      {/* Sections */}
      {sections.map((section, i) => {
        const color = sectionColors[i % sectionColors.length];
        return (
          <div
            key={i}
            className={`rounded-2xl border ${color.border} ${color.bg} overflow-hidden`}
          >
            {section.heading && (
              <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${color.border}`}>
                <Lightbulb className={`w-4 h-4 ${color.icon} flex-shrink-0`} />
                <h3 className={`font-semibold text-sm ${color.header}`}>
                  {section.heading}
                </h3>
              </div>
            )}
            {section.body && (
              <div className="px-5 py-4">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 last:mb-0">
                        {children}
                      </p>
                    ),
                    code: ({ inline, children }) =>
                      inline ? (
                        <code className="bg-white/70 border border-white px-1.5 py-0.5 rounded text-xs font-mono text-[#6C5CE7]">
                          {children}
                        </code>
                      ) : (
                        <div className="mt-3 mb-3 rounded-xl overflow-hidden border border-gray-800/20">
                          <div className="flex items-center gap-2 px-4 py-2 bg-[#1E1E2E]">
                            <Code2 className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs text-gray-400 font-mono">code</span>
                          </div>
                          <pre className="bg-[#282A36] px-4 py-3 overflow-x-auto">
                            <code className="text-[#CDD6F4] font-mono text-xs leading-relaxed">
                              {children}
                            </code>
                          </pre>
                        </div>
                      ),
                    ul: ({ children }) => (
                      <ul className="space-y-1.5 my-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="space-y-1.5 my-2 list-decimal pl-5">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-sm text-gray-700 flex items-start gap-2">
                        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${color.icon.replace("text-", "bg-")}`} />
                        <span className="leading-relaxed">{children}</span>
                      </li>
                    ),
                    h3: ({ children }) => (
                      <h4 className={`font-semibold text-sm ${color.header} mb-2 mt-3`}>
                        {children}
                      </h4>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-800">{children}</strong>
                    ),
                  }}
                >
                  {section.body}
                </ReactMarkdown>
              </div>
            )}
          </div>
        );
      })}

      {/* Fallback: no sections parsed */}
      {sections.length === 0 && explanation && (
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4">
          <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
        </div>
      )}
    </div>
  );
}