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
    <div className="bg-[#0D0F15] border border-white/[0.06] rounded-xl p-5 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.06] mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-400" /> Headcount Sandbox ("What-If" Hiring)
            </h2>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
              {hires.length} {hires.length === 1 ? 'Role' : 'Roles'}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Model planned hiring timeline and calculate runway drag in real-time
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {runwayDrag > 0 && (
            <div className="px-2.5 py-1 rounded-md bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 text-xs font-mono font-bold">
              -{runwayDrag.toFixed(1)} mos Drag
            </div>
          )}
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Planned Role</span>
          </button>
        </div>
      </div>

      {/* New Hire Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleCreate} className="bg-zinc-900/60 border border-white/[0.1] rounded-xl p-4 mb-4 shadow-inner">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-white tracking-wide flex items-center gap-1.5 font-mono uppercase">
              <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> New Role Configuration
            </span>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Founding AI Engineer"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#08090C] border border-white/[0.08] rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/20"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {COMMON_ROLES.slice(0, 3).map((cr) => (
                  <button
                    key={cr}
                    type="button"
                    onClick={() => setRoleTitle(cr)}
                    className="text-[10px] text-zinc-400 hover:text-white bg-zinc-800/80 px-1.5 py-0.5 rounded border border-white/[0.04]"
                  >
                    +{cr.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Monthly Salary ({currency})
              </label>
              <input
                type="number"
                min={0}
                step={isINR ? 10000 : 500}
                required
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#08090C] border border-white/[0.08] rounded-lg text-xs text-white font-mono focus:outline-none focus:border-white/20"
              />
              <span className="text-[10px] text-zinc-400 block mt-1 font-mono">
                Base: {formatCurrency(salary, currency)}/mo
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Start Month: <span className="text-white font-mono font-bold">Month +{startMonth}</span>
              </label>
              <input
                type="range"
                min={0}
                max={12}
                step={1}
                value={startMonth}
                onChange={(e) => setStartMonth(Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 mt-1 font-mono">
                <span>Immediate (M0)</span>
                <span>M6 (+180d)</span>
                <span>M12</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-white/[0.06]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={isFullyLoaded}
                onChange={(e) => setIsFullyLoaded(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-zinc-100 cursor-pointer"
              />
              <span className="flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Apply 1.25x Fully Loaded Multiplier (taxes, equipment, SaaS, insurance)</span>
              </span>
            </label>

            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-sm transition-colors"
            >
              Confirm Role
            </button>
          </div>
        </form>
      )}

      {/* Planned Hires List */}
      {hires.length === 0 ? (
        <div className="text-center py-7 px-4 rounded-xl border border-dashed border-white/[0.08] bg-zinc-900/30">
          <Users className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
          <p className="text-xs font-medium text-zinc-300">No planned headcount modeled yet.</p>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Click "Add Planned Role" above or load the Seed preset to simulate hiring impact.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {hires.map((hire) => {
            const loadedCost = hire.salaryMonthly * (hire.isFullyLoaded ? LOADED_MULTIPLIER : 1.0);
            return (
              <div
                key={hire.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-zinc-900/50 border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-white">{hire.role}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                        Starts M+{hire.startMonthOffset}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5 font-mono">
                      <span>Base: {formatCurrency(hire.salaryMonthly, currency)}/mo</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-medium">
                        Loaded: {formatCurrency(loadedCost, currency)}/mo
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  <button
                    onClick={() => onUpdateHire(hire.id, { isFullyLoaded: !hire.isFullyLoaded })}
                    className={`flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono rounded border transition-colors ${
                      hire.isFullyLoaded
                        ? 'bg-amber-500/[0.08] text-amber-300 border-amber-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-white/[0.06] hover:text-white'
                    }`}
                    title="Toggle 25% overhead multiplier"
                  >
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{hire.isFullyLoaded ? '1.25x Active' : 'Base Only'}</span>
                  </button>

                  <button
                    onClick={() => onRemoveHire(hire.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                    title="Remove role from scenario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary Footer */}
      {hires.length > 0 && (
        <div className="mt-3.5 pt-3 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-zinc-400 gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-zinc-500" />
            <span>1.25x load factors in payroll taxes, healthcare, MacBook, and SaaS seats.</span>
          </div>
          <div className="font-mono text-zinc-300">
            Total Headcount Outflow: <span className="font-bold text-white">{formatCurrency(totalLoadedMonthly, currency)}/mo</span>
          </div>
        </div>
      )}
    </div>
  );
};
