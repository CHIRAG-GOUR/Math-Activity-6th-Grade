// ============================================================
// THE SOLAR FORGE: Zustand State Store
// Orchestrates Blue & Red Team Facilities, Physical Heliostat Motors,
// Moving Sun in Sky, Interactive Sundial, Sunlight Beam Propagation,
// and Central Solar Forge Turbine & Molten Core Activation
// ============================================================

import { create } from 'zustand';
import * as THREE from 'three';
import {
  TeamId,
  TeamFacilityState,
  CentralSolarForgeState,
  SunState,
  SundialState,
  SolarForgePhase,
  AngleClassification,
  HeliostatMirrorState,
  ReceiverTowerState,
} from '../types';
import { createSolarQuestionSet } from '../data/questions';
import { solarAudio } from '../audio/solarAudio';

// Initial heliostat configurations for each team
function createInitialMirrors(team: TeamId): HeliostatMirrorState[] {
  const isBlue = team === 'blue';
  const xBase = isBlue ? -24 : 24;

  return [
    {
      id: `${team}-mirror-0`,
      position: [xBase, 0, -6],
      azimuthDeg: 25,
      elevationDeg: 30,
      targetAzimuthDeg: 25,
      targetElevationDeg: 30,
      isActive: false,
      isLockedOnTarget: false,
      reflectionVector: [isBlue ? 0.6 : -0.6, 0.5, -0.6],
    },
    {
      id: `${team}-mirror-1`,
      position: [xBase + (isBlue ? -8 : 8), 0, -18],
      azimuthDeg: 40,
      elevationDeg: 35,
      targetAzimuthDeg: 40,
      targetElevationDeg: 35,
      isActive: false,
      isLockedOnTarget: false,
      reflectionVector: [isBlue ? 0.7 : -0.7, 0.4, -0.5],
    },
    {
      id: `${team}-mirror-2`,
      position: [xBase + (isBlue ? 6 : -6), 0, -28],
      azimuthDeg: 55,
      elevationDeg: 40,
      targetAzimuthDeg: 55,
      targetElevationDeg: 40,
      isActive: false,
      isLockedOnTarget: false,
      reflectionVector: [isBlue ? 0.5 : -0.5, 0.6, -0.6],
    },
  ];
}

function createInitialReceiver(team: TeamId): ReceiverTowerState {
  const isBlue = team === 'blue';
  return {
    id: `${team}-receiver-tower`,
    position: [isBlue ? -15 : 15, 0, -14],
    powerLevel: 0,
    isActive: false,
    isStruckByBeam: false,
    temperatureKelvin: 310,
  };
}

function createInitialTeamState(team: TeamId): TeamFacilityState {
  const questions = createSolarQuestionSet(5);
  return {
    teamId: team,
    teamName: team === 'blue' ? 'BLUE HELIO SQUADRON' : 'RED SOLAR CORPS',
    energyMegawatts: 0,
    activeSubsystems: 0,
    streakCount: 0,
    currentRound: 1,
    currentQuestionIndex: 0,
    currentQuestion: questions[0] || null,
    questions,
    selectedClassification: null,
    instrumentAngle: 0,
    isProtractorLocked: false,
    isRotatingMirror: false,
    lastFeedback: 'idle',
    feedbackMessage: 'Awaiting telemetry alignment...',
    constructionState: {
      type: 'none',
      vertex: [0, 0],
      rayA: [1, 0],
      rayB: [0.7, 0.7],
      compassRadius: 50,
      placedArcs: [],
      constructedLineAngle: 0,
      isCompleted: false,
    },
    mirrors: createInitialMirrors(team),
    receiver: createInitialReceiver(team),
  };
}

const SUN_ROUNDS_POSITION: Record<
  number,
  { elev: number; azim: number; time: string; worldPos: [number, number, number] }
> = {
  1: { elev: 28, azim: 120, time: '09:00 AM', worldPos: [-38, 48, -85] }, // Crisp summer morning (East)
  2: { elev: 46, azim: 148, time: '10:30 AM', worldPos: [-18, 62, -88] }, // Mid-morning sun
  3: { elev: 68, azim: 180, time: '12:00 PM', worldPos: [0, 76, -92] },   // High noon overhead (Solar Noon)
  4: { elev: 48, azim: 220, time: '02:30 PM', worldPos: [20, 64, -88] },  // Warm summer afternoon
  5: { elev: 30, azim: 250, time: '04:30 PM', worldPos: [38, 50, -85] },  // Golden late afternoon (West)
};

function getSunStateForRound(round: number): SunState {
  const data = SUN_ROUNDS_POSITION[round] || SUN_ROUNDS_POSITION[1];
  const [x, y, z] = data.worldPos;

  // Direction vector from sky towards facility center [0, 0, -12]
  const dir = new THREE.Vector3(0 - x, 0 - y, -12 - z).normalize();

  return {
    elevationDeg: data.elev,
    azimuthDeg: data.azim,
    worldPosition: [x, y, z],
    directionVector: [dir.x, dir.y, dir.z],
    timeString: data.time,
  };
}

