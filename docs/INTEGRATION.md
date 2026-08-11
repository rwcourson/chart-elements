# Integrating Chart Elements

This guide covers adding Chart Elements to a React app, wiring theme tokens, and using the components. The live gallery is the fastest way to browse every visual before you copy or link the package.

## Prerequisites

- Node.js ≥ 18 to consume the library (≥ 20.19 to build this repository)
- React 18.2 or 19
- A modern ESM-capable bundler such as Next.js or Vite
- TypeScript is recommended

The published package declares React and React DOM as peers:

```bash
pnpm add react react-dom
```

## Option A — Copy source

Best when you want full ownership and no monorepo coupling.

1. Copy the folders you need from this repo into your app:

   ```
   src/components/charts/
   src/components/cards/
   src/components/tables/
   src/components/slicers/
   src/components/ui/          # at least button, card, input, select, calendar, date-field
   src/lib/utils.ts
   src/lib/chart-colors.ts
   src/components/providers/   # ThemeProvider
   ```

2. Merge the CSS variable block from `src/app/globals.css` into your global stylesheet (keep `:root` and `.dark`). Optionally also import `src/app/palettes.css` if you want the demo palette switcher.

3. Ensure `tsconfig.json` has:

   ```json
   {
     "compilerOptions": {
       "paths": { "@/*": ["./src/*"] }
     }
   }
   ```

4. Wrap the app in `ThemeProvider` (see [Theme](#theme)).

## Option B — Compiled package or workspace

Point your app at the compiled package. It ships ESM, declarations, source maps,
and precompiled styles, so consumers do not transpile repository source.

**pnpm workspace** — add the package to your monorepo `packages/` (or use `pnpm-workspace.yaml` `link:`), then:

```json
{
  "dependencies": {
    "@rwcourson/chart-elements": "workspace:*"
  }
}
```

**Local release-candidate tarball:**

```bash
pnpm build:packages
pnpm --filter @rwcourson/chart-elements pack
# In the consumer project, add the generated .tgz file.
```

Import via the package exports map:

```ts
import { BarColumnChart, ChartFrame } from "@rwcourson/chart-elements/charts";
import { ModernCard, RadialGauge } from "@rwcourson/chart-elements/cards";
import { SearchableSlicer } from "@rwcourson/chart-elements/slicers";
import { DataTable } from "@rwcourson/chart-elements/tables";
import { VegaLiteChart } from "@rwcourson/chart-elements/declarative";
import { CHART_COLORS, colorAt } from "@rwcourson/chart-elements";
```

Import the component stylesheet once. Add the default token layer only if your
application does not already define the documented variables:

```ts
import "@rwcourson/chart-elements/tokens.css"; // optional defaults
import "@rwcourson/chart-elements/components.css"; // required package styles
```

The component layer has no Tailwind preflight, document reset, `body` rule,
global universal selector, or root token declarations. `styles.css` is a
backward-compatible alias of `components.css`; its rules live in the named
`chart-elements` cascade layer so ordinary unlayered application styles retain
precedence. Import `palettes.css` separately only if you want the optional demo
palettes. The package has not yet been
published; until the first release, use the workspace or inspected tarball path
above. Do not install the repository root as a git dependency.

## Theme

### Light / dark

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider";
// Package consumers can use next-themes directly or their existing theme state.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

Drop in `ThemeToggle` from `@/components/ui/theme-toggle` (or the demo header) wherever you want a light/dark control.

The compiled package does not ship a framework-specific theme provider. Its
optional tokens respond to `.dark`, so consumers remain free to use
`next-themes`, another provider, or a class toggle they already own.

### CSS tokens

Every color, radius, and chart series color is a CSS variable. Override in your stylesheet — do not fork components for a rebrand:

```css
:root {
  --accent: #0c2048;
  --chart-1: #0c2048;
  --chart-2: #315fbb;
  --chart-3: #1f6b4a;
  /* … through --chart-8 */
  --chart-positive: #1f6b4a;
  --chart-negative: #9c343c;
  --radius: 10px;
  --radius-panel: 16px;
}

.dark {
  --chart-1: #93a9d6;
  /* … inverted pastels for dark fills */
  --chart-label: #121826; /* ink ON series fills */
}
```

Charts resolve colors through `var(--chart-N)` (`src/lib/chart-colors.ts`), so changing the variables recolors the whole suite.

### Demo palette picker

The gallery/home header includes a **Chart palette** control (`PalettePicker`) that sets `data-palette` on `<html>` and persists to `localStorage` (`ce-palette`). Overrides live in `src/app/palettes.css`.

Built-in ids: `neutral` (default), `berry`, `ocean`, `sunset`, `forest`, `slate`, `vivid`.

To reuse the picker in your shell:

```tsx
import { PalettePicker } from "@/components/ui/palette-picker";
import { ThemeToggle } from "@/components/ui/theme-toggle";

<header>
  <PalettePicker />
  <ThemeToggle />
</header>
```

To ship only a fixed brand palette, skip the picker and set your tokens in CSS.

## First chart

```tsx
import { ChartFrame, BarColumnChart } from "@/components/charts";

const rows = [
  { name: "North", sales: 420, profit: 120 },
  { name: "South", sales: 380, profit: 90 },
  { name: "East", sales: 510, profit: 160 },
];

export function RevenueByRegion() {
  return (
    <ChartFrame title="Revenue by region" description="FY26 to date" height={280}>
      <BarColumnChart
        data={rows}
        categoryKey="name"
        seriesKeys={["sales", "profit"]}
        variant="clustered-column"
      />
    </ChartFrame>
  );
}
```

Rules of thumb:

- Pass a numeric `height` for charts (Recharts measures the parent).
- Pass `height="auto"` for slicers, nav, and other natural-height controls.
- Do not wrap self-framed composites (KPI cards, decomposition tree, Q&A, etc.) in another `ChartFrame` — you get nested cards and clipping.
- Empty arrays render a shared empty state; `data={[]}` is safe.

## Slicers (controlled / uncontrolled)

```tsx
import { SearchableSlicer } from "@/components/slicers";

// Uncontrolled
<SearchableSlicer label="Region" defaultValue={["North"]} />

// Controlled
<SearchableSlicer label="Region" value={regions} onChange={setRegions} />
```

## Sample data

For demos and Storybook-like pages:

```ts
import { timeSeries, salesByRegion, ohlc } from "@/lib/sample-data";
// or: import { timeSeries } from "@rwcourson/chart-elements/sample-data";
```

## Gallery catalog

The `/gallery` route reads `src/registry/catalog.tsx`, generated by:

```bash
pnpm catalog
```

After adding or renaming a visual, update `scripts/generate-catalog.mjs` (or the family exports) and regenerate.

## Deploying this demo

The demo site (home + gallery) is a standard Next.js app:

```bash
pnpm install
pnpm build
pnpm start
```

On Vercel: framework preset **Next.js**, install `pnpm install`, build `pnpm build`, output detected automatically. No env vars are required for the public gallery.

## Verify locally

```bash
pnpm verify   # typecheck + lint + build
```

Check both light and dark, and if you use the palette picker, spot-check a second palette (e.g. Ocean) so series fills and `--chart-label` still read correctly.
