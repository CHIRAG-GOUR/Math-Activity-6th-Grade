'use client';

import React from 'react';

// =========================================================================
// 1. HIGH-QUANTITY 3D ISOMETRIC GOLD BULLION GRID (Massive Gold Bar Layer)
// =========================================================================
const render3DGoldGrid = (rows: number, cols: number, startX: number, startY: number, barW = 20, barH = 10, barD = 8) => {
  const bars = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (barW - 3) + r * 6;
      const y = startY + r * (barD + 2) - c * 2;
      bars.push(
        <g key={`gold-${r}-${c}`}>
          {/* Bottom/Front Face */}
          <polygon
            points={`${x},${y + barH} ${x + barW},${y + barH} ${x + barW},${y + barH + 7} ${x},${y + barH + 7}`}
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="0.5"
          />
          {/* Right Side Face */}
          <polygon
            points={`${x + barW},${y} ${x + barW + barD},${y - 4} ${x + barW + barD},${y + barH + 3} ${x + barW},${y + barH + 7}`}
            fill="#D97706"
            stroke="#78350F"
            strokeWidth="0.5"
          />
          {/* Top Beveled Face (Gleaming Gold Highlight) */}
          <polygon
            points={`${x},${y + barH} ${x + barW},${y + barH} ${x + barW + barD},${y - 4} ${x + barD},${y - 4}`}
            fill="url(#gtaGoldGleam)"
            stroke="#FDE68A"
            strokeWidth="0.75"
          />
        </g>
      );
    }
  }
  return bars;
};

// =========================================================================
// 2. GTA V LARGE 2-TIER INDUSTRIAL ROLLING WIRE CAGE (FULL OF GOLD BARS)
// =========================================================================
export const GtaLargeGoldRollingCage: React.FC<{ scale?: number; className?: string }> = ({
  scale = 1,
  className = '',
}) => {
  return (
    <svg
      width={280 * scale}
      height={240 * scale}
      viewBox="0 0 280 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] select-none ${className}`}
    >
      <defs>
        <linearGradient id="gtaGoldGleam" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="30%" stopColor="#FCD34D" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="steelTubeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#94A3B8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="cageBaseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>
      </defs>

      {/* 4 Heavy Duty Steel Caster Wheels */}
      <rect x="36" y="218" width="12" height="16" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
      <circle cx="42" cy="230" r="4" fill="#94A3B8" />
      <rect x="232" y="218" width="12" height="16" rx="2" fill="#0F172A" stroke="#475569" strokeWidth="1.5" />
      <circle cx="238" cy="230" r="4" fill="#94A3B8" />

      {/* Back Tubular Frame Arch */}
      <path
        d="M 30 220 L 30 40 Q 30 25 45 25 L 235 25 Q 250 25 250 40 L 250 220"
        stroke="url(#steelTubeGrad)"
        strokeWidth="6"
        fill="none"
      />

      {/* Back Wire Mesh Bars */}
      {[55, 80, 105, 130, 155, 180, 205, 225].map((bx) => (
        <line key={`bwire-${bx}`} x1={bx} y1="28" x2={bx} y2="220" stroke="#64748B" strokeWidth="2" opacity="0.6" />
      ))}

      {/* ================= LOWER SHELF: PACKED WITH GOLD BARS ================= */}
      <rect x="26" y="145" width="228" height="18" rx="2" fill="url(#cageBaseGrad)" stroke="#64748B" strokeWidth="2" />
      {render3DGoldGrid(2, 9, 32, 126, 23, 10, 6)}
      {render3DGoldGrid(2, 8, 42, 114, 23, 10, 6)}

      {/* ================= UPPER SHELF: PACKED WITH GOLD BARS ================= */}
      <rect x="26" y="65" width="228" height="18" rx="2" fill="url(#cageBaseGrad)" stroke="#64748B" strokeWidth="2" />
      {render3DGoldGrid(2, 9, 32, 46, 23, 10, 6)}
      {render3DGoldGrid(2, 8, 42, 34, 23, 10, 6)}

      {/* Front Corner Tubular Reinforcement & Brackets */}
      <line x1="28" y1="25" x2="28" y2="220" stroke="url(#steelTubeGrad)" strokeWidth="6" />
      <line x1="252" y1="25" x2="252" y2="220" stroke="url(#steelTubeGrad)" strokeWidth="6" />
      
      {/* Front Wire Mesh Safety Bars */}
      {[50, 75, 100, 125, 150, 175, 200, 225].map((bx) => (
        <line key={`fwire-${bx}`} x1={bx} y1="28" x2={bx} y2="220" stroke="#94A3B8" strokeWidth="2.5" />
      ))}

      {/* Middle & Corner Blue Locking Connectors */}
      <rect x="24" y="63" width="8" height="14" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
      <rect x="248" y="63" width="8" height="14" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
      <rect x="24" y="143" width="8" height="14" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
      <rect x="248" y="143" width="8" height="14" rx="2" fill="#1E40AF" stroke="#60A5FA" strokeWidth="1" />
    </svg>
  );
};

