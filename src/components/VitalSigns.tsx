import React from 'react';
import { FinancialState, SimulationResult } from '../types';
import { formatCurrency, calculateHeadcountBurnForMonth } from '../lib/financialMath';
import { Clock, Flame, Users, Activity, AlertCircle, ShieldCheck } from 'lucide-react';

interface VitalSignsProps {
  state: FinancialState;
  result: SimulationResult;
}

export const VitalSigns: React.FC<VitalSignsProps> = ({ state, result }) => {
  const { currency, fixedMonthlyBurn, currentMRR, hires } = state;
  const initialHiresBurn = calculateHeadcountBurnForMonth(hires, 0);
  const initialGrossBurn = fixedMonthlyBurn + initialHiresBurn;
  const initialNetBurn = initialGrossBurn - currentMRR;

  const isInfinite = !isFinite(result.runwayMonths);
  const isCritical = result.runwayMonths < 6;
  const isWarning = result.runwayMonths >= 6 && result.runwayMonths < 12;

  // Runway Badge Styling
  let runwayBadge = {
    text: 'Safe Buffer (>12m)',
    colorClass: 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20',
    topBorder: 'border-t-emerald-500/60',
  };

  if (isInfinite) {
    runwayBadge = {
      text: 'Self-Sustaining',
      colorClass: 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20',
      topBorder: 'border-t-emerald-500/60',
    };
  } else if (isCritical) {
    runwayBadge = {
      text: 'Critical Cliff (<6m)',
      colorClass: 'bg-rose-500/[0.08] text-rose-400 border-rose-500/20 animate-pulse',
      topBorder: 'border-t-rose-500/80',
    };
  } else if (isWarning) {
    runwayBadge = {
      text: 'Caution Window (6–12m)',
      colorClass: 'bg-amber-500/[0.08] text-amber-400 border-amber-500/20',
      topBorder: 'border-t-amber-500/70',
    };
  }

  // Revenue coverage ratio
  const coverageRatio = Math.min(100, Math.round((currentMRR / (initialGrossBurn || 1)) * 100));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      
      {/* 1. Runway Horizon */}
      <div className={`bg-[#0D0F15] border border-white/[0.06] ${runwayBadge.topBorder} rounded-xl p-4.5 flex flex-col justify-between shadow-sm hover:border-white/[0.12] transition-all`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" /> Runway Horizon
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${runwayBadge.colorClass}`}>
            {runwayBadge.text}
          </span>
        </div>

        <div className="my-1.5">
          <div className="text-3xl font-bold tracking-tight text-white font-mono-num flex items-baseline gap-2">
            {isInfinite ? (
              <span className="flex items-center gap-1.5 text-2xl font-semibold text-emerald-400">
                <span>∞</span>
                <span className="text-sm font-sans font-medium text-zinc-300">Self-Sustaining</span>
              </span>
            ) : (
              <>
                <span>{result.runwayMonths.toFixed(1)}</span>
                <span className="text-xs font-sans font-medium text-zinc-400">months</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
            <span>Zero-Cash Cliff:</span>
            <span className="font-mono text-zinc-200 font-medium">{result.zeroCashDate}</span>
          </p>
        </div>

        {/* Visual Runway Meter */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
          <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
            <span>0m (Cliff)</span>
            <span>12m</span>
            <span>18m+ (Safe)</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isInfinite || result.runwayMonths >= 12
                  ? 'bg-emerald-500'
                  : result.runwayMonths >= 6
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
              style={{
                width: isInfinite ? '100%' : `${Math.min(100, Math.max(5, (result.runwayMonths / 24) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Monthly Net Burn */}
      <div className={`bg-[#0D0F15] border border-white/[0.06] ${
        initialNetBurn <= 0 ? 'border-t-emerald-500/60' : 'border-t-rose-500/60'
      } rounded-xl p-4.5 flex flex-col justify-between shadow-sm hover:border-white/[0.12] transition-all`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-zinc-400" /> Monthly Net Burn
          </span>
          <span className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold ${
            initialNetBurn <= 0
              ? 'bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/20'
              : 'bg-rose-500/[0.08] text-rose-400 border-rose-500/20'
          }`}>
            {initialNetBurn <= 0 ? 'Cash Positive' : 'Active Drain'}
          </span>
        </div>

        <div className="my-1.5">
          <div className={`text-3xl font-bold tracking-tight font-mono-num flex items-baseline gap-1 ${
            initialNetBurn <= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            <span>{initialNetBurn <= 0 ? '+' : '-'}{formatCurrency(Math.abs(initialNetBurn), currency)}</span>
            <span className="text-xs font-sans font-medium text-zinc-400">/mo</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 flex justify-between">
            <span>Gross Outflow:</span>
            <span className="text-zinc-300 font-mono">{formatCurrency(initialGrossBurn, currency)}</span>
          </p>
        </div>

        {/* Coverage Meter */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.04]">
          <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
            <span>Revenue Inflow</span>
            <span className="text-emerald-400 font-mono font-medium">{formatCurrency(currentMRR, currency)} ({coverageRatio}%)</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${coverageRatio}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Headcount Runway Drag */}
      <div className="bg-[#0D0F15] border border-white/[0.06] border-t-indigo-500/60 rounded-xl p-4.5 flex flex-col justify-between shadow-sm hover:border-white/[0.12] transition-all">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-zinc-400" /> Headcount Drag
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white/[0.04] text-zinc-300 border-white/[0.08] font-medium">
            {hires.length} Planned {hires.length === 1 ? 'Role' : 'Roles'}
          </span>
        </div>

        <div className="my-1.5">
          <div className="text-3xl font-bold tracking-tight font-mono-num flex items-baseline gap-1 text-white">
            <span className={result.runwayDragFromHires > 0 ? 'text-rose-400' : 'text-zinc-200'}>
              {result.runwayDragFromHires > 0 ? `-${result.runwayDragFromHires.toFixed(1)}` : '0.0'}
            </span>
            <span className="text-xs font-sans font-medium text-zinc-400">mos drag</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 flex justify-between">
            <span>Baseline Runway:</span>
            <span className="text-zinc-300 font-mono">
              {isFinite(result.baselineRunwayMonths) ? `${result.baselineRunwayMonths.toFixed(1)} mos` : 'Infinite'}
            </span>
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-zinc-400">
          <span>Loaded Multiplier</span>
          <span className="text-indigo-400 font-mono font-medium">1.25x Active Overhead</span>
        </div>
      </div>

      {/* 4. Paul Graham Default Alive Verdict */}
      <div className={`bg-[#0D0F15] border border-white/[0.06] ${
        result.isDefaultAlive ? 'border-t-emerald-500/80' : 'border-t-rose-500/80'
      } rounded-xl p-4.5 flex flex-col justify-between shadow-sm hover:border-white/[0.12] transition-all`}>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-zinc-400" /> Paul Graham Test
          </span>
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
            YC FRAMEWORK
          </span>
        </div>

        <div className="my-1.5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              result.isDefaultAlive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
            }`} />
            <span className={`text-xl font-bold tracking-tight font-mono uppercase ${
              result.isDefaultAlive ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {result.classification === 'CASH_FLOW_POSITIVE'
                ? 'Profitable'
                : result.isDefaultAlive
                ? 'Default Alive'
                : 'Default Dead'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
            {result.classification === 'CASH_FLOW_POSITIVE'
              ? 'Revenue already covers all operating expenses.'
              : result.isDefaultAlive
              ? `Reaches breakeven in Month ${result.breakevenMonth} before cash depletes.`
              : `Cash depletes before organic growth crosses gross expenses.`}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
          {result.isDefaultAlive ? (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Self-Sustaining Trajectory</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Growth or Spend Intervention Needed</span>
            </span>
          )}
          <span className="text-zinc-400 font-mono text-[9px]">Discrete Compounding</span>
        </div>
      </div>

    </div>
  );
};
