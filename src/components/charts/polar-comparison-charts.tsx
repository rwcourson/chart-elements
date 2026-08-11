"use client";

import * as React from "react";
import * as d3 from "d3";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS, colorAt, foregroundAt, SEMANTIC } from "@/lib/chart-colors";
import { PLOT_MARGIN_COMPACT, SERIES_STROKE_WIDTH } from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { salesByRegion, stackedSeries } from "@/lib/sample-data";
import { formatCompact, formatPercent, formatSeriesName } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";
import { ChartTooltip, legendLabel } from "./chart-tooltip";
import {
  annularSectorPath,
  buildLikertSegments,
  finiteNumber,
  normalizeNumericDomain,
  polarPoint,
  radiusForValue,
  resolveRankDomain,
  sortTornadoRows,
  type LikertSegment,
  type LikertValues,
  type NumericDomain} from "./polar-comparison-helpers";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full min-h-0 w-full min-w-0 [&_.recharts-cartesian-grid_line]:stroke-[var(--chart-grid)]">
      {children}
    </div>
  );
}

export interface ComparisonTooltipItem {
  label: string;
  value: string;
}

interface ComparisonTooltipState {
  x: number;
  y: number;
  title: string;
  items: readonly ComparisonTooltipItem[];
}

function useComparisonTooltip() {
  const [tooltip, setTooltip] = React.useState<ComparisonTooltipState | null>(null);

  const show = React.useCallback((
    event: React.PointerEvent<SVGElement> | React.FocusEvent<SVGElement>,
    title: string,
    items: readonly ComparisonTooltipItem[],
  ) => {
    const element = event.currentTarget;
    const svg = element.ownerSVGElement;
    if (!svg) return;
    const svgRect = svg.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const pointer = "clientX" in event && event.clientX > 0
      ? { x: event.clientX, y: event.clientY }
      : { x: elementRect.left + elementRect.width / 2, y: elementRect.top };
    setTooltip({
      x: Math.max(8, Math.min(svgRect.width - 8, pointer.x - svgRect.left)),
      y: Math.max(8, pointer.y - svgRect.top),
      title,
      items});
  }, []);

  const hide = React.useCallback(() => setTooltip(null), []);
  const bind = React.useCallback((title: string, items: readonly ComparisonTooltipItem[]) => ({
    tabIndex: 0,
    role: "graphics-symbol" as const,
    "aria-label": `${title}. ${items.map((item) => `${item.label}: ${item.value}`).join(". ")}`,
    onPointerEnter: (event: React.PointerEvent<SVGElement>) => show(event, title, items),
    onPointerMove: (event: React.PointerEvent<SVGElement>) => show(event, title, items),
    onPointerLeave: hide,
    onFocus: (event: React.FocusEvent<SVGElement>) => show(event, title, items),
    onBlur: hide}), [hide, show]);

  return { tooltip, bind };
}

