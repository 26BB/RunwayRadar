import React from 'react';
import { SimulationResult } from '../types';
import { AlertOctagon, Snowflake, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface NuclearWinterToggleProps {
  isNuclearWinter: boolean;
  onToggle: (active: boolean) => void;
  result: SimulationResult;
}

export const NuclearWinterToggle: React.FC<NuclearWinterToggleProps> = ({
  isNuclearWinter,
  onToggle,
  result,
}) => {
  return (
    <div
      className={`rounded-xl border p-4.5 transition-all duration-300 ${
        isNuclearWinter
          ? 'bg-rose-500/[0.04] border-rose-500/30 shadow-[0_0_20px_-5px_rgba(244,63,94,0.1)]'
          : 'bg-[#0D0F15] border-white/[0.06] hover:border-white/[0.1]'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border ${
              isNuclearWinter
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-white/[0.04] text-zinc-400 border-white/[0.08]'
            }`}
          >
            {isNuclearWinter ? (
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            ) : (
              <Snowflake className="w-4 h-4 text-zinc-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Macro Shock Simulation: "Nuclear Winter" Mode
              </h3>
              {isNuclearWinter && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500 text-white">
                  STRESS-TEST ACTIVE
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
              Stress-test survival under severe macro shocks: 50% revenue growth penalty & 60-day customer conversion freeze.
            </p>
          </div>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-mono text-zinc-400">
            {isNuclearWinter ? 'Headwinds Active' : 'Normal Conditions'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isNuclearWinter}
            onClick={() => onToggle(!isNuclearWinter)}
            className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-white/[0.1] transition-colors duration-200 ease-in-out focus:outline-none ${
              isNuclearWinter ? 'bg-rose-600' : 'bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                isNuclearWinter ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Survival Prescription Alert */}
      {result.survivalPrescription && (
        <div
          className={`mt-3.5 pt-3 border-t ${
            isNuclearWinter ? 'border-rose-500/20' : 'border-white/[0.04]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {result.isDefaultAlive ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold text-white mr-1.5 font-mono uppercase">
                {result.isDefaultAlive ? 'Resilience Diagnostic:' : 'Survival Prescription:'}
              </span>
              <span className={result.isDefaultAlive ? 'text-zinc-300' : 'text-amber-200'}>
                {result.survivalPrescription}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
