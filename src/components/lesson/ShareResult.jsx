import React, { useState } from 'react'
import { Share2, Check, Link2 } from 'lucide-react'
import { track } from '@/lib/analytics'
import { appUrl } from '@/lib/siteUrl'

const ACCENT = '#5ED29C'

export function labShareUrl(labId, channel) {
  const url = new URL(appUrl('/Playground'))
  url.searchParams.set('lab', labId)
  url.searchParams.set('utm_source', channel)
  url.searchParams.set('utm_medium', 'share')
  url.searchParams.set('utm_campaign', 'lab_result')
  return url.toString()
}

export function shareLine({ lab, passed, total, allPass, channel }) {
  const url = labShareUrl(lab.id, channel)
  const headline = allPass
    ? `My prompt held all ${total} attacks on "${lab.title}".`
    : `My prompt held ${passed} of ${total} attacks on "${lab.title}".`
  return { headline, text: `${headline} Think yours can do better?`, url }
}

export default function ShareResult({ lab, passed, total, allPass }) {
  const [copied, setCopied] = useState(false)

  const open = (channel, href) => {
    track('playground_share', { lab: lab.id, passed, total, channel })
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  const copy = async () => {
    const { text, url } = shareLine({ lab, passed, total, allPass, channel: 'copy' })
    try {
      track('playground_share', { lab: lab.id, passed, total, channel: 'copy' })
      if (navigator.share) {
        await navigator.share({ title: 'Compilearn', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {  }
  }

  const onX = () => {
    const { text, url } = shareLine({ lab, passed, total, allPass, channel: 'x' })
    open('x', `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`)
  }

  const onReddit = () => {
    const { headline, url } = shareLine({ lab, passed, total, allPass, channel: 'reddit' })
    open('reddit', `https://www.reddit.com/submit?title=${encodeURIComponent(headline)}&url=${encodeURIComponent(url)}`)
  }

  const btn = {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '10px 16px', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700,
    cursor: 'pointer', transition: 'opacity .15s',
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button type="button" onClick={copy} style={{ ...btn, background: ACCENT, color: '#0a1410', border: 'none' }}>
        {copied ? <><Check size={15} /> Copied</> : <><Share2 size={15} /> Share result</>}
      </button>
      <button type="button" onClick={onX} aria-label="Share on X"
        style={{ ...btn, background: 'transparent', color: '#ECF3EF', border: '1px solid #2f3a35' }}>
        Post on X
      </button>
      <button type="button" onClick={onReddit} aria-label="Share on Reddit"
        style={{ ...btn, background: 'transparent', color: '#ECF3EF', border: '1px solid #2f3a35' }}>
        Post on Reddit
      </button>
      <span className="inline-flex items-center gap-1.5 text-xs" style={{ color: '#9FB3AA' }}>
        <Link2 size={13} /> link comes back to this lab
      </span>
    </div>
  )
}
