import { Currency, FinancialState, PlannedHire } from '../types';

/**
 * Encodes PlannedHire[] into a compact query-string friendly format:
 * "Role~Salary~StartMonth~IsLoaded;Role2~Salary2..."
 */
export function encodeHires(hires: PlannedHire[]): string {
  if (!hires || hires.length === 0) return '';
  return hires
    .map((h) => {
      const roleEncoded = encodeURIComponent(h.role);
      const loaded = h.isFullyLoaded ? 1 : 0;
      return `${roleEncoded}~${h.salaryMonthly}~${h.startMonthOffset}~${loaded}`;
    })
    .join(';');
}

/**
 * Decodes string back into PlannedHire[]
 */
export function decodeHires(raw: string | null): PlannedHire[] {
  if (!raw || raw.trim() === '') return [];
  try {
    const parts = raw.split(';');
    return parts.map((part, index) => {
      const [role, salary, offset, loaded] = part.split('~');
      return {
        id: `hire-url-${index + 1}-${Date.now()}`,
        role: decodeURIComponent(role || 'Engineer'),
        salaryMonthly: Number(salary) || 0,
        startMonthOffset: Math.max(0, parseInt(offset, 10) || 0),
        isFullyLoaded: loaded === '1' || loaded === 'true',
      };
    });
  } catch {
    return [];
  }
}

/**
 * Serializes FinancialState into URLSearchParams string.
 */
export function serializeStateToQueryParams(state: FinancialState): string {
  const params = new URLSearchParams();
  params.set('cur', state.currency);
  params.set('cash', state.cashInBank.toString());
  params.set('mrr', state.currentMRR.toString());
  // Store growth rate as a human percentage e.g. 15 for 0.15
  params.set('g', Math.round(state.momGrowthRate * 100).toString());
  params.set('burn', state.fixedMonthlyBurn.toString());
  params.set('nw', state.isNuclearWinter ? '1' : '0');

  const hiresEncoded = encodeHires(state.hires);
  if (hiresEncoded) {
    params.set('hires', hiresEncoded);
  }

  return params.toString();
}

/**
 * Deserializes URLSearchParams into FinancialState with graceful fallbacks.
 */
export function deserializeStateFromQueryParams(
  params: URLSearchParams,
  fallbackState: FinancialState
): FinancialState {
  try {
    const curParam = params.get('cur');
    const currency: Currency = curParam === 'USD' ? 'USD' : curParam === 'INR' ? 'INR' : fallbackState.currency;

    const cashParam = params.get('cash');
    const cashInBank = cashParam !== null && !isNaN(Number(cashParam)) ? Math.max(0, Number(cashParam)) : fallbackState.cashInBank;

    const mrrParam = params.get('mrr');
    const currentMRR = mrrParam !== null && !isNaN(Number(mrrParam)) ? Math.max(0, Number(mrrParam)) : fallbackState.currentMRR;

    const gParam = params.get('g');
    const momGrowthRate = gParam !== null && !isNaN(Number(gParam)) ? Number(gParam) / 100 : fallbackState.momGrowthRate;

    const burnParam = params.get('burn');
    const fixedMonthlyBurn = burnParam !== null && !isNaN(Number(burnParam)) ? Math.max(0, Number(burnParam)) : fallbackState.fixedMonthlyBurn;

    const nwParam = params.get('nw');
    const isNuclearWinter = nwParam !== null ? nwParam === '1' || nwParam === 'true' : fallbackState.isNuclearWinter;

    const hiresParam = params.get('hires');
    const hires = hiresParam !== null ? decodeHires(hiresParam) : fallbackState.hires;

    return {
      currency,
      cashInBank,
      currentMRR,
      momGrowthRate,
      fixedMonthlyBurn,
      hires,
      isNuclearWinter,
    };
  } catch {
    return fallbackState;
  }
}