function ComparisonTooltip({ tooltip }: { tooltip: ComparisonTooltipState | null }) {
  if (!tooltip) return null;
  return (
    <div
      className="ce-chart-tooltip pointer-events-none absolute z-10 min-w-28 max-w-52 -translate-x-1/2 -translate-y-full rounded-[var(--radius)] border border-[var(--chart-tooltip-border)] bg-[var(--chart-tooltip-bg)] px-2.5 py-2 text-[11px] text-[var(--chart-tooltip-fg)] shadow-[var(--overlay-shadow)]"
      style={{ left: tooltip.x, top: tooltip.y - 8 }}
      role="status"
      aria-live="polite"
    >
      <div className="font-semibold">{tooltip.title}</div>
      {tooltip.items.map((item) => (
        <div key={item.label} className="mt-0.5 flex justify-between gap-3 tabular-nums">
          <span className="text-muted-foreground">{item.label}</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function AccessibleComparisonTable({
  caption,
  headers,
  rows}: {
  caption: string;
  headers: readonly string[];
  rows: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <ScreenReaderTable>
      <caption>{caption}</caption>
      <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>{row.map((cell, cellIndex) => cellIndex === 0
            ? <th key={cellIndex} scope="row">{cell}</th>
            : <td key={cellIndex}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </ScreenReaderTable>
  );
}

function useSvgLabelIds(prefix: string) {
  const id = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return { titleId: `${prefix}-${id}-title`, descriptionId: `${prefix}-${id}-description` };
}

// Depth without color math: the fill eases to 82% opacity toward the
// baseline, which reads as a soft side light on these horizontal bars.
// Ids carry a per-instance uid so two charts never share a <defs> entry.
function BarGradients({ uid, colors }: { uid: string; colors: string[] }) {
  return (
    <defs>
      {colors.map((color, i) => (
        <linearGradient
          key={i}
          id={`polar-${uid}-${i}`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0%" stopColor={color} stopOpacity={1} />
          <stop offset="100%" stopColor={color} stopOpacity={0.82} />
        </linearGradient>
      ))}
    </defs>
  );
}

export interface RadarDatum {
  metric: string;
  [series: string]: string | number | null | undefined;
}

export interface RadarChartProps {
  data?: readonly RadarDatum[];
  keys?: readonly string[];
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
}

export type SpiderChartProps = RadarChartProps;

export interface PolarDatum {
  name: string;
  value: number;
  color?: string;
}

export interface PolarChartProps {
  data?: readonly PolarDatum[];
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  negativeValuePolicy?: "omit" | "clamp" | "absolute" | "signed";
}

export type RoseChartProps = PolarChartProps;
export type CoxcombChartProps = PolarChartProps;
export interface PolarAreaChartProps extends PolarChartProps {
  innerRadius?: number;
}

export interface NightingaleDatum {
  name: string;
  [series: string]: string | number | null | undefined;
}

export interface NightingaleSeries {
  key: string;
  label: string;
  color?: string;
}

export interface NightingaleRoseProps {
  data?: readonly NightingaleDatum[];
  series?: readonly NightingaleSeries[];
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
}

const defaultRadar: RadarDatum[] = [
  { metric: "Speed", current: 78, target: 62 },
  { metric: "Quality", current: 85, target: 70 },
  { metric: "Cost", current: 64, target: 82 },
  { metric: "Support", current: 72, target: 68 },
  { metric: "Scale", current: 88, target: 74 },
];

const defaultRose: PolarDatum[] = [
  { name: "Q1", value: 32 },
  { name: "Q2", value: 48 },
  { name: "Q3", value: 38 },
  { name: "Q4", value: 54 },
  { name: "Q5", value: 42 },
  { name: "Q6", value: 36 },
];

const defaultNightingale: NightingaleDatum[] = [
  { name: "Jan", disease: 34, wounds: 14, other: 7 },
  { name: "Feb", disease: 42, wounds: 12, other: 8 },
  { name: "Mar", disease: 30, wounds: 9, other: 6 },
  { name: "Apr", disease: 24, wounds: 8, other: 5 },
  { name: "May", disease: 18, wounds: 7, other: 4 },
  { name: "Jun", disease: 15, wounds: 6, other: 4 },
];

const defaultNightingaleSeries: readonly NightingaleSeries[] = [
  { key: "disease", label: "Disease" },
  { key: "wounds", label: "Wounds" },
  { key: "other", label: "Other causes" },
];

const defaultLollipop = salesByRegion.map((r) => ({ name: r.name, value: r.sales }));

const defaultDumbbell = [
  { name: "North", start: 380, end: 420 },
  { name: "South", start: 340, end: 380 },
  { name: "East", start: 470, end: 510 },
  { name: "West", start: 250, end: 290 },
];

export interface SlopeDatum {
  name: string;
  start: number;
  end: number;
}

export interface SlopeChartProps {
  data?: readonly SlopeDatum[];
  startLabel?: string;
  endLabel?: string;
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
}

export type ConnectedDotPlotProps = SlopeChartProps;

export interface BumpDatum {
  period: string;
  [series: string]: string | number | null | undefined;
}

export interface BumpChartProps {
  data?: readonly BumpDatum[];
  keys?: readonly string[];
  rankDomain?: NumericDomain;
  ariaLabel?: string;
  rankFormatter?: (rank: number) => string;
}

export type NegativeMagnitudePolicy = "omit" | "clamp" | "absolute";

export interface ButterflyDatum {
  name: string;
  left: number;
  right: number;
}

export interface ButterflyChartProps {
  data?: readonly ButterflyDatum[];
  leftLabel?: string;
  rightLabel?: string;
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  negativeValuePolicy?: NegativeMagnitudePolicy;
}

export interface TornadoDatum {
  name: string;
  low: number;
  high: number;
}

export interface TornadoChartProps {
  data?: readonly TornadoDatum[];
  lowLabel?: string;
  highLabel?: string;
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  negativeValuePolicy?: NegativeMagnitudePolicy;
  sortByImpact?: boolean;
}

export interface PopulationPyramidDatum {
  age: string;
  male: number;
  female: number;
}

export interface PopulationPyramidProps {
  data?: readonly PopulationPyramidDatum[];
  maleLabel?: string;
  femaleLabel?: string;
  domain?: NumericDomain;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  negativeValuePolicy?: NegativeMagnitudePolicy;
}

const defaultSlope: SlopeDatum[] = [
  { name: "A", start: 42, end: 58 },
  { name: "B", start: 55, end: 52 },
  { name: "C", start: 38, end: 64 },
  { name: "D", start: 48, end: 46 },
];

const defaultBump: BumpDatum[] = stackedSeries.map((row, i) => ({
  period: row.name,
  product: 4 - (i % 4),
  service: 2 + (i % 3),
  other: 1 + (i % 2)}));

const defaultButterfly: ButterflyDatum[] = salesByRegion.map((row) => ({
  name: row.name,
  left: row.target,
  right: row.sales}));

const defaultTornado: TornadoDatum[] = [
  { name: "Demand", low: 38, high: 54 },
  { name: "Unit price", low: 31, high: 43 },
  { name: "Labor cost", low: 24, high: 29 },
  { name: "FX rate", low: 16, high: 22 },
  { name: "Freight", low: 10, high: 14 },
];

const defaultPopulation: PopulationPyramidDatum[] = [
  { age: "0–9", male: 22, female: 21 },
  { age: "10–19", male: 18, female: 17 },
  { age: "20–29", male: 24, female: 23 },
  { age: "30–39", male: 20, female: 19 },
  { age: "40–49", male: 16, female: 15 },
  { age: "50–59", male: 13, female: 14 },
];

export interface DivergingBarDatum {
  topic: string;
  disagree: number;
  neutral: number;
  agree: number;
}

export interface DivergingBarChartProps {
  data?: readonly DivergingBarDatum[];
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
}

const defaultLikert: DivergingBarDatum[] = [
  { topic: "UX", disagree: -18, neutral: 22, agree: 60 },
  { topic: "Price", disagree: -28, neutral: 30, agree: 42 },
  { topic: "Support", disagree: -12, neutral: 18, agree: 70 },
  { topic: "Features", disagree: -8, neutral: 24, agree: 68 },
];

export interface LikertDatum extends LikertValues {
  topic: string;
}

export interface LikertChartProps {
  data?: readonly LikertDatum[];
  normalize?: boolean;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
}

const defaultLikertFivePoint: LikertDatum[] = [
  { topic: "UX", stronglyDisagree: 6, disagree: 12, neutral: 22, agree: 42, stronglyAgree: 18 },
  { topic: "Price", stronglyDisagree: 11, disagree: 17, neutral: 30, agree: 29, stronglyAgree: 13 },
  { topic: "Support", stronglyDisagree: 4, disagree: 8, neutral: 18, agree: 45, stronglyAgree: 25 },
  { topic: "Features", stronglyDisagree: 3, disagree: 5, neutral: 24, agree: 44, stronglyAgree: 24 },
];

const defaultWaffle = { total: 100, value: 64, label: "Satisfied" };

const defaultParallel = stackedSeries.map((r) => ({
  name: r.name,
  product: r.product,
  service: r.service,
  other: r.other}));

function sanitizedRadarData(data: readonly RadarDatum[], keys: readonly string[]) {
  return data
    .filter((row) => typeof row.metric === "string" && row.metric.trim().length > 0)
    .map((row) => {
      const result: RadarDatum = { metric: row.metric };
      for (const key of keys) result[key] = finiteNumber(row[key]);
      return result;
    })
    .filter((row) => keys.some((key) => typeof row[key] === "number"));
}

function RadarBase({
  data = defaultRadar,
  keys = ["current", "target"],
  domain,
  ariaLabel,
  valueFormatter = formatCompact,
  spider}: RadarChartProps & { spider: boolean }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const safeKeys = [...new Set(keys.filter(Boolean))];
  const safeData = sanitizedRadarData(data, safeKeys);
  const values = safeData.flatMap((row) => safeKeys.map((key) => finiteNumber(row[key])).filter((value): value is number => value != null));
  const resolvedDomain = normalizeNumericDomain(values, domain, values.every((value) => value >= 0));

  if (!safeData.length || !safeKeys.length) {
    return <Shell><ChartEmpty /></Shell>;
  }

  return (
    <Shell>
      <div className="h-full w-full" role="group" aria-label={ariaLabel ?? (spider ? "Spider chart comparison" : "Radar chart comparison")}>
      <ChartResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart accessibilityLayer data={safeData} margin={{ top: 12, right: 30, left: 30, bottom: 12 }} /* radar label breathing room — not PLOT_MARGIN */>
          <PolarGrid gridType={spider ? "polygon" : "circle"} radialLines={spider} />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--chart-axis)", fontSize: 10 }} />
          <PolarRadiusAxis
            domain={resolvedDomain}
            tickCount={5}
            angle={90}
            axisLine={false}
            tick={{ fill: "var(--chart-axis)", fontSize: 8 }}
            tickFormatter={(value) => valueFormatter(Number(value))}
          />
          <Tooltip content={<ChartTooltip valueFormatter={valueFormatter} />} />
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
          {safeKeys.map((k, i) => (
            <Radar
              key={k}
              name={k}
              dataKey={k}
              stroke={colorAt(i)}
              strokeWidth={SERIES_STROKE_WIDTH}
              strokeLinecap="round"
              strokeDasharray={spider && i > 0 ? "5 3" : undefined}
              strokeOpacity={hover.opacityFor(k)}
              fill={colorAt(i)}
              fillOpacity={(spider ? 0.04 : 0.18) * hover.opacityFor(k)}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...anim}
              {...hover.bind(k)}
            />
          ))}
        </RechartsRadarChart>
      </ChartResponsiveContainer>
      </div>
      <AccessibleComparisonTable
        caption={ariaLabel ?? (spider ? "Spider chart data" : "Radar chart data")}
        headers={["Metric", ...safeKeys]}
        rows={safeData.map((row) => [row.metric, ...safeKeys.map((key) => {
          const value = finiteNumber(row[key]);
          return value == null ? "Unavailable" : valueFormatter(value);
        })])}
      />
    </Shell>
  );
}

export function RadarChart(props: RadarChartProps) {
  return <RadarBase {...props} spider={false} />;
}

export function SpiderChart(props: SpiderChartProps) {
  return <RadarBase {...props} spider />;
}

function sanitizePolarData(
  data: readonly PolarDatum[],
  negativeValuePolicy: NonNullable<PolarChartProps["negativeValuePolicy"]>,
) {
  return data.flatMap((datum) => {
    const value = finiteNumber(datum.value);
    if (!datum.name || value == null) return [];
    if (value >= 0 || negativeValuePolicy === "signed") return [{ ...datum, value }];
    if (negativeValuePolicy === "omit") return [];
    return [{ ...datum, value: negativeValuePolicy === "absolute" ? Math.abs(value) : 0 }];
  });
}

function PolarAxes({
  cx,
  cy,
  innerRadius,
  outerRadius,
  domain,
  mode,
  formatter,
  /** When true, draw concentric rings only — no value numbers on the plot. */
  ringsOnly = false}: {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  domain: NumericDomain;
  mode: "linear" | "area";
  formatter: (value: number) => string;
  ringsOnly?: boolean;
}) {
  const ticks = [0.25, 0.5, 0.75, 1].map(
    (fraction) => domain[0] + (domain[1] - domain[0]) * fraction,
  );
  return (
    <g aria-hidden="true">
      {ticks.map((tick) => {
        const radius = radiusForValue(tick, domain, innerRadius, outerRadius, mode);
        return (
          <circle
            key={tick}
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="var(--chart-grid)"
            strokeWidth={1}
          />
        );
      })}
      {/* Value scale lives outside the wheel so it never collides with Q1–Q6. */}
      {!ringsOnly ? (
        <g transform={`translate(${cx + outerRadius + 28}, ${cy - 28})`}>
          <text
            x={0}
            y={0}
            fill="var(--muted-foreground)"
            fontSize={10}
            fontWeight={600}
            letterSpacing="0.04em"
          >
            SCALE
          </text>
          {ticks.map((tick, index) => (
            <text
              key={tick}
              x={0}
              y={16 + index * 14}
              fill="var(--chart-axis)"
              fontSize={11}
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {formatter(tick)}
            </text>
          ))}
        </g>
      ) : null}
    </g>
  );
}

export function PolarChart({
  data = defaultRose,
  domain,
  ariaLabel = "Polar line chart",
  valueFormatter = formatCompact,
  negativeValuePolicy = "signed"}: PolarChartProps) {
  const safeData = sanitizePolarData(data, negativeValuePolicy);
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("polar-line");
  if (!safeData.length) return <Shell><ChartEmpty /></Shell>;
  const width = 400;
  const height = 260;
  const cx = 200;
  const cy = 126;
  const outerRadius = 84;
  const resolvedDomain = normalizeNumericDomain(safeData.map((datum) => datum.value), domain, safeData.every((datum) => datum.value >= 0));
  const angleStep = (Math.PI * 2) / safeData.length;
  const points = safeData.map((datum, index) => {
    const angle = -Math.PI / 2 + angleStep * index;
    const radius = radiusForValue(datum.value, resolvedDomain, 0, outerRadius, "linear");
    return { ...datum, angle, ...polarPoint(cx, cy, radius, angle) };
  });
  const path = `${points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ")} Z`;

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
      >
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descriptionId}>Values are plotted by radial distance and connected in category order.</desc>
        <PolarAxes cx={cx} cy={cy} innerRadius={0} outerRadius={outerRadius} domain={resolvedDomain} mode="linear" formatter={valueFormatter} />
        {points.map((point) => {
          const end = polarPoint(cx, cy, outerRadius, point.angle);
          const label = polarPoint(cx, cy, outerRadius + 17, point.angle);
          return (
            <g key={`axis-${point.name}`} aria-hidden="true">
              <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke="var(--chart-grid)" />
              <text x={label.x} y={label.y + 3} textAnchor="middle" className="fill-[var(--chart-axis)] text-[9px]">{point.name}</text>
            </g>
          );
        })}
        <path d={path} fill="var(--chart-1)" fillOpacity={0.08} stroke="var(--chart-1)" strokeWidth={2} />
        {points.map((point, index) => (
          <circle
            key={point.name}
            cx={point.x}
            cy={point.y}
            r={5}
            fill={point.color ?? colorAt(index)}
            stroke="var(--card)"
            strokeWidth={1.5}
            {...bind(point.name, [{ label: "Value", value: valueFormatter(point.value) }])}
          >
            <title>{`${point.name}: ${valueFormatter(point.value)}`}</title>
          </circle>
        ))}
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Category", "Value"]} rows={safeData.map((datum) => [datum.name, valueFormatter(datum.value)])} />
    </Shell>
  );
}

function RoseVariant({
  data = defaultRose,
  domain,
  ariaLabel,
  valueFormatter = formatCompact,
  negativeValuePolicy,
  variant,
  innerRadius}: PolarChartProps & { variant: "rose" | "coxcomb" | "polar-area"; innerRadius?: number }) {
  const policy = negativeValuePolicy ?? (variant === "polar-area" ? "signed" : "omit");
  const safeData = sanitizePolarData(data, policy);
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds(`polar-${variant}`);
  if (!safeData.length)
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  // Leave room on the right for the value scale legend (never on the wheel).
  const width = 460;
  const height = 300;
  const cx = 200;
  const cy = 150;
  const outerRadius = 96;
  const resolvedDomain = normalizeNumericDomain(
    safeData.map((datum) => datum.value),
    domain,
    variant !== "polar-area" || safeData.every((datum) => datum.value >= 0),
  );
  const n = safeData.length;
  const angleStep = (Math.PI * 2) / n;
  // Uniform angular gutter between every pair of slices. Larger than before so
  // the white separators read clearly (and identically) all the way around.
  const halfGap = Math.min(0.045, angleStep * 0.14);
  const areaMode = variant === "coxcomb" ? "area" : "linear";
  const radialInner = variant === "polar-area" ? Math.max(0, innerRadius ?? 22) : 0;
  const baselineRadius =
    variant === "polar-area"
      ? radiusForValue(0, resolvedDomain, radialInner, outerRadius, "linear")
      : 0;
  const chartLabel =
    ariaLabel ??
    (variant === "rose"
      ? "Rose chart"
      : variant === "coxcomb"
        ? "Coxcomb chart"
        : "Polar area chart");
  const chartFont =
    'var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif';

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        style={{ fontFamily: chartFont }}
        data-chart-svg
      >
        <title id={titleId}>{chartLabel}</title>
        <desc id={descriptionId}>
          {variant === "coxcomb"
            ? "Sector area encodes value."
            : variant === "rose"
              ? "Petal radius encodes value."
              : "Signed radial bars extend from the zero baseline."}
        </desc>
        <PolarAxes
          cx={cx}
          cy={cy}
          innerRadius={radialInner}
          outerRadius={outerRadius}
          domain={resolvedDomain}
          mode={areaMode}
          formatter={valueFormatter}
        />
        {safeData.map((datum, index) => {
          const start = -Math.PI / 2 + angleStep * index + halfGap;
          const end = -Math.PI / 2 + angleStep * (index + 1) - halfGap;
          const mid = (start + end) / 2;
          const valueRadius = radiusForValue(
            datum.value,
            resolvedDomain,
            radialInner,
            outerRadius,
            areaMode,
          );
          const fromRadius =
            variant === "polar-area"
              ? Math.min(baselineRadius, valueRadius)
              : 0;
          const toRadius =
            variant === "polar-area"
              ? Math.max(baselineRadius, valueRadius)
              : valueRadius;
          const labelPoint = polarPoint(cx, cy, outerRadius + 22, mid);
          const color = datum.color ?? colorAt(index);
          const cos = Math.cos(mid);
          const textAnchor =
            Math.abs(cos) < 0.35 ? "middle" : cos > 0 ? "start" : "end";
          return (
            <g key={datum.name}>
              <path
                d={annularSectorPath(cx, cy, fromRadius, toRadius, start, end)}
                fill={color}
                fillOpacity={variant === "coxcomb" ? 0.8 : 0.72}
                {...bind(datum.name, [
                  { label: "Value", value: valueFormatter(datum.value) },
                ])}
              >
                <title>{`${datum.name}: ${valueFormatter(datum.value)}`}</title>
              </path>
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="var(--secondary-foreground)"
                fontSize={12}
                fontWeight={500}
                letterSpacing="-0.01em"
                aria-hidden="true"
              >
                {datum.name}
              </text>
            </g>
          );
        })}
        {variant === "polar-area" ? (
          <circle
            cx={cx}
            cy={cy}
            r={baselineRadius}
            fill="none"
            stroke="var(--chart-axis)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
            aria-hidden="true"
          />
        ) : null}
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable
        caption={`${chartLabel} data`}
        headers={["Category", "Value"]}
        rows={safeData.map((datum) => [
          datum.name,
          valueFormatter(datum.value),
        ])}
      />
    </Shell>
  );
}

export function RoseChart(props: RoseChartProps) {
  return <RoseVariant {...props} variant="rose" />;
}

export function CoxcombChart(props: CoxcombChartProps) {
  return <RoseVariant {...props} variant="coxcomb" />;
}

export function NightingaleRose({
  data = defaultNightingale,
  series = defaultNightingaleSeries,
  ariaLabel = "Nightingale rose chart",
  valueFormatter = formatCompact}: NightingaleRoseProps) {
  const safeSeries = series.filter((item, index, all) => item.label && all.findIndex((candidate) => candidate.key === item.key) === index);
  const safeData = data.filter((datum) => datum.name && safeSeries.some((item) => finiteNumber(datum[item.key]) != null));
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("nightingale");
  if (!safeData.length || !safeSeries.length)
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  const width = 460;
  const height = 300;
  const cx = 200;
  const cy = 140;
  const outerRadius = 90;
  const angleStep = (Math.PI * 2) / safeData.length;
  const totals = safeData.map((datum) =>
    safeSeries.reduce(
      (sum, item) => sum + Math.max(0, finiteNumber(datum[item.key]) ?? 0),
      0,
    ),
  );
  const domain = normalizeNumericDomain(totals, undefined, true);

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-labelledby={`${titleId} ${descriptionId}`}
        data-chart-svg
      >
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descriptionId}>
          Stacked sector areas compare causes across periods.
        </desc>
        <PolarAxes
          cx={cx}
          cy={cy}
          innerRadius={0}
          outerRadius={outerRadius}
          domain={domain}
          mode="area"
          formatter={valueFormatter}
        />
        {safeData.map((datum, datumIndex) => {
          const halfGap = Math.min(0.045, angleStep * 0.14);
          const start = -Math.PI / 2 + angleStep * datumIndex + halfGap;
          const end = -Math.PI / 2 + angleStep * (datumIndex + 1) - halfGap;
          const mid = (start + end) / 2;
          const label = polarPoint(cx, cy, outerRadius + 18, mid);
          const cos = Math.cos(mid);
          const textAnchor =
            Math.abs(cos) < 0.35 ? "middle" : cos > 0 ? "start" : "end";
          let cumulative = 0;
          return (
            <g key={datum.name}>
              {safeSeries.map((item, seriesIndex) => {
                const value = Math.max(0, finiteNumber(datum[item.key]) ?? 0);
                const previous = cumulative;
                cumulative += value;
                const inner = radiusForValue(previous, domain, 0, outerRadius, "area");
                const outer = radiusForValue(cumulative, domain, 0, outerRadius, "area");
                const color = item.color ?? colorAt(seriesIndex);
                return (
                  <path
                    key={item.key}
                    d={annularSectorPath(cx, cy, inner, outer, start, end)}
                    fill={color}
                    fillOpacity={0.82}
                    {...bind(datum.name, [
                      { label: item.label, value: valueFormatter(value) },
                      { label: "Total", value: valueFormatter(totals[datumIndex] ?? 0) },
                    ])}
                  >
                    <title>{`${datum.name}, ${item.label}: ${valueFormatter(value)}`}</title>
                  </path>
                );
              })}
              <text
                x={label.x}
                y={label.y}
                textAnchor={textAnchor}
                dominantBaseline="central"
                fill="var(--secondary-foreground)"
                fontSize={12}
                fontWeight={500}
                aria-hidden="true"
              >
                {datum.name}
              </text>
            </g>
          );
        })}
        <g transform="translate(44,246)" aria-hidden="true">
          {safeSeries.map((item, index) => (
            <g key={item.key} transform={`translate(${index * 108},0)`}>
              <circle cx={0} cy={0} r={4} fill={item.color ?? colorAt(index)} />
              <text x={8} y={3} className="fill-[var(--chart-axis)] text-[9px]">{item.label}</text>
            </g>
          ))}
        </g>
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable
        caption={`${ariaLabel} data`}
        headers={["Period", ...safeSeries.map((item) => item.label)]}
        rows={safeData.map((datum) => [datum.name, ...safeSeries.map((item) => valueFormatter(Math.max(0, finiteNumber(datum[item.key]) ?? 0)))])}
      />
    </Shell>
  );
}

export function PolarAreaChart({ innerRadius, ...props }: PolarAreaChartProps) {
  return <RoseVariant {...props} innerRadius={innerRadius} variant="polar-area" />;
}

export function LollipopChart({ data = defaultLollipop }: { data?: typeof defaultLollipop }) {
  const width = 400;
  const height = 220;
  const pad = { l: 40, r: 12, t: 12, b: 32 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleBand().domain(data.map((d) => d.name)).range([0, h]).padding(0.25);
  const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value) ?? 1]).range([0, w]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${pad.l},${pad.t})`}>
          {data.map((d, i) => {
            const cy = (y(d.name) ?? 0) + y.bandwidth() / 2;
            return (
              <g key={d.name}>
                <line x1={0} x2={x(d.value)} y1={cy} y2={cy} stroke={colorAt(i)} strokeWidth={2} />
                <circle cx={x(d.value)} cy={cy} r={5} fill={colorAt(i)} />
              </g>
            );
          })}
        </g>
      </svg>
    </Shell>
  );
}

export function DumbbellChart({ data = defaultDumbbell }: { data?: typeof defaultDumbbell }) {
  const width = 400;
  const height = 220;
  const pad = { l: 40, r: 12, t: 12, b: 32 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleBand().domain(data.map((d) => d.name)).range([0, h]).padding(0.3);
  const x = d3.scaleLinear().domain([d3.min(data, (d) => d.start) ?? 0, d3.max(data, (d) => d.end) ?? 1]).range([0, w]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${pad.l},${pad.t})`}>
          {data.map((d) => {
            const cy = (y(d.name) ?? 0) + y.bandwidth() / 2;
            return (
              <g key={d.name}>
                <line x1={x(d.start)} x2={x(d.end)} y1={cy} y2={cy} stroke="var(--chart-axis)" strokeWidth={2} />
                <circle cx={x(d.start)} cy={cy} r={5} fill={SEMANTIC.negative} />
                <circle cx={x(d.end)} cy={cy} r={5} fill={SEMANTIC.positive} />
              </g>
            );
          })}
        </g>
      </svg>
    </Shell>
  );
}

