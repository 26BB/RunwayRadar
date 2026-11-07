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
      className={`rounded-2xl border p-5 transition-all ${
        isNuclearWinter
          ? 'bg-gradient-to-r from-[#201017] via-[#1A1220] to-[#14121E] border-rose-500/40 shadow-lg shadow-rose-950/20'
          : 'bg-[#12151E] border-[#1E2333] hover:border-[#2D354D]'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isNuclearWinter
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}
          >
            {isNuclearWinter ? (
              <AlertOctagon className="w-5 h-5 animate-bounce" />
            ) : (
              <Snowflake className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Crisis Mode: Nuclear Winter Scenario
              </h3>
              {isNuclearWinter && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white animate-pulse">
                  ACTIVE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              Stress-test company survival under extreme macro headwinds: 50% growth haircut & 60-day revenue freeze.
            </p>
          </div>
        </div>

        {/* Switch Toggle */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <span className="text-xs font-semibold text-slate-400">
            {isNuclearWinter ? 'Headwind Active' : 'Normal Conditions'}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isNuclearWinter}
            onClick={() => onToggle(!isNuclearWinter)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isNuclearWinter ? 'bg-rose-600' : 'bg-[#1E2333]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isNuclearWinter ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Survival Prescription Alert */}
      {result.survivalPrescription && (
        <div
          className={`mt-4 pt-4 border-t ${
            isNuclearWinter ? 'border-rose-500/20' : 'border-[#1E2333]'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {result.isDefaultAlive ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-white mr-1.5">
                {result.isDefaultAlive ? 'Survival Diagnostics:' : 'Survival Prescription:'}
              </span>
              <span className={result.isDefaultAlive ? 'text-slate-300' : 'text-amber-200/90'}>
                {result.survivalPrescription}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
