import React from 'react'
import { font } from "@/lib/tokens";
import { Link } from 'react-router-dom'
import { createPageUrl } from '../utils'
import { Stagger, StaggerItem } from "@/lib/motion";

const LABEL = font.body
const SERIF = font.display

function Section({ title, children }) {
  return (
    <section className="mb-10">
      <h2 style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 700, color: '#F2EDE2', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
        {title}
      </h2>
      <div className="font-display text-sm space-y-3" style={{ color: '#FFFFFF', lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  )
}

export default function Terms() {
  return (
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: '#15130E' }}>
      <Stagger className="max-w-2xl mx-auto" as="div">
        <StaggerItem as="div">
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#E8A33C', fontFamily: LABEL }}>
            TERMS
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#F2EDE2', margin: '0 0 8px', lineHeight: 1.08 }}>
            Terms of Service
          </h1>
          <p className="font-sans text-xs mb-12" style={{ color: '#FFFFFF', fontFamily: LABEL }}>
            Last updated: June 2026
          </p>
        </StaggerItem>

        <StaggerItem as="div"><Section title="Using CodeFlow">
          <p>
            CodeFlow is an educational coding platform. You may use it to learn, practice, and build
            projects. Don&apos;t use it to break the law, attack the service, or abuse the code-execution
            sandbox (e.g. for crypto mining, network attacks, or running others&apos; workloads).
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Your account">
          <p>
            You&apos;re responsible for activity under your account. Keep your credentials secure. Guest
            mode requires no account, progress lives only on your device.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Age & students">
          <p>
            CodeFlow is built for learners, including high-school students. You must be at
            least <strong style={{ color: '#ECE7DC' }}>13 years old</strong> to use it. If you are
            under 18, you may use CodeFlow only with the consent and supervision of a parent,
            guardian, or teacher, who agrees to these terms on your behalf.
          </p>
          <p>
            We do not knowingly collect personal information from children under 13, in keeping
            with COPPA. If a school or teacher uses CodeFlow with students, any student records
            are handled as education records under FERPA: they are used only to provide the
            service and are never sold. Parents, guardians, and schools may request access to or
            deletion of a minor&apos;s data by emailing{' '}
            <a href="mailto:hello@codeflow.app" style={{ color: '#E8A33C' }}>hello@codeflow.app</a>.
            See our <Link to={createPageUrl('Privacy')} style={{ color: '#E8A33C' }}>Privacy Policy</Link> for details.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Your content">
          <p>
            Code you write stays yours. Lesson content, curriculum, and the platform itself remain the
            property of CodeFlow and may not be redistributed without permission.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Code execution">
          <p>
            Code runs in sandboxed environments (in-browser for Python, a metered remote service for
            C++). These have resource and rate limits. We may throttle or block abusive use.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="No warranty">
          <p>
            CodeFlow is provided &quot;as is,&quot; without warranty. We work to keep it accurate and
            available but can&apos;t guarantee it&apos;s error-free or always online.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Changes & contact">
          <p>
            We may update these terms; continued use means you accept the changes. Questions?{' '}
            <a href="mailto:hello@codeflow.app" style={{ color: '#E8A33C' }}>hello@codeflow.app</a>.
            See also our <Link to={createPageUrl('Privacy')} style={{ color: '#E8A33C' }}>Privacy Policy</Link>.
          </p>
        </Section></StaggerItem>
      </Stagger>
    </div>
  )
}