// =========================================================================
// 3. GTA V BLUE FOREGROUND 2-TIER GOLD TROLLEY
// =========================================================================
export const Gta3dBlueTrolley: React.FC<{ scale?: number; className?: string }> = ({
  scale = 1,
  className = '',
}) => {
  return (
    <svg
      width={240 * scale}
      height={200 * scale}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] select-none ${className}`}
    >
      <defs>
        <linearGradient id="blueFrame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E3A8A" />
        </linearGradient>
      </defs>

      {/* 4 Rolling Casters */}
      <circle cx="40" cy="184" r="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <circle cx="40" cy="184" r="3.5" fill="#94A3B8" />
      <circle cx="200" cy="184" r="10" fill="#0F172A" stroke="#334155" strokeWidth="2" />
      <circle cx="200" cy="184" r="3.5" fill="#94A3B8" />

      {/* Frame Legs */}
      <line x1="40" y1="40" x2="40" y2="180" stroke="url(#blueFrame)" strokeWidth="7" strokeLinecap="round" />
      <line x1="200" y1="40" x2="200" y2="180" stroke="url(#blueFrame)" strokeWidth="7" strokeLinecap="round" />
      {/* Push Handle */}
      <path d="M 22 40 L 40 40" stroke="#1E3A8A" strokeWidth="7" strokeLinecap="round" />

      {/* BOTTOM BLUE TRAY */}
      <rect x="28" y="125" width="184" height="24" rx="3" fill="url(#blueFrame)" stroke="#1E3A8A" strokeWidth="2" />
      {render3DGoldGrid(2, 7, 36, 108, 22, 9, 6)}
      {render3DGoldGrid(1, 6, 46, 99, 22, 9, 6)}

      {/* TOP BLUE TRAY */}
      <rect x="28" y="50" width="184" height="24" rx="3" fill="url(#blueFrame)" stroke="#1E3A8A" strokeWidth="2" />
      {render3DGoldGrid(2, 7, 36, 33, 22, 9, 6)}
      {render3DGoldGrid(1, 6, 46, 24, 22, 9, 6)}
    </svg>
  );
};

// =========================================================================
// 4. GTA V INDUSTRIAL CASH TROLLEY
// =========================================================================
export const Gta3dCashTrolley: React.FC<{ scale?: number; className?: string }> = ({
  scale = 1,
  className = '',
}) => {
  const renderCashStack = (x: number, y: number, height = 18) => (
    <g key={`cash-${x}-${y}`}>
      <rect x={x} y={y + 5} width="22" height={height} rx="1" fill="#166534" stroke="#052e16" strokeWidth="0.75" />
      <line x1={x + 2} y1={y + 9} x2={x + 20} y2={y + 9} stroke="#4ADE80" strokeWidth="1" />
      <line x1={x + 2} y1={y + 13} x2={x + 20} y2={y + 13} stroke="#4ADE80" strokeWidth="1" />
      <line x1={x + 2} y1={y + 17} x2={x + 20} y2={y + 17} stroke="#4ADE80" strokeWidth="1" />
      <polygon
        points={`${x},${y + 5} ${x + 22},${y + 5} ${x + 27},${y} ${x + 5},${y}`}
        fill="#F1F5F9"
        stroke="#475569"
        strokeWidth="0.75"
      />
      <rect x={x + 7} y={y + 5} width="8" height={height} fill="#E2E8F0" stroke="#334155" strokeWidth="0.5" />
    </g>
  );

  return (
    <svg
      width={240 * scale}
      height={200 * scale}
      viewBox="0 0 240 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_18px_30px_rgba(0,0,0,0.55)] select-none ${className}`}
    >
      <defs>
        <linearGradient id="greyFrame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#475569" />
          <stop offset="50%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      <circle cx="40" cy="184" r="10" fill="#0F172A" stroke="#475569" strokeWidth="2" />
      <circle cx="40" cy="184" r="3.5" fill="#94A3B8" />
      <circle cx="200" cy="184" r="10" fill="#0F172A" stroke="#475569" strokeWidth="2" />
      <circle cx="200" cy="184" r="3.5" fill="#94A3B8" />

      <line x1="40" y1="40" x2="40" y2="180" stroke="url(#greyFrame)" strokeWidth="7" strokeLinecap="round" />
      <line x1="200" y1="40" x2="200" y2="180" stroke="url(#greyFrame)" strokeWidth="7" strokeLinecap="round" />
      <path d="M 22 40 L 40 40" stroke="#0F172A" strokeWidth="7" strokeLinecap="round" />

      {/* BOTTOM TRAY */}
      <rect x="28" y="125" width="184" height="24" rx="3" fill="url(#greyFrame)" stroke="#0F172A" strokeWidth="2" />
      {[36, 60, 84, 108, 132, 156, 180].map((x) => renderCashStack(x, 105, 20))}
      {[48, 72, 96, 120, 144, 168].map((x) => renderCashStack(x, 92, 14))}

      {/* TOP TRAY */}
      <rect x="28" y="50" width="184" height="24" rx="3" fill="url(#greyFrame)" stroke="#0F172A" strokeWidth="2" />
      {[36, 60, 84, 108, 132, 156, 180].map((x) => renderCashStack(x, 30, 20))}
      {[48, 72, 96, 120, 144, 168].map((x) => renderCashStack(x, 16, 15))}
      {[60, 84, 108, 132, 156].map((x) => renderCashStack(x, 3, 14))}
    </svg>
  );
};

