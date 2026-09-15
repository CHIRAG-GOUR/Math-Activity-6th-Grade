// ============================================================
// THE DECIMAL DELIVERY NETWORK — SHARED TYPES
//
// Two competing parcel depots. Blue operates the LEFT side of the facility,
// Red the RIGHT; they share the central logistics hub. Everything either team
// does is independent — separate orders, separate answers, separate balances —
// so one player can never block the other.
// ============================================================

export type TeamId = 'blue' | 'red';

export type RoundNumber = 1 | 2 | 3 | 4 | 5;

/** Overall match flow. */
export type GamePhase =
  | 'intro'              // establishing fly-through + title
  | 'round_intro'        // "ROUND 2 — PRECISION SORTING" beat
  | 'operating'          // normal play: both teams processing orders
  | 'round_complete'
  | 'final_results'
  | 'tie_breaker'
  | 'dispatch_showdown'  // winning truck physically leaves
  | 'game_complete';

/** What kind of decimal work an order demands. */
export type QuestionKind =
  | 'decimal_add'
  | 'decimal_subtract'
  | 'decimal_compare'      // which is heavier/larger -> answer is the value
  | 'decimal_order'        // pick the correct sorting lane (1-4)
  | 'money_total'
  | 'money_change'
  | 'weight_total'
  | 'distance_total'
  | 'quantity_multiply'    // n x decimal
  | 'scale_up'             // x10 / x100 / x1000
  | 'scale_down'           // /10 / /100 / /1000
  | 'multi_step';          // round 5 master orders

export type Difficulty = 'easy' | 'medium' | 'hard' | 'master';

/** Parcel silhouettes. Deliberately varied — never one cube for everything. */
export type PackageShape =
  | 'small_box'
  | 'large_box'
  | 'long_parcel'
  | 'flat_parcel'
  | 'tube'
  | 'crate'
  | 'envelope'
  | 'fragile';

export interface Destination {
  code: string;      // "CTR-01"
  name: string;      // "CITY CENTER"
  /** Distance in km, used by distance questions and the shipping label. */
  distanceKm: number;
}

/**
 * A single delivery order. This is both the maths question and the physical
 * parcel — the two are the same object by design, so the label on the box in
 * the 3D world always matches the problem on the console.
 */
export interface DeliveryOrder {
  id: string;
  round: RoundNumber;
  kind: QuestionKind;
  difficulty: Difficulty;

  /** Shown on the console above the keypad. */
  prompt: string;
  /** Short line explaining the operation after a correct answer. */
  explanation: string;
  /** Rows rendered on the shipping label / order card. */
  labelRows: { label: string; value: string }[];

  /** The numbers the question is built from, for display and for machines. */
  values: number[];
  /** Canonical answer. Compared with a tolerance, never with ===. */
  correctAnswer: number;
  /** How many decimal places the answer should have. Drives input validation. */
  decimals: number;
  /** Unit suffix for display: "kg", "km", "" for money (prefix handled in UI). */
  unit: string;
  /** True when the answer is a rupee amount, so the UI prefixes the symbol. */
  isMoney: boolean;

  /** Sorting-lane questions answer with a lane number rather than a value. */
  laneOptions?: number[];

  reward: number;
  shape: PackageShape;
  destination: Destination;
  /** Parcel weight in kg. Decides handling: 1 worker, 2 workers or forklift. */
  weightKg: number;
  /**
   * When the answer IS the parcel's weight, the scale must stay blank while
   * the question is live — otherwise it would display the answer.
   */
  hideScale: boolean;
}

// Live parcel, lane and team runtime types live next to the code that owns
// them: engine/depotSim.ts (physical parcels, carriers, lanes) and
// store/depotStore.ts (per-lane orders, attempts, balances).

export interface MatchResult {
  winner: TeamId | 'tie';
  blueBalance: number;
  redBalance: number;
}
