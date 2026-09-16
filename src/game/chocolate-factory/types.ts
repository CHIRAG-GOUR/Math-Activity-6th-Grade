// ============================================================
// THE CHOCOLATE FACTORY — SHARED TYPES
// ============================================================

export type TeamId = 'blue' | 'red';
export type RoundNumber = 1 | 2 | 3 | 4 | 5;

export type GamePhase =
  | 'intro' | 'round_intro' | 'operating' | 'round_complete'
  | 'grand_finale' | 'final_results' | 'game_complete';

/** A fraction kept as an exact ratio — never collapsed to a float until display. */
export interface Fraction {
  num: number;
  den: number;
}

export type QuestionKind =
  | 'identify' | 'equivalent' | 'simplify' | 'compare' | 'order'
  | 'add' | 'subtract' | 'mixed_number' | 'improper'
  | 'of_quantity' | 'multiply' | 'word_problem';

export interface FractionQuestion {
  id: string;
  round: RoundNumber;
  kind: QuestionKind;
  /** Short mission/context line, e.g. the customer order this feeds. */
  context: string;
  /** The question itself. */
  prompt: string;
  /** Four answer choices, formatted for display (e.g. "3/4", "2 1/2"). */
  options: string[];
  correctIndex: number;
  /** The exact value the factory will physically produce, whichever option is picked. */
  optionValues: Fraction[];
  /** The customer this question was written for — the truck drives to them. */
  customerType: CustomerType;
  customerName: string;
  /** Value that should visually appear already-known (e.g. a shown fraction in the prompt). */
  hint?: string;
}

export type CustomerType = 'school' | 'cafe' | 'hotel' | 'supermarket' | 'shop' | 'festival';

export interface CustomerOrder {
  id: string;
  round: RoundNumber;
  customer: CustomerType;
  customerName: string;
  productName: string;
  /** Whole units the customer asked for, purely descriptive (e.g. "120 bars"). */
  units: number;
  question: FractionQuestion;
}

export type ProductionStage =
  | 'awaiting_question' | 'filling' | 'mixing' | 'molding' | 'cooling'
  | 'cutting' | 'quality_check' | 'packaging' | 'loading' | 'awaiting_truck'
  | 'delivering' | 'delivered';

export interface FactoryEvent {
  team: TeamId;
  kind:
    | 'valve_open' | 'mixer_start' | 'mold_fill' | 'cooling_enter' | 'cut'
    | 'quality_stamp' | 'box_seal' | 'forklift_beep' | 'truck_depart' | 'truck_arrive' | 'customer_happy'
    | 'customer_meh' | 'customer_unhappy' | 'rework' | 'correct' | 'wrong';
}

export interface CustomerRelationship {
  type: CustomerType;
  ordersServed: number;
  goodStreak: number;
  returning: boolean;
}
