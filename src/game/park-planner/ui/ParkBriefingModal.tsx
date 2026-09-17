'use client';

// ============================================================
// PARK PLANNER — Grade 6 Math Briefing & Interactive Guide
// Clear explanations and visual cheat-sheets for Cartesian Plane & Transformations
// ============================================================

import React from 'react';

interface ParkBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ParkBriefingModal: React.FC<ParkBriefingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fadeIn">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌳</span>
            <div>
              <h2 className="font-extrabold text-base tracking-wide">
                Park Planner: Cartesian Geometry Guide
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Mastering Position, Translation, Reflection & Rotation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-slate-700 text-xs leading-relaxed">
          {/* Section 1: The 4 Quadrants */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <span>🧭</span>
              <span>1. The Cartesian Coordinate Plane & 4 Quadrants</span>
            </h3>
            <p className="mb-2.5 text-slate-600">
              The park is built around two perpendicular avenues: the horizontal <strong>X-axis</strong> and vertical <strong>Y-axis</strong> meeting at the <strong>Origin (0,0)</strong>.
            </p>
            <div className="grid grid-cols-2 gap-2 text-center font-bold">
              <div className="bg-emerald-50 border border-emerald-200 p-2 rounded-lg text-emerald-800">
                <div className="text-[10px] text-emerald-600 uppercase">Top-Left (x &lt; 0, y &gt; 0)</div>
                <div>Quadrant II: Botanical Gardens</div>
                <div className="text-[11px] font-mono mt-0.5 text-emerald-700">(-x, +y)</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-blue-800">
                <div className="text-[10px] text-blue-600 uppercase">Top-Right (x &gt; 0, y &gt; 0)</div>
                <div>Quadrant I: Active Playground</div>
                <div className="text-[11px] font-mono mt-0.5 text-blue-700">(+x, +y)</div>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 p-2 rounded-lg text-indigo-800">
                <div className="text-[10px] text-indigo-600 uppercase">Bottom-Left (x &lt; 0, y &lt; 0)</div>
                <div>Quadrant III: Sports Complex</div>
                <div className="text-[11px] font-mono mt-0.5 text-indigo-700">(-x, -y)</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-2 rounded-lg text-amber-800">
                <div className="text-[10px] text-amber-600 uppercase">Bottom-Right (x &gt; 0, y &lt; 0)</div>
                <div>Quadrant IV: Picnic Grove</div>
                <div className="text-[11px] font-mono mt-0.5 text-amber-700">(+x, -y)</div>
              </div>
            </div>
          </div>

          {/* Section 2: Transformations */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <h3 className="font-extrabold text-slate-900 text-sm mb-2 flex items-center gap-1.5">
              <span>📐</span>
              <span>2. Transformation Mathematical Rules</span>
            </h3>
            <div className="space-y-2">
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-slate-800">Translation (Sliding): </span>
                <span>Add or subtract units. Move East (x + a), West (x - a), North (y + b), South (y - b).</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-slate-800">Reflection across X-axis: </span>
                <span className="font-mono text-blue-600">(x, y) ➔ (x, -y)</span>
                <span className="text-slate-500 ml-1">(X stays the same, Y flips sign)</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-slate-800">Reflection across Y-axis: </span>
                <span className="font-mono text-blue-600">(x, y) ➔ (-x, y)</span>
                <span className="text-slate-500 ml-1">(X flips sign, Y stays the same)</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-slate-800">90° Clockwise Rotation around (0,0): </span>
                <span className="font-mono text-emerald-600">(x, y) ➔ (y, -x)</span>
              </div>
              <div className="p-2 bg-white rounded-lg border border-slate-200">
                <span className="font-black text-slate-800">180° Rotation around (0,0): </span>
                <span className="font-mono text-emerald-600">(x, y) ➔ (-x, -y)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition"
          >
            LET'S BUILD THE PARK!
          </button>
        </div>
      </div>
    </div>
  );
};
