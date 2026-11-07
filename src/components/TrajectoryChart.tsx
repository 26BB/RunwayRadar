import React, { useState } from 'react';
import { Currency, SimulationResult } from '../types';
import { formatCurrency } from '../lib/financialMath';
import {
  AreaChart,
  Area,
  Line,
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
    <div className="bg-[#0D0F15] border border-white/[0.06] rounded-xl p-5 shadow-sm">
      
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.06] mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <ChartIcon className="w-4 h-4 text-zinc-400" />
            Financial Trajectory & Crossover Projection
          </h2>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Cash reserves vs. compounding revenue curve and stepped operational burn
          </p>
        </div>

        {/* Horizon Selector */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded-lg border border-white/[0.06]">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-2 select-none">
            HORIZON:
          </span>
          {[12, 24, 36, 60].map((h) => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-2 py-0.5 text-xs font-mono font-medium rounded-md transition-all ${
                horizon === h
                  ? 'bg-zinc-800 text-white shadow-xs border border-white/[0.1]'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {h}M
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Milestone Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 text-xs">
        <div className="flex items-center gap-4 text-[11px] text-zinc-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
            <span>Cash Reserves</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>Revenue (MRR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-rose-400" />
            <span>Gross Burn</span>
          </div>
        </div>

        {result.isDefaultAlive ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/[0.08] border border-emerald-500/20 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Breakeven Crossover: Month {result.breakevenMonth}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-rose-400 text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-500/[0.08] border border-rose-500/20 font-medium">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Zero Cash Cliff: {result.runwayMonths.toFixed(1)} Months</span>
          </div>
        )}
      </div>

      {/* Recharts Area Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
            <defs>
              <linearGradient id="cashFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="revFillGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
            
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
            />
            
            <YAxis
              stroke="#64748B"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              fontFamily="JetBrains Mono"
              tickFormatter={(v) => formatCurrency(v, currency)}
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-[#0D0F15]/95 backdrop-blur-xl border border-white/[0.1] p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-mono">
                    <p className="font-semibold text-white text-xs border-b border-white/[0.08] pb-1 font-sans">
                      Timeline Milestone: {label}
                    </p>
                    <div className="flex justify-between gap-5 text-sky-400">
                      <span>Cash Balance:</span>
                      <span className="font-bold">{formatCurrency(d.cash, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-5 text-emerald-400">
                      <span>Monthly MRR:</span>
                      <span className="font-bold">{formatCurrency(d.revenue, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-5 text-rose-400">
                      <span>Gross Burn:</span>
                      <span className="font-bold">{formatCurrency(d.grossBurn, currency)}</span>
                    </div>
                    <div className="flex justify-between gap-5 text-zinc-400 border-t border-white/[0.08] pt-1">
                      <span>Net Cashflow:</span>
                      <span className={`font-bold ${d.netBurn <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {d.netBurn <= 0 ? '+' : '-'}{formatCurrency(Math.abs(d.netBurn), currency)}
                      </span>
                    </div>
                  </div>
                );
              }}
            />

            {/* Breakeven Marker */}
            {breakevenStep && (
              <ReferenceLine
                x={breakevenStep}
                stroke="#10B981"
                strokeDasharray="3 3"
                label={{
                  value: 'Breakeven Crossover',
                  fill: '#10B981',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'JetBrains Mono',
                }}
              />
            )}

            {/* Cash Out Cliff Marker */}
            {cliffIndex && (
              <ReferenceLine
                x={cliffIndex}
                stroke="#F43F5E"
                strokeDasharray="3 3"
                label={{
                  value: 'Zero Cash Cliff',
                  fill: '#F43F5E',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  fontFamily: 'JetBrains Mono',
                }}
              />
            )}

            {/* Curves */}
            <Area
              type="monotone"
              dataKey="cash"
              stroke="#38BDF8"
              strokeWidth={1.75}
              fill="url(#cashFillGradient)"
              activeDot={{ r: 4, fill: '#38BDF8', stroke: '#08090C', strokeWidth: 2 }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={1.75}
              fill="url(#revFillGradient)"
              activeDot={{ r: 4, fill: '#10B981', stroke: '#08090C', strokeWidth: 2 }}
            />

            <Line
              type="stepAfter"
              dataKey="grossBurn"
              stroke="#F43F5E"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
