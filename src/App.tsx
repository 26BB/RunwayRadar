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
import { RotateCcw, Check } from 'lucide-react';

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
      showToast(`Loaded "${preset.name}" scenario`);
    }
  }, []);

  const handleAddHire = useCallback((hire: PlannedHire) => {
    setActivePresetId(null);
    setFinancialState((prev) => ({
      ...prev,
      hires: [...prev.hires, hire],
    }));
    showToast(`Added ${hire.role} to roster`);
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
    showToast(active ? 'Macro Stress-Test Mode Activated' : 'Standard Market Baseline Restored');
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast('Scenario deep-link copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('Unable to copy automatically');
    }
  };

  const handleReset = () => {
    handleSelectPreset(DEFAULT_PRESET_ID);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F8FAFC] flex flex-col font-sans selection:bg-white/[0.1] canvas-ambient-glow">
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

      {/* Main Cockpit Container */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 py-5 space-y-4.5 flex-1">
        {/* Executive Vital Signs (Top Bento KPIs) */}
        <VitalSigns state={financialState} result={simulationResult} />

        {/* Financial Trajectory Curve */}
        <TrajectoryChart result={simulationResult} currency={financialState.currency} />

        {/* 2-Column Grid: Core Inputs & Headcount Sandbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4.5 items-start">
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

      {/* Feedback Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900/95 border border-white/[0.12] text-zinc-100 px-3.5 py-2 rounded-lg shadow-2xl text-xs font-medium flex items-center gap-2 backdrop-blur-md">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
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

      {/* Executive Minimalist Footer */}
      <footer className="border-t border-white/[0.04] py-5 px-4 lg:px-8 bg-[#06070A] text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="font-semibold text-zinc-300">RunwayRadar</span>
            <span>·</span>
            <span>Founder Runway & Headcount Simulator</span>
            <span>·</span>
            <button
              onClick={handleReset}
              className="text-zinc-400 hover:text-white flex items-center gap-1 transition-colors font-mono"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Deterministic Client-Side Math</span>
            <span>·</span>
            <span className="text-zinc-300">Crafted by Bhushan Bhosale</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
