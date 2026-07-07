// Data subject rights (GDPR Art. 15/17, CCPA/CPRA): self-serve export + delete.
// CodeFlow is local-first, so "your data" spans two places:
//   1. Everything under the `codeflow` localStorage prefix (progress, streak,
//      challenges, capstones, profile, badges, flags).
//   2. The cloud mirror in Supabase `user_state` (+ auth account) if signed in.
import { supabase, auth as supaAuth } from '@/api/supabaseClient'

const PREFIX = 'codeflow'

// Every localStorage key this app owns, so export and delete stay in sync with
// each other and with whatever new keys get added later (all use the prefix).
function localKeys() {
  if (typeof window === 'undefined') return []
  const keys = []
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (k && k.startsWith(PREFIX)) keys.push(k)
  }
  return keys
}

function readLocalData() {
  const out = {}
  for (const k of localKeys()) {
    const raw = window.localStorage.getItem(k)
    try { out[k] = JSON.parse(raw) } catch { out[k] = raw }
  }
  return out
}

async function readRemoteState() {
  if (!supaAuth.isConfigured) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const userId = session?.user?.id
    if (!userId) return null
    const { data, error } = await supabase
      .from('user_state').select('state, updated_at').eq('user_id', userId).single()
    if (error && error.code !== 'PGRST116') return { error: 'unavailable' }
    return {
      account: { id: userId, email: session.user.email },
      user_state: data?.state ?? null,
      updated_at: data?.updated_at ?? null,
    }
  } catch {
    return { error: 'unavailable' }
  }
}

// Assemble everything we hold about the user into one JSON document and hand it
// back for download — satisfies the right to access / data portability.
export async function exportUserData() {
  const bundle = {
    export_format: 'codeflow.data-export.v1',
    exported_at: new Date().toISOString(),
    local: readLocalData(),
    cloud: await readRemoteState(),
  }
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const stamp = new Date().toISOString().slice(0, 10)
  const a = document.createElement('a')
  a.href = url
  a.download = `codeflow-data-${stamp}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return bundle
}

// Wipe every CodeFlow key from this device. Used on its own (guest/local
// erasure) and as the local half of full-account deletion.
export function deleteLocalData() {
  for (const k of localKeys()) {
    try { window.localStorage.removeItem(k) } catch { /* ignore */ }
  }
}

// Full erasure for signed-in users: delete the auth account + all server rows
// (user_state / user_challenges / user_tracks / projects cascade off auth.users),
// then wipe the device. The Edge Function does the privileged server delete; the
// client only proves identity by forwarding its access token.
export async function deleteAccountAndData() {
  if (!supaAuth.isConfigured) { deleteLocalData(); return { local: true, cloud: false } }
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token
  if (!token) { deleteLocalData(); return { local: true, cloud: false } }

  const base = import.meta.env.VITE_SUPABASE_URL
  const resp = await fetch(`${base}/functions/v1/delete-account`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      authorization: `Bearer ${token}`,
    },
  })
  if (!resp.ok) {
    const detail = await resp.text().catch(() => '')
    throw new Error(`account deletion failed (${resp.status}): ${detail.slice(0, 200)}`)
  }
  try { await supabase.auth.signOut() } catch { /* already gone */ }
  deleteLocalData()
  return { local: true, cloud: true }
}
