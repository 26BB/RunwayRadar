# ⏱️ 60-Minute Vibe-Coding Build Plan: RunwayRadar

**Project Name:** RunwayRadar  
**Author:** Bhushan Bhosale  
**Execution Target:** From Empty Directory to Live Production URL on Vercel in 60 Minutes  

---

## 🕒 Minute-by-Minute Sprint Timeline

```
[00:00 - 00:10] Setup & Scaffolding (Vite, TS, Tailwind v4, Lucide, Recharts)
[00:10 - 00:25] Pure Financial Math Core & Unit Test Suite
[00:25 - 00:45] Mercury/Linear UI Build: Inputs, Headcount Sandbox, Trajectory Chart
[00:45 - 00:55] Executive Features: Nuclear Winter Toggle & 1-Click Board Memo Export
[00:55 - 01:00] Production Verification & 1-Command Deploy to Vercel
```

---

## Step 1: Scaffolding & Dependencies (Minutes 0–10)

```bash
cd "C:\Users\Bhushan bhosale\Data_and_Docs\Growth PM\RunwayRadar"
npm create vite@latest app -- --template react-ts
cd app
npm install lucide-react recharts clsx tailwind-merge
npm install -D tailwindcss @tailwindcss/vite
```

Configure `vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

---

## Step 2: Pure Financial Math Core (Minutes 10–25)

File: `src/lib/financialMath.ts`
Implement pure deterministic simulation:
- Monthly compounding MRR curve
- Headcount start offsets and 1.25x loaded multipliers
- Discrete month-by-month cash subtraction
- Default Alive crossover point vs. Zero Cash Cliff detection
- Runway drag calculation

Verify edge cases:
- Gross Burn = 0 -> capped at 120 months
- Cashflow Positive from Month 0 -> `Infinity` / `Self-Sustaining`
- Negative growth rates -> graceful exponential decay

---

## Step 3: Executive UI & Visual Chart (Minutes 25–45)

1. **Header Component (`Header.tsx`):**
   - Brand icon (Radar dish) + "RunwayRadar"
   - Currency Toggle: `₹ INR` / `$ USD`
   - Share Scenario Button (copies URL with current state)
2. **Vital Signs Cards (`VitalSigns.tsx`):**
   - Big metric: `Runway Months` (e.g. `14.2 mos`) with color state (Green > 12m, Amber 6-12m, Red < 6m)
   - Secondary metric: `Current Net Burn`
   - Badge: `DEFAULT ALIVE` or `DEFAULT DEAD` with subtext
3. **Interactive Control Deck:**
   - Left side: Financial sliders (Cash, MRR, Growth %, Fixed Burn)
   - Center: Dynamic Headcount List (Add role button, salary input, start month slider, fully loaded toggle)
4. **Trajectory Curve (`TrajectoryChart.tsx`):**
   - Responsive `Recharts AreaChart`
   - Neon Emerald gradient for Cash Balance
   - Rose dashed line for Gross Burn
   - Cyan curve for MRR

---

## Step 4: Executive Weaponization (Minutes 45–55)

1. **The "Nuclear Winter" Toggle (`NuclearWinterToggle.tsx`):**
   - Red emergency button with flashing pulse effect
   - Instantly applies 50% growth haircut and recalculates runway
2. **The 1-Click Investor Memo Modal (`InvestorMemoModal.tsx`):**
   - Generates copyable Markdown & WhatsApp formatted status report
   - Includes timestamp, key figures, and headcount drag

---

## Step 5: Vercel Production Deployment (Minutes 55–60)

```bash
cd "C:\Users\Bhushan bhosale\Data_and_Docs\Growth PM\RunwayRadar\app"
npm run build
npx vercel --prod --yes
```

---

## 🎯 Verification Checklist

- [ ] Zero TypeScript errors (`npx tsc --noEmit`)
- [ ] Production build succeeds cleanly (`npm run build`)
- [ ] Sliders respond in real-time with sub-16ms latency
- [ ] URL parameters update dynamically upon slider changes
- [ ] Nuclear winter mode toggles cleanly and recalculates all charts
- [ ] Copy investor memo button copies formatted text with feedback toast
