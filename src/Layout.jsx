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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NAV = [
    { label: "Projects", page: "Projects" },
    { label: "Challenges", page: "Challenges" },
    { label: "Dashboard", page: "Dashboard" },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a", color: "#e8e8e8" }}>
      {/* Navbar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(10,10,10,0.95)" : "rgba(10,10,10,0.7)",
          backdropFilter: scrolled ? "blur(20px)" : "blur(8px)",
          borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
          height: scrolled ? "52px" : "64px",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            to={createPageUrl("Home")}
            className="flex items-center gap-3 group"
          >
            <div
              className="w-5 h-5 flex-shrink-0 transition-all duration-200 group-hover:shadow-[0_0_12px_rgba(184,255,0,0.4)]"
              style={{ background: "#b8ff00" }}
            />
            <span
              className="font-display font-black text-sm tracking-tight transition-colors"
              style={{ color: "#e8e8e8", letterSpacing: "-0.02em" }}
            >
              Code<span style={{ color: "#b8ff00" }}>Flow</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className="relative font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                style={{
                  color: isActive(item.page) ? "#e8e8e8" : "#444",
                }}
                onMouseEnter={e => { if (!isActive(item.page)) e.currentTarget.style.color = "#888"; }}
                onMouseLeave={e => { if (!isActive(item.page)) e.currentTarget.style.color = "#444"; }}
              >
                {item.label}
                {isActive(item.page) && (
                  <span
                    className="absolute bottom-0 left-4 right-4 h-px"
                    style={{ background: "#b8ff00" }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs" style={{ color: "#333" }}>
                  {user.full_name || user.email}
                </span>
                <button
                  onClick={() => base44.auth.logout()}
                  className="font-mono text-xs tracking-widest uppercase px-4 py-2 transition-all duration-150"
                  style={{ color: "#333", border: "1px solid #1e1e1e" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#333"; e.currentTarget.style.borderColor = "#1e1e1e"; }}
                >
                  sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => base44.auth.redirectToLogin()}
                className="font-mono text-xs tracking-widest uppercase px-5 py-2 transition-all duration-150"
                style={{
                  background: "#b8ff00",
                  color: "#0a0a0a",
                  border: "1px solid #b8ff00",
                  fontWeight: 700,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = "0 0 16px rgba(184,255,0,0.25)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.transform = "";
                }}
              >
                Sign in →
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden font-mono text-xs"
            style={{ color: "#555" }}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? "✕ close" : "≡ menu"}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-8 py-6 space-y-4"
            style={{ background: "#080808", borderTop: "1px solid #1a1a1a" }}
          >
            {NAV.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileOpen(false)}
                className="block font-mono text-xs tracking-widest uppercase py-2 transition-colors"
                style={{ color: isActive(item.page) ? "#b8ff00" : "#444" }}
              >
                {item.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: "1rem", marginTop: "0.5rem" }}>
              {user ? (
                <button
                  onClick={() => base44.auth.logout()}
                  className="font-mono text-xs tracking-widest uppercase"
                  style={{ color: "#444" }}
                >
                  sign out
                </button>
              ) : (
                <button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="font-mono text-xs tracking-widest uppercase px-5 py-2.5 w-full"
                  style={{ background: "#b8ff00", color: "#0a0a0a", fontWeight: 700 }}
                >
                  Sign in →
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