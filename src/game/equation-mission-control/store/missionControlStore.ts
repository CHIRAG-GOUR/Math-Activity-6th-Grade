// ============================================================
// EQUATION MISSION CONTROL 2.0 — Zustand Store Orchestrator
// Full State Management for Dual 3D Spacecraft Launch Facility
// First-Answerer & Rebound Competitive Rule (From Train Game)
// ============================================================

import { create } from 'zustand';
import {
  GamePhase,
  TeamId,
  StageIndex,
  TeamControlState,
  Spacecraft3DState,
  MissionChallenge,
  MissionCampaign,
  LaunchStep,
} from '../types';
import { generateDynamicCampaign } from '../engine/questionPool';
import { soundManager } from '@/utils/audio';

const createDefaultTeamState = (id: TeamId, name?: string): TeamControlState => ({
  id,
  name: name || (id === 'blue' ? 'BLUE TEAM' : 'RED TEAM'),
  score: 0,
  stageScore: 0,
  streak: 0,
  stagesCleared: 0,
  selectedAnswer: null,
  attemptsLeft: 2,
  isLocked: false,
  lastResult: null,
  lastScoreGained: 0,
  lastFeedback: null,
});

const createDefaultSpacecraftState = (team: TeamId): Spacecraft3DState => ({
  team,
  stage1StructureDone: false,
  stage2FuelDone: false,
  stage3EngineDone: false,
  stage4NavDone: false,
  stage5Armed: false,

  cockpitGlowIntensity: 0.2,
  fuelTankPercent: 0,
  fuelArmConnected: false,
  ventingVapor: false,
  engineGlowIntensity: 0,
  gimbalPitchAngle: 0,
  antennaDeployed: false,
  serviceArmsAngle: 0,
  clampsReleased: false,
  brakesReleased: false,
  greenSignalActive: false,
  isWeldingActive: true,

  launchStage: 'idle',
  altitude: 0,
  ascentVelocity: 0,
  exhaustFlameScale: 0,
  smokeVolume: 0,
  flagWaveSpeed: 1,
  flagProminence: 1,
});

const resetTeamForQuestion = (t: TeamControlState): TeamControlState => ({
  ...t,
  selectedAnswer: null,
  isLocked: false,
  lastResult: null,
  attemptsLeft: 2,
  lastFeedback: null,
});

let launchInterval: ReturnType<typeof setInterval> | null = null;
const clearLaunchInterval = () => {
  if (launchInterval) {
    clearInterval(launchInterval);
    launchInterval = null;
  }
};

let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null;
const clearAutoAdvance = () => {
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
};

interface MissionControlActions {
  setPhase: (phase: GamePhase) => void;
  setTeamName: (team: TeamId, name: string) => void;
  startGame: () => void;
  startStage: (stageIndex: StageIndex) => void;

  // Question & Rebound Engine (Learned from Train Game)
  setTeamAnswer: (team: TeamId, answer: number | string) => void;
  lockInTeam: (team: TeamId) => void;
  handleTimerExpired: () => void;
  advanceToNextStage: () => void;

  run12StepCinematicLaunch: (winner: TeamId | 'draw') => void;

  setParallax: (x: number, y: number) => void;
  setCameraTarget: (target: 'overview' | 'blue-pad' | 'red-pad' | 'hero-launch') => void;

  setTimeRemaining: (t: number) => void;
  setTimerActive: (active: boolean) => void;
  toggleMute: () => void;
  clearToast: () => void;
}

export type MissionControlStore = {
  phase: GamePhase;
  campaign: MissionCampaign;
  questionPoolIndex: number;
  currentStageIndex: StageIndex;
  activeChallenge: MissionChallenge;

  blueTeam: TeamControlState;
  redTeam: TeamControlState;
  blueSpacecraft: Spacecraft3DState;
  redSpacecraft: Spacecraft3DState;

  winnerTeam: TeamId | 'draw' | null;
  timeRemaining: number;
  timerActive: boolean;
  toastMessage: string | null;
  cameraTarget: 'overview' | 'blue-pad' | 'red-pad' | 'hero-launch';
  parallaxX: number;
  parallaxY: number;
  isMuted: boolean;
} & MissionControlActions;

const initialCampaign = generateDynamicCampaign(0);

