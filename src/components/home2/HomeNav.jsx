import React from "react";
import { Link } from "react-router-dom";

export default function HomeNav() {
  return (
    <nav style={{ borderBottom: "1px solid #1a1a1a", padding: "0 2rem" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#f59e0b", fontSize: "18px", fontWeight: 800, lineHeight: 1 }}>•</span>
          <span style={{ color: "#f0f0f0", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>CodeFlow</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", gap: "28px" }} className="cf-nav-links">
            {["Learn", "Projects", "Pricing"].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{ color: "#d4d4d4", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#f0f0f0"}
                onMouseLeave={e => e.currentTarget.style.color = "#d4d4d4"}
              >
                {link}
              </a>
            ))}
          </div>
          <button style={{
            background: "#f59e0b",
            color: "#0a0a0a",
            border: "none",
            borderRadius: "999px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}