import React, { useState } from "react";
import { ChevronDown, Target, Wrench, ListChecks, Award, Clock } from "lucide-react";

export default function ProjectBrief({ brief }) {
  const [open, setOpen] = useState(false);
  if (!brief) return null;

  return (
    <div className="mb-6" style={{ border: "1px solid #262219", background: "#131009", borderLeft: "2px solid #E8A33C" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 transition-all"
        style={{ background: "transparent", border: "none", cursor: "pointer" }}
      >
        <div className="text-left">
          <div className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: "#E8A33C" }}>PROJECT BRIEF</div>
          <div className="font-display text-sm" style={{ color: "#C2BAAA", fontWeight: 500 }}>{brief.tagline}</div>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          {brief.estimatedHours != null && (
            <span className="hidden sm:flex items-center gap-1.5 font-sans text-xs" style={{ color: "#BBB3A4" }}>
              <Clock size={12} /> ~{brief.estimatedHours}h
            </span>
          )}
          <ChevronDown size={16} style={{ color: "#8F8779", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5" style={{ borderTop: "1px solid #262219" }}>
          <p className="font-display text-sm leading-relaxed mt-4 mb-5" style={{ color: "#C9C1B2" }}>{brief.overview}</p>

          <div className="grid md:grid-cols-2 gap-5">
            <Section icon={<Target size={13} />} label="What you'll build" accent="#E8A33C">
              <ul className="space-y-1.5">
                {brief.whatYouBuild?.map((w, i) => (
                  <li key={i} className="font-display text-sm flex gap-2" style={{ color: "#A8A092" }}>
                    <span style={{ color: "#E8A33C" }}>—</span> {w}
                  </li>
                ))}
              </ul>
            </Section>

            <Section icon={<Wrench size={13} />} label="Skills" accent="#C2643C">
              <div className="flex flex-wrap gap-1.5">
                {brief.skills?.map((s, i) => (
                  <span key={i} className="font-sans text-xs px-2 py-1" style={{ background: "#C2643C14", border: "1px solid #C2643C33", color: "#C2643C" }}>{s}</span>
                ))}
              </div>
            </Section>

            <Section icon={<ListChecks size={13} />} label="Milestones" accent="#cc66ff">
              <ol className="space-y-2">
                {brief.milestones?.map((m, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-sans text-xs flex-shrink-0 mt-0.5" style={{ color: "#cc66ff" }}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="font-display text-sm font-medium" style={{ color: "#ddd" }}>{m.title}</div>
                      <div className="font-display text-xs" style={{ color: "#C9C1B2" }}>{m.detail}</div>
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
                    <div className="font-display text-xs" style={{ color: "#C9C1B2" }}>{r.description}</div>
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
      <div className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase mb-2.5" style={{ color: accent }}>
        {icon} {label}
      </div>
      {children}
    </div>
  );
}
