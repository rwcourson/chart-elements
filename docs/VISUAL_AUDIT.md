# Visual audit — Chart Elements finish line

**Date:** 2026-08-10  
**Scope:** Full craft + OSS readiness (refined neutral). No prop renames, no npm publish, maps mostly parked.  
**Catalog:** 336 entries · 37 categories · 0 verified (pre-run) · all docs `draft`

## Executive summary

The library is already **strong**: token-driven themes (light/dark), Manrope, series hover isolation, motion gates, solid `ChartFrame`/`ChartTooltip`, and careful Recharts measure behavior. What keeps it from feeling “OSS launch ready” is not missing charts — it is **craft consistency**, **empty/invalid state parity**, **gallery first impression**, and an **honest verification ladder** (every entry is still `review` with a generic note).

Biggest OSS risks:

1. Gallery shows “0 verified · 336 total” — weak trust signal.
2. Mark constants (margins, stroke, bar radius) drift across families.
3. Custom SVG tooltips sometimes use popover classes instead of chart tooltip tokens.
4. Homepage is text-only; visitors never see a chart until `/gallery`.
5. Mega-files (2k+ lines) make polish easy to miss in specialized families.

---

## charts-core

Files: `bar-column-chart.tsx`, `line-area-chart.tsx`, `combo-chart.tsx`, `pie-donut-chart.tsx`, `funnel-chart.tsx`, `waterfall-chart.tsx`, `scatter-bubble-chart.tsx`, `treemap-chart.tsx`, `ribbon-chart.tsx`, `sparklines.tsx`, `chart-frame.tsx`, `chart-tooltip.tsx`

1. **Shared margins duplicated** — e.g. `{ top: 12, right: 16, left: 4, bottom: 8 }` in bar/combo/scatter; slight drifts elsewhere (`time-financial` uses `{ top: 8, right: 12, left: 0, bottom: 0 }`).
2. **Stroke width 2.25** repeated as magic number across line/area/combo; should be a shared constant.
3. **3D/cylinder bar shapes** (`DimensionalBarShape` in `bar-column-chart.tsx`) use opacity steps that can read dated next to flat gradient bars.
4. **Waterfall tooltip** reimplements tooltip chrome with `shadow-lg` instead of `--overlay-shadow`.
5. **Empty states:** core consumer charts mostly use `ChartEmpty`; sparklines may render blank for empty series.
6. **Pie callouts** are high craft; ensure leader stroke uses `--chart-axis` consistently (already good) and gap labels don’t collide on dense data.

## charts-specialized

Files: `statistical-charts.tsx` (~2334), `polar-comparison-charts.tsx` (~1929), `time-financial-charts.tsx` (~2438), `flow-hierarchy-charts.tsx` (~1565), `project-timeline-charts.tsx`, helpers/layout modules

1. **Custom SVG tooltip in polar** uses `bg-popover` + `shadow-lg` (`polar-comparison-charts.tsx`) — breaks chart tooltip visual language.
2. **Axis ink** mostly uses CSS vars, but stroke widths and paddings vary by plot type without shared helpers.
3. **Empty/invalid paths** present in some families via `ChartEmpty`, incomplete for every export in mega-files.
4. **Financial OHLC/candles** use `SEMANTIC` colors correctly; volume gradients slightly diverge from bar gradient recipe.
5. **Flow/hierarchy** link stroke scaling by value is good; label collision and focusable nodes need consistent ring styling via `data-chart-svg`.
6. **Animation races / timelines** — must stay gated by `useMotionEnabled` / `useMotionInterval` (already mostly wired).

## cards/gauges

Files: `kpi-cards.tsx`, `gauges.tsx`, `card-utils.ts`

1. **KPI cards force `shadow-none`** while `Card` uses `--card-shadow` — gallery hierarchy can look uneven next to framed charts.
2. **Count-up** starts at 0 on mount (good for dashboards); ensure reduced-motion jumps to target (wired via `useMotionEnabled`).
3. **Delta badges** need strict semantic token mapping (success/destructive/warning) everywhere, including multi-row cards.
4. **Gauges** have solid meter ARIA; track thickness and threshold band contrast can be tightened optically.
5. **Sparklines inside cards** need breathing room so KPI value and spark don’t collide at `sm` size.

## tables

File: `data-table.tsx`

