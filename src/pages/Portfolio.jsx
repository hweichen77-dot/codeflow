import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import { ExternalLink, Lock, Globe } from "lucide-react";
import { Stagger, StaggerItem } from "@/lib/motion";
import { Card, Eyebrow, PrimaryButton } from "@/components/ui/kit";

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
    <div className="min-h-screen" style={{ background: "#070B0A" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: "1px solid #17201C" }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #5ED29C, transparent)" }} />
        <div className="max-w-5xl mx-auto">
          <Eyebrow className="mb-2">PORTFOLIO</Eyebrow>
          <h1
            style={{ fontFamily: font.display, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: "#ECF3EF", lineHeight: 1.12, margin: "0 0 12px" }}
          >
            {user.name?.split(" ")[0] || user.email?.split("@")[0] || "Your"}'s builds.
          </h1>
          <p className="font-display text-sm" style={{ color: "#FFFFFF", fontWeight: 400 }}>
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
              <div key={i} className="h-28 animate-pulse" style={{ background: "#070B0A", border: "1px solid #17201C" }} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <Card hover={false} className="text-center py-24">
            <Eyebrow className="mb-4">NO SUBMISSIONS YET</Eyebrow>
            <p className="font-display text-base mb-8" style={{ color: "#FFFFFF", fontWeight: 400 }}>
              Complete the AI/ML track to submit your first capstone project.
            </p>
            <div className="flex justify-center">
              <PrimaryButton to={createPageUrl("AITrack")}>Explore AI Track</PrimaryButton>
            </div>
          </Card>
        ) : (
          <Stagger className="space-y-px" as="div">
            {submissions.map((sub, i) => (
              <StaggerItem
                key={sub.id}
                className="group"
                as="div"
              >
                <Card className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-sans text-xs tracking-widest uppercase px-2 py-0.5" style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}>
                          CAPSTONE
                        </span>
                        <span className="font-sans text-xs flex items-center gap-1" style={{ color: sub.is_public ? "#CBD6D0" : "#B7C6BE" }}>
                          {sub.is_public ? <Globe size={10} /> : <Lock size={10} />}
                          {sub.is_public ? "public" : "private"}
                        </span>
                      </div>
                      <h3
                        className="font-display font-bold text-lg mb-2"
                        style={{ color: "#ECF3EF", letterSpacing: "-0.02em" }}
                      >
                        {sub.project_title}
                      </h3>
                      {sub.description && (
                        <p className="font-display text-sm line-clamp-2" style={{ color: "#FFFFFF", fontWeight: 400 }}>
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
                          style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#5ED29C20"}
                          onMouseLeave={e => e.currentTarget.style.background = "#5ED29C10"}
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
                      style={{ background: "#080808", borderLeft: "2px solid #5ED29C33" }}
                    >
                      <span className="font-sans text-xs" style={{ color: "#5ED29C" }}>AI Review: </span>
                      <span className="font-display text-xs leading-relaxed" style={{ color: "#FFFFFF", fontWeight: 400 }}>
                        {sub.ai_feedback}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 font-sans text-xs" style={{ color: "#FFFFFF" }}>
                    {sub.submitted_date ? new Date(sub.submitted_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}