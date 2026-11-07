# 🎯 RunwayRadar PM Quality Scoring Rubric

**Passing Threshold:** $\ge 90 / 100$ Points  
**Circuit Breaker:** Max 3 Evaluation Rounds to prevent infinite loops.

---

### 1. Design & Visual Aesthetics (25 Points)
- **Token Consistency (7 pts):** Strict palette usage (Cosmic Void `#090A0F`, Card `#12151E`, Border `#1E2330`, Emerald `#10B981`, Rose `#F43F5E`, Indigo `#6366F1`).
- **Typography & Hierarchy (6 pts):** Clean distinction between primary KPIs (large font, JetBrains Mono numbers) and contextual labels.
- **Micro-Interactions & Sliders (6 pts):** Smooth range sliders, reactive hover states, toggle switches.
- **Chart Presentation (6 pts):** Recharts AreaChart with subtle gradient fills, readable gridlines, glowing stroke accents, responsive width.

### 2. Financial Math & Accuracy (25 Points)
- **Month-by-Month Compounding (7 pts):** $\text{Revenue}(t) = \text{MRR}_0 \times (1 + g_{\text{eff}})^t$ with discrete calculation.
- **Fully Loaded Payroll Multiplier (6 pts):** Accurate $1.25\times$ toggle on planned headcount.
- **Default Alive/Dead Logic (6 pts):** Flawless detection of crossover point where $\text{Revenue}(t^*) \ge \text{GrossBurn}(t^*)$ while $C(t) > 0$.
- **Edge Cases & Guardrails (6 pts):** Fractional zero-cash cliff calculation ($t + \frac{C(t)}{\text{NetBurn}(t)}$), bounds checking for $C(0) \le 0$ or already profitable.

### 3. Architecture & Reliability (25 Points)
- **Strict TypeScript (7 pts):** Zero `any` types, exhaustive interface coverage.
- **Build & Test Health (7 pts):** Zero TypeScript compiler errors (`tsc --noEmit`), passing Vitest suite.
- **Separation of Concerns (6 pts):** Pure logic in `lib/financialMath.ts`, clean presentation components.
- **Sub-16ms Performance (5 pts):** Pure client-side calculations with instant re-render upon input change.

### 4. Founder UX & Executive Utility (25 Points)
- **1-Click Executive Memo (8 pts):** Modal generating clean Markdown and WhatsApp formatted summaries with single-click copy.
- **Crisis Mode: Nuclear Winter (7 pts):** Prominent toggle simulating $50\%$ growth cut and delayed fundraising with survival recommendations.
- **URL Serialization (5 pts):** Shareable scenario links via `URLSearchParams` allowing instant sharing without account creation.
- **Currency Toggle (5 pts):** Seamless switching between `INR (₹)` (Lakhs/Crores) and `USD ($)` (Thousands/Millions).
