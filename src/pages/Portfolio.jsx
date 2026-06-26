import React, { useState, useEffect } from "react";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { ExternalLink, Lock, Globe } from "lucide-react";

export default function Portfolio() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {
      api.auth.redirectToLogin();
    });
  }, []);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["capstone-submissions", user?.email],
    queryFn: () => api.entities.CapstoneSubmission.filter({ user_email: user.email }, "-submitted_date"),
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "#15130E" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #262219" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #E8A33C, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <div className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: "#BBB3A4" }}>§ PORTFOLIO</div>
          <h1
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#F2EDE2", lineHeight: 1.12, margin: "0 0 12px" }}
          >
            {user.name?.split(" ")[0] || user.email?.split("@")[0] || "Your"}'s builds.
          </h1>
          <p className="font-display text-sm" style={{ color: "#C9C1B2", fontWeight: 400 }}>
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
              <div key={i} className="h-28 animate-pulse" style={{ background: "#131009", border: "1px solid #262219" }} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-24" style={{ border: "1px solid #262219" }}>
            <div className="font-sans text-xs tracking-widest uppercase mb-4" style={{ color: "#BBB3A4" }}>
              NO SUBMISSIONS YET
            </div>
            <p className="font-display text-base mb-8" style={{ color: "#C9C1B2", fontWeight: 400 }}>
              Complete the AI/ML track to submit your first capstone project.
            </p>
            <Link to={createPageUrl("AITrack")}>
              <button
                className="font-sans text-xs tracking-widest uppercase px-8 py-4 transition-all duration-150"
                style={{ background: "#E8A33C", color: "#15130E", fontWeight: 700 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(232,163,60,0.2)"; }}
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
                style={{ border: "1px solid #262219", background: "#131009" }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-sans text-xs tracking-widest uppercase px-2 py-0.5" style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}>
                          CAPSTONE
                        </span>
                        <span className="font-sans text-xs flex items-center gap-1" style={{ color: sub.is_public ? "#C9C1B2" : "#BBB3A4" }}>
                          {sub.is_public ? <Globe size={10} /> : <Lock size={10} />}
                          {sub.is_public ? "public" : "private"}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-lg mb-2"
                        style={{ color: "#ECE7DC", letterSpacing: "-0.02em" }}
                      >
                        {sub.project_title}
                      </h3>
                      {sub.description && (
                        <p className="font-display text-sm line-clamp-2" style={{ color: "#C9C1B2", fontWeight: 400 }}>
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
                          className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                          style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#E8A33C20"}
                          onMouseLeave={e => e.currentTarget.style.background = "#E8A33C10"}
                        >
                          <ExternalLink size={10} />
                          Demo
                        </a>
                      )}
                    </div>
                  </div>

                  {sub.ai_feedback && (
                    <div
                      className="mt-4 px-4 py-3"
                      style={{ background: "#080808", borderLeft: "2px solid #E8A33C33" }}
                    >
                      <span className="font-sans text-xs" style={{ color: "#E8A33C" }}>AI Review: </span>
                      <span className="font-display text-xs leading-relaxed" style={{ color: "#C9C1B2", fontWeight: 400 }}>
                        {sub.ai_feedback}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 font-sans text-xs" style={{ color: "#BBB3A4" }}>
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