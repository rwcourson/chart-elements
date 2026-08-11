export type ValueDisplayFormat = "number" | "currency" | "percent";

export interface ValueFormatterContext {
  format: ValueDisplayFormat;
  locale: string;
  currency: string;
  compact: boolean;
}

export type ValueFormatter = (value: number, context: ValueFormatterContext) => string;

export interface ValueFormatOptions {
  format?: ValueDisplayFormat;
  locale?: string;
  currency?: string;
  formatter?: ValueFormatter;
  compact?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export function formatCardValue(value: number, options: ValueFormatOptions = {}): string {
  if (!Number.isFinite(value)) return "—";

  const {
    format = "number",
    locale = "en-US",
    currency = "USD",
    formatter,
    compact = true,
    minimumFractionDigits,
    maximumFractionDigits,
  } = options;
  const context = { format, locale, currency, compact } satisfies ValueFormatterContext;
  if (formatter) return formatter(value, context);

  const safeMinimum = minimumFractionDigits == null || !Number.isFinite(minimumFractionDigits)
    ? undefined
    : Math.max(0, Math.min(20, minimumFractionDigits));
  const inferredMaximum = maximumFractionDigits != null && Number.isFinite(maximumFractionDigits)
    ? maximumFractionDigits
    : format !== "percent" && value !== 0 && Math.abs(value) < 0.1
      ? 2
      : 1;
  const safeMaximum = Math.max(safeMinimum ?? 0, Math.min(20, inferredMaximum));
  const intlOptions: Intl.NumberFormatOptions = {
    style: format === "currency" ? "currency" : format === "percent" ? "percent" : "decimal",
    currency: format === "currency" ? currency : undefined,
    currencyDisplay: format === "currency" ? "narrowSymbol" : undefined,
    notation: compact && format !== "percent" ? "compact" : "standard",
    minimumFractionDigits: safeMinimum,
    maximumFractionDigits: safeMaximum,
  };
  try {
    return new Intl.NumberFormat(locale, intlOptions).format(value);
  } catch {
    return new Intl.NumberFormat("en-US", {
      ...intlOptions,
      currency: format === "currency" ? "USD" : undefined,
    }).format(value);
  }
}

export function formatCardPercent(value: number, locale = "en-US", digits = 1): string {
  if (!Number.isFinite(value)) return "—";
  const options: Intl.NumberFormatOptions = {
    style: "percent",
    maximumFractionDigits: Number.isFinite(digits)
      ? Math.max(0, Math.min(20, digits))
      : 1,
  };
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return new Intl.NumberFormat("en-US", options).format(value);
  }
}

export type PerformanceDirection = "higher-is-better" | "lower-is-better";
export type KpiStatus = "on-track" | "at-risk" | "off-track" | "not-set";
/** Binary treats a zero target as met/not met; hide-progress omits its progress track. */
export type ZeroTargetPolicy = "binary" | "hide-progress";
/** Negative targets cannot form a meaningful ratio without a baseline. */
export type NegativeTargetPolicy = "binary" | "hide-progress";

export function isGoalMet(
  value: number,
  target: number,
  direction: PerformanceDirection = "higher-is-better",
): boolean {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return false;
  return direction === "lower-is-better" ? value <= target : value >= target;
}

export function deriveKpiStatus(
  value: number,
  target: number | undefined,
  direction: PerformanceDirection = "higher-is-better",
  atRiskTolerance = 0.1,
): KpiStatus {
  if (target == null || !Number.isFinite(target)) return "not-set";
  if (!Number.isFinite(value)) return "off-track";
  if (isGoalMet(value, target, direction)) return "on-track";

  const gap = direction === "lower-is-better" ? value - target : target - value;
  const relativeGap = gap / Math.max(Math.abs(target), 1);
  return relativeGap <= Math.max(0, atRiskTolerance) ? "at-risk" : "off-track";
}

