import { FinancialState, SimulationResult } from '../types';
import { formatCurrency, calculateHeadcountBurnForMonth } from './financialMath';

interface MemoOptions {
  companyName?: string;
  shareUrl?: string;
}

/**
 * Generates an executive Markdown memo ready for Notion, Slack, or Email.
 */
export function generateMarkdownMemo(
  state: FinancialState,
  result: SimulationResult,
  options: MemoOptions = {}
): string {
  const company = options.companyName?.trim() || 'Founders War Room';
  const currency = state.currency;
  const initialHiresBurn = calculateHeadcountBurnForMonth(state.hires, 0);
  const initialGrossBurn = state.fixedMonthlyBurn + initialHiresBurn;
  const initialNetBurn = initialGrossBurn - state.currentMRR;
  const growthPct = Math.round(state.momGrowthRate * 100);

  const statusEmoji = result.isDefaultAlive ? '🟢' : result.runwayMonths < 6 ? '🔴' : '🟡';
  const statusText = result.classification === 'CASH_FLOW_POSITIVE'
    ? 'Cash-Flow Positive / Self-Sustaining'
    : result.classification === 'DEFAULT_ALIVE'
    ? `Default Alive (Breakeven Month ${result.breakevenMonth})`
    : `Default Dead (Depletes in ${result.runwayMonths} mos)`;

  const lines: string[] = [
    `# 🚀 ${company} — Runway & Headcount Snapshot`,
    `*Generated via RunwayRadar (Nov 7, 2026)*`,
    '',
    '## 📊 Executive Vital Signs',
    `- **Cash In Bank:** ${formatCurrency(state.cashInBank, currency)}`,
    `- **Current MRR:** ${formatCurrency(state.currentMRR, currency)} (${growthPct}% MoM Growth)`,
    `- **Gross Monthly Burn:** ${formatCurrency(initialGrossBurn, currency)} (Fixed: ${formatCurrency(state.fixedMonthlyBurn, currency)} + Headcount: ${formatCurrency(initialHiresBurn, currency)})`,
    `- **Net Monthly Burn:** ${formatCurrency(initialNetBurn, currency)} / month`,
    `- **Runway Cliff:** ${isFinite(result.runwayMonths) ? `${result.runwayMonths} Months (${result.zeroCashDate})` : 'Infinite / Self-Sustaining'}`,
    `- **Survival Status:** ${statusEmoji} **${statusText}**`,
    '',
    '## 👥 Planned Headcount Impact',
    state.hires.length === 0
      ? '- *No planned hires currently modeled.*'
      : [
          `- **Planned Additions:** ${state.hires.length} role${state.hires.length > 1 ? 's' : ''}`,
          `- **Runway Drag:** ${result.runwayDragFromHires > 0 ? `-${result.runwayDragFromHires} Months` : '0 Months (Sustainable)'}`,
          ...state.hires.map(
            (h) =>
              `  - **${h.role}**: ${formatCurrency(h.salaryMonthly, currency)}/mo (Start: M${h.startMonthOffset}, ${h.isFullyLoaded ? '1.25x Loaded' : 'Base'})`
          ),
        ].join('\n'),
    '',
  ];

  if (state.isNuclearWinter) {
    lines.push(
      '## ⚠️ Crisis Scenario: Nuclear Winter Active',
      '- Growth rate penalized by 50% with a 60-day enterprise revenue freeze.',
      `- **Survival Action:** ${result.survivalPrescription || 'Freeze non-critical hires and conserve cash reserves.'}`,
      ''
    );
  }

  if (options.shareUrl) {
    lines.push('---', `🔗 **Interactive Model:** [${options.shareUrl}](${options.shareUrl})`);
  }

  return lines.join('\n');
}

/**
 * Generates compact, WhatsApp-styled formatted summary.
 */
export function generateWhatsAppSummary(
  state: FinancialState,
  result: SimulationResult,
  options: MemoOptions = {}
): string {
  const company = options.companyName?.trim() || 'Founders War Room';
  const currency = state.currency;
  const initialHiresBurn = calculateHeadcountBurnForMonth(state.hires, 0);
  const initialGrossBurn = state.fixedMonthlyBurn + initialHiresBurn;
  const initialNetBurn = initialGrossBurn - state.currentMRR;
  const growthPct = Math.round(state.momGrowthRate * 100);

  const statusEmoji = result.isDefaultAlive ? '🟢' : result.runwayMonths < 6 ? '🔴' : '🟡';
  const statusText = result.classification === 'CASH_FLOW_POSITIVE'
    ? 'Self-Sustaining'
    : result.classification === 'DEFAULT_ALIVE'
    ? `Default Alive (M${result.breakevenMonth} Breakeven)`
    : `Default Dead (${result.runwayMonths} mos)`;

  const lines = [
    `🚀 *${company} — Financial Runway Radar*`,
    `📅 _${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}_`,
    '',
    `💰 *Cash:* ${formatCurrency(state.cashInBank, currency)}`,
    `📈 *MRR:* ${formatCurrency(state.currentMRR, currency)} (+${growthPct}% MoM)`,
    `🔥 *Net Burn:* ${formatCurrency(initialNetBurn, currency)}/mo`,
    `⏳ *Runway:* *${isFinite(result.runwayMonths) ? `${result.runwayMonths} Months` : 'Infinite'}* (${result.zeroCashDate})`,
    `${statusEmoji} *Status:* ${statusText}`,
    '',
    `👥 *Hiring Plan:* ${state.hires.length} planned role(s) | *Drag:* -${result.runwayDragFromHires} mos`,
  ];

  if (state.isNuclearWinter) {
    lines.push('', '🚨 *NUCLEAR WINTER ACTIVE (50% Growth Cut)*');
  }

  if (options.shareUrl) {
    lines.push('', `🔗 *Live Scenario:* ${options.shareUrl}`);
  }

  return lines.join('\n');
}
