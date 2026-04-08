import React from "react";
import { Check } from "lucide-react";

export default function LessonPointsSummary({
  lessonTitle,
  sectionNumber,
  totalPoints,
  earnedPoints,
  readingComplete,
  quizComplete,
  participationComplete,
  challengeComplete,
  nextLessonTitle,
  onNextLesson,
}) {
  const pct = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  const items = [
    { label: "Reading", done: readingComplete, pts: 2 },
    { label: "Participation Activities", done: participationComplete, pts: 3 },
    { label: "Quiz", done: quizComplete, pts: 3 },
    { label: "Coding Challenge", done: challengeComplete, pts: 2 },
  ];

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
      {/* Header */}
      <div style={{ padding: "20px 28px", borderBottom: "1px solid #e8e8e8" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#222", margin: "0 0 4px" }}>
              Activity summary: {lessonTitle}
            </h3>
          </div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#222" }}>
            {earnedPoints} / {totalPoints} points
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: "4px", background: "#e8e8e8", borderRadius: "2px", marginTop: "12px", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: pct === 100 ? "#2d7a3a" : "#3498db",
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>

      {/* Completion details */}
      <div style={{ padding: "16px 28px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%",
                  background: item.done ? "#2d7a3a" : "#e0e0e0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {item.done && <Check size={12} color="#fff" strokeWidth={3} />}
                </div>
                <span style={{ fontSize: "0.875rem", color: item.done ? "#222" : "#888", fontWeight: item.done ? 500 : 400 }}>
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: "0.8125rem", color: item.done ? "#2d7a3a" : "#bbb", fontWeight: 600 }}>
                {item.done ? `+${item.pts}` : "0"} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next section link */}
      {nextLessonTitle && (
        <div style={{ padding: "14px 28px", borderTop: "1px solid #e8e8e8", textAlign: "right" }}>
          <button
            onClick={onNextLesson}
            style={{
              fontSize: "0.875rem", color: "#2980b9", background: "none", border: "none",
              cursor: "pointer", fontWeight: 500,
            }}
          >
            ↓ {nextLessonTitle}
          </button>
        </div>
      )}
    </div>
  );
}