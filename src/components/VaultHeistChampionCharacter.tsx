'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface CharacterProps {
  winnerName: string;
  isBlueWinner: boolean;
}

export const VaultHeistChampionCharacter: React.FC<CharacterProps> = ({
  winnerName,
  isBlueWinner,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      
      {/* 🏃‍♂️ CRAZY JOYFUL RUNNING & JUMPING CELEBRATION LOOP (GROUNDED ON FLOOR) */}
      <motion.div
        animate={{
          x: [-75, 75, -55, 55, -30, 30, 0],
          y: [0, -42, 0, -48, 0, -36, 0],
          rotate: [-8, 8, -6, 6, -3, 3, 0],
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col items-center"
      >
        {/* 2. FULL-BODY DYNAMIC ANATOMY HEIST HERO */}
        <svg
          width="300"
          height="390"
          viewBox="0 0 300 390"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_20px_35px_rgba(0,0,0,0.65)]"
        >
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE0BD" />
              <stop offset="50%" stopColor="#F5C6A5" />
              <stop offset="100%" stopColor="#D99B75" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A2810" />
              <stop offset="100%" stopColor="#1A0900" />
            </linearGradient>
            <linearGradient id="suitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isBlueWinner ? '#2563EB' : '#E11D48'} />
              <stop offset="50%" stopColor={isBlueWinner ? '#1D4ED8' : '#BE123C'} />
              <stop offset="100%" stopColor={isBlueWinner ? '#0F172A' : '#4C0519'} />
            </linearGradient>
            <linearGradient id="pantsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="goldChains" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="35%" stopColor="#FCD34D" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="shoeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#78350F" />
              <stop offset="100%" stopColor="#291102" />
            </linearGradient>
          </defs>

          {/* === 1. ANIMATED RUNNING LEGS & SHOES === */}
          {/* Left Leg (Running posture) */}
          <path
            d="M 115 220 L 95 320 L 125 320 L 135 220 Z"
            fill="url(#pantsGrad)"
            stroke="#0F172A"
            strokeWidth="3"
          />
          {/* Right Leg (Running posture) */}
          <path
            d="M 165 220 L 185 320 L 215 320 L 185 220 Z"
            fill="url(#pantsGrad)"
            stroke="#0F172A"
            strokeWidth="3"
          />

          {/* Left Polished Shoe */}
          <path
            d="M 80 320 C 80 305, 128 305, 128 320 L 130 338 C 130 344, 75 344, 75 338 Z"
            fill="url(#shoeGrad)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <line x1="78" y1="338" x2="128" y2="338" stroke="#F59E0B" strokeWidth="2.5" />

          {/* Right Polished Shoe */}
          <path
            d="M 175 320 C 175 305, 222 305, 222 320 L 225 338 C 225 344, 170 344, 170 338 Z"
            fill="url(#shoeGrad)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <line x1="172" y1="338" x2="222" y2="338" stroke="#F59E0B" strokeWidth="2.5" />

          {/* Gold Belt */}
          <rect x="110" y="212" width="80" height="12" fill="#0F172A" rx="2" />
          <rect x="140" y="209" width="20" height="18" fill="url(#goldChains)" rx="3" stroke="#92400E" strokeWidth="1.5" />
          <rect x="145" y="214" width="10" height="8" fill="#0F172A" rx="1" />

          {/* === 2. SUIT TORSO === */}
          <path
            d="M 100 120 L 200 120 L 208 215 L 92 215 Z"
            fill="url(#suitGrad)"
            stroke="#0F172A"
            strokeWidth="3.5"
          />
          {/* White Shirt Collar & Gold Tie */}
          <polygon points="135,120 165,120 150,150" fill="#FFFFFF" />
          <polygon points="144,145 156,145 160,195 150,205 140,195" fill="url(#goldChains)" stroke="#78350F" strokeWidth="1" />

          {/* 24k Gold Chains on Neck */}
          <path
            d="M 112 125 C 122 165, 178 165, 188 125"
            stroke="url(#goldChains)"
            strokeWidth="7"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 120 135 C 128 172, 172 172, 180 135"
            stroke="url(#goldChains)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Sparkling Diamond Brooch on Suit */}
          <polygon points="118,155 125,147 132,155 125,163" fill="#FFFFFF" stroke="#00E5FF" strokeWidth="1.5" />

          {/* === 3. HEAD & JOYFUL EXCITED FACE === */}
          <rect x="138" y="98" width="24" height="26" fill="url(#skinGrad)" rx="5" />
          <ellipse cx="150" cy="75" rx="34" ry="38" fill="url(#skinGrad)" stroke="#D99B75" strokeWidth="1.5" />

          {/* Excited Joyful Eyes with Sparkles */}
          <ellipse cx="137" cy="70" rx="5" ry="6" fill="#0F172A" />
          <circle cx="139" cy="68" r="2" fill="#FFFFFF" />
          <ellipse cx="163" cy="70" rx="5" ry="6" fill="#0F172A" />
          <circle cx="165" cy="68" r="2" fill="#FFFFFF" />

          {/* Big Cheering Open Smile */}
          <path
            d="M 134 85 Q 150 110 166 85 Z"
            fill="#991B1B"
            stroke="#450A0A"
            strokeWidth="2"
          />
          <path d="M 140 85 Q 150 93 160 85" fill="#FFFFFF" />

          {/* Styled Hair */}
          <path
            d="M 116 68 C 116 28, 184 28, 184 68 C 190 48, 182 20, 150 20 C 118 20, 110 48, 116 68 Z"
            fill="url(#hairGrad)"
          />

          {/* 👑 Golden Royal Crown with Gems */}
          <polygon points="122,34 134,8 150,22 166,8 178,34" fill="url(#goldChains)" stroke="#92400E" strokeWidth="2" />
          <circle cx="134" cy="10" r="4" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="150" cy="22" r="4.5" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="166" cy="10" r="4" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="1" />

          {/* === 4. WAVING ARMS HOLDING TROPHY BADGE === */}
          {/* Left Arm Raised */}
          <path d="M 100 125 L 60 65 L 75 50" stroke="url(#suitGrad)" strokeWidth="18" strokeLinecap="round" />
          <circle cx="60" cy="65" r="9" fill="url(#goldChains)" stroke="#92400E" strokeWidth="2" />

          {/* Right Arm Raised */}
          <path d="M 200 125 L 240 65 L 225 50" stroke="url(#suitGrad)" strokeWidth="18" strokeLinecap="round" />
          <circle cx="240" cy="65" r="9" fill="url(#goldChains)" stroke="#92400E" strokeWidth="2" />
        </svg>

        {/* 🏆 WINNER CHAMPIONSHIP BADGE HELD PROUDLY */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], y: [-30, -38, -30] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          className="absolute -top-12 z-30 flex flex-col items-center"
        >
          <div className="relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 border-4 border-white shadow-[0_12px_35px_rgba(217,164,65,0.85),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col items-center">
            
            {/* Crown Gem Accent */}
            <div className="absolute -top-3.5 px-3 py-0.5 rounded-full bg-slate-900 border-2 border-amber-300 flex items-center gap-1.5 shadow">
              <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
              <span className="text-[9px] font-black tracking-widest text-amber-300 font-game uppercase">
                VAULT CHAMPION BADGE
              </span>
            </div>

            <span className="text-2xl sm:text-3xl font-black font-bank tracking-wide uppercase text-slate-950 mt-1">
              {winnerName}
            </span>
            <span className="text-[11px] font-black tracking-widest uppercase font-game text-amber-950">
              OFFICIAL GRADE 6 HEIST CHAMPION
            </span>
          </div>
        </motion.div>

      </motion.div>

    </div>
  );
};
