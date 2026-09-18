'use client';

// ============================================================
// PARK PLANNER — Team Control Console
// 60s Countdown Timer, 2 Tries per question, single-click options,
// and touch-friendly Grade 6 interactive workspace.
// ============================================================

import React from 'react';
import { TeamId } from '../types';
import { useParkStore } from '../store/parkStore';
import { CoordinateWorkspace } from './CoordinateWorkspace';
import { formatCoord } from '../engine/coordinateMath';
import { DigitalScratchpad } from '@/components/shared/DigitalScratchpad';

interface TeamParkConsoleProps {
  teamId: TeamId;
}

export const TeamParkConsole: React.FC<TeamParkConsoleProps> = ({ teamId }) => {
  const isBlue = teamId === 'blue';
  const team = useParkStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const totalRounds = useParkStore((s) => s.matchQuestionCount);
  const selectPoint = useParkStore((s) => s.selectPoint);
  const togglePolygonPoint = useParkStore((s) => s.togglePolygonPoint);
  const selectOptionAnswer = useParkStore((s) => s.selectOptionAnswer);
  const submitAnswer = useParkStore((s) => s.submitAnswer);
  const advanceRound = useParkStore((s) => s.advanceRound);
  const setTeamPreview = useParkStore((s) => s.setTeamPreview);

  const q = team.currentQuestion;

  if (!q) return null;

  const isMultiPoint = q.mode === 'polygon' || q.mode === 'path';
  const secondsLeft = Math.max(0, Math.ceil(team.timeLeft));
  const isTimerCritical = secondsLeft <= 10;
  const isTimerWarning = secondsLeft <= 30 && secondsLeft > 10;

  return (
    <div
      className={`w-full max-w-[360px] sm:max-w-[380px] flex flex-col bg-white rounded-2xl shadow-2xl border-2 transition-all duration-200 overflow-hidden select-none ${
        isBlue
          ? 'border-blue-300 shadow-blue-200/50'
          : 'border-rose-300 shadow-rose-200/50'
      }`}
      onClick={() => setTeamPreview(teamId)}
    >
      {/* Console Header Banner with Round, Timer & Scratchpad */}
      <div
        className={`px-3.5 py-2 flex items-center justify-between text-white ${
          isBlue
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
            : 'bg-gradient-to-r from-rose-600 to-red-600'
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="font-extrabold text-sm tracking-wide uppercase">
            {team.teamName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs bg-black/30 font-extrabold px-2.5 py-0.5 rounded-full">
            R{team.currentRound}/{totalRounds}
          </div>
          <DigitalScratchpad
            teamId={teamId}
            teamName={isBlue ? 'BLUE' : 'RED'}
            position={isBlue ? 'left' : 'right'}
          />
        </div>
      </div>

      {/* 60s Countdown Timer Bar */}
      <div className="w-full bg-slate-200 h-1.5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isTimerCritical
              ? 'bg-rose-500 animate-pulse'
              : isTimerWarning
              ? 'bg-amber-500'
              : 'bg-emerald-500'
          }`}
          style={{ width: `${(secondsLeft / 60) * 100}%` }}
        />
      </div>

      {/* Main Console Body — Fits completely without scrollbars */}
      <div className="p-3 flex flex-col gap-2 overflow-hidden">
        {/* Status Pills: Timer & 2-Attempts Counter */}
        <div className="flex items-center justify-between text-xs font-bold">
          {/* Timer Countdown Badge */}
          <div
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-colors ${
              team.isTimeExpired
                ? 'bg-rose-100 text-rose-800 border-rose-300'
                : isTimerCritical
                ? 'bg-rose-100 text-rose-700 border-rose-400 animate-pulse font-black'
                : isTimerWarning
                ? 'bg-amber-100 text-amber-800 border-amber-300 font-extrabold'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-extrabold'
            }`}
          >
            <span>⏱️</span>
            <span>{team.isTimeExpired ? '0s (Expired)' : `${secondsLeft}s Left`}</span>
          </div>

          {/* Attempts Remaining Badge */}
          <div
            className={`px-2.5 py-1 rounded-lg border font-extrabold text-xs ${
              team.attemptsRemaining === 2
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : team.attemptsRemaining === 1
                ? 'bg-amber-100 text-amber-800 border-amber-300 font-black animate-bounce'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <span>🎯 {team.attemptsRemaining}/2 Tries</span>
          </div>
        </div>

        {/* Task Objective Card */}
        <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
            <span>{q.targetQuadrant ? `QUADRANT: ${q.targetQuadrant}` : q.category.toUpperCase()}</span>
            <span className="text-emerald-700 font-black truncate max-w-[160px]">{q.objectName}</span>
          </div>
          <div className="font-extrabold text-slate-800 text-xs md:text-[13px] leading-snug">
            {q.prompt}
          </div>
        </div>

        {/* 2D Interactive Coordinate Mini-Grid */}
        <CoordinateWorkspace
          selectedPoint={team.selectedPoint}
          selectedPoints={team.selectedPoints}
          targetQuadrant={q.targetQuadrant}
          isMultiPointMode={isMultiPoint}
          onSelectPoint={(coord) => {
            if (isMultiPoint) {
              togglePolygonPoint(teamId, coord);
            } else {
              selectPoint(teamId, coord);
            }
          }}
        />

        {/* Multiple Choice Quick Options */}
        {q.options && q.options.length > 0 && (
          <div className="grid grid-cols-2 gap-1.5">
            {q.options.map((opt, idx) => {
              const optStr = typeof opt === 'object' ? formatCoord(opt) : String(opt);
              const isSelected =
                team.selectedAnswer === optStr ||
                (team.selectedPoint && formatCoord(team.selectedPoint) === optStr);

              return (
                <button
                  key={`opt_${idx}`}
                  type="button"
                  disabled={team.hasAnsweredCurrent || team.isTimeExpired}
                  onClick={() => selectOptionAnswer(teamId, opt)}
                  className={`py-2 px-2.5 text-xs md:text-sm font-black rounded-xl border text-center transition-all ${
                    isSelected
                      ? isBlue
                        ? 'bg-blue-600 text-white border-blue-700 shadow ring-2 ring-blue-300 scale-[1.02]'
                        : 'bg-rose-600 text-white border-rose-700 shadow ring-2 ring-rose-300 scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400 active:scale-98'
                  }`}
                >
                  {optStr}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Area (After Submission or on 1st incorrect attempt) */}
        {team.feedbackMessage && (
          <div
            className={`px-2.5 py-1.5 rounded-xl border text-xs leading-snug font-semibold animate-fadeIn ${
              team.isCurrentCorrect === true
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : team.attemptsRemaining === 1 && !team.hasAnsweredCurrent
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5 mb-0.5">
              <span>
                {team.isCurrentCorrect === true
                  ? '✅ SUCCESS'
                  : team.attemptsRemaining === 1 && !team.hasAnsweredCurrent
                  ? '⚠️ TRY AGAIN (1 CHANCE LEFT)'
                  : '❌ ROUND FINISHED'}
              </span>
            </div>
            <div>{team.feedbackMessage}</div>
          </div>
        )}

        {/* Action Button */}
        {!team.hasAnsweredCurrent && !team.isTimeExpired ? (
          <button
            type="button"
            disabled={!team.selectedPoint && !team.selectedAnswer && team.selectedPoints.length === 0}
            onClick={() => submitAnswer(teamId)}
            className={`w-full py-2.5 px-4 font-black text-xs md:text-sm rounded-xl text-white shadow-md transition-transform active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
              team.attemptsRemaining === 1
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 animate-pulse'
                : isBlue
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'
            }`}
          >
            {team.attemptsRemaining === 1
              ? '🔄 RETRY (TRY 2/2)'
              : q.mode === 'point_plot'
              ? '🏗️ CONSTRUCT AT POINT'
              : '📐 SUBMIT ANSWER'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => advanceRound(teamId)}
            className="w-full py-2.5 px-4 font-black text-xs md:text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-transform active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>{team.currentRound >= totalRounds ? '🏆 COMPLETE PARK' : 'NEXT MISSION ➔'}</span>
          </button>
        )}

        {/* Park Status Footer */}
        <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600">
          <div>
            Happiness: <span className="text-emerald-600">{team.citizenHappiness}%</span>
          </div>
          <div>
            Rating: <span className="text-amber-600">★ {team.parkRating}</span>
          </div>
          <div>
            Built: <span className="text-blue-600">{team.installedObjects.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
