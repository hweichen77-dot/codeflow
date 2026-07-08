import React from "react";
import { color } from "@/lib/tokens";

const Bar = ({ w = "100%", h = 14, mb = 0, style }) => (
  <div
    className="animate-pulse"
    style={{ width: w, height: h, marginBottom: mb, background: color.surfaceAlt, borderRadius: 2, ...style }}
  />
);

export default function AppSkeleton() {
  return (
    <div className="fixed inset-0 flex" style={{ background: color.bg }} aria-hidden="true">
      {}
      <div
        className="hidden md:flex flex-col flex-shrink-0"
        style={{ width: 232, borderRight: `1px solid ${color.border}`, padding: "28px 20px" }}
      >
        <Bar w={120} h={20} mb={28} />
        {[88, 72, 80, 64, 76, 60].map((w, i) => (
          <Bar key={i} w={`${w}%`} h={13} mb={18} />
        ))}
        <div style={{ flex: 1 }} />
        <Bar w="60%" h={12} />
      </div>

      {}
      <div className="flex-1 overflow-hidden" style={{ padding: "72px clamp(2rem, 6vw, 4rem)" }}>
        <div style={{ maxWidth: 1024, margin: "0 auto" }}>
          <Bar w={96} h={11} mb={16} />
          <Bar w="42%" h={44} mb={14} />
          <Bar w="60%" h={14} mb={48} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{ border: `1px solid ${color.border}`, background: color.surface, padding: 24 }}
              >
                <Bar w="50%" h={12} mb={16} />
                <Bar w="85%" h={18} mb={10} />
                <Bar w="70%" h={12} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
