import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  calculateHeadcountBurnForMonth,
  calculateRevenueForMonth,
  formatZeroCashDate,
  simulateFinancials,
  LOADED_MULTIPLIER,
} from './financialMath';
import { FinancialState } from '../types';
import { serializeStateToQueryParams, deserializeStateFromQueryParams } from './urlSerialization';
import { PRESETS } from './presets';

describe('Financial Math Engine: Currency Formatting', () => {
  it('formats INR correctly for Crores, Lakhs, and thousands', () => {
    expect(formatCurrency(25000000, 'INR')).toBe('₹2.50 Cr');
    expect(formatCurrency(1500000, 'INR')).toBe('₹15.00 L');
    expect(formatCurrency(45000, 'INR')).toBe('₹45,000');
    expect(formatCurrency(0, 'INR')).toBe('₹0');
    expect(formatCurrency(-2500000, 'INR')).toBe('-₹25.00 L');
  });

  it('formats USD correctly for Millions, Thousands, and hundreds', () => {
    expect(formatCurrency(1500000, 'USD')).toBe('$1.50M');
    expect(formatCurrency(45000, 'USD')).toBe('$45.0k');
    expect(formatCurrency(850, 'USD')).toBe('$850');
    expect(formatCurrency(0, 'USD')).toBe('$0');
    expect(formatCurrency(-25000, 'USD')).toBe('-$25.0k');
  });
});

describe('Financial Math Engine: Revenue Modeling & Nuclear Winter', () => {
  it('calculates regular compounding MRR curve correctly', () => {
    const baseMRR = 100000;
    const growth = 0.10; // 10%
    expect(calculateRevenueForMonth(baseMRR, growth, 0, false)).toBe(100000);
    expect(calculateRevenueForMonth(baseMRR, growth, 1, false)).toBeCloseTo(110000, 0);
    expect(calculateRevenueForMonth(baseMRR, growth, 2, false)).toBeCloseTo(121000, 0);
  });

  it('handles Nuclear Winter with 50% penalty and 2-month freeze', () => {
    const baseMRR = 100000;
    const growth = 0.20; // 20% normal -> 10% under Nuclear Winter
    // Months 0, 1, 2 must stay flat at 100,000
    expect(calculateRevenueForMonth(baseMRR, growth, 0, true)).toBe(100000);
    expect(calculateRevenueForMonth(baseMRR, growth, 1, true)).toBe(100000);
    expect(calculateRevenueForMonth(baseMRR, growth, 2, true)).toBe(100000);
    // Month 3 begins compounding at 10% (1 month of growth)
    expect(calculateRevenueForMonth(baseMRR, growth, 3, true)).toBeCloseTo(110000, 0);
    // Month 4 has 2 months of 10% growth = 121,000
    expect(calculateRevenueForMonth(baseMRR, growth, 4, true)).toBeCloseTo(121000, 0);
  });

  it('handles negative growth rate (churn) truthfully', () => {
    const baseMRR = 100000;
    const churn = -0.05; // 5% monthly churn
    expect(calculateRevenueForMonth(baseMRR, churn, 1, false)).toBeCloseTo(95000, 0);
    expect(calculateRevenueForMonth(baseMRR, churn, 2, false)).toBeCloseTo(90250, 0);
  });
});

describe('Financial Math Engine: Headcount Burn & Loaded Multiplier', () => {
  it('respects startMonthOffset for planned hires', () => {
    const hires = [
      { id: '1', role: 'Dev', salaryMonthly: 100000, startMonthOffset: 2, isFullyLoaded: false },
    ];
    expect(calculateHeadcountBurnForMonth(hires, 0)).toBe(0);
    expect(calculateHeadcountBurnForMonth(hires, 1)).toBe(0);
    expect(calculateHeadcountBurnForMonth(hires, 2)).toBe(100000);
    expect(calculateHeadcountBurnForMonth(hires, 3)).toBe(100000);
  });

  it('applies 1.25x fully loaded multiplier accurately', () => {
    const hires = [
      { id: '1', role: 'Dev', salaryMonthly: 100000, startMonthOffset: 0, isFullyLoaded: true },
    ];
    expect(LOADED_MULTIPLIER).toBe(1.25);
    expect(calculateHeadcountBurnForMonth(hires, 0)).toBe(125000);
  });
});

