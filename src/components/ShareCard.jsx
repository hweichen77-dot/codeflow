import React, { useRef, useState } from "react";
import { font } from "@/lib/tokens";
import { track } from "@/lib/analytics";

const DISPLAY = font.display;
const BODY = font.body;
const MONO = font.mono;

// Off-screen 1200x630 (OG ratio) card rendered to PNG via html2canvas, then
// shared natively (with the image file) or downloaded as a fallback.
export default function ShareCard({ name, level, levelName, totalXP, lessons, challenges, streak, overallPct }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);

  const capture = async () => {
    const node = cardRef.current;
    if (!node) return null;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(node, { backgroundColor: "#15130E", scale: 2, useCORS: true, logging: false });
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  };

  const share = async () => {
    if (busy) return;
    setBusy(true);
    let method = "download";
    try {
      const blob = await capture();
      if (!blob) throw new Error("capture failed");
      const file = new File([blob], "codeflow-progress.png", { type: "image/png" });
      const canShareFile = typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] });
      if (canShareFile) {
        method = "native";
        await navigator.share({
          files: [file],
          title: "My CodeFlow progress",
          text: `Level ${level}: ${lessons} lessons, ${challenges} challenges, ${streak}-day streak on CodeFlow.`,
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "codeflow-progress.png";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
      track("progress_share", { method, surface: "dashboard", level, lessons, challenges, streak });
    } catch (e) {
      // AbortError = user dismissed the native share sheet; not a real failure.
      if (e && e.name !== "AbortError") track("progress_share_error", { message: String(e?.message || e).slice(0, 120) });
    } finally {
      setBusy(false);
    }
  };

  const stat = (value, label, color) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: DISPLAY, fontSize: "64px", fontWeight: 800, letterSpacing: "-0.03em", color: color || "#F2EDE2", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: BODY, fontSize: "18px", letterSpacing: "0.12em", textTransform: "uppercase", color: "#FFFFFF", marginTop: "10px" }}>
        {label}
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={share}
        disabled={busy}
        className="font-sans text-xs tracking-widest uppercase transition-all"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          padding: "10px 18px", border: "1px solid #34302A", background: "transparent",
          color: busy ? "#8F8779" : "#E8A33C", fontFamily: BODY, cursor: busy ? "default" : "pointer",
          borderRadius: "2px",
        }}
        onMouseEnter={(e) => { if (!busy) e.currentTarget.style.borderColor = "#E8A33C"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#34302A"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        {busy ? "Rendering…" : "Share progress"}
      </button>

      {/* Off-screen capture target */}
      <div style={{ position: "fixed", left: "-9999px", top: 0, pointerEvents: "none" }} aria-hidden="true">
        <div
          ref={cardRef}
          style={{
            width: "1200px", height: "630px", background: "#15130E",
            padding: "72px 80px", boxSizing: "border-box", position: "relative",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            borderTop: "4px solid #E8A33C",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ height: "2px", width: "52px", background: "#E8A33C", display: "inline-block" }} />
              <span style={{ fontFamily: BODY, fontSize: "20px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4882E", fontWeight: 600 }}>
                CodeFlow
              </span>
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: "76px", fontWeight: 800, letterSpacing: "-0.035em", color: "#F2EDE2", lineHeight: 1.02, marginTop: "32px" }}>
              {name || "Learner"}
            </div>
            <div style={{ fontFamily: MONO, fontSize: "24px", color: "#E8A33C", marginTop: "14px" }}>
              Level {level} · {levelName} · {totalXP} XP
            </div>
          </div>

          <div style={{ display: "flex", gap: "32px", borderTop: "1px solid #262219", paddingTop: "40px" }}>
            {stat(lessons, "Lessons", "#F2EDE2")}
            {stat(challenges, "Challenges", "#F2EDE2")}
            {stat(`${streak}`, "Day streak", "#E8A33C")}
            {stat(`${overallPct}%`, "Curriculum", "#F2EDE2")}
          </div>

          <div style={{ fontFamily: BODY, fontSize: "18px", color: "#FFFFFF", position: "absolute", right: "80px", bottom: "40px" }}>
            learn to build with AI · codeflow
          </div>
        </div>
      </div>
    </>
  );
}
