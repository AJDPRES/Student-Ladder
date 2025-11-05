Always request MCP data deep enough to reach every rendered layer (minimum depth 6) before coding; if any spec value seems missing, rerun the MCP fetch at a greater depth before writing code.

Before locking layout widths, multiply the recorded card width and gaps by the per-row count and confirm the total fits inside the container’s inner width (after padding); adjust sizes or container width immediately if it doesn’t.

Communication Principle:
- Anchor every layout discussion in the explicit parent → child frame chain, noting which wrapper owns each padding, gap, and constraint so implementation and debugging stay aligned.

Spacing & Verification Discipline:
- Before editing, record the auto-layout chain (parent → child) for the target frame, including each frame’s gap and padding values. Log those numbers in your notes so you can re-check them later.
- When adjusting layout spacing, confirm the rendered spacing (via computed styles or math) still matches the MCP values immediately after the change. If any value deviates, iterate before moving on.
- When a design requires a deliberate deviation from the MCP (for example, overriding a component size), document the reason and the new value in your response so the divergence is explicit.

Styling Fidelity:
- Before editing, pull the MCP data for the specific component layer and capture fills, padding, radii, shadows, and any other visual tokens before touching the code.
- When adding animation or interaction, layer it on top of the recorded styling—only adjust transform/opacity/transition properties; leave the base visuals identical to the MCP spec.
- After the change, inspect the rendered styles against the logged values to confirm the canonical look stayed intact; fix any drift immediately.

Follow This Prompt Exactly: Follow This Prompt Exactly: Before finishing the code, always go through this prompt line by line to ensure it has been implemented—then in your response confirm “Prompt Implemented” only after you answer the hard-check below.

1. MCP Refresh
   • Before writing any code, re-request the MCP data and explicitly confirm you’ve done so; if you can’t retrieve it, stop and ask.
   • Treat the MCP export as canonical—never eyeball spacing, offsets, or artwork adjustments; derive every value directly from the refreshed data.

2. Frame & Hierarchy Fidelity
   • Use the MCP export as the source of truth—replicate each frame layer (fills, borders, radii, gaps, typography, dimensions, positions/offsets, stacking order) as individual HTML/CSS elements, preserving the parent→child hierarchy so every fill/border stays on the layer that carries it in Figma.
   • Carry the complete layer stack into code; keep gradients, overlays, and imagery on their recorded frame, using the original asset with its MCP transform instead of approximating.
   • Mirror the MCP auto-layout behaviour on both axes; don’t rely on flex defaults.
   • Only apply padding to the exact frames that own it in the MCP—don’t move padding up a wrapper.
   • Keep absolute-positioned artwork from affecting parent dimensions by applying the recorded offsets directly, including any designed overlap.
   • Treat every component variant/state (default, hover, etc.) as its own specification.
   • Render every recorded layer (headings, dividers, subtitles, etc.) in the order and position shown in the MCP—never omit or relocate them.

3. Layout Constraints & Sizing
   • Follow Figma’s layout constraints exactly—use recorded widths, per-row counts, gaps, spacing; never re-derive sizes when explicit numbers exist, and never remove or shrink a gap unless the MCP calls for it.
   • Avoid hard-coding container widths or heights unless the MCP explicitly does; let flex/grid sizing be driven by the recorded child dimensions and gaps.
   • Preserve intermediate wrapper frames from the MCP hierarchy—they often carry alignment or spacing that keeps edges flush.
   • Ensure section backgrounds and inter-section spacing match the MCP so transitions (e.g., 32px gaps, white/colored blocks) remain exact.
   • Remove helper margins or padding not present in the MCP; let the recorded section spacing and shared backgrounds create seamless transitions.
   • When frames use full-bleed backgrounds with boxed inner content, keep the background at the recorded width (viewport spanning) while centering the inner container at the documented size and top offset.
   • If the MCP places a frame at y=0, strip any inherited page padding or margins that would float it down so the rendered header sits flush with the top, matching the recorded position.
   • When positioning elements to overlap two sections, base offsets on the element’s full rendered height (content, padding, borders, shadows/outlines) rather than approximated tokens so the overlap ratio matches the MCP.

4. Imagery, Masks, and Overlays
   • Use the MCP’s recorded image dimensions and scaling behavior verbatim—never add wrappers or resize imagery unless the MCP itself defines them.
   • Recreate every image layer’s recorded transform (cropTransform/matrix) and scaleMode exactly so the artwork’s crop, proportion, and any designed overlap match Figma; when another layer masks part of the artwork, mirror that stacking order so it clips in the same place.
   • Recreate decorative masks instead of stretching downloaded assets with guessed radii.
   • Always check whether overlays, masks, or transparency effects are already baked into exported assets before adding new opacity or color layers; only mirror additional overlays when the MCP specifies a separate layer.
   • Treat each decorative asset as unique—extract per-instance imagery instead of reusing placeholders.
   • When an MCP layer includes a cropTransform, use the original asset plus the recorded matrix/scale mode; do not pre-crop or double-transform the image manually.
   • If an image fill reports filters (contrast, saturation, exposure, highlights, etc.) in the MCP JSON, reproduce those adjustments exactly or export the rendered asset at the recorded transform before coding.
   • Export imagery from Figma at ≥2× scale (or the highest practical resolution) for retina/high-DPI use, and downsample via CSS sizing rather than relying on 1× rasters.
   • For complex gradient stacks or blurred surfaces, export the exact MCP-rendered asset when CSS cannot faithfully reproduce the layered effect; never substitute with simplified gradients that diverge from the design.