function sanitizeSlopeData(data: readonly SlopeDatum[]) {
  return data.flatMap((datum) => {
    const start = finiteNumber(datum.start);
    const end = finiteNumber(datum.end);
    return datum.name && start != null && end != null ? [{ ...datum, start, end }] : [];
  });
}

export function ConnectedDotPlot({
  data = defaultSlope,
  startLabel = "Previous",
  endLabel = "Current",
  domain,
  ariaLabel = "Connected dot plot",
  valueFormatter = formatCompact}: ConnectedDotPlotProps) {
  const safeData = sanitizeSlopeData(data);
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("connected-dot");
  if (!safeData.length) return <Shell><ChartEmpty /></Shell>;
  const width = 440;
  const height = 260;
  const pad = { l: 82, r: 24, t: 38, b: 32 };
  const plotWidth = width - pad.l - pad.r;
  const plotHeight = height - pad.t - pad.b;
  const resolvedDomain = normalizeNumericDomain(safeData.flatMap((datum) => [datum.start, datum.end]), domain);
  const x = d3.scaleLinear().domain(resolvedDomain).range([0, plotWidth]);
  const y = d3.scaleBand().domain(safeData.map((datum) => datum.name)).range([0, plotHeight]).padding(0.34);
  const ticks = x.ticks(5);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="group" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descriptionId}>Horizontal links compare two values for each category on a shared quantitative scale.</desc>
        <g transform={`translate(${pad.l},${pad.t})`}>
          {ticks.map((tick) => (
            <g key={tick} aria-hidden="true">
              <line x1={x(tick)} x2={x(tick)} y1={0} y2={plotHeight} stroke="var(--chart-grid)" />
              <text x={x(tick)} y={plotHeight + 17} textAnchor="middle" className="fill-[var(--chart-axis)] text-[9px]">{valueFormatter(tick)}</text>
            </g>
          ))}
          {safeData.map((datum) => {
            const cy = (y(datum.name) ?? 0) + y.bandwidth() / 2;
            return (
              <g key={datum.name} className="outline-none" {...bind(datum.name, [
                { label: startLabel, value: valueFormatter(datum.start) },
                { label: endLabel, value: valueFormatter(datum.end) },
                { label: "Change", value: valueFormatter(datum.end - datum.start) },
              ])}>
                <text x={-9} y={cy + 3} textAnchor="end" className="fill-[var(--chart-axis)] text-[9px]" aria-hidden="true">{datum.name}</text>
                <line x1={x(datum.start)} x2={x(datum.end)} y1={cy} y2={cy} stroke="var(--chart-axis)" strokeWidth={2.5} />
                <circle cx={x(datum.start)} cy={cy} r={5.5} fill={SEMANTIC.negative} stroke="var(--card)" strokeWidth={1.5} />
                <circle cx={x(datum.end)} cy={cy} r={5.5} fill={SEMANTIC.positive} stroke="var(--card)" strokeWidth={1.5} />
              </g>
            );
          })}
          <g transform="translate(20,-20)" aria-hidden="true">
            <circle cx={0} cy={0} r={4} fill={SEMANTIC.negative} /><text x={8} y={3} className="fill-[var(--chart-axis)] text-[9px]">{startLabel}</text>
            <circle cx={112} cy={0} r={4} fill={SEMANTIC.positive} /><text x={120} y={3} className="fill-[var(--chart-axis)] text-[9px]">{endLabel}</text>
          </g>
        </g>
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Category", startLabel, endLabel, "Change"]} rows={safeData.map((datum) => [datum.name, valueFormatter(datum.start), valueFormatter(datum.end), valueFormatter(datum.end - datum.start)])} />
    </Shell>
  );
}

