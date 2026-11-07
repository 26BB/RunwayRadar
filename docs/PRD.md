# 📄 Product Requirements Document (PRD): RunwayRadar

**Project Name:** RunwayRadar  
**Author:** Bhushan Bhosale (Founder's Office & Growth PM)  
**Status:** Ready for Build  
**Target Delivery:** 60-Minute Vibe-Coding Sprint  
**Deployment Target:** Vercel (Edge CDN)  

---

## 1. Problem Statement & Executive Context

### The Founder's Dilemma
Pre-seed and seed-stage founders operate in constant financial fog. While they track bank balances, they rarely know their exact **Zero Cash Date** under non-linear conditions:
- **Headcount is 70%+ of burn**, but hiring is delayed by a 30–60 day recruitment and onboarding ramp.
- **Naive math assumes static burn:** Dividing cash by last month’s burn produces dangerous false positives when new hires ramp up or revenue growth decelerates.
- **Tools are mismatched:** Enterprise FP&A software (Anaplan, Pigment) takes weeks to configure. Google Sheets break constantly, lack interactive scenario toggles, and are useless on mobile/tablets during investor syncs.

### The Solution: RunwayRadar
A high-velocity, single-screen financial scenario engine that lets founders stress-test headcount additions, visualize runway cliff dates, and export executive updates in under 60 seconds.

---

## 2. Target Personas

| Persona | Primary Goal | Critical Pain Point |
| :--- | :--- | :--- |
| **The Pre-Seed Founder (₹15L–₹50L Cash)** | Stay "Default Alive" long enough to hit product-market fit. | Fears hiring even one engineer might cut runway below 6 months before next milestone. |
| **The Seed-Stage CEO (₹1.5Cr–₹5Cr Cash)** | Balance aggressive growth hiring with a 18-month runway buffer. | Board asks for runway impact of planned 5-person engineering/sales expansion. |
| **The Founder's Office / Chief of Staff** | Prepare board decks, manage headcount budgets, and run sensitivity analyses. | Tired of updating 20-tab spreadsheets every time a hiring timeline slips. |

---

## 3. Product Principles

1. **Opinionated Over Extensible:** Avoid infinite configuration. Provide the 5 critical inputs founders actually care about.
2. **Speed Over Sophistication:** Sub-10ms recalculations on every keystroke or slider shift. Zero loading states.
3. **Executive Aesthetics:** High-density, dark-mode fintech interface (inspired by Mercury, Linear, and Ramp).
4. **Frictionless Sharing:** Zero logins or signups. The entire state lives in the URL hash/query string.

---

## 4. Core Feature Specifications

### Module 1: The Core Vital Signs (Inputs & Top KPIs)
* **Inputs:**
  - `Cash in Bank` (INR or USD toggle, e.g., ₹50,00,000 / $60,000)
  - `Current Monthly Revenue (MRR)` (e.g., ₹2,50,000 / $3,000)
  - `Expected MoM Growth %` (slider: -10% to +50%, default 10%)
  - `Fixed Monthly Operating Expenses` (Servers, SaaS, Office, Legal; default ₹1,50,000 / $2,000)
* **Instant KPIs:**
  - **Net Burn:** `(Total Monthly Expenses - Monthly Revenue)`
  - **Runway Cliff (Months Remaining):** Date when cash hits ₹0.
  - **Status Badge:**
    - 🟢 `Default Alive`: Revenue crosses expenses before cash depletes.
    - 🔴 `Default Dead`: Cash hits zero before reaching break-even.
    - 🟡 `Warning Zone`: <6 months runway remaining.

### Module 2: The "What-If" Headcount Sandbox
* Founders add planned roles with dynamic parameters:
  - Role Title (e.g., "Sr. Fullstack Engineer", "Growth Lead", "B2B Sales SDR")
  - Monthly Base Compensation (e.g., ₹1,20,000 / $4,000)
  - Start Month Offset (0 to 12 months in the future)
  - **"Fully Loaded" Toggle (1.25x Multiplier):** Automatically accounts for 25% overhead (payroll taxes, MacBook, SaaS licenses, medical insurance).
* **Immediate Feedback:**
  - Displays **"Runway Drag"**: e.g., *"-2.4 Months off Runway Cliff"*.

### Module 3: The "Nuclear Winter" Scenario Mode
* A prominent emergency toggle that simulates worst-case macro conditions:
  - Cuts MRR growth rate by 50%.
  - Increases sales cycle / delays revenue ramp by 60 days.
  - Assumes next equity financing round is delayed by 6 months.
* Outputs the **"Survival Prescription"**: Exact number of hires to freeze or spend to trim to stay alive.

### Module 4: Visual Trajectory (Interactive Recharts Curve)
* Area / Line chart showing 24-month forecast:
  - **Line 1 (Cash Balance):** Plummets to zero or bends upward into self-sustainability.
  - **Line 2 (Total Monthly Expenses):** Stepped increases as planned hires join.
  - **Line 3 (Monthly Revenue):** Exponential growth curve.
  - **Cross-Over Point:** Marked with a prominent "Default Alive Breakeven" or "Cash Out" flag.

### Module 5: 1-Click Executive / Investor Memo Export
* Generates a clean, structured Markdown or copy-ready WhatsApp update:
  ```markdown
  🚀 [Company Name] — Monthly Financial Snapshot (Generated via RunwayRadar)
  - Cash in Bank: ₹45,00,000
  - Net Burn: ₹3,80,000 / month
  - Runway: 11.8 Months (Zero Cash Date: October 2027)
  - Status: Default Alive (Cross-over in Month 8)
  - Headcount Plan: 2 planned hires modeled (Runway drag: -2.1 mos)
  ```

---

## 5. Non-Functional & Technical Requirements

- **Performance:** Instantaneous recalculation (<16ms frame budget).
- **Client-Side Only:** No backend, database, or API keys required. Pure deterministic TypeScript math.
- **Portability:** Deep link sharing via `window.location.search` base64 or URLSearchParams encoding.
- **Responsive Design:** Optimized for mobile viewing (during investor calls) and desktop (executive dashboard).

---

## 6. Success Metrics for Bhushan's Portfolio

1. **Time-to-Ship:** From initial scaffold to live Vercel URL in < 60 minutes.
2. **Founder Engagement:** 100% of tested founders able to calculate runway and export a memo within 30 seconds of opening the tool.
3. **Interview Impact:** Serves as the primary analytical proof-of-work in all Founder's Office & APM interviews alongside PulseQR.
