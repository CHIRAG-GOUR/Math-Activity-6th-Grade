// ============================================================
// RATIO RUSH — TEAM STUDIO CONTROL CONSOLE (LIGHT THEME)
// Clean, high-contrast duel & solo console without overflow scrollbars:
// - Movie production scenario & math ratio challenge
// - Multiple choice quick buttons & numeric keypad input
// - Live production feedback & stage progression
// ============================================================

import React from 'react';
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
} from 'lucide-react';

export const TeamStudioConsole: React.FC<{ team: StudioTeam }> = ({ team }) => {
  const isBlue = team === 'blue';
  const teamState = useRatioStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const selectOption = useRatioStore((s) => s.selectOption);
  const submitAnswer = useRatioStore((s) => s.submitAnswer);
  const nextQuestion = useRatioStore((s) => s.nextQuestion);

  const currentQ = RATIO_QUESTIONS[teamState.currentQuestionIndex];
  if (!currentQ) return null;

  return (
    <div
      className={`w-full h-full flex flex-col justify-between p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 transition-all select-none ${
        isBlue
          ? 'border-sky-400 text-slate-800 shadow-sky-500/10'
          : 'border-red-400 text-slate-800 shadow-red-500/10'
      }`}
    >
      {/* ── 1. Team Header & Production Score ── */}
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

        {/* Score & Streak */}
        <div className="flex items-center gap-2">
          {teamState.streak > 1 && (
            <span className="px-1.5 py-0.5 rounded-md bg-amber-100 border border-amber-400 text-amber-900 text-[10px] font-black flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-600 fill-amber-600" />
              {teamState.streak}X
            </span>
          )}
          <div className="text-right leading-none">
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

      {/* ── 3. Scenario & Math Question Prompt ── */}
      <div
        className={`flex-1 flex flex-col justify-center gap-1.5 my-1 p-2.5 rounded-xl border text-xs ${
          isBlue ? 'bg-sky-50/80 border-sky-200' : 'bg-red-50/80 border-red-200'
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
