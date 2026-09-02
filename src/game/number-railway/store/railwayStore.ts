// ============================================================
// THE GREAT NUMBER RAILWAY — Zustand Game Store
// Separate state for each team, railway world, and trains
// ============================================================

import { create } from 'zustand';
import {
  RailwayGameState,
  TeamState,
  TeamId,
  TrainAnimState,
  GamePhase,
  SignalState,
  StationDef,
  TrackSegment,
  JunctionDef,
} from '../types';
import { RAILWAY_CHALLENGES } from '../engine/challenges';

// ── Default team state ──
const createTeamState = (id: TeamId): TeamState => ({
  id,
  name: id === 'blue' ? 'BLUE ENGINEERS' : 'RED ENGINEERS',
  score: 0,
  streak: 0,
  routesCompleted: 0,
  deliveriesCount: 0,
  currentAnswer: null,
  isLockedIn: false,
  hasAnswered: false,
  isCorrect: null,
  lastFeedback: null,
  attemptsOnCurrent: 0,
  canSteal: false,
});

// ── Default train state ──
const createTrainState = (): TrainAnimState => ({
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  progress: 0,
  speed: 0,
  state: 'idle',
  currentTrackId: null,
  wheelRotation: 0,
  smokeActive: false,
});

// ── Default stations ──
const DEFAULT_STATIONS: Record<string, StationDef> = {
  central: {
    id: 'central',
    name: 'Central Station',
    position: [0, 0, 0],
    type: 'central',
    active: true,
  },
  'north-terminal': {
    id: 'north-terminal',
    name: 'North Terminal',
    position: [0, 0, -20],
    type: 'passenger',
    active: false,
  },
  'east-depot': {
    id: 'east-depot',
    name: 'East Cargo Depot',
    position: [18, 0, -5],
    type: 'cargo',
    active: false,
  },
  'south-yard': {
    id: 'south-yard',
    name: 'South Yard',
    position: [-5, 0, 18],
    type: 'maintenance',
    active: false,
  },
};

// ── Default tracks ──
const DEFAULT_TRACKS: Record<string, TrackSegment> = {
  'track-central-north': {
    id: 'track-central-north',
    from: 'central',
    to: 'north-terminal',
    controlPoints: [
      [0, 0.1, 0],
      [-2, 0.1, -6],
      [1, 0.1, -13],
      [0, 0.1, -20],
    ],
    hasBridge: true,
    active: false,
  },
  'track-central-east': {
    id: 'track-central-east',
    from: 'central',
    to: 'east-depot',
    controlPoints: [
      [0, 0.1, 0],
      [5, 0.1, -1],
      [12, 0.1, -3],
      [18, 0.1, -5],
    ],
    hasTunnel: true,
    active: false,
  },
  'track-central-south': {
    id: 'track-central-south',
    from: 'central',
    to: 'south-yard',
    controlPoints: [
      [0, 0.1, 0],
      [-2, 0.1, 6],
      [-4, 0.1, 12],
      [-5, 0.1, 18],
    ],
    active: false,
  },
};

// ── Default junctions ──
const DEFAULT_JUNCTIONS: Record<string, JunctionDef> = {
  'junction-1': {
    id: 'junction-1',
    position: [0, 0.1, -3],
    trackA: 'track-central-north',
    trackB: 'track-central-east',
    currentRoute: 'A',
  },
};

// ── Default signals ──
const DEFAULT_SIGNALS: Record<string, SignalState> = {
  'signal-north': 'red',
  'signal-east': 'red',
  'signal-south': 'red',
};

interface RailwayStoreActions {
  // Phase
  setPhase: (phase: GamePhase) => void;
  startGame: () => void;

  // Team answers
  setTeamAnswer: (team: TeamId, answer: number | string) => void;
  lockInTeam: (team: TeamId) => void;
  evaluateTeam: (team: TeamId) => void;
  resetTeamAnswers: () => void;

