import React from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '../utils'

const MONO = "'Space Mono', monospace"
const SERIF = "Georgia, 'Times New Roman', serif"

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 700, color: '#f0f0f0', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      <div className="font-display text-sm space-y-3" style={{ color: '#c4c4c4', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  )
}

export default function Privacy() {
  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#b8ff00', fontFamily: MONO }}>
          § PRIVACY
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f0f0f0', margin: '0 0 8px', lineHeight: 1.08 }}>
          Privacy Policy
        </h1>
        <p className="font-mono text-xs mb-12" style={{ color: '#888', fontFamily: MONO }}>
          Last updated: June 2026
        </p>

        <Section title="What we collect">
          <p>
            CodeFlow is built local-first. Your learning progress — completed lessons, challenges,
            XP, and streaks — is stored in your browser&apos;s localStorage by default and never
            leaves your device unless you create an account.
          </p>
          <p>
            If you sign in with email or Google, we store your progress in our database so it
            syncs across your devices. We keep only your email address, display name, and that
            progress data.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            We use privacy-respecting product analytics to understand which lessons work and where
            people get stuck. We track page views and learning events (e.g. &quot;challenge
            completed&quot;) — never your code, keystrokes, or personal content. Analytics use
            localStorage, not third-party tracking cookies.
          </p>
        </Section>

        <Section title="Error monitoring">
          <p>
            When something crashes, we collect a technical error report (stack trace, page, browser)
            to fix it. These reports do not include your code or progress data.
          </p>
        </Section>

        <Section title="What we never do">
          <p>We do not sell your data. We do not run ad networks. We do not read or share the code you write.</p>
        </Section>

        <Section title="Your choices">
          <p>
            Using guest mode keeps everything on your device. You can clear all local data any time
            through your browser settings. To delete an account and its synced data, email us.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions? <a href="mailto:hello@codeflow.app" style={{ color: '#b8ff00' }}>hello@codeflow.app</a>.
            See also our <Link to={createPageUrl('Terms')} style={{ color: '#b8ff00' }}>Terms of Service</Link>.
          </p>
        </Section>
      </div>
    </div>
  )
}
