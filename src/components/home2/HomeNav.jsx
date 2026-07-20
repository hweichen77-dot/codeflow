import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomeNav() {
  const navigate = useNavigate();
  return (
    <nav style={{ borderBottom: "1px solid #17201C", padding: "0 2rem" }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0C1210" />
            <path d="M9 10 L15 16 L9 22" stroke="#5ED29C" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="18" y="14.6" width="6" height="2.8" rx="1.4" fill="#5ED29C" />
            <path d="M8.5 25.5 C11.5 25.5 11.5 22.7 14.5 22.7 C17.5 22.7 17.5 25.5 20.5 25.5 C22.4 25.5 23 24.6 23.5 23.8" stroke="#5ED29C" strokeWidth="2.2" strokeLinecap="round" opacity="0.5" />
          </svg>
          <span style={{ color: "#ECF3EF", fontSize: "17px", fontWeight: 700, letterSpacing: "-0.3px" }}>Compilearn</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <div style={{ display: "flex", gap: "28px" }} className="cf-nav-links">
            {["Learn", "Projects"].map(link => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                style={{ color: "#FFFFFF", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
                onMouseEnter={e => e.currentTarget.style.color = "#ECF3EF"}
                onMouseLeave={e => e.currentTarget.style.color = "#ECF3EF"}
              >
                {link}
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate("/login")}
            style={{
            background: "#5ED29C",
            color: "#070B0A",
            border: "none",
            borderRadius: "2px",
            padding: "8px 18px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}>
            Start a track
          </button>
        </div>
      </div>
    </nav>
  );
}