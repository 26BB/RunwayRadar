import React from 'react';
import { Currency } from '../types';
import { PRESETS } from '../lib/presets';
import { Share2, FileText, Check } from 'lucide-react';

interface HeaderProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  activePresetId: string | null;
  onSelectPreset: (presetId: string) => void;
  onOpenMemo: () => void;
  onShare: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  activePresetId,
  onSelectPreset,
  onOpenMemo,
  onShare,
  isCopied,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[var(--canvas)]/85 backdrop-blur-xl px-4 lg:px-8 py-3 transition-colors duration-150">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Custom Precision Radar Emblem */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-white/[0.08] shadow-inner text-zinc-100">
              <svg aria-hidden="true" className="w-4 h-4 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
                <path d="M16.24 7.76a6 6 0 0 0-8.49 0" />
                <circle cx="12" cy="12" r="2" fill="var(--primary-emerald)" stroke="var(--primary-emerald)" />
                <path d="M12 12l4-4" stroke="var(--primary-emerald)" strokeWidth="2" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[var(--canvas)] motion-safe:animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  RunwayRadar
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                  Founder war room
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Capital Allocation & Headcount Simulator
              </p>
            </div>
          </div>

          {/* Mobile Currency Selector */}
          <div className="flex md:hidden items-center bg-zinc-900/90 p-0.5 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                currency === 'INR' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                currency === 'USD' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Center: Minimalist Preset Segmented Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] overflow-x-auto max-w-full">
          <span className="text-[11px] text-zinc-400 px-2 select-none">
            Presets:
          </span>
          {Object.values(PRESETS).map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-zinc-800 text-white shadow-xs border border-white/[0.12]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                }`}
                title={p.description}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Right Actions: Currency, Share & Memo Export */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Desktop Currency Toggle */}
          <div className="hidden md:flex items-center bg-zinc-900/90 p-0.5 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                currency === 'INR' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                currency === 'USD' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Share Scenario Link */}
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Copy shareable link with current scenario state"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* Investor Memo Export Button */}
          <button
            onClick={onOpenMemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export memo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
