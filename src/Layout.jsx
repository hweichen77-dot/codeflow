import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Projects", page: "Projects" },
    { label: "Challenges", page: "Challenges" },
    { label: "Dashboard", page: "Dashboard" },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh" }}>
      {/* Sticky nav */}
      <nav
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
          <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
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
              style={{ color: "#555" }}
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
                  color: isActive(link.page) ? "#b8ff00" : "#444",
                }}
                onMouseEnter={e => {
                  if (!isActive(link.page)) e.currentTarget.style.color = "#888";
                }}
                onMouseLeave={e => {
                  if (!isActive(link.page)) e.currentTarget.style.color = "#444";
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
                <span className="font-mono text-xs" style={{ color: "#333" }}>
                  {user.full_name?.split(" ")[0] || user.email?.split("@")[0]}
                </span>
                <button
                  onClick={() => base44.auth.logout()}
                  className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: "#333", border: "1px solid #1e1e1e" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#333"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
                >
                  Exit
                </button>
              </>
            ) : (
              <button
                onClick={() => base44.auth.redirectToLogin()}
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
            style={{ color: mobileOpen ? "#b8ff00" : "#444" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "[ X ]" : "[ = ]"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-8 py-4 space-y-1"
            style={{ background: "#0a0a0a", borderTop: "1px solid #1a1a1a" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.page}
                to={createPageUrl(link.page)}
                onClick={() => setMobileOpen(false)}
                className="block font-mono text-xs tracking-widest uppercase px-4 py-3 transition-colors"
                style={{ color: isActive(link.page) ? "#b8ff00" : "#555" }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
              {user ? (
                <button
                  onClick={() => base44.auth.logout()}
                  className="font-mono text-xs tracking-widest uppercase w-full text-left px-4 py-3"
                  style={{ color: "#444" }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
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
      <main>{children}</main>
    </div>
  );
}