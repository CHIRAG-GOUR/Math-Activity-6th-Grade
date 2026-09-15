// ============================================================
// THE SOLAR FORGE: Interactive Protractor Instrument UI
// Clean, light-styled, physical-feeling protractor with vernier scale,
// degree markings (0°-180° / 0°-360°), pointer needle & angle readout
// ============================================================

import React, { useRef } from 'react';
import { TeamId } from '../types';

interface ProtractorControlProps {
  team: TeamId;
  currentAngle: number;
  onAngleChange: (angle: number) => void;
  maxAngle?: number;
}

export const ProtractorControl: React.FC<ProtractorControlProps> = ({
  team,
  currentAngle,
  onAngleChange,
  maxAngle = 180,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isBlue = team === 'blue';
  const primaryColor = isBlue ? '#0284c7' : '#dc2626';

  const handlePointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height; // Center is bottom-center for 180° protractor

    const dx = e.clientX - cx;
    const dy = cy - e.clientY; // Positive upwards

    let rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI;

    if (deg < 0) deg = 0;
    if (deg > maxAngle) deg = maxAngle;

    onAngleChange(Math.round(deg));
  };

  const needleRad = (currentAngle * Math.PI) / 180;
  const needleLength = 70;
  const needleX = 90 + Math.cos(needleRad) * needleLength;
  const needleY = 85 - Math.sin(needleRad) * needleLength;

  return (
    <div className="flex flex-col items-center bg-slate-50/95 border border-slate-200 rounded-xl p-2.5 shadow-sm">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
          Precision Protractor
        </span>
        <div className="flex items-center gap-1">
          <span className="text-base font-extrabold text-slate-800 tabular-nums">
            {currentAngle}°
          </span>
        </div>
      </div>

      {/* SVG Protractor Instrument */}
      <svg
        ref={svgRef}
        viewBox="0 0 180 95"
        className="w-full max-w-[210px] h-[95px] cursor-pointer touch-none select-none"
        onPointerDown={handlePointer}
        onPointerMove={(e) => {
          if (e.buttons === 1) handlePointer(e);
        }}
      >
        {/* Semi-circular protractor body */}
        <path
          d="M 10 85 A 80 80 0 0 1 170 85 Z"
          fill="#f8fafc"
          stroke="#cbd5e1"
          strokeWidth="1.5"
        />

        {/* Inner transparent window */}
        <path
          d="M 45 85 A 45 45 0 0 1 135 85 Z"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* Degree tick marks every 10° and 30° */}
        {Array.from({ length: 19 }).map((_, i) => {
          const deg = i * 10;
          const rad = (deg * Math.PI) / 180;
          const isMajor = deg % 30 === 0;
          const rOuter = 80;
          const rInner = isMajor ? 68 : 74;

          const x1 = 90 + Math.cos(rad) * rInner;
          const y1 = 85 - Math.sin(rad) * rInner;
          const x2 = 90 + Math.cos(rad) * rOuter;
          const y2 = 85 - Math.sin(rad) * rOuter;

          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMajor ? '#475569' : '#94a3b8'}
              strokeWidth={isMajor ? 1.5 : 0.8}
            />
          );
        })}

        {/* Key numeric labels: 0°, 30°, 60°, 90°, 120°, 150°, 180° */}
        {[0, 45, 90, 135, 180].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const tx = 90 + Math.cos(rad) * 58;
          const ty = 85 - Math.sin(rad) * 58;
          return (
            <text
              key={deg}
              x={tx}
              y={ty + 3}
              textAnchor="middle"
              fontSize="7"
              fontWeight="bold"
              fill="#64748b"
            >
              {deg}°
            </text>
          );
        })}

        {/* Dynamic Interactive Needle */}
        <line
          x1="90"
          y1="85"
          x2={needleX}
          y2={needleY}
          stroke={primaryColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Center Pivot Boss */}
        <circle cx="90" cy="85" r="4" fill={primaryColor} />
        <circle cx="90" cy="85" r="1.5" fill="#ffffff" />
      </svg>

      {/* Quick Fine-Adjustment Steppers */}
      <div className="flex items-center justify-center gap-2 mt-1 w-full">
        <button
          onClick={() => onAngleChange(Math.max(0, currentAngle - 5))}
          className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 rounded active:scale-95 transition-all"
        >
          -5°
        </button>
        <button
          onClick={() => onAngleChange(Math.max(0, currentAngle - 1))}
          className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 rounded active:scale-95 transition-all"
        >
          -1°
        </button>
        <button
          onClick={() => onAngleChange(Math.min(maxAngle, currentAngle + 1))}
          className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 rounded active:scale-95 transition-all"
        >
          +1°
        </button>
        <button
          onClick={() => onAngleChange(Math.min(maxAngle, currentAngle + 5))}
          className="px-2 py-0.5 text-xs font-bold text-slate-600 bg-slate-200/80 hover:bg-slate-300 rounded active:scale-95 transition-all"
        >
          +5°
        </button>
      </div>
    </div>
  );
};
