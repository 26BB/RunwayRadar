# 🏗️ Technical Architecture & Design System: RunwayRadar

**Project Name:** RunwayRadar  
**Author:** Bhushan Bhosale  
**Target Architecture:** React 19 + TypeScript + Vite + Tailwind CSS + Recharts  

---

## 1. System Topology & Data Flow

RunwayRadar is architected as an **uncompromisingly fast, deterministic client-side financial simulator**. Zero server roundtrips, zero latency, zero database dependencies.

```
┌────────────────────────────────────────────────────────┐
│                      Browser Window                    │
│                                                        │
│  ┌──────────────┐    ┌──────────────────────────────┐  │
│  │ URL Search   │───▶│  RunwayContext (State Core)  │  │
│  │ Parameters   │◀───│  - Cash, Revenue, MoM Growth │  │
│  └──────────────┘    │  - Fixed Burn, Headcount List│  │
│                      │  - Nuclear Winter Flag       │  │
│                      └──────────────┬───────────────┘  │
│                                     │                  │
│                                     ▼                  │
│                      ┌──────────────────────────────┐  │
│                      │ Financial Math Engine (Pure) │  │
│                      │ - Month-by-Month Simulation  │  │
│                      │ - Default Alive/Dead Check   │  │
│                      │ - Zero-Cash Date Detection   │  │
│                      └──────────────┬───────────────┘  │
│                                     │                  │
│          ┌──────────────────────────┼────────────────┐ │
│          ▼                          ▼                ▼ │
│  ┌──────────────┐         ┌────────────────┐ ┌──────────────┐
│  │ Vital Signs  │         │ Dynamic Hiring │ │ Trajectory   │
│  │ Cards (KPIs) │         │ Sandbox Panel  │ │ Recharts     │
│  └──────────────┘         └────────────────┘ └──────────────┘
│                                     │                  │
│                                     ▼                  │
│                           ┌────────────────┐           │
│                           │ Investor Memo  │           │
│                           │ Modal (Export) │           │
│                           └────────────────┘           │
└────────────────────────────────────────────────────────┘
```

---

## 2. Directory & Component Hierarchy

```
runwayradar-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Header.tsx             // Logo, Currency Toggle (INR/USD), Share Link Button
│   │   ├── VitalSigns.tsx         // Big KPI Cards: Runway, Net Burn, Default Alive Status
│   │   ├── FinancialInputs.tsx    // Cash, MRR, Growth %, Fixed Burn Inputs
│   │   ├── HeadcountSandbox.tsx   // Add/Remove Hires, Fully Loaded 1.25x Toggle, Start Month
│   │   ├── NuclearWinterToggle.tsx// Crisis Mode Simulation Button
│   │   ├── TrajectoryChart.tsx    // Recharts AreaChart (Cash Balance vs. MRR vs. Burn)
│   │   └── InvestorMemoModal.tsx  // 1-Click Markdown / WhatsApp Text Generator
│   ├── lib/
│   │   ├── financialMath.ts       // Pure mathematical simulation & curve modeling
│   │   ├── urlSerialization.ts   // Compression/decompression of state to URL params
│   │   └── presets.ts             // Pre-configured profiles (Pre-seed, Seed, Bootstrapped)
│   ├── types/
│   │   └── index.ts               // TypeScript interfaces for state, hires, and simulation
│   ├── App.tsx                    // Main layout & grid coordination
│   ├── index.css                  // Tailwind v4 utility setup
│   └── main.tsx                   // React DOM root
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Data Structures & TypeScript Interfaces

```typescript
export interface PlannedHire {
  id: string;
  role: string;
  salaryMonthly: number;
  startMonthOffset: number; // 0 = immediate, 1 = next month, etc.
  isFullyLoaded: boolean;   // true = 1.25x multiplier applied
}

export interface FinancialState {
  currency: 'INR' | 'USD';
  cashInBank: number;
  currentMRR: number;
  momGrowthRate: number;    // 0.10 = 10%
  fixedMonthlyBurn: number;
  hires: PlannedHire[];
  isNuclearWinter: boolean; // 50% growth penalty + 2-month delay
}

export interface MonthlySimulationStep {
  monthIndex: number;
  monthName: string;
  startingCash: number;
  endingCash: number;
  revenue: number;
  fixedBurn: number;
  headcountBurn: number;
  totalBurn: number;
  netBurn: number;
  isAlive: boolean;
}

export interface SimulationResult {
  runwayMonths: number;
  zeroCashDate: string | null; // e.g. "Nov 2027" or "Self-Sustaining"
  isDefaultAlive: boolean;
  breakevenMonth: number | null;
  timeline: MonthlySimulationStep[];
  runwayDragFromHires: number; // delta in months caused by active hires
}
```

---

## 4. UI / UX Design System (Mercury & Linear Aesthetic)

To convey executive gravitas, RunwayRadar enforces a strict design token hierarchy:

### Color Palette
- **Canvas / Background:** `#090A0F` (Deep Cosmic Void)
- **Surfaces & Cards:** `#12151E` with subtle border `#1E2333`
- **Primary Highlights:**
  - Electric Emerald (`#10B981`): `Default Alive`, positive cashflow, safe runway.
  - Flame Amber (`#F59E0B`): `Warning Zone` (under 6 months runway).
  - Crimson Rose (`#F43F5E`): `Default Dead`, cash exhaustion, crisis alert.
- **Accents:** Indigo / Slate (`#6366F1`) for interactive sliders and toggle states.
- **Typography:** Inter or Plus Jakarta Sans for UI labels; JetBrains Mono for all numeric financial values.

---

## 5. URL Query Parameter Serialization

To enable zero-login virality and instant co-founder sharing:
- When any input changes, `urlSerialization.ts` updates `window.history.replaceState` with encoded query parameters:
  `?cur=INR&cash=4500000&mrr=250000&g=12&burn=180000&hires=eng:150000:1,pm:100000:3&nw=0`
- Clicking **"Share Scenario"** copies the exact URL to the clipboard with a 2-second toast notification.

---

## 6. Build & Deployment Pipeline

- **Local Build:** `npm run build` generates optimized static assets in `/dist`.
- **Target:** Vercel Edge Network (`vercel --prod`). Zero runtime server costs, sub-second TTFB worldwide.
