// ============================================================
// THE GREAT CARNIVAL OF CHANCE — NEUBRUTALIST OPERATOR CONSOLE
// Clean, Zero-Scrollbar Layout with Guaranteed Solid Colors & 4-5px Outlines
// Phase-Aware Dynamic Flow:
// - PREDICTING: Shows Question Card, Answer Push Buttons & Submit Actuator
// - OPERATING (Action): HIDES Questions & Choices to give 100% unobstructed 3D machine view!
// - OBSERVATION: Shows Team Result Badge & Streak without blocking central modal
// ============================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCarnivalStore } from '../store/carnivalStore';
import { AnswerChoice, TeamId, ActivityId } from '../types';
import { QuestionPanel } from './QuestionPanel';
import { AnswerButton } from './AnswerButton';
import { SubmitButton } from './SubmitButton';
import { MathFractionDisplay } from './MathFraction';
import { Ticket, Sparkles, CheckCircle2, XCircle, Flame, Eye } from 'lucide-react';

interface TeamConsoleProps {
  teamId: TeamId;
}

const ACTION_LABELS: Record<ActivityId, string> = {
  hub: 'LOCK IN PREDICTION',
  'odds-wheel': 'SPIN THE 3D WHEEL',
  'mystery-bag': 'OPEN CHEST & DRAW BALL',
  'ball-drop': 'SWING SLEDGEHAMMER & STRIKE',
  'probability-lab': 'IGNITE PLASMA REACTOR',
  'game-builder': 'LAUNCH TEST TOKEN',
  'grand-carnival': 'UNLOCK CHAMPIONSHIP VAULT',
};

