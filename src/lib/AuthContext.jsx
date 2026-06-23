import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, setProfile, clear as clearProfile } from '@/api/localProfile';
import { clearAllProgress } from '@/api/progressStore';
import { auth as supaAuth } from '@/api/supabaseClient';
import { activateSync, deactivateSync } from '@/api/cloudSync';
import { namespacedKey } from '@/lib/progressStats';
import { identify, resetIdentity, track } from '@/lib/analytics';
import { setMonitoringUser } from '@/lib/monitoring';

const AuthContext = createContext();

// Build a local-profile-shaped object from a Supabase session user so all the
// existing progress code (keyed by email via api.auth.me) keeps working.
const profileFromSupabase = (sUser) => {
  if (!sUser) return null;
  const name = sUser.user_metadata?.name || sUser.email?.split('@')[0] || 'learner';
  return { id: sUser.id, name, email: sUser.email, mode: 'email' };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authMode, setAuthMode] = useState(null); // 'email' | 'guest'

  // Mirror an email account into localProfile so progressStore / api.auth.me work unchanged.
  const adoptSupabaseUser = (sUser) => {
    const p = profileFromSupabase(sUser);
    if (!p) return;
    // Shared-browser guard: if a DIFFERENT real account's progress is sitting in
    // localStorage (prior user didn't log out, or session was swapped), clear it
    // before adopting so we neither show nor cloud-merge their data into this
    // account. A guest profile (…@local) is preserved — that's the normal
    // "try as guest, then sign up" upgrade path, which should keep its progress.
    try {
      const prevEmail = getProfile()?.email;
      if (prevEmail && !prevEmail.endsWith('@local') && prevEmail !== p.email) {
        clearAllProgress();
      }
    } catch { /* ignore */ }
    setProfile({ name: p.name, email: p.email });
    setUser({ ...p });
    setIsAuthenticated(true);
    setAuthMode('email');
    // Real account → tie analytics/monitoring to a stable id and start cloud sync.
    identify(p.id, { email: p.email, name: p.name });
    setMonitoringUser({ id: p.id, email: p.email });
    activateSync(p.id);
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await supaAuth.getSession();
        if (active && data?.session?.user) {
          adoptSupabaseUser(data.session.user);
          setIsLoadingAuth(false);
          return;
        }
      } catch { /* supabase not configured — fall through to guest */ }

      if (!active) return;
      const local = getProfile();
      if (local) {
        setUser(local);
        setIsAuthenticated(true);
        setAuthMode(local.mode === 'email' ? 'email' : 'guest');
      }
      setIsLoadingAuth(false);
    })();

    // React to email sign-in / sign-out from Supabase.
    const { data: sub } = supaAuth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) adoptSupabaseUser(session.user);
      if (event === 'SIGNED_OUT') {
        // Supabase ended the session — either our own logout(), or a SILENT death
        // (token/refresh expiry, password change, sign-out in another tab). Tear
        // down auth + sync state so the UI stops pretending the user is signed in
        // and subsequent writes don't 401 into the void. Deliberately do NOT wipe
        // local progress here: on a silent expiry the last edits may be unsynced,
        // and clearing would lose them. The shared-browser case is covered when
        // the NEXT real account signs in (adoptSupabaseUser's mismatch guard) and
        // by explicit logout() below.
        deactivateSync();
        resetIdentity();
        setMonitoringUser(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthMode(null);
      }
    });

    return () => { active = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  // ── Email auth ────────────────────────────────────────────────────────────
  const signUpEmail = async ({ email, password, name }) => {
    const { data, error } = await supaAuth.signUp(email, password, name);
    if (error) return { error };
    track('sign_up', { method: 'email' });
    // If email confirmation is OFF, a session is returned immediately.
    if (data?.session?.user) adoptSupabaseUser(data.session.user);
    return { data, needsConfirmation: !data?.session };
  };

  const signInEmail = async ({ email, password }) => {
    const { data, error } = await supaAuth.signIn(email, password);
    if (error) return { error };
    if (data?.user) { track('sign_in', { method: 'email' }); adoptSupabaseUser(data.user); }
    return { data };
  };

  // OAuth redirects away and back; the returning session is picked up by the
  // onAuthStateChange listener / getSession on next load.
  const signInGoogle = async () => {
    track('sign_in_start', { method: 'google' });
    const { error } = await supaAuth.signInWithGoogle();
    return { error };
  };

  const resetPassword = async (email) => {
    const { error } = await supaAuth.resetPassword(email);
    return { error };
  };

  // ── Guest (local, offline) ──────────────────────────────────────────────────
  const signInGuest = ({ name } = {}) => {
    const profile = setProfile({ name });
    setUser({ ...profile, mode: 'guest' });
    setIsAuthenticated(true);
    setAuthMode('guest');
    track('guest_start');
    return profile;
  };

  // Back-compat alias used by old callers.
  const signInLocal = signInGuest;

  const logout = async () => {
    // Flush any pending change to the cloud before tearing sync down, so the last
    // few seconds of work aren't lost on an immediate logout.
    await deactivateSync();
    resetIdentity();
    setMonitoringUser(null);
    try { await supaAuth.signOut(); } catch { /* ignore */ }
    // Clear this account's progress + namespaced keys BEFORE wiping the profile,
    // so a second user on this browser doesn't inherit the first user's state.
    clearAllProgress();
    try {
      const id = user?.email || user?.id;
      if (id && typeof window !== 'undefined') {
        window.localStorage.removeItem(namespacedKey('codeflow_streak', id));
        window.localStorage.removeItem(namespacedKey('codeflow_last_level', id));
      }
    } catch { /* ignore */ }
    clearProfile();
    setUser(null);
    setIsAuthenticated(false);
    setAuthMode(null);
    if (typeof window !== 'undefined') {
      window.location.href = `${import.meta.env.BASE_URL || '/'}`;
    }
  };

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = `${import.meta.env.BASE_URL || '/'}login`;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authMode,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      supabaseConfigured: supaAuth.isConfigured,
      signUpEmail,
      signInEmail,
      signInGoogle,
      resetPassword,
      signInGuest,
      signInLocal,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
