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
| **RR-02** | Core Design System & Tokens | `stitch-agent` | 🟢 Completed | Tailwind v4 palette, Mercury/Linear dark theme, typography tokens, responsive grid, UI component blueprints delivered. |
| **RR-03** | Core Simulation Math Engine | `engg-agent` | 🟢 Completed | Pure deterministic TypeScript math, compounding MRR, 1.25x loaded overhead, Default Alive logic, 14/14 unit tests passing. |
| **RR-04** | UI Componentry & Visuals | `stitch-agent` + `engg-agent` | 🟡 In Assembly | Vital Signs Cards, Headcount Sandbox, Trajectory Chart (Recharts glow area), Nuclear Winter toggle. |
| **RR-05** | URL Serialization & Memo Export | `engg-agent` | 🟡 In Assembly | URL query parameter sync via `replaceState`, 1-click Markdown / WhatsApp memo modal with clipboard toast. |
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
- **Status:** 🟢 Completed
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
  3. **Component Blueprints Delivered:**
     - `Header`, `VitalSigns`, `FinancialInputs`, `HeadcountSandbox`, `NuclearWinterToggle`, `TrajectoryChart`, `InvestorMemoModal`.

---

### 🏷️ RR-03: Core Simulation Math Engine & Scaffolding
- **Assignee:** `engg-agent` (Production Software Engineer)
- **Status:** 🟢 Completed
- **Scope & Objectives:**
  1. **TypeScript Interfaces (`src/types/index.ts`):** Complete data models (`FinancialState`, `PlannedHire`, `SimulationResult`, etc.).
  2. **Deterministic Math Engine (`src/lib/financialMath.ts`):**
     - Discrete month-by-month compounding MRR and stepped headcount burn with 1.25x loaded multipliers.
     - Fractional Zero-Cash cliff calculation: $t_{\text{cliff}} = t + \frac{C(t)}{\text{NetBurn}(t)}$.
     - Paul Graham Default Alive classification.
     - Runway Drag calculation: $\Delta \text{Runway}$.
  3. **Unit Test Suite (`src/lib/financialMath.test.ts`):** 14/14 tests passing.

---

### 🏷️ RR-04: UI Componentry & Visuals Integration
- **Assignee:** `stitch-agent` + `engg-agent`
- **Status:** 🟡 In Assembly
- **Scope & Objectives:**
  - Build React components adhering to Stitch design tokens and connecting to Engg's state manager.
  - Recharts AreaChart with Emerald gradient cash curve, Rose stepped burn line, and Cyan MRR line.
  - Interactive tooltips, zero-cash cliff vertical marker, and break-even crossover flag.

---

### 🏷️ RR-05: URL Serialization & Memo Export
- **Assignee:** `engg-agent`
- **Status:** 🟡 In Assembly
- **Scope & Objectives:**
  1. `src/lib/urlSerialization.ts`: Two-way sync: state to query parameters without page reload.
  2. `src/lib/memoGenerator.ts` & `InvestorMemoModal.tsx`: Markdown and WhatsApp summary exports.

---

### 🏷️ RR-06: Quality Audit & Scoring Review
- **Assignee:** `pm-agent`
- **Status:** ⚪ Queued (Triggers post RR-04 & RR-05)
- **Scope & Objectives:**
  - Execute audit against the 100-point rubric.
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

#### 👑 PM Agent (`pm-agent`)
> **To:** `stitch-agent` (UI Architect) & `engg-agent` (Lead Engineer)  
> **Directive:** Sprint 1 is greenlit. Detailed tickets RR-01 through RR-06 active on the board.

#### 🎨 Stitch Agent (`stitch-agent`)
> **Status:** Delivered RR-02 design tokens, CSS styling variables, and full component blueprints for all 7 UI components in accordance with WCAG 2.2 AA and Mercury/Linear dark mode aesthetics.

#### ⚙️ Engineering Agent (`engg-agent`)
> **Status:** Delivered RR-03 core financial math engine (`financialMath.ts`), TypeScript data models (`types/index.ts`), URL serialization, presets, memo generator, and 14/14 unit tests passing in Vitest. Assembling UI wiring.
