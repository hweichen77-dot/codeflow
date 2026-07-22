import { supabase, auth } from '@/api/supabaseClient'

export const HANDLE_PATTERN = /^[A-Za-z0-9_-]{2,20}$/

async function currentUserId() {
  if (!auth.isConfigured) return null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user?.id ?? null
  } catch {
    return null
  }
}

export async function submitLabScore({ labId, promptChars, attacksHeld }) {
  const userId = await currentUserId()
  if (!userId || !labId || !promptChars) return { stored: false }

  try {
    const { data: existing } = await supabase
      .from('lab_scores')
      .select('prompt_chars, handle, published')
      .eq('user_id', userId)
      .eq('lab_id', labId)
      .maybeSingle()

    if (existing && existing.prompt_chars <= promptChars) return { stored: false, kept: existing.prompt_chars }

    const { error } = await supabase.from('lab_scores').upsert({
      user_id: userId,
      lab_id: labId,
      prompt_chars: promptChars,
      attacks_held: attacksHeld,
      handle: existing?.handle ?? null,
      published: existing?.published ?? false,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lab_id' })
    if (error) return { stored: false }
    return { stored: true, improved: Boolean(existing) }
  } catch {
    return { stored: false }
  }
}

export async function fetchLeaderboard(labId, limit = 10) {
  if (!auth.isConfigured || !labId) return []
  try {
    const { data, error } = await supabase.rpc('lab_leaderboard', { p_lab_id: labId, p_limit: limit })
    if (error || !Array.isArray(data)) return []
    return data
  } catch {
    return []
  }
}

export async function getMyEntry(labId) {
  const userId = await currentUserId()
  if (!userId || !labId) return null
  try {
    const { data } = await supabase
      .from('lab_scores')
      .select('prompt_chars, attacks_held, handle, published')
      .eq('user_id', userId)
      .eq('lab_id', labId)
      .maybeSingle()
    return data ?? null
  } catch {
    return null
  }
}

export async function publishEntry(labId, handle) {
  const userId = await currentUserId()
  if (!userId || !labId) return { ok: false, error: 'Sign in to appear on the board.' }
  if (!HANDLE_PATTERN.test(handle || '')) {
    return { ok: false, error: 'Pick 2 to 20 letters, numbers, dashes or underscores. Please do not use your real name.' }
  }
  try {
    const { error } = await supabase
      .from('lab_scores')
      .update({ handle, published: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('lab_id', labId)
    if (error) return { ok: false, error: 'That handle is taken or could not be saved.' }
    return { ok: true }
  } catch {
    return { ok: false, error: 'Could not reach the leaderboard right now.' }
  }
}

export async function unpublishEntry(labId) {
  const userId = await currentUserId()
  if (!userId || !labId) return { ok: false }
  try {
    await supabase
      .from('lab_scores')
      .update({ published: false, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('lab_id', labId)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}
