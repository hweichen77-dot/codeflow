import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Home, Sparkles, GraduationCap, Trophy, Boxes, Terminal,
  FlaskConical, User, Search, LogOut, ArrowRight,
} from "lucide-react";
import { createPageUrl } from "./utils";
import { useAuth } from "@/lib/AuthContext";
import { PageTransition } from "@/lib/motion";
import MilestoneBurst from "@/components/retention/MilestoneBurst";
import FirstWinOnboarding from "@/components/retention/FirstWinOnboarding";
import InventoryStrip from "@/components/gamification/InventoryStrip";

const NAV = [
  { label: "Home", page: "Home", icon: Home },
  { label: "AI Track", page: "AITrack", icon: Sparkles },
  { label: "AP CS", page: "APCS", icon: GraduationCap },
  { label: "Compete", page: "Competitive", icon: Trophy },
  { label: "Projects", page: "Projects", icon: Boxes },
  { label: "Challenges", page: "Challenges", icon: Terminal },
  { label: "Playground", page: "Playground", icon: FlaskConical, amber: true },
];

const MOBILE_TABS = ["Home", "AITrack", "Playground", "Challenges", "Portfolio"];

const SEARCH_DEST = [
  ...NAV,
  { label: "Portfolio", page: "Portfolio", icon: User },
  { label: "Dashboard", page: "Dashboard", icon: Home },
];

