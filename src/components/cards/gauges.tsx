"use client";

import { CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHART_ANIMATION, useMotionEnabled } from "@/lib/chart-motion";
import {
  deriveKpiStatus,
  formatCardValue,
  gaugeSize,
  normalizeRange,
  normalizeThresholds,
  type GaugeSize,
  type GaugeThreshold,
  type KpiStatus,
  type NegativeTargetPolicy,
  type NormalizedRange,
  type PerformanceDirection,
  type RangePolicyOptions,
  type ValueFormatOptions,
  type ZeroTargetPolicy,
} from "./card-utils";

const DEG = Math.PI / 180;

function polar(cx: number, cy: number, radius: number, degrees: number) {
  return {
    x: cx + radius * Math.cos(degrees * DEG),
    y: cy + radius * Math.sin(degrees * DEG),
  };
}

/** Angles increase clockwise in SVG's y-down coordinate system. */
function arc(cx: number, cy: number, radius: number, from: number, to: number) {
  const start = polar(cx, cy, radius, from);
  const end = polar(cx, cy, radius, to);
  const large = to - from > 180 ? 1 : 0;
  return `M${start.x.toFixed(3)} ${start.y.toFixed(3)} A${radius} ${radius} 0 ${large} 1 ${end.x.toFixed(3)} ${end.y.toFixed(3)}`;
}

export interface GaugeDatum {
  value: number;
  label?: string;
}

export type GaugeFormattingProps = ValueFormatOptions;

export interface GaugeRangeProps extends RangePolicyOptions {
  min?: number;
  max?: number;
}

export type TargetRangePolicy = "clamp" | "include" | "hide";

function rangeStateText(range: NormalizedRange) {
  if (range.state === "below") return "Below range";
  if (range.state === "above") return "Above range";
  if (range.state === "invalid") return "Value unavailable";
  return null;
}

function rangeValueText(range: NormalizedRange, formattedValue: string) {
  const state = rangeStateText(range);
  return state ? `${formattedValue}; ${state.toLocaleLowerCase()}` : formattedValue;
}

function meterAria(label: string, range: NormalizedRange, formattedValue: string) {
  return {
    role: "meter" as const,
    "aria-label": label,
    "aria-valuemin": range.min,
    "aria-valuemax": range.max,
    "aria-valuenow": range.state === "invalid" ? undefined : range.meterValue,
    "aria-valuetext": rangeValueText(range, formattedValue),
  };
}

function progressAria(label: string, range: NormalizedRange, formattedValue: string) {
  return {
    role: "progressbar" as const,
    "aria-label": label,
    "aria-valuemin": range.min,
    "aria-valuemax": range.max,
    "aria-valuenow": range.state === "invalid" ? undefined : range.meterValue,
    "aria-valuetext": rangeValueText(range, formattedValue),
  };
}

function RangeNotice({ range }: { range: NormalizedRange }) {
  const text = rangeStateText(range);
  if (!text || (!range.shouldIndicate && range.state !== "invalid")) return null;
  return (
    <div className="inline-flex items-center justify-center gap-1 text-[10px] font-medium text-muted-foreground">
      <CircleAlert aria-hidden="true" className="h-3 w-3" />
      {text}
    </div>
  );
}

function statusLabel(status: KpiStatus) {
  return status === "on-track"
    ? "On track"
    : status === "at-risk"
      ? "At risk"
      : status === "off-track"
        ? "Off track"
        : "No target";
}

const RADIAL = { cx: 66, cy: 66, r: 54, from: 135, sweep: 270, band: 14 };

