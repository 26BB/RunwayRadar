# 🛰️ RunwayRadar — The Founder Runway & Hiring War Room

> **"Can I afford this hire without dying in 6 months?"**  
> An opinionated, zero-BS financial runway and headcount scenario simulator built for pre-seed and seed-stage founders. Shipped by **Bhushan Bhosale** (Founder's Office & Growth PM).

[![Live on Vercel](https://img.shields.io/badge/Live-runwayradar.vercel.app-10B981?style=for-the-badge&logo=vercel)](https://runwayradar.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-26BB%2FRunwayRadar-6366F1?style=for-the-badge&logo=github)](https://github.com/26BB/RunwayRadar)

---

## 🚀 Live Production URL
👉 **[https://runwayradar.vercel.app](https://runwayradar.vercel.app)**

## 🎯 Executive Overview

Most financial modeling software (Excel, Pry, Causal) is bloated with 40-tab spreadsheets, fragile formulas, and steep learning curves. Early-stage founders don't need DCF valuations—they need instant answers to three high-stakes questions:
1. **What is our true Zero Cash Date (Runway Cliff)?**
2. **Are we "Default Alive" or "Default Dead" under current growth?** (Paul Graham framework)
3. **What is the real runway drag of hiring 1 Senior Engineer vs. 2 Growth Leads?**

**RunwayRadar** eliminates the spreadsheet friction with a real-time, interactive, client-side financial cockpit designed with Mercury/Linear-grade aesthetics.

---

## ⚡ Core Value Pillars

- **Dynamic Headcount Ramp Lag:** Models the real-world 45-day hiring lag + 1.25x fully loaded multiplier (payroll taxes, SaaS stack, laptop, recruiter fees) rather than naive base salary math.
- **The "Nuclear Winter" Scenario Toggle:** Instant 1-click stress test: *What if our next funding round slips 6 months and MRR growth cuts by 50%?*
- **Default Alive/Dead Milestones:** Real-time trajectory plotting using exponential MRR growth curves against escalating fixed + variable burn.
- **1-Click Investor & Co-Founder Briefing:** One-click generation of standardized Markdown/WhatsApp updates ready to paste into investor newsletters or team syncs.
- **URL-Serialized State:** Frictionless collaboration: serialize the entire financial model state directly into the browser URL query parameters for instant sharing without requiring database authentication.

---

## 📂 Project Architecture & Documentation Suite

Inside [`docs/`](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs):
- [**PRD.md**](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs/PRD.md): Complete Product Requirements Document, user personas, functional specifications, and success metrics.
- [**ARCHITECTURE.md**](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs/ARCHITECTURE.md): Technical architecture, component tree, state management, and design system specs.
- [**FINANCIAL-MATH-SPEC.md**](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs/FINANCIAL-MATH-SPEC.md): Mathematical derivations, edge cases (zero-division, profitability infinity, ramp curves), and benchmark assumptions.
- [**FOUNDER-INTERVIEW-DEFENSE.md**](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs/FOUNDER-INTERVIEW-DEFENSE.md): YC Partner / Founder Q&A defense, 30s elevator pitch, and CV bullet points.
- [**BUILD-PLAN-60MIN.md**](file:///c:/Users/Bhushan%20bhosale/Data_and_Docs/Growth%20PM/RunwayRadar/docs/BUILD-PLAN-60MIN.md): Step-by-step 60-minute vibe-coding execution protocol to ship on Vercel.

---

## 🛠️ Tech Stack & Deployment

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS v4 (Mercury/Linear dark-mode aesthetic)
- **Visuals & Charts:** Recharts (Area & Line charts with glowing gradient fills) + Lucide React
- **Persistence:** LocalStorage + URL Query Parameter state encoding
- **Deployment:** Vercel (Edge CDN, instantaneous builds)

---

## 👤 Author & Context

- **Author:** Bhushan Bhosale ([GitHub: @26BB](https://github.com/26BB) | [LinkedIn](https://linkedin.com/in/bhushan-bhosale-36aa48373))
- **Role Targets:** Founder's Office, Chief of Staff, Associate Product Manager (APM), Technical Growth
- **Complementary Project:** [PulseQR](https://github.com/26BB/pulseqr) (0-to-1 B2B Cafe GTM & Ground Sales Pilot)
