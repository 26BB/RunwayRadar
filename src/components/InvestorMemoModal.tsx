import React, { useState } from 'react';
import { FinancialState, SimulationResult } from '../types';
import { generateMarkdownMemo, generateWhatsAppSummary } from '../lib/memoGenerator';
import { X, Copy, Check, MessageSquare, FileText, Building } from 'lucide-react';

interface InvestorMemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: FinancialState;
  result: SimulationResult;
  shareUrl: string;
}

export const InvestorMemoModal: React.FC<InvestorMemoModalProps> = ({
  isOpen,
  onClose,
  state,
  result,
  shareUrl,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'markdown' | 'whatsapp'>('markdown');
  const [companyName, setCompanyName] = useState('Runway Labs');
  const [copied, setCopied] = useState(false);

  const markdownMemo = generateMarkdownMemo(state, result, {
    companyName,
    shareUrl,
  });

  const whatsappMemo = generateWhatsAppSummary(state, result, {
    companyName,
    shareUrl,
  });

  const activeContent = activeTab === 'markdown' ? markdownMemo : whatsappMemo;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = activeContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div
        className="bg-[#0D0F15] border border-white/[0.08] rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-zinc-400" /> Executive & Investor Memo Export
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Instant standardized updates for Notion, WhatsApp, Slack, or Board Communications
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Company Name & Format Switcher */}
        <div className="px-5 py-3 bg-zinc-900/40 border-b border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Building className="w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="px-2.5 py-1 text-xs bg-zinc-900 border border-white/[0.08] rounded-md text-white font-medium focus:outline-none focus:border-white/20 w-full sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-white/[0.08]">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'markdown'
                  ? 'bg-zinc-800 text-white shadow-xs border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'whatsapp'
                  ? 'bg-zinc-800 text-white shadow-xs border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Formatted Code View */}
        <div className="p-5 overflow-y-auto font-mono text-xs bg-[#08090C] text-zinc-300 flex-1 leading-relaxed whitespace-pre-wrap select-all">
          {activeContent}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900/60 border-t border-white/[0.06]">
          <span className="text-[11px] text-zinc-400 font-mono">
            {activeTab === 'markdown' ? 'Notion & Slack Markdown ready' : 'WhatsApp single-click bolding'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 shadow-sm transition-all active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
