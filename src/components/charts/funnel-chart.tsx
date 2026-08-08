"use client";

import { cn, formatCompact } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/chart-colors";

export function FunnelChart({
  data,
  nameKey = "name",
  valueKey = "value",
  variant = "funnel",
}: {
  data: Record<string, string | number>[];
  nameKey?: string;
  valueKey?: string;
  variant?: "funnel" | "pyramid";
}) {
  const max = Math.max(...data.map((d) => Number(d[valueKey] ?? 0)), 1);
  const rows = variant === "pyramid" ? [...data].reverse() : data;

  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      {rows.map((row, i) => {
        const value = Number(row[valueKey] ?? 0);
        const width = Math.max(18, (value / max) * 100);
        return (
          <div key={String(row[nameKey])} className="flex items-center gap-3">
            <div className="w-24 shrink-0 truncate text-xs text-muted-foreground">
              {row[nameKey]}
            </div>
            <div className="relative flex h-9 flex-1 items-center justify-center">
              <div
                className={cn(
                  "flex h-full items-center justify-center rounded-md text-xs font-medium text-[var(--chart-label)] transition-all",
                )}
                style={{
                  width: `${width}%`,
                  background: CHART_COLORS[i % CHART_COLORS.length],
                }}
              >
                {formatCompact(value)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
