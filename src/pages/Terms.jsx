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
      <h2 style={{ fontFamily: SERIF, fontSize: '1.35rem', fontWeight: 700, color: '#ECF3EF', margin: '0 0 12px', letterSpacing: '-0.01em' }}>
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
    <div className="min-h-screen px-8 lg:px-16 pt-28 pb-20" style={{ background: '#070B0A' }}>
      <Stagger className="max-w-2xl mx-auto" as="div">
        <StaggerItem as="div">
          <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#5ED29C', fontFamily: LABEL }}>
            TERMS
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ECF3EF', margin: '0 0 8px', lineHeight: 1.08 }}>
            Terms of Service
          </h1>
          <p className="font-sans text-xs mb-12" style={{ color: '#FFFFFF', fontFamily: LABEL }}>
            Last updated: June 2026
          </p>
        </StaggerItem>

        <StaggerItem as="div"><Section title="Using Compilearn">
          <p>
            Compilearn is an educational coding platform. You may use it to learn, practice, and build
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
            Compilearn is built for learners, including high-school students. You must be at
            least <strong style={{ color: '#ECF3EF' }}>13 years old</strong> to use it. If you are
            under 18, you may use Compilearn only with the consent and supervision of a parent,
            guardian, or teacher, who agrees to these terms on your behalf.
          </p>
          <p>
            We do not knowingly collect personal information from children under 13, in keeping
            with COPPA. If a school or teacher uses Compilearn with students, we will handle any
            student data consistent with FERPA and will sign a data-processing agreement on
            request; such data is used only to provide the service and is never sold. Parents,
            guardians, and schools may request access to or
            deletion of a minor&apos;s data by emailing{' '}
            <a href="mailto:jason.huang317235@gmail.com" style={{ color: '#5ED29C' }}>jason.huang317235@gmail.com</a>.
            See our <Link to={createPageUrl('Privacy')} style={{ color: '#5ED29C' }}>Privacy Policy</Link> for details.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Your content">
          <p>
            Code you write stays yours. Lesson content, curriculum, and the platform itself remain the
            property of Compilearn and may not be redistributed without permission.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Code execution">
          <p>
            Code runs in sandboxed environments (in-browser for Python, a metered remote service for
            C++). These have resource and rate limits. We may throttle or block abusive use.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="AI features">
          <p>
            Some features (the playground and tutor) generate responses with AI language models.
            AI output can be inaccurate, incomplete, or biased, and is provided for learning only,
            not as professional, legal, financial, or safety advice. Verify anything important
            before relying on it. You are responsible for how you use content you generate.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="No warranty">
          <p>
            Compilearn is provided &quot;as is&quot; and &quot;as available,&quot; without warranties of any
            kind, express or implied, including fitness for a particular purpose. We work to keep it
            accurate and available but can&apos;t guarantee it&apos;s error-free or always online.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Limitation of liability">
          <p>
            To the maximum extent permitted by law, Compilearn and its operator are not liable for any
            indirect, incidental, or consequential damages, or for any loss of data, arising from your
            use of the service. Because Compilearn is provided free of charge, our total liability for any
            claim is limited to USD $100.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Trademarks & affiliation">
          <p>
            Compilearn is an independent project and is not affiliated with, authorized, or endorsed by
            the College Board, Oracle, or any other organization. AP&reg; and Advanced Placement&reg;
            are registered trademarks of the College Board; other product and company names are the
            trademarks of their respective owners and are used for identification only.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Governing law">
          <p>
            These terms are governed by the laws of the State of California, USA, without regard to its
            conflict-of-law rules.
          </p>
        </Section></StaggerItem>

        <StaggerItem as="div"><Section title="Changes & contact">
          <p>
            We may update these terms; continued use means you accept the changes. Questions?{' '}
            <a href="mailto:jason.huang317235@gmail.com" style={{ color: '#5ED29C' }}>jason.huang317235@gmail.com</a>.
            See also our <Link to={createPageUrl('Privacy')} style={{ color: '#5ED29C' }}>Privacy Policy</Link>.
          </p>
        </Section></StaggerItem>
      </Stagger>
    </div>
  )
}
