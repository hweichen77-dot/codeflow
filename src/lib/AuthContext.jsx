import React, { createContext, useState, useContext, useEffect } from 'react';
import { getProfile, setProfile, clear as clearProfile } from '@/api/localProfile';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const profile = getProfile();
    if (profile) {
      setUser(profile);
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
  }, []);

  // Local sign-in: persist a profile and flip auth on. No server.
  const signInLocal = ({ name, email } = {}) => {
    const profile = setProfile({ name, email });
    setUser(profile);
    setIsAuthenticated(true);
    return profile;
  };

  const logout = () => {
    clearProfile();
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') window.location.reload();
  };

  const navigateToLogin = () => {
    // No external login — the ProfileGate handles first-run sign-in. No-op.
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError: null,
      appPublicSettings: null,
      logout,
      navigateToLogin,
      signInLocal,
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
