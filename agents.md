# Agents Charter — Figma→Next.js High-Fidelity Delivery (v2)

## Prime Directive
Render **exactly what Figma shows**, at production quality, with minimal prompting. Use MCP Figma data as the **single source of truth** for layout, spacing, constraints, transforms, and visual tokens. Never “eyeball” values.

## Deep Figma Intake (Stricter)
- **Depth Strategy**: Default FIGMA layer fetch depth = **12**. If any of the following are detected, **escalate to FULL** (unbounded traversal with cycle protection) and state that you escalated:
  - masks or boolean operations
  - nested auto-layout > 6 levels
  - vector groups with transforms
  - component variants with interactive states
  - overlays or blends
- **Completeness Test** (must pass **before coding**):
  - For each target frame: you have **every rendered leaf** (text, vector, image, rect/line, icon).
  - You have **all parents** up to the root that contribute padding, gap, constraints, resizing, or clip.
  - You captured **resizing rules** (hug/fixed/fill + min/max), **stacks** (direction, gap), and **absolute offsets** where used.
  - If anything is missing, re‑fetch at greater depth **now**.

## Layout & Spacing Discipline
- **Parent→Child Chain**: Enumerate the full chain from page frame → leaf. Include: `layoutMode`, `padding`, `gap`, `constraints`, `resizing`, `itemSpacing`, `clipsContent`.
- **Lock Before Code**: Do not implement until you’ve emitted a **Pre‑Coding Layout Spec** (structured list of the chain with the exact numeric values) in your response.
- **Spacing Ledger**: For any change, log the **expected vs. rendered** gap/padding at S, M, L breakpoints. If off by ≥1px, iterate immediately.

## Styling Fidelity
- Pull **typography** (font family, size, weight, line‑height, letter‑spacing) and **effects** (shadow, blur), **fills/strokes**, **radii**, **blend modes**. Map directly to tokens/variables when available; otherwise set exact values.
- **Image/Vector Handling**: Preserve masks, gradients, and transforms. Maintain the layer that owns the visual so z‑index and clipping remain correct.

## Accessibility Baseline
- Each interactive layer requires: role, name, keyboard focus, disabled/pressed/selected states if applicable.
- Text contrast ≥ WCAG AA (flag and suggest exact token fix if not).
- Announce dynamic content regions with ARIA where needed.

## Output Contract (Mode‑Aware)
When producing code or patches, your response **must** include:
- **Unified diff** from repo root for every file you touch.
- **Assets list** to (re)export (names and expected paths).
- **HARD‑CHECK** (template provided by config) with **Yes/No** plus a one‑line **evidence note** per item.
- If a check is **No**, stop further features; fix parity first.

## File/Structure Conventions
- Next.js App Router: `app/<route>/page.tsx`, colocated `components/*`, route‑level `layout.tsx` for persistent chrome.
- **Server vs Client**: Default to server components; use `"use client"` only for interactivity. Do not leak client code into server trees.
- Import order: stdlib → third‑party → aliases → relatives. TypeScript strict on.
- Styling: prefer tokens/variables (or Tailwind if your project uses it) that directly encode Figma values. No “magic” numbers.

## Variant & State Handling
- Treat each variant/state in Figma as a **spec**. If the page requires a state, implement it; otherwise create a Storybook story (or test fixture) for it.

## Verification Protocol (Pixel & Runtime)
- Breakpoints: verify at **320, 768, 1024, 1440** (or your project defaults). Log any line wrap or overflow and fix.
- **SSR build** must pass; TypeScript and ESLint must be clean.
- Optional but recommended: produce a minimal Playwright/Vitest visual check for changed components.

---

# Mode Playbooks

## NEW (Create from Figma)
1. Fetch Figma at **depth 12 → escalate to FULL if completeness test fails**.
2. Emit the **Pre‑Coding Layout Spec** (parent→child chain with all numeric values).
3. Propose a minimal file plan (route path, components, assets).
4. Output a **single patch** that scaffolds the page: route file, components, styles/tokens, and necessary imports.
5. Emit the **HARD‑CHECK** with evidence lines.

## EDITF (Edit using Figma)
1. Re‑fetch the target frame(s) at **depth 12 (or current)** to avoid stale data.
2. State the **diff** between current code and Figma (spacing, constraints, text metrics, transforms).
3. Output a **patch** that fixes the diffs only (no opportunistic refactors unless needed for parity).
4. Emit the **HARD‑CHECK** with evidence.

## ASK (Question)
- No file edits. Provide direct answers citing the exact Figma nodes (frame name / node id) and the values you’d use.

## EDITX (Edit from Text Only)
- Figma/MCP is **forbidden**. Apply the requested change as a patch. If parity with Figma could be impacted, warn explicitly.

---

# Failure Rules
- If a required MCP call fails or data is incomplete: stop, report the missing scope, and **do not** guess values.
- If build/TS fails in your patch, fix within the same response.
- Never ship partial parity with “TODO later”. Parity first.