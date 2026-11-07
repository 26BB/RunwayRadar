# 📐 Financial Mathematics & Simulation Specification

**Project Name:** RunwayRadar  
**Author:** Bhushan Bhosale  
**Reference Framework:** Paul Graham's *"Default Alive or Default Dead"* & Standard SaaS Corporate Finance  

---

## 1. Core Mathematical Definitions

### 1.1 Gross Burn vs. Net Burn
At any given month $t$:
$$\text{HeadcountBurn}(t) = \sum_{h \in \text{Hires}} \begin{cases} 0 & \text{if } t < h.\text{startMonth} \\ h.\text{salary} \times (1.25 \text{ if } h.\text{isFullyLoaded} \text{ else } 1.0) & \text{if } t \ge h.\text{startMonth} \end{cases}$$

$$\text{GrossBurn}(t) = \text{FixedBurn} + \text{HeadcountBurn}(t)$$

$$\text{Revenue}(t) = \text{MRR}_0 \times (1 + g_{\text{eff}})^t$$

Where $g_{\text{eff}}$ is the effective monthly growth rate:
$$g_{\text{eff}} = \begin{cases} g_{\text{base}} & \text{if Nuclear Winter is OFF} \\ g_{\text{base}} \times 0.50 & \text{if Nuclear Winter is ON} \end{cases}$$

$$\text{NetBurn}(t) = \text{GrossBurn}(t) - \text{Revenue}(t)$$

---

## 2. Default Alive vs. Default Dead Derivation

### The Paul Graham Test:
> *"Does our current growth rate cause us to reach profitability before our current money runs out?"*

Let $C(t)$ represent cash balance at month $t$, where $C(0) = \text{Cash In Bank}$.
For each subsequent month $t \in [1, 2, \dots, T]$:
$$C(t) = C(t-1) - \text{NetBurn}(t-1)$$

### Classification Rules:
1. **Default Alive:**
   There exists a month $t^* \le T$ such that:
   $$\text{Revenue}(t^*) \ge \text{GrossBurn}(t^*) \quad \text{AND} \quad \forall t \le t^*, \; C(t) > 0$$
   *Meaning:* The startup reaches break-even without cash hitting zero at any point.

2. **Default Dead:**
   There exists a month $t_{\text{cliff}}$ such that $C(t_{\text{cliff}}) \le 0$ before $\text{Revenue}(t) \ge \text{GrossBurn}(t)$.

3. **Cash-Flow Positive (Already Alive):**
   $\text{NetBurn}(0) \le 0$ (Current revenue already covers gross operating expenses).

---

## 3. Runway Drag Calculation

A critical metric for Founder's Office decisions is **Runway Drag**:
$$\Delta \text{Runway} = \text{Runway}_{\text{Baseline (No Hires)}} - \text{Runway}_{\text{With Planned Hires}}$$

- If baseline runway is 14.5 months, and adding 2 engineers reduces runway to 9.2 months:
  $$\text{Runway Drag} = -5.3 \text{ months}$$
- This gives the founder an instant, quantitative risk metric to debate during executive hiring reviews.

---

## 4. Edge Cases & Guardrails

| Condition | Mathematical Risk | Engine Treatment |
| :--- | :--- | :--- |
| **Negative Growth Rate ($g < 0$)** | Revenue decays exponentially toward 0. | Allowed. Models churn-heavy or declining businesses truthfully. |
| **Gross Burn = 0** | Infinite runway / division by zero. | Hardcoded cap at 120 months (10 years) labeled `"Indefinite / Zero Spend"`. |
| **Revenue Already > Burn** | Net Burn is negative. | Status displays `"Cash Flow Positive / Infinite Runway"`, runway counter shows `∞`. |
| **Zero Cash at Day 0** | $C(0) \le 0$. | Immediate `CRITICAL: Cash Depleted` state with 0 months remaining. |
| **Simulation Horizon** | Infinite while loops. | Simulation hard-capped at 60 months (5 years) to prevent browser thread locking. |

---

## 5. Currency & Formatting Standardization

RunwayRadar supports both Indian Lakhs/Crores (INR) and Western Thousands/Millions (USD):

- **INR Mode:**
  - $\ge ₹1,00,00,000 \rightarrow$ Formatted as `₹X.XX Cr`
  - $\ge ₹1,00,000 \rightarrow$ Formatted as `₹X.XX L`
  - $< ₹1,00,000 \rightarrow$ Formatted with standard Indian commas (`₹XX,XXX`)
- **USD Mode:**
  - $\ge \$1,000,000 \rightarrow$ Formatted as `$X.XX M`
  - $\ge \$1,000 \rightarrow$ Formatted as `$X.XK`
