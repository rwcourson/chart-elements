# Chart Elements

A Power BI–style data visualization component suite for **Next.js + Tailwind CSS**. Charts, KPI cards, gauges, tables, slicers, analytics visuals, navigation and shapes — all themed by CSS variables, with first-class light and dark modes.

Built on [Recharts](https://recharts.org) for cartesian charts and [D3](https://d3js.org) for the specialized SVG visuals.

**Full integration walkthrough:** [docs/INTEGRATION.md](./docs/INTEGRATION.md)

```bash
pnpm install
pnpm dev
```

- Home — `/`
- Gallery (every visual) — `/gallery`

In the header you can switch **light/dark** and preview **chart palettes** (B&G Time, Ocean, Sunset, Forest, Slate, Vivid, Berry). Palette choice is stored in `localStorage` and applied via `data-palette` on `<html>`.

## Status

Pre-1.0. The component surface is stable enough to build on, but prop names are still being unified across families (see [Known gaps](#known-gaps)). This package is **not published to npm** — see [Consuming it](#consuming-it).

## Consuming it

`package.json` is marked `private`. Use one of these paths (details in [docs/INTEGRATION.md](./docs/INTEGRATION.md)):

**1. Copy the source in (shadcn style).** Copy the folders you want out of `src/components/` plus `src/lib/utils.ts`, `src/lib/chart-colors.ts`, and the token block from `src/app/globals.css`. Components import each other through the `@/*` path alias, so your `tsconfig.json` needs:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

**2. Workspace or git dependency.** An `exports` map is defined for subpath imports:

```ts
import { BarColumnChart, ChartFrame } from "chart-elements/charts";
import { ModernCard, RadialGauge } from "chart-elements/cards";
import { SearchableSlicer } from "chart-elements/slicers";
import { ThemeProvider } from "chart-elements/theme";
```

```bash
# after the repo is on GitHub
pnpm add github:rwcourson/chart-elements
```

Add `transpilePackages: ["chart-elements"]` in `next.config.ts`. The `exports` map points at TypeScript source — Next must transpile it. Publishing to npm would additionally require a build step to emit JS and resolve the `@/*` alias — that is deliberately not set up yet.

### Peer dependencies

`react` 19, `react-dom` 19, `next` 16, `recharts` 3, `d3` 7, `lucide-react`, `next-themes`, `tailwindcss` 4. Node >= 20.9.

## Usage

Charts are unopinionated about layout; `ChartFrame` supplies the card, title and a measured plot area.

```tsx
import { ChartFrame, BarColumnChart } from "@/components/charts";

<ChartFrame title="Revenue by region" description="FY26 to date" height={280}>
  <BarColumnChart
    data={rows}
    categoryKey="name"
    seriesKeys={["sales", "profit"]}
    variant="clustered-column"
  />
</ChartFrame>;
```

`height` is required for charts, because Recharts measures its parent on mount.
Pass `height="auto"` for panels of form controls or buttons — slicers and
navigation visuals have a natural height, and pinning them leaves dead space.

A few composite panels already supply their own card, so they should be used on
their own rather than inside a `ChartFrame`: the decomposition trees, key
influencers, top segments, smart narrative, anomaly detection, the Q&A visuals,
the forecast and anomaly-overlay demos, the page and bookmark navigators, the
advanced date and hierarchy slicers, and the KPI/modern/multi-row cards. Nesting
them produces a card inside a card and clips the inner panel.

Interactive components support both controlled and uncontrolled use:

```tsx
// uncontrolled
<SearchableSlicer label="Region" defaultValue={["North"]} />

// controlled
<SearchableSlicer label="Region" value={regions} onChange={setRegions} />
```

Charts render a shared empty state when handed an empty array, so `data={[]}` is safe.

## Theming

Every color, radius, shadow and spacing value is a CSS variable defined in `src/app/globals.css`. Restyle by overriding variables — you never need to fork a component.

```css
:root {
  --accent: #0c2048;
  --chart-1: #0c2048;
  --chart-2: #315fbb;
  /* … --chart-8 */
}
```

Key token groups:

| Group | Variables |
|---|---|
| Surfaces | `--background`, `--background-soft`, `--background-deep`, `--card`, `--muted` |
| Ink | `--foreground`, `--secondary-foreground`, `--muted-foreground` |
| Borders / focus | `--border`, `--border-strong`, `--border-soft`, `--ring` |
| Accent | `--accent`, `--accent-hover`, `--accent-soft`, `--accent-foreground` |
| Semantic | `--success`, `--warning`, `--destructive` (+ `-soft` variants) |
| Chart series | `--chart-1` … `--chart-8` |
| Chart chrome | `--chart-grid`, `--chart-axis`, `--chart-label`, `--chart-tooltip-bg/-fg/-border` |
| Shape | `--radius` (10px controls), `--radius-panel` (16px panels), `--overlay-shadow` |

`--chart-label` is the ink used for text drawn *on top of* a series fill. It flips from near-white in light mode to near-black in dark mode, because the series colors invert. Use it instead of hardcoding `white`.

Light/dark is wired with `next-themes`; wrap your app in `ThemeProvider` and drop in `ThemeToggle`.

### Preview palettes (demo site)

The gallery ships a `PalettePicker` that swaps accent + chart series via `html[data-palette="…"]` overrides in `src/app/palettes.css`. Defaults to **B&G Time**. Useful for stakeholder previews; product apps usually pin one brand palette in CSS instead.

## Structure

| Path | Contents |
|---|---|
| `src/components/charts` | Bar/column, line/area, combo, waterfall, ribbon, pie/donut, funnel, treemap, scatter/bubble, sparklines, plus statistical, flow/hierarchy, polar/comparison and time/financial families |
| `src/components/cards` | KPI cards, scorecards, gauges, progress |
| `src/components/tables` | Tables, matrices, conditional formatting |
| `src/components/slicers` | List, button, dropdown, numeric, date, hierarchy and text slicers |
| `src/components/maps` | Hex and tile/grid layouts (listed); choropleth, bubble, route, cartogram and floor plan (present but parked — see Known gaps) |
| `src/components/analytics` | Decomposition tree, key influencers, Q&A, anomaly detection |
| `src/components/navigation` | Buttons, page and bookmark navigators |
| `src/components/shapes` | Text boxes, images, shapes |
| `src/components/overlays` | Small multiples, reference lines, drill demos |
| `src/components/ui` | Button, Card, Input, Select, Calendar, DateField, Badge, ThemeToggle, PalettePicker primitives |
| `src/lib` | `cn`, number formatters, chart color tokens, sample data, palette metadata |
| `src/app/palettes.css` | Optional demo palette overrides (`data-palette`) |
| `src/registry/catalog.tsx` | Gallery registry, generated by `pnpm catalog` |
| `docs/INTEGRATION.md` | Step-by-step consume / theme / deploy guide |

## Scripts

| Script | Purpose |
|---|---|
| `pnpm dev` | Local dev server and gallery |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm verify` | typecheck + lint + build |
| `pnpm catalog` | Regenerate the gallery registry |

## Known gaps

Honest accounting of what is not finished:

- **Geographic maps are parked.** Only the hex and tile/grid layouts are in the gallery — those are matrix visuals on an abstract lattice, with no cartography involved. The choropleth, bubble, route, floor-plan and building-layout components still live in `src/components/maps` but are not listed, because their geography is schematic: simplified inline SVG paths rather than real GeoJSON projections. To re-enable them, widen `KEPT_MAPS` in `scripts/generate-catalog.mjs` and run `pnpm catalog`.
- **Vendor visuals are analogues, not SDKs.** Power Apps/Automate and the R/Python script hosts are rendered as React/SVG lookalikes so the catalog is visually complete. They do not talk to any vendor service, and integrating the real SDKs is out of scope.
- **Prop naming is not fully unified.** Category keys appear as `categoryKey` (bar/line/combo) and `nameKey` (pie/funnel); series keys appear as `seriesKeys`, `barKeys`/`lineKeys` (combo) and `keys` (radar). Unifying these is a planned breaking change.
- **`className` / `height` coverage is uneven.** Maps, slicers, navigation and shapes accept `className`; most cartesian charts size to their container and expect `ChartFrame` to own height.
- **Not npm-publishable yet.** No build step emits JS or rewrites the `@/*` alias.
- **Some catalog entries share an implementation.** A few Power BI list items are variants differentiated by title rather than by distinct code.

## Accessibility

Focus rings derive from `--ring`. Icon-only controls carry `aria-label`s, form controls are label-associated, tables use `scope`-qualified headers, and maps expose an accessible name. Contrast was checked in both themes; the main historical bug — white labels on series fills — is fixed by `--chart-label`.

## Design credit

The palette, typography and control metrics follow the **B&G Time** design system: Manrope, a navy accent, soft hairlines, 10px controls and 16px panels. Layout and composition patterns are inspired by [shadcn/ui](https://ui.shadcn.com); no shadcn code is vendored.

## License

[MIT](./LICENSE)
