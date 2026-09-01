'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface OrnateKeyProps {
  color?: 'gold' | 'blue' | 'red';
  size?: number;
  glow?: boolean;
}

export const OrnateKey: React.FC<OrnateKeyProps> = ({
  color = 'gold',
  size = 28,
  glow = true,
}) => {
  const gemFill =
    color === 'blue'
      ? 'url(#blueGemGrad)'
      : color === 'red'
      ? 'url(#redGemGrad)'
      : 'url(#goldGemGrad)';

  const metalGrad =
    color === 'blue'
      ? 'url(#blueKeyMetal)'
      : color === 'red'
      ? 'url(#redKeyMetal)'
      : 'url(#goldKeyMetal)';

  const filterStyle =
    glow && color === 'blue'
      ? 'drop-shadow(0 0 8px #00e5ff)'
      : glow && color === 'red'
      ? 'drop-shadow(0 0 8px #ff2a5f)'
      : glow
      ? 'drop-shadow(0 0 8px #ffd700)'
      : undefined;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: filterStyle }}
      className="select-none"
    >
      <defs>
        {/* Golden Key Metal */}
        <linearGradient id="goldKeyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#fff2a8" />
          <stop offset="60%" stopColor="#ffd700" />
          <stop offset="90%" stopColor="#c68a0c" />
          <stop offset="100%" stopColor="#6e4600" />
        </linearGradient>

        {/* Blue Key Metal */}
        <linearGradient id="blueKeyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#80f1ff" />
          <stop offset="70%" stopColor="#00b4d8" />
          <stop offset="100%" stopColor="#005f73" />
        </linearGradient>

        {/* Red Key Metal */}
        <linearGradient id="redKeyMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#ff85a1" />
          <stop offset="70%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#6a040f" />
        </linearGradient>

        {/* Gemstone Gradients */}
        <radialGradient id="goldGemGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#b8860b" />
        </radialGradient>
        <radialGradient id="blueGemGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#005080" />
        </radialGradient>
        <radialGradient id="redGemGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#ff3366" />
          <stop offset="100%" stopColor="#800020" />
        </radialGradient>
      </defs>

      {/* Ornate Bow Handle */}
      <circle cx="22" cy="22" r="16" stroke={metalGrad} strokeWidth="5" fill="#0b101b" />
      <circle cx="22" cy="22" r="8" stroke={metalGrad} strokeWidth="2.5" fill="none" />
      
      {/* Decorative Bow Spikes / Filigree */}
      <circle cx="22" cy="3" r="3.5" fill={metalGrad} />
      <circle cx="3" cy="22" r="3.5" fill={metalGrad} />
      <circle cx="22" cy="41" r="3" fill={metalGrad} />
      <circle cx="41" cy="22" r="3" fill={metalGrad} />

      {/* Embedded Center Gem */}
      <polygon points="22,14 29,22 22,30 15,22" fill={gemFill} stroke="#ffffff" strokeWidth="1" />

      {/* Key Shaft */}
      <rect x="34" y="19.5" width="24" height="5" rx="1.5" fill={metalGrad} />
      <rect x="36" y="21" width="20" height="2" fill="#ffffff" opacity="0.6" />

      {/* Intricate Ward Teeth */}
      <rect x="49" y="24.5" width="4" height="8" rx="1" fill={metalGrad} />
      <rect x="54" y="24.5" width="4" height="12" rx="1" fill={metalGrad} />
      <circle cx="56" cy="35" r="1.5" fill="#ffffff" opacity="0.8" />
    </svg>
  );
};
