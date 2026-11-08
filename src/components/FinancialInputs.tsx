import React from 'react';
import { FinancialState } from '../types';
import { formatCurrency } from '../lib/financialMath';
import { TrendingUp, Building2, Wallet } from 'lucide-react';

interface FinancialInputsProps {
  state: FinancialState;
  onChange: (patch: Partial<FinancialState>) => void;
}

export const FinancialInputs: React.FC<FinancialInputsProps> = ({ state, onChange }) => {
  const { currency, cashInBank, currentMRR, momGrowthRate, fixedMonthlyBurn } = state;
  const growthPercent = Math.round(momGrowthRate * 100);

  // Dynamic limits based on currency
  const isINR = currency === 'INR';
  const cashMax = isINR ? 50000000 : 1000000; // 5 Cr or $1M
  const cashStep = isINR ? 500000 : 10000;    // 5 Lakh or $10k
  const mrrMax = isINR ? 5000000 : 200000;     // 50 Lakh or $200k
  const mrrStep = isINR ? 50000 : 2500;
  const burnMax = isINR ? 5000000 : 200000;
  const burnStep = isINR ? 50000 : 2500;

  return (
    <div className="bg-[var(--card-surface)] border border-white/[0.06] rounded-xl p-3.5 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 sm:mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2 text-balance">
            <Wallet className="w-4 h-4 text-zinc-400 shrink-0" /> Core capital and growth parameters
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5 text-pretty">Calibrate bank reserves, current MRR baseline, and non-payroll burn</p>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[11px] font-medium whitespace-nowrap">
          {currency} mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {/* 1. Cash In Bank */}
        <div className="space-y-2 p-3 sm:p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-zinc-400 font-medium">
              Cash in bank
            </label>
            <span className="font-mono-num text-sm font-bold text-white px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
              {formatCurrency(cashInBank, currency)}
            </span>
          </div>
          <div className="pt-1">
            <input
              type="range"
              min={0}
              max={cashMax}
              step={cashStep}
              value={cashInBank}
              onChange={(e) => onChange({ cashInBank: Number(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer touch-pan-x"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-mono-num">{formatCurrency(0, currency)}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ cashInBank: Math.max(0, cashInBank - (isINR ? 1000000 : 25000)) })}
                className="px-2 py-1 min-h-[30px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium border border-white/[0.04] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                -{isINR ? '₹10L' : '$25k'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ cashInBank: cashInBank + (isINR ? 1000000 : 25000) })}
                className="px-2 py-1 min-h-[30px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium border border-white/[0.04] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                +{isINR ? '₹10L' : '$25k'}
              </button>
            </div>
            <span className="font-mono-num">{formatCurrency(cashMax, currency)}</span>
          </div>
        </div>

        {/* 2. Current MRR */}
        <div className="space-y-2 p-3 sm:p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-zinc-400 font-medium">
              Current MRR (revenue)
            </label>
            <span className="font-mono-num text-sm font-bold text-emerald-400 px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
              {formatCurrency(currentMRR, currency)}
            </span>
          </div>
          <div className="pt-1">
            <input
              type="range"
              min={0}
              max={mrrMax}
              step={mrrStep}
              value={currentMRR}
              onChange={(e) => onChange({ currentMRR: Number(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer touch-pan-x"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-mono-num">{formatCurrency(0, currency)}</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ currentMRR: Math.max(0, currentMRR - (isINR ? 50000 : 2500)) })}
                className="px-2 py-1 min-h-[30px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium border border-white/[0.04] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                -{isINR ? '₹50k' : '$2.5k'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ currentMRR: currentMRR + (isINR ? 50000 : 2500) })}
                className="px-2 py-1 min-h-[30px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-medium border border-white/[0.04] transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                +{isINR ? '₹50k' : '$2.5k'}
              </button>
            </div>
            <span className="font-mono-num">{formatCurrency(mrrMax, currency)}</span>
          </div>
        </div>

        {/* 3. Expected MoM Growth */}
        <div className="space-y-2 p-3 sm:p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> MoM revenue growth
            </label>
            <span className={`text-sm font-bold px-2 py-0.5 rounded border ${
              growthPercent >= 15
                ? 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20'
                : growthPercent >= 5
                ? 'bg-sky-500/[0.08] text-sky-400 border-sky-500/20'
                : growthPercent >= 0
                ? 'bg-amber-500/[0.08] text-amber-400 border-amber-500/20'
                : 'bg-rose-500/[0.08] text-rose-400 border-rose-500/20'
            }`}>
              <span className="font-mono-num">{growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`}</span> MoM
            </span>
          </div>
          <div className="pt-1">
            <input
              type="range"
              min={-10}
              max={50}
              step={1}
              value={growthPercent}
              onChange={(e) => onChange({ momGrowthRate: Number(e.target.value) / 100 })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer touch-pan-x"
            />
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-rose-400">-10% Churn</span>
            <span className="text-zinc-400">0% Stagnant</span>
            <span className="text-emerald-400">+50% Hypergrowth</span>
          </div>
        </div>

        {/* 4. Fixed Monthly Non-Payroll OPEX */}
        <div className="space-y-2 p-3 sm:p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-xs text-zinc-400 flex items-center gap-1.5 font-medium">
              <Building2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" /> Fixed non-payroll OPEX
            </label>
            <span className="font-mono-num text-sm font-bold text-white px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
              {formatCurrency(fixedMonthlyBurn, currency)}
            </span>
          </div>
          <div className="pt-1">
            <input
              type="range"
              min={0}
              max={burnMax}
              step={burnStep}
              value={fixedMonthlyBurn}
              onChange={(e) => onChange({ fixedMonthlyBurn: Number(e.target.value) })}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer touch-pan-x"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span className="font-mono-num">{formatCurrency(0, currency)}</span>
            <span className="text-[11px] text-zinc-400">AWS, SaaS, Office, Legal</span>
            <span className="font-mono-num">{formatCurrency(burnMax, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
