import React, { useState } from 'react';
import { font } from "@/lib/tokens";
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
      style={{ background: '#15130E' }}
    >
      <div
        className="w-full max-w-md p-10"
        style={{ border: '1px solid #262219', background: '#131009' }}
      >
        <div
          className="font-sans text-xs tracking-widest uppercase mb-3"
          style={{ color: '#FFFFFF' }}
        >
          WELCOME
        </div>
        <h1
          style={{
            fontFamily: font.display,
            fontSize: '2.25rem',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: '#F2EDE2',
            lineHeight: 1.12,
            margin: '0 0 12px',
          }}
        >
          Welcome to CodeFlow
        </h1>
        <p
          className="font-display text-sm mb-8"
          style={{ color: '#FFFFFF', fontWeight: 400 }}
        >
          Learn to build with AI. Your progress is saved locally on this device.
        </p>

        <form onSubmit={handleStart}>
          <label
            className="font-sans text-xs tracking-widest uppercase block mb-2"
            style={{ color: '#FFFFFF', fontFamily: font.body }}
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
              background: '#15130E',
              border: '1px solid #34302A',
              color: '#ECE7DC',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#E8A33C'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#34302A'; }}
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full font-sans text-sm tracking-widest uppercase px-8 py-4 transition-all duration-150"
            style={{
              background: name.trim() ? '#E8A33C' : '#262219',
              color: name.trim() ? '#15130E' : '#BBB3A4',
              fontWeight: 700,
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontFamily: font.body,
            }}
            onMouseEnter={(e) => {
              if (!name.trim()) return;
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(232,163,60,0.2)';
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
