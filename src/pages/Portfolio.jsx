import React, { useState, useEffect } from "react";
import { font } from "@/lib/tokens";
import { api } from "@/api/apiClient";
import { useQuery } from "@tanstack/react-query";
import { createPageUrl } from "../utils";
import { ExternalLink, Lock, Globe } from "lucide-react";
import { Stagger, StaggerItem } from "@/lib/motion";
import AvatarFrame from "../components/gamification/AvatarFrame";
import { rankInfo, readCachedXp } from "../components/gamification/rank";

const C = {
  bg: "#070B0A",
  panel: "#0C1210",
  border: "#17201C",
  green: "#5ED29C",
  teal: "#34D0C4",
  text: "#ECF3EF",
  t92: "rgba(255,255,255,.92)",
  t62: "rgba(255,255,255,.62)",
};

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

  const firstName = user.name?.split(" ")[0] || user.email?.split("@")[0] || "Your";
  const rank = rankInfo(readCachedXp());

  return (
    <div className="min-h-screen" style={{ background: "transparent" }}>
      <div className="relative px-8 lg:px-16 pt-28 pb-16" style={{ borderBottom: `1px solid ${C.border}` }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.green}, transparent)` }} />
        <div className="max-w-5xl mx-auto flex items-center gap-5">
          <AvatarFrame tier={rank.tier} initial={firstName} size={72} />
          <div className="min-w-0">
            <h1 style={{ fontFamily: font.display, fontSize: "clamp(2.2rem, 5vw, 3.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: C.text, lineHeight: 1.1, margin: "0 0 8px" }}>
              {firstName}'s builds.
            </h1>
            <p className="text-sm" style={{ color: C.t62, fontFamily: font.display }}>
              <span style={{ color: rank.color, fontWeight: 600 }}>{rank.name}</span>
              <span> · {rank.xp.toLocaleString()} XP · </span>
              {submissions.length > 0
                ? `${submissions.length} capstone${submissions.length > 1 ? "s" : ""} shipped`
                : "no capstones yet"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 lg:px-16 py-12">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 animate-pulse rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-24 rounded-2xl" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
            <h2 className="u-display" style={{ fontSize: "1.3rem", fontWeight: 700, color: C.text, margin: "0 0 10px" }}>
              No capstones shipped yet
            </h2>
            <p className="text-base mb-8" style={{ color: C.t62, fontFamily: font.display }}>
              Complete the AI track to submit your first capstone and start your portfolio.
            </p>
            <div className="flex justify-center">
              <a
                href={createPageUrl("AITrack")}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-sans text-sm font-bold transition-all duration-200"
                style={{ background: C.green, color: C.bg }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 10px 30px -8px ${C.green}aa`; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
              >
                Explore AI track
              </a>
            </div>
          </div>
        ) : (
          <Stagger className="flex flex-col gap-3" as="div">
            {submissions.map((sub) => (
              <StaggerItem key={sub.id} className="group" as="div">
                <div className="rounded-2xl p-6 transition-colors duration-200" style={{ background: C.panel, border: `1px solid ${C.border}` }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${C.green}55`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-semibold" style={{ color: C.green }}>Capstone</span>
                        <span className="text-xs inline-flex items-center gap-1" style={{ color: C.t62 }}>
                          {sub.is_public ? <Globe size={11} /> : <Lock size={11} />}
                          {sub.is_public ? "public" : "private"}
                        </span>
                      </div>
                      <h3 className="u-display" style={{ fontSize: "1.2rem", fontWeight: 700, color: C.text, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
                        {sub.project_title}
                      </h3>
                      {sub.description && (
                        <p className="text-sm line-clamp-2" style={{ color: C.t92, fontFamily: font.display }}>
                          {sub.description}
                        </p>
                      )}
                    </div>

                    {sub.demo_url && (
                      <a
                        href={sub.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg shrink-0 transition-colors duration-150"
                        style={{ color: C.green, border: `1px solid ${C.green}44`, background: `${C.green}12` }}
                        onMouseEnter={e => e.currentTarget.style.background = `${C.green}22`}
                        onMouseLeave={e => e.currentTarget.style.background = `${C.green}12`}
                      >
                        <ExternalLink size={12} />
                        Demo
                      </a>
                    )}
                  </div>

                  {sub.ai_feedback && (
                    <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: "#080C0A", borderLeft: `2px solid ${C.teal}55` }}>
                      <span className="text-xs font-semibold" style={{ color: C.teal }}>Review: </span>
                      <span className="text-xs leading-relaxed" style={{ color: C.t92, fontFamily: font.display }}>
                        {sub.ai_feedback}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 text-xs" style={{ color: C.t62 }}>
                    {sub.submitted_date ? new Date(sub.submitted_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