export const useMissionControlStore = create<MissionControlStore>((set, get) => ({
  phase: 'title',
  campaign: initialCampaign,
  questionPoolIndex: 0,
  currentStageIndex: 0,
  activeChallenge: initialCampaign.challenges[0],

  blueTeam: createDefaultTeamState('blue', 'BLUE TEAM'),
  redTeam: createDefaultTeamState('red', 'RED TEAM'),
  blueSpacecraft: createDefaultSpacecraftState('blue'),
  redSpacecraft: createDefaultSpacecraftState('red'),

  winnerTeam: null,
  timeRemaining: 40,
  timerActive: false,
  toastMessage: null,
  cameraTarget: 'overview',
  parallaxX: 0,
  parallaxY: 0,
  isMuted: false,

  setPhase: (phase) => set({ phase }),

  setTeamName: (team, name) =>
    set((s) => ({
      [team === 'blue' ? 'blueTeam' : 'redTeam']: {
        ...(team === 'blue' ? s.blueTeam : s.redTeam),
        name: name.trim().slice(0, 24) || (team === 'blue' ? 'BLUE TEAM' : 'RED TEAM'),
      },
    })),

  startGame: () => {
    clearLaunchInterval();
    clearAutoAdvance();
    const camp = generateDynamicCampaign(Math.floor(Math.random() * 100));
    soundManager.play('powerup');

    set({
      campaign: camp,
      questionPoolIndex: 0,
      currentStageIndex: 0,
      activeChallenge: camp.challenges[0],
      winnerTeam: null,
      phase: 'active-mission',
      timeRemaining: camp.challenges[0].timeLimit,
      timerActive: true,
      toastMessage: '🚀 RACE TO 5 STAGES: AVIONICS CONFIGURATION INITIALIZED!',
      cameraTarget: 'overview',
      blueTeam: createDefaultTeamState('blue', get().blueTeam.name),
      redTeam: createDefaultTeamState('red', get().redTeam.name),
      blueSpacecraft: createDefaultSpacecraftState('blue'),
      redSpacecraft: createDefaultSpacecraftState('red'),
    });
  },

  startStage: (stageIndex) => {
    clearAutoAdvance();
    const { campaign, questionPoolIndex } = get();
    const challenge = campaign.challenges[questionPoolIndex] || campaign.challenges[0];
    set({
      currentStageIndex: stageIndex,
      activeChallenge: challenge,
      phase: 'active-mission',
      timeRemaining: challenge.timeLimit,
      timerActive: true,
      cameraTarget: 'overview',
      blueTeam: resetTeamForQuestion(get().blueTeam),
      redTeam: resetTeamForQuestion(get().redTeam),
    });
  },

  setParallax: (x, y) => set({ parallaxX: x, parallaxY: y }),
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // --------------------------------------------------------------------------
  // FIRST-ANSWERER & REBOUND ENGINE (From Train Game)
  // RACE TO 5 CORRECT ANSWERS BEFORE ROCKET LIFTOFF
  // --------------------------------------------------------------------------
  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const cur = get()[key];
    if (cur.isLocked || get().phase !== 'active-mission') return;
    soundManager.play('click');
    set({
      [key]: { ...cur, selectedAnswer: answer },
    });
  },

  lockInTeam: (team) => {
    const state = get();
    const ch = state.activeChallenge;
    if (!ch || state.phase !== 'active-mission') return;

    const isBlue = team === 'blue';
    const key = isBlue ? 'blueTeam' : 'redTeam';
    const otherKey = isBlue ? 'redTeam' : 'blueTeam';
    const shipKey = isBlue ? 'blueSpacecraft' : 'redSpacecraft';
    const teamState = state[key];
    const otherTeamState = state[otherKey];
    const ship = state[shipKey];

    if (teamState.isLocked || teamState.selectedAnswer === null) return;

    soundManager.play('click');
    const isCorrect =
      String(teamState.selectedAnswer).trim().toLowerCase() ===
      String(ch.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      // ── WINNING ANSWER: ONLY THIS TEAM'S ROCKET ADVANCES A STAGE ──
      soundManager.playCorrect();
      const speedBonus = Math.max(0, Math.floor(state.timeRemaining * 1.5));
      const pointsGained = ch.points + speedBonus;
      const newStreak = teamState.streak + 1;
      const newStagesCleared = teamState.stagesCleared + 1;

      // Update Subsystems for winning rocket based on newStagesCleared (1 to 5)
      let updatedShip: Spacecraft3DState = { ...ship };

      if (newStagesCleared === 1) {
        // Step 1: Avionics Online, Welding active
        updatedShip.stage1StructureDone = true;
        updatedShip.cockpitGlowIntensity = 1.0;
        updatedShip.serviceArmsAngle = 0.1;
        updatedShip.isWeldingActive = true;
      } else if (newStagesCleared === 2) {
        // Step 2: Cryo Fuel 100%, Umbilicals locked, Welding active
        updatedShip.stage2FuelDone = true;
        updatedShip.fuelTankPercent = 100;
        updatedShip.fuelArmConnected = true;
        updatedShip.ventingVapor = false;
        updatedShip.isWeldingActive = true;
      } else if (newStagesCleared === 3) {
        // Step 3: Propulsion Locked -> WELDING STOPS & WORKERS EVACUATE!
        updatedShip.stage3EngineDone = true;
        updatedShip.engineGlowIntensity = 1.0;
        updatedShip.isWeldingActive = false;
        soundManager.play('powerup');
      } else if (newStagesCleared === 4) {
        // Step 4: Guidance Locked -> BRAKES LOOSEN & GREEN SIGNAL BEACON ACTIVATES!
        updatedShip.stage4NavDone = true;
        updatedShip.antennaDeployed = true;
        updatedShip.gimbalPitchAngle = 0.08;
        updatedShip.brakesReleased = true;
        updatedShip.greenSignalActive = true;
        updatedShip.serviceArmsAngle = 0.8;
        updatedShip.isWeldingActive = false;

        // Play authentic brakes loosening pneumatic release sound and green signal chime
        soundManager.playBrakesRelease();
        setTimeout(() => {
          soundManager.playGreenSignalChime();
        }, 350);
      } else if (newStagesCleared >= 5) {
        // Step 5: Final Armed -> CLAMPS RELEASED & READY FOR LIFTOFF!
        updatedShip.stage5Armed = true;
        updatedShip.serviceArmsAngle = 1.0;
        updatedShip.clampsReleased = true;
        updatedShip.brakesReleased = true;
        updatedShip.greenSignalActive = true;
        updatedShip.isWeldingActive = false;
      }

      set({
        [key]: {
          ...teamState,
          isLocked: true,
          lastResult: 'correct',
          score: teamState.score + pointsGained,
          stageScore: pointsGained,
          streak: newStreak,
          stagesCleared: newStagesCleared,
          lastScoreGained: pointsGained,
          lastFeedback: {
            message: `✅ CORRECT! +${pointsGained} PTS (${newStagesCleared}/5 STAGES)`,
            isCorrect: true,
            pointsEarned: pointsGained,
          },
        },
        [otherKey]: {
          ...otherTeamState,
          isLocked: true, // Claimed by first correct team
        },
        [shipKey]: updatedShip,
        timerActive: false,
        toastMessage: `🎉 ${teamState.name} CLEARED STAGE ${newStagesCleared}/5! (+${pointsGained} PTS)`,
      });

      // Check WIN CONDITION: If team reaches 5 correct answers, THEY WIN & LAUNCH!
      if (newStagesCleared >= 5) {
        clearAutoAdvance();
        autoAdvanceTimer = setTimeout(() => {
          set({ winnerTeam: team });
          get().run12StepCinematicLaunch(team);
        }, 1200);
      } else {
        // Match continues with the next question in the pool until a team reaches 5!
        clearAutoAdvance();
        autoAdvanceTimer = setTimeout(() => {
          get().advanceToNextStage();
        }, 1800);
      }
    } else {
      // ── WRONG ANSWER: ATTEMPTS & REBOUND OPPORTUNITY ──
      soundManager.playWrong();

      if (teamState.attemptsLeft > 1) {
        // 1st Mistake: Allow 1 Retry
        set({
          [key]: {
            ...teamState,
            attemptsLeft: 1,
            selectedAnswer: null,
            isLocked: false,
            lastFeedback: {
              message: '⚠️ INCORRECT — 1 TRY REMAINING!',
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `⚠️ ${teamState.name} INCORRECT — 1 ATTEMPT REMAINING!`,
        });
      } else {
        // 2nd Mistake: Full Lockout & Rebound Opportunity for 2nd Team
        set({
          [key]: {
            ...teamState,
            attemptsLeft: 0,
            isLocked: true,
            lastResult: 'wrong',
            lastFeedback: {
              message: '❌ WRONG ANSWER — LOCKED OUT',
              isCorrect: false,
              pointsEarned: 0,
            },
          },
          toastMessage: `❌ ${teamState.name} LOCKED OUT! ${otherTeamState.name} CAN REBOUND!`,
        });

        // If both teams exhausted turns, advance to next question in pool
        if (otherTeamState.isLocked) {
          const correctOpt =
            ch.options.find(
              (o) =>
                String(o.value).trim().toLowerCase() ===
                String(ch.correctAnswer).trim().toLowerCase()
            )?.label || String(ch.correctAnswer);

          set({
            timerActive: false,
            toastMessage: `❌ BOTH TEAMS LOCKED OUT! Correct: ${correctOpt}`,
          });

          clearAutoAdvance();
          autoAdvanceTimer = setTimeout(() => {
            get().advanceToNextStage();
          }, 2000);
        }
      }
    }
  },

  handleTimerExpired: () => {
    const state = get();
    if (state.phase !== 'active-mission') return;

    soundManager.playWrong();
    const ch = state.activeChallenge;
    const correctOpt =
      ch.options.find(
        (o) =>
          String(o.value).trim().toLowerCase() ===
          String(ch.correctAnswer).trim().toLowerCase()
      )?.label || String(ch.correctAnswer);

    set({
      timerActive: false,
      toastMessage: `⏱️ TIME EXPIRED! Correct Answer: ${correctOpt}`,
    });

    clearAutoAdvance();
    autoAdvanceTimer = setTimeout(() => {
      get().advanceToNextStage();
    }, 2000);
  },

  advanceToNextStage: () => {
    clearAutoAdvance();
    const { campaign, questionPoolIndex, blueTeam, redTeam } = get();

    // Check if either team has achieved 5 correct answers
    if (blueTeam.stagesCleared >= 5) {
      set({ winnerTeam: 'blue' });
      get().run12StepCinematicLaunch('blue');
      return;
    }
    if (redTeam.stagesCleared >= 5) {
      set({ winnerTeam: 'red' });
      get().run12StepCinematicLaunch('red');
      return;
    }

    // Advance to the next question in the 100+ dynamic pool
    const nextPoolIdx = questionPoolIndex + 1;
    const nextChallenge =
      campaign.challenges[nextPoolIdx % campaign.challenges.length];
    const stageIdx = (nextChallenge.stageIndex ?? (nextPoolIdx % 5)) as StageIndex;

    set((s) => ({
      questionPoolIndex: nextPoolIdx,
      currentStageIndex: stageIdx,
      activeChallenge: nextChallenge,
      timeRemaining: nextChallenge.timeLimit,
      timerActive: true,
      toastMessage: `🚀 Q${nextPoolIdx + 1}: ${nextChallenge.stageTitle} (${blueTeam.stagesCleared}/5 vs ${redTeam.stagesCleared}/5)`,
      cameraTarget: 'overview',
      blueTeam: resetTeamForQuestion(s.blueTeam),
      redTeam: resetTeamForQuestion(s.redTeam),
    }));
  },

  // --------------------------------------------------------------------------
  // 12-STEP SINGLE-ROCKET CINEMATIC LIFTOFF SEQUENCER
  // Only the winning team's rocket launches while the other remains parked!
  // --------------------------------------------------------------------------
  run12StepCinematicLaunch: (winner) => {
    clearLaunchInterval();
    clearAutoAdvance();

    // Ensure winner is strictly 'blue' or 'red'
    const finalWinner: TeamId = winner === 'red' ? 'red' : 'blue';
    const winnerName =
      finalWinner === 'red' ? get().redTeam.name : get().blueTeam.name;

    set({
      phase: 'launch-cinematic',
      cameraTarget: 'hero-launch',
      timerActive: false,
      winnerTeam: finalWinner,
      toastMessage: `🏆 ${winnerName} WON THE MISSION! INITIATING LIFTOFF!`,
    });

    const steps: LaunchStep[] = [
      'arming',
      'hazard-lights',
      'umbilical-retract',
      'fuel-decouple',
      'clamp-release',
      'ignition',
      'thrust-ramp',
      'liftoff',
      'tower-clear',
      'sky-ascent',
      'cloud-entry',
      'orbital-insertion',
      'complete',
    ];

    let stepIdx = 0;

    launchInterval = setInterval(() => {
      if (stepIdx >= steps.length) {
        clearLaunchInterval();
        set({
          phase: 'mission-report',
          cameraTarget: 'overview',
          toastMessage: `🏆 MISSION SUCCESSFUL! ${winnerName} IS THE CHAMPION!`,
        });
        soundManager.playVictoryFanfare();
        return;
      }

      const currentStep = steps[stepIdx];
      stepIdx++;

      // Trigger Authentic Sound Synthesis Per Step
      if (currentStep === 'arming') soundManager.play('alarm');
      if (currentStep === 'hazard-lights') soundManager.playRocketSirens();
      if (currentStep === 'umbilical-retract') soundManager.playVaultGear();
      if (currentStep === 'clamp-release') soundManager.playVaultGear();
      if (currentStep === 'ignition') soundManager.playRocketIgnition();
      if (currentStep === 'thrust-ramp') soundManager.playRocketThrustRamp();
      if (currentStep === 'liftoff') soundManager.playRocketLiftoff();
      if (currentStep === 'complete') soundManager.playVictoryFanfare();

      set((s) => {
        // Function to update the winning hero spacecraft
        const updateHeroShip = (ship: Spacecraft3DState): Spacecraft3DState => {
          let alt = ship.altitude;
          let flame = ship.exhaustFlameScale;
          let smoke = ship.smokeVolume;
          let arms = ship.serviceArmsAngle;
          let flags = 2.0;

          if (currentStep === 'umbilical-retract') arms = 0.5;
          if (currentStep === 'clamp-release') arms = 1.0;
          if (currentStep === 'ignition') {
            flame = 0.9;
            smoke = 1.2;
          }
          if (currentStep === 'thrust-ramp') {
            flame = 1.8;
            smoke = 2.4;
          }
          if (currentStep === 'liftoff') {
            alt = 2.8;
            flame = 2.2;
            smoke = 3.0;
          }
          if (currentStep === 'tower-clear') {
            alt = 11.5;
            flame = 2.5;
            smoke = 2.2;
          }
          if (currentStep === 'sky-ascent') {
            alt = 34.0;
            flame = 2.7;
            smoke = 1.6;
          }
          if (currentStep === 'cloud-entry') {
            alt = 72.0;
            flame = 2.8;
            smoke = 0.9;
          }
          if (currentStep === 'orbital-insertion') {
            alt = 135.0;
            flame = 1.8;
            smoke = 0.3;
          }

          return {
            ...ship,
            launchStage: currentStep,
            altitude: alt,
            exhaustFlameScale: flame,
            smokeVolume: smoke,
            serviceArmsAngle: arms,
            flagProminence: flags,
            clampsReleased: true,
          };
        };

        // Parked losing rocket remains completely still on pad
        const parkedShip = (ship: Spacecraft3DState): Spacecraft3DState => ({
          ...ship,
          launchStage: 'idle',
          altitude: 0,
          exhaustFlameScale: 0,
          smokeVolume: 0,
          clampsReleased: false,
        });

        if (finalWinner === 'blue') {
          return {
            blueSpacecraft: updateHeroShip(s.blueSpacecraft),
            redSpacecraft: parkedShip(s.redSpacecraft),
          };
        } else {
          return {
            blueSpacecraft: parkedShip(s.blueSpacecraft),
            redSpacecraft: updateHeroShip(s.redSpacecraft),
          };
        }
      });
    }, 1450);
  },

  setTimeRemaining: (t) => set({ timeRemaining: t }),
  setTimerActive: (active) => set({ timerActive: active }),

  toggleMute: () => {
    const muted = soundManager.toggleMute();
    set({ isMuted: muted });
  },

  clearToast: () => set({ toastMessage: null }),
}));
