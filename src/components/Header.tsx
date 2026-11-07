import React, { useState } from 'react';
import { Currency } from '../types';
import { PRESETS } from '../lib/presets';
import { Radio, Share2, FileText, Check, Sparkles } from 'lucide-react';

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
    <header className="border-b border-[#1E2333] bg-[#0E111A]/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20 text-white">
              <Radio className="w-5 h-5 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0E111A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">Runway<span className="text-indigo-400">Radar</span></span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">v1.0</span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Headcount & Runway Cliff Scenario Engine</p>
            </div>
          </div>

          {/* Currency Toggle Mobile */}
          <div className="flex md:hidden items-center bg-[#151926] p-0.5 rounded-lg border border-[#1E2333]">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                currency === 'INR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                currency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>

        {/* Center: Presets */}
        <div className="flex items-center gap-1.5 bg-[#12151E] p-1 rounded-xl border border-[#1E2333] overflow-x-auto max-w-full">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-400" /> Presets:
          </span>
          {Object.values(PRESETS).map((p) => {
            const isSelected = activePresetId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#1A1F2E]'
                }`}
                title={p.description}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Currency Toggle Desktop */}
          <div className="hidden md:flex items-center bg-[#151926] p-1 rounded-lg border border-[#1E2333]">
            <button
              onClick={() => onCurrencyChange('INR')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currency === 'INR' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => onCurrencyChange('USD')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                currency === 'USD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Share Scenario */}
          <button
            onClick={onShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#181D2B] hover:bg-[#20273A] text-slate-200 border border-[#242C40] transition-colors"
            title="Copy shareable link with scenario state"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Share Link</span>
              </>
            )}
          </button>

          {/* Investor Memo Export */}
          <button
            onClick={onOpenMemo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/25 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Memo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
