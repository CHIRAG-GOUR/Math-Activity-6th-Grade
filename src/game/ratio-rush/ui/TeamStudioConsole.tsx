// ============================================================
// RATIO RUSH — TEAM STUDIO CONTROL CONSOLE (NEO-BRUTALISM LIGHT THEME)
// High-contrast, bold, punchy Neo-brutalist UI:
// - Crisp Solid White Background (No Glassmorphism)
// - Bold Solid 4px Black Borders & Solid Offset Drop Shadows [6px_6px_0px_#000000]
// - Vibrant Yellow & Black Accents
// - Larger, high-legibility fonts & buttons for 6th graders
// - Integrated Rough Work Drawing Scratchpad with Grid/Ruled backgrounds
// ============================================================

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { StudioTeam } from '../types';
import { useRatioStore } from '../store/ratioStore';
import { RATIO_QUESTIONS } from '../data/questions';
import {
  Clapperboard,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Film,
  Zap,
  PenTool,
  Eraser,
  Trash2,
  Grid,
  FileText,
  Minimize2,
  Edit3,
} from 'lucide-react';

const PEN_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'Blue', hex: '#2563eb' },
  { name: 'Red', hex: '#dc2626' },
  { name: 'Green', hex: '#16a34a' },
  { name: 'Amber', hex: '#d97706' },
];

