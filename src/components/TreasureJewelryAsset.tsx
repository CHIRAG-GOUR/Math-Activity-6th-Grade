'use client';

import React from 'react';

interface TreasureProps {
  type: 'gold_bar' | 'gold_nugget' | 'diamond' | 'ruby' | 'sapphire' | 'jewelry_necklace';
  className?: string;
  size?: number;
}

export const TreasureJewelryAsset: React.FC<TreasureProps> = ({ type, className = '', size = 64 }) => {
  if (type === 'gold_bar') {
    return (
      <svg
        width={size}
        height={size * 0.65}
        viewBox="0 0 100 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_4px_12px_rgba(217,164,65,0.6)] ${className}`}
      >
        <defs>
          <linearGradient id="goldTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF7D6" />
            <stop offset="50%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#D49A17" />
          </linearGradient>
          <linearGradient id="goldFront" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E6B800" />
            <stop offset="100%" stopColor="#8C5C00" />
          </linearGradient>
          <linearGradient id="goldSide" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9940A" />
            <stop offset="100%" stopColor="#664400" />
          </linearGradient>
        </defs>
        {/* Top Face */}
        <polygon points="15,10 85,10 95,25 5,25" fill="url(#goldTop)" stroke="#FFF3B0" strokeWidth="1" />
        {/* Front Face */}
        <polygon points="5,25 95,25 85,55 15,55" fill="url(#goldFront)" stroke="#8C5C00" strokeWidth="1" />
        {/* Subtle Metallic Bevel Inset */}
        <polygon points="20,30 80,30 74,48 26,48" fill="#F5C71A" stroke="#B45309" strokeWidth="0.75" opacity="0.6" />
      </svg>
    );
  }

  if (type === 'gold_nugget') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_4px_10px_rgba(217,164,65,0.5)] ${className}`}
      >
        <defs>
          <radialGradient id="nuggetGlow" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="35%" stopColor="#FFD700" />
            <stop offset="70%" stopColor="#CC8800" />
            <stop offset="100%" stopColor="#664400" />
          </radialGradient>
        </defs>
        <path
          d="M 25 15 Q 45 8 60 20 Q 75 35 68 55 Q 55 72 35 68 Q 12 65 15 45 Q 12 25 25 15 Z"
          fill="url(#nuggetGlow)"
          stroke="#FFE680"
          strokeWidth="1.5"
        />
        {/* Facet Highlights */}
        <path d="M 30 20 L 45 28 L 35 40 Z" fill="#FFFDF0" opacity="0.6" />
        <path d="M 50 32 L 62 40 L 52 50 Z" fill="#996600" opacity="0.4" />
      </svg>
    );
  }

  if (type === 'diamond') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_4px_14px_rgba(0,200,255,0.7)] ${className}`}
      >
        <defs>
          <linearGradient id="diaTable" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D4F6FF" />
          </linearGradient>
          <linearGradient id="diaFacet1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B3E8FF" />
            <stop offset="100%" stopColor="#4DB8FF" />
          </linearGradient>
          <linearGradient id="diaFacet2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E0F7FF" />
            <stop offset="100%" stopColor="#80D4FF" />
          </linearGradient>
        </defs>
        {/* Crown Table */}
        <polygon points="25,18 55,18 70,32 10,32" fill="url(#diaTable)" stroke="#FFFFFF" strokeWidth="1" />
        {/* Crown Facets */}
        <polygon points="25,18 40,32 55,18" fill="#FFFFFF" opacity="0.8" />
        <polygon points="10,32 25,18 40,32" fill="url(#diaFacet2)" />
        <polygon points="70,32 55,18 40,32" fill="url(#diaFacet1)" />
        {/* Pavilion Point */}
        <polygon points="10,32 40,32 40,70" fill="url(#diaFacet1)" stroke="#B3E8FF" strokeWidth="0.5" />
        <polygon points="70,32 40,32 40,70" fill="url(#diaFacet2)" stroke="#B3E8FF" strokeWidth="0.5" />
        <polygon points="25,32 40,70 55,32" fill="#FFFFFF" opacity="0.6" />
        {/* Sparkle Glint */}
        <circle cx="28" cy="22" r="3" fill="#FFFFFF" />
      </svg>
    );
  }

  if (type === 'ruby') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_4px_14px_rgba(255,42,95,0.7)] ${className}`}
      >
        <defs>
          <linearGradient id="rubyTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA6B8" />
            <stop offset="50%" stopColor="#FF1E56" />
            <stop offset="100%" stopColor="#9E0026" />
          </linearGradient>
        </defs>
        <polygon points="22,16 58,16 72,30 40,68 8,30" fill="url(#rubyTop)" stroke="#FFD1DC" strokeWidth="1.5" />
        <polygon points="22,16 40,30 58,16" fill="#FFF0F3" opacity="0.7" />
        <polygon points="8,30 40,30 40,68" fill="#D60036" />
        <polygon points="72,30 40,30 40,68" fill="#75001A" />
      </svg>
    );
  }

  if (type === 'sapphire') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`drop-shadow-[0_4px_14px_rgba(0,100,255,0.7)] ${className}`}
      >
        <defs>
          <linearGradient id="saphTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8AC6FF" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00227A" />
          </linearGradient>
        </defs>
        <polygon points="40,10 70,30 58,68 22,68 10,30" fill="url(#saphTop)" stroke="#BFE0FF" strokeWidth="1.5" />
        <polygon points="40,10 40,40 70,30" fill="#FFFFFF" opacity="0.6" />
        <polygon points="40,10 40,40 10,30" fill="#0044CC" />
        <polygon points="10,30 40,40 22,68" fill="#00227A" />
        <polygon points="70,30 40,40 58,68" fill="#001650" />
      </svg>
    );
  }

  // jewelry_necklace
  return (
    <svg
      width={size * 1.3}
      height={size}
      viewBox="0 0 120 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_4px_16px_rgba(255,215,0,0.7)] ${className}`}
    >
      <defs>
        <linearGradient id="chainGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D49A17" />
          <stop offset="50%" stopColor="#FFF099" />
          <stop offset="100%" stopColor="#D49A17" />
        </linearGradient>
      </defs>
      {/* Gold Chain Arc */}
      <path
        d="M 15 15 C 20 65, 100 65, 105 15"
        stroke="url(#chainGold)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Small Pearls along chain */}
      {[25, 38, 50, 60, 70, 82, 95].map((x, i) => {
        const y = Math.sin((i / 6) * Math.PI) * 28 + 24;
        return <circle key={i} cx={x} cy={y} r="3" fill="#FFFBF0" stroke="#D49A17" strokeWidth="1" />;
      })}
      {/* Center Ruby & Gold Pendant */}
      <g transform="translate(48, 48)">
        <polygon points="12,0 24,10 18,26 6,26 0,10" fill="#D49A17" stroke="#FFF3B0" strokeWidth="1.5" />
        <polygon points="12,4 20,11 16,22 8,22 4,11" fill="#FF1E56" stroke="#FFA6B8" strokeWidth="1" />
        <circle cx="12" cy="11" r="2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