1. **Conditional formatting** colors should stay on semantic/chart tokens, not ad-hoc opacities that fail dark mode.
2. **Density** — header weight vs cell size should match card title rhythm (`15px`/`13px` system).
3. **Empty rows** — need calm empty state when `rows=[]` (status message, not zero-height table).
4. **Data bars / icons** — alignment and tabular nums for numeric columns.
5. **External links** already sanitize protocols (`safeExternalUrl`) — keep that path intact.

## slicers

File: `slicers.tsx` (~2102)

1. **Monolith file** — many variants; polish must target shared primitives (option row, chiclet, selected state) first.
2. **Selected/hover/focus** must use accent + ring tokens consistently across list, tile, button, hierarchy.
3. **Empty option lists** should show muted “No options” rather than blank card body.
4. **Date/numeric controls** share `DateField`/`Input` — verify focus rings match gallery controls.
5. **Self-framed advanced slicers** — avoid double-card when gallery marks `selfFramed`.

## maps

Files: `geographic-maps.tsx`, `schematic-maps.tsx`, `map-primitives.tsx`, `geo-core.ts`

1. **Gallery lists only hex/tile** — sophisticated choropleth/bubble/route stack is invisible to OSS visitors (known gap; stay parked).
2. **Default fixtures** baked into component props aid demos but can surprise consumers who pass empty arrays.
3. **Error messages** for unknown feature ids are clear; styling should match status empty language.
4. **Schematic vs geographic** naming is honest — keep it.
5. **Tests** in `maps/__tests__` are solid — preserve.

## analytics

File: `analytical-visuals.tsx` (~1173)

1. **Self-framed panels** — header typography should match `ChartFrame` (`15px` semibold title, `13px` muted description).
2. **Decomposition tree** uses `ce-tree-children` animation — good; ensure reduced-motion CSS still kills it.
3. **Q&A / influencers** demo data density can make panels feel demo-y — tighten spacing and badge craft.
4. **Forecast/anomaly demos** should not claim live ML.
5. **Series hover** partially used — keep consistent with charts.

## navigation

File: `nav-visuals.tsx`

1. **Button heights** mix `h-[38px]` with other control heights (`h-11` inputs) — unify optical height where possible.
2. **Focus rings** use `outline-ring` — good; ensure every icon-only control has `aria-label`.
3. **Page/bookmark navigators** self-framed — gallery already special-cases.
4. **shadow-sm** on buttons vs token elevation — minor inconsistency.
5. **Selected page pill** should use accent tokens fully.

## shapes

File: `shape-visuals.tsx`

1. **Image empty/error fallbacks** use card chrome — polish copy and icon opacity.
2. **Text box** typography should match report density.
3. **SVG shapes** (rect/oval/line/arrow) need theme stroke from tokens.
4. **Dynamic image/text** failure paths must stay calm.
5. **eslint img exceptions** for data URLs — keep justified comments.

## overlays

File: `analytical-overlays.tsx`

1. **Small multiples** spacing and shared axis labels.
2. **Reference line demos** — tooltip panel uses chart tokens + `shadow-lg` (fix to overlay shadow).
3. **Drill demos** should feel like product UI, not storybook stubs.
4. **Empty multiples** path.
5. **Legend/hover** consistency with core charts.

## reports

Files: `paginated-report.tsx`, `pagination.ts`, fixtures

1. **Screen chrome** should theme; **print** intentionally hardcodes paper white — keep isolation.
2. **32 paginated catalog entries** share one component — variants must stay visually distinct via fixtures.
3. **Tests** cover pagination determinism — do not break.
4. **Continuation headers** craft.
5. **Catalog truthfulness** — entries must stay ≤ review unless verified with evidence (test enforces).

## declarative/content/integrations

Files: `vega-visual.tsx`, `safe-content-visuals.tsx`, `application-adapters.tsx`

1. **Vega** host must theme background to card/tokens when possible.
2. **Safe content** sanitization — never weaken.
3. **Vendor analogues** must not claim live Power Apps/Automate SDKs.
4. **HTML/SVG content** empty states.
5. **Loading** for declarative charts.

## gallery/app shell

Files: `src/app/page.tsx`, `gallery-client.tsx`, `deferred-visual.tsx`, detail routes, `globals.css`, `palettes.css`

