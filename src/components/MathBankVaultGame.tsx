'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BankVaultRoom } from './BankVaultRoom';
import { BankTopHUD } from './BankTopHUD';
import { BankVaultDoor } from './BankVaultDoor';
import { TeamAnswerConsole } from './TeamAnswerConsole';
import { GameFeedback } from './GameFeedback';
import { CountdownOverlay } from './CountdownOverlay';
import { BankStartScreen } from './BankStartScreen';
import { BankVictoryCinematic } from './BankVictoryCinematic';
import { UtilityControls } from './UtilityControls';
import { GamePhase, GameSettings, Question, TeamId, TeamState } from '@/types/game';
import { generateQuestion } from '@/utils/questionGenerator';
import { soundManager } from '@/utils/audio';

const INITIAL_SETTINGS: GameSettings = {
  grade: '3-4',
  topic: 'multiplication',
  difficulty: 'medium',
  totalRounds: 10,
  timePerRound: 20,
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

export const MathBankVaultGame: React.FC = () => {
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

  // Sync team names if settings change
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
        currentInput: '',
        selectedAnswer: null,
        isLocked: false,
        lastResult: null,
        lastScoreGained: 0,
        comboTitle: null,
      }));

      setTeamRed((prev) => ({
        ...prev,
        currentInput: '',
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
      const submitted = prev.selectedAnswer !== null ? String(prev.selectedAnswer) : prev.currentInput;
      const isCorrect = submitted !== '' && String(submitted) === String(currentQuestion.answer);
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
        selectedAnswer: submitted || '—',
        lastResult: isCorrect ? 'correct' : 'wrong',
        lastScoreGained: blueGained,
        comboTitle,
      };
    });

    // Team Red Evaluation
    setTeamRed((prev) => {
      const submitted = prev.selectedAnswer !== null ? String(prev.selectedAnswer) : prev.currentInput;
      const isCorrect = submitted !== '' && String(submitted) === String(currentQuestion.answer);
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
        selectedAnswer: submitted || '—',
        lastResult: isCorrect ? 'correct' : 'wrong',
        lastScoreGained: redGained,
        comboTitle,
      };
    });

    // Advance to next round or victory
    setTimeout(() => {
      if (currentRound >= settings.totalRounds) {
        setPhase('game_over');
      } else {
        startRound(currentRound + 1);
      }
    }, 2800);
  }, [currentQuestion, currentRound, settings.totalRounds, startRound]);

  // Main Timer Loop
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

  // 1. KEYPAD DIGIT PRESS
  const handleDigitPress = (teamId: TeamId, digit: string) => {
    if (phase !== 'playing') return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked) return;
      setTeamBlue((prev) => {
        if (prev.currentInput.length >= 6) return prev;
        return { ...prev, currentInput: prev.currentInput + digit };
      });
    } else {
      if (teamRed.isLocked) return;
      setTeamRed((prev) => {
        if (prev.currentInput.length >= 6) return prev;
        return { ...prev, currentInput: prev.currentInput + digit };
      });
    }
  };

  // 2. CLEAR KEYPAD PRESS
  const handleClearPress = (teamId: TeamId) => {
    if (phase !== 'playing') return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked) return;
      setTeamBlue((prev) => ({ ...prev, currentInput: '' }));
    } else {
      if (teamRed.isLocked) return;
      setTeamRed((prev) => ({ ...prev, currentInput: '' }));
    }
  };

  // 3. SUBMIT CODE PRESS
  const handleSubmitPress = (teamId: TeamId) => {
    if (phase !== 'playing') return;

    if (teamId === 'blue') {
      if (teamBlue.isLocked || !teamBlue.currentInput) return;
      setTeamBlue((prev) => ({
        ...prev,
        selectedAnswer: prev.currentInput,
        isLocked: true,
      }));

      // If other team also locked, evaluate early!
      if (teamRed.isLocked) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(evaluateRound, 300);
      }
    } else {
      if (teamRed.isLocked || !teamRed.currentInput) return;
      setTeamRed((prev) => ({
        ...prev,
        selectedAnswer: prev.currentInput,
        isLocked: true,
      }));

      // If other team also locked, evaluate early!
      if (teamBlue.isLocked) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(evaluateRound, 300);
      }
    }
  };

  // 4. MULTIPLIER SELECTION
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
    <main className="relative w-screen h-screen overflow-hidden flex flex-col justify-between p-2 sm:p-4 select-none">
      {/* 1. BRIGHT LUXURY BANK VAULT ROOM BACKGROUND */}
      <BankVaultRoom />

      {/* PHASE 1: START SCREEN */}
      {phase === 'start' && (
        <BankStartScreen
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
          
          {/* TOP AREA: BANK HUD */}
          <BankTopHUD
            teamBlue={teamBlue}
            teamRed={teamRed}
            currentRound={currentRound}
            totalRounds={settings.totalRounds}
            timeLeft={timeLeft}
          />

          {/* MAIN 3-COLUMN PLAYING SCREEN: BLUE CONSOLE | CENTRAL BANK VAULT | RED CONSOLE */}
          <div className="relative flex-1 grid grid-cols-12 gap-4 sm:gap-6 items-center px-4 sm:px-8 my-1 sm:my-2">
            
            {/* LEFT COLUMN: TEAM BLUE SECURITY CONSOLE */}
            <div className="col-span-4 flex flex-col justify-center transform lg:-rotate-1 origin-bottom-right">
              <TeamAnswerConsole
                team={teamBlue}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onDigitPress={handleDigitPress}
                onClearPress={handleClearPress}
                onSubmitPress={handleSubmitPress}
                onSelectMultiplier={handleSelectMultiplier}
              />
            </div>

            {/* CENTER COLUMN: MASSIVE CENTRAL BANK VAULT DOOR (Hero Piece) */}
            <div className="col-span-4 flex items-center justify-center">
              <BankVaultDoor
                blueKeys={teamBlue.keys}
                redKeys={teamRed.keys}
                question={currentQuestion}
                roundNumber={currentRound}
                isUnlocking={isVaultUnlocking}
              />
            </div>

            {/* RIGHT COLUMN: TEAM RED SECURITY CONSOLE */}
            <div className="col-span-4 flex flex-col justify-center transform lg:rotate-1 origin-bottom-left">
              <TeamAnswerConsole
                team={teamRed}
                correctAnswer={phase === 'round_reveal' && currentQuestion ? currentQuestion.answer : null}
                isRevealed={phase === 'round_reveal'}
                disabled={phase !== 'playing'}
                onDigitPress={handleDigitPress}
                onClearPress={handleClearPress}
                onSubmitPress={handleSubmitPress}
                onSelectMultiplier={handleSelectMultiplier}
              />
            </div>

          </div>

          {/* BOTTOM UTILITY HARDWARE BAR */}
          <div className="relative w-full flex items-center justify-center pb-2 z-30">
            <UtilityControls
              onRestart={() => startRound(currentRound)}
              onHome={() => setPhase('start')}
            />
          </div>

          {/* Floating Game Feedback & Combo Banners */}
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
        <BankVictoryCinematic
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
