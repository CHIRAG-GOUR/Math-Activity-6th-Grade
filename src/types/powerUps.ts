// ============================================================
// SKILLIZEE ARCADE — Power-Ups & Competitive Enhancement Types
// Grade 6 Classroom Dynamics:
// 1. Tactical Power-ups (50:50, +10s Time Freeze, 2x Multiplier)
// 2. Comeback Surge (+25% score for trailing teams)
// 3. Sudden Death Tiebreaker ("Speed Duel" 15s rapid round)
// ============================================================

export type TeamId = 'blue' | 'red';

export interface TeamPowerUps {
  fiftyFifty: boolean;    // true = available, false = already used
  timeFreeze: boolean;    // true = available, false = already used
  doublePoints: boolean;  // true = available, false = already used
  active2x: boolean;      // true if 2x multiplier is armed for the CURRENT question
}

export const initialTeamPowerUps = (): TeamPowerUps => ({
  fiftyFifty: true,
  timeFreeze: true,
  doublePoints: true,
  active2x: false,
});

export interface SuddenDeathState {
  isActive: boolean;
  questionId: string | null;
  timeRemaining: number;
}