export function targetProgress(
  value: number,
  target: number,
  direction: PerformanceDirection = "higher-is-better",
  zeroTargetPolicy: ZeroTargetPolicy = "binary",
  negativeTargetPolicy: NegativeTargetPolicy = "binary",
): number | null {
  if (!Number.isFinite(value) || !Number.isFinite(target)) return null;
  if (target === 0) {
    return zeroTargetPolicy === "hide-progress"
      ? null
      : Number(isGoalMet(value, target, direction));
  }
  if (target < 0) {
    return negativeTargetPolicy === "hide-progress"
      ? null
      : Number(isGoalMet(value, target, direction));
  }

  if (direction === "lower-is-better") {
    if (value <= target) return 1;
    if (value <= 0) return 1;
    return Math.max(0, Math.min(1, target / value));
  }
  return Math.max(0, Math.min(1, value / target));
}

/**
 * clamp: pin the indicator to the scale end; indicate: clamp and show a label;
 * hide: omit the indicator while retaining the raw formatted value.
 */
export type RangeBoundaryPolicy = "clamp" | "indicate" | "hide";
export type RangeState = "within" | "below" | "above" | "invalid";

export interface RangePolicyOptions {
  underflowPolicy?: RangeBoundaryPolicy;
  overflowPolicy?: RangeBoundaryPolicy;
}

export interface NormalizedRange {
  min: number;
  max: number;
  rawValue: number;
  meterValue: number;
  fraction: number;
  state: RangeState;
  indicatorVisible: boolean;
  shouldIndicate: boolean;
}

export function normalizeRange(
  value: number,
  minValue: number,
  maxValue: number,
  {
    underflowPolicy = "indicate",
    overflowPolicy = "indicate",
  }: RangePolicyOptions = {},
): NormalizedRange {
  let min = Number.isFinite(minValue) ? minValue : 0;
  let max = Number.isFinite(maxValue) ? maxValue : 100;
  if (min > max) [min, max] = [max, min];
  if (min === max) max = min + Math.max(1, Math.abs(min) * 0.01);

  const isValidValue = Number.isFinite(value);
  const safeValue = isValidValue ? value : min;
  const state: RangeState = !isValidValue
    ? "invalid"
    : safeValue < min
      ? "below"
      : safeValue > max
        ? "above"
        : "within";
  const policy = state === "below"
    ? underflowPolicy
    : state === "above"
      ? overflowPolicy
      : "clamp";
  const meterValue = Math.min(max, Math.max(min, safeValue));

  return {
    min,
    max,
    rawValue: value,
    meterValue,
    fraction: (meterValue - min) / (max - min),
    state,
    indicatorVisible: state !== "invalid" && policy !== "hide",
    shouldIndicate: (state === "below" || state === "above") && policy === "indicate",
  };
}

export interface GaugeThreshold {
  to: number;
  color: string;
  label?: string;
}

export function normalizeThresholds(
  thresholds: readonly GaugeThreshold[] | undefined,
  min: number,
  max: number,
): GaugeThreshold[] {
  const result: GaugeThreshold[] = [];
  let previous = min;
  for (const threshold of [...(thresholds ?? [])].sort((a, b) => a.to - b.to)) {
    if (!Number.isFinite(threshold.to) || !threshold.color) continue;
    const to = Math.min(max, Math.max(min, threshold.to));
    if (to <= previous) continue;
    result.push({ ...threshold, to });
    previous = to;
    if (to >= max) break;
  }
  return result;
}

export type GaugeSize = "sm" | "md" | "lg" | number | string;

export function gaugeSize(size: GaugeSize | undefined, fallback: number): string {
  if (typeof size === "number") return `${Math.max(0, size)}px`;
  if (typeof size === "string" && !["sm", "md", "lg"].includes(size)) return size;
  return `${size === "sm" ? Math.round(fallback * 0.75) : size === "lg" ? Math.round(fallback * 1.2) : fallback}px`;
}
