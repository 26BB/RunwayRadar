import {
  Currency,
  FinancialState,
  PlannedHire,
  RunwayClassification,
  SimulationMonth,
  SimulationResult,
} from '../types';

export const MAX_SIMULATION_MONTHS = 60;
export const LOADED_MULTIPLIER = 1.25;

/**
 * Format currency amounts with standard abbreviations.
 * INR: Crores (Cr) >= 1 Cr, Lakhs (L) >= 1 L, or Indian comma thousands.
 * USD: Millions (M) >= $1M, Thousands (k) >= $1k, or USD commas.
 */
export function formatCurrency(amount: number, currency: Currency): string {
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (currency === 'INR') {
    if (abs >= 10000000) {
      const cr = (abs / 10000000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${cr} Cr`;
    }
    if (abs >= 100000) {
      const l = (abs / 100000).toFixed(2);
      return `${isNegative ? '-' : ''}₹${l} L`;
    }
    return `${isNegative ? '-' : ''}₹${Math.round(abs).toLocaleString('en-IN')}`;
  } else {
    if (abs >= 1000000) {
      const m = (abs / 1000000).toFixed(2);
      return `${isNegative ? '-' : ''}$${m}M`;
    }
    if (abs >= 1000) {
      const k = (abs / 1000).toFixed(1);
      return `${isNegative ? '-' : ''}$${k}k`;
    }
    return `${isNegative ? '-' : ''}$${Math.round(abs).toLocaleString('en-US')}`;
  }
}

/**
 * Calculate total monthly headcount burn for a specific simulation month t.
 */
export function calculateHeadcountBurnForMonth(hires: PlannedHire[], monthIndex: number): number {
  return hires.reduce((total, hire) => {
    if (monthIndex < hire.startMonthOffset) {
      return total;
    }
    const cost = hire.salaryMonthly * (hire.isFullyLoaded ? LOADED_MULTIPLIER : 1.0);
    return total + cost;
  }, 0);
}

/**
 * Calculate revenue at month t.
 * If Nuclear Winter is ON:
 * - 50% growth penalty: growthRate * 0.50
 * - 2-month ramp delay: growth starts at t > 2, t=0,1,2 stay flat at MRR_0.
 */
export function calculateRevenueForMonth(
  baseMRR: number,
  momGrowthRate: number,
  monthIndex: number,
  isNuclearWinter: boolean
): number {
  if (baseMRR <= 0) return 0;

  if (!isNuclearWinter) {
    if (momGrowthRate === 0) return baseMRR;
    return baseMRR * Math.pow(1 + momGrowthRate, monthIndex);
  }

  // Nuclear Winter scenario:
  const effectiveGrowth = momGrowthRate * 0.5;
  if (monthIndex <= 2) {
    // 2-month sales cycle freeze / delay
    return baseMRR;
  }
  return baseMRR * Math.pow(1 + effectiveGrowth, monthIndex - 2);
}

/**
 * Computes calendar date for the runway cliff.
 */
export function formatZeroCashDate(runwayMonths: number, startDate: Date = new Date()): string {
  if (!isFinite(runwayMonths)) {
    return 'Self-Sustaining';
  }
  if (runwayMonths <= 0) {
    return 'Immediate Cliff';
  }

  const targetDate = new Date(startDate.getFullYear(), startDate.getMonth() + Math.floor(runwayMonths), 1);
  return targetDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Formats month label for timeline display (e.g. "M0", "M6", "M12").
 */
export function formatMonthName(monthIndex: number, startDate: Date = new Date()): string {
  const date = new Date(startDate.getFullYear(), startDate.getMonth() + monthIndex, 1);
  const formatted = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  return `M${monthIndex} (${formatted})`;
}

/**
 * Main Pure Financial Simulator.
 * Simulates month-by-month cashflow up to MAX_SIMULATION_MONTHS.
 */
export function simulateFinancials(state: FinancialState, startDate: Date = new Date()): SimulationResult {
  const { cashInBank, currentMRR, momGrowthRate, fixedMonthlyBurn, hires, isNuclearWinter } = state;

  const timeline: SimulationMonth[] = [];
  let currentCash = cashInBank;
  let breakevenMonth: number | null = null;
  let zeroCashMonthFraction: number | null = null;

  // Immediate cliff check
  if (currentCash <= 0) {
    const headcountBurn0 = calculateHeadcountBurnForMonth(hires, 0);
    const totalBurn0 = fixedMonthlyBurn + headcountBurn0;
    const rev0 = calculateRevenueForMonth(currentMRR, momGrowthRate, 0, isNuclearWinter);
    const net0 = totalBurn0 - rev0;

    timeline.push({
      monthIndex: 0,
      monthName: formatMonthName(0, startDate),
      startingCash: 0,
      endingCash: 0,
      revenue: rev0,
      fixedBurn: fixedMonthlyBurn,
      headcountBurn: headcountBurn0,
      totalBurn: totalBurn0,
      netBurn: net0,
      isAlive: rev0 >= totalBurn0,
    });

    return {
      runwayMonths: 0,
      zeroCashDate: 'Immediate Cliff',
      isDefaultAlive: false,
      classification: 'DEFAULT_DEAD',
      breakevenMonth: null,
      baselineRunwayMonths: 0,
      runwayDragFromHires: 0,
      timeline,
      survivalPrescription: 'CRITICAL: Zero cash balance at Day 0. Immediate capital injection or cost elimination required.',
    };
  }

  // Check if already profitable at month 0
  const initialHeadcountBurn = calculateHeadcountBurnForMonth(hires, 0);
  const initialTotalBurn = fixedMonthlyBurn + initialHeadcountBurn;
  if (currentMRR >= initialTotalBurn) {
    breakevenMonth = 0;
  }

  let ranOutOfCash = false;

  for (let t = 0; t < MAX_SIMULATION_MONTHS; t++) {
    const rev = calculateRevenueForMonth(currentMRR, momGrowthRate, t, isNuclearWinter);
    const headcountBurn = calculateHeadcountBurnForMonth(hires, t);
    const totalBurn = fixedMonthlyBurn + headcountBurn;
    const netBurn = totalBurn - rev;
    const isAlive = rev >= totalBurn;

    if (isAlive && breakevenMonth === null) {
      breakevenMonth = t;
    }

    const startingCash = currentCash;
    let endingCash = 0;

    if (netBurn <= 0) {
      // Cash flow positive or neutral this month
      endingCash = startingCash + Math.abs(netBurn);
      currentCash = endingCash;
    } else {
      // Net burning
      if (startingCash >= netBurn) {
        endingCash = startingCash - netBurn;
        currentCash = endingCash;
      } else {
        // Runs out of cash during this month
        if (!ranOutOfCash) {
          zeroCashMonthFraction = t + (startingCash / netBurn);
          ranOutOfCash = true;
        }
        endingCash = 0;
        currentCash = 0;
      }
    }

    timeline.push({
      monthIndex: t,
      monthName: formatMonthName(t, startDate),
      startingCash,
      endingCash,
      revenue: Math.round(rev),
      fixedBurn: Math.round(fixedMonthlyBurn),
      headcountBurn: Math.round(headcountBurn),
      totalBurn: Math.round(totalBurn),
      netBurn: Math.round(netBurn),
      isAlive,
    });

    // If cash is depleted, simulate remaining with 0 cash to show curves
    if (ranOutOfCash && currentCash === 0 && t >= (zeroCashMonthFraction ?? 0) + 12) {
      // Keep at least 12 months post-cliff for visual perspective or finish early if 24 months reached
      if (t >= 24) break;
    }
  }

  // Determine classification and runway
  let isDefaultAlive = false;
  let classification: RunwayClassification = 'DEFAULT_DEAD';
  let runwayMonths = 0;

  if (breakevenMonth === 0 && !ranOutOfCash) {
    classification = 'CASH_FLOW_POSITIVE';
    isDefaultAlive = true;
    runwayMonths = Number.POSITIVE_INFINITY;
  } else if (breakevenMonth !== null && !ranOutOfCash) {
    classification = 'DEFAULT_ALIVE';
    isDefaultAlive = true;
    runwayMonths = Number.POSITIVE_INFINITY;
  } else {
    classification = 'DEFAULT_DEAD';
    isDefaultAlive = false;
    runwayMonths = zeroCashMonthFraction !== null ? Number(zeroCashMonthFraction.toFixed(1)) : MAX_SIMULATION_MONTHS;
  }

  // Compute Baseline (No Hires) to find Runway Drag
  let baselineRunwayMonths = runwayMonths;
  let runwayDragFromHires = 0;

  if (hires.length > 0) {
    const baselineResult = simulateFinancials({ ...state, hires: [] }, startDate);
    baselineRunwayMonths = baselineResult.runwayMonths;

    if (isFinite(baselineRunwayMonths) && isFinite(runwayMonths)) {
      runwayDragFromHires = Number((baselineRunwayMonths - runwayMonths).toFixed(1));
    } else if (isFinite(baselineRunwayMonths) && !isFinite(runwayMonths)) {
      runwayDragFromHires = 0;
    } else if (!isFinite(baselineRunwayMonths) && isFinite(runwayMonths)) {
      // Baseline was alive/infinite, but hires killed it
      runwayDragFromHires = Number((MAX_SIMULATION_MONTHS - runwayMonths).toFixed(1));
    }
  }

  const zeroCashDate = formatZeroCashDate(runwayMonths, startDate);

  // Generate actionable survival prescription
  const survivalPrescription = generatePrescription({
    state,
    classification,
    runwayMonths,
    breakevenMonth,
    hires,
    runwayDragFromHires,
  });

  return {
    runwayMonths,
    zeroCashDate,
    isDefaultAlive,
    classification,
    breakevenMonth,
    baselineRunwayMonths,
    runwayDragFromHires,
    timeline,
    survivalPrescription,
  };
}

interface PrescriptionArgs {
  state: FinancialState;
  classification: RunwayClassification;
  runwayMonths: number;
  breakevenMonth: number | null;
  hires: PlannedHire[];
  runwayDragFromHires: number;
}

function generatePrescription({
  state,
  classification,
  runwayMonths,
  breakevenMonth,
  hires,
  runwayDragFromHires,
}: PrescriptionArgs): string {
  const { isNuclearWinter, currency, fixedMonthlyBurn } = state;

  if (classification === 'CASH_FLOW_POSITIVE') {
    return 'Company is currently cash-flow positive. Focus capital allocation on high-ROI distribution and retaining top talent.';
  }

  if (classification === 'DEFAULT_ALIVE') {
    return `Company is Default Alive! Breakeven crossover projected at Month ${breakevenMonth}. Maintain existing growth velocity without premature headcount acceleration.`;
  }

  // Default Dead recommendations
  const parts: string[] = [];
  if (isNuclearWinter) {
    parts.push('🚨 NUCLEAR WINTER ACTIVE: Severe macro headwinds modeled (50% growth haircut & 60-day sales freeze).');
  }

  if (runwayMonths < 6) {
    parts.push(`CRITICAL RUNWAY: Only ${runwayMonths} months of cash remaining.`);
  } else {
    parts.push(`Runway is ${runwayMonths} months, falling short of self-sustaining profitability.`);
  }

  if (hires.length > 0 && runwayDragFromHires > 0) {
    const totalHireCost = hires.reduce(
      (sum, h) => sum + h.salaryMonthly * (h.isFullyLoaded ? LOADED_MULTIPLIER : 1.0),
      0
    );
    parts.push(
      `Freezing ${hires.length} planned hire${hires.length > 1 ? 's' : ''} saves ${formatCurrency(totalHireCost, currency)}/mo and recovers +${runwayDragFromHires} months of runway.`
    );
  }

  const targetReduction = fixedMonthlyBurn * 0.25;
  parts.push(
    `Trimming 25% of fixed non-payroll OPEX (${formatCurrency(targetReduction, currency)}/mo) extends survival runway toward the next fundraising cycle.`
  );

  return parts.join(' ');
}