export function SlopeChart({
  data = defaultSlope,
  startLabel = "2024",
  endLabel = "2025",
  domain,
  ariaLabel = "Slope chart",
  valueFormatter = formatCompact}: SlopeChartProps) {
  const safeData = sanitizeSlopeData(data);
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("slope");
  if (!safeData.length) return <Shell><ChartEmpty /></Shell>;
  const width = 440;
  const height = 260;
  const pad = { l: 96, r: 82, t: 38, b: 26 };
  const plotHeight = height - pad.t - pad.b;
  const leftX = pad.l;
  const rightX = width - pad.r;
  const resolvedDomain = normalizeNumericDomain(safeData.flatMap((datum) => [datum.start, datum.end]), domain);
  const y = d3.scaleLinear().domain(resolvedDomain).range([plotHeight, 0]);
  const ticks = y.ticks(5);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="group" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descriptionId}>Sloped lines show how every category changes between two periods.</desc>
        <text x={leftX} y={19} textAnchor="middle" className="fill-[var(--chart-axis)] text-[10px] font-semibold">{startLabel}</text>
        <text x={rightX} y={19} textAnchor="middle" className="fill-[var(--chart-axis)] text-[10px] font-semibold">{endLabel}</text>
        <g transform={`translate(0,${pad.t})`}>
          {ticks.map((tick) => (
            <line key={tick} x1={leftX} x2={rightX} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" strokeDasharray="2 4" aria-hidden="true" />
          ))}
          {safeData.map((datum, index) => (
            <g key={datum.name} className="outline-none" {...bind(datum.name, [
              { label: startLabel, value: valueFormatter(datum.start) },
              { label: endLabel, value: valueFormatter(datum.end) },
              { label: "Change", value: valueFormatter(datum.end - datum.start) },
            ])}>
              <line x1={leftX} x2={rightX} y1={y(datum.start)} y2={y(datum.end)} stroke={colorAt(index)} strokeWidth={SERIES_STROKE_WIDTH} />
              <circle cx={leftX} cy={y(datum.start)} r={4.5} fill={colorAt(index)} stroke="var(--card)" strokeWidth={1.25} />
              <circle cx={rightX} cy={y(datum.end)} r={4.5} fill={colorAt(index)} stroke="var(--card)" strokeWidth={1.25} />
              <text x={leftX - 8} y={y(datum.start) + 3} textAnchor="end" className="fill-[var(--chart-axis)] text-[8.5px]" aria-hidden="true">{datum.name} · {valueFormatter(datum.start)}</text>
              <text x={rightX + 8} y={y(datum.end) + 3} className="fill-[var(--chart-axis)] text-[8.5px]" aria-hidden="true">{valueFormatter(datum.end)}</text>
            </g>
          ))}
        </g>
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Category", startLabel, endLabel, "Change"]} rows={safeData.map((datum) => [datum.name, valueFormatter(datum.start), valueFormatter(datum.end), valueFormatter(datum.end - datum.start)])} />
    </Shell>
  );
}

