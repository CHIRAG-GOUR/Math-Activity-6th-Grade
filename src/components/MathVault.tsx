'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CaveBackground } from './CaveBackground';
import { GameHUD } from './GameHUD';
import { VaultDoor } from './VaultDoor';
import { QuestionPanel } from './QuestionPanel';
import { PowerBoost } from './PowerBoost';
import { AnswerGrid } from './AnswerGrid';
import { GameFeedback } from './GameFeedback';
import { CountdownOverlay } from './CountdownOverlay';
import { StartScreen } from './StartScreen';
import { GameOverScreen } from './GameOverScreen';
import { UtilityControls } from './UtilityControls';
import { GamePhase, GameSettings, Question, TeamId, TeamState } from '@/types/game';
import { generateQuestion } from '@/utils/questionGenerator';
import { soundManager } from '@/utils/audio';

const INITIAL_SETTINGS: GameSettings = {
  grade: '3-4',
  topic: 'multiplication',
  difficulty: 'medium',
  totalRounds: 10,
  timePerRound: 15,
  soundEnabled: true,
  teamBlueName: 'TEAM BLUE',
  teamRedName: 'TEAM RED',
};

const createInitialTeam = (id: TeamId, name: string): TeamState => ({
  id,
  name,
  score: 0,
  streak: 0,
  keys: 0,
  multiplier: 1,
  currentInput: '',
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  comboTitle: null,
});

