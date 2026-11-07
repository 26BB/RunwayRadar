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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#08090C]/85 backdrop-blur-xl px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3.5">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* Custom Precision Radar Emblem */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-white/[0.08] shadow-inner text-zinc-100">
              <svg className="w-4 h-4 text-zinc-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
                <path d="M16.24 7.76a6 6 0 0 0-8.49 0" />
                <circle cx="12" cy="12" r="2" fill="#10B981" stroke="#10B981" />
                <path d="M12 12l4-4" stroke="#10B981" strokeWidth="2" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#08090C] animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-white">
                  RunwayRadar
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
                  FOUNDER'S WAR ROOM
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
              className={`px-2 py-1 text-xs font-mono font-medium rounded transition-all ${
                currency === 'INR' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2 py-1 text-xs font-mono font-medium rounded transition-all ${
                currency === 'USD' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Center: Minimalist Preset Segmented Switcher */}
        <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/[0.06] overflow-x-auto max-w-full">
          <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 px-2 select-none">
            PRESETS:
          </span>
          {Object.values(PRESETS).map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
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
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                currency === 'INR' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-all ${
                currency === 'USD' ? 'bg-white text-zinc-950 font-semibold shadow-xs' : 'text-zinc-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Share Scenario Link */}
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/[0.08] transition-all"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-all active:scale-[0.98]"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Memo</span>
          </button>
        </div>

      </div>
    </header>
  );
};
