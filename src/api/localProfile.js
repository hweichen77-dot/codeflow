// Local-only profile store. No auth server — everything lives in localStorage.
const KEY = 'codeflow_profile_v1'

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'learner'

const read = () => {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const write = (profile) => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    /* ignore quota / private-mode errors */
  }
}

export const getProfile = () => read()

export const setProfile = ({ name, email } = {}) => {
  const slug = slugify(name || email)
  const finalEmail = email && email.trim() ? email.trim() : `${slug}@local`
  const profile = {
    id: `local-${slug}`,
    name: name && name.trim() ? name.trim() : slug,
    email: finalEmail,
  }
  write(profile)
  return profile
}

export const clear = () => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
