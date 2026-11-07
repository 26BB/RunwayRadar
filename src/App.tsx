import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Currency, FinancialState, PlannedHire } from './types';
import { PRESETS, DEFAULT_PRESET_ID } from './lib/presets';
import { simulateFinancials } from './lib/financialMath';
import {
  serializeStateToQueryParams,
  deserializeStateFromQueryParams,
} from './lib/urlSerialization';

import { Header } from './components/Header';
import { VitalSigns } from './components/VitalSigns';
import { FinancialInputs } from './components/FinancialInputs';
import { HeadcountSandbox } from './components/HeadcountSandbox';
import { NuclearWinterToggle } from './components/NuclearWinterToggle';
import { TrajectoryChart } from './components/TrajectoryChart';
import { InvestorMemoModal } from './components/InvestorMemoModal';
import { RotateCcw, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Initialize state from URL if present, otherwise default preset
  const [financialState, setFinancialState] = useState<FinancialState>(() => {
    const defaultState = PRESETS[DEFAULT_PRESET_ID].state;
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      return deserializeStateFromQueryParams(params, defaultState);
    }
    return defaultState;
  });

  const [activePresetId, setActivePresetId] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      return null;
    }
    return DEFAULT_PRESET_ID;
  });

  const [isMemoOpen, setIsMemoOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state changes to URL query string
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const queryString = serializeStateToQueryParams(financialState);
      const newUrl = `${window.location.pathname}?${queryString}`;
      window.history.replaceState(null, '', newUrl);
    }
  }, [financialState]);

  // Run pure financial simulation
  const simulationResult = useMemo(() => {
    return simulateFinancials(financialState);
  }, [financialState]);

  // Handlers
  const handleStateChange = useCallback((patch: Partial<FinancialState>) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleCurrencyChange = useCallback((currency: Currency) => {
    if (currency === financialState.currency) return;
    setActivePresetId(null);

    // Smart exchange scale for convenience
    if (currency === 'USD') {
      setFinancialState((prev) => ({
        ...prev,
        currency: 'USD',
        cashInBank: Math.round(prev.cashInBank / 85),
        currentMRR: Math.round(prev.currentMRR / 85),
        fixedMonthlyBurn: Math.round(prev.fixedMonthlyBurn / 85),
        hires: prev.hires.map((h) => ({
          ...h,
          salaryMonthly: Math.round(h.salaryMonthly / 85),
        })),
      }));
    } else {
      setFinancialState((prev) => ({
        ...prev,
        currency: 'INR',
        cashInBank: Math.round(prev.cashInBank * 85),
        currentMRR: Math.round(prev.currentMRR * 85),
        fixedMonthlyBurn: Math.round(prev.fixedMonthlyBurn * 85),
        hires: prev.hires.map((h) => ({
          ...h,
          salaryMonthly: Math.round(h.salaryMonthly * 85),
        })),
      }));
    }
  }, [financialState.currency]);

  const handleSelectPreset = useCallback((presetId: string) => {
    const preset = PRESETS[presetId];
    if (preset) {
      setActivePresetId(presetId);
      setFinancialState(preset.state);
      showToast(`Loaded "${preset.name}" preset`);
    }
  }, []);

  const handleAddHire = useCallback((hire: PlannedHire) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({
      ...prev,
      hires: [...prev.hires, hire],
    }));
    showToast(`Added ${hire.role} to headcount`);
  }, []);

  const handleUpdateHire = useCallback((id: string, patch: Partial<PlannedHire>) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({
      ...prev,
      hires: prev.hires.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  }, []);

  const handleRemoveHire = useCallback((id: string) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({
      ...prev,
      hires: prev.hires.filter((h) => h.id !== id),
    }));
    showToast('Role removed from model');
  }, []);

  const handleNuclearToggle = useCallback((active: boolean) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({ ...prev, isNuclearWinter: active }));
    showToast(active ? 'Nuclear Winter Mode Enabled ❄️' : 'Standard Market Conditions Restored');
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast('Scenario link copied to clipboard! 🔗');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Copy failed. Please copy URL directly.');
    }
  };

  const handleReset = () => {
    handleSelectPreset(DEFAULT_PRESET_ID);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F1F5F9] flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Top Navigation */}
      <Header
        currency={financialState.currency}
        onCurrencyChange={handleCurrencyChange}
        activePresetId={activePresetId}
        onSelectPreset={handleSelectPreset}
        onOpenMemo={() => setIsMemoOpen(true)}
        onShare={handleShare}
        isCopied={isCopied}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-6 space-y-6 flex-1">
        {/* Executive Vital Signs (Top KPIs) */}
        <VitalSigns state={financialState} result={simulationResult} />

        {/* Financial Trajectory Curve */}
        <TrajectoryChart result={simulationResult} currency={financialState.currency} />

        {/* 2-Column Grid: Inputs & Headcount Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <FinancialInputs state={financialState} onChange={handleStateChange} />
          <HeadcountSandbox
            hires={financialState.hires}
            currency={financialState.currency}
            runwayDrag={simulationResult.runwayDragFromHires}
            onAddHire={handleAddHire}
            onUpdateHire={handleUpdateHire}
            onRemoveHire={handleRemoveHire}
          />
        </div>

        {/* Crisis Mode: Nuclear Winter Scenario */}
        <NuclearWinterToggle
          isNuclearWinter={financialState.isNuclearWinter}
          onToggle={handleNuclearToggle}
          result={simulationResult}
        />
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151926] border border-indigo-500/40 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Investor Memo Export Modal */}
      <InvestorMemoModal
        isOpen={isMemoOpen}
        onClose={() => setIsMemoOpen(false)}
        state={financialState}
        result={simulationResult}
        shareUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />

      {/* Footer */}
      <footer className="border-t border-[#1E2333] py-6 px-4 lg:px-8 bg-[#0B0D14] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>RunwayRadar</span>
            <span>·</span>
            <span>Founder's Office Financial Simulation</span>
            <span>·</span>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset Default
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span>Deterministic Client-Side Math (No Server Delay)</span>
            <span>·</span>
            <span className="text-slate-400">Crafted by Bhushan Bhosale</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
