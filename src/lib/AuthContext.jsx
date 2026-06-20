import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, setProfile, clear as clearProfile } from '@/api/localProfile';
import { auth as supaAuth } from '@/api/supabaseClient';
import { namespacedKey } from '@/lib/progressStats';

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
    setProfile({ name: p.name, email: p.email });
    setUser({ ...p });
    setIsAuthenticated(true);
    setAuthMode('email');
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
        // Only clear if we were in email mode; guest is independent.
      }
    });

    return () => { active = false; sub?.subscription?.unsubscribe?.(); };
  }, []);

  // ── Email auth ────────────────────────────────────────────────────────────
  const signUpEmail = async ({ email, password, name }) => {
    const { data, error } = await supaAuth.signUp(email, password, name);
    if (error) return { error };
    // If email confirmation is OFF, a session is returned immediately.
    if (data?.session?.user) adoptSupabaseUser(data.session.user);
    return { data, needsConfirmation: !data?.session };
  };

  const signInEmail = async ({ email, password }) => {
    const { data, error } = await supaAuth.signIn(email, password);
    if (error) return { error };
    if (data?.user) adoptSupabaseUser(data.user);
    return { data };
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
    return profile;
  };

  // Back-compat alias used by old callers.
  const signInLocal = signInGuest;

  const logout = async () => {
    try { await supaAuth.signOut(); } catch { /* ignore */ }
    // Clear this account's namespaced progress keys BEFORE wiping the profile,
    // so a second user on this browser doesn't inherit the first user's state.
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
