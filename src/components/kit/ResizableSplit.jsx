import React, { useCallback, useEffect, useRef, useState } from "react";

export function ResizableSplit({
  left,
  right,
  defaultLeft = 50,
  min = 30,
  max = 70,
  storageKey,
  height = "calc(100vh - 140px)",
  className = "",
}) {
  const [pct, setPct] = useState(() => {
    if (storageKey && typeof localStorage !== "undefined") {
      const v = Number(localStorage.getItem(storageKey));
      if (v >= min && v <= max) return v;
    }
    return defaultLeft;
  });
  const ref = useRef(null);
  const dragging = useRef(false);

  const onMove = useCallback(
    (clientX) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.max(min, Math.min(max, ((clientX - r.left) / r.width) * 100));
      setPct(p);
    },
    [min, max]
  );

  useEffect(() => {
    const move = (e) => {
      if (!dragging.current) return;
      onMove(e.touches ? e.touches[0].clientX : e.clientX);
      if (e.cancelable) e.preventDefault();
    };
    const up = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (storageKey) localStorage.setItem(storageKey, String(Math.round(pct)));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
  }, [onMove, pct, storageKey]);

  const start = () => {
    dragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  return (
    <>
      <div ref={ref} className={`hidden lg:flex ${className}`} style={{ height }}>
        <div className="min-w-0 overflow-y-auto pr-3" style={{ width: `${pct}%` }}>
          {left}
        </div>
        <div
          onMouseDown={start}
          onTouchStart={start}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize editor"
          className="group relative w-2 shrink-0 cursor-col-resize"
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10 transition-colors group-hover:bg-[#5ED29C]/60" />
          <div className="absolute left-1/2 top-1/2 h-8 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 transition-colors group-hover:bg-[#5ED29C]" />
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto pl-3">{right}</div>
      </div>
      <div className="space-y-6 lg:hidden">
        {left}
        {right}
      </div>
    </>
  );
}
