// ============================================================
// PERCENTAGE HARVEST — THE SMART FARM
// Types & Interfaces for Grade 6 Mathematics Arcade Machine 11
// ============================================================

export type TeamId = 'blue' | 'red';

export type CropType = 'wheat' | 'corn' | 'tomatoes' | 'vegetables' | 'sunflowers' | 'cotton';

export type CropGrowthStage = 
  | 0 // prepared dark furrowed soil
  | 1 // seeded furrows
  | 2 // tiny bright green sprouts
  | 3 // young wheat/crop plants
  | 4 // tall green crops
  | 5 // mature golden crops waving in wind
  | 6; // harvested field with short stubble

export interface CropConfig {
  id: CropType;
  name: string;
  color: string;
  fieldColor: string;
  matureColor: string;
  yieldPerHa: number; // kg per hectare
  basePricePerKg: number; // ₹ per kg
  icon: string;
  unit: string;
  description: string;
}

export type WeatherType = 'sunny_morning' | 'cloudy' | 'rain' | 'afternoon_sun' | 'golden_sunset' | 'night_stars';

export type QuestionCategory =
  | 'quantity'
  | 'grid100'
  | 'increase_decrease'
  | 'finding_whole'
  | 'multi_step'
  | 'fraction_decimal'
  | 'ratio_comparison'
  | 'profit_discount';

export interface PercentageQuestion {
  id: string;
  category: QuestionCategory;
  roundNumber: number; // 1 to 5
  scenario: string;
  prompt: string;
  cropType: CropType;
  baseQuantity: number; // e.g., 200 hectares or 500 kg
  unit: string; // 'hectares' | 'kg' | 'tons' | 'liters' | 'plants'
  targetPercentage: number; // e.g., 30 for 30%
  correctAnswer: number | string;
  options: (number | string)[];
  stepExplanation: string[];
  mode: 'quantity' | 'grid100' | 'increase_decrease' | 'finding_whole' | 'multi_step' | 'conversion' | 'part_whole' | 'discount';
  weatherEffect?: WeatherType;
  // Specific params for physical consequence
  physicalOutcome: {
    fieldAreaHectares?: number;
    harvestKg?: number;
    cellsToPlant?: number;
    priceMultiplier?: number;
    cropType: CropType;
    description: string;
  };
}

export type FarmerTask =
  | 'idle'
  | 'walking_to_field'
  | 'sowing'
  | 'fertilizing'
  | 'spraying_pesticide'
  | 'harvesting'
  | 'loading_crates'
  | 'carrying_grain'
  | 'cheering';

export type VehicleTask =
  | 'idle'
  | 'planting'
  | 'harvesting'
  | 'loading_truck'
  | 'truck_delivering'
  | 'weighing'
  | 'to_market'
  | 'selling'
  | 'returning';

export interface WeighTicket {
  ticketId: string;
  cropName: string;
  cropType: CropType;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  pricePerKg: number;
  totalRevenue: number;
  timestamp: number;
}

export interface FarmClockState {
  day: number;
  timeStr: string;
  isNightPassing: boolean;
  stageNotice: string | null;
}

export interface FarmTeamState {
  teamId: TeamId;
  teamName: string;
  currentRound: number; // 1 to 5
  isMatchComplete: boolean;
  
  // Math & Interaction
  currentQuestion: PercentageQuestion | null;
  selectedCells: boolean[]; // 100-element array (10x10)
  selectedAnswer: number | string | null;
  hasAnsweredCurrent: boolean;
  isCurrentCorrect: boolean | null;
  feedbackMessage: string | null;
  attemptsCount: number;

  // Farm Simulation & Assets
  farmEvolutionStage: number; // 1 to 5
  allocatedHectares: number;
  currentCrop: CropType;
  fieldGrowthStage: CropGrowthStage;
  
  // Logistics & Characters
  farmerTask: FarmerTask;
  farmerProgress: number;
  vehicleTask: VehicleTask;
  vehicleProgress: number; // 0 to 1 along path
  trailerFillPercent: number; // 0 to 100
  trailerLoadKg: number;
  truckCargoCount: number; // 0 to 8 crates
  
  // Weighing & Market
  lastTicket: WeighTicket | null;
  
  // Economy & Scoreboard
  accuracy: number; // percentage (e.g. 100%)
  totalAnswered: number;
  correctAnswersCount: number;
  totalHarvestKg: number;
  wasteKg: number;
  deliveriesCount: number;
  totalRevenue: number; // in ₹
  totalProfit: number; // ₹
}

export interface SimEvent {
  type:
    | 'tractor_start'
    | 'tractor_plant'
    | 'farmer_sow'
    | 'fertilizer_spread'
    | 'pesticide_spray'
    | 'tractor_harvest'
    | 'truck_load'
    | 'truck_depart'
    | 'day_advance'
    | 'scale_weigh'
    | 'market_sell'
    | 'money_gain'
    | 'rain_start'
    | 'irrigation_activate'
    | 'celebration';
  teamId: TeamId;
  payload?: any;
}
