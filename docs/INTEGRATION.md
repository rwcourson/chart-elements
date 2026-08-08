# Integrating Chart Elements

This guide covers adding Chart Elements to a Next.js + Tailwind app, wiring theme tokens, and using the components. The live gallery is the fastest way to browse every visual before you copy or link the package.

## Prerequisites

- Node.js ≥ 20.9
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- TypeScript with the `@/*` path alias pointing at your `src/` folder

Peer packages you need installed alongside this suite:

```bash
pnpm add recharts d3 lucide-react next-themes class-variance-authority clsx tailwind-merge date-fns
pnpm add -D @types/d3
```

## Option A — Copy source (recommended while private)

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
   src/lib/format.ts           # if present / imported by components you use
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

## Option B — Workspace / git dependency

Point your app at this package and let Next transpile the TypeScript source.

**pnpm workspace** — add the package to your monorepo `packages/` (or use `pnpm-workspace.yaml` `link:`), then:

```json
{
  "dependencies": {
    "chart-elements": "workspace:*"
  }
}
```

**Git dependency** (after the repo is public):

```bash
pnpm add github:rwcourson/chart-elements
```

In `next.config.ts`:

```ts
const nextConfig = {
  transpilePackages: ["chart-elements"],
};
export default nextConfig;
```

Import via the package exports map:

```ts
import { BarColumnChart, ChartFrame } from "chart-elements/charts";
import { ModernCard, RadialGauge } from "chart-elements/cards";
import { SearchableSlicer } from "chart-elements/slicers";
import { DataTable } from "chart-elements/tables";
import { ThemeProvider } from "chart-elements/theme";
import { CHART_COLORS, colorAt } from "chart-elements"; // or chart-colors via your copy
```

Also import the stylesheet once (App Router layout):

```ts
import "chart-elements/styles.css";
```

Or copy only the token blocks into your own `globals.css` if you already have a design system.

> Publishing to npm is not set up yet — there is no emit step that rewrites `@/*`. Prefer Option A or a workspace that shares the same alias, or configure your bundler to resolve `@/*` inside the package.

## Theme

### Light / dark

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider";
// or: import { ThemeProvider } from "chart-elements/theme";

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

Built-in ids: `berry` (default), `bg-time`, `ocean`, `sunset`, `forest`, `slate`, `vivid`.

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
// or: import { timeSeries } from "chart-elements/sample-data";
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
