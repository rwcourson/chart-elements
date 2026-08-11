# Contributing

Thanks for your interest in Chart Elements.

## Setup

```bash
pnpm install
pnpm dev
```

The gallery at `/gallery` is the fastest way to see a change across every visual. Check both themes with the toggle in the header, and spot-check a second chart palette (Ocean, Vivid, …) when you touch series colors or `--chart-label`.

## Before opening a PR

```bash
pnpm verify
```

This checks source quality, compiled package exports, package tests, npm tarball contents, the production gallery, and clean Next.js/Vite consumer fixtures. Lint runs the React Compiler rules, which means **a variable declared outside a `.map()` callback must not be mutated from inside it**. Use a `reduce` or precompute offsets instead:

```tsx
// rejected by react-hooks/immutability
let x = 0;
items.map((d) => { const el = <rect x={x} />; x += d.w; return el; });

// fine
const laid = items.map((d, i) => ({
  ...d,
  x: items.slice(0, i).reduce((sum, p) => sum + p.w, 0),
}));
```

## House rules

**Use tokens, never literals.** No hex colors, `rgb()`, or named colors in components. Every color comes from a CSS variable in `src/app/globals.css`. For text drawn on top of a series fill use `var(--chart-label)`, which inverts with the theme — plain `white` breaks dark mode.

**Stay deterministic.** No `Math.random()` and no bare `new Date()` in render or in default props; both cause SSR hydration mismatches. Sample data uses fixed seeds and a pinned `DEMO_TODAY`.

**Handle empty data.** A component given `data={[]}` must render `ChartEmpty`, not crash or draw `NaN`. Guard divisors with `|| 1` and never spread a possibly-empty array into `Math.max`.

**Keep components portable.** Nothing in `src/components/` may import from `src/app/` or `src/registry/`. Interactive components support both controlled (`value` + `onChange`) and uncontrolled (`defaultValue`) use via the shared `useControllableState` helper.

**Accessibility is not optional.** Icon-only buttons need an `aria-label`. Form controls need a real label association. Tables need `scope` on headers.

## Adding a visual

1. Add the component to the right family file under `src/components/<family>/`.
2. Export it from that folder's `index.ts`.
3. Register it in the gallery, then regenerate: `pnpm catalog`.
4. Verify it renders in both themes at a couple of viewport widths.

## Public package changes

- Add a Changeset with `pnpm changeset` for user-visible API, behavior,
  dependency, or packaging changes.
- Keep `packages/chart-elements` as a build wrapper around canonical root source;
  do not maintain a duplicate component tree.
- Run `pnpm package:validate` after changing exports or dependencies and inspect
  the tarball before release.
- Contributions are accepted under the repository's MIT license. By submitting
  a contribution, you confirm you have the right to license it on those terms.
- Vendor names are descriptive only. Do not imply official Power BI, Azure,
  Bing, ArcGIS, or other vendor integration without an actual supported SDK.

## Commits

Keep commits scoped and reviewable — one family or one concern per commit.