export interface RadialGaugeProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  ranges?: readonly GaugeThreshold[];
  size?: GaugeSize;
  thickness?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function RadialGauge(props: RadialGaugeProps) {
  const {
    value,
    min = 0,
    max = 100,
    label = "Gauge",
    ranges,
    size,
    thickness = RADIAL.band,
    color = "var(--chart-1)",
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const thresholds = normalizeThresholds(ranges, range.min, range.max);
  const { cx, cy, r, from, sweep } = RADIAL;
  const band = Math.max(4, Math.min(24, thickness));
  const angle = (fraction: number) => from + sweep * fraction;
  const cap = thresholds.length ? "butt" : "round";
  const capY = polar(cx, cy, r, angle(0)).y;
  const formattedValue = formatCardValue(value, props);
  const currentThreshold = thresholds.find((threshold) => range.meterValue <= threshold.to);

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col items-center justify-center", className)}
      {...meterAria(label, range, formattedValue)}
    >
      <svg
        viewBox="0 0 132 132"
        className="h-auto w-full max-w-full"
        style={{ maxWidth: gaugeSize(size, 264) }}
        aria-hidden="true"
      >
        <path
          d={arc(cx, cy, r, from, angle(1))}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={band}
          strokeLinecap={cap}
        />
        {thresholds.map((threshold, index) => {
          const startValue = index === 0 ? range.min : thresholds[index - 1]!.to;
          const start = (startValue - range.min) / (range.max - range.min);
          const end = (threshold.to - range.min) / (range.max - range.min);
          return (
            <path
              key={`${threshold.to}-${index}`}
              d={arc(cx, cy, r, angle(start), angle(end))}
              fill="none"
              stroke={threshold.color}
              strokeWidth={band}
              strokeOpacity={0.32}
            />
          );
        })}
        {range.indicatorVisible ? (
          <path
            d={arc(cx, cy, r, from, angle(1))}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={thresholds.length ? Math.max(2, band - 6) : band}
            strokeLinecap={cap}
            strokeDasharray={`${range.fraction} 1`}
            style={{
              transition: motion
                ? `stroke-dasharray ${CHART_ANIMATION.duration}ms ${CHART_ANIMATION.easing}`
                : undefined,
            }}
          />
        ) : null}
        <text
          x={cx}
          y={64}
          textAnchor="middle"
          fontSize={26}
          fontWeight={600}
          fill="var(--foreground)"
          className="tabular-nums"
        >
          {formattedValue}
        </text>
        <text x={cx} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
          {label}
        </text>
        <text
          x={polar(cx, cy, r, angle(0)).x}
          y={capY + 20}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCardValue(range.min, props)}
        </text>
        <text
          x={polar(cx, cy, r, angle(1)).x}
          y={capY + 20}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCardValue(range.max, props)}
        </text>
      </svg>
      {currentThreshold?.label ? (
        <div className="-mt-1 text-[11px] font-semibold text-foreground">{currentThreshold.label}</div>
      ) : null}
      <RangeNotice range={range} />
    </div>
  );
}

export interface LinearGaugeProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  color?: string;
  trackHeight?: number;
  className?: string;
  animate?: boolean;
}

export function LinearGauge(props: LinearGaugeProps) {
  const {
    value,
    min = 0,
    max = 100,
    label = "Gauge",
    color = "var(--chart-1)",
    trackHeight = 12,
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const formattedValue = formatCardValue(value, props);
  const knobSize = Math.max(12, trackHeight + 4);

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col justify-center gap-3 px-2", className)}
      {...meterAria(label, range, formattedValue)}
    >
      <div className="flex min-w-0 justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 font-semibold tabular-nums">{formattedValue}</span>
      </div>
      <div
        className="relative rounded-full bg-muted"
        style={{ height: `${Math.max(2, trackHeight)}px` }}
        aria-hidden="true"
      >
        {range.indicatorVisible ? (
          <>
            <div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full",
                motion && "transition-[width] duration-500 ease-out",
              )}
              style={{ width: `${range.fraction * 100}%`, backgroundColor: color }}
            />
            <div
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-card shadow",
                motion && "transition-[left] duration-500 ease-out",
              )}
              style={{
                width: knobSize,
                height: knobSize,
                left: `calc(${range.fraction} * (100% - ${knobSize}px))`,
                backgroundColor: color,
              }}
            />
          </>
        ) : null}
      </div>
      <div className="flex justify-between gap-2 text-[10px] text-muted-foreground">
        <span>{formatCardValue(range.min, props)}</span>
        <RangeNotice range={range} />
        <span>{formatCardValue(range.max, props)}</span>
      </div>
    </div>
  );
}

export interface BulletThresholds {
  poor: number;
  satisfactory: number;
}

export type BulletRangeBoundaries = readonly [number, number] | BulletThresholds;

