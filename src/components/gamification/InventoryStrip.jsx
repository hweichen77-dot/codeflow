import React, { useCallback, useEffect, useState } from "react";
import { Flame, Snowflake } from "lucide-react";
import { rankInfo, readCachedXp } from "./rank";
import AvatarFrame from "./AvatarFrame";
import { getStreakInfo } from "../../lib/progressStats";
import { getDailyStatus, RETENTION_CHANGED_EVENT } from "../../lib/retention";
import { PLAYGROUND_CHANGED_EVENT } from "../../lib/playgroundProgress";

const C = {
  panel: "#0C1210",
  border: "#17201C",
  amber: "#F5A524",
  green: "#5ED29C",
  t62: "rgba(255,255,255,.62)",
};

function readState(totalXP) {
  const xp = totalXP != null ? totalXP : readCachedXp();
  return { info: rankInfo(xp), streak: getStreakInfo(), daily: getDailyStatus() };
}

export default function InventoryStrip({ totalXP, initial = "?", compact = false }) {
  const [s, setS] = useState(() => readState(totalXP));

  const refresh = useCallback(() => setS(readState(totalXP)), [totalXP]);

  useEffect(() => {
    refresh();
    const evs = [RETENTION_CHANGED_EVENT, PLAYGROUND_CHANGED_EVENT, "focus"];
    evs.forEach((e) => window.addEventListener(e, refresh));
    return () => evs.forEach((e) => window.removeEventListener(e, refresh));
  }, [refresh]);

  const { info, streak, daily } = s;
  const hot = streak.current > 0 && streak.activeToday;

  return (
    <div
      className="inline-flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5"
      style={{ background: C.panel, border: `1px solid ${C.border}` }}
    >
      <AvatarFrame tier={info.tier} initial={initial} size={compact ? 32 : 38} spin={!compact} />

      <div className="flex flex-col leading-none">
        <span className="u-display" style={{ fontSize: "0.78rem", fontWeight: 700, color: info.color }}>
          {info.name}
        </span>
        <span className="u-mono" style={{ fontSize: "0.64rem", color: C.t62 }}>
          {info.xp.toLocaleString()} XP
        </span>
      </div>

      <span className="h-6 w-px" style={{ background: C.border }} />

      <span className="inline-flex items-center gap-1.5" title={`${streak.current}-day streak`}>
        <Flame size={16} style={{ color: hot ? C.amber : C.t62, fill: hot ? C.amber : "none" }} />
        <span className="u-mono" style={{ fontSize: "0.8rem", fontWeight: 700, color: hot ? C.amber : C.t62 }}>
          {streak.current}
        </span>
        {streak.freezes > 0 && (
          <span className="inline-flex items-center gap-0.5 u-mono" style={{ fontSize: "0.66rem", color: C.t62 }} title={`${streak.freezes} streak freezes`}>
            <Snowflake size={11} style={{ color: C.amber }} />
            {streak.freezes}
          </span>
        )}
      </span>

      {!compact && (
        <>
          <span className="h-6 w-px" style={{ background: C.border }} />
          <span className="inline-flex items-center gap-1.5" title="Daily XP target">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: daily.met ? C.green : "#2A3A32", boxShadow: daily.met ? `0 0 6px ${C.green}` : "none" }}
            />
            <span className="u-mono" style={{ fontSize: "0.72rem", color: daily.met ? C.green : C.t62 }}>
              {daily.done}/{daily.goal}
            </span>
          </span>
        </>
      )}
    </div>
  );
}