export const TeamConsole: React.FC<TeamConsoleProps> = ({ teamId }) => {
  const isBlue = teamId === 'blue';
  const teamState = useCarnivalStore((s) => (isBlue ? s.blueTeam : s.redTeam));
  const otherTeamState = useCarnivalStore((s) => (isBlue ? s.redTeam : s.blueTeam));
  const activeChallenge = useCarnivalStore((s) => s.activeChallenge);
  const activeActivity = useCarnivalStore((s) => s.activeActivity);
  const phase = useCarnivalStore((s) => s.phase);
  const selectChoice = useCarnivalStore((s) => s.selectChoice);
  const confirmPrediction = useCarnivalStore((s) => s.confirmPrediction);

  const isPredicting = phase === 'predicting';
  const isOperating = phase === 'operating';
  const isObservation = phase === 'observation' || phase === 'batch-trials';
  const isCompleted = phase === 'completed';

  const isReboundOpportunity =
    isPredicting &&
    !teamState.isLocked &&
    otherTeamState.isLocked &&
    otherTeamState.lastResult === 'wrong';

  const selectedChoice = activeChallenge?.choices.find(
    (c) => c.id === teamState.selectedChoiceId
  );

  const handleChoiceTouch = (choice: AnswerChoice, e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || teamState.isConfirmed || teamState.isLocked) return;
    selectChoice(teamId, choice.id);
  };

  const handleConfirmTouch = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPredicting || teamState.isConfirmed || teamState.isLocked || !teamState.selectedChoiceId) return;
    confirmPrediction(teamId);
  };

  const actionLabel = isReboundOpportunity
    ? '⚡ STEAL ON REBOUND!'
    : ACTION_LABELS[activeActivity] || 'LOCK IN PREDICTION';

  return (
    // ── LAYER 1: SOLID COLOR OUTER FRAME (4.5px Black Outline & 6px Hard Shadow) ──
    <div
      style={{
        backgroundColor: isBlue ? '#2563EB' : '#FF2A6D',
        border: '4px solid #000000',
        boxShadow: '5px 5px 0px #000000',
        borderRadius: '20px',
      }}
      className="w-full h-full p-1.5 sm:p-2 select-none flex flex-col justify-between overflow-hidden"
    >
      {/* ── LAYER 2: SOLID OPAQUE CREAM INNER CONTAINER (3.5px Black Outline) ── */}
      <div
        style={{
          backgroundColor: '#FFF7E5',
          border: '3px solid #000000',
          boxShadow: '2.5px 2.5px 0px #000000',
          borderRadius: '14px',
        }}
        className="w-full h-full p-1.5 sm:p-2 flex flex-col justify-between overflow-hidden"
      >
        {/* ── HEADER STRIP: TEAM BADGE & TICKETS (Yellow with Black Card) ── */}
        <div
          style={{
            backgroundColor: '#FED500',
            border: '2.5px solid #000000',
            boxShadow: '2px 2px 0px #000000',
            borderRadius: '10px',
          }}
          className="w-full h-[32px] sm:h-[36px] px-2 flex items-center justify-between shrink-0"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <div
              style={{
                backgroundColor: isBlue ? '#2563EB' : '#FF2A6D',
                border: '1.5px solid #000000',
                boxShadow: '1px 1px 0px #000000',
                borderRadius: '6px',
              }}
              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-black text-[11px] sm:text-xs text-white shrink-0"
            >
              {isBlue ? 'B' : 'R'}
            </div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black truncate">
              {isBlue ? 'BLUE OPERATOR' : 'RED OPERATOR'}
            </span>
          </div>

          {/* Gold Tickets Badge */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #000000',
              boxShadow: '1px 1px 0px #000000',
              borderRadius: '6px',
            }}
            className="flex items-center gap-1 px-1.5 py-0.2 font-black text-[10px] sm:text-xs text-black shrink-0"
          >
            <Ticket className="w-3 h-3 fill-[#FED500] text-black" />
            <span>{teamState.goldTickets}</span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════
            PHASE 1: PREDICTING — QUESTION + ANSWER CARDS + SUBMIT ACTUATOR
            ═════════════════════════════════════════════════════════════ */}
        {isPredicting && (
          <div className="flex-1 flex flex-col justify-between gap-1 sm:gap-1.5 my-1 min-h-0 overflow-hidden">
            {/* Question Panel Card (Yellow with Black) */}
            {activeChallenge && <QuestionPanel challenge={activeChallenge} />}

            {/* Rebound Opportunity Alert Strip */}
            {isReboundOpportunity && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: [1, 1.02, 1], opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1 }}
                style={{
                  backgroundColor: '#FED500',
                  border: '2px solid #000000',
                  boxShadow: '1.5px 1.5px 0px #000000',
                  borderRadius: '8px',
                }}
                className="py-0.5 px-1.5 text-center shrink-0"
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-black">
                  ⚡ REBOUND CHANCE — ANSWER FIRST TO STEAL!
                </span>
              </motion.div>
            )}

            {/* 1 Attempt Remaining Alert Strip */}
            {!teamState.isLocked && teamState.attemptsLeft === 1 && (
              <div
                style={{
                  backgroundColor: '#FED500',
                  border: '2px solid #000000',
                  boxShadow: '1.5px 1.5px 0px #000000',
                  borderRadius: '8px',
                  color: '#000000',
                }}
                className="py-0.5 px-1.5 text-center shrink-0 animate-pulse"
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-black">
                  ⚠️ 1 ATTEMPT LEFT — TRY AGAIN!
                </span>
              </div>
            )}

            {/* Locked Out Alert Strip */}
            {teamState.isLocked && teamState.lastResult === 'wrong' && (
              <div
                style={{
                  backgroundColor: '#FF2A6D',
                  border: '2px solid #000000',
                  boxShadow: '1.5px 1.5px 0px #000000',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                }}
                className="py-0.5 px-1.5 text-center shrink-0"
              >
                <span className="text-[9px] font-black uppercase tracking-wider text-white">
                  ❌ LOCKED OUT — 0 ATTEMPTS LEFT
                </span>
              </div>
            )}

            {/* Answer Options Push Cards Stack */}
            <div className="flex-1 flex flex-col justify-evenly gap-1.5 min-h-0 py-1">
              {activeChallenge?.choices.map((choice, idx) => (
                <AnswerButton
                  key={choice.id}
                  choice={choice}
                  choiceIndex={idx}
                  teamId={teamId}
                  isSelected={teamState.selectedChoiceId === choice.id}
                  isConfirmed={teamState.isConfirmed}
                  isLocked={teamState.isLocked}
                  isPredicting={isPredicting}
                  onSelect={(e) => handleChoiceTouch(choice, e)}
                />
              ))}
            </div>

            {/* Submit Actuator (Yellow / Mint) */}
            <div className="shrink-0 pt-0.5">
              <SubmitButton
                isReady={!!teamState.selectedChoiceId && !teamState.isLocked}
                isConfirmed={teamState.isConfirmed}
                isPredicting={isPredicting}
                onConfirm={handleConfirmTouch}
                teamColor={isBlue ? 'blue' : 'red'}
                customLabel={actionLabel}
              />
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 2: OPERATING (ACTION) — HIDE QUESTION & OPEN 3D SCENE
            ═════════════════════════════════════════════════════════════ */}
        {isOperating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center items-center text-center p-2 gap-2 my-auto overflow-hidden"
          >
            {/* Prediction Locked Preview Card (Yellow with Black) */}
            <div
              style={{
                backgroundColor: '#FED500',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '12px',
                color: '#000000',
              }}
              className="w-full p-2.5 flex flex-col items-center gap-1"
            >
              <span className="text-[9px] font-black uppercase tracking-wider text-black opacity-75">
                LOCKED PREDICTION
              </span>
              {selectedChoice && (
                <div className="flex items-center gap-2">
                  <div
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1.5px solid #000000',
                      borderRadius: '6px',
                      padding: '1px 5px',
                    }}
                  >
                    <MathFractionDisplay fraction={selectedChoice.fraction} size="sm" />
                  </div>
                  <span className="text-[11px] font-black text-black">
                    {selectedChoice.label}
                  </span>
                </div>
              )}
            </div>

            {/* Active Machine Vibration Banner (Red with White) */}
            <div
              style={{
                backgroundColor: '#FF2A6D',
                border: '3px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '12px',
                color: '#FFFFFF',
              }}
              className="w-full p-3 flex flex-col items-center gap-1 animate-pulse"
            >
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 stroke-[3] text-white" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  WATCH THE 3D MACHINE
                </span>
              </div>
              <span className="text-[9px] font-bold text-white opacity-90">
                Opening winning box & revealing ball...
              </span>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 3: OBSERVATION & REASONING — OUTCOME SUMMARY
            ═════════════════════════════════════════════════════════════ */}
        {isObservation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-center items-center text-center p-2 gap-2 my-auto overflow-hidden"
          >
            {/* Correct or Incorrect Team Badge */}
            <div
              style={{
                backgroundColor: teamState.isCorrect ? '#00F0A8' : '#FF2A6D',
                border: '3.5px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '14px',
                color: teamState.isCorrect ? '#000000' : '#FFFFFF',
              }}
              className="w-full p-3 flex flex-col items-center gap-1.5"
            >
              {teamState.isCorrect ? (
                <>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5 stroke-[3.5] text-black" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      PREDICTION ACCURATE!
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      style={{
                        backgroundColor: '#FED500',
                        border: '1.5px solid #000000',
                        boxShadow: '1.5px 1.5px 0px #000000',
                        borderRadius: '6px',
                      }}
                      className="px-2 py-0.2 text-[10px] font-black text-black"
                    >
                      +{teamState.scoreGained} PTS
                    </div>
                    {teamState.streak > 1 && (
                      <div
                        style={{
                          backgroundColor: '#FED500',
                          border: '1.5px solid #000000',
                          borderRadius: '6px',
                        }}
                        className="flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-black text-black"
                      >
                        <Flame className="w-3 h-3 fill-[#FF2A6D] text-[#FF2A6D]" />
                        <span>{teamState.streak}X STREAK</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <XCircle className="w-5 h-5 stroke-[3.5] text-white" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      TRY AGAIN NEXT TRIAL
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-white opacity-90">
                    Review the center reasoning card!
                  </span>
                </>
              )}
            </div>

            {/* Team Score Plaque (Yellow with Black) */}
            <div
              style={{
                backgroundColor: '#FED500',
                border: '2.5px solid #000000',
                boxShadow: '3px 3px 0px #000000',
                borderRadius: '12px',
                color: '#000000',
              }}
              className="w-full p-2 flex items-center justify-between"
            >
              <span className="text-[10px] font-black uppercase text-black">
                TOTAL SCORE
              </span>
              <span className="text-sm font-black font-mono text-black">
                {teamState.score.toLocaleString()} PTS
              </span>
            </div>
          </motion.div>
        )}

        {/* ═════════════════════════════════════════════════════════════
            PHASE 4: COMPLETED — MASTERED BADGE
            ═════════════════════════════════════════════════════════════ */}
        {isCompleted && (
          <div className="flex-1 flex flex-col justify-center items-center text-center p-2 gap-1.5 my-auto overflow-hidden">
            <div
              style={{
                backgroundColor: '#FED500',
                border: '3px solid #000000',
                boxShadow: '4px 4px 0px #000000',
                borderRadius: '14px',
                color: '#000000',
              }}
              className="w-full p-3 flex flex-col items-center gap-1"
            >
              <Sparkles className="w-5 h-5 text-black stroke-[3]" />
              <span className="text-xs font-black uppercase text-black">
                ATTRACTION MASTERED!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

