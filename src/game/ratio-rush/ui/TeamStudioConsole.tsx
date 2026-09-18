// ============================================================
// RATIO RUSH — TEAM STUDIO CONTROL CONSOLE (LIGHT THEME + ROUGH WORK)
// Clean, high-contrast duel console with integrated drawing scratchpad:
// - Movie production scenario & math ratio challenge
// - Interactive Drawing Scratchpad / Rough Work canvas for calculations
// - Multiple choice quick buttons & numeric keypad input
// - Live production feedback & stage progression
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
  { name: 'Navy', hex: '#0f172a' },
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
    ctx.lineWidth = padMode === 'eraser' ? 16 : 3;
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

  // Sync DPI resolution on open
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
      className={`w-full h-full flex flex-col justify-between p-3 rounded-2xl bg-white/98 backdrop-blur-md shadow-2xl border-2 transition-all select-none ${
        isBlue
          ? 'border-sky-300 text-slate-800 shadow-sky-500/10'
          : 'border-red-300 text-slate-800 shadow-red-500/10'
      }`}
    >
      {/* ── 1. Team Header, Score & Rough Work Toggle ── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-md ${
              isBlue ? 'bg-sky-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {isBlue ? 'B' : 'R'}
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider leading-none text-slate-950 font-bank">
              {isBlue ? 'Blue Studio Crew' : 'Red Studio Crew'}
            </h2>
            <div className="text-[10px] text-slate-500 font-bold mt-0.5">
              Stage {currentQ.stage} of 5 • {currentQ.title.split(':')[1] || currentQ.title}
            </div>
          </div>
        </div>

        {/* Right Tools: Rough Work Button & Score */}
        <div className="flex items-center gap-1.5">
          {/* Rough Work Canvas Toggle */}
          <button
            type="button"
            onClick={() => setShowScratchpad(!showScratchpad)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-xs ${
              showScratchpad
                ? 'bg-amber-500 text-slate-950 border border-amber-600 font-extrabold scale-105'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
            }`}
            title="Toggle Rough Work Drawing Area"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700 stroke-[2.5]" />
            <span>ROUGH</span>
          </button>

          {teamState.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black flex items-center gap-0.5">
              <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
              {teamState.streak}X
            </span>
          )}

          <div className="text-right leading-none pl-1">
            <div className="text-sm font-black font-mono text-amber-600">
              {teamState.score}
            </div>
            <div className="text-[9px] text-slate-400 uppercase font-bold">PTS</div>
          </div>
        </div>
      </div>

      {/* ── 2. Production Stage Progress Indicator ── */}
      <div className="flex items-center gap-1 my-1.5">
        {RATIO_QUESTIONS.map((q, idx) => {
          const isSolved = teamState.solvedStages.includes(q.stage);
          const isCurrent = idx === teamState.currentQuestionIndex;
          return (
            <div
              key={`stage-bar-${idx}`}
              className={`flex-1 h-2 rounded-full transition-all ${
                isSolved
                  ? isBlue
                    ? 'bg-sky-500 shadow-xs'
                    : 'bg-red-500 shadow-xs'
                  : isCurrent
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-slate-200'
              }`}
              title={`Stage ${q.stage}: ${q.title}`}
            />
          );
        })}
      </div>

      {/* ── 3. INTERACTIVE ROUGH WORK DRAWING AREA (When Opened) ── */}
      {showScratchpad ? (
        <div className="flex-1 flex flex-col gap-1.5 my-1 p-2 rounded-xl bg-slate-50 border-2 border-amber-400 shadow-inner">
          {/* Scratchpad Toolbar */}
          <div className="flex items-center justify-between gap-1 pb-1 border-b border-slate-200 text-xs">
            {/* Pen / Eraser Mode */}
            <div className="flex items-center gap-0.5 bg-white p-0.5 rounded-lg border border-slate-300 shadow-2xs">
              <button
                type="button"
                onClick={() => setPadMode('pen')}
                className={`p-1 rounded-md transition cursor-pointer ${
                  padMode === 'pen'
                    ? isBlue
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-red-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Pen Tool"
              >
                <PenTool className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPadMode('eraser')}
                className={`p-1 rounded-md transition cursor-pointer ${
                  padMode === 'eraser'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Eraser Tool"
              >
                <Eraser className="w-3.5 h-3.5" />
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
                  className={`w-3.5 h-3.5 rounded-full border border-slate-300 transition-all cursor-pointer ${
                    penColor === c.hex && padMode === 'pen'
                      ? 'ring-2 ring-amber-500 scale-125'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>

            {/* Background Pattern Toggle */}
            <button
              type="button"
              onClick={() =>
                setBgPattern((prev) =>
                  prev === 'grid' ? 'ruled' : prev === 'ruled' ? 'blank' : 'grid'
                )
              }
              className="p-1 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 transition cursor-pointer"
              title={`Pattern: ${bgPattern.toUpperCase()}`}
            >
              {bgPattern === 'grid' ? (
                <Grid className="w-3.5 h-3.5 text-sky-600" />
              ) : bgPattern === 'ruled' ? (
                <FileText className="w-3.5 h-3.5 text-amber-600" />
              ) : (
                <span className="text-[9px] font-bold">PLN</span>
              )}
            </button>

            {/* Clear Canvas */}
            <button
              type="button"
              onClick={clearCanvas}
              className="p-1 rounded-lg bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 transition active:scale-95 cursor-pointer"
              title="Clear Rough Work"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            {/* Close / Minimize */}
            <button
              type="button"
              onClick={() => setShowScratchpad(false)}
              className="p-1 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition cursor-pointer"
              title="Close Rough Work"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* HTML5 Canvas Drawing Area */}
          <div
            className={`relative w-full h-32 rounded-lg border border-slate-300 overflow-hidden cursor-crosshair touch-none ${
              bgPattern === 'grid'
                ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:12px_12px] bg-white'
                : bgPattern === 'ruled'
                ? 'bg-[linear-gradient(transparent_19px,#e2e8f0_20px)] bg-[size:100%_20px] bg-white'
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
        /* ── 3. Standard Scenario & Math Question Prompt ── */
        <div
          className={`flex-1 flex flex-col justify-center gap-1.5 my-1 p-2.5 rounded-xl border text-xs ${
            isBlue ? 'bg-sky-50/90 border-sky-200' : 'bg-red-50/90 border-red-200'
          }`}
        >
          <div className="flex items-center gap-1 text-[10.5px] font-black uppercase text-amber-700">
            <Film className="w-3 h-3 text-amber-600" />
            <span>{currentQ.scenario}</span>
          </div>
          <p className="text-slate-900 font-bold leading-relaxed text-[11.5px]">
            {currentQ.mathPrompt}
          </p>
        </div>
      )}

      {/* ── 4. Multiple Choice Options ── */}
      <div className="grid grid-cols-2 gap-1.5 my-1">
        {currentQ.options.map((opt) => {
          const isSelected = teamState.selectedOption === opt || teamState.inputAnswer === opt.toString();
          return (
            <button
              key={`opt-${opt}`}
              onClick={() => selectOption(team, opt)}
              disabled={teamState.feedbackStatus === 'correct'}
              className={`p-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-between border ${
                isSelected
                  ? isBlue
                    ? 'bg-sky-500 text-white border-sky-600 shadow-md font-extrabold'
                    : 'bg-red-500 text-white border-red-600 shadow-md font-extrabold'
                  : 'bg-slate-50 hover:bg-white text-slate-800 border-slate-300 hover:border-slate-400'
              }`}
            >
              <span>{opt}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {currentQ.correctUnit}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 5. Feedback Message & Action Buttons ── */}
      <div className="flex flex-col gap-1 mt-1">
        {teamState.feedbackStatus === 'correct' && (
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-400 text-emerald-900 text-[11px] font-black flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="leading-tight">{teamState.feedbackMessage}</span>
            </div>
            {teamState.currentQuestionIndex < RATIO_QUESTIONS.length - 1 && (
              <button
                onClick={() => nextQuestion(team)}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center gap-1 shadow-md hover:bg-emerald-500 transition-all cursor-pointer whitespace-nowrap ml-2"
              >
                NEXT <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>
        )}

        {teamState.feedbackStatus === 'incorrect' && (
          <div className="p-2 rounded-xl bg-red-50 border border-red-300 text-red-900 text-[10px] font-bold flex items-center gap-1.5 animate-shake">
            <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="leading-tight">{teamState.feedbackMessage}</span>
          </div>
        )}

        {teamState.feedbackStatus !== 'correct' && (
          <button
            onClick={() => submitAnswer(team)}
            disabled={!teamState.inputAnswer}
            className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer ${
              teamState.inputAnswer
                ? isBlue
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold hover:from-sky-600 hover:to-blue-700'
                  : 'bg-gradient-to-r from-red-500 to-rose-600 text-white font-extrabold hover:from-red-600 hover:to-rose-700'
                : 'bg-slate-100 text-slate-400 border border-slate-300 cursor-not-allowed'
            }`}
          >
            <Clapperboard className="w-4 h-4" />
            <span>SUBMIT RATIO ({teamState.inputAnswer || '—'} {currentQ.correctUnit})</span>
          </button>
        )}
      </div>
    </div>
  );
};
