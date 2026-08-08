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
