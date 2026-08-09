"use client";

import { ArrowDownRight, ArrowUpRight, ImageIcon, Target } from "lucide-react";
import { cn, formatCompact, formatPercent } from "@/lib/utils";
import { useCountUp } from "@/lib/chart-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineSparkline } from "@/components/charts/sparklines";

export type Metric = {
  label: string;
  value: number;
  delta?: number;
  target?: number;
  category?: string;
  imageUrl?: string;
  /** Optional trend series — renders a sparkline behind the KPI value. */
  spark?: number[];
  format?: "number" | "currency" | "percent";
};

function formatValue(format: Metric["format"], value: number) {
  if (format === "percent") return formatPercent(value);
  if (format === "currency")
    return formatCompact(value).startsWith("$")
      ? formatCompact(value)
      : `$${formatCompact(value)}`;
  return formatCompact(value);
}

/**
 * KPI figure with an ease-out count-up on mount and on data change.
 * One component so every card variant animates the same way (and hooks stay
 * out of render loops).
 */
function MetricValue({
  format,
  value,
  className,
}: {
  format?: Metric["format"];
  value: number;
  className?: string;
}) {
  const display = useCountUp(value);
  return <div className={className}>{formatValue(format, display)}</div>;
}

export function ModernCard({
  metric,
  withReference,
  withImage,
}: {
  metric: Metric;
  withReference?: boolean;
  withImage?: boolean;
}) {
  const up = (metric.delta ?? 0) >= 0;
  return (
    <Card className="h-full shadow-none">
      <CardContent className="flex h-full flex-col justify-between gap-4 !px-4 !py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="text-[13px] font-medium text-muted-foreground">
              {metric.label}
            </div>
            <MetricValue
              format={metric.format}
              value={metric.value}
              className="text-[26px] font-bold tracking-[-0.02em] tabular-nums"
            />
          </div>
          {withImage ? (
            metric.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={metric.imageUrl}
                alt=""
                className="h-10 w-10 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            )
          ) : null}
        </div>
        {metric.spark?.length ? (
          <div aria-hidden="true" className="h-9 w-full">
            <LineSparkline data={metric.spark.map((v, i) => ({ i, v }))} />
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {metric.delta != null ? (
            <Badge variant={up ? "success" : "danger"}>
              {up ? (
                <ArrowUpRight className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3" />
              )}
              {formatPercent(Math.abs(metric.delta), 1)}
            </Badge>
          ) : null}
          {withReference && metric.target != null ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              Target {formatCompact(metric.target)}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export function MultiCardLayout({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid h-full auto-rows-fr grid-cols-2 gap-3 lg:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="min-h-0 rounded-[12px] border border-border bg-[var(--background-soft)] p-3.5"
        >
          <div className="flex h-full flex-col justify-between gap-3">
            <div className="space-y-1">
              <div className="text-[12px] font-medium text-muted-foreground">
                {m.label}
              </div>
              <MetricValue
                format={m.format}
                value={m.value}
                className="text-[22px] font-bold tracking-[-0.02em] tabular-nums"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {m.delta != null ? (
                <Badge variant={(m.delta ?? 0) >= 0 ? "success" : "danger"}>
                  {(m.delta ?? 0) >= 0 ? (
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="mr-1 h-3 w-3" />
                  )}
                  {formatPercent(Math.abs(m.delta), 1)}
                </Badge>
              ) : null}
              {m.target != null ? (
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Target className="h-3 w-3" />
                  {formatCompact(m.target)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MultiCategoryCards({ metrics }: { metrics: Metric[] }) {
  const groups = metrics.reduce<Record<string, Metric[]>>((acc, m) => {
    const key = m.category ?? "General";
    (acc[key] ??= []).push(m);
    return acc;
  }, {});

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto">
      {Object.entries(groups).map(([cat, items]) => (
        <div key={cat}>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {cat}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {items.map((m) => (
              <ModernCard key={m.label} metric={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function LegacyCard({ metric }: { metric: Metric }) {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center">
      <div className="text-sm text-muted-foreground">{metric.label}</div>
      <MetricValue
        format={metric.format}
        value={metric.value}
        className="mt-2 text-4xl font-semibold tabular-nums"
      />
    </div>
  );
}

export function MultiRowCard({ metrics }: { metrics: Metric[] }) {
  return (
    <Card className="h-full overflow-auto">
      <CardContent className="divide-y divide-border p-0">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between gap-3 px-4 py-3"
          >
            <div className="text-sm">{m.label}</div>
            <MetricValue
              format={m.format}
              value={m.value}
              className="text-sm font-semibold tabular-nums"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function statusTone(status: "on-track" | "at-risk" | "off-track") {
  return {
    "on-track": "var(--chart-positive)",
    "at-risk": "var(--chart-warning)",
    "off-track": "var(--chart-negative)",
  }[status];
}

function KpiGoalBody({
  metric,
  status,
  dense,
}: {
  metric: Metric;
  status: "on-track" | "at-risk" | "off-track";
  dense?: boolean;
}) {
  const statusColor = statusTone(status);

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "text-muted-foreground",
            dense ? "min-w-0 truncate text-[12px] font-medium" : "text-xs",
          )}
        >
          {metric.label}
        </span>
        <span
          className={cn(
            // Soft wash + status ink — a solid fill with inverted text reads as a
            // floating chip on dark cards and fights the rest of the palette.
            "shrink-0 rounded-full font-semibold uppercase tracking-wide",
            dense
              ? "px-1.5 text-[9px] leading-[16px]"
              : "px-2 py-0.5 text-[10px]",
          )}
          style={{
            color: statusColor,
            background: `color-mix(in oklab, ${statusColor} 18%, transparent)`,
          }}
        >
          {status.replace("-", " ")}
        </span>
      </div>
      <MetricValue
        format={metric.format}
        value={metric.value}
        className={cn(
          "font-semibold tabular-nums",
          dense ? "text-[22px] leading-none tracking-[-0.02em]" : "text-3xl",
        )}
      />
      {metric.target != null ? (
        <div className={cn(dense ? "space-y-1" : "space-y-1.5")}>
          <div
            className={cn(
              "flex justify-between text-muted-foreground",
              dense ? "text-[11px] leading-tight" : "text-xs",
            )}
          >
            <span>Goal</span>
            <span className="tabular-nums">
              {formatCompact(metric.target)}
            </span>
          </div>
          <div
            className={cn(
              // Track uses a hairline of foreground so it stays visible on both
              // the card and the scorecard's inset rows (bg-muted disappears
              // into the dark card).
              "overflow-hidden rounded-full bg-foreground/8",
              dense ? "h-1" : "h-1.5",
            )}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min(100, (metric.value / metric.target) * 100)}%`,
                background: statusColor,
              }}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function KpiVisual({
  metric,
  status = "on-track",
  dense,
}: {
  metric: Metric;
  status?: "on-track" | "at-risk" | "off-track";
  /** Compact row layout, for stacking several KPIs in one fixed-height frame. */
  dense?: boolean;
}) {
  return (
    <Card className="h-full min-h-0">
      <CardContent
        className={cn(
          "flex h-full flex-col justify-between",
          dense ? "px-3.5 py-3" : "p-4",
        )}
      >
        <KpiGoalBody metric={metric} status={status} dense={dense} />
      </CardContent>
    </Card>
  );
}

export function Scorecard({ metrics }: { metrics: Metric[] }) {
  return (
    /*
      Rows are inset washes, not nested Cards. Card-in-card painted the same
      --card fill twice; in dark mode that reads as a muddy double backdrop
      with stacked shadows, not as three goals on one panel.
    */
    <div className="grid h-full auto-rows-fr gap-2">
      {metrics.map((m) => {
        const ratio = m.target ? m.value / m.target : 1;
        const status =
          ratio >= 1 ? "on-track" : ratio >= 0.9 ? "at-risk" : "off-track";
        return (
          <div
            key={m.label}
            className="flex h-full min-h-0 flex-col justify-between rounded-[var(--radius)] border border-border bg-[var(--sidebar-hover)] px-3.5 py-3"
          >
            <KpiGoalBody metric={m} status={status} dense />
          </div>
        );
      })}
    </div>
  );
}

export function TrafficLightKpi({ metric }: { metric: Metric }) {
  const ratio = metric.target ? metric.value / metric.target : 1;
  const color =
    ratio >= 1
      ? "var(--chart-positive)"
      : ratio >= 0.85
        ? "var(--chart-warning)"
        : "var(--chart-negative)";
  return (
    <div className="flex h-full items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div
        className={cn("h-10 w-10 rounded-full shadow-inner")}
        style={{ background: color }}
      />
      <div>
        <div className="text-xs text-muted-foreground">{metric.label}</div>
        <MetricValue
          format={metric.format}
          value={metric.value}
          className="text-2xl font-semibold tabular-nums"
        />
      </div>
    </div>
  );
}
