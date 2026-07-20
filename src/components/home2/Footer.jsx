import React from "react";
import { font } from "@/lib/tokens";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const display = font.display;
const body = font.body;

const idx = {
  fontFamily: body,
  fontSize: "0.72rem",
  letterSpacing: "0.18em",
  color: "#2E8B7A",
  textTransform: "uppercase",
  fontWeight: 500,
  marginBottom: "14px",
};

function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", fontFamily: display, fontWeight: 800, fontSize: "1.18rem", letterSpacing: "-0.02em", color: "#ECF3EF" }}>
      <span style={{ width: "9px", height: "9px", background: "#5ED29C", borderRadius: "1px", transform: "translateY(-1px)" }} />
      Compilearn
    </div>
  );
}

function FootLink({ children, ...props }) {
  return (
    <a
      {...props}
      style={{ fontFamily: body, color: "#FFFFFF", textDecoration: "none", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}
      onMouseEnter={e => (e.currentTarget.style.color = "#5ED29C")}
      onMouseLeave={e => (e.currentTarget.style.color = "#B7C6BE")}
    >
      {children}
    </a>
  );
}

function FootRouterLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{ fontFamily: body, color: "#FFFFFF", textDecoration: "none", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}
      onMouseEnter={e => (e.currentTarget.style.color = "#5ED29C")}
      onMouseLeave={e => (e.currentTarget.style.color = "#B7C6BE")}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer style={{ padding: "64px 2rem 96px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "32px" }}>
          <div>
            <div style={{ marginBottom: "12px" }}><Wordmark /></div>
            <p style={{ fontFamily: body, color: "#FFFFFF", fontSize: "0.86rem", maxWidth: "42ch", lineHeight: 1.6 }}>
              Built for people who learn by doing. Real code execution and an
              AI tutor that won't hand you the answer.
            </p>
          </div>

          <div>
            <div style={idx}>Product</div>
            <FootRouterLink to={createPageUrl("Lessons")}>AI track</FootRouterLink>
            <FootRouterLink to={createPageUrl("Lessons")}>AP CS</FootRouterLink>
            <FootRouterLink to={createPageUrl("Challenges")}>Compete</FootRouterLink>
            <FootRouterLink to={createPageUrl("Projects")}>Projects</FootRouterLink>
          </div>

          <div>
            <div style={idx}>About</div>
            <FootLink href="https://github.com/hweichen77-dot/compilearn" target="_blank" rel="noopener noreferrer">GitHub</FootLink>
            <FootLink href="mailto:jason.huang317235@gmail.com">Contact</FootLink>
            <FootRouterLink to={createPageUrl("Privacy")}>Privacy</FootRouterLink>
            <FootRouterLink to={createPageUrl("Terms")}>Terms</FootRouterLink>
          </div>
        </div>

        <div style={{
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid #111917",
          fontFamily: body,
          fontSize: "0.72rem",
          color: "#FFFFFF",
          letterSpacing: "0.04em",
        }}>
          © 2026 Compilearn, learn by building.
          <div style={{ marginTop: "10px", color: "#8EA098", lineHeight: 1.6 }}>
            Independent project, not affiliated with or endorsed by the College Board. AP® and Advanced Placement® are registered trademarks of the College Board. AI output can be inaccurate — verify before relying on it.
          </div>
        </div>
      </div>
    </footer>
  );
}
