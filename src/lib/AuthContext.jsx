import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, setProfile, clear as clearProfile } from '@/api/localProfile';
import { clearAllProgress } from '@/api/progressStore';
import { auth as supaAuth } from '@/api/supabaseClient';
import { activateSync, deactivateSync } from '@/api/cloudSync';
import { namespacedKey } from '@/lib/progressStats';
import { identify, resetIdentity, track } from '@/lib/analytics';
import { setMonitoringUser } from '@/lib/monitoring';

const AuthContext = createContext();

const profileFromSupabase = (sUser) => {
  if (!sUser) return null;
  const name = sUser.user_metadata?.name || sUser.email?.split('@')[0] || 'learner';
  return { id: sUser.id, name, email: sUser.email, mode: 'email' };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authMode, setAuthMode] = useState(null);

  const adoptSupabaseUser = (sUser) => {
    const p = profileFromSupabase(sUser);
    if (!p) return;
    try {
      const prevEmail = getProfile()?.email;
      if (prevEmail && !prevEmail.endsWith('@local') && prevEmail !== p.email) {
        clearAllProgress();
      }
    } catch {  }
    setProfile({ name: p.name, email: p.email });
    setUser({ ...p });
    setIsAuthenticated(true);
    setAuthMode('email');
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
      } catch {  }

      if (!active) return;
      const local = getProfile();
      if (local) {
        setUser(local);
        setIsAuthenticated(true);
        setAuthMode(local.mode === 'email' ? 'email' : 'guest');
      }
      setIsLoadingAuth(false);
    })();

    const { data: sub } = supaAuth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) adoptSupabaseUser(session.user);
      if (event === 'SIGNED_OUT') {
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

  const signUpEmail = async ({ email, password, name }) => {
    const { data, error } = await supaAuth.signUp(email, password, name);
    if (error) return { error };
    track('sign_up', { method: 'email' });
    if (data?.session?.user) adoptSupabaseUser(data.session.user);
    return { data, needsConfirmation: !data?.session };
  };

  const signInEmail = async ({ email, password }) => {
    const { data, error } = await supaAuth.signIn(email, password);
    if (error) return { error };
    if (data?.user) { track('sign_in', { method: 'email' }); adoptSupabaseUser(data.user); }
    return { data };
  };

  const signInGoogle = async () => {
    track('sign_in_start', { method: 'google' });
    const { error } = await supaAuth.signInWithGoogle();
    return { error };
  };

  const resetPassword = async (email) => {
    const { error } = await supaAuth.resetPassword(email);
    return { error };
  };

  const signInGuest = ({ name } = {}) => {
    const profile = setProfile({ name });
    setUser({ ...profile, mode: 'guest' });
    setIsAuthenticated(true);
    setAuthMode('guest');
    track('guest_start');
    return profile;
  };

  const signInLocal = signInGuest;

  const logout = async () => {
    await deactivateSync();
    resetIdentity();
    setMonitoringUser(null);
    try { await supaAuth.signOut(); } catch {  }
    clearAllProgress();
    try {
      const id = user?.email || user?.id;
      if (id && typeof window !== 'undefined') {
        window.localStorage.removeItem(namespacedKey('codeflow_streak', id));
        window.localStorage.removeItem(namespacedKey('codeflow_last_level', id));
      }
    } catch {  }
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