describe('Financial Math Engine: Simulation & Classification', () => {
  it('detects Default Alive crossover correctly', () => {
    // Startup with ₹50L cash, ₹2L MRR growing at 20% MoM, fixed burn ₹4L, no hires
    const state: FinancialState = {
      currency: 'INR',
      cashInBank: 5000000,
      currentMRR: 200000,
      momGrowthRate: 0.20,
      fixedMonthlyBurn: 400000,
      hires: [],
      isNuclearWinter: false,
    };

    const result = simulateFinancials(state, new Date('2026-01-01'));
    expect(result.isDefaultAlive).toBe(true);
    expect(result.classification).toBe('DEFAULT_ALIVE');
    expect(result.breakevenMonth).toBeGreaterThan(0);
    expect(result.runwayMonths).toBe(Number.POSITIVE_INFINITY);
    expect(result.zeroCashDate).toBe('Self-Sustaining');
  });

  it('detects Default Dead and calculates fractional cliff accurately', () => {
    // ₹10L cash, ₹50k MRR, 5% growth, ₹5L fixed burn
    // Net burn is ~₹4.5L/mo. Cash will deplete in ~2.2 months
    const state: FinancialState = {
      currency: 'INR',
      cashInBank: 1000000,
      currentMRR: 50000,
      momGrowthRate: 0.05,
      fixedMonthlyBurn: 500000,
      hires: [],
      isNuclearWinter: false,
    };

    const result = simulateFinancials(state, new Date('2026-01-01'));
    expect(result.isDefaultAlive).toBe(false);
    expect(result.classification).toBe('DEFAULT_DEAD');
    expect(result.breakevenMonth).toBeNull();
    expect(result.runwayMonths).toBeGreaterThan(1);
    expect(result.runwayMonths).toBeLessThan(3);
    expect(result.zeroCashDate).not.toBe('Self-Sustaining');
  });

  it('handles immediate cash depletion (Cash = 0)', () => {
    const state: FinancialState = {
      currency: 'INR',
      cashInBank: 0,
      currentMRR: 100000,
      momGrowthRate: 0.10,
      fixedMonthlyBurn: 300000,
      hires: [],
      isNuclearWinter: false,
    };

    const result = simulateFinancials(state);
    expect(result.runwayMonths).toBe(0);
    expect(result.isDefaultAlive).toBe(false);
    expect(result.classification).toBe('DEFAULT_DEAD');
    expect(result.zeroCashDate).toBe('Immediate Cliff');
    expect(formatZeroCashDate(12, new Date('2026-01-01'))).toBe('Jan 2027');
  });

  it('identifies cash flow positive startups at Month 0', () => {
    const state: FinancialState = {
      currency: 'INR',
      cashInBank: 1000000,
      currentMRR: 500000,
      momGrowthRate: 0.05,
      fixedMonthlyBurn: 300000,
      hires: [],
      isNuclearWinter: false,
    };

    const result = simulateFinancials(state);
    expect(result.isDefaultAlive).toBe(true);
    expect(result.classification).toBe('CASH_FLOW_POSITIVE');
    expect(result.breakevenMonth).toBe(0);
    expect(result.runwayMonths).toBe(Number.POSITIVE_INFINITY);
  });

  it('calculates Runway Drag caused by planned hires', () => {
    const baseState: FinancialState = {
      currency: 'INR',
      cashInBank: 3000000,
      currentMRR: 100000,
      momGrowthRate: 0.05,
      fixedMonthlyBurn: 250000,
      hires: [
        {
          id: 'hire-1',
          role: 'Architect',
          salaryMonthly: 150000,
          startMonthOffset: 0,
          isFullyLoaded: true,
        },
      ],
      isNuclearWinter: false,
    };

    const withHiresResult = simulateFinancials(baseState);
    expect(withHiresResult.runwayDragFromHires).toBeGreaterThan(0);
    expect(withHiresResult.baselineRunwayMonths).toBeGreaterThan(withHiresResult.runwayMonths);
  });
});

describe('URL Serialization & Deserialization', () => {
  it('round-trips scenario state accurately', () => {
    const originalState: FinancialState = {
      currency: 'INR',
      cashInBank: 4500000,
      currentMRR: 250000,
      momGrowthRate: 0.12,
      fixedMonthlyBurn: 180000,
      isNuclearWinter: true,
      hires: [
        {
          id: 'h1',
          role: 'Sr Engineer',
          salaryMonthly: 150000,
          startMonthOffset: 1,
          isFullyLoaded: true,
        },
      ],
    };

    const query = serializeStateToQueryParams(originalState);
    const searchParams = new URLSearchParams(query);
    const restored = deserializeStateFromQueryParams(searchParams, originalState);

    expect(restored.currency).toBe(originalState.currency);
    expect(restored.cashInBank).toBe(originalState.cashInBank);
    expect(restored.currentMRR).toBe(originalState.currentMRR);
    expect(restored.momGrowthRate).toBeCloseTo(0.12);
    expect(restored.fixedMonthlyBurn).toBe(originalState.fixedMonthlyBurn);
    expect(restored.isNuclearWinter).toBe(true);
    expect(restored.hires.length).toBe(1);
    expect(restored.hires[0].role).toBe('Sr Engineer');
    expect(restored.hires[0].salaryMonthly).toBe(150000);
    expect(restored.hires[0].isFullyLoaded).toBe(true);
  });
});

describe('Presets Profile Integrity', () => {
  it('contains valid preseed, seed, and bootstrapped profiles', () => {
    expect(PRESETS.preseed).toBeDefined();
    expect(PRESETS.seed).toBeDefined();
    expect(PRESETS.bootstrapped).toBeDefined();

    expect(PRESETS.preseed.state.cashInBank).toBe(3000000);
    expect(PRESETS.seed.state.hires.length).toBe(4);
    expect(PRESETS.bootstrapped.state.hires.length).toBe(0);
  });
});
