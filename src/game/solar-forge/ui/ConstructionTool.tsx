// ============================================================
// THE SOLAR FORGE: Interactive Construction Station
// Compass & Straightedge geometric construction tool:
// Angle Bisector arcs, Perpendicular normal erection & snap alignment
// ============================================================

import React, { useState } from 'react';
import { TeamId } from '../types';

interface ConstructionToolProps {
  team: TeamId;
  baseAngle: number;
  targetAngle: number;
  type: 'angle_bisector' | 'perpendicular';
  onConstructBisector: (angle: number) => void;
  onComplete: () => void;
}

export const ConstructionTool: React.FC<ConstructionToolProps> = ({
  team,
  baseAngle,
  targetAngle,
  type,
  onConstructBisector,
  onComplete,
}) => {
  const [step, setStep] = useState<number>(0);
  const isBlue = team === 'blue';
  const primaryColor = isBlue ? '#0284c7' : '#dc2626';

  const isBisector = type === 'angle_bisector';
  const halfAngle = isBisector ? Math.round(baseAngle / 2) : 90;

  const handleNextStep = () => {
    if (step === 0) {
      // Step 1: Draw primary radius arc across both arms
      setStep(1);
    } else if (step === 1) {
      // Step 2: Draw intersecting arcs from ray endpoints
      setStep(2);
      onConstructBisector(halfAngle);
    } else if (step === 2) {
      // Step 3: Draw constructed ray through intersection point
      setStep(3);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center bg-slate-50/95 border border-slate-200 rounded-xl p-2.5 shadow-sm">
      <div className="flex items-center justify-between w-full mb-1">
        <span className="text-[11px] font-bold tracking-wider text-slate-600 uppercase">
          Geometric Construction Station
        </span>
        <span className="text-xs font-extrabold text-amber-600">
          Step {step + 1} / 4
        </span>
      </div>

      {/* SVG Construction Canvas */}
      <svg
        viewBox="0 0 160 100"
        className="w-full max-w-[200px] h-[95px] bg-white border border-slate-200 rounded-lg select-none"
      >
        {/* Baseline Ray 1 (Horizontal along X) */}
        <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2" />

        {/* Slanted Ray 2 at baseAngle */}
        {isBisector && (
          <line
            x1="20"
            y1="80"
            x2={20 + Math.cos((baseAngle * Math.PI) / 180) * 110}
            y2={80 - Math.sin((baseAngle * Math.PI) / 180) * 110}
            stroke="#334155"
            strokeWidth="2"
          />
        )}

        {/* Vertex Point O */}
        <circle cx="20" cy="80" r="3" fill="#0f172a" />
        <text x="12" y="88" fontSize="8" fontWeight="bold" fill="#64748b">O</text>

        {/* Step 1 Arc: Drawn with compass from vertex */}
        {step >= 1 && (
          <path
            d={`M ${20 + Math.cos((baseAngle * Math.PI) / 180) * 45} ${80 - Math.sin((baseAngle * Math.PI) / 180) * 45} A 45 45 0 0 1 65 80`}
            fill="none"
            stroke="#0284c7"
            strokeWidth="1.5"
            strokeDasharray="3 2"
          />
        )}

        {/* Step 2 Intersecting Arcs */}
        {step >= 2 && (
          <g>
            <circle
              cx={20 + Math.cos((halfAngle * Math.PI) / 180) * 75}
              cy={80 - Math.sin((halfAngle * Math.PI) / 180) * 75}
              r="4"
              fill="#eab308"
            />
            <path
              d={`M ${20 + Math.cos((halfAngle * Math.PI) / 180) * 75 - 10} ${80 - Math.sin((halfAngle * Math.PI) / 180) * 75 + 5} Q ${20 + Math.cos((halfAngle * Math.PI) / 180) * 75} ${80 - Math.sin((halfAngle * Math.PI) / 180) * 75} ${20 + Math.cos((halfAngle * Math.PI) / 180) * 75 + 10} ${80 - Math.sin((halfAngle * Math.PI) / 180) * 75 - 5}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
            />
          </g>
        )}

        {/* Step 3: Constructed Ray through Intersection Point */}
        {step >= 3 && (
          <line
            x1="20"
            y1="80"
            x2={20 + Math.cos((halfAngle * Math.PI) / 180) * 125}
            y2={80 - Math.sin((halfAngle * Math.PI) / 180) * 125}
            stroke={primaryColor}
            strokeWidth="2.5"
            strokeDasharray="none"
          />
        )}
      </svg>

      {/* Action Guidance & Progress Button */}
      <div className="w-full mt-1.5 flex flex-col gap-1">
        <p className="text-[11px] text-slate-600 text-center font-medium">
          {step === 0 && 'Tap to strike reference arc from vertex O.'}
          {step === 1 && 'Tap to strike intersecting arcs in the interior.'}
          {step === 2 && `Constructed bisector angle: ${halfAngle}°. Draw ray!`}
          {step >= 3 && 'Construction verified! Confirm lock to mirror.'}
        </p>

        <button
          onClick={handleNextStep}
          className="w-full py-1.5 px-3 text-xs font-extrabold rounded-lg shadow-sm text-white transition-all active:scale-95"
          style={{ backgroundColor: primaryColor }}
        >
          {step === 0 && '1. STRIKE REFERENCE ARC'}
          {step === 1 && '2. INTERSECT COMPASS ARCS'}
          {step === 2 && `3. DRAW ${halfAngle}° BISECTOR RAY`}
          {step >= 3 && '4. CONFIRM & ROTATE MIRROR'}
        </button>
      </div>
    </div>
  );
};
