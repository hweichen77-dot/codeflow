import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';

export default function ProfileGate() {
  const { signInLocal } = useAuth();
  const [name, setName] = useState('');

  const handleStart = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    signInLocal({ name: trimmed });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0a0a0a' }}
    >
      <div
        className="w-full max-w-md p-10"
        style={{ border: '1px solid #1a1a1a', background: '#0d0d0d' }}
      >
        <div
          className="font-mono text-xs tracking-widest uppercase mb-3"
          style={{ color: '#666' }}
        >
          § WELCOME
        </div>
        <h1
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#f0f0f0',
            lineHeight: 1.12,
            margin: '0 0 12px',
          }}
        >
          Welcome to CodeFlow
        </h1>
        <p
          className="font-display text-sm mb-8"
          style={{ color: '#999', fontWeight: 400 }}
        >
          Learn to build with AI. Your progress is saved locally on this device.
        </p>

        <form onSubmit={handleStart}>
          <label
            className="font-mono text-xs tracking-widest uppercase block mb-2"
            style={{ color: '#777', fontFamily: "'Space Mono', monospace" }}
          >
            Your name
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Lovelace"
            className="w-full px-4 py-3 mb-6 font-display text-base outline-none"
            style={{
              background: '#0a0a0a',
              border: '1px solid #2a2a2a',
              color: '#e8e8e8',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#b8ff00'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full font-mono text-sm tracking-widest uppercase px-8 py-4 transition-all duration-150"
            style={{
              background: name.trim() ? '#b8ff00' : '#1a1a1a',
              color: name.trim() ? '#0a0a0a' : '#555',
              fontWeight: 700,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: "'Space Mono', monospace",
            }}
            onMouseEnter={(e) => {
              if (!name.trim()) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(184,255,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '';
            }}
          >
            Start →
          </button>
        </form>
      </div>
    </div>
  );
}
