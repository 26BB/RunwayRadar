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
  const [companyName, setCompanyName] = useState('Acme Technologies');
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
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = activeContent;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#12151E] border border-[#242C40] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2333]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" /> Executive & Investor Memo Export
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              1-click formatted updates ready for WhatsApp, Slack, Notion, or Board Decks
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1C2234] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Company Name & Tabs Bar */}
        <div className="px-6 py-3.5 bg-[#0E111A] border-b border-[#1E2333] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Building className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company Name"
              className="px-2.5 py-1 text-xs bg-[#151926] border border-[#242C40] rounded-lg text-white font-semibold focus:outline-none focus:border-indigo-500 w-full sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#151926] p-1 rounded-xl border border-[#242C40]">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'markdown'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown</span>
            </button>
            <button
              onClick={() => setActiveTab('whatsapp')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'whatsapp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="p-6 overflow-y-auto font-mono-num text-xs bg-[#090A0F] text-slate-200 flex-1 leading-relaxed whitespace-pre-wrap select-all selection:bg-indigo-500/30">
          {activeContent}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-[#0E111A] border-t border-[#1E2333]">
          <span className="text-xs text-slate-500">
            {activeTab === 'markdown' ? 'Compatible with Notion, GitHub & Email' : 'Optimized with WhatsApp bolding (*)'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-emerald-300">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
