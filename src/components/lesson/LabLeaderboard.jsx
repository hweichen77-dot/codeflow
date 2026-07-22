import React, { useEffect, useState, useCallback } from 'react'
import { Trophy } from 'lucide-react'
import { useAuth } from '@/lib/AuthContext'
import { fetchLeaderboard, getMyEntry, publishEntry, unpublishEntry } from '@/lib/leaderboard'
import { track } from '@/lib/analytics'

const ACCENT = '#5ED29C'
const MUTED = '#9FB3AA'

export default function LabLeaderboard({ lab, refreshKey }) {
  const { isAuthenticated } = useAuth()
  const [rows, setRows] = useState([])
  const [mine, setMine] = useState(null)
  const [handle, setHandle] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setRows(await fetchLeaderboard(lab.id, 10))
    setMine(isAuthenticated ? await getMyEntry(lab.id) : null)
  }, [lab.id, isAuthenticated])

  useEffect(() => { load() }, [load, refreshKey])

  const join = async () => {
    setBusy(true)
    setError('')
    const res = await publishEntry(lab.id, handle.trim())
    setBusy(false)
    if (!res.ok) { setError(res.error); return }
    track('leaderboard_joined', { lab: lab.id })
    setHandle('')
    load()
  }

  const leave = async () => {
    setBusy(true)
    await unpublishEntry(lab.id)
    setBusy(false)
    track('leaderboard_left', { lab: lab.id })
    load()
  }

  return (
    <div className="rounded-xl p-4 mt-5" style={{ background: '#0C1210', border: '1px solid #212C27' }}>
      <div className="flex items-center gap-2 mb-1">
        <Trophy size={15} style={{ color: ACCENT }} />
        <h4 className="text-sm font-bold" style={{ color: '#ECF3EF' }}>Shortest prompt that holds every attack</h4>
      </div>
      <p className="text-xs mb-3" style={{ color: MUTED }}>
        Anyone can hold the attacks with a long enough prompt. The board ranks who does it with the fewest characters.
      </p>

      {rows.length === 0 ? (
        <p className="text-sm" style={{ color: MUTED }}>Nobody has claimed a spot on this lab yet.</p>
      ) : (
        <ol className="space-y-1">
          {rows.map((r) => (
            <li key={`${r.rank}-${r.handle}`} className="flex items-center justify-between text-sm py-1.5"
              style={{ borderBottom: '1px solid #17201C' }}>
              <span style={{ color: '#ECF3EF' }}>
                <span className="u-mono mr-3" style={{ color: r.rank <= 3 ? ACCENT : MUTED }}>{r.rank}</span>
                {r.handle}
              </span>
              <span className="u-mono text-xs" style={{ color: MUTED }}>{r.prompt_chars} chars</span>
            </li>
          ))}
        </ol>
      )}

      {isAuthenticated && mine && !mine.published && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid #17201C' }}>
          <p className="text-xs mb-2" style={{ color: MUTED }}>
            Your best here is {mine.prompt_chars} characters. Pick a handle to appear on the board. Use a nickname, not your real name.
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="nickname"
              maxLength={20}
              aria-label="Leaderboard handle"
              className="px-3 py-2 rounded-lg text-sm"
              style={{ background: '#070B0A', border: '1px solid #2f3a35', color: '#ECF3EF' }}
            />
            <button type="button" onClick={join} disabled={busy || !handle.trim()}
              className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
              style={{ background: ACCENT, color: '#0a1410' }}>
              Join the board
            </button>
          </div>
          {error && <p className="text-xs mt-2" style={{ color: '#F0857D' }}>{error}</p>}
        </div>
      )}

      {isAuthenticated && mine?.published && (
        <div className="mt-4 pt-3 flex flex-wrap items-center gap-3" style={{ borderTop: '1px solid #17201C' }}>
          <span className="text-xs" style={{ color: MUTED }}>
            You are on the board as {mine.handle} at {mine.prompt_chars} characters.
          </span>
          <button type="button" onClick={leave} disabled={busy}
            className="text-xs underline" style={{ color: MUTED }}>
            Take me off
          </button>
        </div>
      )}

      {!isAuthenticated && (
        <p className="text-xs mt-3 pt-3" style={{ color: MUTED, borderTop: '1px solid #17201C' }}>
          Sign in to put a score on the board. You choose a handle, and you can remove yourself any time.
        </p>
      )}
    </div>
  )
}
