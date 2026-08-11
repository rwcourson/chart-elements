/**
 * Shared mark geometry for charts across the pack.
 *
 * Keep stroke, margin, radius, and active-dot values here so Recharts and
 * custom SVG families read as one visual system. Prefer these constants over
 * hard-coding magic numbers in individual chart modules.
 */

/** Default Recharts plot inset for cartesian charts. */
export const PLOT_MARGIN = {
  top: 12,
  right: 16,
  left: 4,
  bottom: 8,
} as const;

/** Tighter inset for dense dual-axis / spark-adjacent plots. */
export const PLOT_MARGIN_COMPACT = {
  top: 8,
  right: 12,
  left: 0,
  bottom: 0,
} as const;

/** Series stroke for lines, areas outlines, and radar rings. */
export const SERIES_STROKE_WIDTH = 2.25;

/** Active point radius on line/area series. */
export const ACTIVE_DOT_RADIUS = 4;

/** Default activeDot props for Recharts Line/Area. */
export const ACTIVE_DOT = {
  r: ACTIVE_DOT_RADIUS,
  strokeWidth: 0,
} as const;

/** Corner radius for unstacked vertical columns (top corners). */
export const BAR_RADIUS_COLUMN = [4, 4, 0, 0] as const;

/** Corner radius for unstacked horizontal bars (right corners). */
export const BAR_RADIUS_BAR = [0, 4, 4, 0] as const;

/** Stacked bars/columns keep square joins between segments. */
export const BAR_RADIUS_STACKED = [0, 0, 0, 0] as const;

/** Default max bar thickness so dense categories stay legible. */
export const MAX_BAR_SIZE = 36;

/** Slightly narrower bars for combo dual-series plots. */
export const MAX_BAR_SIZE_COMBO = 32;

/** Shared class for floating chart tooltips (Recharts content or custom SVG). */
export const CHART_TOOLTIP_CLASS =
  "ce-chart-tooltip min-w-32 rounded-[var(--radius)] border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2 text-[var(--chart-tooltip-fg)] shadow-[var(--overlay-shadow)]";