  // Railway world
  setSignal: (signalId: string, state: SignalState) => void;
  setSwitchRoute: (junctionId: string, route: 'A' | 'B') => void;
  activateStation: (stationId: string) => void;
  activateTrack: (trackId: string) => void;

  // Train
  startTrainJourney: (team: TeamId, trackId: string) => void;
  setTrainProgress: (team: TeamId, progress: number) => void;
  completeTrainJourney: (team: TeamId) => void;

  // Challenge progression
  nextMission: () => void;
  
  // Audio
  toggleMute: () => void;

  // Timer
  setTimeRemaining: (t: number) => void;
  setTimerActive: (active: boolean) => void;

  // Steal
  enableSteal: (team: TeamId) => void;
  disableSteal: () => void;
}

export type RailwayStore = RailwayGameState & RailwayStoreActions;

export const useRailwayStore = create<RailwayStore>((set, get) => ({
  // ── Initial state ──
  phase: 'title',
  currentMission: 0,
  totalMissions: RAILWAY_CHALLENGES.length,
  challenges: RAILWAY_CHALLENGES,
  activeChallenge: null,

  blueTeam: createTeamState('blue'),
  redTeam: createTeamState('red'),

  stations: DEFAULT_STATIONS,
  tracks: DEFAULT_TRACKS,
  junctions: DEFAULT_JUNCTIONS,
  signals: DEFAULT_SIGNALS,

  blueTrain: createTrainState(),
  redTrain: createTrainState(),

  networkProgress: 0,
  unlockedRoutes: [],

  isMuted: false,

  timeRemaining: 0,
  timerActive: false,

  // ── Actions ──
  setPhase: (phase) => set({ phase }),

  startGame: () => {
    const challenges = get().challenges;
    set({
      phase: 'briefing',
      currentMission: 0,
      activeChallenge: challenges[0] || null,
      blueTeam: createTeamState('blue'),
      redTeam: createTeamState('red'),
      signals: { ...DEFAULT_SIGNALS },
      networkProgress: 0,
      unlockedRoutes: [],
      timeRemaining: challenges[0]?.timeLimit || 45,
      timerActive: false,
    });
  },

  setTeamAnswer: (team, answer) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    set((s) => ({
      [key]: { ...s[key], currentAnswer: answer },
    }));
  },

  lockInTeam: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    set((s) => ({
      [key]: { ...s[key], isLockedIn: true, hasAnswered: true },
    }));
  },

  evaluateTeam: (team) => {
    const state = get();
    const challenge = state.activeChallenge;
    if (!challenge) return;

    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    const teamState = state[key];
    const answer = teamState.currentAnswer;
    const isCorrect = answer !== null && challenge.validation(answer);

    const points = isCorrect ? challenge.points : 0;
    const newStreak = isCorrect ? teamState.streak + 1 : 0;

    set((s) => ({
      [key]: {
        ...s[key],
        isCorrect,
        score: s[key].score + points,
        streak: newStreak,
        routesCompleted: isCorrect ? s[key].routesCompleted + 1 : s[key].routesCompleted,
        deliveriesCount: isCorrect ? s[key].deliveriesCount + 1 : s[key].deliveriesCount,
        attemptsOnCurrent: s[key].attemptsOnCurrent + 1,
        lastFeedback: {
          message: isCorrect
            ? `Route confirmed! +${points} points`
            : challenge.hints[Math.min(s[key].attemptsOnCurrent, challenge.hints.length - 1)],
          isCorrect,
          pointsEarned: points,
        },
      },
    }));

    // If correct, activate railway
    if (isCorrect && challenge.railwayAction) {
      const action = challenge.railwayAction;
      if (action.signalId) {
        get().setSignal(action.signalId, 'green');
      }
      if (action.switchId && action.routeChoice) {
        get().setSwitchRoute(action.switchId, action.routeChoice);
      }
      if (action.trackSegmentId) {
        get().activateTrack(action.trackSegmentId);
      }
      if (action.destinationStation) {
        get().activateStation(action.destinationStation);
      }
    }
  },

  resetTeamAnswers: () => {
    set((s) => ({
      blueTeam: {
        ...s.blueTeam,
        currentAnswer: null,
        isLockedIn: false,
        hasAnswered: false,
        isCorrect: null,
        lastFeedback: null,
        attemptsOnCurrent: 0,
        canSteal: false,
      },
      redTeam: {
        ...s.redTeam,
        currentAnswer: null,
        isLockedIn: false,
        hasAnswered: false,
        isCorrect: null,
        lastFeedback: null,
        attemptsOnCurrent: 0,
        canSteal: false,
      },
    }));
  },

  setSignal: (signalId, state) => {
    set((s) => ({
      signals: { ...s.signals, [signalId]: state },
    }));
  },

  setSwitchRoute: (junctionId, route) => {
    set((s) => ({
      junctions: {
        ...s.junctions,
        [junctionId]: { ...s.junctions[junctionId], currentRoute: route },
      },
    }));
  },

  activateStation: (stationId) => {
    set((s) => ({
      stations: {
        ...s.stations,
        [stationId]: { ...s.stations[stationId], active: true },
      },
    }));
  },

  activateTrack: (trackId) => {
    set((s) => ({
      tracks: {
        ...s.tracks,
        [trackId]: { ...s.tracks[trackId], active: true },
      },
      unlockedRoutes: [...s.unlockedRoutes, trackId],
    }));
  },

  startTrainJourney: (team, trackId) => {
    const key = team === 'blue' ? 'blueTrain' : 'redTrain';
    set({
      [key]: {
        ...get()[key],
        state: 'departing' as const,
        currentTrackId: trackId,
        progress: 0,
        speed: 0,
        smokeActive: true,
      },
      phase: 'train-journey',
    });
  },

  setTrainProgress: (team, progress) => {
    const key = team === 'blue' ? 'blueTrain' : 'redTrain';
    set((s) => ({
      [key]: {
        ...s[key],
        progress: Math.min(1, progress),
        state: progress >= 0.95 ? 'approaching' : 'moving',
        speed: progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1,
      },
    }));
  },

  completeTrainJourney: (team) => {
    const key = team === 'blue' ? 'blueTrain' : 'redTrain';
    const state = get();
    const completedRoutes = state.unlockedRoutes.length;
    const totalTracks = Object.keys(state.tracks).length;

    set({
      [key]: {
        ...state[key],
        state: 'arrived' as const,
        progress: 1,
        speed: 0,
        smokeActive: false,
      },
      phase: 'delivery',
      networkProgress: Math.round((completedRoutes / totalTracks) * 100),
    });
  },

  nextMission: () => {
    const state = get();
    const next = state.currentMission + 1;

    if (next >= state.totalMissions) {
      set({ phase: 'network-complete' });
      return;
    }

    const nextChallenge = state.challenges[next];
    set({
      currentMission: next,
      activeChallenge: nextChallenge,
      phase: 'briefing',
      timeRemaining: nextChallenge.timeLimit,
      timerActive: false,
      blueTrain: createTrainState(),
      redTrain: createTrainState(),
    });
    get().resetTeamAnswers();
  },

  toggleMute: () => set((s) => ({ isMuted: !s.isMuted })),

  setTimeRemaining: (t) => set({ timeRemaining: Math.max(0, t) }),
  setTimerActive: (active) => set({ timerActive: active }),

  enableSteal: (team) => {
    const key = team === 'blue' ? 'blueTeam' : 'redTeam';
    set((s) => ({ [key]: { ...s[key], canSteal: true } }));
  },

  disableSteal: () => {
    set((s) => ({
      blueTeam: { ...s.blueTeam, canSteal: false },
      redTeam: { ...s.redTeam, canSteal: false },
    }));
  },
}));
