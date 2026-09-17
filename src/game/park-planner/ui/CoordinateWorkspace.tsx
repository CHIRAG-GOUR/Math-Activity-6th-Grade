// ============================================================
// PARK PLANNER — Interactive Coordinate Mini-Grid Workspace
// Synchronized 2D Cartesian plane for planning & plotting points
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

  return (
    <div className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-inner">
      <div className="flex justify-between items-center w-full px-1 mb-1.5 text-xs text-slate-600 font-semibold">
        <span>Cartesian Planning Grid</span>
        <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
          {selectedPoint ? formatCoord(selectedPoint) : 'Tap a coordinate'}
        </span>
      </div>

      {/* Grid Canvas SVG / Interactive Map */}
      <div className="relative w-full aspect-square max-w-[240px] bg-white rounded-lg border border-slate-300 p-1 select-none">
        {/* Quadrant Labels */}
        <div className="absolute top-2 right-2 text-[9px] font-bold text-slate-400">QI (+,+)</div>
        <div className="absolute top-2 left-2 text-[9px] font-bold text-slate-400">QII (-,+)</div>
        <div className="absolute bottom-2 left-2 text-[9px] font-bold text-slate-400">QIII (-,-)</div>
        <div className="absolute bottom-2 right-2 text-[9px] font-bold text-slate-400">QIV (+,-)</div>

        <svg viewBox="-5.5 -5.5 11 11" className="w-full h-full">
          {/* Subtle Grid Lines */}
          {range.map((n) => (
            <React.Fragment key={`grid_lines_${n}`}>
              {/* Vertical line (X = n) */}
              <line
                x1={n}
                y1={-5}
                x2={n}
                y2={5}
                stroke={n === 0 ? '#1e293b' : '#e2e8f0'}
                strokeWidth={n === 0 ? 0.12 : 0.04}
              />
              {/* Horizontal line (Y = n) */}
              <line
                x1={-5}
                y1={n}
                x2={5}
                y2={n}
                stroke={n === 0 ? '#1e293b' : '#e2e8f0'}
                strokeWidth={n === 0 ? 0.12 : 0.04}
              />
            </React.Fragment>
          ))}

          {/* Interactive Clickable Nodes */}
          {range.map((y) =>
            range.map((x) => {
              // In SVG, positive Y is downwards, so Cartesian y maps to -y in SVG
              const svgY = -y;
              const isSelected = selectedPoint && selectedPoint.x === x && selectedPoint.y === y;
              const isPoly = selectedPoints.some((p) => p.x === x && p.y === y);

              return (
                <circle
                  key={`pt_${x}_${y}`}
                  cx={x}
                  cy={svgY}
                  r={isSelected || isPoly ? 0.42 : 0.22}
                  className="cursor-pointer transition-all duration-150 hover:scale-125"
                  fill={isSelected || isPoly ? '#2563eb' : x === 0 || y === 0 ? '#475569' : '#94a3b8'}
                  stroke={isSelected || isPoly ? '#ffffff' : 'none'}
                  strokeWidth={0.08}
                  onClick={() => onSelectPoint({ x, y })}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Quick Coordinate Stepper Controls */}
      <div className="flex items-center gap-2 mt-2 w-full justify-center">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
          <span className="font-bold text-slate-500">X:</span>
          <span className="font-mono font-bold text-slate-800 w-5 text-center">
            {selectedPoint ? selectedPoint.x : 0}
          </span>
          <button
            type="button"
            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
            onClick={() => onSelectPoint({ x: Math.max(-5, (selectedPoint?.x ?? 0) - 1), y: selectedPoint?.y ?? 0 })}
          >
            -
          </button>
          <button
            type="button"
            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
            onClick={() => onSelectPoint({ x: Math.min(5, (selectedPoint?.x ?? 0) + 1), y: selectedPoint?.y ?? 0 })}
          >
            +
          </button>
        </div>

        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-slate-200 text-xs">
          <span className="font-bold text-slate-500">Y:</span>
          <span className="font-mono font-bold text-slate-800 w-5 text-center">
            {selectedPoint ? selectedPoint.y : 0}
          </span>
          <button
            type="button"
            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
            onClick={() => onSelectPoint({ x: selectedPoint?.x ?? 0, y: Math.max(-5, (selectedPoint?.y ?? 0) - 1) })}
          >
            -
          </button>
          <button
            type="button"
            className="px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded font-bold"
            onClick={() => onSelectPoint({ x: selectedPoint?.x ?? 0, y: Math.min(5, (selectedPoint?.y ?? 0) + 1) })}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
