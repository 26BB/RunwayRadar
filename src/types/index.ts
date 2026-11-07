export type Currency = 'INR' | 'USD';

export interface PlannedHire {
  id: string;
  role: string;
  salaryMonthly: number;
  startMonthOffset: number; // 0 = immediate (Month 0), 1 = next month, etc.
  isFullyLoaded: boolean;   // true = 1.25x multiplier applied for benefits, taxes, tools
}

export interface FinancialState {
  currency: Currency;
  cashInBank: number;
  currentMRR: number;
  momGrowthRate: number;    // e.g. 0.10 for 10%
  fixedMonthlyBurn: number;
  hires: PlannedHire[];
  isNuclearWinter: boolean; // 50% growth cut + 2-month delay
}

export interface SimulationMonth {
  monthIndex: number;
  monthName: string;
  startingCash: number;
  endingCash: number;
  revenue: number;
  fixedBurn: number;
  headcountBurn: number;
  totalBurn: number;
  netBurn: number;
  isAlive: boolean;
}

// Alias for backwards compatibility with architecture docs
export type MonthlySimulationStep = SimulationMonth;

export type RunwayClassification = 'DEFAULT_ALIVE' | 'DEFAULT_DEAD' | 'CASH_FLOW_POSITIVE';

export interface SimulationResult {
  runwayMonths: number;
  zeroCashDate: string | null;
  isDefaultAlive: boolean;
  classification: RunwayClassification;
  breakevenMonth: number | null;
  baselineRunwayMonths: number;
  runwayDragFromHires: number;
  timeline: SimulationMonth[];
  survivalPrescription: string | null;
}

export interface PresetProfile {
  id: string;
  name: string;
  tagline: string;
  description: string;
  state: FinancialState;
}
