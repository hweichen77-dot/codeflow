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
    { label: "Projects", page: "Projects" },
    { label: "Challenges", page: "Challenges" },
    { label: "Compete", page: "Competitive" },
    { label: "Dashboard", page: "Dashboard" },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] font-mono text-xs tracking-widest uppercase px-4 py-2"
        style={{ background: "#b8ff00", color: "#0a0a0a" }}
      >
        Skip to content
      </a>
      {/* Sticky nav */}
      <nav
        aria-label="Primary"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
          height: scrolled ? "52px" : "64px",
        }}
      >
        <div
          className="max-w-7xl mx-auto flex items-center justify-between h-full px-8 lg:px-16"
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="font-mono font-bold text-sm tracking-widest uppercase transition-all duration-200"
              style={{ color: "#b8ff00" }}
            >
              CF
            </div>
            <div
              className="w-px h-4 transition-all duration-200"
              style={{ background: "#2a2a2a" }}
            />
            <span
              className="font-mono text-xs tracking-widest uppercase transition-colors duration-200"
              style={{ color: "#d4d4d4" }}
            >
              CodeFlow
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                className="font-mono text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150 relative"
                style={{
                  color: isActive(link.page) ? "#b8ff00" : "#d4d4d4",
                }}
                onMouseEnter={e => {
                  if (!isActive(link.page)) e.currentTarget.style.color = "#bbb";
                }}
                onMouseLeave={e => {
                  if (!isActive(link.page)) e.currentTarget.style.color = "#d4d4d4";
                }}
              >
                {isActive(link.page) && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-4"
                    style={{ background: "#b8ff00" }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={createPageUrl("Portfolio")}
                  className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: isActive("Portfolio") ? "#b8ff00" : "#d4d4d4" }}
                  onMouseEnter={e => { if (!isActive("Portfolio")) e.currentTarget.style.color = "#bbb"; }}
                  onMouseLeave={e => { if (!isActive("Portfolio")) e.currentTarget.style.color = "#d4d4d4"; }}
                >
                  Portfolio
                </Link>
                <span className="font-mono text-xs" style={{ color: "#d4d4d4" }}>
                  {user.name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={logout}
                  className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: "#d4d4d4", border: "1px solid #2a2a2a" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#d4d4d4"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#d4d4d4"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                >
                  Exit
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="font-mono text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150"
                style={{ color: "#b8ff00", border: "1px solid #b8ff0033", background: "#b8ff0010" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#b8ff0020";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "#b8ff0010";
                  e.currentTarget.style.transform = "";
                }}
              >
                Sign In →
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden font-mono text-xs tracking-widest uppercase p-2 transition-colors"
            style={{ color: mobileOpen ? "#b8ff00" : "#e8e8e8" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
          >
            {mobileOpen ? "[ X ]" : "[ = ]"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-nav-menu"
            className="md:hidden px-8 py-4 space-y-1"
            style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                onClick={() => setMobileOpen(false)}
                className="block font-mono text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                style={{ color: isActive(link.page) ? "#b8ff00" : "#d4d4d4" }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
              {user ? (
                <>
                <Link
                  to={createPageUrl("Portfolio")}
                  onClick={() => setMobileOpen(false)}
                  className="block font-mono text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                  style={{ color: "#d4d4d4" }}
                >
                  Portfolio
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); logout(); }}
                  className="font-mono text-xs tracking-widest uppercase w-full text-left px-4 py-3"
                  style={{ color: "#d4d4d4" }}
                >
                  Sign Out
                </button>
                </>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); navigate("/login"); }}
                  className="font-mono text-xs tracking-widest uppercase px-4 py-3"
                  style={{ color: "#b8ff00" }}
                >
                  Sign In →
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page content */}
      <main id="main-content">{children}</main>
    </div>
  );
}