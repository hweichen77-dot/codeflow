import { supabase } from '@/api/supabaseClient'

export async function askTutor({ messages, lessonTitle = '', context = '', socratic = true, currentCode = '', lastOutput = '' }) {
  if (!supabase) {
    return { ok: false, configured: false, error: 'The AI tutor needs a connection (not configured in this build).' }
  }
  try {
    const { data, error } = await supabase.functions.invoke('ai-tutor', {
      body: { messages, lessonTitle, context, socratic, currentCode, lastOutput },
    })
    if (error) {
      const msg = error.message || 'Request failed.'
      if (/failed to send|edge function|not found|404/i.test(msg)) {
        return { ok: false, configured: false, error: 'The AI tutor is being switched on, check back soon.' }
      }
      return { ok: false, error: msg }
    }
    if (data?.configured === false) return { ok: false, configured: false, error: data.error }
    if (data?.error) return { ok: false, error: data.error }
    return { ok: true, reply: data.reply || '' }
  } catch (e) {
    return { ok: false, error: String(e?.message || e) }
  }
}
