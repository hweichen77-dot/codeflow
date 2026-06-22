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

export default function Terms() {
  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: '#0a0a0a' }}>
      <div className="max-w-2xl mx-auto">
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#b8ff00', fontFamily: MONO }}>
          § TERMS
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f0f0f0', margin: '0 0 8px', lineHeight: 1.08 }}>
          Terms of Service
        </h1>
        <p className="font-mono text-xs mb-12" style={{ color: '#888', fontFamily: MONO }}>
          Last updated: June 2026
        </p>

        <Section title="Using CodeFlow">
          <p>
            CodeFlow is an educational coding platform. You may use it to learn, practice, and build
            projects. Don&apos;t use it to break the law, attack the service, or abuse the code-execution
            sandbox (e.g. for crypto mining, network attacks, or running others&apos; workloads).
          </p>
        </Section>

        <Section title="Your account">
          <p>
            You&apos;re responsible for activity under your account. Keep your credentials secure. Guest
            mode requires no account — progress lives only on your device.
          </p>
        </Section>

        <Section title="Your content">
          <p>
            Code you write stays yours. Lesson content, curriculum, and the platform itself remain the
            property of CodeFlow and may not be redistributed without permission.
          </p>
        </Section>

        <Section title="Code execution">
          <p>
            Code runs in sandboxed environments (in-browser for Python, a metered remote service for
            C++). These have resource and rate limits. We may throttle or block abusive use.
          </p>
        </Section>

        <Section title="No warranty">
          <p>
            CodeFlow is provided &quot;as is,&quot; without warranty. We work to keep it accurate and
            available but can&apos;t guarantee it&apos;s error-free or always online.
          </p>
        </Section>

        <Section title="Changes & contact">
          <p>
            We may update these terms; continued use means you accept the changes. Questions?{' '}
            <a href="mailto:hello@codeflow.app" style={{ color: '#b8ff00' }}>hello@codeflow.app</a>.
            See also our <Link to={createPageUrl('Privacy')} style={{ color: '#b8ff00' }}>Privacy Policy</Link>.
          </p>
        </Section>
      </div>
    </div>
  )
}
