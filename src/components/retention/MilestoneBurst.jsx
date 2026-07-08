import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy, Flame, Award } from "lucide-react";
import { checkMilestones, RETENTION_CHANGED_EVENT } from "@/lib/retention";
import { getStreakInfo } from "@/lib/progressStats";
import { getSolvedLabs } from "@/lib/playgroundProgress";
import { getChallengeStats } from "@/api/progressStore";
import { getLevel } from "@/components/gamification/XPLevelBar";
import { KIT } from "@/components/ui/kit";

const _levelRef = getLevel;

const ICON_FOR = { streak: Flame, lessons: Trophy, level: Trophy, labs: Award };

const SPARKS = [
  { dx: -70, dy: -54 },
  { dx: 66, dy: -60 },
  { dx: -88, dy: 20 },
  { dx: 84, dy: 28 },
  { dx: -30, dy: -84 },
  { dx: 38, dy: -78 },
  { dx: 0, dy: 88 },
  { dx: -58, dy: 66 },
];

export default function MilestoneBurst() {
  const [milestone, setMilestone] = useState(null);
  const reduce = useReducedMotion();

  const evaluate = useCallback(() => {
    let hit = null;
    try {
      hit = checkMilestones({
        streak: getStreakInfo().current,
        lessonsDone: getChallengeStats().completed,
        labsSolved: getSolvedLabs().length,
        level: 0,
      });
    } catch {
      hit = null;
    }
    if (hit) setMilestone(hit);
  }, []);

  useEffect(() => {
    evaluate();
    window.addEventListener(RETENTION_CHANGED_EVENT, evaluate);
    window.addEventListener("focus", evaluate);
    return () => {
      window.removeEventListener(RETENTION_CHANGED_EVENT, evaluate);
      window.removeEventListener("focus", evaluate);
    };
  }, [evaluate]);

  useEffect(() => {
    if (!milestone) return;
    const t = setTimeout(() => setMilestone(null), 3500);
    return () => clearTimeout(t);
  }, [milestone]);

  const Icon = milestone ? ICON_FOR[milestone.kind] || Trophy : Trophy;

  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          key={milestone.id}
          className="fixed inset-0 z-[95] flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.button
            type="button"
            onClick={() => setMilestone(null)}
            className="pointer-events-auto relative flex flex-col items-center text-center rounded-3xl px-10 py-9 focus:outline-none"
            style={{
              background: "linear-gradient(135deg, #221F17 0%, #1B1913 100%)",
              border: `1px solid ${KIT.borderHi}`,
              boxShadow: `0 24px 70px -20px ${KIT.amber}88, 0 0 0 1px ${KIT.border}`,
            }}
            initial={{ scale: reduce ? 1 : 0.9, opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: reduce ? 1 : 0.94, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            aria-label={`Milestone: ${milestone.label}. Tap to dismiss.`}
          >
            {}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 38%, ${KIT.amber}33, transparent 68%)` }}
              aria-hidden="true"
            />

            {}
            {!reduce &&
              SPARKS.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    top: "38%",
                    left: "50%",
                    width: 7,
                    height: 7,
                    background: KIT.gold,
                    boxShadow: `0 0 8px ${KIT.amber}`,
                  }}
                  initial={{ x: 0, y: 0, scale: 0.2, opacity: 0 }}
                  animate={{ x: s.dx, y: s.dy, scale: [0.2, 1, 0.4], opacity: [0, 1, 0] }}
                  transition={{ duration: 0.9, delay: 0.05 + i * 0.02, ease: "easeOut" }}
                  aria-hidden="true"
                />
              ))}

            <motion.div
              className="relative flex items-center justify-center rounded-2xl mb-4"
              style={{
                width: 68,
                height: 68,
                background: KIT.goldGrad,
                boxShadow: `0 8px 26px -6px ${KIT.amber}cc`,
              }}
              initial={reduce ? false : { rotate: -12, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 360, damping: 16, delay: 0.05 }}
            >
              <Icon size={34} color={KIT.bg} strokeWidth={2.4} />
            </motion.div>

            <div
              className="relative text-[0.68rem] font-bold uppercase tracking-[0.22em] mb-2"
              style={{ color: KIT.amber, fontFamily: KIT.mono }}
            >
              Milestone
            </div>
            <div
              className="relative font-extrabold leading-tight"
              style={{ color: KIT.white, fontSize: "1.6rem", letterSpacing: "-0.02em" }}
            >
              {milestone.label}
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
