import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const MONO = "'Space Mono', monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

const field = {
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  color: '#e8e8e8',
};

function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span
        className="font-mono text-xs tracking-widest uppercase block mb-2"
        style={{ color: '#c4c4c4', fontFamily: MONO }}
      >
        {label}
      </span>
      <input
        {...props}
        className="w-full px-4 py-3 font-display text-base outline-none"
        style={field}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#b8ff00'; }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
      />
    </label>
  );
}

export default function AuthGate() {
  const { signInEmail, signUpEmail, signInGoogle, resetPassword, signInGuest, supabaseConfigured } = useAuth();
  const navigate = useNavigate();

  // 'signin' | 'signup' | 'forgot' | 'guest'
  // Until Supabase is configured, email auth can't work — lead with guest.
  const [mode, setMode] = useState(supabaseConfigured ? 'signin' : 'guest');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const go = () => navigate('/');

  const google = async () => {
    setError(''); setNotice('');
    if (!supabaseConfigured) {
      setError('Email accounts are not configured yet. Use "Continue as guest" for now.');
      return;
    }
    setBusy(true);
    const { error } = await signInGoogle();
    if (error) { setError(error.message || 'Could not sign in with Google.'); setBusy(false); }
    // On success the browser redirects to Google, then back to '/'.
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setNotice('');

    if (mode === 'guest') {
      if (!name.trim()) return;
      signInGuest({ name: name.trim() });
      return go();
    }

    if (!supabaseConfigured) {
      setError('Email accounts are not configured yet. Use "Continue as guest" for now.');
      return;
    }

    setBusy(true);
    try {
      if (mode === 'signin') {
        const { error } = await signInEmail({ email: email.trim(), password });
        if (error) setError(error.message || 'Could not sign in.');
        else go();
      } else if (mode === 'signup') {
        const { error, needsConfirmation } = await signUpEmail({ email: email.trim(), password, name: name.trim() });
        if (error) setError(error.message || 'Could not create account.');
        else if (needsConfirmation) setNotice('Check your inbox to confirm your email, then sign in.');
        else go();
      } else if (mode === 'forgot') {
        const { error } = await resetPassword(email.trim());
        if (error) setError(error.message || 'Could not send reset email.');
        else setNotice('Password reset link sent — check your inbox.');
      }
    } finally {
      setBusy(false);
    }
  };

  const tab = (key, label) => (
    <button
      type="button"
      onClick={() => { setMode(key); setError(''); setNotice(''); }}
      className="font-mono text-xs tracking-widest uppercase px-3 py-2 transition-all"
      style={{
        color: mode === key ? '#b8ff00' : '#888',
        borderBottom: mode === key ? '2px solid #b8ff00' : '2px solid transparent',
        background: 'transparent', fontFamily: MONO, marginBottom: '-1px',
      }}
    >
      {label}
    </button>
  );

  const titles = {
    signin: 'Welcome back',
    signup: 'Create your account',
    forgot: 'Reset your password',
    guest: 'Quick start',
  };
  const subtitles = {
    signin: 'Sign in to pick up where you left off.',
    signup: 'Save your progress and track how you’re doing.',
    forgot: 'We’ll email you a link to set a new password.',
    guest: 'No account — progress is saved locally on this device.',
  };

  const canSubmit =
    mode === 'guest' ? name.trim()
    : mode === 'forgot' ? email.trim()
    : mode === 'signup' ? (email.trim() && password.length >= 6 && name.trim())
    : (email.trim() && password);

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0a0a0a' }}>
      <div className="w-full max-w-md p-10" style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}>
        <div className="font-mono text-xs tracking-widest uppercase mb-3" style={{ color: '#c4c4c4', fontFamily: MONO }}>
          § CODEFLOW
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: '2.1rem', fontWeight: 800, letterSpacing: '-0.025em', color: '#f0f0f0', lineHeight: 1.12, margin: '0 0 10px' }}>
          {titles[mode]}
        </h1>
        <p className="font-display text-sm mb-7" style={{ color: '#d4d4d4', fontWeight: 400 }}>
          {subtitles[mode]}
        </p>

        {!supabaseConfigured && mode !== 'guest' && (
          <div className="font-mono text-xs mb-6 px-3 py-2" style={{ color: '#ffb300', background: '#ffb30010', border: '1px solid #ffb30033' }}>
            Email accounts aren’t set up on this build yet. Use <strong>Continue as guest</strong> to start now.
          </div>
        )}

        {/* OAuth — only meaningful when Supabase + a Google provider are configured. */}
        {supabaseConfigured && mode !== 'guest' && mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={google}
              disabled={busy}
              className="w-full font-mono text-sm tracking-widest uppercase px-8 py-3.5 mb-5 transition-all duration-150 flex items-center justify-center gap-3"
              style={{ background: '#0a0a0a', color: '#e8e8e8', border: '1px solid #2a2a2a', fontFamily: MONO, cursor: busy ? 'not-allowed' : 'pointer' }}
              onMouseEnter={(e) => { if (!busy) e.currentTarget.style.borderColor = '#b8ff00'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.4l6.3 5.3C41.4 36.5 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z"/>
              </svg>
              Continue with Google
            </button>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
              <span className="font-mono text-xs" style={{ color: '#666', fontFamily: MONO }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#1e1e1e' }} />
            </div>
          </>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-7" style={{ borderBottom: '1px solid #1e1e1e' }}>
          {tab('signin', 'Sign in')}
          {tab('signup', 'Sign up')}
          {tab('guest', 'Guest')}
        </div>

        <form onSubmit={submit}>
          {(mode === 'signup' || mode === 'guest') && (
            <Input
              label="Name"
              type="text"
              autoFocus={mode === 'guest'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ada Lovelace"
            />
          )}
          {mode !== 'guest' && (
            <Input
              label="Email"
              type="email"
              autoFocus={mode !== 'guest' && mode !== 'signup'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          )}
          {(mode === 'signin' || mode === 'signup') && (
            <Input
              label={mode === 'signup' ? 'Password (min 6 chars)' : 'Password'}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          )}

          {error && (
            <div className="font-mono text-xs mb-4 px-3 py-2" style={{ color: '#fca5a5', background: '#ef444412', border: '1px solid #ef444433' }}>
              {error}
            </div>
          )}
          {notice && (
            <div className="font-mono text-xs mb-4 px-3 py-2" style={{ color: '#b8ff00', background: '#b8ff0010', border: '1px solid #b8ff0033' }}>
              {notice}
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || busy}
            className="w-full font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-150"
            style={{
              background: canSubmit && !busy ? '#b8ff00' : '#1a1a1a',
              color: canSubmit && !busy ? '#0a0a0a' : '#888',
              fontWeight: 700, cursor: canSubmit && !busy ? 'pointer' : 'not-allowed', fontFamily: MONO,
            }}
          >
            {busy ? 'Working…'
              : mode === 'signin' ? 'Sign in →'
              : mode === 'signup' ? 'Create account →'
              : mode === 'forgot' ? 'Send reset link →'
              : 'Start →'}
          </button>
        </form>

        {/* Footer links */}
        <div className="mt-5 flex items-center justify-between">
          {mode === 'signin' ? (
            <button type="button" onClick={() => { setMode('forgot'); setError(''); setNotice(''); }}
              className="font-mono text-xs" style={{ color: '#888', fontFamily: MONO }}>
              Forgot password?
            </button>
          ) : <span />}
          {mode !== 'guest' && (
            <button type="button" onClick={() => { setMode('guest'); setError(''); setNotice(''); }}
              className="font-mono text-xs" style={{ color: '#b8ff00', fontFamily: MONO }}>
              Continue as guest →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
