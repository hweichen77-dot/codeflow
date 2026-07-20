import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useAuth } from "@/lib/AuthContext";
import { isDesktop } from "@/lib/desktopAuth";
import { PageTransition } from "@/lib/motion";
import MilestoneBurst from "@/components/retention/MilestoneBurst";
import FirstWinOnboarding from "@/components/retention/FirstWinOnboarding";

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navGroups = [
    {
      name: "Learn",
      links: [
        { label: "AI Track", page: "AITrack" },
        { label: "AP CS", page: "APCS" },
        { label: "Compete", page: "Competitive" },
      ],
    },
    {
      name: "Practice",
      links: [
        { label: "Projects", page: "Projects" },
        { label: "Challenges", page: "Challenges" },
        { label: "Playground", page: "Playground", badge: "Live" },
      ],
    },
  ];
  const showFullNav = Boolean(user) || isDesktop;

  const isActive = (page) => currentPageName === page;

  if (currentPageName === "Home") return <>{children}</>;

  return (
    <div style={{ background: "#070B0A", minHeight: "100vh" }}>
      <div className="cf-grain" aria-hidden="true" />
      {user && <MilestoneBurst />}
      {user && <FirstWinOnboarding />}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] font-sans text-xs tracking-widest uppercase px-4 py-2"
        style={{ background: "#5ED29C", color: "#070B0A" }}
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(21,19,14,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #17201C" : "1px solid transparent",
          height: scrolled ? "52px" : "64px",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between h-full px-8 lg:px-16"
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <span
              className="inline-flex items-center justify-center rounded-md transition-all duration-200"
              style={{
                fontFamily: "'Spline Sans Mono Variable', ui-monospace, monospace",
                fontSize: "13px",
                fontWeight: 600,
                color: "#5ED29C",
                background: "rgba(94,210,156,0.1)",
                border: "1px solid rgba(94,210,156,0.24)",
                width: "26px",
                height: "26px",
                lineHeight: 1,
              }}
            >
              {">_"}
            </span>
            <span
              className="inline-flex items-center transition-colors duration-200"
              style={{ color: "#ECF3EF", fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, fontSize: "17px", letterSpacing: "-0.01em", lineHeight: 1 }}
            >
              Compilearn
            </span>
          </Link>

          {showFullNav && (
          <div className="hidden md:flex items-center gap-0">
            {navGroups.map((group, gi) => (
              <React.Fragment key={group.name}>
                {gi > 0 && (
                  <span aria-hidden="true" className="mx-2 lg:mx-3 w-px h-4" style={{ background: "#17201C" }} />
                )}
                {group.links.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    aria-label={link.badge ? `${link.label} — ${link.badge}` : undefined}
                    className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 lg:px-4 py-2 transition-all duration-150 relative inline-flex items-center gap-1.5"
                    style={{
                      color: isActive(link.page) ? "#5ED29C" : "#B7C6BE",
                    }}
                    onMouseEnter={e => {
                      if (!isActive(link.page)) e.currentTarget.style.color = "#7FE0B0";
                    }}
                    onMouseLeave={e => {
                      if (!isActive(link.page)) e.currentTarget.style.color = "#B7C6BE";
                    }}
                  >
                    {isActive(link.page) && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4"
                        style={{ background: "#5ED29C" }}
                      />
                    )}
                    {link.label}
                    {link.badge && (
                      <span
                        aria-hidden="true"
                        className="font-sans px-1.5 py-0.5 leading-none rounded-sm"
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.06em",
                          color: "#ECF3EF",
                          border: "1px solid #17201C",
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div>
          )}

          <div className={showFullNav ? "hidden md:flex items-center gap-3" : "flex items-center gap-2"}>
            {user ? (
              <>
                {[{ label: "Portfolio", page: "Portfolio" }].map((p) => (
                  <Link
                    key={p.page}
                    to={createPageUrl(p.page)}
                    className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 py-2 transition-all duration-150"
                    style={{ color: isActive(p.page) ? "#5ED29C" : "#B7C6BE" }}
                    onMouseEnter={e => { if (!isActive(p.page)) e.currentTarget.style.color = "#7FE0B0"; }}
                    onMouseLeave={e => { if (!isActive(p.page)) e.currentTarget.style.color = "#B7C6BE"; }}
                  >
                    {p.label}
                  </Link>
                ))}
                <span className="font-sans text-xs whitespace-nowrap" style={{ color: "#ECF3EF" }}>
                  {user.name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={logout}
                  className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 py-2 transition-all duration-150"
                  style={{ color: "#ECF3EF", border: "1px solid #17201C" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#B7C6BE"; e.currentTarget.style.borderColor = "#17201C"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#B7C6BE"; e.currentTarget.style.borderColor = "#17201C"; }}
                >
                  Exit
                </button>
              </>
            ) : (
              <>
              <button
                onClick={() => navigate("/login")}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150"
                style={{ color: "#5ED29C", border: "1px solid #5ED29C33", background: "#5ED29C10" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#5ED29C20";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#5ED29C10";
                  e.currentTarget.style.transform = "";
                }}
              >
                Sign In →
              </button>
              <button
                onClick={() => navigate("/login")}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150"
                style={{ color: "#070B0A", border: "1px solid #5ED29C", background: "#5ED29C" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; }}
              >
                Start
              </button>
              </>
            )}
          </div>

          {showFullNav && (
          <button
            className="md:hidden font-sans text-xs tracking-widest uppercase p-2 transition-colors"
            style={{ color: mobileOpen ? "#5ED29C" : "#ECF3EF" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? "[ X ]" : "[ = ]"}
          </button>
          )}
        </div>

        {showFullNav && mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden px-8 py-4 space-y-1"
            style={{ background: "#070B0A", borderTop: "1px solid #17201C" }}
          >
            {navGroups.map((group) => (
              <div key={group.name} className="mb-2">
                <div className="font-sans text-[10px] tracking-[0.18em] uppercase px-4 pt-2 pb-1" style={{ color: "#7C8D85" }}>
                  {group.name}
                </div>
                {group.links.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.badge ? `${link.label} — ${link.badge}, optional advanced track` : undefined}
                    className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                    style={{ color: isActive(link.page) ? "#5ED29C" : "#B7C6BE" }}
                  >
                    {link.label}
                    {link.badge && (
                      <span
                        aria-hidden="true"
                        className="font-sans px-1.5 py-0.5 leading-none rounded-sm"
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.06em",
                          color: "#ECF3EF",
                          border: "1px solid #17201C",
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
            <div style={{ borderTop: "1px solid #17201C", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
              {user ? (
                <>
                <Link
                  to={createPageUrl("Portfolio")}
                  onClick={() => setMobileOpen(false)}
                  className="block font-sans text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                  style={{ color: "#ECF3EF" }}
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="font-sans text-xs tracking-widest uppercase w-full text-left px-4 py-3"
                  style={{ color: "#ECF3EF" }}
                >
                  Sign Out
                </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-3"
                  style={{ color: "#5ED29C" }}
                >
                  Sign In →
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main id="main-content">
        <PageTransition pageKey={currentPageName}>{children}</PageTransition>
      </main>
    </div>
  );
}