// ============================================================
// SKILLIZEE ARCADE — Cross-Game Initial Boost Persistence Engine
// When any team wins a game in the arcade (Math Vault, Railway, Carnival, Blueprint, Equation Mission Control),
// that winning team earns an "Initial Boost" for the NEXT activity:
// - They start with +1 Correct Answer / +1 Step Ahead already in the bag.
// - Celebratory UI banner/toast notifies students of their head start advantage.
// ============================================================

export interface InitialBoostRecord {
  winnerId: 'blue' | 'red';
  winnerName: string;
  gameTitle: string;
  timestamp: number;
}

const STORAGE_KEY = 'skillizee_arcade_initial_boost_v1';

export const initialBoostManager = {
  /**
   * Records the winner of a completed game so they receive an Initial Boost in the next activity.
   */
  recordWinner: (winnerId: 'blue' | 'red', winnerName: string, gameTitle: string) => {
    if (typeof window === 'undefined') return;
    try {
      const record: InitialBoostRecord = {
        winnerId,
        winnerName: winnerName || (winnerId === 'blue' ? 'Team Blue' : 'Team Red'),
        gameTitle,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (err) {
      console.warn('Unable to persist initial boost:', err);
    }
  },

  /**
   * Retrieves the current initial boost recipient if active.
   */
  getBoost: (): InitialBoostRecord | null => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: InitialBoostRecord = JSON.parse(raw);
      if (parsed && (parsed.winnerId === 'blue' || parsed.winnerId === 'red')) {
        return parsed;
      }
    } catch {
      return null;
    }
    return null;
  },

  /**
   * Checks if a specific team ('blue' | 'red') has the initial boost advantage.
   */
  hasBoost: (teamId: 'blue' | 'red'): boolean => {
    const boost = initialBoostManager.getBoost();
    return boost?.winnerId === teamId;
  },

  /**
   * Clears the current boost record.
   */
  clearBoost: () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  },
};
