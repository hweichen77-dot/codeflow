import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid #1a1a1a",
      padding: "48px 2rem 36px",
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
      }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "48px",
          flexWrap: "wrap",
          gap: "24px",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
              <span style={{ color: "#b8ff00", fontSize: "16px", fontWeight: 800 }}>•</span>
              <span style={{ color: "#f0f0f0", fontSize: "16px", fontWeight: 700, letterSpacing: "-0.3px" }}>CodeFlow</span>
            </div>
            <div style={{ color: "#d4d4d4", fontSize: "13px", fontFamily: "monospace" }}>
              Learn AI. Build things.
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "28px" }}>
            <a
              href="https://github.com/hweichen77-dot/codeflow"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#d4d4d4", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color = "#c0c0c0"}
              onMouseLeave={e => e.currentTarget.style.color = "#d4d4d4"}
            >
              GitHub
            </a>
            <a
              href="mailto:hello@codeflow.app"
              style={{ color: "#d4d4d4", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color = "#c0c0c0"}
              onMouseLeave={e => e.currentTarget.style.color = "#d4d4d4"}
            >
              Contact
            </a>
            <Link
              to={createPageUrl("Privacy")}
              style={{ color: "#d4d4d4", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color = "#c0c0c0"}
              onMouseLeave={e => e.currentTarget.style.color = "#d4d4d4"}
            >
              Privacy
            </Link>
            <Link
              to={createPageUrl("Terms")}
              style={{ color: "#d4d4d4", fontSize: "14px", textDecoration: "none", fontWeight: 500 }}
              onMouseEnter={e => e.currentTarget.style.color = "#c0c0c0"}
              onMouseLeave={e => e.currentTarget.style.color = "#d4d4d4"}
            >
              Terms
            </Link>
          </div>
        </div>

        {/* Bottom line */}
        <div style={{
          borderTop: "1px solid #1a1a1a",
          paddingTop: "24px",
          color: "#c4c4c4",
          fontSize: "12px",
          fontFamily: "monospace",
        }}>
          © 2025 CodeFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}