// =========================================================================
// 5. GTA V VELVET/STEEL JEWELRY TRAY PACKED WITH CUT DIAMONDS & GEMS
// =========================================================================
export const GtaJewelryDiamondTray: React.FC<{ scale?: number; className?: string }> = ({
  scale = 1,
  className = '',
}) => {
  const renderDiamond = (x: number, y: number, size = 18) => (
    <g key={`dia-${x}-${y}`} transform={`translate(${x}, ${y})`}>
      <polygon
        points={`0,${size*0.35} ${size*0.3},0 ${size*0.7},0 ${size},${size*0.35} ${size*0.5},${size}`}
        fill="#E0F7FF"
        stroke="#00C8FF"
        strokeWidth="0.75"
      />
      <polygon
        points={`${size*0.3},0 ${size*0.7},0 ${size*0.5},${size*0.35}`}
        fill="#FFFFFF"
        opacity="0.9"
      />
      <polygon
        points={`0,${size*0.35} ${size*0.3},0 ${size*0.5},${size*0.35}`}
        fill="#80D4FF"
        opacity="0.7"
      />
      <polygon
        points={`${size*0.7},0 ${size},${size*0.35} ${size*0.5},${size*0.35}`}
        fill="#4DB8FF"
        opacity="0.8"
      />
      <polygon
        points={`0,${size*0.35} ${size*0.5},${size*0.35} ${size*0.5},${size}`}
        fill="#29B6F6"
        opacity="0.9"
      />
      <polygon
        points={`${size},${size*0.35} ${size*0.5},${size*0.35} ${size*0.5},${size}`}
        fill="#0288D1"
        opacity="0.9"
      />
    </g>
  );

  const renderRuby = (x: number, y: number, size = 16) => (
    <g key={`ruby-${x}-${y}`} transform={`translate(${x}, ${y})`}>
      <polygon
        points={`0,${size*0.35} ${size*0.3},0 ${size*0.7},0 ${size},${size*0.35} ${size*0.5},${size}`}
        fill="#FF1E56"
        stroke="#FFE4E6"
        strokeWidth="0.75"
      />
      <polygon points={`${size*0.3},0 ${size*0.7},0 ${size*0.5},${size*0.35}`} fill="#FFF1F2" opacity="0.8" />
      <polygon points={`0,${size*0.35} ${size*0.3},0 ${size*0.5},${size*0.35}`} fill="#BE123C" />
      <polygon points={`${size*0.7},0 ${size},${size*0.35} ${size*0.5},${size*0.35}`} fill="#9F1239" />
    </g>
  );

  return (
    <svg
      width={160 * scale}
      height={65 * scale}
      viewBox="0 0 160 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_8px_18px_rgba(0,200,255,0.4)] select-none ${className}`}
    >
      <defs>
        <linearGradient id="trayVelvet" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Velvet Lined Steel Tray */}
      <polygon points="10,25 150,25 160,55 0,55" fill="url(#trayVelvet)" stroke="#475569" strokeWidth="2" />
      <polygon points="12,28 148,28 156,52 4,52" fill="#312E81" />

      {/* Array of Flawless Cut Diamonds & Rubies in Rows */}
      {renderDiamond(12, 12, 22)}
      {renderDiamond(38, 10, 24)}
      {renderDiamond(66, 12, 22)}
      {renderRuby(92, 14, 20)}
      {renderDiamond(116, 10, 24)}
      {renderRuby(140, 14, 18)}

      {/* Front Row Gemstones */}
      {renderRuby(20, 28, 20)}
      {renderDiamond(46, 26, 24)}
      {renderDiamond(74, 26, 24)}
      {renderDiamond(102, 28, 22)}
      {renderRuby(128, 30, 18)}
    </svg>
  );
};

