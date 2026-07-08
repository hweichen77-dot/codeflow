
import { supabase, auth } from '@/api/supabaseClient'

export const isDesktop =
  typeof window !== 'undefined' && Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__)

let listenerReady = false

export async function startGoogleDesktop() {
  const { data, error } = await auth.signInWithGoogle()
  if (error) return { error }
  const url = data?.url
  if (!url) return { error: new Error('No sign-in URL was returned.') }
  try {
    const { openUrl } = await import('@tauri-apps/plugin-opener')
    await openUrl(url)
    return {}
  } catch (e) {
    return { error: e instanceof Error ? e : new Error('Could not open the browser for sign-in.') }
  }
}

async function handleCallback(url) {
  if (typeof url !== 'string' || !url.startsWith('codeflow://')) return
  const hashIdx = url.indexOf('#')
  const queryIdx = url.indexOf('?')
  const query = queryIdx >= 0 ? url.slice(queryIdx + 1, hashIdx >= 0 ? hashIdx : undefined) : ''
  const frag = hashIdx >= 0 ? url.slice(hashIdx + 1) : ''
  const qp = new URLSearchParams(query)
  const fp = new URLSearchParams(frag)
  const code = qp.get('code')
  try {
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
    } else if (fp.get('access_token')) {
      await supabase.auth.setSession({
        access_token: fp.get('access_token'),
        refresh_token: fp.get('refresh_token') || '',
      })
    }
  } catch {

  }
}

export async function initDeepLinkAuth() {
  if (!isDesktop || listenerReady) return
  listenerReady = true
  try {
    const dl = await import('@tauri-apps/plugin-deep-link')
    try {
      const initial = await dl.getCurrent()
      if (Array.isArray(initial)) for (const u of initial) await handleCallback(u)
    } catch {  }
    await dl.onOpenUrl((urls) => { for (const u of urls) handleCallback(u) })
  } catch {

  }
}
