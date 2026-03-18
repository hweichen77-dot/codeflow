import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { base44 } from "@/api/base44Client";
import { Code2, Menu, X, User, LogOut, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
        :root {
          --cf-accent: #6C5CE7;
          --cf-accent-light: #A29BFE;
          --cf-accent-dark: #5A4BD1;
          --cf-surface: #FFFFFF;
          --cf-bg: #FAFAFA;
          --cf-success: #00B894;
          --cf-warning: #FDCB6E;
          --cf-danger: #FF7675;
        }
        * { font-family: 'Inter', system-ui, sans-serif; }
        code, pre, .font-mono { font-family: 'JetBrains Mono', monospace !important; }
      `}</style>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center shadow-lg shadow-purple-200/50 group-hover:shadow-purple-300/60 transition-shadow">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Code<span className="text-[#6C5CE7]">Flow</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.page)
                      ? "bg-[#6C5CE7]/10 text-[#6C5CE7]"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to={createPageUrl("Dashboard")}>
                    <Button variant="ghost" size="sm" className="text-gray-600 gap-2">
                      <User className="w-4 h-4" />
                      {user.full_name || "Dashboard"}
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => base44.auth.logout()}
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white rounded-lg px-5 h-9 text-sm font-medium shadow-lg shadow-purple-200/40"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.page)
                    ? "bg-[#6C5CE7]/10 text-[#6C5CE7]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 mt-3">
              {user ? (
                <>
                  <Link
                    to={createPageUrl("Dashboard")}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => base44.auth.logout()}
                    className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-600"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Button
                  onClick={() => base44.auth.redirectToLogin()}
                  className="w-full bg-[#6C5CE7] hover:bg-[#5A4BD1] text-white"
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main>{children}</main>

      {/* Footer */}
      {currentPageName === "Home" && (
        <footer className="border-t border-gray-100 bg-white mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6C5CE7] to-[#A29BFE] flex items-center justify-center">
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  Code<span className="text-[#6C5CE7]">Flow</span>
                </span>
              </div>
              <p className="text-sm text-gray-400">
                © 2026 CodeFlow. Learn to code by building real projects.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}