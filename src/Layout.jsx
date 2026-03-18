import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { api } from "@/api/apiClient";
import { Code2, Menu, X, User, LogOut, ChevronRight } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    api.auth.me().then(setUser).catch(() => {});
  }, []);

  const navItems = [
    { name: "Home", page: "Home" },
    { name: "Projects", page: "Projects" },
    { name: "Challenges", page: "Challenges" },
  ];

  const isActive = (page) => currentPageName === page;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 font-[Inter,system-ui,sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root {
          --cf-accent: #5B4FE9;
          --cf-surface: #111118;
          --cf-bg: #0f0f0f;
        }
        * { font-family: 'Inter', system-ui, sans-serif; }
        code, pre, .font-mono { font-family: 'JetBrains Mono', monospace !important; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-[#5B4FE9] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Code<span className="text-[#5B4FE9]">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`px-3 py-1.5 text-sm font-medium transition-all duration-200 relative ${
                    isActive(item.page)
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {item.name}
                  {isActive(item.page) && (
                    <span className="absolute -bottom-[1px] left-0 right-0 h-px bg-[#5B4FE9]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to={createPageUrl("Dashboard")}>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-200 transition-colors">
                      <User className="w-3.5 h-3.5" />
                      {user.full_name || "Dashboard"}
                    </button>
                  </Link>
                  <button
                    className="text-gray-600 hover:text-gray-400 transition-colors"
                    onClick={() => api.auth.logout()}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => api.auth.redirectToLogin()}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#5B4FE9] text-white text-sm font-medium rounded-[4px] border border-[#7066f5]/40 hover:bg-[#4d42d4] transition-colors"
                >
                  Get Started
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#0f0f0f] px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.page)
                    ? "text-white bg-[#5B4FE9]/10"
                    : "text-gray-500 hover:text-gray-200 hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/[0.06] mt-3">
              {user ? (
                <>
                  <Link
                    to={createPageUrl("Dashboard")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-200"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => api.auth.logout()}
                    className="block w-full text-left px-4 py-2.5 rounded-md text-sm font-medium text-gray-600 hover:text-gray-400"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => api.auth.redirectToLogin()}
                  className="w-full px-4 py-2.5 bg-[#5B4FE9] text-white text-sm font-medium rounded-[4px] hover:bg-[#4d42d4] transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      {currentPageName === "Home" && (
        <footer className="border-t border-white/[0.06] bg-[#0f0f0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#5B4FE9] flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-bold tracking-tight text-white">
                  Code<span className="text-[#5B4FE9]">Flow</span>
                </span>
              </div>
              <p className="text-xs text-gray-700">
                © 2026 CodeFlow. Learn to code by building real projects.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}