export const MathVault: React.FC = () => {
  const [phase, setPhase] = useState<GamePhase>('start');
  const [settings, setSettings] = useState<GameSettings>(INITIAL_SETTINGS);

  const [teamBlue, setTeamBlue] = useState<TeamState>(createInitialTeam('blue', INITIAL_SETTINGS.teamBlueName));
  const [teamRed, setTeamRed] = useState<TeamState>(createInitialTeam('red', INITIAL_SETTINGS.teamRedName));

  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(INITIAL_SETTINGS.timePerRound);

  const [isVaultUnlocking, setIsVaultUnlocking] = useState<boolean>(false);
  const [blueEarnedKey, setBlueEarnedKey] = useState<boolean>(false);
  const [redEarnedKey, setRedEarnedKey] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize team names if settings change
  useEffect(() => {
    if (phase === 'start') {
      setTeamBlue((prev) => ({ ...prev, name: settings.teamBlueName }));
      setTeamRed((prev) => ({ ...prev, name: settings.teamRedName }));
    }
  }, [settings.teamBlueName, settings.teamRedName, phase]);

  // Start new round
  const startRound = useCallback(
    (roundNum: number) => {
      const q = generateQuestion(settings.topic, settings.difficulty, settings.grade, roundNum);
      setCurrentQuestion(q);
      setCurrentRound(roundNum);
      setTimeLeft(settings.timePerRound);
      setIsVaultUnlocking(false);
      setBlueEarnedKey(false);
      setRedEarnedKey(false);

      setTeamBlue((prev) => ({
        ...prev,
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastScoreGained: 0,
        comboTitle: null,
      }));

      setTeamRed((prev) => ({
        ...prev,
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastScoreGained: 0,
        comboTitle: null,
      }));

      setPhase('playing');
    },
    [settings]
  );

  // Start Game
  const handleStartGame = () => {
    setTeamBlue(createInitialTeam('blue', settings.teamBlueName));
    setTeamRed(createInitialTeam('red', settings.teamRedName));
    setPhase('countdown');
  };

  // Evaluate round answers
  const evaluateRound = useCallback(() => {
    if (!currentQuestion) return;

    setPhase('round_reveal');
    setIsVaultUnlocking(true);
    soundManager.playVaultGear();

    let blueGained = 0;
    let redGained = 0;

    // Team Blue Evaluation
    setTeamBlue((prev) => {
      const isCorrect =
        prev.selectedAnswer !== null && String(prev.selectedAnswer) === String(currentQuestion.answer);
      let newScore = prev.score;
      let newStreak = isCorrect ? prev.streak + 1 : 0;
      let newKeys = prev.keys;
      let comboTitle: string | null = null;

      if (isCorrect) {
        const basePts = 100;
        const streakBonus = Math.min(newStreak * 15, 60);
        blueGained = (basePts + streakBonus) * prev.multiplier;
        newScore += blueGained;

        if (newStreak === 3) {
          comboTitle = 'COMBO ×2 🔥';
          soundManager.playCombo(3);
        } else if (newStreak === 5) {
          comboTitle = 'SUPER COMBO ⚡';
          soundManager.playCombo(5);
        } else if (newStreak >= 7) {
          comboTitle = 'MATH MASTER 👑';
          soundManager.playCombo(7);
        }

        // Award key on 3rd streak or every 3 correct
        if (newStreak % 3 === 0 && newKeys < 3) {
          newKeys += 1;
          setBlueEarnedKey(true);
          soundManager.playKeyEarned();
        } else {
          soundManager.playCorrect();
        }
      } else {
        if (prev.multiplier === 3) {
          blueGained = -50;
          newScore = Math.max(0, newScore - 50);
        }
        soundManager.playWrong();
      }

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        keys: newKeys,
        lastResult: isCorrect ? 'correct' : 'wrong',
        lastScoreGained: blueGained,
        comboTitle,
      };
    });

    // Team Red Evaluation
    setTeamRed((prev) => {
      const isCorrect =
        prev.selectedAnswer !== null && String(prev.selectedAnswer) === String(currentQuestion.answer);
      let newScore = prev.score;
      let newStreak = isCorrect ? prev.streak + 1 : 0;
      let newKeys = prev.keys;
      let comboTitle: string | null = null;

      if (isCorrect) {
        const basePts = 100;
        const streakBonus = Math.min(newStreak * 15, 60);
        redGained = (basePts + streakBonus) * prev.multiplier;
        newScore += redGained;

        if (newStreak === 3) {
          comboTitle = 'COMBO ×2 🔥';
          soundManager.playCombo(3);
        } else if (newStreak === 5) {
          comboTitle = 'SUPER COMBO ⚡';
          soundManager.playCombo(5);
        } else if (newStreak >= 7) {
          comboTitle = 'MATH MASTER 👑';
          soundManager.playCombo(7);
        }

        if (newStreak % 3 === 0 && newKeys < 3) {
          newKeys += 1;
          setRedEarnedKey(true);
          soundManager.playKeyEarned();
        } else {
          soundManager.playCorrect();
        }
      } else {
        if (prev.multiplier === 3) {
          redGained = -50;
          newScore = Math.max(0, newScore - 50);
        }
        soundManager.playWrong();
      }

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        keys: newKeys,
        lastResult: isCorrect ? 'correct' : 'wrong',
        lastScoreGained: redGained,
        comboTitle,
      };
    });

    // Advance to next round or game over after reveal duration
    setTimeout(() => {
      if (currentRound >= settings.totalRounds) {
        setPhase('game_over');
      } else {
        startRound(currentRound + 1);
      }
    }, 2800);
  }, [currentQuestion, currentRound, settings.totalRounds, startRound]);

  // Main Timer Countdown Loop
  useEffect(() => {
    if (phase !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          evaluateRound();
          return 0;
        }

        if (prev === 5 || prev === 4) {
          soundManager.playTimerUrgent(false);
        } else if (prev <= 3) {
          soundManager.playTimerUrgent(true);
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, evaluateRound]);

  // Handle Team Answer Selection
  const handleSelectAnswer = (teamId: TeamId, answer: number | string) => {
    soundManager.playClick();

    if (teamId === 'blue') {
      if (teamBlue.isLocked || phase !== 'playing') return;
      setTeamBlue((prev) => ({
        ...prev,
        selectedAnswer: answer,
        isLocked: true,
      }));

      // If other team also locked, evaluate early!
      if (teamRed.isLocked) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(evaluateRound, 300);
      }
    } else {
      if (teamRed.isLocked || phase !== 'playing') return;
      setTeamRed((prev) => ({
        ...prev,
        selectedAnswer: answer,
        isLocked: true,
      }));

      // If other team also locked, evaluate early!
      if (teamBlue.isLocked) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(evaluateRound, 300);
      }
    }
  };

  // Handle Team Multiplier Selection
  const handleSelectMultiplier = (teamId: TeamId, mult: 1 | 2 | 3) => {
    if (teamId === 'blue') {
      if (teamBlue.isLocked || phase !== 'playing') return;
      setTeamBlue((prev) => ({ ...prev, multiplier: mult }));
    } else {
      if (teamRed.isLocked || phase !== 'playing') return;
      setTeamRed((prev) => ({ ...prev, multiplier: mult }));
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between p-2 sm:p-4 select-none bg-[#03050a]">
      {/* Dynamic Cavern Background */}
      <CaveBackground />

      {/* PHASE 1: START SCREEN */}
      {phase === 'start' && (
        <StartScreen
          settings={settings}
          onUpdateSettings={setSettings}
          onStartGame={handleStartGame}
        />
      )}

      {/* PHASE 2: COUNTDOWN OVERLAY */}
      {phase === 'countdown' && (
        <CountdownOverlay onComplete={() => startRound(1)} />
      )}

      {/* PHASE 3: ACTIVE PLAYING / ROUND REVEAL */}
      {(phase === 'playing' || phase === 'round_reveal') && (
        <div className="relative w-full h-full flex flex-col justify-between max-w-[1920px] mx-auto z-20">
          {/* TOP AREA: GAME HUD */}
          <GameHUD
            teamBlue={teamBlue}
            teamRed={teamRed}
            currentRound={currentRound}
            totalRounds={settings.totalRounds}
            timeLeft={timeLeft}
          />

          {/* CENTER AREA: DOMINANT MASSIVE GOLDEN VAULT DOOR */}
          <div className="relative flex-1 flex items-center justify-center -my-3 sm:-my-5">
            <VaultDoor
              blueKeys={teamBlue.keys}
              redKeys={teamRed.keys}
              isUnlocking={isVaultUnlocking}
            >
              <QuestionPanel
                question={currentQuestion}
                roundNumber={currentRound}
              />
            </VaultDoor>
          </div>

          {/* BOTTOM AREA: PHYSICAL CONTROLS */}
          <div className="relative w-full grid grid-cols-12 gap-3 sm:gap-6 items-end pb-2 px-2 z-30">
            {/* BOTTOM LEFT: Team Blue (Power Boost + 5x2 Keypad) */}
            <div className="col-span-5 flex flex-col gap-2">
              <PowerBoost
                team="blue"
                currentMultiplier={teamBlue.multiplier}
                disabled={teamBlue.isLocked || phase !== 'playing'}
                onSelectMultiplier={(mult) => handleSelectMultiplier('blue', mult)}
              />
              <AnswerGrid
                team={teamBlue}
                options={currentQuestion?.options || []}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onSelectAnswer={handleSelectAnswer}
              />
            </div>

            {/* BOTTOM CENTER: Small Utility Hardware Controls */}
            <div className="col-span-2 flex flex-col items-center justify-end pb-1.5">
              <UtilityControls
                onRestart={() => startRound(currentRound)}
                onHome={() => setPhase('start')}
              />
            </div>

            {/* BOTTOM RIGHT: Team Red (Power Boost + 5x2 Keypad) */}
            <div className="col-span-5 flex flex-col gap-2">
              <PowerBoost
                team="red"
                currentMultiplier={teamRed.multiplier}
                disabled={teamRed.isLocked || phase !== 'playing'}
                onSelectMultiplier={(mult) => handleSelectMultiplier('red', mult)}
              />
              <AnswerGrid
                team={teamRed}
                options={currentQuestion?.options || []}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onSelectAnswer={handleSelectAnswer}
              />
            </div>
          </div>

          {/* Floating Action Feedback & Combo Banners */}
          <GameFeedback
            teamBlue={teamBlue}
            teamRed={teamRed}
            isRevealed={phase === 'round_reveal'}
            blueEarnedKey={blueEarnedKey}
            redEarnedKey={redEarnedKey}
          />
        </div>
      )}

      {/* PHASE 4: GAME OVER / VAULT CRACKED */}
      {phase === 'game_over' && (
        <GameOverScreen
          teamBlue={teamBlue}
          teamRed={teamRed}
          onPlayAgain={() => {
            setTeamBlue(createInitialTeam('blue', settings.teamBlueName));
            setTeamRed(createInitialTeam('red', settings.teamRedName));
            setPhase('countdown');
          }}
          onChangeSettings={() => setPhase('start')}
        />
      )}
    </main>
  );
};