export interface BulletChartProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  target: number;
  label?: string;
  ranges?: BulletRangeBoundaries;
  direction?: PerformanceDirection;
  targetRangePolicy?: TargetRangePolicy;
  zeroTargetPolicy?: ZeroTargetPolicy;
  negativeTargetPolicy?: NegativeTargetPolicy;
  color?: string;
  className?: string;
  animate?: boolean;
}

function bulletBoundaries(
  boundaries: BulletRangeBoundaries | undefined,
  min: number,
  max: number,
): [number, number] {
  const defaults: [number, number] = [min + (max - min) * 0.6, min + (max - min) * 0.9];
  const values = boundaries == null
    ? defaults
    : "poor" in boundaries
      ? [boundaries.poor, boundaries.satisfactory]
      : [boundaries[0], boundaries[1]];
  const sorted = values
    .filter(Number.isFinite)
    .map((value) => Math.min(max, Math.max(min, value)))
    .sort((a, b) => a - b);
  return [sorted[0] ?? defaults[0], sorted[1] ?? defaults[1]];
}

export function BulletChart(props: BulletChartProps) {
  const {
    value,
    target,
    min = 0,
    max = 100,
    label = "Bullet chart",
    ranges,
    direction = "higher-is-better",
    targetRangePolicy = "clamp",
    zeroTargetPolicy = "binary",
    negativeTargetPolicy = "binary",
    color = "var(--chart-1)",
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const finiteTarget = Number.isFinite(target);
  const targetHiddenByPolicy = (target === 0 && zeroTargetPolicy === "hide-progress")
    || (target < 0 && negativeTargetPolicy === "hide-progress");
  const resolvedTargetRangePolicy = targetHiddenByPolicy ? "hide" : targetRangePolicy;
  const scaleMin = resolvedTargetRangePolicy === "include" && finiteTarget ? Math.min(min, target) : min;
  const scaleMax = resolvedTargetRangePolicy === "include" && finiteTarget ? Math.max(max, target) : max;
  const range = normalizeRange(value, scaleMin, scaleMax, props);
  const targetRange = normalizeRange(target, range.min, range.max, {
    underflowPolicy: resolvedTargetRangePolicy === "hide" ? "hide" : "clamp",
    overflowPolicy: resolvedTargetRangePolicy === "hide" ? "hide" : "clamp",
  });
  const [poor, satisfactory] = bulletBoundaries(ranges, range.min, range.max);
  const fractionOf = (input: number) => (input - range.min) / (range.max - range.min);
  const status = deriveKpiStatus(value, target, direction, 0.1);
  const formattedValue = formatCardValue(value, props);
  const formattedTarget = formatCardValue(target, props);

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col justify-center gap-2 px-2", className)}
      {...meterAria(label, range, formattedValue)}
      aria-valuetext={`${formattedValue}; target ${formattedTarget}; ${statusLabel(status)}`}
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 font-medium">{statusLabel(status)}</span>
      </div>
      <div className="relative h-8 overflow-hidden rounded-md bg-foreground/[0.04]" aria-hidden="true">
        <div
          className="absolute inset-y-0 left-0 bg-foreground/[0.08]"
          style={{ width: `${fractionOf(satisfactory) * 100}%` }}
        />
        <div
          className="absolute inset-y-0 left-0 bg-foreground/[0.15]"
          style={{ width: `${fractionOf(poor) * 100}%` }}
        />
        {range.indicatorVisible ? (
          <div
            className={cn(
              "absolute top-1/2 h-3 -translate-y-1/2 rounded-sm",
              motion && "transition-[width] duration-500 ease-out",
            )}
            style={{ width: `${range.fraction * 100}%`, backgroundColor: color }}
          />
        ) : null}
        {targetRange.indicatorVisible ? (
          <div
            className="absolute bottom-1 top-1 w-0.5 bg-foreground"
            style={{
              left: `calc(${targetRange.fraction * 100}% - ${targetRange.fraction >= 1 ? 2 : 0}px)`,
            }}
          />
        ) : null}
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2 text-xs tabular-nums">
        <span className="truncate">{formattedValue}</span>
        <RangeNotice range={range} />
        <span className="shrink-0 text-muted-foreground">Target {formattedTarget}</span>
      </div>
    </div>
  );
}

