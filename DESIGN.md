# Design: RunwayRadar

The locked design system. Formulated for high-stakes executive navigation, founder runway modeling, and algorithmic headcount planning. Built on Google Stitch's "Obsidian Capital Cockpit" foundation and bound by Hallmark's strict anti-slop craft floor.

## System
- Genre: modern-minimal
- Shape of the first page: app screen (Founder War Room Cockpit)
- Theme: custom (Obsidian Capital Cockpit)
- Vibe: "obsidian telemetry, hairline precision, tabular figures"
- Axes: slate/hairline/emerald · posture: default-alive cockpit

## Tokens
`src/tokens.css` and `src/index.css` are the sources of truth. The roles:

```css
:root {
  /* Surfaces & Bedrock Canvas (Stitch Obsidian Hierarchy) */
  --canvas: oklch(0.12 0.008 260);              /* #08090C Deep Obsidian Bedrock */
  --canvas-deep: oklch(0.09 0.006 260);         /* #06070A Inset Bedrock */
  --card-surface: oklch(0.16 0.012 260);        /* #0D1017 Layer 1 Modular Card */
  --card-surface-recessed: oklch(0.19 0.015 260);/* #131722 Layer 2 Recessed Pod */
  --card-hover: oklch(0.22 0.018 260);          /* #1A2030 Elevated Hover */

  /* Hairline Structural Framing */
  --border-hairline: oklch(0.26 0.02 260);       /* #1E2333 1px Architectural Hairline */
  --border-hairline-hover: oklch(0.32 0.025 260); /* #2A3045 Active/Hover Divider */
  --border-subtle: rgba(255, 255, 255, 0.06);

  /* Semantic Dynamic Telemetry */
  --primary-emerald: oklch(0.72 0.17 155);      /* #10B981 Default Alive / Cash Accretive */
  --cliff-rose: oklch(0.65 0.22 18);            /* #F43F5E Zero-Cash Cliff / Headcount Drag */
  --warn-amber: oklch(0.75 0.16 68);            /* #F59E0B Warning Horizon */
  --radar-cyan: oklch(0.78 0.12 225);           /* #38BDF8 Projections & Steppers */

  /* High-Contrast Typographic Pigments */
  --text-high: oklch(0.97 0.005 260);           /* #F1F5F9 High-Emphasis Figures */
  --text-med: oklch(0.73 0.015 260);            /* #94A3B8 Secondary Telemetry */
  --text-muted: oklch(0.48 0.018 260);          /* #475569 Deactivated / Metadata */
  --thumb-tint: oklch(0.98 0.005 260);          /* Tinted thumb */

  /* Typographic Roles */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Architectural Radii (Chiseled Machined Profile) */
  --radius-sm: 4px;
  --radius-card: 12px;
  --radius-pill: 9999px;
}
```

## Typographic Discipline
- **Prose & System Labels**: `Plus Jakarta Sans` / `system-ui`. Set in sentence case, untracked, never tracked capitals or small caps (Hallmark Floor 9).
- **Telemetry Figures & Amounts**: `JetBrains Mono` strictly with `font-variant-numeric: tabular-nums` (Indian INR `₹1.50 Cr`, USD `$120k`, percentages `+15% MoM`, month indexes `M14`, countdowns `21.4 mos`). Monospace is never applied to decorative labels or prose (Hallmark Reflex 64).

## Layout & Structural Grid
- Fixed max measure capped at `max-w-7xl` (`1280px`), centered, gutters grow at larger viewports (Hallmark Floor 14).
- 4 Bento KPI Vital Cards at the head of the dashboard.
- Full-width Interactive Recharts Area & Stepped Burn Trajectory.
- 2-Column Split: Core Financial Parameters (left) + Headcount Hiring Sandbox (right).
- Macro Shock "Nuclear Winter" crisis stress-test bar.

## Controls & Interaction
- **Primary Buttons**: High-contrast, 8px radius, targeted transitions (`transition-colors duration-150`). Never `transition: all`.
- **Focus States**: Instant `:focus-visible` ring (`outline: 1px solid var(--primary-emerald)`).
- **Reduced Motion**: Full fallback under `@media (prefers-reduced-motion: reduce)` (Hallmark Floor 7).
- **Disabled Controls**: Explicit `:disabled:opacity-50 :disabled:cursor-not-allowed` on all interactive form inputs (Hallmark Reflex 26b).

## Anti-Slop Safeguards
- Zero purple-to-blue generic AI gradients.
- Zero decorative dot strings (`·`) or glued link arrows.
- Zero cards-inside-cards without clear planar hierarchy.
- Zero invented metrics or placeholder statistics.
