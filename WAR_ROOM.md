# 🛰️ RunwayRadar — Multi-Agent Executive War Room

> **Active Sprint:** RunwayRadar 0-to-1 Build & Verification  
> **Repository:** [https://github.com/26BB/RunwayRadar](https://github.com/26BB/RunwayRadar)  
> **Sprint Cadence:** Continuous Loop until PM Score ≥ 90/100 (Circuit Breaker: Max 3 Iterations)  
> **Sprint Head:** PM Agent (`pm-agent`)  
> **UI Architect:** Stitch Agent (`stitch-agent`)  
> **Lead Engineer:** Engineering Agent (`engg-agent`)  

---

## 🧭 Live Sprint Board

| Task ID | Component / Area | Assignee | Status | Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **RR-01** | PRD & Technical Breakdown | `pm-agent` | 🟢 Completed | Detailed specs, data contracts, math definitions, and agent work packages documented. |
| **RR-02** | Core Design System & Tokens | `stitch-agent` | 🟡 In Progress | Tailwind v4 palette, Mercury/Linear dark theme, typography tokens, responsive grid, UI component blueprints. |
| **RR-03** | Core Simulation Math Engine | `engg-agent` | 🟡 In Progress | Pure deterministic TypeScript math, compounding MRR, 1.25x loaded overhead, Default Alive logic, unit tests. |
| **RR-04** | UI Componentry & Visuals | `stitch-agent` + `engg-agent` | ⚪ Queued | Vital Signs Cards, Headcount Sandbox, Trajectory Chart (Recharts glow area), Nuclear Winter toggle. |
| **RR-05** | URL Serialization & Memo Export | `engg-agent` | ⚪ Queued | URL query parameter sync via `replaceState`, 1-click Markdown / WhatsApp memo modal with clipboard toast. |
| **RR-06** | Quality Audit & Scoring Review | `pm-agent` | ⚪ Queued | Comprehensive audit against 100-point rubric (Target: ≥ 90 points). |

---

## 📋 Granular Ticket Specifications

### 🏷️ RR-01: PRD & Architectural Technical Breakdown
- **Assignee:** `pm-agent`
- **Status:** 🟢 Completed
- **Deliverables:**
  - Standardized financial math formulas for Gross Burn, Net Burn, MRR compounding, and Runway Drag.
  - Contract specification between UI state and math engine (`FinancialState` ➡️ `SimulationResult`).
  - Sprint execution plan and task allocations for `stitch-agent` and `engg-agent`.

---

### 🏷️ RR-02: Core Design System & Tokens
- **Assignee:** `stitch-agent` (UI Design & Styling Architect)
- **Status:** 🟡 In Progress
- **Scope & Objectives:**
  1. **Color Palette & Visual Tokens (Mercury/Linear Aesthetic):**
     - Base Canvas: Deep Cosmic Void `#090A0F` (`bg-[#090A0F]`).
     - Card Surfaces: Obsidian Slate `#12151E` (`bg-[#12151E]`) with subtle hairline border `#1E2333` (`border-[#1E2333]`).
     - State Accents:
       - 🟢 Electric Emerald (`#10B981`): Default Alive, positive cashflow, safe runway (>12 mo).
       - 🟡 Flame Amber (`#F59E0B`): Warning zone (6–12 mo runway).
       - 🔴 Crimson Rose (`#F43F5E`): Default Dead, runway cliff (<6 mo), critical depletion.
       - 🟣 Neon Indigo (`#6366F1`): Interactive sliders, active buttons, focus states.
  2. **Typography Hierarchy:**
     - Headings & Labels: Inter / Plus Jakarta Sans (`font-sans font-medium text-slate-200`).
     - Financial Numerics: JetBrains Mono / tabular figures (`font-mono tracking-tight font-semibold`).
  3. **Component Blueprints:**
     - `Header`: Radar icon with glow pulse, Title badge, Currency switcher (`INR` / `USD`), Preset selector (`Pre-seed`, `Seed`, `Bootstrapped`), "Share Scenario" button.
     - `VitalSigns`: Top 3 KPI cards with top ambient glow borders:
       1. Runway Remaining (Large monospace number + dynamic `DEFAULT ALIVE` / `DEFAULT DEAD` / `WARNING` badge).
       2. Net Burn (Total Expenses minus Revenue).
       3. Runway Drag (Headcount cost penalty, e.g. `-2.8 mos`).
     - `FinancialInputs`: Minimalist cards for Cash in Bank, MRR, MoM Growth %, Fixed Monthly Burn with dual number input + range sliders.
     - `HeadcountSandbox`: List of planned roles with monthly compensation, start month offset (0–12m), 1.25x fully loaded toggle, role removal, and "Add Planned Role" modal/row.
     - `NuclearWinterToggle`: High-urgency crisis mode switch with pulsing warning glow.
     - `TrajectoryChart`: 24–36 month Recharts Area/Line chart styling specification with custom dark tooltip and gradient fills.
     - `InvestorMemoModal`: Sleek slide-over or modal with dual tabs (Markdown & WhatsApp formatted) and copy button.

---

### 🏷️ RR-03: Core Simulation Math Engine & Scaffolding
- **Assignee:** `engg-agent` (Production Software Engineer)
- **Status:** 🟡 In Progress
- **Scope & Objectives:**
  1. **Project Scaffolding:**
     - Initialize Vite React + TypeScript app in `/app`.
     - Install dependencies: `lucide-react`, `recharts`, `clsx`, `tailwind-merge`, `@tailwindcss/vite`.
  2. **TypeScript Interfaces (`src/types/index.ts`):**
     - Define `Currency`, `PlannedHire`, `FinancialState`, `MonthlySimulationStep`, `SimulationResult`, `ScenarioPreset`.
  3. **Deterministic Math Engine (`src/lib/financialMath.ts`):**
     - Implement discrete month-by-month simulation (up to 60 months horizon).
     - $\text{GrossBurn}(t) = \text{FixedBurn} + \sum \text{HireSalary} \times (1.25 \text{ if loaded else } 1.0)$.
     - $\text{Revenue}(t) = \text{MRR}_0 \times (1 + g_{\text{eff}})^t$. If Nuclear Winter is ON: $g_{\text{eff}} = 0.5 \times g_{\text{base}}$ with a 2-month ramp freeze.
     - $\text{NetBurn}(t) = \text{GrossBurn}(t) - \text{Revenue}(t)$.
     - Cash update: $C(t+1) = C(t) - \text{NetBurn}(t)$.
     - Exact fractional Zero-Cash calculation: $t_{\text{cliff}} = t + \frac{C(t)}{\text{NetBurn}(t)}$.
     - Calculate Default Alive condition: $\exists t^*$ where $\text{Revenue}(t^*) \ge \text{GrossBurn}(t^*)$ while $C(t) > 0 \; \forall t \le t^*$.
     - Compute Runway Drag: $\Delta \text{Runway} = \text{Runway}_{\text{Baseline (no hires)}} - \text{Runway}_{\text{Active Hires}}$.
     - Handle all edge cases: $C(0) \le 0$, GrossBurn = 0, NetBurn $\le 0$ at Month 0 (Cash flow positive / Infinite runway), negative growth rates.
  4. **Unit Test Suite (`src/lib/__tests__/financialMath.test.ts`):**
     - Validate Paul Graham Default Alive scenario.
     - Validate Default Dead cliff detection.
     - Validate 1.25x fully loaded headcount overhead.
     - Validate zero-cash and infinite-runway edge cases.

---

### 🏷️ RR-04: UI Componentry & Visuals Integration
- **Assignee:** `stitch-agent` + `engg-agent`
- **Status:** ⚪ Queued
- **Scope & Objectives:**
  - Build React components adhering to Stitch design tokens and connecting to Engg's state manager.
  - Implement real-time reactive updates: any input change triggers `<16ms` recalculation without stutter.
  - Implement Recharts AreaChart with Emerald gradient cash curve, Rose stepped burn line, and Cyan MRR line.
  - Add interactive tooltips, zero-cash cliff vertical marker, and break-even crossover flag.

---

### 🏷️ RR-05: URL Serialization & Memo Export
- **Assignee:** `engg-agent`
- **Status:** ⚪ Queued
- **Scope & Objectives:**
  1. `src/lib/urlSerialization.ts`:
     - Two-way sync: state to query parameters and query parameters to initial state.
     - Clean compact parameter encoding: `?cur=INR&cash=5000000&mrr=250000&g=10&burn=150000&hires=...&nw=0`.
     - Updates browser URL via `window.history.replaceState` without triggering page reload.
     - "Share Scenario" button copies URL to clipboard with 2.5s visual toast.
  2. `src/lib/memoGenerator.ts` & `InvestorMemoModal.tsx`:
     - Instant generation of formatted Markdown summary for email / Notion / investor updates.
     - WhatsApp/Slack plain text formatted snapshot with key emojis and bullet points.

---

### 🏷️ RR-06: Quality Audit & Scoring Review
- **Assignee:** `pm-agent`
- **Status:** ⚪ Queued (Triggers post RR-04 & RR-05)
- **Scope & Objectives:**
  - Execute audit against the 100-point rubric.
  - Test edge cases, responsiveness, mobile ergonomics, and mathematical precision.
  - Score must achieve $\ge 90/100$ for release sign-off.

---

## 🎯 PM Scoring Rubric (100 Points Total)

| Category | Weight | Evaluation Criteria |
| :--- | :--- | :--- |
| **1. Design & Visual Aesthetics** | **25 pts** | Mercury/Linear dark theme, consistent 4px grid, font pairings (Inter + JetBrains Mono), chart glow gradients, zero visual clutter. |
| **2. Financial Math & Simulation Accuracy** | **25 pts** | Exact Paul Graham Default Alive logic, discrete monthly net burn, 1.25x fully loaded multiplier, accurate runway drag, proper edge case bounds. |
| **3. Architecture & Engineering Quality** | **25 pts** | Clean React 19 + TypeScript, zero type errors (`tsc --noEmit`), pure deterministic math engine, sub-16ms recalculation budget, test coverage. |
| **4. Founder Experience & Executive Utility** | **25 pts** | 1-Click WhatsApp/Markdown memo generator, Nuclear Winter stress test, URL state sharing, intuitive slider and preset controls. |

**Release Gate:** Total Score $\ge 90/100$ required for production sign-off.

---

## 💬 Inter-Agent Communication Feed

### Round 1: Sprint Kickoff & Task Assignment

**From:** PM Agent (`pm-agent`) — Sprint Head & Lead PM  
**To:** Stitch Agent (`stitch-agent`) & Engineering Agent (`engg-agent`)  
**Timestamp:** Sprint Kickoff (Cycle 1)  

> **Executive Directive:**
> Welcome to Sprint Cycle 1 for **RunwayRadar**. We are building a high-velocity, executive-grade financial scenario simulator for pre-seed and seed-stage founders. Our benchmark is the visual polish of Linear/Mercury and the mathematical precision of Paul Graham's *Default Alive* model.
>
> **Action Items for `stitch-agent`:**
> 1. Review `docs/ARCHITECTURE.md` Section 4 and ticket `RR-02`.
> 2. Implement the Tailwind v4 design tokens: Cosmic Void `#090A0F`, Obsidian `#12151E`, Border `#1E2333`, Emerald `#10B981`, Amber `#F59E0B`, Rose `#F43F5E`, Indigo `#6366F1`.
> 3. Architect the component blueprints for `Header`, `VitalSigns`, `FinancialInputs`, `HeadcountSandbox`, `NuclearWinterToggle`, `TrajectoryChart`, and `InvestorMemoModal`.
> 4. Ensure typography mandates JetBrains Mono for all numeric values and Inter/Plus Jakarta Sans for UI copy.
>
> **Action Items for `engg-agent`:**
> 1. Review `docs/FINANCIAL-MATH-SPEC.md`, `docs/ARCHITECTURE.md`, and ticket `RR-03`.
> 2. Scaffold the application in `/app` (Vite + React + TypeScript + Tailwind v4 + Lucide + Recharts).
> 3. Implement `src/types/index.ts` with complete data models (`FinancialState`, `PlannedHire`, `SimulationResult`, etc.).
> 4. Implement `src/lib/financialMath.ts` ensuring deterministic, pure mathematical simulation including fractional cliff interpolation, 1.25x fully loaded compensation, 60-month horizon cap, and runway drag calculation.
> 5. Create `src/lib/__tests__/financialMath.test.ts` verifying Default Alive/Dead conditions and edge cases.
> 6. Prepare `urlSerialization.ts` and `memoGenerator.ts` for integration in `RR-05`.
>
> **Next Sync:** Both agents report back once `RR-02` blueprints and `RR-03` math core/scaffold are complete. You are clear to build!
