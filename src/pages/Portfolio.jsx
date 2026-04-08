import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ExternalLink, Lock, Globe } from "lucide-react";

export default function Portfolio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {
      base44.auth.redirectToLogin();
    });
  }, []);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["capstone-submissions", user?.email],
    queryFn: () => base44.entities.CapstoneSubmission.filter({ user_email: user.email }, "-submitted_date"),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      {/* Header */}
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8ff00, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="font-mono text-xs tracking-widest uppercase mb-2" style={{ color: "#666" }}>§ PORTFOLIO</div>
          <h1
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#f0f0f0", lineHeight: 1.12, margin: "0 0 12px" }}
          >
            {user.full_name?.split(" ")[0] || "Your"}'s builds.
          </h1>
          <p className="font-display text-sm" style={{ color: "#888", fontWeight: 400 }}>
            {submissions.length > 0
              ? `${submissions.length} capstone project${submissions.length > 1 ? "s" : ""} completed.`
              : "Complete capstone projects to build your portfolio."}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-12">
        {isLoading ? (
          <div className="space-y-px">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 animate-pulse" style={{ background: "#0d0d0d", border: "1px solid #1a1a1a" }} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-24" style={{ border: "1px solid #1a1a1a" }}>
            <div className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: "#666" }}>
              NO SUBMISSIONS YET
            </div>
            <p className="font-display text-base mb-8" style={{ color: "#888", fontWeight: 400 }}>
              Complete the AI/ML track to submit your first capstone project.
            </p>
            <Link to={createPageUrl("AITrack")}>
              <button
                className="font-mono text-xs tracking-widest uppercase px-8 py-4 transition-all duration-150"
                style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(184,255,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                Explore AI Track →
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-px">
            {submissions.map((sub, i) => (
              <div
                key={sub.id}
                className="group"
                style={{ border: "1px solid #1a1a1a", background: "#0d0d0d" }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-xs tracking-widest uppercase px-2 py-0.5" style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}>
                          CAPSTONE
                        </span>
                        <span className="font-mono text-xs flex items-center gap-1" style={{ color: sub.is_public ? "#888" : "#666" }}>
                          {sub.is_public ? <Globe size={10} /> : <Lock size={10} />}
                          {sub.is_public ? "public" : "private"}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-lg mb-2"
                        style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}
                      >
                        {sub.project_title}
                      </h3>
                      {sub.description && (
                        <p className="font-display text-sm line-clamp-2" style={{ color: "#aaa", fontWeight: 400 }}>
                          {sub.description}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {sub.demo_url && (
                        <a
                          href={sub.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                          style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#b8ff0020"}
                          onMouseLeave={e => e.currentTarget.style.background = "#b8ff0010"}
                        >
                          <ExternalLink size={10} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {/* AI Feedback */}
                  {sub.ai_feedback && (
                    <div
                      className="mt-4 px-4 py-3"
                      style={{ background: "#080808", borderLeft: "2px solid #b8ff0033" }}
                    >
                      <span className="font-mono text-xs" style={{ color: "#b8ff00" }}>AI Review: </span>
                      <span className="font-display text-xs leading-relaxed" style={{ color: "#aaa", fontWeight: 400 }}>
                        {sub.ai_feedback}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 font-mono text-xs" style={{ color: "#666" }}>
                    {sub.submitted_date ? new Date(sub.submitted_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}