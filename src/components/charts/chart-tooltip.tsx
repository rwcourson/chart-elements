"use client";

import { formatCompact, formatNumber, formatSeriesName } from "@/lib/utils";

type PayloadItem = {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
};

export function ChartTooltip({
  active,
  payload,
  label,
  valueFormatter = formatCompact,
}: {
  active?: boolean;
  payload?: PayloadItem[];
  label?: string | number;
  valueFormatter?: (n: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-3 py-2 text-[var(--chart-tooltip-fg)] shadow-lg">
      {label != null && label !== "" ? (
        <div className="mb-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      ) : null}
      <div className="space-y-1">
        {payload.map((item, i) => {
          const value =
            typeof item.value === "number"
              ? valueFormatter(item.value)
              : String(item.value ?? "");
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: item.color }}
              />
              <span className="text-muted-foreground">
                {formatSeriesName(String(item.name ?? ""))}
              </span>
              <span className="ml-auto font-semibold tabular-nums">{value}</span>
            </div>
          );
        })}
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