interface SolarForgeStore {
  gamePhase: SolarForgePhase;
  blue: TeamFacilityState;
  red: TeamFacilityState;
  solarForge: CentralSolarForgeState;
  sun: SunState;
  sundial: SundialState;
  questionsPerTeam: number;

  // Game Controls
  startForgeChallenge: () => void;
  selectClassification: (team: TeamId, classification: AngleClassification) => void;
  setInstrumentAngle: (team: TeamId, angle: number) => void;
  setConstructionBisector: (team: TeamId, bisectorAngle: number) => void;
  completeConstruction: (team: TeamId) => void;
  submitAnswer: (team: TeamId) => void;
  advanceQuestion: (team: TeamId) => void;
  restartChallenge: () => void;
}

export const useSolarForgeStore = create<SolarForgeStore>((set, get) => ({
  gamePhase: 'briefing',
  blue: createInitialTeamState('blue'),
  red: createInitialTeamState('red'),
  solarForge: {
    powerLevel: 0,
    turbineRPM: 0,
    moltenCoreTemperature: 280,
    ringRotationSpeed: 0.1,
    isBlueBeamConnected: false,
    isRedBeamConnected: false,
    isFullyOperational: false,
  },
  sun: getSunStateForRound(1),
  sundial: {
    position: [0, 0, 8],
    shadowAngleDeg: 120 - 180, // Shadow points opposite to 120° morning sun (-60°)
    shadowLength: 2.6,
    gnomonHeight: 1.4,
    interactiveDialAngle: 0,
    isCalibrated: true,
  },
  questionsPerTeam: 5,

  startForgeChallenge: () => {
    set({ gamePhase: 'forging' });
    try {
      solarAudio.startSolarBGM(0.30);
      solarAudio.startFacilityAmbience();
      solarAudio.playReceiverPowerUp();
    } catch (e) {
      console.warn('Audio init error:', e);
    }
  },

  selectClassification: (team: TeamId, classification: AngleClassification) => {
    solarAudio.playDialClick();
    set((state) => ({
      [team]: {
        ...state[team],
        selectedClassification: classification,
      },
    }));
  },

  setInstrumentAngle: (team: TeamId, angle: number) => {
    const normalized = Math.round(((angle % 360) + 360) % 360);
    solarAudio.playDialClick();
    set((state) => ({
      [team]: {
        ...state[team],
        instrumentAngle: normalized,
        lastFeedback: 'idle',
      },
    }));
  },

  setConstructionBisector: (team: TeamId, bisectorAngle: number) => {
    solarAudio.playGeometrySnap();
    set((state) => ({
      [team]: {
        ...state[team],
        instrumentAngle: bisectorAngle,
        constructionState: {
          ...state[team].constructionState,
          constructedLineAngle: bisectorAngle,
          isCompleted: true,
        },
      },
    }));
  },

  completeConstruction: (team: TeamId) => {
    get().submitAnswer(team);
  },

  submitAnswer: (team: TeamId) => {
    const teamState = get()[team];
    const q = teamState.currentQuestion;
    if (!q) return;

    let isCorrect = false;

    if (q.category === 'classify_angles') {
      isCorrect = teamState.selectedClassification === q.angleClassification;
    } else {
      const diff = Math.abs(teamState.instrumentAngle - q.targetAngle);
      const circularDiff = Math.min(diff, 360 - diff);
      isCorrect = circularDiff <= q.toleranceDeg;
    }

    if (isCorrect) {
      // 1. Audio: Servo motor rotating + beam focus chime
      solarAudio.playServoMotor();
      setTimeout(() => solarAudio.playBeamFocus(), 400);
      setTimeout(() => solarAudio.playReceiverPowerUp(), 800);

      // 2. Physical Mirror & Beam Reaction
      const mirrorIdx = q.physicalTarget.mirrorIndex;
      const updatedMirrors = teamState.mirrors.map((m, idx) => {
        if (idx === mirrorIdx) {
          return {
            ...m,
            targetAzimuthDeg: q.physicalTarget.targetAzimuth,
            targetElevationDeg: q.physicalTarget.targetElevation,
            isActive: true,
            isLockedOnTarget: true,
          };
        }
        return m;
      });

      const nextSubsystems = Math.min(5, teamState.activeSubsystems + 1);
      const energyGained = 150 + q.round * 45 + teamState.streakCount * 25;
      const isForgeRound = q.round >= 5;

      // Update team state and central Forge power
      set((state) => {
        const otherTeam: TeamId = team === 'blue' ? 'red' : 'blue';
        const otherState = state[otherTeam];

        const updatedForge: CentralSolarForgeState = {
          ...state.solarForge,
          powerLevel: Math.min(100, state.solarForge.powerLevel + 20),
          turbineRPM: state.solarForge.turbineRPM + 600,
          moltenCoreTemperature: state.solarForge.moltenCoreTemperature + 120,
          ringRotationSpeed: state.solarForge.ringRotationSpeed + 0.35,
          isBlueBeamConnected: team === 'blue' ? true : state.solarForge.isBlueBeamConnected,
          isRedBeamConnected: team === 'red' ? true : state.solarForge.isRedBeamConnected,
          isFullyOperational: (state.solarForge.powerLevel + 20) >= 100 || (isForgeRound && otherState.currentRound >= 5),
        };

        return {
          solarForge: updatedForge,
          [team]: {
            ...state[team],
            energyMegawatts: state[team].energyMegawatts + energyGained,
            activeSubsystems: nextSubsystems,
            streakCount: state[team].streakCount + 1,
            isRotatingMirror: true,
            mirrors: updatedMirrors,
            lastFeedback: 'beam_aligned',
            feedbackMessage: `TARGET LOCKED! ${q.physicalTarget.conduitEffect}`,
            receiver: {
              ...state[team].receiver,
              isActive: true,
              isStruckByBeam: true,
              powerLevel: Math.min(100, state[team].receiver.powerLevel + 25),
              temperatureKelvin: state[team].receiver.temperatureKelvin + 140,
            },
          },
        };
      });

      // After mechanical alignment animation finishes:
      setTimeout(() => {
        set((state) => ({
          [team]: {
            ...state[team],
            isRotatingMirror: false,
            lastFeedback: 'power_up',
          },
        }));

        // Advance to next question after 3.2s of physical payoff
        setTimeout(() => {
          get().advanceQuestion(team);
        }, 3200);
      }, 1200);
    } else {
      solarAudio.playOffTarget();
      set((state) => ({
        [team]: {
          ...state[team],
          streakCount: 0,
          lastFeedback: 'off_target',
          feedbackMessage:
            q.category === 'classify_angles'
              ? `MISALIGNMENT: Re-examine the angle opening to determine classification.`
              : `SEARCH ANGLE OFF TARGET (${teamState.instrumentAngle}°). Expected target near ${q.targetAngle}°.`,
        },
      }));
    }
  },

  advanceQuestion: (team: TeamId) => {
    const teamState = get()[team];
    const nextIdx = teamState.currentQuestionIndex + 1;

    if (nextIdx >= teamState.questions.length) {
      const otherTeam: TeamId = team === 'blue' ? 'red' : 'blue';
      const otherState = get()[otherTeam];
      const otherDone = otherState.currentQuestionIndex >= otherState.questions.length - 1;

      if (otherDone || get().solarForge.powerLevel >= 90) {
        solarAudio.playSolarForgeIgnition();
        set({ gamePhase: 'cinematic_activation' });
      }
      return;
    }

    const nextQ = teamState.questions[nextIdx];
    const nextRound = nextQ.round;

    // Update sun position according to round
    const nextSun = getSunStateForRound(nextRound);
    const nextShadowAngle = nextSun.azimuthDeg - 180;

    set((state) => ({
      sun: nextSun,
      sundial: {
        ...state.sundial,
        shadowAngleDeg: nextShadowAngle,
        shadowLength: Math.max(1.8, Math.min(3.6, 1.4 / Math.tan((nextSun.elevationDeg * Math.PI) / 180))),
      },
      [team]: {
        ...state[team],
        currentQuestionIndex: nextIdx,
        currentQuestion: nextQ,
        currentRound: nextRound,
        instrumentAngle: 0,
        selectedClassification: null,
        isProtractorLocked: false,
        isRotatingMirror: false,
        lastFeedback: 'idle',
        feedbackMessage: `STATION ${nextRound} ACTIVE: ${nextQ.title}`,
        constructionState: {
          type: nextQ.category === 'constructions' ? 'angle_bisector' : 'none',
          vertex: [0, 0],
          rayA: [1, 0],
          rayB: [0.8, 0.6],
          compassRadius: 45,
          placedArcs: [],
          constructedLineAngle: 0,
          isCompleted: false,
        },
      },
    }));
  },

  restartChallenge: () => {
    set({
      gamePhase: 'briefing',
      blue: createInitialTeamState('blue'),
      red: createInitialTeamState('red'),
      solarForge: {
        powerLevel: 0,
        turbineRPM: 0,
        moltenCoreTemperature: 280,
        ringRotationSpeed: 0.1,
        isBlueBeamConnected: false,
        isRedBeamConnected: false,
        isFullyOperational: false,
      },
      sun: getSunStateForRound(1),
    });
  },
}));
