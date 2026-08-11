# Chart Elements

A Power BI–style data visualization component suite for **Next.js + Tailwind CSS**. Charts, KPI cards, gauges, tables, slicers, analytics visuals, navigation and shapes — all themed by CSS variables, with first-class light and dark modes.

Built on [Recharts](https://recharts.org) for cartesian charts and [D3](https://d3js.org) for the specialized SVG visuals.

**Full integration walkthrough:** [docs/INTEGRATION.md](./docs/INTEGRATION.md)

```bash
pnpm install
pnpm dev
```

- **Live demo:** [chart-elements.vercel.app](https://chart-elements.vercel.app)
- Repo: [github.com/rwcourson/chart-elements](https://github.com/rwcourson/chart-elements)
- Home — `/`
- Gallery (every visual) — `/gallery`

In the header you can switch **light/dark** and preview **chart palettes** (Neutral default, plus Berry, Ocean, Sunset, Forest, Slate, and Vivid). Palette choice is stored in `localStorage` and applied via `data-palette` on `<html>`.

## Status

Pre-1.0. The component surface is stable enough to build on, but prop names are still being unified across families (see [Known gaps](#known-gaps)). A curated set of high-traffic gallery entries is marked **verified** after craft review; most of the catalog remains in `review` until similarly evidenced. The compiled package is prepared under `packages/chart-elements` as `@rwcourson/chart-elements`, but it has **not been published to npm**.

## Consuming it

Use one of these paths while the scoped package is awaiting its first release (details in [docs/INTEGRATION.md](./docs/INTEGRATION.md)):

**1. Copy the source in (shadcn style).** Copy the folders you want out of `src/components/` plus `src/lib/utils.ts`, `src/lib/chart-colors.ts`, and the token block from `src/app/globals.css`. Components import each other through the `@/*` path alias, so your `tsconfig.json` needs:

```json
{ "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }
```

**2. Compiled workspace package.** The demo, CI fixtures, and downstream monorepos can consume the real ESM/declaration output without sharing this repo's `@/*` alias:

```ts
import { BarColumnChart, ChartFrame } from "@rwcourson/chart-elements/charts";
import { ModernCard, RadialGauge } from "@rwcourson/chart-elements/cards";
import { SearchableSlicer } from "@rwcourson/chart-elements/slicers";
import { VegaLiteChart } from "@rwcourson/chart-elements/declarative";
```

```bash
pnpm build:packages
pnpm --filter @rwcourson/chart-elements pack
```

The tarball ships compiled ESM, declarations, source maps, and precompiled CSS; consumers do not need `transpilePackages` or this repository's path alias. Do not install the repository root as a git dependency—the root is the private workspace/demo, not the package.

Package styles are deliberately opt-in and split by responsibility:

```ts
import "@rwcourson/chart-elements/tokens.css"; // optional default tokens
import "@rwcourson/chart-elements/components.css"; // component utilities and chart polish
// import "@rwcourson/chart-elements/palettes.css"; // optional demo palettes
```

`components.css` (also available at the legacy `styles.css` path) contains no
Tailwind preflight, document reset, `body`, global universal selector, or root
token definitions. Its rules live in a named `chart-elements` cascade layer so
ordinary application CSS keeps precedence.

### Peer dependencies

`react` and `react-dom` `^18.2 || ^19` are peers. Charting, declarative
rendering, icon, date, and utility libraries are package dependencies. Theme
state remains consumer-owned; the optional token stylesheet responds to a
`.dark` class without requiring a theme-provider package. Next.js and Tailwind
are demo/build dependencies rather than consumer peers. Node >= 18 is
sufficient to consume the library; Node >= 20.19 is required to work in this
repository because the compatibility fixtures use Vite 7.

## Usage

Charts are unopinionated about layout; `ChartFrame` supplies the card, title and a measured plot area.

```tsx
import { ChartFrame, BarColumnChart } from "@rwcourson/chart-elements/charts";

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

The gallery ships a `PalettePicker` that swaps accent + chart series via `html[data-palette="…"]` overrides in `src/app/palettes.css`. Defaults to **Neutral**. Useful for stakeholder previews; product apps usually pin one palette in CSS instead.

## Structure

| Path | Contents |
|---|---|
| `src/components/charts` | Bar/column, line/area, combo, waterfall, ribbon, pie/donut, funnel, treemap, scatter/bubble, sparklines, plus statistical, flow/hierarchy, polar/comparison and time/financial families |
| `src/components/cards` | KPI cards, scorecards, gauges, progress |
| `src/components/tables` | Tables, matrices, conditional formatting |
| `src/components/slicers` | List, button, dropdown, numeric, date, hierarchy and text slicers |
| `src/components/maps` | Provider-free GeoJSON/projection renderers, validated routes and points, clustering, reference layers, and clearly named schematic layouts; most are present but parked from the gallery (see Known gaps) |
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
| `pnpm build` | Production demo build |
| `pnpm build:packages` | Build ESM, declarations, source maps, CLI/registry, and package CSS |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint |
| `pnpm package:validate` | Validate exports, tarball contents, metadata, and type resolution |
| `pnpm examples:packed` | Install the exact tarball in clean React 18/Vite and React 19/Next fixtures and build both |
| `pnpm sbom` / `pnpm sbom:check` | Generate or validate deterministic CycloneDX package SBOMs |
| `pnpm verify` | Full source, package, test, demo, and consumer-fixture release gate |
| `pnpm catalog` | Regenerate the gallery registry |

## Known gaps

Honest accounting of what is not finished:

- **Most geographic maps are parked from the gallery.** The provider-free map package now accepts real GeoJSON, projects geographic coordinates with D3, validates route and point data, and keeps floor-plan/building layouts explicitly schematic. The generated gallery currently lists the hex and tile/grid layouts plus an explicit unconfigured-provider state; the choropleth, bubble, route, clustering, reference-layer, floor-plan and related renderers remain exported but unlisted until their public gallery recipes and dataset provenance are reviewed. To list them, widen `KEPT_MAPS` in `scripts/generate-catalog.mjs` and run `pnpm catalog`.
- **Vendor visuals are analogues, not SDKs.** Power Apps/Automate and the R/Python script hosts are rendered as React/SVG lookalikes so the catalog is visually complete. They do not talk to any vendor service, and integrating the real SDKs is out of scope.
- **Prop naming is not fully unified.** Category keys appear as `categoryKey` (bar/line/combo) and `nameKey` (pie/funnel); series keys appear as `seriesKeys`, `barKeys`/`lineKeys` (combo) and `keys` (radar). Unifying these is a planned breaking change.
- **`className` / `height` coverage is uneven.** Maps, slicers, navigation and shapes accept `className`; most cartesian charts size to their container and expect `ChartFrame` to own height.
- **Not published yet.** The scoped package build and validation path exists, but npm scope ownership and the first release review remain explicit gates.
- **Some catalog entries share an implementation.** A few Power BI list items are variants differentiated by title rather than by distinct code.
- **Verification is curated, not universal.** Only a small hero set is `verified` (see `docs/VISUAL_AUDIT.md`); the rest stay `review` until they earn the same evidence ladder.

## Accessibility

Focus rings derive from `--ring`. Icon-only controls carry `aria-label`s, form controls are label-associated, tables use `scope`-qualified headers, and maps expose an accessible name. Contrast was checked in both themes; the main historical bug — white labels on series fills — is fixed by `--chart-label`.

## Design credit

Chart Elements uses an independent neutral visual system with Manrope, soft
hairlines, 10px controls, and 16px panels. Layout and composition patterns are
inspired by [shadcn/ui](https://ui.shadcn.com); no shadcn code is vendored.

## License

[MIT](./LICENSE)