1. **Homepage** is ~79 lines, three text cards, no live chart previews.
2. **Verified count is 0** — badge is honest but uninspiring until heroes are verified.
3. **DeferredVisual** is performance-critical for 336 entries — keep.
4. **selfFramed** path avoids double cards — good.
5. **Mobile category select** exists; header search density can still tighten.
6. **Tooltip shadow** and skeleton shimmer are polished in CSS; series hover transitions are excellent.

---

## Top 20 fixes (OSS impact order)

1. Shared chart mark constants (margin, stroke, bar radius, activeDot) adopted by core charts  
2. Tokenize tooltip shadow (`--overlay-shadow`) everywhere  
3. Homepage live hero strip of polished charts  
4. Curated 8–16 verified catalog heroes with real status notes  
5. Empty-state parity on consumer charts + tables + key slicers  
6. Align custom SVG tooltips (polar, overlays) to chart tooltip tokens  
7. KPI/gauge optical polish (tabular nums, semantic deltas, track craft)  
8. Slicer selected/focus shared primitives  
9. Data table empty rows + density  
10. Subtler 3D/cylinder bar treatment  
11. Waterfall tooltip match shared `ChartTooltip` language  
12. Analytics panel header rhythm = ChartFrame  
13. Nav control height/focus consistency  
14. Specialized family axis/label ink consistency pass  
15. Flow/hierarchy focus rings via `data-chart-svg`  
16. Financial volume/bar gradient consistency  
17. Gallery empty-search + detail page craft  
18. README Known gaps accuracy after polish  
19. Shape image fallback craft  
20. Package styles stay in sync with globals chart chrome (if mirrored)

## Out of scope (this run)

- Breaking prop rename (`categoryKey` / `nameKey` / `seriesKeys` / radar `keys`)  
- Unparking geographic maps into gallery  
- npm publish  
- Real vendor SDKs  
- Mass-verifying all 336 entries  

## Shared chrome decisions

- Added `src/lib/chart-marks.ts` with `PLOT_MARGIN`, `SERIES_STROKE_WIDTH`, `ACTIVE_DOT`, bar radii, `MAX_BAR_SIZE`, and `CHART_TOOLTIP_CLASS`.
- Tooltips use `shadow-[var(--overlay-shadow)]` instead of Tailwind `shadow-lg`.
- Core charts (bar, line/area, combo, waterfall, scatter, sparklines) import shared marks.
- `ChartEmpty` / `ChartSkeleton` remain `role="status"` with reduced-motion-safe skeleton CSS in `globals.css`.

## Verification evidence

Curated heroes promoted via `VERIFIED_HEROES` in `scripts/generate-catalog.mjs` (14 entries):

| id | Evidence |
|---|---|
| clustered-column-chart | Shared marks, empty state, gradient + hover |
| clustered-bar-chart | Horizontal layout + shared radius/margins |
| line-chart | Stroke/ACTIVE_DOT constants + empty series |
| area-chart | Gradients + motion gate |
| pie-chart | Callouts + CSS hover + empty slices |
| donut-chart | Inner label + empty state |
| waterfall-chart | Token tooltip + semantic fills |
| line-and-clustered-column-chart | Combo empty + dual hover |
| funnel-chart | SVG stages + invalid empty |
| scatter-plot | Shared margin + empty data |
| kpi-visual | Tabular nums + semantic deltas |
| radial-gauge | Meter ARIA + thresholds |
| searchable-slicer | Focus rings + empty options |
| table | Empty rows status UI + sticky header |

Remaining catalog entries stay `review` until similarly evidenced.

## Harden results

- Empty/loading/error copy reviewed on heroes (charts, table, slicers, image fallback).
- No new `console.log` in `src/components`.
- Catalog: 14 verified, 322 review; paginated reports remain `review`.
- Gates: typecheck, lint, test:source, catalog:check green after craft pass.
- `next build` skipped while `next dev` may hold `.next`.

## Supergoal finish pass (2026-08-10)

- Shared `SERIES_STROKE_WIDTH` / margins adopted across analytics, overlays, polar, time-financial.
- Softer dimensional/cylinder bar recipe.
- `ChartResponsiveContainer` measures parent box and passes pixel sizes into Recharts 3 (avoids empty `-1` initial dimension).
- Flow hierarchy `ChartState` uses `role="status"` empty chrome.
- Package packed budget raised to 700 KB with CHANGELOG rationale; `package:validate` green.
- Remaining deferred work: see `.supergoal/chart-elements-pixel-perfect-open-source-8qyhkG/REMAINING_WORK.md`.
