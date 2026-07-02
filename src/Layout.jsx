import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "./utils";
import { useAuth } from "@/lib/AuthContext";

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

  const navLinks = [
    { label: "AI Track", page: "AITrack" },
    { label: "Playground", page: "Playground", badge: "Live" },
    { label: "AP CS", page: "APCS" },
    { label: "Projects", page: "Projects" },
    { label: "Challenges", page: "Challenges" },
    { label: "Compete", page: "Competitive", badge: "Advanced" },
    { label: "Dashboard", page: "Dashboard" },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div style={{ background: "#15130E", minHeight: "100vh" }}>
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
              style={{ color: "#E8A33C" }}
            >
              CF
            </div>
            <div
              className="w-px h-4 transition-all duration-200"
              style={{ background: "#34302A" }}
            />
            <span
              className="font-sans text-xs tracking-widest uppercase transition-colors duration-200"
              style={{ color: "#C9C1B2" }}
            >
              CodeFlow
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                aria-label={link.badge ? `${link.label} — ${link.badge}, optional advanced track` : undefined}
                className="font-sans text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150 relative inline-flex items-center gap-1.5"
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
                      color: "#8a8a8a",
                      border: "1px solid #34302A",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={createPageUrl("Portfolio")}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: isActive("Portfolio") ? "#E8A33C" : "#C9C1B2" }}
                  onMouseEnter={e => { if (!isActive("Portfolio")) e.currentTarget.style.color = "#A8A092"; }}
                  onMouseLeave={e => { if (!isActive("Portfolio")) e.currentTarget.style.color = "#C9C1B2"; }}
                >
                  Portfolio
                </Link>
                <span className="font-sans text-xs" style={{ color: "#C9C1B2" }}>
                  {user.name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={logout}
                  className="font-sans text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: "#C9C1B2", border: "1px solid #34302A" }}
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
            {navLinks.map((link) => (
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
                      color: "#8a8a8a",
                      border: "1px solid #34302A",
                    }}
                  >
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #262219", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
              {user ? (
                <>
                <Link
                  to={createPageUrl("Portfolio")}
                  onClick={() => setMobileOpen(false)}
                  className="block font-sans text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                  style={{ color: "#C9C1B2" }}
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="font-sans text-xs tracking-widest uppercase w-full text-left px-4 py-3"
                  style={{ color: "#C9C1B2" }}
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

      <main id="main-content">{children}</main>
    </div>
  );
}