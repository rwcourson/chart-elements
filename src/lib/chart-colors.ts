/** Chart palette — works in light and dark via CSS variables. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
  "var(--chart-8)",
] as const;

/**
 * Text/icon colors designed to sit on the matching `CHART_COLORS` fill.
 *
 * A single foreground cannot remain readable across a mixed categorical
 * palette. Keeping the pairings explicit lets labels, pictograms, and custom
 * SVG marks choose contrast-safe ink without guessing from a CSS variable at
 * render time.
 */
export const CHART_FOREGROUNDS = [
  "var(--chart-on-1)",
  "var(--chart-on-2)",
  "var(--chart-on-3)",
  "var(--chart-on-4)",
  "var(--chart-on-5)",
  "var(--chart-on-6)",
  "var(--chart-on-7)",
  "var(--chart-on-8)",
] as const;

export const SEMANTIC = {
  positive: "var(--chart-positive)",
  negative: "var(--chart-negative)",
  neutral: "var(--chart-neutral)",
  warning: "var(--chart-warning)",
} as const;

/** Series color for an index, wrapping the palette. Safe for any integer. */
export function colorAt(index: number): string {
  const n = CHART_COLORS.length;
  return CHART_COLORS[((Math.trunc(index) % n) + n) % n]!;
}

/** Contrast-safe foreground for the corresponding `colorAt(index)` fill. */
export function foregroundAt(index: number): string {
  const n = CHART_FOREGROUNDS.length;
  return CHART_FOREGROUNDS[((Math.trunc(index) % n) + n) % n]!;
}

/** Convenient fill/foreground pair for custom marks and data labels. */
export function seriesColorsAt(index: number) {
  return {
    fill: colorAt(index),
    foreground: foregroundAt(index),
  } as const;
}
