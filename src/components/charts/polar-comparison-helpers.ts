import { roundSvgNumber, roundSvgPath } from "@/lib/utils";

export type NumericDomain = readonly [number, number];

export function finiteNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function normalizeNumericDomain(
  values: readonly unknown[],
  requested?: NumericDomain,
  includeZero = false,
): [number, number] {
  const finite = values.map(finiteNumber).filter((value): value is number => value != null);
  let min = finite.length ? Math.min(...finite) : 0;
  let max = finite.length ? Math.max(...finite) : 1;

  if (requested) {
    const requestedMin = finiteNumber(requested[0]);
    const requestedMax = finiteNumber(requested[1]);
    if (requestedMin != null && requestedMax != null) {
      min = requestedMin;
      max = requestedMax;
    }
  }
  if (min > max) [min, max] = [max, min];
  if (includeZero) {
    min = Math.min(0, min);
    max = Math.max(0, max);
  }
  if (min === max) {
    const padding = Math.max(1, Math.abs(min) * 0.05);
    min -= padding;
    max += padding;
  }
  return [min, max];
}

export function scaleToUnit(value: number, domain: NumericDomain): number {
  const [min, max] = normalizeNumericDomain([], domain);
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
}

export function polarPoint(
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  return {
    x: roundSvgNumber(cx + Math.cos(angle) * radius),
    y: roundSvgNumber(cy + Math.sin(angle) * radius),
  };
}

export function annularSectorPath(
  cx: number,
  cy: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const inner = Math.max(0, Math.min(innerRadius, outerRadius));
  const outer = Math.max(inner, outerRadius);
  const startOuter = polarPoint(cx, cy, outer, startAngle);
  const endOuter = polarPoint(cx, cy, outer, endAngle);
  const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;

  if (inner === 0) {
    return roundSvgPath([
      `M${cx},${cy}`,
      `L${startOuter.x},${startOuter.y}`,
      `A${outer},${outer},0,${largeArc},1,${endOuter.x},${endOuter.y}`,
      "Z",
    ].join(" "));
  }

  const startInner = polarPoint(cx, cy, inner, startAngle);
  const endInner = polarPoint(cx, cy, inner, endAngle);
  return roundSvgPath([
    `M${startOuter.x},${startOuter.y}`,
    `A${outer},${outer},0,${largeArc},1,${endOuter.x},${endOuter.y}`,
    `L${endInner.x},${endInner.y}`,
    `A${inner},${inner},0,${largeArc},0,${startInner.x},${startInner.y}`,
    "Z",
  ].join(" "));
}

export function radiusForValue(
  value: number,
  domain: NumericDomain,
  innerRadius: number,
  outerRadius: number,
  mode: "linear" | "area" = "linear",
): number {
  const unit = scaleToUnit(value, domain);
  const scaled = mode === "area" ? Math.sqrt(unit) : unit;
  return innerRadius + (outerRadius - innerRadius) * scaled;
}

export interface LikertValues {
  stronglyDisagree?: number;
  disagree?: number;
  neutral?: number;
  agree?: number;
  stronglyAgree?: number;
}

export interface LikertSegment {
  key: "stronglyDisagree" | "disagree" | "neutralLeft" | "neutralRight" | "agree" | "stronglyAgree";
  label: string;
  start: number;
  end: number;
  value: number;
  side: "negative" | "positive";
}

function responseMagnitude(value: unknown) {
  const finite = finiteNumber(value) ?? 0;
  return Math.abs(finite);
}

export function buildLikertSegments(
  values: LikertValues,
  normalize = true,
): { segments: LikertSegment[]; negative: number; positive: number; total: number } {
  const raw = {
    stronglyDisagree: responseMagnitude(values.stronglyDisagree),
    disagree: responseMagnitude(values.disagree),
    neutral: responseMagnitude(values.neutral),
    agree: responseMagnitude(values.agree),
    stronglyAgree: responseMagnitude(values.stronglyAgree),
  };
  const rawTotal = Object.values(raw).reduce((sum, value) => sum + value, 0);
  const factor = normalize && rawTotal > 0 ? 100 / rawTotal : 1;
  const amounts = {
    stronglyDisagree: raw.stronglyDisagree * factor,
    disagree: raw.disagree * factor,
    neutral: raw.neutral * factor,
    agree: raw.agree * factor,
    stronglyAgree: raw.stronglyAgree * factor,
  };
  const neutralHalf = amounts.neutral / 2;
  const negative = amounts.stronglyDisagree + amounts.disagree + neutralHalf;
  const positive = neutralHalf + amounts.agree + amounts.stronglyAgree;
  let negativeCursor = -negative;
  let positiveCursor = 0;
  const segments: LikertSegment[] = [];
  const pushNegative = (
    key: LikertSegment["key"],
    label: string,
    value: number,
  ) => {
    segments.push({ key, label, start: negativeCursor, end: negativeCursor + value, value, side: "negative" });
    negativeCursor += value;
  };
  const pushPositive = (
    key: LikertSegment["key"],
    label: string,
    value: number,
  ) => {
    segments.push({ key, label, start: positiveCursor, end: positiveCursor + value, value, side: "positive" });
    positiveCursor += value;
  };

  pushNegative("stronglyDisagree", "Strongly disagree", amounts.stronglyDisagree);
  pushNegative("disagree", "Disagree", amounts.disagree);
  pushNegative("neutralLeft", "Neutral", neutralHalf);
  pushPositive("neutralRight", "Neutral", neutralHalf);
  pushPositive("agree", "Agree", amounts.agree);
  pushPositive("stronglyAgree", "Strongly agree", amounts.stronglyAgree);

  return { segments, negative, positive, total: rawTotal * factor };
}

export interface TornadoValues {
  low: number;
  high: number;
}

export function sortTornadoRows<T extends TornadoValues>(rows: readonly T[]): T[] {
  return [...rows]
    .filter((row) => finiteNumber(row.low) != null && finiteNumber(row.high) != null)
    .sort((a, b) => (Math.abs(b.low) + Math.abs(b.high)) - (Math.abs(a.low) + Math.abs(a.high)));
}

export function resolveRankDomain(
  values: readonly unknown[],
  requested?: NumericDomain,
): [number, number] {
  const finite = values.map(finiteNumber).filter((value): value is number => value != null);
  const automatic: [number, number] = finite.length
    ? [Math.min(...finite), Math.max(...finite)]
    : [1, 2];
  return normalizeNumericDomain(finite, requested ?? automatic);
}
