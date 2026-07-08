import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowRight, Zap, Bell } from "lucide-react";
import { isOnboarded, setOnboarded } from "@/lib/retention";
import { requestNotificationPermission } from "@/lib/notifications";
import { KIT, PrimaryButton, Eyebrow } from "@/components/ui/kit";
import { useDialogA11y } from "@/lib/useDialogA11y";

const CHOICES = [
  {
    to: "/Playground",
    title: "Defend an AI from attack",
    sub: "Live lab · beat a real prompt-injection",
    accent: KIT.emerald,
  },
  {
    to: "/Projects",
    title: "Do your first lesson",
    sub: "Guided · learn one concept end to end",
    accent: KIT.amber,
  },
  {
    to: "/Challenges",
    title: "Try a challenge",
    sub: "Solo · write code, get graded",
    accent: KIT.gold,
  },
];

export default function FirstWinOnboarding() {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();
  const dialogRef = useDialogA11y(() => dismiss(), open);

  if (isOnboarded()) return null;

  const dismiss = () => {
    setOnboarded();
    setOpen(false);
  };

  const enableReminders = async () => {
    try {
      await requestNotificationPermission();
    } catch {

    }
    dismiss();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[92] flex items-center justify-center p-4"
          style={{ background: "rgba(8, 7, 4, 0.72)", backdropFilter: "blur(4px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="Get your first win"
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            className="relative w-full max-w-lg rounded-3xl p-7 sm:p-8"
            style={{
              outline: "none",
              background: "linear-gradient(135deg, #1F1B12 0%, #17140E 100%)",
              border: `1px solid ${KIT.borderHi}`,
              boxShadow: `0 30px 90px -24px ${KIT.amber}55, 0 0 0 1px ${KIT.border}`,
            }}
            initial={{ scale: reduce ? 1 : 0.96, opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: reduce ? 1 : 0.97, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <div
              className="absolute -top-px left-8 right-8 h-px pointer-events-none"
              style={{ background: `linear-gradient(90deg, transparent, ${KIT.amber}88, transparent)` }}
              aria-hidden="true"
            />

            <Eyebrow color={KIT.amber} className="mb-3">Welcome</Eyebrow>
            <h2
              className="font-extrabold leading-tight"
              style={{ color: KIT.white, fontSize: "1.8rem", letterSpacing: "-0.02em" }}
            >
              Get your first win
            </h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: KIT.dim }}>
              Pick one of these, finish it, and you&apos;re on the board. Takes about 5 minutes.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              {CHOICES.map((c) => (
                <Link
                  key={c.to}
                  to={c.to}
                  onClick={dismiss}
                  className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-all duration-200"
                  style={{ background: KIT.card, border: `1px solid ${KIT.border}` }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = c.accent;
                    e.currentTarget.style.background = KIT.cardHi;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = KIT.border;
                    e.currentTarget.style.background = KIT.card;
                  }}
                >
                  <span
                    className="flex items-center justify-center rounded-xl shrink-0"
                    style={{ width: 40, height: 40, background: `${c.accent}1F`, color: c.accent }}
                  >
                    <Zap size={19} strokeWidth={2.4} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-[0.98rem]" style={{ color: KIT.white }}>
                      {c.title}
                    </span>
                    <span className="block text-xs mt-0.5" style={{ color: KIT.dim }}>
                      {c.sub}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    style={{ color: c.accent }}
                  />
                </Link>
              ))}
            </div>

            <div
              className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl px-4 py-3.5"
              style={{ background: KIT.card, border: `1px solid ${KIT.border}` }}
            >
              <span className="flex items-center gap-2.5 flex-1 min-w-0">
                <Bell size={17} style={{ color: KIT.amber }} className="shrink-0" />
                <span className="text-xs sm:text-sm" style={{ color: KIT.dim }}>
                  Get a nudge so you don&apos;t lose your streak
                </span>
              </span>
              <PrimaryButton onClick={enableReminders} arrow={false} className="!px-4 !py-2.5 !text-xs shrink-0">
                Turn on reminders
              </PrimaryButton>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={dismiss}
                className="text-xs font-medium transition-colors duration-150"
                style={{ color: KIT.dim, fontFamily: KIT.mono }}
                onMouseEnter={(e) => (e.currentTarget.style.color = KIT.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = KIT.dim)}
              >
                Skip for now
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
