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

/** Per-team station state. Each team owns its own copy. */
export type TeamPhase =
  | 'idle'          // waiting for an order to arrive
  | 'incoming'      // forklift/worker delivering the package
  | 'answering'     // package on the machine, keypad live
  | 'processing'    // correct answer accepted, machine running
  | 'loading';      // worker carrying package to the truck

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
  /** Parcel weight in kg, used by the scale and truck load. */
  weightKg: number;
}

/** A parcel physically present in the world. */
export interface LiveParcel {
  id: string;
  team: TeamId;
  shape: PackageShape;
  /** Progress 0..1 along the current leg of its journey. */
  progress: number;
  stage: ParcelStage;
  weightKg: number;
  /** Tint, derived from destination so lanes read consistently. */
  colorIndex: number;
}

export type ParcelStage =
  | 'arriving'      // forklift bringing it in
  | 'on_scale'      // sitting on the weighing platform
  | 'conveyor'      // travelling the belt after a correct answer
  | 'scanner'
  | 'to_truck'      // worker carrying it
  | 'loaded';

/** Independent per-team state. Nothing here is shared between the two. */
export interface TeamState {
  id: TeamId;
  name: string;
  phase: TeamPhase;

  currentOrder: DeliveryOrder | null;
  /** Raw keypad text, e.g. "4.5" — kept as a string so a trailing "." works. */
  input: string;
  /** Set briefly after a wrong submission, for the red indicator. */
  lastWrong: boolean;
  attempts: number;

  balance: number;
  ordersCompleted: number;
  /** 0..1 how full the truck looks. */
  truckLoad: number;
  /** Total kg loaded, shown on the dispatch terminal. */
  loadedWeight: number;

  /** Set when a reward animation should play. */
  rewardFlash: { amount: number; at: number } | null;
}

export interface MatchResult {
  winner: TeamId | 'tie';
  blueBalance: number;
  redBalance: number;
}
