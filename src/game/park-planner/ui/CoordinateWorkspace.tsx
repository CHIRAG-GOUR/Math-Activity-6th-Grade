// ============================================================
// PARK PLANNER — Interactive Coordinate Mini-Grid Workspace
// Compact, touch-friendly 2D Cartesian grid for Grade 6 math
// ============================================================

import React from 'react';
import { Coordinate2D, QuadrantId } from '../types';
import { formatCoord, getQuadrant } from '../engine/coordinateMath';

interface CoordinateWorkspaceProps {
  selectedPoint: Coordinate2D | null;
  selectedPoints?: Coordinate2D[];
  targetQuadrant?: QuadrantId;
  onSelectPoint: (coord: Coordinate2D) => void;
  isMultiPointMode?: boolean;
}

export const CoordinateWorkspace: React.FC<CoordinateWorkspaceProps> = ({
  selectedPoint,
  selectedPoints = [],
  onSelectPoint,
  isMultiPointMode = false,
}) => {
  const range = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
  const activeQuad = selectedPoint ? getQuadrant(selectedPoint) : null;

  return (
    <div className="flex flex-col items-center bg-slate-50/90 p-1.5 rounded-xl border border-slate-200 w-full">
      {/* Mini Grid Header */}
      <div className="flex justify-between items-center w-full mb-1 text-[10px] font-bold text-slate-600 px-0.5">
        <span>Cartesian Grid</span>
        <span className="font-mono bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold shadow-sm">
          {selectedPoint ? `${formatCoord(selectedPoint)} • ${activeQuad}` : 'Tap a point'}
        </span>
      </div>

      {/* Ultra-Compact SVG Grid (115px) */}
      <div className="relative w-[115px] h-[115px] bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden select-none">
        <svg viewBox="-5.6 -5.6 11.2 11.2" className="w-full h-full">
          {/* Subtle Quadrant Color Tinting */}
          <rect x="0" y="-5" width="5" height="5" fill="#ecfdf5" opacity={0.7} />
          <rect x="-5" y="-5" width="5" height="5" fill="#f0fdfa" opacity={0.7} />
          <rect x="-5" y="0" width="5" height="5" fill="#eff6ff" opacity={0.7} />
          <rect x="0" y="0" width="5" height="5" fill="#fffbeb" opacity={0.7} />

          {/* Quadrant Watermark Labels */}
          <text x="2.5" y="-2.5" fontSize="1.4" fontWeight="900" fill="#10b981" opacity={0.3} textAnchor="middle" dominantBaseline="central">QI</text>
          <text x="-2.5" y="-2.5" fontSize="1.4" fontWeight="900" fill="#0d9488" opacity={0.3} textAnchor="middle" dominantBaseline="central">QII</text>
          <text x="-2.5" y="2.5" fontSize="1.4" fontWeight="900" fill="#3b82f6" opacity={0.3} textAnchor="middle" dominantBaseline="central">QIII</text>
          <text x="2.5" y="2.5" fontSize="1.4" fontWeight="900" fill="#f59e0b" opacity={0.3} textAnchor="middle" dominantBaseline="central">QIV</text>

          {/* Grid Lines */}
          {range.map((n) => (
            <React.Fragment key={`grid_lines_${n}`}>
              {/* Vertical line (X = n) */}
              <line
                x1={n}
                y1={-5}
                x2={n}
                y2={5}
                stroke={n === 0 ? '#0f172a' : '#cbd5e1'}
                strokeWidth={n === 0 ? 0.22 : 0.05}
              />
              {/* Horizontal line (Y = n) */}
              <line
                x1={-5}
                y1={n}
                x2={5}
                y2={n}
                stroke={n === 0 ? '#0f172a' : '#cbd5e1'}
                strokeWidth={n === 0 ? 0.22 : 0.05}
              />
            </React.Fragment>
          ))}

          {/* Interactive Clickable Nodes */}
          {range.map((y) =>
            range.map((x) => {
              const svgY = -y;
              const isSelected = selectedPoint && selectedPoint.x === x && selectedPoint.y === y;
              const isPoly = selectedPoints.some((p) => p.x === x && p.y === y);
              const isOrigin = x === 0 && y === 0;

              return (
                <g key={`pt_group_${x}_${y}`} className="cursor-pointer" onClick={() => onSelectPoint({ x, y })}>
                  {/* Invisible Hitbox for easy touch/mouse targeting */}
                  <circle cx={x} cy={svgY} r={0.65} fill="transparent" />
                  {/* Visible Node Circle */}
                  <circle
                    cx={x}
                    cy={svgY}
                    r={isSelected || isPoly ? 0.52 : isOrigin ? 0.38 : 0.22}
                    className="transition-all duration-100"
                    fill={
                      isSelected || isPoly
                        ? '#2563eb'
                        : isOrigin
                        ? '#d97706'
                        : x === 0 || y === 0
                        ? '#475569'
                        : '#94a3b8'
                    }
                    stroke={isSelected || isPoly ? '#ffffff' : 'none'}
                    strokeWidth={0.12}
                  />
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Compact Inline Stepper Controls */}
      <div className="flex items-center gap-1.5 mt-1 w-full justify-center text-[10px]">
        {/* X Stepper */}
        <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
          <span className="font-bold text-slate-500 text-[9px]">X:</span>
          <button
            type="button"
            className="w-3.5 h-3.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-black text-slate-700 active:scale-95 cursor-pointer"
            onClick={() => onSelectPoint({ x: Math.max(-5, (selectedPoint?.x ?? 0) - 1), y: selectedPoint?.y ?? 0 })}
          >
            -
          </button>
          <span className="font-mono font-black text-slate-800 w-3.5 text-center text-[10px]">
            {selectedPoint ? selectedPoint.x : 0}
          </span>
          <button
            type="button"
            className="w-3.5 h-3.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-black text-slate-700 active:scale-95 cursor-pointer"
            onClick={() => onSelectPoint({ x: Math.min(5, (selectedPoint?.x ?? 0) + 1), y: selectedPoint?.y ?? 0 })}
          >
            +
          </button>
        </div>

        {/* Y Stepper */}
        <div className="flex items-center gap-0.5 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
          <span className="font-bold text-slate-500 text-[9px]">Y:</span>
          <button
            type="button"
            className="w-3.5 h-3.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-black text-slate-700 active:scale-95 cursor-pointer"
            onClick={() => onSelectPoint({ x: selectedPoint?.x ?? 0, y: Math.max(-5, (selectedPoint?.y ?? 0) - 1) })}
          >
            -
          </button>
          <span className="font-mono font-black text-slate-800 w-3.5 text-center text-[10px]">
            {selectedPoint ? selectedPoint.y : 0}
          </span>
          <button
            type="button"
            className="w-3.5 h-3.5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-black text-slate-700 active:scale-95 cursor-pointer"
            onClick={() => onSelectPoint({ x: selectedPoint?.x ?? 0, y: Math.min(5, (selectedPoint?.y ?? 0) + 1) })}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
