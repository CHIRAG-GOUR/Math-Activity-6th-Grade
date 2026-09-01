'use client';

import React from 'react';

interface TreasureChestProps {
  side?: 'left' | 'right';
  className?: string;
}

export const TreasureChest: React.FC<TreasureChestProps> = ({
  side = 'left',
  className = '',
}) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 240 160"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chestWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6d4c41" />
            <stop offset="50%" stopColor="#4e342e" />
            <stop offset="100%" stopColor="#271410" />
          </linearGradient>

          <linearGradient id="goldCoins" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fff176" />
            <stop offset="70%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>

          <linearGradient id="chestGoldRim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="50%" stopColor="#ffe57f" />
            <stop offset="100%" stopColor="#c68a0c" />
          </linearGradient>

          <radialGradient id="rubyGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#ff80ab" />
            <stop offset="50%" stopColor="#ff1744" />
            <stop offset="100%" stopColor="#880e4f" />
          </radialGradient>

          <radialGradient id="cyanGemGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e0f7fa" />
            <stop offset="50%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#006064" />
          </radialGradient>
        </defs>

        {/* Chest Open Lid Behind */}
        <path
          d="M 30,55 Q 120,10 210,55 L 210,40 Q 120,0 30,40 Z"
          fill="url(#chestWood)"
          stroke="#ffd700"
          strokeWidth="3"
        />

        {/* Spilled Gold Mountain Inside Chest */}
        <ellipse cx="120" cy="70" rx="85" ry="30" fill="url(#goldCoins)" />

        {/* Individual Shiny Gold Coins & Bullion */}
        <circle cx="90" cy="65" r="8" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="115" cy="58" r="9" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="140" cy="62" r="8.5" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="75" cy="78" r="7" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="105" cy="75" r="9.5" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="135" cy="74" r="8" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="160" cy="72" r="7.5" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />

        {/* Scattered Ruby & Diamond Gemstones */}
        <polygon points="120,48 126,56 120,64 114,56" fill="url(#rubyGlow)" filter="drop-shadow(0 0 6px #ff1744)" />
        <polygon points="80,68 85,74 80,80 75,74" fill="url(#cyanGemGlow)" filter="drop-shadow(0 0 6px #00e5ff)" />
        <polygon points="155,58 162,65 155,72 148,65" fill="url(#rubyGlow)" filter="drop-shadow(0 0 6px #ff1744)" />

        {/* Chest Main Body Container */}
        <path
          d="M 30,68 L 40,140 Q 120,155 200,140 L 210,68 Q 120,82 30,68 Z"
          fill="url(#chestWood)"
          stroke="#1b120c"
          strokeWidth="3"
        />

        {/* Gold Metal Reinforcement Bands */}
        <path d="M 40,70 L 48,140 L 60,141 L 52,71 Z" fill="url(#chestGoldRim)" />
        <path d="M 188,70 L 180,140 L 192,141 L 200,71 Z" fill="url(#chestGoldRim)" />
        <path d="M 114,76 L 114,148 L 126,148 L 126,76 Z" fill="url(#chestGoldRim)" />

        {/* Heavy Golden Keyhole Lock */}
        <rect x="110" y="85" width="20" height="26" rx="4" fill="url(#chestGoldRim)" stroke="#3e2723" strokeWidth="2" />
        <circle cx="120" cy="94" r="3.5" fill="#1b120c" />
        <polygon points="118,94 122,94 123,104 117,104" fill="#1b120c" />

        {/* Front Overflowing Coins on Cavern Ground */}
        <circle cx="45" cy="142" r="6" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="58" cy="146" r="6.5" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="178" cy="145" r="7" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
        <circle cx="192" cy="142" r="6" fill="url(#goldCoins)" stroke="#ffd700" strokeWidth="1" />
      </svg>
    </div>
  );
};
