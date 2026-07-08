import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { getWeeklyRecap, markWeeklyRecapShown } from "@/lib/retention";
import { Eyebrow, KIT, PrimaryButton } from "@/components/ui/kit";
import { CountUp } from "@/lib/motion";
import { font } from "@/lib/tokens";
import { useDialogA11y } from "@/lib/useDialogA11y";

export default function WeeklyRecapModal({ progress = [], onClose }) {
  const r = getWeeklyRecap(progress);
  const activities = r.activities;

  useEffect(() => {
    markWeeklyRecapShown();
  }, []);

  const dialogRef = useDialogA11y(onClose);

  const stats = [
    { label: "Activities", value: activities, sub: "lessons, labs & challenges" },
    { label: "XP earned", value: r.xp, sub: "this week" },
    { label: "Lessons", value: r.lessons, sub: "completed" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Weekly recap"
    >
      <motion.div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-2xl p-6 sm:p-8"
        style={{ background: KIT.card, border: `1px solid ${KIT.borderHi}`, outline: "none" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1.5 transition-colors"
          style={{ color: KIT.dim }}
          onMouseEnter={(e) => { e.currentTarget.style.color = KIT.text; e.currentTarget.style.background = KIT.cardHi; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = KIT.dim; e.currentTarget.style.background = "transparent"; }}
        >
          <X size={18} />
        </button>

        <Eyebrow color={KIT.amber} className="mb-3">Your week</Eyebrow>

        <h2
          style={{ fontFamily: font.display, fontSize: "1.9rem", fontWeight: 800, color: KIT.white, lineHeight: 1.1 }}
        >
          {r.activeDays} active {r.activeDays === 1 ? "day" : "days"} this week
        </h2>

        <div className="mt-6 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-3.5"
              style={{ background: KIT.bg, border: `1px solid ${KIT.border}` }}
            >
              <Eyebrow caret={false} className="mb-2 !text-[10px]">{s.label}</Eyebrow>
              <div style={{ fontFamily: font.display, fontSize: "1.5rem", fontWeight: 800, color: KIT.white, lineHeight: 1 }}>
                <CountUp to={Number(s.value) || 0} />
              </div>
              <div className="mt-1 text-[11px]" style={{ color: KIT.dim }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm" style={{ color: KIT.dim }}>
          Keep it going next week.
        </p>

        <div className="mt-6 flex justify-end">
          <PrimaryButton onClick={onClose} arrow={false}>Keep learning</PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
