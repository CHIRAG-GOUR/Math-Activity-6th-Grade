'use client';

// ============================================================
// PARK PLANNER — Team Control Console
// Light, solid, compact, touch-friendly UI for simultaneous dual-team play
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

  return (
    <div
      className={`w-full max-w-[340px] flex flex-col bg-white rounded-2xl shadow-xl border-2 transition-all duration-200 overflow-hidden ${
        isBlue
          ? 'border-blue-300 shadow-blue-100/50'
          : 'border-rose-300 shadow-rose-100/50'
      }`}
      onClick={() => setTeamPreview(teamId)}
    >
      {/* Console Header Banner with Rough Work Tab */}
      <div
        className={`px-3 py-2 flex items-center justify-between text-white ${
          isBlue
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600'
            : 'bg-gradient-to-r from-rose-600 to-red-600'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
          <span className="font-extrabold text-xs tracking-wide uppercase">
            {team.teamName}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="text-[10px] bg-black/20 font-bold px-2 py-0.5 rounded-full">
            R{team.currentRound}/{totalRounds}
          </div>
          <DigitalScratchpad
            teamId={teamId}
            teamName={isBlue ? 'BLUE' : 'RED'}
            position={isBlue ? 'left' : 'right'}
          />
        </div>
      </div>

      {/* Main Console Body */}
      <div className="p-3.5 flex flex-col gap-3 overflow-y-auto max-h-[calc(100vh-220px)]">
        {/* Task Objective Card */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
            {q.category.toUpperCase().replace('_', ' ')} • MISSION
          </div>
          <div className="font-extrabold text-slate-800 text-sm leading-snug">
            {q.prompt}
          </div>
          <div className="text-xs text-slate-600 mt-1 italic">
            "{q.scenario}"
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
              const isSelected = team.selectedAnswer === optStr || (team.selectedPoint && formatCoord(team.selectedPoint) === optStr);

              return (
                <button
                  key={`opt_${idx}`}
                  type="button"
                  disabled={team.hasAnsweredCurrent}
                  onClick={() => selectOptionAnswer(teamId, opt)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                    isSelected
                      ? isBlue
                        ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                        : 'bg-rose-600 text-white border-rose-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {optStr}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Area */}
        {team.hasAnsweredCurrent && (
          <div
            className={`p-3 rounded-xl border text-xs leading-relaxed font-semibold animate-fadeIn ${
              team.isCurrentCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}
          >
            <div className="font-extrabold flex items-center gap-1.5 mb-1">
              <span>{team.isCurrentCorrect ? '✅ SUCCESS' : '⚠️ CORRECTION'}</span>
            </div>
            <div>{team.feedbackMessage}</div>
            
            {/* Step Explanation */}
            {q.stepExplanation && (
              <div className="mt-2 text-[11px] text-slate-600 border-t border-slate-200 pt-1.5 space-y-0.5">
                {q.stepExplanation.map((step, sIdx) => (
                  <div key={`step_${sIdx}`}>• {step}</div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        {!team.hasAnsweredCurrent ? (
          <button
            type="button"
            disabled={!team.selectedPoint && !team.selectedAnswer && team.selectedPoints.length === 0}
            onClick={() => submitAnswer(teamId)}
            className={`w-full py-2.5 px-4 font-black text-sm rounded-xl text-white shadow-md transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              isBlue
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700'
            }`}
          >
            {q.mode === 'point_plot' ? '🏗️ CONSTRUCT AT POINT' : '📐 EXECUTE TRANSFORMATION'}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => advanceRound(teamId)}
            className="w-full py-2.5 px-4 font-black text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{team.currentRound >= totalRounds ? '🏆 COMPLETE PARK' : 'NEXT MISSION ➔'}</span>
          </button>
        )}

        {/* Park Status Footer */}
        <div className="flex items-center justify-between bg-slate-100 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-600">
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
