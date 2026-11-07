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
    <div className="bg-[#0D0F15] border border-white/[0.06] rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-4 h-4 text-zinc-400" /> Core Capital & Growth Parameters
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">Calibrate bank reserves, current MRR baseline, and non-payroll burn</p>
        </div>
        <div className="px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.08] text-[10px] font-mono uppercase tracking-wider font-semibold">
          {currency} Mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Cash In Bank */}
        <div className="space-y-2 p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Cash In Bank
            </label>
            <span className="font-mono text-sm font-bold text-white px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
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
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>{formatCurrency(0, currency)}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange({ cashInBank: Math.max(0, cashInBank - (isINR ? 1000000 : 25000)) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] border border-white/[0.04]"
              >
                -{isINR ? '₹10L' : '$25k'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ cashInBank: cashInBank + (isINR ? 1000000 : 25000) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] border border-white/[0.04]"
              >
                +{isINR ? '₹10L' : '$25k'}
              </button>
            </div>
            <span>{formatCurrency(cashMax, currency)}</span>
          </div>
        </div>

        {/* 2. Current MRR */}
        <div className="space-y-2 p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
              Current MRR (Revenue)
            </label>
            <span className="font-mono text-sm font-bold text-emerald-400 px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
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
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>{formatCurrency(0, currency)}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange({ currentMRR: Math.max(0, currentMRR - (isINR ? 50000 : 2500)) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] border border-white/[0.04]"
              >
                -{isINR ? '₹50k' : '$2.5k'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ currentMRR: currentMRR + (isINR ? 50000 : 2500) })}
                className="px-1.5 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] border border-white/[0.04]"
              >
                +{isINR ? '₹50k' : '$2.5k'}
              </button>
            </div>
            <span>{formatCurrency(mrrMax, currency)}</span>
          </div>
        </div>

        {/* 3. Expected MoM Growth */}
        <div className="space-y-2 p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-zinc-400" /> MoM Revenue Growth
            </label>
            <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${
              growthPercent >= 15
                ? 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20'
                : growthPercent >= 5
                ? 'bg-sky-500/[0.08] text-sky-400 border-sky-500/20'
                : growthPercent >= 0
                ? 'bg-amber-500/[0.08] text-amber-400 border-amber-500/20'
                : 'bg-rose-500/[0.08] text-rose-400 border-rose-500/20'
            }`}>
              {growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`} MoM
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
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span className="text-rose-400">-10% Churn</span>
            <span className="text-zinc-400">0% Stagnant</span>
            <span className="text-emerald-400">+50% Hypergrowth</span>
          </div>
        </div>

        {/* 4. Fixed Monthly Non-Payroll OPEX */}
        <div className="space-y-2 p-3.5 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
          <div className="flex justify-between items-center">
            <label className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Fixed Non-Payroll OPEX
            </label>
            <span className="font-mono text-sm font-bold text-white px-2 py-0.5 bg-zinc-900 border border-white/[0.08] rounded">
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
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
            <span>{formatCurrency(0, currency)}</span>
            <span className="text-[9px] text-zinc-400">AWS, SaaS, Office, Legal</span>
            <span>{formatCurrency(burnMax, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
