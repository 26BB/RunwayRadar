# 🛰️ RunwayRadar — The Founder Runway & Headcount War Room

> **"Can I afford this hire without dying in 6 months?"**  
> An opinionated, zero-BS financial runway and headcount scenario simulator built for pre-seed and seed-stage founders. Shipped by **Bhushan Bhosale** (Founder's Office & Growth PM).

[![Live on Vercel](https://img.shields.io/badge/Production-runwayradar.vercel.app-10B981?style=for-the-badge&logo=vercel)](https://runwayradar.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-26BB%2FRunwayRadar-6366F1?style=for-the-badge&logo=github)](https://github.com/26BB/RunwayRadar)
[![Tests Passing](https://img.shields.io/badge/Vitest-14%2F14%20Passing-10B981?style=for-the-badge&logo=vitest)](https://github.com/26BB/RunwayRadar)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Zero--Error-3178C6?style=for-the-badge&logo=typescript)](https://github.com/26BB/RunwayRadar)
[![Design](https://img.shields.io/badge/Design-Anti--Generic%20Taste-EC4899?style=for-the-badge)](https://github.com/26BB/RunwayRadar)

---

## 🚀 Live Production Cockpit
👉 **[https://runwayradar.vercel.app](https://runwayradar.vercel.app)**  
*(Instant client-side evaluation, zero database dependencies, URL-sharable state)*

![RunwayRadar Luxury Dark Mode Interface](docs/assets/hero-preview.png)

---

## 🎯 Executive Overview & Product Context

Most financial modeling software (Excel, Pry, Causal) is bloated with 40-tab spreadsheets, fragile circular formulas, and steep onboarding curves. Early-stage founders don't need discounted cash flow (DCF) valuations—they need instant, deterministic answers to three life-or-death questions:
1. **What is our true Zero-Cash Cliff Date?**
2. **Are we "Default Alive" or "Default Dead" under current growth?** (Paul Graham framework)
3. **What is the exact runway drag of hiring 1 Senior Engineer vs. 2 Growth Leads?**

**RunwayRadar** eliminates the spreadsheet friction with a real-time, interactive, client-side financial cockpit designed with institutional Mercury/Linear-grade aesthetics.

---

## 📄 Product Requirements Document (PRD Summary)

*Authored by Bhushan Bhosale (Lead Product Manager & Sprint Head)*  
*Full document available at [`docs/PRD.md`](docs/PRD.md)*

### 1. Target Personas & Core Pain Points

| Persona | Primary Goal | Critical Pain Point |
| :--- | :--- | :--- |
| **The Pre-Seed Founder** (₹15L–₹50L / $20k–$60k) | Reach PMF before bank balance hits ₹0. | Dividing cash by last month's burn gives dangerous false optimism when onboarding hires. |
| **The Seed-Stage CEO** (₹1.5Cr–₹5Cr / $200k–$600k) | Balance aggressive hiring targets with an 18-month safety runway. | Board requires sensitivity analysis on the runway drag of a 4-person engineering expansion. |
| **Founder's Office / Chief of Staff** | Prepare monthly board updates and run scenario planning. | Tired of updating fragile 20-tab spreadsheets every time a hiring start date slips. |

### 2. Product Principles

1. **Opinionated Over Extensible:** Avoid infinite configuration. Provide the 5 critical levers founders actually care about.
2. **Speed Over Sophistication:** Sub-10ms recalculations on every keystroke or slider shift. Zero loading states.
3. **Anti-Generic Taste Design:** Deep obsidian canvas (`#08090C`), hairline card borders (`border-white/[0.06]`), tabular figures in `JetBrains Mono`, and strict ban on amateur emojis and neon purple glows.
4. **Frictionless Collaboration:** Zero logins or signups. The entire financial scenario state lives in the URL hash/query string for 1-click sharing.
5. **Deterministic Rigor:** Mathematical precision with fractional cliff dates, discrete compounding revenue, and loaded headcount overheads.

---

## ⚡ Core Modules & Capabilities

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RUNWAYRADAR ARCHITECTURE                        │
├──────────────────┬───────────────────┬─────────────────────────────────┤
│  Top Command Bar │ Live Radar Pulse  │ Segmented Presets & Currencies  │
├──────────────────┴───────────────────┴─────────────────────────────────┤
│  4 Bento Vital Sign Cards:                                             │
│  [ Runway Horizon ] [ Net Monthly Burn ] [ Headcount Drag ] [ PG Verdict]
├──────────────────────────────────────┬─────────────────────────────────┤
│  Financial Trajectory Curve          │ Interactive Recharts Area/Line  │
│  (Cash Balance vs MRR vs Gross Burn) │ Breakeven Crossover Marker      │
├──────────────────────────────────────┼─────────────────────────────────┤
│  Core Capital & Growth Parameters    │ Headcount Sandbox ("What-If")   │
│  - Bank Cash Reserves                │ - Multi-role roster             │
│  - Current MRR                       │ - Start month offsets (M+0..12) │
│  - MoM Growth Rate (-10% to +50%)    │ - 1.25x Loaded Cost Toggle      │
│  - Non-Payroll Fixed OPEX            │ - Real-time Runway Drag impact  │
├──────────────────────────────────────┴─────────────────────────────────┤
│  "Nuclear Winter" Crisis Mode (50% Growth Cut, +60-Day Sales Lag)      │
│  1-Click Investor Briefing Export (Markdown & WhatsApp Ready)          │
└────────────────────────────────────────────────────────────────────────┘
```

### Module 1: Vital Signs & Paul Graham Test
- **Runway Horizon:** Computes fractional Zero-Cash Date cliff ($t + \frac{C(t)}{\text{NetBurn}(t)}$).
- **Net Monthly Burn:** Inflow (MRR) vs Outflow (OPEX + Stepped Payroll).
- **Headcount Drag:** Live delta metric showing exact months of runway lost to planned hires.
- **Paul Graham Default Alive/Dead Test:** Classifies whether compounding revenue overtakes gross burn before cash runs out.

### Module 2: "What-If" Headcount Sandbox
- Add custom roles (Engineering, Growth, Sales, Product) with monthly base salary.
- Configurable start offsets (e.g. Month 1, Month 3, Month 6).
- **1.25x Fully Loaded Overhead Multiplier:** Automatically models employer taxes, healthcare, workstation hardware, SaaS seats, and recruiter amortization.

### Module 3: "Nuclear Winter" Crisis Stress-Test
- Simulates sudden macroeconomic freeze:
  - Cuts MRR growth rate by 50%.
  - Extends sales cycles and delays revenue collections by 60 days.
  - Generates immediate **Survival Prescriptions** (e.g., *Freeze hiring beyond Month 2, trim non-payroll OPEX by 20% to regain 4.2 months*).

### Module 4: Trajectory & Crossover Projection
- Bloomberg/Mercury-caliber interactive curve plotting 12M, 24M, 36M, or 60M horizons.
- Visualizes the inflection point where compounding revenue crosses gross monthly burn.

### Module 5: 1-Click Investor & Co-Founder Memo
- Formats executive briefing notes into copy-pasteable Markdown and WhatsApp formats:
  ```markdown
  *RunwayRadar Executive Update — Pre-Seed Sandbox*
  • Bank Reserves: ₹30.00 L ($36.0k)
  • Net Monthly Burn: -₹30,000 /mo
  • Runway Horizon: Self-Sustaining (Infinite)
  • Paul Graham Verdict: Default Alive (Crossover: Month 6)
  • Headcount Roster: 1 active role (Drag: 0.0 mos)
  ```

---

## 🧮 Mathematical Engine Specifications

*Full derivations in [`docs/FINANCIAL-MATH-SPEC.md`](docs/FINANCIAL-MATH-SPEC.md)*

1. **Discrete Compounding Revenue:**
   $$\text{MRR}(t) = \text{MRR}_0 \times (1 + g)^t$$
2. **Stepped Loaded Headcount Burn:**
   $$\text{Payroll}(t) = \sum_{i \in \text{Hires}} \mathbf{1}_{\{t \ge \text{start}_i\}} \times \text{BaseSalary}_i \times (1.25 \text{ if loaded else } 1.0)$$
3. **Cash Balance Recurrence:**
   $$C(t) = C(t-1) - \max(0, \text{GrossBurn}(t) - \text{MRR}(t))$$
4. **Fractional Zero-Cash Cliff:**
   $$\text{Runway} = t^* + \frac{C(t^*)}{\text{GrossBurn}(t^* + 1) - \text{MRR}(t^* + 1)}$$

---

## 🤖 Multi-Agent Autonomous War Room & Quality Sign-Off

This repository was architected and shipped autonomously by a specialized trio of AI agents coordinated under the **Hermes Protocol**:

| Agent Persona | Role | Deliverables & Quality Gates |
| :--- | :--- | :--- |
| **`pm-agent`** | Sprint Head & Lead PM | Authored PRD, mathematical spec, defense deck, and conducted strict 100-point audit. |
| **`stitch-agent`** | Google Stitch Design Architect | Designed Anti-Generic design system, tokens, bespoke SVG radar, and Bento cards. |
| **`engg-agent`** | Production Software Engineer | Implemented pure math engine with 100% test coverage under the TDD Beyoncé Rule. |

### PM Audit Rubric Scorecard: **100 / 100 (PASSED)**

```json
{
  "sprint": "RunwayRadar 0-to-1 Build & Verification",
  "status": "APPROVED",
  "scoreSummary": {
    "currentScore": 100,
    "targetScore": 90,
    "status": "PASSED_PRODUCTION_READY"
  },
  "scores": {
    "PRD & Technical Breakdown": "20/20",
    "Design System & Tokens": "20/20",
    "Core Math Engine & Unit Tests": "20/20",
    "Interactive UI & Recharts Trajectory": "20/20",
    "URL Serialization & Memo Generator": "20/20"
  }
}
```

*Full war room audit log, ticket transitions, and dispatch transcripts are preserved in [`WAR_ROOM.md`](WAR_ROOM.md) and [`war-room/DISPATCH_LOG.md`](war-room/DISPATCH_LOG.md).*

---

## 📂 Complete Documentation Suite

All strategic product, architectural, and mathematical artifacts are committed to version control:

- 📄 [**`docs/PRD.md`**](docs/PRD.md): Complete Product Requirements Document.
- 📐 [**`docs/ARCHITECTURE.md`**](docs/ARCHITECTURE.md): Component hierarchy, state models, and design tokens.
- 🧮 [**`docs/FINANCIAL-MATH-SPEC.md`**](docs/FINANCIAL-MATH-SPEC.md): Mathematical proofs and edge-case handling.
- 🛡️ [**`docs/FOUNDER-INTERVIEW-DEFENSE.md`**](docs/FOUNDER-INTERVIEW-DEFENSE.md): YC Partner / Founder defense strategy and pitch.
- ⏱️ [**`docs/BUILD-PLAN-60MIN.md`**](docs/BUILD-PLAN-60MIN.md): 60-minute vibe-coding execution protocol.
- 🎖️ [**`WAR_ROOM.md`**](WAR_ROOM.md): Multi-agent audit board and verified scorecard.

---

## 🛠️ Local Development & Test Verification

```bash
# Clone the repository
git clone https://github.com/26BB/RunwayRadar.git
cd RunwayRadar

# Install dependencies
npm install

# Run Vitest financial math unit test suite
npm test

# Run Vite local development server
npm run dev

# Run strict TypeScript check and production build
npm run build
```

---

## 👤 Author & Context

**Bhushan Bhosale**  
- **GitHub:** [@26BB](https://github.com/26BB)  
- **LinkedIn:** [bhushan-bhosale-36aa48373](https://linkedin.com/in/bhushan-bhosale-36aa48373)  
- **Target Roles:** Founder's Office, Chief of Staff, Associate Product Manager (APM), Technical Growth  
- **Related Project:** [PulseQR](https://github.com/26BB/pulseqr) (0-to-1 B2B Cafe GTM & Ground Sales Pilot)
