import React from 'react';
import { Currency, FinancialState, SimulationResult } from '../types';
import { formatCurrency, calculateHeadcountBurnForMonth } from '../lib/financialMath';
import { Flame, Clock, Users, ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

interface VitalSignsProps {
  state: FinancialState;
  result: SimulationResult;
}

export const VitalSigns: React.FC<VitalSignsProps> = ({ state, result }) => {
  const { currency, fixedMonthlyBurn, currentMRR, hires } = state;
  const initialHiresBurn = calculateHeadcountBurnForMonth(hires, 0);
  const initialGrossBurn = fixedMonthlyBurn + initialHiresBurn;
  const initialNetBurn = initialGrossBurn - currentMRR;

  // Runway Badge Color
  const isInfinite = !isFinite(result.runwayMonths);
  const isDead = result.classification === 'DEFAULT_DEAD';
  const isCritical = result.runwayMonths < 6;
  const isWarning = result.runwayMonths >= 6 && result.runwayMonths < 12;

  let runwayBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let runwayBadgeText = 'Healthy Buffer (>12 mos)';

  if (isInfinite) {
    runwayBadgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    runwayBadgeText = 'Self-Sustaining';
  } else if (isCritical) {
    runwayBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    runwayBadgeText = 'Critical (< 6 mos)';
  } else if (isWarning) {
    runwayBadgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    runwayBadgeText = 'Caution (6–12 mos)';
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Runway Cliff */}
      <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#2D354D] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-400" /> Runway Remaining
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${runwayBadgeClass}`}>
            {runwayBadgeText}
          </span>
        </div>
        <div className="my-1">
          <div className="text-3xl font-extrabold tracking-tight text-white font-mono-num flex items-baseline gap-1.5">
            {isInfinite ? '∞' : result.runwayMonths.toFixed(1)}
            <span className="text-sm font-medium text-slate-400">{isInfinite ? 'Months' : 'mos'}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Zero Cash Date: <span className="font-semibold text-slate-200">{result.zeroCashDate}</span>
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1E2333]/70 flex items-center justify-between text-[11px] text-slate-400">
          <span>Simulation Horizon</span>
          <span className="font-mono-num font-semibold text-slate-300">60 Months Cap</span>
        </div>
      </div>

      {/* 2. Net Monthly Burn */}
      <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#2D354D] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-rose-400" /> Net Monthly Burn
          </span>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            initialNetBurn <= 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}>
            {initialNetBurn <= 0 ? 'Cash Flow +' : 'Burning Cash'}
          </span>
        </div>
        <div className="my-1">
          <div className="text-3xl font-extrabold tracking-tight text-white font-mono-num">
            {formatCurrency(initialNetBurn, currency)}
            <span className="text-xs font-normal text-slate-400 ml-1">/mo</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gross: <span className="text-slate-200">{formatCurrency(initialGrossBurn, currency)}</span> · Rev: <span className="text-emerald-400">{formatCurrency(currentMRR, currency)}</span>
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1E2333]/70 flex items-center justify-between text-[11px] text-slate-400">
          <span>Fixed OPEX</span>
          <span className="font-mono-num font-semibold text-slate-300">{formatCurrency(fixedMonthlyBurn, currency)}</span>
        </div>
      </div>

      {/* 3. Runway Drag */}
      <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm hover:border-[#2D354D] transition-colors">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-400" /> Headcount Drag
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/10 text-indigo-300 border-indigo-500/20 font-mono-num">
            {hires.length} Planned {hires.length === 1 ? 'Hire' : 'Hires'}
          </span>
        </div>
        <div className="my-1">
          <div className="text-3xl font-extrabold tracking-tight text-white font-mono-num flex items-baseline gap-1.5">
            {result.runwayDragFromHires > 0 ? `-${result.runwayDragFromHires.toFixed(1)}` : '0.0'}
            <span className="text-sm font-medium text-slate-400">mos lost</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Baseline Runway: <span className="font-semibold text-slate-200 font-mono-num">{isFinite(result.baselineRunwayMonths) ? `${result.baselineRunwayMonths.toFixed(1)} mos` : 'Infinite'}</span>
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1E2333]/70 flex items-center justify-between text-[11px] text-slate-400">
          <span>Loaded Payroll Cost</span>
          <span className="font-mono-num font-semibold text-slate-300">{formatCurrency(initialHiresBurn, currency)}/mo</span>
        </div>
      </div>

      {/* 4. Default Alive Status */}
      <div className={`border rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between shadow-sm transition-all ${
        result.isDefaultAlive
          ? 'bg-gradient-to-br from-[#12151E] to-[#0D1F17] border-emerald-500/30 shadow-emerald-950/20'
          : 'bg-gradient-to-br from-[#12151E] to-[#251017] border-rose-500/30 shadow-rose-950/20'
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {result.isDefaultAlive ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
            Paul Graham Test
          </span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
            result.isDefaultAlive
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
          }`}>
            {result.classification === 'CASH_FLOW_POSITIVE'
              ? 'Profitable'
              : result.isDefaultAlive
              ? 'Default Alive'
              : 'Default Dead'}
          </span>
        </div>
        <div className="my-1">
          <div className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {result.isDefaultAlive ? 'Default Alive 🟢' : 'Default Dead 🔴'}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {result.classification === 'CASH_FLOW_POSITIVE'
              ? 'Current revenue already covers all operating expenses.'
              : result.isDefaultAlive
              ? `Revenue crosses burn at Month ${result.breakevenMonth} before cash depletes.`
              : `Cash depletes before growth reaches break-even. Needs intervention.`}
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-[#1E2333]/70 flex items-center justify-between text-[11px] text-slate-400">
          <span>Framework Reference</span>
          <span className="font-semibold text-slate-300">Y Combinator (PG)</span>
        </div>
      </div>
    </div>
  );
};
