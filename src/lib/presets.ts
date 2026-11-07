import { PresetProfile } from '../types';

export const PRESETS: Record<string, PresetProfile> = {
  preseed: {
    id: 'preseed',
    name: 'Pre-Seed Sandbox',
    tagline: '₹30L Cash · 15% MoM · 1 Key Hire',
    description: 'Early prototype with early revenue traction. Testing runway impact of first engineering hire.',
    state: {
      currency: 'INR',
      cashInBank: 3000000,
      currentMRR: 150000,
      momGrowthRate: 0.15,
      fixedMonthlyBurn: 180000,
      isNuclearWinter: false,
      hires: [
        {
          id: 'hire-1',
          role: 'Fullstack Founding Engineer',
          salaryMonthly: 120000,
          startMonthOffset: 1,
          isFullyLoaded: true,
        },
      ],
    },
  },

  seed: {
    id: 'seed',
    name: 'Seed Expansion',
    tagline: '₹2.00 Cr Cash · 20% MoM · 4 Planned Hires',
    description: 'Post-seed round acceleration. Aggressive product & GTM expansion across 4 roles.',
    state: {
      currency: 'INR',
      cashInBank: 20000000,
      currentMRR: 1000000,
      momGrowthRate: 0.20,
      fixedMonthlyBurn: 800000,
      isNuclearWinter: false,
      hires: [
        {
          id: 'hire-1',
          role: 'Sr. Backend Architect',
          salaryMonthly: 250000,
          startMonthOffset: 1,
          isFullyLoaded: true,
        },
        {
          id: 'hire-2',
          role: 'Product Designer (UI/UX)',
          salaryMonthly: 150000,
          startMonthOffset: 2,
          isFullyLoaded: true,
        },
        {
          id: 'hire-3',
          role: 'Growth PM / Performance Marketer',
          salaryMonthly: 200000,
          startMonthOffset: 2,
          isFullyLoaded: true,
        },
        {
          id: 'hire-4',
          role: 'Enterprise SDR / B2B Sales',
          salaryMonthly: 120000,
          startMonthOffset: 3,
          isFullyLoaded: true,
        },
      ],
    },
  },

  bootstrapped: {
    id: 'bootstrapped',
    name: 'Bootstrapped Break-Even',
    tagline: '₹15L Cash · 8% MoM · 0 Hires (Default Alive Target)',
    description: 'Self-funded company focusing on reaching positive cashflow before reserves deplete.',
    state: {
      currency: 'INR',
      cashInBank: 1500000,
      currentMRR: 400000,
      momGrowthRate: 0.08,
      fixedMonthlyBurn: 450000,
      isNuclearWinter: false,
      hires: [],
    },
  },

  seedUsd: {
    id: 'seedUsd',
    name: 'Seed Expansion (USD)',
    tagline: '$250k Cash · 18% MoM · 2 Hires',
    description: 'Global SaaS startup scenario in USD.',
    state: {
      currency: 'USD',
      cashInBank: 250000,
      currentMRR: 12000,
      momGrowthRate: 0.18,
      fixedMonthlyBurn: 10000,
      isNuclearWinter: false,
      hires: [
        {
          id: 'hire-usd-1',
          role: 'Staff Fullstack Engineer',
          salaryMonthly: 6000,
          startMonthOffset: 1,
          isFullyLoaded: true,
        },
        {
          id: 'hire-usd-2',
          role: 'Developer Relations / Growth',
          salaryMonthly: 4500,
          startMonthOffset: 2,
          isFullyLoaded: true,
        },
      ],
    },
  },
};

export const DEFAULT_PRESET_ID = 'preseed';