export function BumpChart({
  data = defaultBump,
  keys = ["product", "service", "other"],
  rankDomain,
  ariaLabel = "Bump chart",
  rankFormatter = (rank) => `#${rank}`}: BumpChartProps) {
  const safeKeys = [...new Set(keys.filter(Boolean))];
  const safeData = data.filter((datum) => datum.period && safeKeys.some((key) => finiteNumber(datum[key]) != null));
  const ranks = safeData.flatMap((datum) => safeKeys.map((key) => finiteNumber(datum[key])).filter((rank): rank is number => rank != null));
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("bump");
  if (!safeData.length || !safeKeys.length || !ranks.length) return <Shell><ChartEmpty /></Shell>;
  const width = 440;
  const height = 260;
  const pad = { l: 40, r: 58, t: 18, b: 48 };
  const plotWidth = width - pad.l - pad.r;
  const plotHeight = height - pad.t - pad.b;
  const resolvedDomain = resolveRankDomain(ranks, rankDomain);
  const x = d3.scalePoint().domain(safeData.map((datum) => datum.period)).range([0, plotWidth]);
  const y = d3.scaleLinear().domain(resolvedDomain).range([0, plotHeight]);
  const tickCount = Math.min(8, Math.max(2, Math.ceil(resolvedDomain[1] - resolvedDomain[0]) + 1));
  const rankTicks = y.ticks(tickCount).filter((tick) => Number.isInteger(tick));

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="group" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{ariaLabel}</title>
        <desc id={descriptionId}>Lines track rank across periods, with the best rank at the top.</desc>
        <g transform={`translate(${pad.l},${pad.t})`}>
          {rankTicks.map((rank) => (
            <g key={rank} aria-hidden="true">
              <line x1={0} x2={plotWidth} y1={y(rank)} y2={y(rank)} stroke="var(--chart-grid)" />
              <text x={-8} y={y(rank) + 3} textAnchor="end" className="fill-[var(--chart-axis)] text-[8px]">{rankFormatter(rank)}</text>
            </g>
          ))}
          {safeData.map((datum) => (
            <text key={datum.period} x={x(datum.period)} y={plotHeight + 17} textAnchor="middle" className="fill-[var(--chart-axis)] text-[8.5px]" aria-hidden="true">{datum.period}</text>
          ))}
          {safeKeys.map((key, keyIndex) => {
            const points = safeData.flatMap((datum) => {
              const rank = finiteNumber(datum[key]);
              return rank == null ? [] : [{ period: datum.period, rank }];
            });
            return (
              <g key={key}>
                <path d={points.map((point, index) => `${index ? "L" : "M"}${x(point.period)},${y(point.rank)}`).join(" ")} fill="none" stroke={colorAt(keyIndex)} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" />
                {points.map((point) => (
                  <circle key={point.period} cx={x(point.period)} cy={y(point.rank)} r={4.25} fill={colorAt(keyIndex)} stroke="var(--card)" strokeWidth={1.25} {...bind(`${formatSeriesName(key)}, ${point.period}`, [{ label: "Rank", value: rankFormatter(point.rank) }])}>
                    <title>{`${formatSeriesName(key)}, ${point.period}: ${rankFormatter(point.rank)}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}
          <g transform={`translate(4,${plotHeight + 36})`} aria-hidden="true">
            {safeKeys.map((key, index) => (
              <g key={key} transform={`translate(${index * Math.max(88, plotWidth / safeKeys.length)},0)`}>
                <circle r={4} fill={colorAt(index)} />
                <text x={8} y={3} className="fill-[var(--chart-axis)] text-[8.5px]">{formatSeriesName(key)}</text>
              </g>
            ))}
          </g>
        </g>
      </svg>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Period", ...safeKeys.map(formatSeriesName)]} rows={safeData.map((datum) => [datum.period, ...safeKeys.map((key) => {
        const rank = finiteNumber(datum[key]);
        return rank == null ? "Unavailable" : rankFormatter(rank);
      })])} />
    </Shell>
  );
}

function magnitudeForPolicy(value: unknown, policy: NegativeMagnitudePolicy): number | null {
  const finite = finiteNumber(value);
  if (finite == null) return null;
  if (finite >= 0) return finite;
  if (policy === "omit") return null;
  return policy === "absolute" ? Math.abs(finite) : 0;
}

interface DivergingPairRow {
  name: string;
  left: number;
  right: number;
}

function DivergingPairChart({
  rows,
  leftLabel,
  rightLabel,
  domain,
  ariaLabel,
  valueFormatter,
  negativeValuePolicy,
  colors,
  silhouette = false}: {
  rows: readonly DivergingPairRow[];
  leftLabel: string;
  rightLabel: string;
  domain?: NumericDomain;
  ariaLabel: string;
  valueFormatter: (value: number) => string;
  negativeValuePolicy: NegativeMagnitudePolicy;
  colors: readonly [string, string];
  silhouette?: boolean;
}) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const safeRows = rows.flatMap((row) => {
    const left = magnitudeForPolicy(row.left, negativeValuePolicy);
    const right = magnitudeForPolicy(row.right, negativeValuePolicy);
    return row.name && left != null && right != null ? [{ name: row.name, left: -left, right }] : [];
  });
  if (!safeRows.length) return <Shell><ChartEmpty /></Shell>;
  const requestedExtent = domain
    ? Math.max(Math.abs(finiteNumber(domain[0]) ?? 0), Math.abs(finiteNumber(domain[1]) ?? 0))
    : 0;
  const extent = Math.max(1, requestedExtent, ...safeRows.flatMap((row) => [Math.abs(row.left), Math.abs(row.right)]));
  const ticks = [-extent, -extent / 2, 0, extent / 2, extent];

  return (
    <Shell>
      <div className="h-full w-full" role="group" aria-label={ariaLabel}>
        <ChartResponsiveContainer width="100%" height="100%">
          <BarChart accessibilityLayer data={safeRows} layout="vertical" margin={{ ...PLOT_MARGIN_COMPACT, right: 14, left: 4, bottom: 4 }} /* tornado/butterfly labels */ stackOffset="sign" barCategoryGap={silhouette ? "9%" : "24%"}>
            <BarGradients uid={uid} colors={[...colors]} />
            <CartesianGrid horizontal={false} />
            <ReferenceLine x={0} stroke="var(--chart-axis)" strokeWidth={1.25} />
            <XAxis type="number" domain={[-extent, extent]} ticks={ticks} tickLine={false} axisLine={false} tickFormatter={(value) => valueFormatter(Math.abs(Number(value)))} />
            <YAxis type="category" dataKey="name" width={72} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip valueFormatter={(value) => valueFormatter(Math.abs(value))} />} />
            <Legend iconType="circle" formatter={legendLabel} {...hover.legendHandlers} />
            <Bar name={leftLabel} dataKey="left" stackId="pair" fill={`url(#polar-${uid}-0)`} fillOpacity={hover.opacityFor("left")} radius={[4, 0, 0, 4]} {...anim} {...hover.bind("left")} />
            <Bar name={rightLabel} dataKey="right" stackId="pair" fill={`url(#polar-${uid}-1)`} fillOpacity={hover.opacityFor("right")} radius={[0, 4, 4, 0]} {...anim} {...hover.bind("right")} />
          </BarChart>
        </ChartResponsiveContainer>
      </div>
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Category", leftLabel, rightLabel]} rows={safeRows.map((row) => [row.name, valueFormatter(Math.abs(row.left)), valueFormatter(row.right)])} />
    </Shell>
  );
}

export function ButterflyChart({
  data = defaultButterfly,
  leftLabel = "Target",
  rightLabel = "Actual",
  domain,
  ariaLabel = "Butterfly comparison chart",
  valueFormatter = formatCompact,
  negativeValuePolicy = "absolute"}: ButterflyChartProps) {
  return <DivergingPairChart rows={data} leftLabel={leftLabel} rightLabel={rightLabel} domain={domain} ariaLabel={ariaLabel} valueFormatter={valueFormatter} negativeValuePolicy={negativeValuePolicy} colors={[SEMANTIC.negative, SEMANTIC.positive]} />;
}

export function TornadoChart({
  data = defaultTornado,
  lowLabel = "Low scenario",
  highLabel = "High scenario",
  domain,
  ariaLabel = "Tornado sensitivity chart",
  valueFormatter = formatCompact,
  negativeValuePolicy = "absolute",
  sortByImpact = true}: TornadoChartProps) {
  const ordered = sortByImpact ? sortTornadoRows(data) : [...data];
  const rows = ordered.map((datum) => ({ name: datum.name, left: datum.low, right: datum.high }));
  return <DivergingPairChart rows={rows} leftLabel={lowLabel} rightLabel={highLabel} domain={domain} ariaLabel={ariaLabel} valueFormatter={valueFormatter} negativeValuePolicy={negativeValuePolicy} colors={[CHART_COLORS[1], CHART_COLORS[4]]} silhouette />;
}

export function PopulationPyramid({
  data = defaultPopulation,
  maleLabel = "Male",
  femaleLabel = "Female",
  domain,
  ariaLabel = "Population pyramid",
  valueFormatter = formatCompact,
  negativeValuePolicy = "absolute"}: PopulationPyramidProps) {
  const rows = data.map((datum) => ({ name: datum.age, left: datum.male, right: datum.female }));
  return <DivergingPairChart rows={rows} leftLabel={maleLabel} rightLabel={femaleLabel} domain={domain} ariaLabel={ariaLabel} valueFormatter={valueFormatter} negativeValuePolicy={negativeValuePolicy} colors={[CHART_COLORS[1], CHART_COLORS[4]]} />;
}

export function DivergingBarChart({
  data = defaultLikert,
  ariaLabel = "Diverging response chart",
  valueFormatter = (value) => `${Math.abs(value)}%`}: DivergingBarChartProps) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const safeData = data.flatMap((datum) => {
    const disagree = finiteNumber(datum.disagree);
    const neutral = finiteNumber(datum.neutral);
    const agree = finiteNumber(datum.agree);
    return datum.topic && disagree != null && neutral != null && agree != null
      ? [{ topic: datum.topic, disagree: -Math.abs(disagree), neutral: Math.abs(neutral), agree: Math.abs(agree) }]
      : [];
  });

  if (!safeData.length) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  // An auto domain ran the axis to 105%, which is meaningless for a Likert
  // scale and put the final tick outside the plot where it got clipped.
  // Snapping to whole 20% steps keeps the ticks round and inside the frame.
  const step = 20;
  const lo = Math.min(0, ...safeData.map((datum) => datum.disagree));
  const hi = Math.max(0, ...safeData.map((datum) => datum.neutral + datum.agree));
  const from = Math.min(-step, Math.floor(lo / step) * step);
  const to = Math.max(step, Math.ceil(hi / step) * step);
  const ticks = Array.from(
    { length: Math.round((to - from) / step) + 1 },
    (_, i) => from + i * step,
  );

  return (
    <Shell>
      <div className="h-full w-full" role="group" aria-label={ariaLabel}>
      <ChartResponsiveContainer width="100%" height="100%">
        <BarChart accessibilityLayer data={safeData} layout="vertical" margin={{ ...PLOT_MARGIN_COMPACT, right: 16 }} stackOffset="sign">
          <BarGradients uid={uid} colors={[SEMANTIC.negative, SEMANTIC.neutral, SEMANTIC.positive]} />
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[from, to]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => valueFormatter(Math.abs(Number(value)))}
          />
          <YAxis type="category" dataKey="topic" width={64} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip valueFormatter={(value) => valueFormatter(Math.abs(value))} />} />
          {/* Three unlabelled colours are not readable on their own. */}
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
          <Bar
            name="Disagree"
            dataKey="disagree"
            stackId="d"
            fill={`url(#polar-${uid}-0)`}
            fillOpacity={hover.opacityFor("disagree")}
            {...anim}
            {...hover.bind("disagree")}
          />
          <Bar
            name="Neutral"
            dataKey="neutral"
            stackId="d"
            fill={`url(#polar-${uid}-1)`}
            fillOpacity={hover.opacityFor("neutral")}
            {...anim}
            {...hover.bind("neutral")}
          />
          <Bar
            name="Agree"
            dataKey="agree"
            stackId="d"
            fill={`url(#polar-${uid}-2)`}
            fillOpacity={hover.opacityFor("agree")}
            {...anim}
            {...hover.bind("agree")}
          />
        </BarChart>
      </ChartResponsiveContainer>
      </div>
      <AccessibleComparisonTable caption={`${ariaLabel} data`} headers={["Topic", "Disagree", "Neutral", "Agree"]} rows={safeData.map((datum) => [datum.topic, valueFormatter(Math.abs(datum.disagree)), valueFormatter(datum.neutral), valueFormatter(datum.agree)])} />
    </Shell>
  );
}

const likertAppearance: Record<LikertSegment["key"], { color: string; opacity: number }> = {
  stronglyDisagree: { color: SEMANTIC.negative, opacity: 0.92 },
  disagree: { color: SEMANTIC.negative, opacity: 0.58 },
  neutralLeft: { color: SEMANTIC.neutral, opacity: 0.64 },
  neutralRight: { color: SEMANTIC.neutral, opacity: 0.64 },
  agree: { color: SEMANTIC.positive, opacity: 0.58 },
  stronglyAgree: { color: SEMANTIC.positive, opacity: 0.92 }};

const likertLegend = [
  { key: "stronglyDisagree", label: "Strongly disagree" },
  { key: "disagree", label: "Disagree" },
  { key: "neutralLeft", label: "Neutral" },
  { key: "agree", label: "Agree" },
  { key: "stronglyAgree", label: "Strongly agree" },
] as const;

export function LikertChart({
  data = defaultLikertFivePoint,
  normalize = true,
  ariaLabel = "Five-point Likert chart",
  valueFormatter}: LikertChartProps) {
  const safeData = data.flatMap((datum) => {
    if (!datum.topic) return [];
    const distribution = buildLikertSegments(datum, normalize);
    return distribution.total > 0 ? [{ topic: datum.topic, ...distribution }] : [];
  });
  const { tooltip, bind } = useComparisonTooltip();
  const { titleId, descriptionId } = useSvgLabelIds("likert");
  if (!safeData.length) return <Shell><ChartEmpty /></Shell>;
  const formatValue = valueFormatter ?? (normalize
    ? (value: number) => `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 }).format(value)}%`
    : formatCompact);
  const width = 460;
  const height = 230;
  const pad = { l: 82, r: 16, t: 14, b: 30 };
  const plotWidth = width - pad.l - pad.r;
  const plotHeight = height - pad.t - pad.b;
  const rawExtent = Math.max(...safeData.flatMap((datum) => [datum.negative, datum.positive]));
  const extent = Math.max(normalize ? 50 : 1, Math.ceil(rawExtent / 10) * 10);
  const x = d3.scaleLinear().domain([-extent, extent]).range([0, plotWidth]);
  const y = d3.scaleBand().domain(safeData.map((datum) => datum.topic)).range([0, plotHeight]).padding(0.28);
  const ticks = [-extent, -extent / 2, 0, extent / 2, extent];

  return (
    <Shell>
      <div className="flex h-full min-h-0 w-full flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet" role="group" aria-labelledby={`${titleId} ${descriptionId}`}>
          <title id={titleId}>{ariaLabel}</title>
          <desc id={descriptionId}>Responses diverge around zero. Neutral responses are split equally across both sides of the center line.</desc>
          <g transform={`translate(${pad.l},${pad.t})`}>
            {ticks.map((tick) => (
              <g key={tick} aria-hidden="true">
                <line x1={x(tick)} x2={x(tick)} y1={0} y2={plotHeight} stroke={tick === 0 ? "var(--chart-axis)" : "var(--chart-grid)"} strokeWidth={tick === 0 ? 1.25 : 1} />
                <text x={x(tick)} y={plotHeight + 17} textAnchor="middle" className="fill-[var(--chart-axis)] text-[8.5px]">{tick === 0 ? "0" : formatValue(Math.abs(tick))}</text>
              </g>
            ))}
            {safeData.map((datum) => (
              <g key={datum.topic}>
                <text x={-9} y={(y(datum.topic) ?? 0) + y.bandwidth() / 2 + 3} textAnchor="end" className="fill-[var(--chart-axis)] text-[9px]" aria-hidden="true">{datum.topic}</text>
                {datum.segments.map((segment) => {
                  if (segment.value <= 0) return null;
                  const appearance = likertAppearance[segment.key];
                  const neutralTotal = datum.segments
                    .filter((candidate) => candidate.key === "neutralLeft" || candidate.key === "neutralRight")
                    .reduce((sum, candidate) => sum + candidate.value, 0);
                  const announcedValue = segment.key === "neutralLeft" || segment.key === "neutralRight" ? neutralTotal : segment.value;
                  const segmentWidth = Math.max(0, x(segment.end) - x(segment.start));
                  return (
                    <rect
                      key={segment.key}
                      x={x(segment.start)}
                      y={y(datum.topic)}
                      width={segmentWidth}
                      height={y.bandwidth()}
                      rx={segment.key === "stronglyDisagree" || segment.key === "stronglyAgree" ? 3 : 0}
                      fill={appearance.color}
                      fillOpacity={appearance.opacity}
                      stroke="var(--card)"
                      strokeWidth={0.75}
                      className="outline-none"
                      {...bind(`${datum.topic}: ${segment.label}`, [{ label: "Responses", value: formatValue(announcedValue) }])}
                    >
                      <title>{`${datum.topic}, ${segment.label}: ${formatValue(announcedValue)}`}</title>
                    </rect>
                  );
                })}
              </g>
            ))}
          </g>
        </svg>
        <ul className="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 px-2 pb-1 text-[9px] text-muted-foreground" aria-label="Likert response categories">
          {likertLegend.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-[2px]" style={{ background: likertAppearance[item.key].color, opacity: likertAppearance[item.key].opacity }} aria-hidden="true" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <ComparisonTooltip tooltip={tooltip} />
      <AccessibleComparisonTable
        caption={`${ariaLabel} data`}
        headers={["Topic", "Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]}
        rows={safeData.map((datum) => {
          const valueFor = (key: LikertSegment["key"]) => datum.segments.find((segment) => segment.key === key)?.value ?? 0;
          return [
            datum.topic,
            formatValue(valueFor("stronglyDisagree")),
            formatValue(valueFor("disagree")),
            formatValue(valueFor("neutralLeft") + valueFor("neutralRight")),
            formatValue(valueFor("agree")),
            formatValue(valueFor("stronglyAgree")),
          ];
        })}
      />
    </Shell>
  );
}

export interface WaffleChartProps {
  total?: number;
  value?: number;
  label?: string;
  maxCells?: number;
  columns?: number;
  ariaLabel?: string;
}

export function WaffleChart({
  total = defaultWaffle.total,
  value = defaultWaffle.value,
  label = defaultWaffle.label,
  maxCells = 200,
  columns = 10,
  ariaLabel = "Waffle chart"}: WaffleChartProps) {
  const safeTotal = finiteNumber(total);
  const safeValue = finiteNumber(value);
  if (safeTotal == null || safeTotal <= 0 || safeValue == null) return <ChartEmpty label="No valid waffle values" />;
  const ratio = Math.max(0, Math.min(1, safeValue / safeTotal));
  const cellCount = Math.max(1, Math.min(Math.trunc(safeTotal), Math.max(1, Math.trunc(maxCells))));
  const filled = Math.round(ratio * cellCount);
  const safeColumns = Math.max(1, Math.min(cellCount, Math.trunc(columns) || 10));
  return (
    <Shell>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2" role="group" aria-label={`${ariaLabel}. ${label}: ${formatPercent(ratio, 0)}, ${safeValue} of ${safeTotal}.`}>
        <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }} aria-hidden="true">
          {Array.from({ length: cellCount }, (_, index) => <span key={index} className="h-3 w-3 rounded-sm" style={{ background: index < filled ? CHART_COLORS[0] : "var(--chart-grid)" }} />)}
        </div>
        <div className="text-xs text-muted-foreground">{label}: {formatPercent(ratio, 0)} <span className="tabular-nums">({formatCompact(safeValue)} / {formatCompact(safeTotal)})</span></div>
        {safeTotal > cellCount ? <div className="text-[10px] text-muted-foreground">Each cell represents approximately {formatCompact(safeTotal / cellCount)} units.</div> : null}
        <ScreenReaderTable><caption>{ariaLabel} data</caption><tbody><tr><th scope="row">{label}</th><td>{safeValue}</td></tr><tr><th scope="row">Total</th><td>{safeTotal}</td></tr><tr><th scope="row">Share</th><td>{formatPercent(ratio, 0)}</td></tr></tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export type PictogramIcon = "person" | "star" | "circle" | "square";
export interface PictogramChartProps {
  count?: number;
  filled?: number;
  label?: string;
  icon?: PictogramIcon;
  columns?: number;
  maxIcons?: number;
  ariaLabel?: string;
}

function PictogramGlyph({ icon }: { icon: PictogramIcon }) {
  if (icon === "star") return <path d="m12 2.7 2.78 5.64 6.22.9-4.5 4.39 1.06 6.2L12 16.9l-5.56 2.93 1.06-6.2L3 9.24l6.22-.9L12 2.7Z" />;
  if (icon === "circle") return <circle cx="12" cy="12" r="9" />;
  if (icon === "square") return <rect x="3" y="3" width="18" height="18" rx="3" />;
  return <path d="M12 2.75a3.25 3.25 0 1 1 0 6.5 3.25 3.25 0 0 1 0-6.5ZM6.25 12.3A2.3 2.3 0 0 1 8.55 10h6.9a2.3 2.3 0 0 1 2.3 2.3V15h-2.2v6.25h-2.4V16.2h-2.3v5.05h-2.4V15h-2.2v-2.7Z" />;
}

export function PictogramChart({
  count = 10,
  filled = 7,
  label = "Completed",
  icon = "person",
  columns = 10,
  maxIcons = 200,
  ariaLabel = "Pictogram chart"}: PictogramChartProps) {
  if (!Number.isFinite(count) || count <= 0 || !Number.isFinite(filled)) return <ChartEmpty label="No valid pictogram values" />;
  const iconCount = Math.min(Math.trunc(count), Math.max(1, Math.trunc(maxIcons)));
  const filledCount = Math.round(Math.max(0, Math.min(1, filled / count)) * iconCount);
  const safeColumns = Math.max(1, Math.min(iconCount, Math.trunc(columns) || 10));
  return (
    <Shell>
      <div className="flex h-full w-full flex-col items-center justify-center gap-3" role="group" aria-label={`${ariaLabel}. ${label}: ${filled} of ${count}.`}>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${safeColumns}, minmax(0, 1fr))` }} aria-hidden="true">
          {Array.from({ length: iconCount }, (_, index) => (
            <svg key={index} viewBox="0 0 24 24" className="h-7 w-7" style={{ color: index < filledCount ? colorAt(index) : "var(--chart-grid)" }} fill="currentColor"><PictogramGlyph icon={icon} /></svg>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{label}: {formatCompact(filled)} of {formatCompact(count)} ({formatPercent(filled / count, 0)})</p>
        <ScreenReaderTable><caption>{ariaLabel} data</caption><tbody><tr><th scope="row">{label}</th><td>{filled}</td></tr><tr><th scope="row">Total</th><td>{count}</td></tr><tr><th scope="row">Share</th><td>{formatPercent(filled / count, 0)}</td></tr></tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export function IconArray(props: PictogramChartProps) {
  return <PictogramChart icon="star" ariaLabel="Icon array" {...props} />;
}

export type CompositionDatum = Record<string, unknown>;
export type MekkoSeries = { key: string; label?: string; color?: string };
export interface MekkoChartProps {
  data?: readonly CompositionDatum[];
  categoryKey?: string;
  widthKey?: string;
  series?: readonly MekkoSeries[];
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  onCellSelect?: (event: { category: string; series: string; value: number; datum: CompositionDatum }) => void;
}

type MekkoColumn = { category: string; datum: CompositionDatum; widthValue: number; total: number; values: number[] };

function MekkoRenderer({
  data,
  categoryKey,
  widthKey,
  series,
  normalized,
  mosaic,
  ariaLabel,
  valueFormatter,
  onCellSelect}: Required<Pick<MekkoChartProps, "data" | "categoryKey" | "series" | "ariaLabel" | "valueFormatter">> & Pick<MekkoChartProps, "widthKey" | "onCellSelect"> & { normalized: boolean; mosaic: boolean }) {
  const columns: MekkoColumn[] = data.flatMap((datum, index) => {
    const category = String(datum[categoryKey] ?? `Category ${index + 1}`).trim();
    const values = series.map((item) => Math.max(0, finiteNumber(datum[item.key]) ?? 0));
    const total = d3.sum(values);
    const widthValue = widthKey ? finiteNumber(datum[widthKey]) ?? 0 : total;
    return category && total > 0 && widthValue > 0 ? [{ category, datum, widthValue, total, values }] : [];
  });
  if (!columns.length) return <ChartEmpty label="No valid composition values" />;
  const width = 500;
  const height = 270;
  const pad = { left: normalized ? 42 : 48, right: 12, top: 12, bottom: 38 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const widthTotal = d3.sum(columns, (column) => column.widthValue);
  const maximum = d3.max(columns, (column) => column.total) ?? 1;
  const laidOut = columns.map((column, columnIndex) => {
    const columnWidth = (column.widthValue / widthTotal) * plotWidth;
    const columnX = pad.left + d3.sum(columns.slice(0, columnIndex), (previous) => (previous.widthValue / widthTotal) * plotWidth);
    const cells = column.values.map((value, seriesIndex) => {
      const cellHeight = (value / (normalized ? column.total : maximum)) * plotHeight;
      const valuesThroughCell = d3.sum(column.values.slice(0, seriesIndex + 1));
      const cellY = pad.top + plotHeight - (valuesThroughCell / (normalized ? column.total : maximum)) * plotHeight;
      return { value, seriesIndex, x: columnX, y: cellY, width: columnWidth, height: cellHeight };
    });
    return { ...column, x: columnX, width: columnWidth, cells };
  });
  const ticks = normalized ? [0, 0.25, 0.5, 0.75, 1] : d3.scaleLinear().domain([0, maximum]).nice().ticks(5);
  return (
    <Shell>
      <div className="flex h-full min-h-0 flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-0 w-full flex-1" role="img" aria-label={ariaLabel}>
          <title>{ariaLabel}</title>
          <desc>Column width encodes category weight. {normalized ? "Each column is normalized to 100 percent and stacked by series." : "Column height encodes the absolute stacked series total."}</desc>
          {ticks.map((tick) => {
            const y = pad.top + plotHeight - (normalized ? tick : tick / maximum) * plotHeight;
            return <g key={tick}><line x1={pad.left} x2={width - pad.right} y1={y} y2={y} stroke="var(--chart-grid)" /><text x={pad.left - 6} y={y + 4} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">{normalized ? formatPercent(tick, 0) : valueFormatter(tick)}</text></g>;
          })}
          {laidOut.map((column) => (
            <g key={column.category}>
              {column.cells.map((cell) => {
                const item = series[cell.seriesIndex];
                const color = item.color ?? colorAt(cell.seriesIndex);
                const label = `${column.category}, ${item.label ?? formatSeriesName(item.key)}: ${valueFormatter(cell.value)}; width weight ${valueFormatter(column.widthValue)}`;
                return <g key={item.key} tabIndex={0} role="graphics-symbol" aria-label={label} onClick={() => onCellSelect?.({ category: column.category, series: item.key, value: cell.value, datum: column.datum })} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onCellSelect) { event.preventDefault(); onCellSelect({ category: column.category, series: item.key, value: cell.value, datum: column.datum }); } }}><title>{label}</title><rect x={cell.x + (mosaic ? 1.5 : 0.5)} y={cell.y + (mosaic ? 1.5 : 0.5)} width={Math.max(0, cell.width - (mosaic ? 3 : 1))} height={Math.max(0, cell.height - (mosaic ? 3 : 1))} rx={mosaic ? 0 : 2} fill={color} fillOpacity={mosaic ? 0.78 : 0.88} stroke="var(--background)" /></g>;
              })}
              {column.width >= 36 ? <text x={column.x + column.width / 2} y={height - 18} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">{column.category.length > Math.max(4, Math.floor(column.width / 7)) ? `${column.category.slice(0, Math.max(3, Math.floor(column.width / 7) - 1))}…` : column.category}</text> : null}
            </g>
          ))}
        </svg>
        <ul className="flex shrink-0 flex-wrap justify-center gap-x-3 gap-y-1 px-2 pb-1 text-[10px] text-muted-foreground" aria-label="Composition series legend">{series.map((item, index) => <li key={item.key} className="flex items-center gap-1"><span className="h-2 w-2" style={{ background: item.color ?? colorAt(index) }} aria-hidden="true" />{item.label ?? formatSeriesName(item.key)}</li>)}</ul>
        <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Category</th><th scope="col">Series</th><th scope="col">Value</th><th scope="col">Width weight</th></tr></thead><tbody>{laidOut.flatMap((column) => column.cells.map((cell) => <tr key={`${column.category}-${series[cell.seriesIndex].key}`}><th scope="row">{column.category}</th><td>{series[cell.seriesIndex].label ?? formatSeriesName(series[cell.seriesIndex].key)}</td><td>{valueFormatter(cell.value)}</td><td>{valueFormatter(column.widthValue)}</td></tr>))}</tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export function MekkoChart({
  data = salesByRegion,
  categoryKey = "name",
  widthKey = "sales",
  series = [{ key: "profit", label: "Profit" }],
  ariaLabel = "Mekko chart",
  valueFormatter = formatCompact,
  onCellSelect}: MekkoChartProps) {
  return <MekkoRenderer data={data} categoryKey={categoryKey} widthKey={widthKey} series={series} normalized={false} mosaic={false} ariaLabel={ariaLabel} valueFormatter={valueFormatter} onCellSelect={onCellSelect} />;
}

export function MarimekkoChart({
  data = stackedSeries,
  categoryKey = "name",
  widthKey,
  series = [{ key: "product" }, { key: "service" }, { key: "other" }],
  ariaLabel = "Marimekko chart",
  valueFormatter = formatCompact,
  onCellSelect}: MekkoChartProps) {
  return <MekkoRenderer data={data} categoryKey={categoryKey} widthKey={widthKey} series={series} normalized mosaic={false} ariaLabel={ariaLabel} valueFormatter={valueFormatter} onCellSelect={onCellSelect} />;
}

export function MosaicPlot({
  data = stackedSeries,
  categoryKey = "name",
  widthKey,
  series = [{ key: "product" }, { key: "service" }, { key: "other" }],
  ariaLabel = "Mosaic contingency plot",
  valueFormatter = formatCompact,
  onCellSelect}: MekkoChartProps) {
  return <MekkoRenderer data={data} categoryKey={categoryKey} widthKey={widthKey} series={series} normalized mosaic ariaLabel={ariaLabel} valueFormatter={valueFormatter} onCellSelect={onCellSelect} />;
}

export type ParallelCoordinateDatum = Record<string, unknown> & { id?: string; label?: string; group?: string };
export type ParallelCoordinateDimension = { key: string; label?: string; domain?: NumericDomain; formatter?: (value: number) => string };
export interface ParallelCoordinatesProps {
  data?: readonly ParallelCoordinateDatum[];
  dimensions?: readonly ParallelCoordinateDimension[];
  ariaLabel?: string;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelectionChange?: (id: string | null, datum?: ParallelCoordinateDatum) => void;
  filters?: Readonly<Record<string, NumericDomain>>;
}

export function ParallelCoordinates({
  data = defaultParallel,
  dimensions = [{ key: "product" }, { key: "service" }, { key: "other" }],
  ariaLabel = "Parallel coordinates plot",
  selectedId,
  defaultSelectedId = null,
  onSelectionChange,
  filters = {}}: ParallelCoordinatesProps) {
  const safeDimensions = dimensions.filter((dimension) => dimension.key.trim());
  const rows = data.flatMap((datum, index) => {
    const values = safeDimensions.map((dimension) => finiteNumber(datum[dimension.key]));
    if (values.some((value) => value == null)) return [];
    return [{ datum, id: datum.id ?? String(datum.label ?? datum.name ?? index), label: String(datum.label ?? datum.name ?? `Row ${index + 1}`), values: values as number[] }];
  });
  const filtered = rows.filter((row) => safeDimensions.every((dimension, index) => {
    const range = filters[dimension.key];
    return !range || (row.values[index] >= Math.min(...range) && row.values[index] <= Math.max(...range));
  }));
  const [internal, setInternal] = React.useState<string | null>(defaultSelectedId);
  const selected = selectedId === undefined ? internal : selectedId;
  if (safeDimensions.length < 2 || !rows.length) return <ChartEmpty label="Parallel coordinates require two dimensions and finite rows" />;
  const width = 500;
  const height = 260;
  const pad = { left: 38, right: 24, top: 22, bottom: 34 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const x = d3.scalePoint<string>().domain(safeDimensions.map((dimension) => dimension.key)).range([pad.left, pad.left + plotWidth]);
  const scales = safeDimensions.map((dimension, index) => {
    const values = rows.map((row) => row.values[index]);
    const requested = dimension.domain;
    const extent = requested ?? d3.extent(values) as [number, number];
    const domain = extent[0] === extent[1] ? [extent[0] - 1, extent[1] + 1] as NumericDomain : extent;
    return d3.scaleLinear().domain(domain).nice().range([pad.top + plotHeight, pad.top]);
  });
  const select = (row: typeof rows[number]) => {
    const next = selected === row.id ? null : row.id;
    if (selectedId === undefined) setInternal(next);
    onSelectionChange?.(next, next ? row.datum : undefined);
  };
  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title><desc>{filtered.length} of {rows.length} finite rows match the active dimension filters.</desc>
        {safeDimensions.map((dimension, index) => <g key={dimension.key}><line x1={x(dimension.key)} x2={x(dimension.key)} y1={pad.top} y2={pad.top + plotHeight} stroke="var(--chart-axis)" />{scales[index].ticks(4).map((tick) => <g key={tick}><line x1={(x(dimension.key) ?? 0) - 3} x2={(x(dimension.key) ?? 0) + 3} y1={scales[index](tick)} y2={scales[index](tick)} stroke="var(--chart-axis)" /><text x={(x(dimension.key) ?? 0) - 5} y={scales[index](tick) + 3} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{dimension.formatter?.(tick) ?? formatCompact(tick)}</text></g>)}<text x={x(dimension.key)} y={height - 12} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">{dimension.label ?? formatSeriesName(dimension.key)}</text></g>)}
        {filtered.map((row, rowIndex) => <path key={row.id} d={safeDimensions.map((dimension, index) => `${index ? "L" : "M"}${x(dimension.key)},${scales[index](row.values[index])}`).join(" ")} fill="none" stroke={colorAt(rowIndex)} strokeOpacity={selected == null || selected === row.id ? 0.8 : 0.16} strokeWidth={selected === row.id ? 3 : 1.6} tabIndex={0} role="graphics-symbol" aria-label={`${row.label}: ${safeDimensions.map((dimension, index) => `${dimension.label ?? dimension.key} ${row.values[index]}`).join(", ")}`} onClick={() => select(row)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(row); } }}><title>{row.label}</title></path>)}
      </svg>
      <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Row</th>{safeDimensions.map((dimension) => <th key={dimension.key} scope="col">{dimension.label ?? dimension.key}</th>)}</tr></thead><tbody>{filtered.map((row) => <tr key={row.id}><th scope="row">{row.label}</th>{row.values.map((value, index) => <td key={safeDimensions[index].key}>{safeDimensions[index].formatter?.(value) ?? value}</td>)}</tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export type ParallelSetDatum = Record<string, unknown> & { id?: string; weight?: number };
export interface ParallelSetsProps {
  data?: readonly ParallelSetDatum[];
  dimensions?: readonly string[];
  weightKey?: string;
  ariaLabel?: string;
  onFlowSelect?: (event: { sourceDimension: string; targetDimension: string; source: string; target: string; weight: number }) => void;
}

const defaultParallelSets: ParallelSetDatum[] = [
  { id: "1", region: "North", channel: "Direct", outcome: "Won", weight: 24 },
  { id: "2", region: "North", channel: "Partner", outcome: "Open", weight: 14 },
  { id: "3", region: "South", channel: "Direct", outcome: "Won", weight: 18 },
  { id: "4", region: "South", channel: "Digital", outcome: "Lost", weight: 12 },
  { id: "5", region: "East", channel: "Digital", outcome: "Open", weight: 20 },
  { id: "6", region: "West", channel: "Partner", outcome: "Won", weight: 16 },
];

export function ParallelSets({ data = defaultParallelSets, dimensions = ["region", "channel", "outcome"], weightKey = "weight", ariaLabel = "Parallel sets", onFlowSelect }: ParallelSetsProps) {
  const safeDimensions = [...new Set(dimensions.filter(Boolean))];
  const rows = data.flatMap((datum) => {
    const values = safeDimensions.map((dimension) => String(datum[dimension] ?? "").trim());
    const weight = finiteNumber(datum[weightKey]);
    return values.every(Boolean) && weight != null && weight > 0 ? [{ values, weight }] : [];
  });
  if (safeDimensions.length < 2 || !rows.length) return <ChartEmpty label="Parallel sets require two categorical dimensions and positive weights" />;
  const width = 520;
  const height = 270;
  const pad = { left: 54, right: 54, top: 42, bottom: 18 };
  const nodeWidth = 9;
  const plotHeight = height - pad.top - pad.bottom;
  const total = d3.sum(rows, (row) => row.weight);
  const categoryLists = safeDimensions.map((_, dimensionIndex) => [...new Set(rows.map((row) => row.values[dimensionIndex]))].sort());
  const maxGaps = d3.max(categoryLists, (categories) => Math.max(0, categories.length - 1) * 7) ?? 0;
  const weightScale = (plotHeight - maxGaps) / total;
  const x = d3.scalePoint<number>().domain(d3.range(safeDimensions.length)).range([pad.left, width - pad.right]);
  const nodes = categoryLists.map((categories, dimensionIndex) => {
    let cursor = pad.top;
    return categories.map((category) => {
      const categoryWeight = d3.sum(rows.filter((row) => row.values[dimensionIndex] === category), (row) => row.weight);
      const node = { dimensionIndex, category, weight: categoryWeight, x: x(dimensionIndex) ?? 0, y0: cursor, y1: cursor + categoryWeight * weightScale };
      cursor = node.y1 + 7;
      return node;
    });
  });
  const nodeFor = (dimensionIndex: number, category: string) => nodes[dimensionIndex].find((node) => node.category === category)!;
  const categoryColor = new Map<string, number>();
  let colorIndex = 0;
  const flows: Array<{ pair: number; source: string; target: string; weight: number; sy: number; ty: number; height: number; color: number }> = [];
  for (let pair = 0; pair < safeDimensions.length - 1; pair += 1) {
    const grouped = d3.rollups(rows, (values) => d3.sum(values, (value) => value.weight), (row) => row.values[pair], (row) => row.values[pair + 1]);
    const sourceOffsets = new Map<string, number>();
    const targetOffsets = new Map<string, number>();
    for (const [source, targets] of grouped.sort(([a], [b]) => a.localeCompare(b))) {
      if (!categoryColor.has(source)) categoryColor.set(source, colorIndex++);
      for (const [target, weight] of targets.sort(([a], [b]) => a.localeCompare(b))) {
        const sourceNode = nodeFor(pair, source);
        const targetNode = nodeFor(pair + 1, target);
        const heightValue = weight * weightScale;
        const sy = sourceNode.y0 + (sourceOffsets.get(source) ?? 0);
        const ty = targetNode.y0 + (targetOffsets.get(target) ?? 0);
        flows.push({ pair, source, target, weight, sy, ty, height: heightValue, color: categoryColor.get(source)! });
        sourceOffsets.set(source, (sourceOffsets.get(source) ?? 0) + heightValue);
        targetOffsets.set(target, (targetOffsets.get(target) ?? 0) + heightValue);
      }
    }
  }
  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title><desc>Weighted flows conserve quantity between adjacent categorical dimensions.</desc>
        {flows.map((flow) => {
          const sourceX = (x(flow.pair) ?? 0) + nodeWidth;
          const targetX = x(flow.pair + 1) ?? 0;
          const middle = (sourceX + targetX) / 2;
          const path = `M${sourceX},${flow.sy}C${middle},${flow.sy} ${middle},${flow.ty} ${targetX},${flow.ty}L${targetX},${flow.ty + flow.height}C${middle},${flow.ty + flow.height} ${middle},${flow.sy + flow.height} ${sourceX},${flow.sy + flow.height}Z`;
          const label = `${safeDimensions[flow.pair]} ${flow.source} to ${safeDimensions[flow.pair + 1]} ${flow.target}: ${formatCompact(flow.weight)}`;
          return <path key={`${flow.pair}-${flow.source}-${flow.target}`} d={path} fill={colorAt(flow.color)} fillOpacity={0.34} stroke={colorAt(flow.color)} strokeOpacity={0.5} tabIndex={0} role="graphics-symbol" aria-label={label} onClick={() => onFlowSelect?.({ sourceDimension: safeDimensions[flow.pair], targetDimension: safeDimensions[flow.pair + 1], source: flow.source, target: flow.target, weight: flow.weight })} onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onFlowSelect) { event.preventDefault(); onFlowSelect({ sourceDimension: safeDimensions[flow.pair], targetDimension: safeDimensions[flow.pair + 1], source: flow.source, target: flow.target, weight: flow.weight }); } }}><title>{label}</title></path>;
        })}
        {nodes.flatMap((dimensionNodes, dimensionIndex) => dimensionNodes.map((node, index) => <g key={`${dimensionIndex}-${node.category}`}><rect x={node.x} y={node.y0} width={nodeWidth} height={Math.max(1, node.y1 - node.y0)} rx={2} fill={colorAt(index)} /><text x={node.x + (dimensionIndex === safeDimensions.length - 1 ? nodeWidth + 5 : -5)} y={(node.y0 + node.y1) / 2 + 3} textAnchor={dimensionIndex === safeDimensions.length - 1 ? "start" : "end"} fontSize={10} fill="var(--muted-foreground)">{node.category}</text></g>))}
        {safeDimensions.map((dimension, index) => <text key={dimension} x={x(index)} y={20} textAnchor="middle" fontSize={11} fontWeight={650} fill="var(--foreground)">{formatSeriesName(dimension)}</text>)}
      </svg>
      <ScreenReaderTable><caption>{ariaLabel} flows</caption><thead><tr><th scope="col">From</th><th scope="col">To</th><th scope="col">Weight</th></tr></thead><tbody>{flows.map((flow) => <tr key={`${flow.pair}-${flow.source}-${flow.target}`}><th scope="row">{safeDimensions[flow.pair]}: {flow.source}</th><td>{safeDimensions[flow.pair + 1]}: {flow.target}</td><td>{flow.weight}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export type TernaryPoint = { id?: string; label?: string; a: number; b: number; c: number; group?: string | number };
export interface TernaryPlotProps {
  data?: readonly TernaryPoint[];
  labels?: { a: string; b: string; c: string };
  normalize?: boolean;
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
  onPointSelect?: (point: TernaryPoint, index: number) => void;
}

// Compositions that already sum to 1 — the old generator let a+b exceed 1 and
// then projected survivors with a non-barycentric formula, so half the dots
// floated above the peak.
const defaultTernary: TernaryPoint[] = [
  { a: 0.72, b: 0.18, c: 0.1, group: 0 },
  { a: 0.55, b: 0.3, c: 0.15, group: 0 },
  { a: 0.48, b: 0.22, c: 0.3, group: 0 },
  { a: 0.2, b: 0.62, c: 0.18, group: 1 },
  { a: 0.15, b: 0.55, c: 0.3, group: 1 },
  { a: 0.28, b: 0.48, c: 0.24, group: 1 },
  { a: 0.12, b: 0.22, c: 0.66, group: 2 },
  { a: 0.2, b: 0.18, c: 0.62, group: 2 },
  { a: 0.3, b: 0.12, c: 0.58, group: 2 },
  { a: 0.38, b: 0.36, c: 0.26, group: 3 },
  { a: 0.34, b: 0.33, c: 0.33, group: 3 },
  { a: 0.42, b: 0.28, c: 0.3, group: 3 },
  { a: 0.08, b: 0.4, c: 0.52, group: 4 },
  { a: 0.5, b: 0.1, c: 0.4, group: 4 },
  { a: 0.18, b: 0.7, c: 0.12, group: 5 },
  { a: 0.6, b: 0.25, c: 0.15, group: 0 },
  { a: 0.25, b: 0.45, c: 0.3, group: 1 },
  { a: 0.22, b: 0.28, c: 0.5, group: 2 },
];

export function TernaryPlot({
  data = defaultTernary,
  labels = { a: "A", b: "B", c: "C" },
  normalize = true,
  ariaLabel = "Ternary composition plot",
  valueFormatter = (value) => formatPercent(value, 0),
  onPointSelect}: TernaryPlotProps) {
  const valid = data.flatMap((datum, index) => {
    const values = [finiteNumber(datum.a), finiteNumber(datum.b), finiteNumber(datum.c)];
    if (values.some((value) => value == null || value < 0)) return [];
    const [a, b, c] = values as [number, number, number];
    const sum = a + b + c;
    if (sum <= 0 || (!normalize && Math.abs(sum - 1) > 1e-6)) return [];
    return [{ datum, index, a: normalize ? a / sum : a, b: normalize ? b / sum : b, c: normalize ? c / sum : c }];
  });
  if (!valid.length) return <ChartEmpty label="No valid ternary compositions" />;

  const width = 400;
  const height = 250;
  const pad = { top: 30, right: 28, bottom: 34, left: 28 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  // Equilateral triangle inscribed in the padded frame so the peak and base
  // labels stay inside the viewBox. (There is no Math.SQRT3 — that NaN'd the
  // whole SVG.)
  const sqrt3 = Math.sqrt(3);
  const side = Math.min(plotW, plotH / (sqrt3 / 2));
  const triH = side * (sqrt3 / 2);
  const left = pad.left + (plotW - side) / 2;
  const right = left + side;
  const base = pad.top + (plotH + triH) / 2;
  const top = base - triH;
  const cx = (left + right) / 2;
  const A = { x: cx, y: top };
  const B = { x: left, y: base };
  const C = { x: right, y: base };

  const project = (a: number, b: number, c: number) => {
    const s = a + b + c || 1;
    const aa = a / s;
    const bb = b / s;
    const cc = c / s;
    return {
      x: aa * A.x + bb * B.x + cc * C.x,
      y: aa * A.y + bb * B.y + cc * C.y};
  };

  const gridLevels = [0.25, 0.5, 0.75];
  const gridLines = gridLevels.flatMap((t) => [
    // constant a (parallel to BC), constant b (∥ AC), constant c (∥ AB)
    [project(t, 1 - t, 0), project(t, 0, 1 - t)],
    [project(1 - t, t, 0), project(0, t, 1 - t)],
    [project(1 - t, 0, t), project(0, 1 - t, t)],
  ]);

  const groups = [...new Set(valid.map((point) => String(point.datum.group ?? "Series")))];
  const points = valid.map((point) => ({ ...point, ...project(point.a, point.b, point.c), groupIndex: Math.max(0, groups.indexOf(String(point.datum.group ?? "Series"))) }));

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title><desc>Each point is projected from three non-negative proportions. {normalize ? "Inputs are normalized to sum to one." : "Inputs must sum to one."}</desc>
        {gridLines.map(([p0, p1], i) => (
          <line
            key={i}
            x1={p0.x}
            y1={p0.y}
            x2={p1.x}
            y2={p1.y}
            stroke="var(--chart-grid)"
            strokeWidth={1}
          />
        ))}
        <polygon
          points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
          fill="var(--chart-grid)"
          fillOpacity={0.12}
          stroke="var(--chart-axis)"
          strokeWidth={1.25}
        />
        {points.map((p) => {
          const label = p.datum.label ?? p.datum.id ?? `Point ${p.index + 1}`;
          const summary = `${label}: ${labels.a} ${valueFormatter(p.a)}, ${labels.b} ${valueFormatter(p.b)}, ${labels.c} ${valueFormatter(p.c)}`;
          return (
          <circle
            key={p.datum.id ?? p.index}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={colorAt(p.groupIndex)}
            fillOpacity={0.9}
            stroke={foregroundAt(p.groupIndex)}
            strokeWidth={1}
            tabIndex={0}
            role="graphics-symbol"
            aria-label={summary}
            onClick={() => onPointSelect?.(p.datum, p.index)}
            onKeyDown={(event) => { if ((event.key === "Enter" || event.key === " ") && onPointSelect) { event.preventDefault(); onPointSelect(p.datum, p.index); } }}
          ><title>{summary}</title></circle>
        );})}
        <text
          x={A.x}
          y={A.y - 10}
          textAnchor="middle"
          className="fill-[var(--foreground)] text-[11px] font-medium"
        >
          {labels.a}
        </text>
        <text
          x={B.x - 4}
          y={B.y + 16}
          textAnchor="start"
          className="fill-[var(--foreground)] text-[11px] font-medium"
        >
          {labels.b}
        </text>
        <text
          x={C.x + 4}
          y={C.y + 16}
          textAnchor="end"
          className="fill-[var(--foreground)] text-[11px] font-medium"
        >
          {labels.c}
        </text>
      </svg>
      <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Point</th><th scope="col">{labels.a}</th><th scope="col">{labels.b}</th><th scope="col">{labels.c}</th><th scope="col">Group</th></tr></thead><tbody>{points.map((point) => <tr key={point.datum.id ?? point.index}><th scope="row">{point.datum.label ?? point.datum.id ?? `Point ${point.index + 1}`}</th><td>{valueFormatter(point.a)}</td><td>{valueFormatter(point.b)}</td><td>{valueFormatter(point.c)}</td><td>{String(point.datum.group ?? "")}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}
