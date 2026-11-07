import React from 'react';
import { Currency, FinancialState } from '../types';
import { formatCurrency } from '../lib/financialMath';
import { DollarSign, IndianRupee, TrendingUp, Building2, Wallet } from 'lucide-react';

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
    <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-[#1E2333] mb-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <Wallet className="w-4 h-4 text-indigo-400" /> Financial Core Inputs
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Tune your cash reserves, baseline MRR, and fixed overhead</p>
        </div>
        <div className="px-2.5 py-1 rounded-md bg-[#181D2B] text-slate-300 border border-[#242C40] text-xs font-mono-num font-semibold">
          {currency} Mode
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Cash In Bank */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              Cash In Bank
            </label>
            <span className="font-mono-num text-sm font-bold text-white px-2 py-0.5 bg-[#181D2B] border border-[#242C40] rounded">
              {formatCurrency(cashInBank, currency)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={cashMax}
              step={cashStep}
              value={cashInBank}
              onChange={(e) => onChange({ cashInBank: Number(e.target.value) })}
              className="w-full h-2 bg-[#1A1F2E] rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-num">
            <span>{formatCurrency(0, currency)}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => onChange({ cashInBank: Math.max(0, cashInBank - (isINR ? 1000000 : 25000)) })}
                className="px-1.5 py-0.5 rounded bg-[#181D2B] hover:bg-[#20273A] text-slate-300 text-[10px]"
              >
                -{isINR ? '₹10L' : '$25k'}
              </button>
              <button
                onClick={() => onChange({ cashInBank: cashInBank + (isINR ? 1000000 : 25000) })}
                className="px-1.5 py-0.5 rounded bg-[#181D2B] hover:bg-[#20273A] text-slate-300 text-[10px]"
              >
                +{isINR ? '₹10L' : '$25k'}
              </button>
            </div>
            <span>{formatCurrency(cashMax, currency)}</span>
          </div>
        </div>

        {/* 2. Current MRR */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              Current MRR (Revenue)
            </label>
            <span className="font-mono-num text-sm font-bold text-emerald-400 px-2 py-0.5 bg-[#181D2B] border border-[#242C40] rounded">
              {formatCurrency(currentMRR, currency)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={mrrMax}
            step={mrrStep}
            value={currentMRR}
            onChange={(e) => onChange({ currentMRR: Number(e.target.value) })}
            className="w-full h-2 bg-[#1A1F2E] rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-num">
            <span>{formatCurrency(0, currency)}</span>
            <span>{formatCurrency(mrrMax, currency)}</span>
          </div>
        </div>

        {/* 3. Expected MoM Growth */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" /> MoM Revenue Growth
            </label>
            <span className={`font-mono-num text-sm font-bold px-2 py-0.5 rounded border ${
              growthPercent >= 15
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : growthPercent >= 5
                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                : growthPercent >= 0
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {growthPercent > 0 ? `+${growthPercent}%` : `${growthPercent}%`} MoM
            </span>
          </div>
          <input
            type="range"
            min={-10}
            max={50}
            step={1}
            value={growthPercent}
            onChange={(e) => onChange({ momGrowthRate: Number(e.target.value) / 100 })}
            className="w-full h-2 bg-[#1A1F2E] rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-num">
            <span className="text-rose-400">-10% Churn</span>
            <span className="text-slate-400">0% Flat</span>
            <span className="text-emerald-400">+50% Hyper</span>
          </div>
        </div>

        {/* 4. Fixed Monthly OPEX */}
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" /> Fixed Monthly OPEX
            </label>
            <span className="font-mono-num text-sm font-bold text-slate-200 px-2 py-0.5 bg-[#181D2B] border border-[#242C40] rounded">
              {formatCurrency(fixedMonthlyBurn, currency)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={burnMax}
            step={burnStep}
            value={fixedMonthlyBurn}
            onChange={(e) => onChange({ fixedMonthlyBurn: Number(e.target.value) })}
            className="w-full h-2 bg-[#1A1F2E] rounded-lg appearance-none cursor-pointer accent-rose-500 hover:accent-rose-400"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono-num">
            <span>{formatCurrency(0, currency)}</span>
            <span className="text-xs text-slate-400">Cloud, Office, Legal, Tools</span>
            <span>{formatCurrency(burnMax, currency)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
