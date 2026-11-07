import React, { useState } from 'react';
import { Currency, PlannedHire } from '../types';
import { formatCurrency, LOADED_MULTIPLIER } from '../lib/financialMath';
import { Users, Plus, Trash2, Briefcase, Zap, Info } from 'lucide-react';

interface HeadcountSandboxProps {
  hires: PlannedHire[];
  currency: Currency;
  runwayDrag: number;
  onAddHire: (hire: PlannedHire) => void;
  onUpdateHire: (id: string, patch: Partial<PlannedHire>) => void;
  onRemoveHire: (id: string) => void;
}

const COMMON_ROLES = [
  'Sr. Fullstack Engineer',
  'Growth Lead / Product Marketer',
  'Product Designer (UI/UX)',
  'Enterprise Account Executive / SDR',
  'Founding AI Engineer',
  'DevOps / SRE Lead',
];

export const HeadcountSandbox: React.FC<HeadcountSandboxProps> = ({
  hires,
  currency,
  runwayDrag,
  onAddHire,
  onUpdateHire,
  onRemoveHire,
}) => {
  const isINR = currency === 'INR';
  const defaultSalary = isINR ? 150000 : 5000;

  const [roleTitle, setRoleTitle] = useState('');
  const [salary, setSalary] = useState(defaultSalary);
  const [startMonth, setStartMonth] = useState(1);
  const [isFullyLoaded, setIsFullyLoaded] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleTitle.trim()) return;

    onAddHire({
      id: `hire-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: roleTitle.trim(),
      salaryMonthly: Math.max(0, Number(salary)),
      startMonthOffset: Math.max(0, startMonth),
      isFullyLoaded,
    });

    setRoleTitle('');
    setSalary(defaultSalary);
    setStartMonth(1);
    setIsFormOpen(false);
  };

  const totalLoadedMonthly = hires.reduce(
    (acc, h) => acc + h.salaryMonthly * (h.isFullyLoaded ? LOADED_MULTIPLIER : 1.0),
    0
  );

  return (
    <div className="bg-[#12151E] border border-[#1E2333] rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2333] mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Headcount Sandbox ("What-If" Hiring)
            </h2>
            <span className="text-xs font-mono-num font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              {hires.length} {hires.length === 1 ? 'Role' : 'Roles'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Model upcoming hiring ramp and inspect runway cliff impact (Runway Drag)
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {runwayDrag > 0 && (
            <div className="px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono-num font-bold">
              -{runwayDrag.toFixed(1)} mos Drag
            </div>
          )}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
        </div>
      </div>

      {/* New Hire Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleCreate} className="bg-[#151926] border border-indigo-500/30 rounded-xl p-4 mb-5 shadow-inner animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Add Planned Role
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Sr. Fullstack Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#0E111A] border border-[#242C40] rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_ROLES.slice(0, 3).map((cr) => (
                  <button
                    key={cr}
                    type="button"
                    onClick={() => setRoleTitle(cr)}
                    className="text-[10px] text-slate-400 hover:text-indigo-300 bg-[#181D2B] px-1.5 py-0.5 rounded"
                  >
                    +{cr.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Monthly Salary ({currency})
              </label>
              <input
                type="number"
                min={0}
                step={isINR ? 10000 : 500}
                required
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0E111A] border border-[#242C40] rounded-lg text-sm text-white font-mono-num focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Preview: {formatCurrency(salary, currency)}/mo base
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Start Month: <span className="text-indigo-400 font-mono-num font-bold">Month {startMonth}</span>
              </label>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full h-2 bg-[#0E111A] rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-2"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono-num">
                <span>Immediate (M0)</span>
                <span>M6</span>
                <span>M12</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-[#1E2333]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={isFullyLoaded}
                onChange={(e) => setIsFullyLoaded(e.target.checked)}
                className="w-4 h-4 rounded border-[#242C40] bg-[#0E111A] text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="flex items-center gap-1 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Apply 1.25x Fully Loaded Multiplier (taxes, SaaS, hardware)
              </span>
            </label>

            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-colors"
            >
              Confirm Role
            </button>
          </div>
        </form>
      )}

      {/* Hires List */}
      {hires.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#1E2333] bg-[#0D1017]">
          <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-400">Zero planned hires modeled.</p>
          <p className="text-xs text-slate-500 mt-1">
            Click "Add Role" above or load the Seed preset to simulate hiring impact.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {hires.map((hire) => {
            const loadedCost = hire.salaryMonthly * (hire.isFullyLoaded ? LOADED_MULTIPLIER : 1.0);
            return (
              <div
                key={hire.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[#151926] border border-[#1E2333] hover:border-[#2D354D] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5 sm:mt-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-white">{hire.role}</span>
                      <span className="text-[10px] font-mono-num font-semibold px-2 py-0.5 rounded bg-[#1C2234] text-slate-300 border border-[#262E44]">
                        Start: M{hire.startMonthOffset}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono-num">
                      <span>Base: {formatCurrency(hire.salaryMonthly, currency)}/mo</span>
                      <span>·</span>
                      <span className="text-indigo-300 font-semibold">
                        Loaded: {formatCurrency(loadedCost, currency)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    onClick={() => onUpdateHire(hire.id, { isFullyLoaded: !hire.isFullyLoaded })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors ${
                      hire.isFullyLoaded
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-[#181D2B] text-slate-400 border-[#242C40] hover:text-white'
                    }`}
                    title="Toggle 25% overhead multiplier"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{hire.isFullyLoaded ? '1.25x Loaded' : 'Base Only'}</span>
                  </button>

                  <button
                    onClick={() => onRemoveHire(hire.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Remove role from scenario"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary footer */}
      {hires.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#1E2333] flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>Fully loaded includes payroll taxes, benefits, hardware, and seat licenses.</span>
          </div>
          <div className="font-mono-num text-slate-200">
            Peak Headcount Burn: <span className="font-bold text-white">{formatCurrency(totalLoadedMonthly, currency)}/mo</span>
          </div>
        </div>
      )}
    </div>
  );
};
