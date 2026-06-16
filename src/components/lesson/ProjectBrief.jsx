import React, { useState } from "react";
import { ChevronDown, Target, Wrench, ListChecks, Award, Clock } from "lucide-react";

/**
 * ProjectBrief — collapsible engineering brief shown at the top of a project.
 * Reads project.brief = { tagline, overview, whatYouBuild[], milestones[],
 * skills[], rubric[], estimatedHours }.
 */
export default function ProjectBrief({ brief }) {
  const [open, setOpen] = useState(false);
  if (!brief) return null;

  return (
    <div className="mb-6" style={{ border: "1px solid #1e1e1e", background: "#0d0d0d", borderLeft: "2px solid #b8ff00" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div className="text-left">
          <div className="font-mono text-xs tracking-widest uppercase mb-1" style={{ color: "#b8ff00" }}>PROJECT BRIEF</div>
          <div className="font-display text-sm" style={{ color: "#ccc", fontWeight: 500 }}>{brief.tagline}</div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {brief.estimatedHours != null && (
            <span className="hidden sm:flex items-center gap-1.5 font-mono text-xs" style={{ color: "#666" }}>
              <Clock size={12} /> ~{brief.estimatedHours}h
            </span>
          )}
          <ChevronDown size={16} style={{ color: "#888", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid #1a1a1a" }}>
          <p className="font-display text-sm leading-relaxed mt-4 mb-5" style={{ color: "#aaa" }}>{brief.overview}</p>

          <div className="grid md:grid-cols-2 gap-5">
            <Section icon={<Target size={13} />} label="What you'll build" accent="#b8ff00">
              <ul className="space-y-1.5">
                {brief.whatYouBuild?.map((w, i) => (
                  <li key={i} className="font-display text-sm flex gap-2" style={{ color: "#bbb" }}>
                    <span style={{ color: "#b8ff00" }}>—</span> {w}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<Wrench size={13} />} label="Skills" accent="#60a5fa">
              <div className="flex flex-wrap gap-1.5">
                {brief.skills?.map((s, i) => (
                  <span key={i} className="font-mono text-xs px-2 py-1" style={{ background: "#60a5fa14", border: "1px solid #60a5fa33", color: "#60a5fa" }}>{s}</span>
                ))}
              </div>
            </Section>

            <Section icon={<ListChecks size={13} />} label="Milestones" accent="#cc66ff">
              <ol className="space-y-2">
                {brief.milestones?.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#cc66ff" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="font-display text-sm font-medium" style={{ color: "#ddd" }}>{m.title}</div>
                      <div className="font-display text-xs" style={{ color: "#888" }}>{m.detail}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>

            <Section icon={<Award size={13} />} label="Done well means" accent="#f0c000">
              <ul className="space-y-2">
                {brief.rubric?.map((r, i) => (
                  <li key={i}>
                    <div className="font-display text-sm font-medium" style={{ color: "#ddd" }}>{r.criterion}</div>
                    <div className="font-display text-xs" style={{ color: "#888" }}>{r.description}</div>
                  </li>
                ))}
              </ul>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ icon, label, accent, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase mb-2.5" style={{ color: accent }}>
        {icon} {label}
      </div>
      {children}
    </div>
  );
}
