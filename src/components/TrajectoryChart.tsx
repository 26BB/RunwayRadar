import React, { useState } from 'react';
import { Currency, SimulationResult } from '../types';
import { formatCurrency } from '../lib/financialMath';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { LineChart as ChartIcon, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TrajectoryChartProps {
  result: SimulationResult;
  currency: Currency;
}

export const TrajectoryChart: React.FC<TrajectoryChartProps> = ({ result, currency }) => {
  const [horizon, setHorizon] = useState<number>(24);

  // Slice timeline to selected horizon
  const chartData = result.timeline.slice(0, horizon).map((step) => ({
    name: `M${step.monthIndex}`,
    monthIndex: step.monthIndex,
    cash: step.endingCash,
    revenue: step.revenue,
    grossBurn: step.totalBurn,
    netBurn: step.netBurn,
  }));

  const breakevenStep =
    result.breakevenMonth !== null && result.breakevenMonth < horizon
      ? `M${result.breakevenMonth}`
      : null;

  const cliffIndex =
    result.runwayMonths < horizon && !isFinite(result.runwayMonths)
      ? null
      : result.runwayMonths < horizon
      ? `M${Math.floor(result.runwayMonths)}`
      : null;

  return (
    <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2333] mb-5">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-indigo-400" /> Financial Trajectory & Crossover Curve
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cash balance depletion curve vs. compounding MRR and stepped headcount burn
          </p>
        </div>

        {/* Horizon selector */}
        <div className="flex items-center gap-1 bg-[#181D2B] p-1 rounded-xl border border-[#242C40]">
          <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
            Horizon:
          </span>
          {[12, 24, 36, 60].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg font-mono-num transition-colors ${
                horizon === h
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {h}M
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Status Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
            <span className="text-slate-300 font-medium">Cash Balance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
            <span className="text-slate-300 font-medium">Monthly Revenue (MRR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400 shadow-sm shadow-rose-400/50" />
            <span className="text-slate-300 font-medium">Gross Burn</span>
          </div>
        </div>

        {result.isDefaultAlive ? (
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Breakeven Crossover: Month {result.breakevenMonth}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-rose-400 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Zero Cash Cliff: {result.runwayMonths.toFixed(1)} Months</span>
          </div>
        )}
      </div>

      {/* Recharts Area */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="cashGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1E2333" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E2333' }}
            />
            <YAxis
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#1E2333' }}
              tickFormatter={(v) => formatCurrency(v, currency)}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-[#0E111A] border border-[#242C40] p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-mono-num">
                    <p className="font-bold text-white text-sm border-b border-[#1E2333] pb-1 font-sans">
                      {label}
                    </p>
                    <div className="flex justify-between gap-4 text-indigo-300">
                      <span>Cash In Bank:</span>
                      <span className="font-bold">{formatCurrency(d.cash, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-emerald-400">
                      <span>Monthly MRR:</span>
                      <span className="font-bold">{formatCurrency(d.revenue, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-rose-400">
                      <span>Gross Burn:</span>
                      <span className="font-bold">{formatCurrency(d.grossBurn, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-400 border-t border-[#1E2333] pt-1">
                      <span>Net Burn:</span>
                      <span className="font-bold text-slate-200">{formatCurrency(d.netBurn, currency)}</span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Reference line for Breakeven Crossover */}
            {breakevenStep && (
              <ReferenceLine
                x={breakevenStep}
                stroke="#10B981"
                strokeDasharray="4 4"
                label={{
                  value: 'Breakeven ★',
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
            )}

            {/* Reference line for Cash Cliff */}
            {cliffIndex && (
              <ReferenceLine
                x={cliffIndex}
                stroke="#F43F5E"
                strokeDasharray="4 4"
                label={{
                  value: 'Cash Out ⚠️',
                  fill: '#F43F5E',
                  fontSize: 10,
                  position: 'insideTopLeft',
                }}
              />
            )}

            {/* Areas */}
            <Area
              type="monotone"
              dataKey="cash"
              stroke="#6366F1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#cashGradient)"
              name="Cash Balance"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#revGradient)"
              name="MRR"
            />
            <Area
              type="stepAfter"
              dataKey="grossBurn"
              stroke="#F43F5E"
              strokeWidth={2}
              fill="none"
              strokeDasharray="3 3"
              name="Gross Burn"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
