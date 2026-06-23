import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ borderBottom: "1px solid #262219", padding: "0 2rem" }}>
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
          <span style={{ color: "#F2EDE2", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>CodeFlow</span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", gap: "28px" }} className="cf-nav-links">
            {["Learn", "Projects"].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{ color: "#C9C1B2", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#F2EDE2"}
                onMouseLeave={e => e.currentTarget.style.color = "#C9C1B2"}
              >
                {link}
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
            background: "#f59e0b",
            color: "#15130E",
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