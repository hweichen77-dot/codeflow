import React, { useEffect, useState, useCallback } from "react";
import { Flame, Snowflake, Check } from "lucide-react";
import {
  getDailyStatus,
  getDailyGoal,
  setDailyGoal,
  RETENTION_CHANGED_EVENT,
} from "@/lib/retention";
import { getStreakInfo } from "@/lib/progressStats";
import { Card, Eyebrow, ProgressBar, KIT } from "@/components/ui/kit";
import { CountUp, Pulse } from "@/lib/motion";

export default function DailyGoal() {
  const [status, setStatus] = useState(() => getDailyStatus());
  const [streak, setStreak] = useState(() => getStreakInfo());

  const refresh = useCallback(() => {
    setStatus(getDailyStatus());
    setStreak(getStreakInfo());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(RETENTION_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener(RETENTION_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const step = useCallback(
    (delta) => {
      const next = Math.max(1, Math.min(10, getDailyGoal() + delta));
      setDailyGoal(next);
      refresh();
    },
    [refresh]
  );

  const { done, goal, met, pct } = status;
  const { current, freezes, atRisk } = streak;

  const stepBtn =
    "w-6 h-6 rounded-md inline-flex items-center justify-center text-sm leading-none transition-colors";
  const stepStyle = {
    background: KIT.cardHi,
    border: `1px solid ${KIT.border}`,
    color: KIT.dim,
    fontFamily: KIT.mono,
  };

  return (
    <Card className="p-5" accent={met ? KIT.emerald : KIT.amber}>
      <div className="flex items-center justify-between">
        <Eyebrow>Today</Eyebrow>
        {}
        <div className="inline-flex items-center gap-1.5" title="Daily goal (lessons)">
          <button
            type="button"
            aria-label="Lower daily goal"
            onClick={() => step(-1)}
            disabled={goal <= 1}
            className={stepBtn}
            style={{ ...stepStyle, opacity: goal <= 1 ? 0.4 : 1 }}
          >
            &minus;
          </button>
          <span
            className="text-[11px] tabular-nums w-4 text-center"
            style={{ color: KIT.dim, fontFamily: KIT.mono }}
          >
            {goal}
          </span>
          <button
            type="button"
            aria-label="Raise daily goal"
            onClick={() => step(1)}
            disabled={goal >= 10}
            className={stepBtn}
            style={{ ...stepStyle, opacity: goal >= 10 ? 0.4 : 1 }}
          >
            +
          </button>
        </div>
      </div>

      {}
      <div className="mt-4 flex items-baseline gap-2">
        <span
          className="tabular-nums"
          style={{ fontSize: "2rem", fontWeight: 800, color: KIT.white, lineHeight: 1 }}
        >
          <CountUp to={done} />
          <span style={{ color: KIT.dim, fontWeight: 700 }}>/{goal}</span>
        </span>
        <span className="text-xs" style={{ color: KIT.dim }}>
          lessons today
        </span>
      </div>

      <div className="mt-3">
        <ProgressBar pct={pct} color={met ? KIT.emerald : undefined} />
      </div>

      {met && (
        <div
          className="mt-2 inline-flex items-center gap-1.5 text-xs"
          style={{ color: KIT.emerald, fontWeight: 600 }}
        >
          <Check size={14} />
          Goal met — nice.
        </div>
      )}

      {}
      <div
        className="mt-4 pt-4 flex items-center gap-2"
        style={{ borderTop: `1px solid ${KIT.border}` }}
      >
        {current > 0 ? (
          <Pulse color={KIT.ember}>
            <Flame size={16} style={{ color: KIT.ember }} />
          </Pulse>
        ) : (
          <Flame size={16} style={{ color: KIT.dim }} />
        )}
        <span className="text-sm" style={{ color: KIT.white, fontWeight: 600 }}>
          {current} day streak
        </span>
        {freezes > 0 && (
          <span
            className="ml-auto inline-flex items-center gap-1 text-xs tabular-nums"
            style={{ color: KIT.dim }}
            title="Streak freezes protect a missed day."
          >
            <Snowflake size={13} style={{ color: KIT.amber }} />
            {freezes}
          </span>
        )}
      </div>

      {}
      {atRisk && (
        <div className="mt-2 text-xs" style={{ color: KIT.amber }}>
          Do one lesson to keep your {current}-day streak.
        </div>
      )}
    </Card>
  );
}
