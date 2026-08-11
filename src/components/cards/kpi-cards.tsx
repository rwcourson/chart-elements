"use client";

import * as React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  CircleHelp,
  CircleX,
  ImageIcon,
  Minus,
  Target,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CHART_ANIMATION, useMotionEnabled } from "@/lib/chart-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineSparkline } from "@/components/charts/sparklines";
import {
  deriveKpiStatus,
  formatCardPercent,
  formatCardValue,
  targetProgress,
  type KpiStatus,
  type NegativeTargetPolicy,
  type PerformanceDirection,
  type ValueDisplayFormat,
  type ValueFormatOptions,
  type ValueFormatter,
  type ZeroTargetPolicy,
} from "./card-utils";

export interface MetricDatum extends ValueFormatOptions {
  id?: string;
  label: string;
  value: number;
  delta?: number;
  target?: number;
  category?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Optional trend series rendered as a decorative sparkline. */
  spark?: readonly number[];
  format?: ValueDisplayFormat;
  direction?: PerformanceDirection;
}

/** Backward-compatible public name. */
export type Metric = MetricDatum;

export interface MetricFormattingProps {
  format?: ValueDisplayFormat;
  locale?: string;
  currency?: string;
  formatter?: ValueFormatter;
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export type CardSize = "sm" | "md" | "lg";

function metricFormatOptions(
  metric: MetricDatum,
  formatting: MetricFormattingProps = {},
): ValueFormatOptions {
  return {
    format: metric.format ?? formatting.format,
    locale: metric.locale ?? formatting.locale,
    currency: metric.currency ?? formatting.currency,
    formatter: metric.formatter ?? formatting.formatter,
    compact: metric.compact ?? formatting.compact,
    minimumFractionDigits:
      metric.minimumFractionDigits ?? formatting.minimumFractionDigits,
    maximumFractionDigits:
      metric.maximumFractionDigits ?? formatting.maximumFractionDigits,
  };
}

/**
 * Card-local count-up starts at zero on the first mount, unlike the shared
 * chart hook's update-only animation. It still uses the shared motion gate.
 */
function useMetricCountUp(target: number, duration: number, animate: boolean) {
  const safeTarget = Number.isFinite(target) ? target : 0;
  const motion = useMotionEnabled(animate);
  const initial = motion ? 0 : safeTarget;
  const [display, setDisplay] = React.useState(initial);
  const current = React.useRef(initial);

  React.useEffect(() => {
    const from = current.current;
    if (!motion || duration <= 0 || from === safeTarget) {
      current.current = safeTarget;
      setDisplay(safeTarget);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      const next = from + (safeTarget - from) * eased;
      current.current = next;
      setDisplay(next);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, motion, safeTarget]);

  return display;
}

export interface MetricValueProps extends MetricFormattingProps {
  metric: MetricDatum;
  value?: number;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
}

function MetricValue({
  metric,
  value = metric.value,
  className,
  animate = true,
  animationDuration = 650,
  ...formatting
}: MetricValueProps) {
  const display = useMetricCountUp(value, animationDuration, animate);
  const formatted = formatCardValue(
    Number.isFinite(value) ? display : value,
    metricFormatOptions(metric, formatting),
  );
  return <div className={className}>{formatted}</div>;
}

function cardValueClass(size: CardSize) {
  return size === "sm"
    ? "text-[22px]"
    : size === "lg"
      ? "text-[32px]"
      : "text-[26px]";
}

function deltaMeta(metric: MetricDatum, locale = "en-US") {
  const delta = metric.delta ?? 0;
  const up = delta > 0;
  const down = delta < 0;
  const favorable = delta === 0 || (metric.direction === "lower-is-better" ? down : up);
  const directionLabel = up ? "Up" : down ? "Down" : "No change";
  const value = formatCardPercent(Math.abs(delta), locale, 1);
  return {
    up,
    down,
    favorable,
    visibleLabel: delta === 0 ? directionLabel : `${directionLabel} ${value}`,
    ariaLabel: `${directionLabel} ${delta === 0 ? "" : value}, ${favorable ? "favorable" : "unfavorable"}`.trim(),
  };
}

function DeltaBadge({ metric, locale }: { metric: MetricDatum; locale?: string }) {
  const meta = deltaMeta(metric, locale ?? metric.locale);
  return (
    <Badge
      variant={metric.delta === 0 ? "outline" : meta.favorable ? "success" : "danger"}
      aria-label={meta.ariaLabel}
    >
      {meta.up ? (
        <ArrowUpRight aria-hidden="true" className="mr-1 h-3 w-3" />
      ) : meta.down ? (
        <ArrowDownRight aria-hidden="true" className="mr-1 h-3 w-3" />
      ) : (
        <Minus aria-hidden="true" className="mr-1 h-3 w-3" />
      )}
      {meta.visibleLabel}
    </Badge>
  );
}

export interface ModernCardProps extends MetricFormattingProps {
  metric: MetricDatum;
  withReference?: boolean;
  withImage?: boolean;
  size?: CardSize;
  className?: string;
  animate?: boolean;
  animationDuration?: number;
}

export function ModernCard({
  metric,
  withReference,
  withImage,
  size = "md",
  className,
  animate = true,
  animationDuration = 650,
  ...formatting
}: ModernCardProps) {
  const options = metricFormatOptions(metric, formatting);
  return (
    <Card
      className={cn(
        "h-full shadow-[var(--card-shadow)] transition-shadow hover:shadow-[var(--overlay-shadow)]",
        className,
      )}
    >
      <CardContent className="flex h-full flex-col justify-between gap-4 !px-4 !py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <div className="text-[13px] font-medium text-muted-foreground">
              {metric.label}
            </div>
            <MetricValue
              metric={metric}
              {...formatting}
              animate={animate}
              animationDuration={animationDuration}
              className={cn(
                "font-bold tracking-[-0.02em] tabular-nums",
                cardValueClass(size),
              )}
            />
          </div>
          {withImage ? (
            metric.imageUrl ? (
              // A native image supports arbitrary report/data URLs.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={metric.imageUrl}
                alt={metric.imageAlt ?? ""}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ImageIcon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                <span className="sr-only">No metric image</span>
              </div>
            )
          ) : null}
        </div>
        {metric.spark?.length ? (
          <div aria-hidden="true" className="h-9 w-full">
            <LineSparkline data={metric.spark.map((value, index) => ({ i: index, v: value }))} />
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          {metric.delta != null ? <DeltaBadge metric={metric} locale={options.locale} /> : null}
          {withReference && metric.target != null ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Target aria-hidden="true" className="h-3 w-3" />
              Target {formatCardValue(metric.target, options)}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

export interface MetricCollectionProps extends MetricFormattingProps {
  metrics: readonly MetricDatum[];
  className?: string;
  animate?: boolean;
  animationDuration?: number;
}

export interface MultiCardLayoutProps extends MetricCollectionProps {
  minCardWidth?: number | string;
}

function cssSize(value: number | string) {
  return typeof value === "number" ? `${Math.max(0, value)}px` : value;
}

export function MultiCardLayout({
  metrics,
  className,
  minCardWidth,
  animate = true,
  animationDuration = 650,
  ...formatting
}: MultiCardLayoutProps) {
  return (
    <div
      className={cn(
        "grid h-full auto-rows-fr gap-3 overflow-auto",
        minCardWidth == null && "grid-cols-2 lg:grid-cols-4",
        className,
      )}
      style={minCardWidth == null ? undefined : {
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cssSize(minCardWidth)}), 1fr))`,
      }}
    >
      {metrics.map((metric) => {
        const options = metricFormatOptions(metric, formatting);
        return (
          <div
            key={metric.id ?? metric.label}
            className="min-h-0 min-w-0 rounded-[12px] border border-border bg-[var(--background-soft)] p-3.5"
          >
            <div className="flex h-full flex-col justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <div className="truncate text-[12px] font-medium text-muted-foreground">
                  {metric.label}
                </div>
                <MetricValue
                  metric={metric}
                  {...formatting}
                  animate={animate}
                  animationDuration={animationDuration}
                  className="truncate text-[22px] font-bold tracking-[-0.02em] tabular-nums"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {metric.delta != null ? <DeltaBadge metric={metric} locale={options.locale} /> : null}
                {metric.target != null ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Target aria-hidden="true" className="h-3 w-3" />
                    {formatCardValue(metric.target, options)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export interface MultiCategoryCardsProps extends MetricCollectionProps {
  minCardWidth?: number | string;
}

export function MultiCategoryCards({
  metrics,
  className,
  minCardWidth,
  animate = true,
  animationDuration = 650,
  ...formatting
}: MultiCategoryCardsProps) {
  const groups = metrics.reduce<Record<string, MetricDatum[]>>((result, metric) => {
    const key = metric.category ?? "General";
    (result[key] ??= []).push(metric);
    return result;
  }, {});

  return (
    <div className={cn("flex h-full flex-col gap-3 overflow-auto", className)}>
      {Object.entries(groups).map(([category, items]) => (
        <section key={category} aria-label={category}>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {category}
          </div>
          <div
            className={cn("grid gap-2", minCardWidth == null && "grid-cols-2")}
            style={minCardWidth == null ? undefined : {
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${cssSize(minCardWidth)}), 1fr))`,
            }}
          >
            {items.map((metric) => (
              <ModernCard
                key={metric.id ?? metric.label}
                metric={metric}
                {...formatting}
                animate={animate}
                animationDuration={animationDuration}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export interface LegacyCardProps extends MetricFormattingProps {
  metric: MetricDatum;
  className?: string;
  size?: CardSize;
  animate?: boolean;
  animationDuration?: number;
}

export function LegacyCard({
  metric,
  className,
  size = "lg",
  animate = true,
  animationDuration = 650,
  ...formatting
}: LegacyCardProps) {
  return (
    <div className={cn("flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center", className)}>
      <div className="text-sm text-muted-foreground">{metric.label}</div>
      <MetricValue
        metric={metric}
        {...formatting}
        animate={animate}
        animationDuration={animationDuration}
        className={cn("mt-2 font-semibold tabular-nums", size === "sm" ? "text-3xl" : size === "lg" ? "text-5xl" : "text-4xl")}
      />
    </div>
  );
}

export type MultiRowCardProps = MetricCollectionProps;

export function MultiRowCard({
  metrics,
  className,
  animate = true,
  animationDuration = 650,
  ...formatting
}: MultiRowCardProps) {
  return (
    <Card className={cn("h-full overflow-auto", className)}>
      <CardContent className="divide-y divide-border p-0">
        {metrics.map((metric) => (
          <div
            key={metric.id ?? metric.label}
            className="flex min-w-0 items-center justify-between gap-3 px-4 py-3"
          >
            <div className="min-w-0 truncate text-sm">{metric.label}</div>
            <MetricValue
              metric={metric}
              {...formatting}
              animate={animate}
              animationDuration={animationDuration}
              className="shrink-0 text-sm font-semibold tabular-nums"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const statusDetails = {
  "on-track": { label: "On track", color: "var(--chart-positive)" },
  "at-risk": { label: "At risk", color: "var(--chart-warning)" },
  "off-track": { label: "Off track", color: "var(--chart-negative)" },
  "not-set": { label: "No target", color: "var(--muted-foreground)" },
} satisfies Record<KpiStatus, { label: string; color: string }>;

function StatusIcon({ status, className }: { status: KpiStatus; className?: string }) {
  const props = { "aria-hidden": true, className } as const;
  if (status === "on-track") return <CheckCircle2 {...props} />;
  if (status === "at-risk") return <TriangleAlert {...props} />;
  if (status === "off-track") return <CircleX {...props} />;
  return <CircleHelp {...props} />;
}

interface KpiGoalBodyProps extends MetricFormattingProps {
  metric: MetricDatum;
  status: KpiStatus;
  dense?: boolean;
  zeroTargetPolicy: ZeroTargetPolicy;
  negativeTargetPolicy: NegativeTargetPolicy;
  animate: boolean;
  animationDuration: number;
}

function KpiGoalBody({
  metric,
  status,
  dense,
  zeroTargetPolicy,
  negativeTargetPolicy,
  animate,
  animationDuration,
  ...formatting
}: KpiGoalBodyProps) {
  const motion = useMotionEnabled(animate);
  const details = statusDetails[status];
  const options = metricFormatOptions(metric, formatting);
  const progress = metric.target != null
    ? targetProgress(
        metric.value,
        metric.target,
        metric.direction,
        zeroTargetPolicy,
        negativeTargetPolicy,
      )
    : null;

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
            "inline-flex shrink-0 items-center gap-1 rounded-[var(--radius-sm)] font-semibold uppercase tracking-wide",
            dense ? "px-1.5 text-[9px] leading-[16px]" : "px-2 py-0.5 text-[10px]",
          )}
          style={{
            color: "var(--foreground)",
            background: `color-mix(in oklab, ${details.color} 18%, transparent)`,
          }}
        >
          <StatusIcon status={status} className="h-3 w-3" />
          {details.label}
        </span>
      </div>
      <MetricValue
        metric={metric}
        {...formatting}
        animate={animate}
        animationDuration={animationDuration}
        className={cn(
          "font-semibold tabular-nums",
          dense ? "text-[22px] leading-none tracking-[-0.02em]" : "text-3xl",
        )}
      />
      {metric.target != null ? (
        <div className={cn(dense ? "space-y-1" : "space-y-1.5")}>
          <div
            className={cn(
              "flex justify-between gap-2 text-muted-foreground",
              dense ? "text-[11px] leading-tight" : "text-xs",
            )}
          >
            <span>Goal</span>
            <span className="truncate tabular-nums">
              {formatCardValue(metric.target, options)}
            </span>
          </div>
          {progress != null ? (
            <div
              className={cn(
                "overflow-hidden rounded-full bg-foreground/8",
                dense ? "h-1" : "h-1.5",
              )}
              role="progressbar"
              aria-label={`${metric.label} progress toward target`}
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={progress}
              aria-valuetext={`${formatCardValue(metric.value, options)} toward ${formatCardValue(metric.target, options)}; ${details.label}`}
            >
              <div
                className={cn(
                  "h-full rounded-full",
                  motion && "transition-[width] duration-500 ease-out",
                )}
                style={{ width: `${progress * 100}%`, background: details.color }}
              />
            </div>
          ) : (
            <div className="text-[10px] text-muted-foreground">Progress hidden by target policy</div>
          )}
        </div>
      ) : null}
    </>
  );
}

export interface KpiVisualProps extends MetricFormattingProps {
  metric: MetricDatum;
  status?: KpiStatus;
  dense?: boolean;
  className?: string;
  atRiskTolerance?: number;
  zeroTargetPolicy?: ZeroTargetPolicy;
  negativeTargetPolicy?: NegativeTargetPolicy;
  animate?: boolean;
  animationDuration?: number;
}

export function KpiVisual({
  metric,
  status,
  dense,
  className,
  atRiskTolerance = 0.1,
  zeroTargetPolicy = "binary",
  negativeTargetPolicy = "binary",
  animate = true,
  animationDuration = CHART_ANIMATION.duration,
  ...formatting
}: KpiVisualProps) {
  const resolvedStatus = status ?? deriveKpiStatus(
    metric.value,
    metric.target,
    metric.direction,
    atRiskTolerance,
  );
  return (
    <Card className={cn("h-full min-h-0", className)}>
      <CardContent
        className={cn(
          "flex h-full flex-col justify-between",
          dense ? "px-3.5 py-3" : "p-4",
        )}
      >
        <KpiGoalBody
          metric={metric}
          status={resolvedStatus}
          dense={dense}
          zeroTargetPolicy={zeroTargetPolicy}
          negativeTargetPolicy={negativeTargetPolicy}
          animate={animate}
          animationDuration={animationDuration}
          {...formatting}
        />
      </CardContent>
    </Card>
  );
}

export interface ScorecardProps extends MetricCollectionProps {
  atRiskTolerance?: number;
  zeroTargetPolicy?: ZeroTargetPolicy;
  negativeTargetPolicy?: NegativeTargetPolicy;
}

export function Scorecard({
  metrics,
  className,
  atRiskTolerance = 0.1,
  zeroTargetPolicy = "binary",
  negativeTargetPolicy = "binary",
  animate = true,
  animationDuration = CHART_ANIMATION.duration,
  ...formatting
}: ScorecardProps) {
  return (
    <div className={cn("grid h-full auto-rows-fr gap-2", className)}>
      {metrics.map((metric) => {
        const status = deriveKpiStatus(
          metric.value,
          metric.target,
          metric.direction,
          atRiskTolerance,
        );
        return (
          <div
            key={metric.id ?? metric.label}
            className="flex h-full min-h-0 min-w-0 flex-col justify-between rounded-[var(--radius)] border border-border bg-[var(--sidebar-hover)] px-3.5 py-3"
          >
            <KpiGoalBody
              metric={metric}
              status={status}
              dense
              zeroTargetPolicy={zeroTargetPolicy}
              negativeTargetPolicy={negativeTargetPolicy}
              animate={animate}
              animationDuration={animationDuration}
              {...formatting}
            />
          </div>
        );
      })}
    </div>
  );
}

export interface TrafficLightKpiProps extends MetricFormattingProps {
  metric: MetricDatum;
  className?: string;
  status?: KpiStatus;
  atRiskTolerance?: number;
  animate?: boolean;
  animationDuration?: number;
}

export function TrafficLightKpi({
  metric,
  className,
  status,
  atRiskTolerance = 0.15,
  animate = true,
  animationDuration = 650,
  ...formatting
}: TrafficLightKpiProps) {
  const resolvedStatus = status ?? deriveKpiStatus(
    metric.value,
    metric.target,
    metric.direction,
    atRiskTolerance,
  );
  const details = statusDetails[resolvedStatus];
  return (
    <div className={cn("flex h-full min-w-0 items-center gap-4 rounded-xl border border-border bg-card p-4", className)}>
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border"
        style={{
          color: details.color,
          borderColor: `color-mix(in oklab, ${details.color} 45%, transparent)`,
          background: `color-mix(in oklab, ${details.color} 14%, transparent)`,
        }}
      >
        <StatusIcon status={resolvedStatus} className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{metric.label}</div>
        <MetricValue
          metric={metric}
          {...formatting}
          animate={animate}
          animationDuration={animationDuration}
          className="truncate text-2xl font-semibold tabular-nums"
        />
        <div className="mt-1 text-[11px] font-semibold text-foreground">
          {details.label}
        </div>
      </div>
    </div>
  );
}
