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
  color: "#D4882E",
  textTransform: "uppercase",
  fontWeight: 500,
  marginBottom: "14px",
};

function Wordmark() {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: "10px", fontFamily: display, fontWeight: 800, fontSize: "1.18rem", letterSpacing: "-0.02em", color: "#ECE7DC" }}>
      <span style={{ width: "9px", height: "9px", background: "#E8A33C", borderRadius: "1px", transform: "translateY(-1px)" }} />
      CodeFlow
    </div>
  );
}

function FootLink({ children, ...props }) {
  return (
    <a
      {...props}
      style={{ fontFamily: body, color: "#FFFFFF", textDecoration: "none", fontSize: "0.9rem", display: "block", marginBottom: "8px" }}
      onMouseEnter={e => (e.currentTarget.style.color = "#E8A33C")}
      onMouseLeave={e => (e.currentTarget.style.color = "#A39B8C")}
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
      onMouseEnter={e => (e.currentTarget.style.color = "#E8A33C")}
      onMouseLeave={e => (e.currentTarget.style.color = "#A39B8C")}
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
            <FootLink href="https://github.com/hweichen77-dot/codeflow" target="_blank" rel="noopener noreferrer">GitHub</FootLink>
            <FootLink href="mailto:hello@codeflow.app">Contact</FootLink>
            <FootRouterLink to={createPageUrl("Privacy")}>Privacy</FootRouterLink>
            <FootRouterLink to={createPageUrl("Terms")}>Terms</FootRouterLink>
          </div>
        </div>

        <div style={{
          marginTop: "64px",
          paddingTop: "24px",
          borderTop: "1px solid #221F18",
          fontFamily: body,
          fontSize: "0.72rem",
          color: "#FFFFFF",
          letterSpacing: "0.04em",
        }}>
          © 2026 CodeFlow, learn by building.
        </div>
      </div>
    </footer>
  );
}