export interface ProgressRingProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  size?: GaugeSize;
  thickness?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function ProgressRing(props: ProgressRingProps) {
  const {
    value,
    min = 0,
    max = 1,
    label = "Progress",
    size,
    thickness = 10,
    color = "var(--chart-1)",
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const radius = Math.max(20, 47 - Math.max(4, Math.min(20, thickness)) / 2);
  const circumference = 2 * Math.PI * radius;
  const formatOptions: ValueFormatOptions = {
    ...props,
    format: props.format ?? "percent",
    compact: props.compact ?? false,
  };
  const formattedValue = formatCardValue(
    props.format || props.formatter ? value : range.fraction,
    formatOptions,
  );

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col items-center justify-center gap-2", className)}
      {...progressAria(label, range, formattedValue)}
    >
      <svg
        viewBox="0 0 100 100"
        className="h-auto max-w-full"
        style={{ width: gaugeSize(size, 144) }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--muted)" strokeWidth={thickness} />
        {range.indicatorVisible ? (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeDasharray={`${circumference * range.fraction} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{
              transition: motion
                ? `stroke-dasharray ${CHART_ANIMATION.duration}ms ${CHART_ANIMATION.easing}`
                : undefined,
            }}
          />
        ) : null}
        <text
          x="50"
          y="54"
          textAnchor="middle"
          className="fill-foreground font-semibold"
          style={{ fontSize: 18 }}
        >
          {formattedValue}
        </text>
      </svg>
      <div className="text-center text-sm text-muted-foreground">{label}</div>
      <RangeNotice range={range} />
    </div>
  );
}

export interface ProgressBarProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  color?: string;
  trackHeight?: number;
  className?: string;
  animate?: boolean;
}

export function ProgressBar(props: ProgressBarProps) {
  const {
    value,
    min = 0,
    max = 1,
    label = "Progress",
    color = "var(--chart-1)",
    trackHeight = 10,
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const formatOptions: ValueFormatOptions = {
    ...props,
    format: props.format ?? "percent",
    compact: props.compact ?? false,
  };
  const formattedValue = formatCardValue(
    props.format || props.formatter ? value : range.fraction,
    formatOptions,
  );

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col justify-center gap-2 px-2", className)}
      {...progressAria(label, range, formattedValue)}
    >
      <div className="flex min-w-0 justify-between gap-3 text-sm">
        <span className="truncate text-muted-foreground">{label}</span>
        <span className="shrink-0 font-medium tabular-nums">{formattedValue}</span>
      </div>
      <div
        className="overflow-hidden rounded-full bg-muted"
        style={{ height: `${Math.max(2, trackHeight)}px` }}
        aria-hidden="true"
      >
        {range.indicatorVisible ? (
          <div
            className={cn(
              "h-full rounded-full",
              motion && "transition-[width] duration-500 ease-out",
            )}
            style={{ width: `${range.fraction * 100}%`, backgroundColor: color }}
          />
        ) : null}
      </div>
      <RangeNotice range={range} />
    </div>
  );
}

export interface ThermometerGaugeProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  size?: GaugeSize;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function ThermometerGauge(props: ThermometerGaugeProps) {
  const {
    value,
    min = 0,
    max = 100,
    label,
    size,
    color = "var(--chart-negative)",
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const formattedValue = formatCardValue(value, props);

  return (
    <div
      className={cn("flex h-full min-w-0 items-center justify-center gap-5", className)}
      {...meterAria(label ?? "Temperature", range, formattedValue)}
    >
      <div
        className="flex h-[72%] min-h-24 flex-col items-center"
        style={{ maxHeight: gaugeSize(size, 232) }}
        aria-hidden="true"
      >
        <div className="relative w-9 flex-1 overflow-hidden rounded-t-full bg-muted">
          {range.indicatorVisible ? (
            <div
              className={cn(
                "absolute inset-x-0 bottom-0",
                motion && "transition-[height] duration-500 ease-out",
              )}
              style={{ height: `${range.fraction * 100}%`, backgroundColor: color }}
            />
          ) : null}
          {[0.25, 0.5, 0.75].map((fraction) => (
            <div
              key={fraction}
              className="absolute inset-x-0 h-px bg-[var(--border-strong)]"
              style={{ bottom: `${fraction * 100}%` }}
            />
          ))}
        </div>
        <div className="-mt-3 h-11 w-11 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      </div>
      <div className="min-w-0">
        <div className="truncate text-[32px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {formattedValue}
        </div>
        <div className="mt-2 text-[11px] leading-none text-muted-foreground">
          {label ?? `Range ${formatCardValue(range.min, props)}–${formatCardValue(range.max, props)}`}
        </div>
        <div className="mt-2"><RangeNotice range={range} /></div>
      </div>
    </div>
  );
}

const DIAL = { cx: 74, cy: 74, r: 62, from: 180, sweep: 180, band: 12 };
const DIAL_TICKS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

export interface DialGaugeProps extends GaugeFormattingProps, GaugeRangeProps {
  value: number;
  label?: string;
  size?: GaugeSize;
  thickness?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}

export function DialGauge(props: DialGaugeProps) {
  const {
    value,
    min = 0,
    max = 100,
    label = "Dial gauge",
    size,
    thickness = DIAL.band,
    color = "var(--chart-1)",
    className,
    animate = true,
  } = props;
  const motion = useMotionEnabled(animate);
  const range = normalizeRange(value, min, max, props);
  const { cx, cy, r, from, sweep } = DIAL;
  const band = Math.max(4, Math.min(20, thickness));
  const angle = (fraction: number) => from + sweep * fraction;
  const needle = angle(range.fraction);
  const capY = polar(cx, cy, r, angle(0)).y;
  const formattedValue = formatCardValue(value, props);

  return (
    <div
      className={cn("flex h-full min-w-0 flex-col items-center justify-center gap-3", className)}
      {...meterAria(label, range, formattedValue)}
    >
      <svg
        viewBox="0 0 148 100"
        className="h-auto w-full max-w-full"
        style={{ maxWidth: gaugeSize(size, 290) }}
        aria-hidden="true"
      >
        <path
          d={arc(cx, cy, r, from, angle(1))}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={band}
          strokeLinecap="round"
        />
        {range.indicatorVisible ? (
          <path
            d={arc(cx, cy, r, from, angle(1))}
            pathLength={1}
            fill="none"
            stroke={color}
            strokeWidth={band}
            strokeLinecap="round"
            strokeDasharray={`${range.fraction} 1`}
            style={{
              transition: motion
                ? `stroke-dasharray ${CHART_ANIMATION.duration}ms ${CHART_ANIMATION.easing}`
                : undefined,
            }}
          />
        ) : null}
        {DIAL_TICKS.map((fraction, index) => {
          const major = index % 2 === 0;
          const start = polar(cx, cy, major ? 45 : 49, angle(fraction));
          const end = polar(cx, cy, 53, angle(fraction));
          return (
            <line
              key={fraction}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="var(--chart-axis)"
              strokeWidth={major ? 1.6 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {range.indicatorVisible ? (
          <g
            style={{
              transform: `rotate(${needle}deg)`,
              transformOrigin: `${cx}px ${cy}px`,
              transition: motion
                ? `transform ${CHART_ANIMATION.duration}ms ${CHART_ANIMATION.easing}`
                : undefined,
            }}
          >
            <polygon points={`${cx},${cy - 4.6} ${cx + 40},${cy - 1} ${cx + 40},${cy + 1} ${cx},${cy + 4.6}`} fill="var(--foreground)" />
          </g>
        ) : null}
        <circle cx={cx} cy={cy} r={6} fill="var(--foreground)" />
        <circle cx={cx} cy={cy} r={2.6} fill="var(--card)" />
        <text
          x={polar(cx, cy, r, angle(0)).x + 8}
          y={capY + 18}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCardValue(range.min, props)}
        </text>
        <text
          x={polar(cx, cy, r, angle(1)).x - 8}
          y={capY + 18}
          textAnchor="middle"
          fontSize={10}
          fill="var(--muted-foreground)"
          className="tabular-nums"
        >
          {formatCardValue(range.max, props)}
        </text>
      </svg>
      <div className="min-w-0 text-center">
        <div className="truncate text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums">
          {formattedValue}
        </div>
        <div className="mt-1.5 truncate text-[11px] leading-none text-muted-foreground">{label}</div>
        <div className="mt-2"><RangeNotice range={range} /></div>
      </div>
    </div>
  );
}
