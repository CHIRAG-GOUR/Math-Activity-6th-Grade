'use client';

// ============================================================
// THE SOLAR FORGE: Team Engineering Console UI
// Premium mission console docked in bottom corners:
// Blue in bottom-left, Red in bottom-right.
// Normal-sized readable typography, high visual focus on the question,
// large tactile touch answer buttons, physical consequence status,
// and unambiguous action triggers.
// ============================================================

import React from 'react';
import { TeamId, AngleClassification } from '../types';
import { useSolarForgeStore } from '../store/solarForgeStore';
import { ProtractorControl } from './ProtractorControl';
import { ConstructionTool } from './ConstructionTool';

export const SolarTeamConsole: React.FC<{ team: TeamId }> = ({ team }) => {
  const teamState = useSolarForgeStore((s) => s[team]);
  const selectClassification = useSolarForgeStore((s) => s.selectClassification);
  const setInstrumentAngle = useSolarForgeStore((s) => s.setInstrumentAngle);
  const setConstructionBisector = useSolarForgeStore((s) => s.setConstructionBisector);
  const completeConstruction = useSolarForgeStore((s) => s.completeConstruction);
  const submitAnswer = useSolarForgeStore((s) => s.submitAnswer);

  const isBlue = team === 'blue';
  const q = teamState.currentQuestion;

  if (!q) return null;

  const headerBg = isBlue
    ? 'bg-gradient-to-r from-sky-700 via-sky-600 to-sky-700 text-white'
    : 'bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white';

  const borderColor = isBlue ? 'border-sky-300 shadow-sky-200/50' : 'border-red-300 shadow-red-200/50';
  const accentBorder = isBlue ? 'border-l-sky-500' : 'border-l-red-500';
  const accentText = isBlue ? 'text-sky-600' : 'text-red-600';
  const actionBtnBg = isBlue
    ? 'bg-sky-600 hover:bg-sky-500 active:bg-sky-700 shadow-sky-600/30'
    : 'bg-red-600 hover:bg-red-500 active:bg-red-700 shadow-red-600/30';

  const classificationOptions: { id: AngleClassification; label: string; range: string }[] = [
    { id: 'acute', label: 'ACUTE', range: '< 90°' },
    { id: 'right', label: 'RIGHT', range: '= 90°' },
    { id: 'obtuse', label: 'OBTUSE', range: '90°–180°' },
    { id: 'straight', label: 'STRAIGHT', range: '= 180°' },
    { id: 'reflex', label: 'REFLEX ANGLE', range: '> 180°' },
  ];

  // Clean mission title without redundant prefixes
  const cleanMissionTitle = q.title.replace(/^MISSION\s*\d+\s*:\s*/i, '').replace(/^ROUND\s*\d+\s*—\s*/i, '');
  const missionNumber = String(teamState.currentQuestionIndex + 1).padStart(2, '0');
  const totalMissions = String(teamState.questions.length).padStart(2, '0');

  const isPartyActive = useSolarForgeStore((s) => s.isPartyActive);
  const gamePhase = useSolarForgeStore((s) => s.gamePhase);

  if (isPartyActive || gamePhase === 'cinematic_activation' || gamePhase === 'victory') {
    return null;
  }

  const isRotating = teamState.isRotatingMirror;
  const isAligned = teamState.lastFeedback === 'beam_aligned' || teamState.lastFeedback === 'power_up';

  return (
    <div
      className={`fixed z-30 bottom-2.5 ${
        isBlue ? 'left-2.5' : 'right-2.5'
      } w-[310px] min-w-[310px] max-w-[310px] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 ${borderColor} flex flex-col overflow-hidden text-slate-800 transition-all select-none`}
    >
      {/* ── 1. CONSOLE HEADER & IDENTITY ── */}
      <div className={`px-3 py-2 ${headerBg} flex items-center justify-between shadow-xs text-white`}>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse shadow-xs" />
            <span className="font-black text-xs tracking-wider uppercase drop-shadow-xs">
              {teamState.teamName}
            </span>
          </div>
          <span className="text-[10px] font-bold opacity-90 tracking-wide mt-0.5">
            ROUND {q.round} · MISSION {missionNumber}/{totalMissions}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {q.timeOfDay && (
            <span className="text-[10px] font-extrabold bg-black/25 px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/15">
              ☀️ {q.timeOfDay}
            </span>
          )}
          <span className="text-[11px] font-black bg-white/20 px-2 py-0.5 rounded-md tabular-nums tracking-wide shadow-xs">
            {teamState.energyMegawatts} MW
          </span>
        </div>
      </div>

      {/* ── 2. MISSION CONTEXT & READABLE QUESTION ── */}
      <div className="p-3 flex flex-col gap-2">
        {/* Mission Identification Header */}
        <div className="flex flex-col gap-0.5 border-b border-slate-200/80 pb-1.5">
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-black uppercase tracking-widest ${accentText}`}>
              MISSION {missionNumber}
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
              {missionNumber} / {totalMissions}
            </span>
          </div>
          <h3 className="text-xs font-black text-slate-900 tracking-tight leading-snug line-clamp-1">
            {cleanMissionTitle}
          </h3>
          <p className="text-[11px] text-slate-600 font-semibold leading-tight line-clamp-2">
            {q.scenario}
          </p>
        </div>

        {/* ── QUESTION DISPLAY: HIGH VISUAL FOCUS ── */}
        <div className={`bg-slate-50 border-l-4 ${accentBorder} border-t border-r border-b border-slate-200 rounded-xl p-2.5 shadow-xs`}>
          <p className="text-[13px] font-bold text-slate-900 leading-snug tracking-tight">
            {q.prompt}
          </p>
        </div>

        {/* ── 3. TACTILE MATH CONTROLS ── */}
        {/* Mode 1: Angle Classification (Comfortable Touch Cards) */}
        {q.category === 'classify_angles' && (
          <div className="flex flex-col gap-1.5 pt-0.5">
            {/* 2-column grid for top 4 options */}
            <div className="grid grid-cols-2 gap-1.5">
              {classificationOptions.slice(0, 4).map((opt) => {
                const isSelected = teamState.selectedClassification === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => selectClassification(team, opt.id)}
                    className={`py-2 px-2.5 rounded-lg flex items-center justify-between border-2 transition-all active:scale-95 touch-manipulation cursor-pointer ${
                      isSelected
                        ? isBlue
                          ? 'bg-sky-600 text-white border-sky-700 shadow-sm ring-2 ring-sky-300'
                          : 'bg-red-600 text-white border-red-700 shadow-sm ring-2 ring-red-300'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <span className="text-[11px] font-black tracking-wide">{opt.label}</span>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {opt.range}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Full-width 5th option: REFLEX ANGLE */}
            {classificationOptions[4] && (
              <button
                onClick={() => selectClassification(team, classificationOptions[4].id)}
                className={`py-1.5 px-3 rounded-lg flex items-center justify-between border-2 transition-all active:scale-95 touch-manipulation cursor-pointer ${
                  teamState.selectedClassification === classificationOptions[4].id
                    ? isBlue
                      ? 'bg-sky-600 text-white border-sky-700 shadow-sm ring-2 ring-sky-300'
                      : 'bg-red-600 text-white border-red-700 shadow-sm ring-2 ring-red-300'
                    : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <span className="text-[11px] font-black tracking-wide">{classificationOptions[4].label}</span>
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${
                    teamState.selectedClassification === classificationOptions[4].id
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {classificationOptions[4].range}
                </span>
              </button>
            )}
          </div>
        )}

        {/* Mode 2: Protractor Measurement & Missing Angles & Sundial */}
        {(q.category === 'measure_angles' ||
          q.category === 'missing_angles' ||
          q.category === 'sundial_tracking') && (
          <ProtractorControl
            team={team}
            currentAngle={teamState.instrumentAngle}
            onAngleChange={(angle) => setInstrumentAngle(team, angle)}
            maxAngle={q.targetAngle > 180 ? 360 : 180}
          />
        )}

        {/* Mode 3: Geometric Construction Station */}
        {q.category === 'constructions' && (
          <ConstructionTool
            team={team}
            baseAngle={q.baseAngle || 70}
            targetAngle={q.targetAngle}
            type={q.missingAngleType === 'straight_line' ? 'perpendicular' : 'angle_bisector'}
            onConstructBisector={(bisector) => setConstructionBisector(team, bisector)}
            onComplete={() => completeConstruction(team)}
          />
        )}

        {/* ── 4. PHYSICAL CONSEQUENCE STATUS PREVIEW ── */}
        <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-100/95 rounded-lg text-[11px] text-slate-700 border border-slate-200">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Target:</span>
            <span className="text-slate-900 font-black text-xs">{q.targetAngle}°</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Action:</span>
            <span
              className={
                isAligned
                  ? 'text-emerald-700 font-black text-[11px]'
                  : isRotating
                  ? 'text-amber-700 font-extrabold text-[11px]'
                  : 'text-slate-700 font-semibold text-[11px]'
              }
            >
              {isAligned ? 'MIRROR ALIGNED ✓' : isRotating ? 'CALIBRATING...' : 'Rotate mirror'}
            </span>
          </div>
        </div>

        {/* Feedback Message */}
        {teamState.feedbackMessage && (
          <div
            className={`text-[11px] font-bold py-1.5 px-2.5 rounded-lg text-center transition-all ${
              teamState.lastFeedback === 'beam_aligned' || teamState.lastFeedback === 'power_up'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : teamState.lastFeedback === 'off_target'
                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                : 'bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {teamState.feedbackMessage}
          </div>
        )}

        {/* ── 5. PRIMARY ACTION BUTTON ── */}
        {q.category !== 'constructions' && (
          <button
            onClick={() => submitAnswer(team)}
            disabled={teamState.isRotatingMirror}
            className={`w-full py-2.5 px-4 rounded-xl text-white font-black text-xs tracking-wider uppercase shadow-md transition-all active:scale-[0.98] disabled:opacity-50 touch-manipulation cursor-pointer flex items-center justify-center gap-2 ${actionBtnBg}`}
          >
            <span>
              {teamState.isRotatingMirror ? 'CALIBRATING MIRROR…' : 'CALIBRATE MIRROR →'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