// =========================================================================
// 6. GIANT FLOOR PYRAMID OF 3D GOLD BULLION BARS
// =========================================================================
export const GtaFloorGoldPyramid: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width={140}
      height={75}
      viewBox="0 0 140 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_8px_16px_rgba(245,158,11,0.5)] select-none ${className}`}
    >
      {render3DGoldGrid(1, 4, 10, 42, 28, 12, 8)}
      {render3DGoldGrid(1, 3, 24, 26, 28, 12, 8)}
      {render3DGoldGrid(1, 2, 38, 10, 28, 12, 8)}
    </svg>
  );
};

// =========================================================================
// 7. GIANT FLOOR STACK OF STRAPPED CASH BUNDLES
// =========================================================================
export const GtaFloorCashStack: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      width={130}
      height={70}
      viewBox="0 0 130 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`drop-shadow-[0_8px_16px_rgba(22,101,52,0.5)] select-none ${className}`}
    >
      {[10, 42, 74].map((x) => (
        <g key={`fcash-b-${x}`}>
          <rect x={x} y={35} width="28" height="22" rx="2" fill="#15803D" stroke="#052E16" strokeWidth="1" />
          <polygon points={`${x},35 ${x+28},35 ${x+34},28 ${x+6},28`} fill="#F8FAFC" stroke="#475569" strokeWidth="0.75" />
          <rect x={x+10} y={35} width="8" height="22" fill="#E2E8F0" stroke="#334155" strokeWidth="0.5" />
        </g>
      ))}
      {[26, 58].map((x) => (
        <g key={`fcash-t-${x}`}>
          <rect x={x} y={15} width="28" height="20" rx="2" fill="#16A34A" stroke="#052E16" strokeWidth="1" />
          <polygon points={`${x},15 ${x+28},15 ${x+34},8 ${x+6},8`} fill="#FFFFFF" stroke="#475569" strokeWidth="0.75" />
          <rect x={x+10} y={15} width="8" height="20" fill="#E2E8F0" stroke="#334155" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  );
};
