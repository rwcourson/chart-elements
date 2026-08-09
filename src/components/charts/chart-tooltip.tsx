"use client";

import { formatCompact, formatNumber, formatSeriesName } from "@/lib/utils";

type PayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

/**
 * Tooltip header label. Numeric axis values arrive raw — "0.82499999999999997"
 * — and drown the panel, so float-looking labels get the number treatment.
 * Plain integers and text (dates, categories) pass through untouched.
 */
function formatLabel(label: string | number): string {
  if (typeof label === "number") {
    return Number.isInteger(label) ? String(label) : formatNumber(label);
  }
  const n = Number(label);
  if (label.trim() !== "" && Number.isFinite(n) && !Number.isInteger(n)) {
    return formatNumber(n);
  }
  return label;
}

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = formatCompact,
  showTotal = false,
}: {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
  valueFormatter?: (n: number) => string;
  /** Appends a bold total row — for stacked charts where the sum is the story. */
  showTotal?: boolean;
}) {
  if (!active || !payload?.length) return null;

  const total = showTotal
    ? payload.reduce((s, item) => s + (typeof item.value === "number" ? item.value : 0), 0)
    : null;

  return (
    // min-w keeps the panel from changing width as values change between
    // neighbouring points — a resizing tooltip reads as jitter while gliding.
    <div className="ce-chart-tooltip min-w-32 rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2 text-[var(--chart-tooltip-fg)] shadow-lg">
      {label != null && label !== "" ? (
        <div className="mb-1.5 text-xs font-medium tabular-nums text-muted-foreground">
          {formatLabel(label)}
        </div>
      ) : null}
      <div className="space-y-1">
        {payload.map((item, i) => {
          const value =
            typeof item.value === "number"
              ? valueFormatter(item.value)
              : String(item.value ?? "");
          return (
            <div key={i} className="flex items-baseline gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 translate-y-px rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-muted-foreground">
                {formatSeriesName(String(item.name ?? ""))}
              </span>
              <span className="ml-auto pl-4 font-semibold tabular-nums">{value}</span>
            </div>
          );
        })}
        {total != null && payload.length > 1 ? (
          <div className="mt-1.5 flex items-baseline gap-2 border-t border-[var(--chart-tooltip-border)] pt-1.5 text-xs">
            <span className="text-muted-foreground">Total</span>
            <span className="ml-auto pl-4 font-bold tabular-nums">
              {valueFormatter(total)}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function exactNumber(n: number) {
  return formatNumber(n);
}

/**
 * Legend label renderer. Recharts labels each series with its raw data key,
 * which surfaces as "product"/"grossMargin" in the UI.
 */
export function legendLabel(value: unknown) {
  return formatSeriesName(String(value ?? ""));
}
