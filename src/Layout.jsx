import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useAuth } from "@/lib/AuthContext";
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
  const navLinks = navGroups.flatMap((g) => g.links);

  const isActive = (page) => currentPageName === page;

  return (
    <div style={{ background: "#15130E", minHeight: "100vh" }}>
      <div className="cf-grain" aria-hidden="true" />
      {user && <MilestoneBurst />}
      {user && <FirstWinOnboarding />}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] font-sans text-xs tracking-widest uppercase px-4 py-2"
        style={{ background: "#E8A33C", color: "#15130E" }}
      >
        Skip to content
      </a>
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(21,19,14,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #262219" : "1px solid transparent",
          height: scrolled ? "52px" : "64px",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between h-full px-8 lg:px-16"
        >
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="font-sans font-bold text-sm tracking-widest uppercase transition-all duration-200"
              style={{ color: "#E8A33C", lineHeight: 1 }}
            >
              CF
            </div>
            <div
              className="w-px h-4 transition-all duration-200"
              style={{ background: "#34302A" }}
            />
            <span
              className="inline-flex items-center text-sm tracking-widest uppercase transition-colors duration-200"
              style={{ color: "#FFFFFF", fontFamily: "'Spline Sans Mono Variable', ui-monospace, monospace", lineHeight: 1 }}
            >
              codeflow<span className="cf-cursor" aria-hidden="true" />
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0">
            {navGroups.map((group, gi) => (
              <React.Fragment key={group.name}>
                {gi > 0 && (
                  <span aria-hidden="true" className="mx-2 lg:mx-3 w-px h-4" style={{ background: "#34302A" }} />
                )}
                {group.links.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    aria-label={link.badge ? `${link.label} — ${link.badge}` : undefined}
                    className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 lg:px-4 py-2 transition-all duration-150 relative inline-flex items-center gap-1.5"
                    style={{
                      color: isActive(link.page) ? "#E8A33C" : "#C9C1B2",
                    }}
                    onMouseEnter={e => {
                      if (!isActive(link.page)) e.currentTarget.style.color = "#A8A092";
                    }}
                    onMouseLeave={e => {
                      if (!isActive(link.page)) e.currentTarget.style.color = "#C9C1B2";
                    }}
                  >
                    {isActive(link.page) && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4"
                        style={{ background: "#E8A33C" }}
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
                          color: "#FFFFFF",
                          border: "1px solid #34302A",
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

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {[{ label: "Dashboard", page: "Dashboard" }, { label: "Portfolio", page: "Portfolio" }].map((p) => (
                  <Link
                    key={p.page}
                    to={createPageUrl(p.page)}
                    className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 py-2 transition-all duration-150"
                    style={{ color: isActive(p.page) ? "#E8A33C" : "#C9C1B2" }}
                    onMouseEnter={e => { if (!isActive(p.page)) e.currentTarget.style.color = "#A8A092"; }}
                    onMouseLeave={e => { if (!isActive(p.page)) e.currentTarget.style.color = "#C9C1B2"; }}
                  >
                    {p.label}
                  </Link>
                ))}
                <span className="font-sans text-xs whitespace-nowrap" style={{ color: "#FFFFFF" }}>
                  {user.name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={logout}
                  className="font-sans text-xs tracking-widest uppercase whitespace-nowrap px-3 py-2 transition-all duration-150"
                  style={{ color: "#FFFFFF", border: "1px solid #34302A" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#C9C1B2"; e.currentTarget.style.borderColor = "#34302A"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#C9C1B2"; e.currentTarget.style.borderColor = "#34302A"; }}
                >
                  Exit
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150"
                style={{ color: "#E8A33C", border: "1px solid #E8A33C33", background: "#E8A33C10" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#E8A33C20";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#E8A33C10";
                  e.currentTarget.style.transform = "";
                }}
              >
                Sign In →
              </button>
            )}
          </div>

          <button
            className="md:hidden font-sans text-xs tracking-widest uppercase p-2 transition-colors"
            style={{ color: mobileOpen ? "#E8A33C" : "#ECE7DC" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? "[ X ]" : "[ = ]"}
          </button>
        </div>

        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden px-8 py-4 space-y-1"
            style={{ background: "#15130E", borderTop: "1px solid #262219" }}
          >
            {navGroups.map((group) => (
              <div key={group.name} className="mb-2">
                <div className="font-sans text-[10px] tracking-[0.18em] uppercase px-4 pt-2 pb-1" style={{ color: "#8F8779" }}>
                  {group.name}
                </div>
                {group.links.map((link) => (
                  <Link
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileOpen(false)}
                    aria-label={link.badge ? `${link.label} — ${link.badge}, optional advanced track` : undefined}
                    className="flex items-center gap-2 font-sans text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                    style={{ color: isActive(link.page) ? "#E8A33C" : "#C9C1B2" }}
                  >
                    {link.label}
                    {link.badge && (
                      <span
                        aria-hidden="true"
                        className="font-sans px-1.5 py-0.5 leading-none rounded-sm"
                        style={{
                          fontSize: "8px",
                          letterSpacing: "0.06em",
                          color: "#FFFFFF",
                          border: "1px solid #34302A",
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            ))}
            <div style={{ borderTop: "1px solid #262219", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
              {user ? (
                <>
                <Link
                  to={createPageUrl("Portfolio")}
                  onClick={() => setMobileOpen(false)}
                  className="block font-sans text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                  style={{ color: "#FFFFFF" }}
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="font-sans text-xs tracking-widest uppercase w-full text-left px-4 py-3"
                  style={{ color: "#FFFFFF" }}
                >
                  Sign Out
                </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-3"
                  style={{ color: "#E8A33C" }}
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