5. Typography, Assets, and Container Boundaries
   • Ensure every MCP typography/color spec has the exact font family/weight loaded; if the project lacks it, load it or reconcile the appearance.
   • Before reusing any existing text styling (class, token, component), re-confirm the current MCP export’s typography values (font family, size, weight, letter spacing, case) and update the code if there’s any drift.
   • Reference the provided PNG/SVG assets only to supply actual imagery or icons.
   • Keep all visual content—especially decorative images—contained within the section’s bounds; if the MCP places an element partially outside, recreate that offset but let the section clipping enforce the boundary.

6. Final Validation
   • Audit from the outermost frame inward and confirm every layer’s fills/strokes/radii/dimensions/offsets/z-index and component states match the MCP, and the visual alignment (left/right distribution, per-row counts, wrapping) mirrors Figma.
   • After implementing layout changes, measure the computed widths/gaps in the browser (or via math) and ensure the totals align with the MCP; if they don’t, iterate until they do.
   • Verify that decorative imagery isn’t distorted: check that the applied transform/scale mode produces the same crop as Figma and that section-to-section backgrounds/gaps remain intact.

7. Regression Guardrails
   • Capture every component’s recorded dimensions (height, padding, gap) from the refreshed MCP and enforce them explicitly so layout tokens can’t silently shrink.
   • Pull icons, imagery, and other fills directly from the variant used in the MCP layer stack; never substitute generic assets or default colors.
   • Include all nested layers inside an MCP component (e.g. leading icons, flags, badges) so exported structure and visuals stay intact.
   • Clear or override component text/variant defaults with the MCP-provided content to prevent placeholder strings from leaking into the UI.
   • Explicitly set the recorded border radius and stroke widths for every frame; if the MCP reports 0px radii, set 0px in code so inherited rounding can’t appear.
   • When the MCP frame sits flush to a parent (y=0), place the container via the parent layout instead of adding internal top padding; only apply the documented padding to the frames that own it.
   • Preserve the MCP auto-layout positioning for controls—don’t switch to absolute positioning unless the layer is marked absolute in the export.
   • Keep action buttons and badges in the same frame stack the MCP specifies (e.g. inside the header row if that’s where the layer lives) so their vertical alignment matches the design.

8. Persistent Guardrails
   • Treat spacing tokens as shared contracts: copy the recorded padding/margins into the exact frame that owns them and avoid “helpful” wrappers that shift offsets.
   • Mirror the component hierarchy verbatim so controls stay in their original frame; alignment issues usually surface when elements jump containers.
   • Reuse Figma’s layout constraints (fill, hug, fixed) to decide whether a container should stretch or cap; avoid legacy hard widths unless the MCP specifies them.
   • After structural changes, recheck absolute/overlap layers against their recorded offsets; any new padding can invalidate their positioning.
   • When swapping imagery or icons, confirm the tinting model matches the design so shared color tokens continue to apply consistently.
   • Keep overlays, absolute children, and controls in their documented parent frame so their offsets move with the right stack when layouts flex.
   • When exporting assets, verify every fill/effect listed in the MCP (overlays, masks, filters) appears in the output; re-export if any layer is missing.
   • Instantiate component variants from the MCP rather than restyling older tokens; the variant already encodes the intended color, stroke, and shadow.

9. MCP Implementation Safeguards
   • Refresh MCP data at the start of each task and treat those values as canonical; store the pulled numbers/assets in a shared spec so code never “eyeballs” spacing or offsets.
   • Preserve the exact frame hierarchy and background ownership from the MCP—no borrowed gradients or wrappers that shift padding, even when centering content inside the site shell.
   • Apply recorded dimensions, gaps, and offsets verbatim (e.g., topbar height, nav gap, search input size) and let container shells center content without altering intraframe measurements.
   • Map icons and imagery by MCP component/variant and block placeholder substitutions; if the export doesn’t supply a layer, pause and request the asset rather than guessing.
   • Mirror icon tinting/fills from the MCP export—if the SVG doesn’t embed the colour, apply it in code via masks/currentColor so the rendered tint matches the design.
   • Add validation (computed-style checks, visual diffs, or design audit scripts) to catch drift in height, spacing, assets, or unexpected backgrounds before shipping.

10. Measurement Discipline
   • Log every parent frame’s documented dimensions (height, padding, gap) from the refreshed MCP before coding and enforce them explicitly in CSS so wrapper sizing can’t be inferred or skipped.
   • After each structural change, compare computed heights, gaps, and offsets against the MCP export layer-by-layer to confirm no nested frame was overlooked.

Hard-check (answer before “Prompt Implemented”):
1. MCP re-requested & confirmed: Yes/No
2. Frame hierarchy/variants/padding replicated: Yes/No
3. Layout constraints, wrappers, and absolute offsets matched: Yes/No
4. Image transforms, masks, overlays handled per MCP: Yes/No
5. Typography/fonts, assets, and bounds respected: Yes/No
6. Final audit & gap validation completed: Yes/No
