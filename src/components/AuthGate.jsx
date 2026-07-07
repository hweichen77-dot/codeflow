import React, { useState } from 'react';
import { font } from "@/lib/tokens";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const LABEL = font.body;
const SERIF = font.display;

const field = {
  background: '#15130E',
  border: '1px solid #34302A',
  color: '#ECE7DC',
};

function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span
        className="font-sans text-xs tracking-widest uppercase block mb-2"
        style={{ color: '#FFFFFF', fontFamily: LABEL }}
      >
        {label}
      </span>
      <input
        {...props}
        className="w-full px-4 py-3 font-display text-base outline-none"
        style={field}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#E8A33C'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#34302A'; }}
      />
    </label>
  );
}

export default function AuthGate() {
  const { signInGoogle, signInGuest, supabaseConfigured } = useAuth();
  const navigate = useNavigate();

  // 'google' = sign in with Google; 'guest' = local-only quick start. Always
  // start on the sign-in screen so guest mode is never a dead-end, it keeps a
  // "back" route even when Supabase isn't configured (e.g. an unconfigured build).
  const [mode, setMode] = useState('google');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const go = () => navigate('/');

  const google = async () => {
    setError('');
    if (!supabaseConfigured) {
      setError('Accounts are not configured yet. Use "Continue as guest" for now.');
      return;
    }
    setBusy(true);
    const { error } = await signInGoogle();
    if (error) { setError(error.message || 'Could not sign in with Google.'); setBusy(false); }
  };

  const startGuest = (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return;
    signInGuest({ name: name.trim() });
    go();
  };

  const titles = {
    google: 'Welcome to CodeFlow',
    guest: 'Quick start',
  };
  const subtitles = {
    google: 'Sign in with Google to save your progress across devices.',
    guest: 'No account, progress is saved locally on this device.',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#15130E' }}>
      <div className="w-full max-w-md p-10" style={{ border: '1px solid #262219', background: '#131009' }}>
        <div className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: '#FFFFFF', fontFamily: LABEL }}>
          CODEFLOW
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#F2EDE2', lineHeight: 1.12, margin: '0 0 10px' }}>
          {titles[mode]}
        </h1>
        <p className="font-display text-sm mb-7" style={{ color: '#FFFFFF', fontWeight: 400 }}>
          {subtitles[mode]}
        </p>

        {!supabaseConfigured && mode !== 'guest' && (
          <div className="font-sans text-xs mb-6 px-3 py-2" style={{ color: '#E0B341', background: '#E0B34110', border: '1px solid #E0B34133' }}>
            Accounts aren't set up on this build yet. Use <strong>Continue as guest</strong> to start now.
          </div>
        )}

        {mode === 'google' && (
          <>
            {supabaseConfigured && (
              <>
                <button
                  type="button"
                  onClick={google}
                  disabled={busy}
                  className="w-full font-sans text-sm tracking-widest uppercase px-8 py-3.5 mb-5 transition-all duration-150 flex items-center justify-center gap-3"
                  style={{ background: '#15130E', color: '#ECE7DC', border: '1px solid #34302A', fontFamily: LABEL, cursor: busy ? 'not-allowed' : 'pointer' }}
                  onMouseEnter={(e) => { if (!busy) e.currentTarget.style.borderColor = '#E8A33C'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#34302A'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                    <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.3 5.3C41.4 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"/>
                  </svg>
                  {busy ? 'Redirecting…' : 'Continue with Google'}
                </button>

                {error && (
                  <div className="font-sans text-xs mb-4 px-3 py-2" style={{ color: '#F3B0A6', background: '#FF6B5C12', border: '1px solid #FF6B5C33' }}>
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 my-5">
                  <div style={{ flex: 1, height: '1px', background: '#262219' }} />
                  <span className="font-sans text-xs" style={{ color: '#FFFFFF', fontFamily: LABEL }}>or</span>
                  <div style={{ flex: 1, height: '1px', background: '#262219' }} />
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => { setMode('guest'); setError(''); }}
              className="w-full font-sans text-xs tracking-widest uppercase px-8 py-3"
              style={{ background: 'transparent', color: '#E8A33C', border: '1px solid #262219', fontFamily: LABEL, cursor: 'pointer' }}
            >
              Continue as guest →
            </button>
          </>
        )}

        {mode === 'guest' && (
          <form onSubmit={startGuest}>
            <Input
              label="Name"
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
            />

            {error && (
              <div className="font-sans text-xs mb-4 px-3 py-2" style={{ color: '#F3B0A6', background: '#FF6B5C12', border: '1px solid #FF6B5C33' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full font-sans text-sm tracking-widest uppercase px-8 py-4 transition-all duration-150"
              style={{
                background: name.trim() ? '#E8A33C' : '#262219',
                color: name.trim() ? '#15130E' : '#8F8779',
                fontWeight: 700, cursor: name.trim() ? 'pointer' : 'not-allowed', fontFamily: LABEL,
              }}
            >
              Start →
            </button>

            <button
              type="button"
              onClick={() => { setMode('google'); setError(''); }}
              className="w-full mt-5 font-sans text-xs"
              style={{ color: '#FFFFFF', fontFamily: LABEL, background: 'transparent' }}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