function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const inputRef = useRef(null);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return SEARCH_DEST;
    return SEARCH_DEST.filter((d) => d.label.toLowerCase().includes(s));
  }, [q]);

  useEffect(() => {
    if (open) { setQ(""); setTimeout(() => inputRef.current?.focus(), 20); }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && results[0]) { navigate(createPageUrl(results[0].page)); onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, navigate, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[18vh]"
      style={{ background: "rgba(3,6,5,0.72)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search Compilearn"
    >
      <div
        className="w-full max-w-lg overflow-hidden"
        style={{ background: "var(--bg-surface)", border: "1px solid var(--border-default)", borderRadius: 14, boxShadow: "0 24px 64px -12px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4" style={{ borderBottom: "1px solid var(--border-subtle)", height: 52 }}>
          <Search size={16} style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to…"
            aria-label="Search"
            className="t-body w-full bg-transparent outline-none text-sm"
            style={{ caretColor: "var(--accent)" }}
          />
          <kbd className="u-mono t-muted" style={{ fontSize: 11 }}>esc</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto py-2" role="listbox">
          {results.length === 0 && (
            <li className="px-4 py-3 t-muted text-sm">No matches.</li>
          )}
          {results.map((d, i) => {
            const Icon = d.icon || ArrowRight;
            return (
              <li key={d.page} role="option" aria-selected={i === 0}>
                <button
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                  style={{ color: "var(--text-primary)", background: i === 0 ? "rgba(94,210,156,0.08)" : "transparent" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(94,210,156,0.08)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = i === 0 ? "rgba(94,210,156,0.08)" : "transparent")}
                  onClick={() => { navigate(createPageUrl(d.page)); onClose(); }}
                >
                  <Icon size={15} style={{ color: "var(--accent)" }} />
                  <span className="text-sm">{d.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (page) => currentPageName === page;

  if (currentPageName === "Home") {
    return (
      <>
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
        {children}
      </>
    );
  }

  const TOPBAR = 56;

  const navItem = (item, showDivider = false) => {
    const Icon = item.icon;
    const active = isActive(item.page);
    return (
      <React.Fragment key={item.page}>
        {showDivider && <div className="mx-2 h-5 w-px self-center" style={{ background: "var(--border-subtle)" }} />}
        <Link
          to={createPageUrl(item.page)}
          aria-current={active ? "page" : undefined}
          className="group relative flex items-center gap-2 px-3"
          style={{ height: TOPBAR }}
        >
          <Icon size={15} className={active ? "shrink-0 text-[#5ED29C]" : "shrink-0 text-white transition-colors group-hover:text-white/90"} />
          <span className={`u-mono whitespace-nowrap text-[13px] transition-colors ${active ? "font-semibold text-white" : "text-white group-hover:text-white/90"}`}>
            {item.label}
          </span>
          <span aria-hidden className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#5ED29C] transition-opacity duration-200" style={{ opacity: active ? 1 : 0 }} />
        </Link>
      </React.Fragment>
    );
  };

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <div className="cf-grain" aria-hidden="true" />
      {user && <MilestoneBurst />}
      {user && <FirstWinOnboarding />}
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] u-mono text-xs px-4 py-2"
        style={{ background: "var(--accent)", color: "var(--bg-base)" }}
      >
        Skip to content
      </a>

      <header
        className="fixed top-0 left-0 right-0 z-50 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center px-4 sm:px-6"
        style={{ height: TOPBAR, background: "var(--bg-base)", borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="flex min-w-0 items-center gap-1">
          <Link to="/" className="flex items-center gap-2.5 pr-2">
            <span
              className="inline-flex items-center justify-center"
              style={{
                fontFamily: "'Spline Sans Mono Variable', ui-monospace, monospace", fontSize: 13, fontWeight: 700,
                color: "var(--accent)", background: "rgba(94,210,156,0.10)",
                border: "1px solid rgba(94,210,156,0.28)", width: 26, height: 26,
                borderRadius: 6, lineHeight: 1,
              }}
            >
              {">_"}
            </span>
            <span className="t-strong" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>
              Compilearn
            </span>
          </Link>
          <div className="hidden xl:flex">{navItem(NAV[0])}</div>
        </div>

        <nav aria-label="Primary" className="hidden min-w-0 items-center justify-center overflow-hidden xl:flex" style={{ height: TOPBAR }}>
          {NAV.slice(1).map((item, idx) => navItem(item, idx === 3))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex items-center gap-2 px-2.5 sm:px-3 h-8 transition-colors"
            aria-label="Search (Command K)"
            style={{ border: "1px solid var(--border-subtle)", borderRadius: 8, color: "var(--text-strong)", background: "var(--bg-raised)" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
          >
            <Search size={14} />
            <span className="hidden sm:inline text-xs">Search</span>
            <kbd className="hidden sm:inline u-mono" style={{ fontSize: 10, opacity: 0.7 }}>⌘K</kbd>
          </button>

          {user ? (
            <>
              <InventoryStrip compact initial={(user.name?.[0] || user.email?.[0] || "").toUpperCase()} />
              <Link
                to={createPageUrl("Portfolio")}
                aria-current={isActive("Portfolio") ? "page" : undefined}
                className="hidden xl:inline u-mono text-xs transition-colors"
                style={{ color: isActive("Portfolio") ? "var(--accent)" : "var(--text-strong)" }}
              >
                Portfolio
              </Link>
              <span className="hidden lg:inline text-xs t-body">
                {user.name?.split(" ")[0] || user.email?.split("@")[0]}
              </span>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="inline-flex items-center justify-center transition-colors"
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border-subtle)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-strong)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <LogOut size={15} />
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="u-mono text-xs px-4 h-8 transition-transform"
              style={{ color: "var(--bg-base)", background: "var(--accent)", borderRadius: 8, fontWeight: 700 }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
            >
              Start
            </button>
          )}
        </div>
      </header>


      <main
        id="main-content"
        style={{ paddingTop: TOPBAR, paddingBottom: 0 }}
      >
        <div className="pb-16 xl:pb-0">
          <PageTransition pageKey={currentPageName}>{children}</PageTransition>
        </div>
        <footer
          className="px-6 lg:px-10 py-6 flex flex-wrap items-center gap-x-5 gap-y-2 pb-24 xl:pb-6"
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <Link
            to={createPageUrl("Privacy")}
            className="u-mono text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Privacy &amp; your data
          </Link>
          <Link
            to={createPageUrl("Terms")}
            className="u-mono text-xs transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Terms
          </Link>
          <span className="u-mono text-xs" style={{ color: "var(--text-muted)", opacity: 0.7 }}>
            Export or delete your data any time from Privacy.
          </span>
        </footer>
      </main>

      <nav
        aria-label="Primary mobile"
        className="xl:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
        style={{ height: 60, background: "var(--bg-base)", borderTop: "1px solid var(--border-subtle)" }}
      >
        {MOBILE_TABS.map((page) => {
          const item = SEARCH_DEST.find((d) => d.page === page);
          const Icon = item?.icon || Home;
          const active = isActive(page);
          return (
            <Link
              key={page}
              to={createPageUrl(page)}
              aria-current={active ? "page" : undefined}
              className="flex-1 flex flex-col items-center justify-center gap-1"
              style={{ color: active ? "var(--accent)" : "var(--text-muted)" }}
            >
              <Icon size={19} />
              <span className="u-mono" style={{ fontSize: 9, letterSpacing: "0.02em" }}>{item?.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
