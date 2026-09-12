// ============================================================
// SKILLIZEE ARCADE — Interactive Digital Scratchpad / Rough Work Canvas
// Real-Time Touch, Stylus & Mouse Canvas for Intermediate Steps:
// - Freehand pen drawing with custom widths and vibrant neon colors
// - Precision eraser & quick canvas clear
// - Built-in Math Graph Grid / Ruled lines background
// - Ultra-responsive, lag-free 60fps HTML5 2D context
// - Collapsible floating drawer docked right to each team's console
// ============================================================

'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Eraser,
  Trash2,
  Minimize2,
  Maximize2,
  Grid,
  FileText,
  Edit3,
} from 'lucide-react';

interface Props {
  teamId: 'blue' | 'red';
  teamName?: string;
  position?: 'left' | 'right';
}

const COLORS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Yellow', hex: '#fde047' },
  { name: 'Cyan', hex: '#38bdf8' },
  { name: 'Coral', hex: '#f87171' },
  { name: 'Lime', hex: '#4ade80' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', width: 2 },
  { label: 'Med', width: 4 },
  { label: 'Thick', width: 8 },
];

export const DigitalScratchpad: React.FC<Props> = ({
  teamId,
  teamName,
  position = 'left',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState(COLORS[0].hex);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [bgPattern, setBgPattern] = useState<'grid' | 'ruled' | 'blank'>('grid');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  const isBlue = teamId === 'blue';
  const primaryAccent = isBlue ? '#3b82f6' : '#ef4444';

  // Handle Canvas Drawing with pointer events
  const startDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    lastPointRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = mode === 'eraser' ? strokeWidth * 4 : strokeWidth;
    ctx.strokeStyle = mode === 'eraser' ? '#0f172a' : color;
  }, [mode, strokeWidth, color]);

  const draw = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
    lastPointRef.current = { x, y };
  }, []);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Ensure canvas DPI resolution on resize/open
  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    }
  }, [isOpen]);

  return (
    <div className="relative inline-block pointer-events-auto select-none">
      {/* ── Toggle Scratchpad Tab Button ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-white font-black text-[11px] uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] hover:scale-105 active:scale-95 transition-all cursor-pointer ${
            isBlue ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
          }`}
          title="Open Scratchpad / Rough Work"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>ROUGH WORK</span>
        </button>
      )}

      {/* ── Collapsible Scratchpad Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className={`fixed bottom-4 z-50 w-72 sm:w-80 rounded-2xl bg-slate-900 border-3 border-black shadow-[8px_8px_0px_#000000] text-white flex flex-col overflow-hidden ${
              position === 'left' ? 'left-4' : 'right-4'
            }`}
          >
            {/* Top Window Header */}
            <div
              className="px-3 py-1.5 flex items-center justify-between border-b-2 border-black"
              style={{ backgroundColor: primaryAccent }}
            >
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide">
                <PenTool className="w-3.5 h-3.5" />
                <span>{teamName || (isBlue ? 'BLUE' : 'RED')} SCRATCHPAD</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-black/30 hover:bg-black/50 text-white transition active:scale-95 cursor-pointer"
                title="Minimize Scratchpad"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tool Toolbar */}
            <div className="p-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-1 text-xs">
              {/* Pen / Eraser Mode */}
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setMode('pen')}
                  className={`p-1.5 rounded-md transition ${
                    mode === 'pen'
                      ? 'bg-blue-600 text-white font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Pen Tool"
                >
                  <PenTool className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setMode('eraser')}
                  className={`p-1.5 rounded-md transition ${
                    mode === 'eraser'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Eraser Tool"
                >
                  <Eraser className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-1">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setColor(c.hex);
                      setMode('pen');
                    }}
                    style={{ backgroundColor: c.hex }}
                    className={`w-4 h-4 rounded-full border border-black transition-all ${
                      color === c.hex && mode === 'pen'
                        ? 'ring-2 ring-white scale-125'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={c.name}
                  />
                ))}
              </div>

              {/* Background Grid Toggle */}
              <button
                type="button"
                onClick={() =>
                  setBgPattern((prev) =>
                    prev === 'grid' ? 'ruled' : prev === 'ruled' ? 'blank' : 'grid'
                  )
                }
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
                title={`Pattern: ${bgPattern.toUpperCase()}`}
              >
                {bgPattern === 'grid' ? (
                  <Grid className="w-3.5 h-3.5 text-cyan-400" />
                ) : bgPattern === 'ruled' ? (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Maximize2 className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              {/* Clear Canvas */}
              <button
                type="button"
                onClick={clearCanvas}
                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white transition active:scale-95 cursor-pointer"
                title="Clear Everything"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Drawing Canvas Area */}
            <div
              className={`relative h-44 w-full cursor-crosshair overflow-hidden touch-none ${
                bgPattern === 'grid'
                  ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:14px_14px] bg-[#0f172a]'
                  : bgPattern === 'ruled'
                  ? 'bg-[linear-gradient(transparent_23px,#334155_24px)] bg-[size:100%_24px] bg-[#0f172a]'
                  : 'bg-[#0f172a]'
              }`}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-full block"
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerLeave={stopDrawing}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
