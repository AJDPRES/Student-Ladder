# Agents Charter — Figma→Next.js Exactness (Output‑Parity)

## Prime Directive
Ship code that **matches Figma exactly as rendered**, not as inferred. Figma MCP data is the primary source of truth for layout, spacing, constraints, transforms, and visual tokens. If the design is messy or inconsistent, reconstruct the visual from the layers as seen and document the reconstruction.

## Deep Figma Intake
- **Depth Strategy**: Default depth = **12**. Escalate to **FULL** (unbounded with cycle protection) if any of the following appear:
  - masks/boolean ops, gradients, blends, overlays
  - nested auto‑layout > 6 levels
  - absolute layers mixed with stacked layout
  - component variants or interactive states
- **Completeness Test** (before coding):
  - Every **visible leaf** (text/vector/image/rect/line/icon) in scope is captured.
  - All **ancestor layers that affect layout** (padding, gap, constraints, resizing, clip) are captured.
  - **Resizing rules** (hug/fill/fixed + min/max) and absolute offsets are captured.
  - If anything is missing, re‑fetch at greater depth **now**.

## Layout & Reconstruction (works even on messy files)
- Build a **Parent→Child Chain** for each target frame. Include: `layoutMode`, `padding`, `gap`, `constraints`, `resizing`, `itemSpacing`, `clipsContent`, absolute offsets if present.
- If the design lacks clean auto‑layout:
  - **Flow reconstruction**: derive visual rows/columns by top‑to‑bottom / left‑to‑right ordering, snapping elements into lines when edges align within **±1px**.
  - **Column/Rail inference**: infer container widths from repeated alignment edges across siblings.
  - **Z‑order**: preserve rendered stacking using layer order + explicit `z-index` only when required.
- Lock these decisions in the **Pre‑Coding Layout Spec** before writing code.

## Styling & Effects
- Map **typography** (family/size/weight/line-height/letter-spacing) exactly. Allowed tolerance:
  - numeric rounding to integer pixels for line-height; letter-spacing ±0.1.
- Map **fills/strokes/radii/shadows/blur/blend/opacity** exactly.
- **Tokens**: if project tokens exist, map to them; otherwise embed exact values from Figma. No ad‑hoc styling.

## Accessibility Baseline
- Interactive layers: role, accessible name, keyboard focus order, disabled/pressed/selected states if applicable.
- Text contrast ≥ WCAG AA. Flag and suggest exact token if not.
- Announce dynamic regions with ARIA where needed.

## Output Contract (Mode‑Aware, strict order)
1) **PARITY-CHECK v1 — <MODE>** (verification banner at the top; see below).
2) **Spec Block**:
   - **NEW** → Pre‑Coding Layout Spec (parent→child chain with numeric values).
   - **EDITF** → Parity Diff (explicit property deltas vs. Figma).
   - **ASK** → Direct answers citing frame names/node ids and exact values.
   - **EDITX** → Brief intent + divergence warning if applicable.
3) **Unified diff** (single patch from repo root). No extra code or narrative after the patch.

## Parity Evidence (what to show in the banner)
- **Leaf Coverage**: show `covered/total` visible leaves for the target frames.
- **Anchor Set** (auto-selected each run):
  - root page frame, each major section container
  - all interactive elements in the primary viewport
  - largest text nodes by area and variant text nodes
  - elements with masks/gradients/absolute positioning
  - if total leaves ≤20, include all leaves; else include ≥20 representative leaves
- **Spacing/Alignment Ledger** (±0.5px tolerance):
  - For each anchor: list `Figma → Code → Δ` for padding/gap/margins/absolute offsets.
- **Typography Ledger**:
  - For each text anchor: family/size/weight/line-height/letter-spacing (`Figma → Code → Δ`).
- **Visual Ledger**:
  - Fills/strokes/radii/shadows/blur/blend/opacity (`Figma → Code`).
- **Transforms/Masks/Clip**:
  - Presence and parameters match (`Figma → Code`).
- **Responsive Proof**:
  - At 320/768/1024/1440: show 1–3 anchors with key computed widths/heights that demonstrate constraints/resizing are respected.
- **Traceability**:
  - Provide 5–10 selector ↔ node‑id pairs to prove styles originate from Figma.

## Verification Protocol (runtime)
- Verify at **320, 768, 1024, 1440** (or project defaults). Fix any overflows/wraps that contradict Figma constraints.
- Build must pass; TypeScript & ESLint must be clean.
- If a check fails, fix within the same response, or report the blocking missing data (specific node ids or properties) and stop.

## File/Structure Conventions
- Next.js App Router: `app/<route>/page.tsx`; colocate `components/*`; route‑level `layout.tsx` for persistent chrome.
- Default to **server components**; mark interactive pieces with `"use client"`.
- Styling: prefer tokens if available; otherwise set exact values. No magic numbers.
- Import order: stdlib → third‑party → aliases → relatives. TypeScript strict on.

## Variant & State Handling
- Each Figma variant/state is a **spec**. Implement required states; otherwise produce stories/fixtures for coverage.

## Failure Rules
- Missing MCP data → stop and request the specific frame/node ids needed (do not guess).
- Build/TS errors → fix within the same response.
- Do not ship partial parity with “TODO later”.

---

# Mode Playbooks

## NEW (Create from Figma)
1. Fetch Figma at **depth 12**; escalate to **FULL** if completeness fails.
2. Emit **Pre‑Coding Layout Spec** (parent→child chain with numeric values).
3. Propose a minimal file plan (route path, components, assets).
4. Output a **single patch** implementing the plan.
5. Print **PARITY-CHECK v1** (top of message) with coverage, ledgers, responsive proof, and traceability.

## EDITF (Edit using Figma)
1. Refresh Figma nodes (depth 12) to avoid staleness.
2. Emit a **Parity Diff** (explicit deltas vs. Figma).
3. Output a **patch** that corrects only those deltas.
4. Print **PARITY-CHECK v1** (top of message) proving the deltas are now zero/within tolerance.

## ASK (Question)
- No patches. Provide crisp answers citing frame names/node ids and exact values.

## EDITX (Edit from Text Only)
- Figma/MCP is **forbidden**. Apply the requested change as a patch.
- Warn if the change risks diverging from Figma parity.
- Still keep structure consistent where possible.