export const TeamStudioConsole: React.FC<{ team: StudioTeam }> = ({ team }) => {
  const isBlue = team === 'blue';
  const teamState = useRatioStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const selectOption = useRatioStore((s) => s.selectOption);
  const submitAnswer = useRatioStore((s) => s.submitAnswer);
  const nextQuestion = useRatioStore((s) => s.nextQuestion);

  // Scratchpad / Rough Work State
  const [showScratchpad, setShowScratchpad] = useState(false);
  const [padMode, setPadMode] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState(isBlue ? '#2563eb' : '#dc2626');
  const [bgPattern, setBgPattern] = useState<'grid' | 'ruled' | 'blank'>('grid');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);

  const currentQ = RATIO_QUESTIONS[teamState.currentQuestionIndex];

  // Canvas Drawing Handlers
  const startDrawing = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = padMode === 'eraser' ? 18 : 3.5;
    ctx.strokeStyle = padMode === 'eraser' ? '#ffffff' : penColor;
  }, [padMode, penColor]);

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
  }, []);

  const stopDrawing = useCallback(() => {
    isDrawingRef.current = false;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    if (showScratchpad && canvasRef.current) {
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
  }, [showScratchpad]);

  if (!currentQ) return null;

  return (
    <div
      className={`w-full flex flex-col justify-between p-4 rounded-2xl bg-white border-4 border-black shadow-[8px_8px_0px_#000000] text-black transition-all select-none`}
    >
      {/* ── 1. Team Header, Score & Rough Work Button ── */}
      <div className="flex items-center justify-between border-b-3 border-black pb-2.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm border-2 border-black shadow-[2px_2px_0px_#000000] ${
              isBlue ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isBlue ? 'B' : 'R'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wide border-2 border-black shadow-[2px_2px_0px_#000000] ${
                  isBlue ? 'bg-blue-400 text-black' : 'bg-red-400 text-black'
                }`}
              >
                {isBlue ? 'BLUE STUDIO' : 'RED STUDIO'}
              </span>
            </div>
            <div className="text-[11px] text-black font-black mt-1">
              Stage {currentQ.stage} of 5 • {currentQ.title.split(':')[1] || currentQ.title}
            </div>
          </div>
        </div>

        {/* Right Tools: Score & Rough Work Toggle */}
        <div className="flex items-center gap-2">
          {/* Rough Work Canvas Toggle */}
          <button
            type="button"
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border-2 border-black transition-all cursor-pointer ${
              showScratchpad
                ? 'bg-yellow-400 text-black shadow-[3px_3px_0px_#000000] translate-x-0.5 translate-y-0.5'
                : 'bg-white hover:bg-yellow-200 text-black shadow-[3px_3px_0px_#000000]'
            }`}
            title="Open Rough Work Canvas"
          >
            <Edit3 className="w-4 h-4 stroke-[2.5]" />
            <span>ROUGH</span>
          </button>

          {/* Score Box */}
          <div className="px-2.5 py-1 rounded-lg bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_#000000] text-right leading-none">
            <div className="text-base font-black font-mono text-black">
              {teamState.score}
            </div>
            <div className="text-[9px] text-black font-black uppercase">PTS</div>
          </div>
        </div>
      </div>

      {/* ── 2. Production Stage Progress Indicator ── */}
      <div className="flex items-center gap-1.5 my-2.5">
        {RATIO_QUESTIONS.map((q, idx) => {
          const isSolved = teamState.solvedStages.includes(q.stage);
          const isCurrent = idx === teamState.currentQuestionIndex;
          return (
            <div
              key={`stage-bar-${idx}`}
              className={`flex-1 h-3 rounded-md border-2 border-black transition-all ${
                isSolved
                  ? isBlue
                    ? 'bg-blue-500 shadow-[1px_1px_0px_#000000]'
                    : 'bg-red-500 shadow-[1px_1px_0px_#000000]'
                  : isCurrent
                  ? 'bg-yellow-400 animate-pulse shadow-[2px_2px_0px_#000000]'
                  : 'bg-slate-100'
              }`}
              title={`Stage ${q.stage}: ${q.title}`}
            />
          );
        })}
      </div>

      {/* ── 3. INTERACTIVE ROUGH WORK DRAWING AREA (When Opened) ── */}
      {showScratchpad ? (
        <div className="flex-1 flex flex-col gap-2 my-1 p-2.5 rounded-xl bg-yellow-50 border-3 border-black shadow-[4px_4px_0px_#000000]">
          {/* Scratchpad Toolbar */}
          <div className="flex items-center justify-between gap-1 pb-1.5 border-b-2 border-black text-xs">
            {/* Pen / Eraser Mode */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <button
                type="button"
                onClick={() => setPadMode('pen')}
                className={`p-1 rounded-md border transition cursor-pointer ${
                  padMode === 'pen'
                    ? 'bg-yellow-400 text-black border-black font-black'
                    : 'bg-white border-transparent text-slate-600 hover:text-black'
                }`}
                title="Pen Tool"
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setPadMode('eraser')}
                className={`p-1 rounded-md border transition cursor-pointer ${
                  padMode === 'eraser'
                    ? 'bg-yellow-400 text-black border-black font-black'
                    : 'bg-white border-transparent text-slate-600 hover:text-black'
                }`}
                title="Eraser Tool"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-1">
              {PEN_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => {
                    setPenColor(c.hex);
                    setPadMode('pen');
                  }}
                  style={{ backgroundColor: c.hex }}
                  className={`w-4 h-4 rounded-full border-2 border-black transition-all cursor-pointer ${
                    penColor === c.hex && padMode === 'pen'
                      ? 'scale-125 ring-2 ring-yellow-400 shadow-[1px_1px_0px_#000000]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>

            {/* Grid Pattern Toggle */}
            <button
              type="button"
              onClick={() =>
                setBgPattern((prev) =>
                  prev === 'grid' ? 'ruled' : prev === 'ruled' ? 'blank' : 'grid'
                )
              }
              className="p-1.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_#000000] text-black hover:bg-yellow-200 transition cursor-pointer"
              title={`Pattern: ${bgPattern.toUpperCase()}`}
            >
              {bgPattern === 'grid' ? (
                <Grid className="w-4 h-4" />
              ) : bgPattern === 'ruled' ? (
                <FileText className="w-4 h-4" />
              ) : (
                <span className="text-[10px] font-black">PLN</span>
              )}
            </button>

            {/* Clear Button */}
            <button
              type="button"
              onClick={clearCanvas}
              className="p-1.5 rounded-lg bg-rose-400 border-2 border-black shadow-[2px_2px_0px_#000000] text-black hover:bg-rose-300 transition active:scale-95 cursor-pointer"
              title="Clear Rough Work"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={() => setShowScratchpad(false)}
              className="p-1.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_#000000] text-black hover:bg-yellow-200 transition cursor-pointer"
              title="Close Rough Work"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas Area */}
          <div
            className={`relative w-full h-36 rounded-xl border-2 border-black overflow-hidden cursor-crosshair touch-none ${
              bgPattern === 'grid'
                ? 'bg-[radial-gradient(#000000_1px,transparent_1px)] bg-[size:14px_14px] bg-white'
                : bgPattern === 'ruled'
                ? 'bg-[linear-gradient(transparent_21px,#000000_22px)] bg-[size:100%_22px] bg-white'
                : 'bg-white'
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
        </div>
      ) : (
        /* ── 3. Neo-Brutalist Math Question Card ── */
        <div className="flex-1 flex flex-col justify-center gap-2 my-1.5 p-3 rounded-xl bg-yellow-50 border-3 border-black shadow-[4px_4px_0px_#000000]">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded bg-yellow-400 border-2 border-black text-[10.5px] font-black uppercase tracking-wider text-black shadow-[2px_2px_0px_#000000] flex items-center gap-1">
              <Film className="w-3.5 h-3.5" />
              <span>RATIO CHALLENGE</span>
            </span>
          </div>
          <p className="text-black font-extrabold leading-snug text-sm">
            {currentQ.mathPrompt}
          </p>
        </div>
      )}

      {/* ── 4. Multiple Choice Option Buttons (Neo-Brutalism) ── */}
      <div className="grid grid-cols-2 gap-2 my-2">
        {currentQ.options.map((opt) => {
          const isSelected = teamState.selectedOption === opt || teamState.inputAnswer === opt.toString();
          return (
            <button
              key={`opt-${opt}`}
              onClick={() => selectOption(team, opt)}
              disabled={teamState.feedbackStatus === 'correct'}
              className={`p-3 rounded-xl text-sm font-black transition-all cursor-pointer flex items-center justify-between border-3 border-black ${
                isSelected
                  ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_#000000] ring-2 ring-black scale-102'
                  : 'bg-white hover:bg-yellow-100 text-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
              }`}
            >
              <span className="text-base font-black">{opt}</span>
              <span className="text-xs text-black font-bold uppercase">
                {currentQ.correctUnit}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 5. Feedback Message & Action Buttons ── */}
      <div className="flex flex-col gap-1.5 mt-1">
        {teamState.feedbackStatus === 'correct' && (
          <div className="p-2.5 rounded-xl bg-emerald-300 border-3 border-black text-black text-xs font-black flex items-center justify-between shadow-[4px_4px_0px_#000000] animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
              <span className="leading-tight">{teamState.feedbackMessage}</span>
            </div>
            {teamState.currentQuestionIndex < RATIO_QUESTIONS.length - 1 && (
              <button
                onClick={() => nextQuestion(team)}
                className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black font-black text-xs flex items-center gap-1 border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-yellow-300 active:shadow-none transition-all cursor-pointer whitespace-nowrap ml-2"
              >
                NEXT <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}
          </div>
        )}

        {teamState.feedbackStatus === 'incorrect' && (
          <div className="p-2 rounded-xl bg-rose-300 border-3 border-black text-black text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000000] animate-shake">
            <XCircle className="w-4 h-4 text-black shrink-0" />
            <span className="leading-tight">{teamState.feedbackMessage}</span>
          </div>
        )}

        {teamState.feedbackStatus !== 'correct' && (
          <button
            onClick={() => submitAnswer(team)}
            disabled={!teamState.inputAnswer}
            className={`w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all border-3 border-black ${
              teamState.inputAnswer
                ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer'
                : 'bg-slate-200 text-slate-500 border-2 border-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Clapperboard className="w-4 h-4 text-black" />
            <span>SUBMIT RATIO ({teamState.inputAnswer || '—'} {currentQ.correctUnit})</span>
          </button>
        )}
      </div>
    </div>
  );
};
