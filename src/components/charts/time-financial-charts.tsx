"use client";

import * as React from "react";
import * as d3 from "d3";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  LineChart,
  ReferenceLine,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis} from "recharts";
import { ChartResponsiveContainer } from "./chart-responsive";
import { CHART_COLORS, colorAt, SEMANTIC } from "@/lib/chart-colors";
import { ACTIVE_DOT, PLOT_MARGIN, PLOT_MARGIN_COMPACT, SERIES_STROKE_WIDTH } from "@/lib/chart-marks";
import {
  useChartAnimation,
  useElementVisible,
  useMotionInterval,
  usePrefersReducedMotion,
  useSeriesHover} from "@/lib/chart-motion";
import {
  calendarHeat,
  kpiMetrics,
  ohlc,
  salesByRegion,
  stackedSeries,
  timeSeries,
  waterfallData,
  words} from "@/lib/sample-data";
import { cn, formatCompact, formatPercent, roundSvgNumber } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";
import { ChartTooltip } from "./chart-tooltip";
import { WaterfallChart } from "./waterfall-chart";
import { TimelineChart, type TimelineEvent } from "./project-timeline-charts";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full [&_.recharts-cartesian-grid_line]:stroke-[var(--chart-grid)]">
      {children}
    </div>
  );
}

const streamKeys = ["product", "service", "other"];

export function Streamgraph({ data = stackedSeries }: { data?: typeof stackedSeries }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ ...PLOT_MARGIN_COMPACT }} stackOffset="wiggle">
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip showTotal />} />
          {streamKeys.map((k, i) => (
            <Area
              key={k}
              type="monotone"
              dataKey={k}
              stackId="1"
              stroke={colorAt(i)}
              strokeWidth={SERIES_STROKE_WIDTH}
              strokeLinecap="round"
              strokeOpacity={hover.opacityFor(k)}
              fill={colorAt(i)}
              fillOpacity={0.55 * hover.opacityFor(k)}
              activeDot={ACTIVE_DOT}
              {...anim}
              {...hover.bind(k)}
            />
          ))}
        </AreaChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

const horizonSeries = [
  { key: "revenue" as const, label: "Revenue" },
  { key: "cost" as const, label: "Cost" },
  { key: "forecast" as const, label: "Forecast" },
];

export function HorizonChart({
  data = timeSeries,
  bands = 4}: {
  data?: typeof timeSeries;
  bands?: number;
}) {
  if (data.length === 0 || bands < 1) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  // True horizon: each series folds into one strip by slicing the value range
  // into bands and stacking those slices in the same y-space. The old Recharts
  // stack just painted a layered area chart — different geometry, and the
  // active-dot chrome showed up as a column of circles in the middle.
  const width = 400;
  const height = 250;
  const margin = { top: 10, right: 14, bottom: 28, left: 64 };
  const x = d3
    .scaleLinear()
    .domain([0, Math.max(data.length - 1, 1)])
    .range([margin.left, width - margin.right]);
  const rowH = (height - margin.top - margin.bottom) / horizonSeries.length;
  const gap = 8;
  const stripH = Math.max(8, rowH - gap);

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {horizonSeries.map((s, si) => {
          const values = data.map((d) => d[s.key]);
          const max = d3.max(values) ?? 1;
          const step = max / bands || 1;
          const y0 = margin.top + si * rowH;
          const area = d3
            .area<number>()
            .x((_, i) => x(i))
            .y0(stripH)
            .y1((v) => stripH - (Math.max(0, Math.min(step, v)) / step) * stripH)
            .curve(d3.curveMonotoneX);

          return (
            <g key={s.key} transform={`translate(0,${y0})`}>
              <rect
                x={margin.left}
                y={0}
                width={width - margin.left - margin.right}
                height={stripH}
                fill="var(--chart-grid)"
                fillOpacity={0.12}
                rx={3}
              />
              {Array.from({ length: bands }, (_, b) => {
                const folded = values.map((v) => Math.min(Math.max(v - b * step, 0), step));
                return (
                  <path
                    key={b}
                    d={area(folded) ?? ""}
                    fill={colorAt(si)}
                    fillOpacity={0.22 + b * 0.18}
                  />
                );
              })}
              <text
                x={margin.left - 8}
                y={stripH / 2}
                textAnchor="end"
                dominantBaseline="central"
                className="fill-[var(--foreground)] text-[11px] font-medium"
              >
                {s.label}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text
            key={d.date}
            x={x(i)}
            y={height - 10}
            textAnchor="middle"
            className="fill-[var(--chart-axis)] text-[9px]"
          >
            {d.date}
          </text>
        ))}
      </svg>
    </Shell>
  );
}

export function StepChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="stepAfter" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={SERIES_STROKE_WIDTH} strokeLinecap="round" dot={false} activeDot={ACTIVE_DOT} {...anim} />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function SplineChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[1]} strokeWidth={SERIES_STROKE_WIDTH} strokeLinecap="round" dot={false} activeDot={ACTIVE_DOT} {...anim} />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export type RangeChartDatum =
  | { category: string; lower: number; upper: number }
  | { date: string; cost: number; revenue: number };

export type RangeChartProps = {
  data?: RangeChartDatum[];
  interpolation?: "linear" | "monotone";
  xAxisLabel?: string;
  yAxisLabel?: string;
};

function normalizeRangeData(data: RangeChartDatum[]) {
  return data
    .map((datum) => {
      const category = "category" in datum ? datum.category : datum.date;
      const lower = "lower" in datum ? datum.lower : datum.cost;
      const upper = "upper" in datum ? datum.upper : datum.revenue;
      if (!category || !Number.isFinite(lower) || !Number.isFinite(upper)) return null;
      const low = Math.min(lower, upper);
      const high = Math.max(lower, upper);
      return { category, low, high, range: [low, high], mid: (low + high) / 2 };
    })
    .filter((datum): datum is NonNullable<typeof datum> => datum != null);
}

export function RangeAreaChart({
  data = timeSeries,
  interpolation = "linear",
  xAxisLabel,
  yAxisLabel}: RangeChartProps) {
  const anim = useChartAnimation();
  const shaped = normalizeRangeData(data);

  if (!shaped.length) return <ChartEmpty />;

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <AreaChart data={shaped} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="category"
            tickLine={false}
            axisLine={false}
            label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area type={interpolation} dataKey="range" stroke={CHART_COLORS[2]} strokeOpacity={0.45} fill={CHART_COLORS[2]} fillOpacity={0.18} {...anim} />
          <Line type={interpolation} dataKey="mid" stroke={CHART_COLORS[2]} strokeWidth={SERIES_STROKE_WIDTH} strokeLinecap="round" dot={false} activeDot={ACTIVE_DOT} {...anim} />
        </AreaChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export type BandChartDatum = {
  category: string;
  lower: number;
  upper: number;
  value: number;
};

export type BandChartProps = {
  data?: readonly BandChartDatum[];
  ariaLabel?: string;
  interpolation?: "linear" | "monotone" | "step";
  valueFormatter?: (value: number) => string;
};

const defaultBandData: BandChartDatum[] = timeSeries.map((point) => ({
  category: point.date,
  lower: Math.min(point.cost, point.revenue),
  upper: Math.max(point.cost, point.revenue),
  value: point.forecast}));

export function BandChart({
  data = defaultBandData,
  ariaLabel = "Observed values against an expected band",
  interpolation = "linear",
  valueFormatter = formatCompact}: BandChartProps) {
  const anim = useChartAnimation();
  const valid = data.flatMap((point) => point.category.trim() && [point.lower, point.upper, point.value].every(Number.isFinite) && point.lower <= point.upper
    ? [{ ...point, band: [point.lower, point.upper] as [number, number], outsideBand: point.value < point.lower || point.value > point.upper }]
    : []);
  if (!valid.length) return <ChartEmpty label="No valid band observations" />;
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={valid} margin={{ ...PLOT_MARGIN_COMPACT }} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={valueFormatter} />
          <Tooltip content={<ChartTooltip />} />
          <Area type={interpolation} dataKey="band" stroke={CHART_COLORS[1]} strokeOpacity={0.4} fill={CHART_COLORS[1]} fillOpacity={0.16} connectNulls={false} {...anim} />
          <Line
            type={interpolation}
            dataKey="value"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            dot={(props) => {
              const point = valid[props.index];
              return <circle cx={props.cx} cy={props.cy} r={point?.outsideBand ? 4.5 : 2.5} fill={point?.outsideBand ? SEMANTIC.negative : CHART_COLORS[0]}><title>{point?.outsideBand ? "Outside expected band" : "Inside expected band"}</title></circle>;
            }}
            activeDot={ACTIVE_DOT}
            {...anim}
          />
        </ComposedChart>
      </ChartResponsiveContainer>
      <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Category</th><th scope="col">Observed</th><th scope="col">Lower</th><th scope="col">Upper</th><th scope="col">Status</th></tr></thead><tbody>{valid.map((point) => <tr key={point.category}><th scope="row">{point.category}</th><td>{valueFormatter(point.value)}</td><td>{valueFormatter(point.lower)}</td><td>{valueFormatter(point.upper)}</td><td>{point.outsideBand ? "Outside band" : "Inside band"}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

function RangeBarRenderer({
  data = timeSeries,
  orientation,
  xAxisLabel,
  yAxisLabel}: RangeChartProps & { orientation: "bar" | "column" }) {
  const shaped = normalizeRangeData(data);
  const horizontal = orientation === "bar";
  const anim = useChartAnimation();
  if (!shaped.length) return <ChartEmpty />;

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <BarChart
          data={shaped}
          layout={horizontal ? "vertical" : "horizontal"}
          margin={{ ...PLOT_MARGIN }}
        >
          <CartesianGrid horizontal={!horizontal} vertical={horizontal} />
          {horizontal ? (
            <>
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
              />
              <YAxis
                type="category"
                dataKey="category"
                width={72}
                tickLine={false}
                axisLine={false}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4 } : undefined}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={44}
                label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined}
              />
            </>
          )}
          <Tooltip content={<ChartTooltip />} />
          <Bar
            dataKey="range"
            fill={CHART_COLORS[2]}
            fillOpacity={0.82}
            radius={horizontal ? [4, 4, 4, 4] : [4, 4, 4, 4]}
            maxBarSize={34}
            {...anim}
          />
        </BarChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export function RangeColumnChart(props: RangeChartProps) {
  return <RangeBarRenderer {...props} orientation="column" />;
}

export function RangeBarChart(props: RangeChartProps) {
  return <RangeBarRenderer {...props} orientation="bar" />;
}

export type FanChartDatum = {
  date: string;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
};

export type FanChartProps = {
  data?: readonly FanChartDatum[];
  ariaLabel?: string;
  methodLabel?: string;
  valueFormatter?: (value: number) => string;
};

const defaultFanData: FanChartDatum[] = [
  { date: "Jan", p10: 78, p25: 86, p50: 94, p75: 102, p90: 111 },
  { date: "Feb", p10: 82, p25: 91, p50: 101, p75: 111, p90: 122 },
  { date: "Mar", p10: 88, p25: 98, p50: 109, p75: 120, p90: 133 },
  { date: "Apr", p10: 91, p25: 102, p50: 114, p75: 127, p90: 141 },
  { date: "May", p10: 96, p25: 108, p50: 121, p75: 135, p90: 150 },
  { date: "Jun", p10: 101, p25: 114, p50: 128, p75: 143, p90: 159 },
];

export function FanChart({
  data = defaultFanData,
  ariaLabel = "Forecast fan chart",
  methodLabel = "Caller-provided quantiles",
  valueFormatter = formatCompact}: FanChartProps) {
  const anim = useChartAnimation();
  const ranged = data.flatMap((point) =>
    point.date.trim() &&
    [point.p10, point.p25, point.p50, point.p75, point.p90].every(Number.isFinite) &&
    point.p10 <= point.p25 && point.p25 <= point.p50 && point.p50 <= point.p75 && point.p75 <= point.p90
      ? [{ ...point, outer: [point.p10, point.p90] as [number, number], inner: [point.p25, point.p75] as [number, number] }]
      : [],
  );

  if (!ranged.length) return <ChartEmpty label="No ordered forecast quantiles" />;

  return (
    <Shell>
      <div className="flex h-full min-h-0 flex-col" aria-label={ariaLabel}>
        <p className="shrink-0 px-2 pt-1 text-[10px] text-muted-foreground">{methodLabel}</p>
        <div className="min-h-0 flex-1"><ChartResponsiveContainer width="100%" height="100%">
          <AreaChart data={ranged} margin={{ ...PLOT_MARGIN_COMPACT }} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={valueFormatter} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="outer" stroke={CHART_COLORS[3]} strokeOpacity={0.35} fill={CHART_COLORS[3]} fillOpacity={0.1} {...anim} />
            <Area type="monotone" dataKey="inner" stroke={CHART_COLORS[3]} strokeOpacity={0.5} fill={CHART_COLORS[3]} fillOpacity={0.22} {...anim} />
            <Line type="monotone" dataKey="p50" stroke={CHART_COLORS[3]} strokeWidth={SERIES_STROKE_WIDTH} strokeLinecap="round" dot={false} activeDot={ACTIVE_DOT} {...anim} />
          </AreaChart>
        </ChartResponsiveContainer></div>
        <ScreenReaderTable><caption>{ariaLabel} quantiles</caption><thead><tr><th scope="col">Period</th><th scope="col">P10</th><th scope="col">P25</th><th scope="col">P50</th><th scope="col">P75</th><th scope="col">P90</th></tr></thead><tbody>{ranged.map((point) => <tr key={point.date}><th scope="row">{point.date}</th><td>{valueFormatter(point.p10)}</td><td>{valueFormatter(point.p25)}</td><td>{valueFormatter(point.p50)}</td><td>{valueFormatter(point.p75)}</td><td>{valueFormatter(point.p90)}</td></tr>)}</tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export type ConfidenceIntervalDatum = { date: string; value: number; lower: number; upper: number };
export type ConfidenceIntervalChartProps = {
  data?: readonly ConfidenceIntervalDatum[];
  ariaLabel?: string;
  intervalLabel?: string;
  valueFormatter?: (value: number) => string;
};

const defaultConfidenceIntervals: ConfidenceIntervalDatum[] = defaultFanData.map((point) => ({ date: point.date, value: point.p50, lower: point.p25, upper: point.p75 }));

export function ConfidenceIntervalChart({
  data = defaultConfidenceIntervals,
  ariaLabel = "Confidence interval chart",
  intervalLabel = "Caller-provided interval",
  valueFormatter = formatCompact}: ConfidenceIntervalChartProps) {
  const anim = useChartAnimation();
  const valid = data.flatMap((point) => point.date.trim() && [point.value, point.lower, point.upper].every(Number.isFinite) && point.lower <= point.upper
    ? [{ ...point, range: [point.lower, point.upper] as [number, number] }]
    : []);
  if (!valid.length) return <ChartEmpty label="No valid confidence intervals" />;
  return (
    <Shell>
      <div className="flex h-full min-h-0 flex-col" aria-label={ariaLabel}>
        <p className="shrink-0 px-2 pt-1 text-[10px] text-muted-foreground">{intervalLabel}</p>
        <div className="min-h-0 flex-1"><ChartResponsiveContainer width="100%" height="100%"><AreaChart data={valid} margin={{ ...PLOT_MARGIN_COMPACT }} accessibilityLayer><CartesianGrid vertical={false} /><XAxis dataKey="date" tickLine={false} axisLine={false} /><YAxis tickLine={false} axisLine={false} width={44} tickFormatter={valueFormatter} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey="range" stroke={CHART_COLORS[2]} strokeOpacity={0.45} fill={CHART_COLORS[2]} fillOpacity={0.18} {...anim} /><Line type="monotone" dataKey="value" stroke={CHART_COLORS[2]} strokeWidth={SERIES_STROKE_WIDTH} dot={false} activeDot={ACTIVE_DOT} {...anim} /></AreaChart></ChartResponsiveContainer></div>
        <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Period</th><th scope="col">Value</th><th scope="col">Lower</th><th scope="col">Upper</th></tr></thead><tbody>{valid.map((point) => <tr key={point.date}><th scope="row">{point.date}</th><td>{valueFormatter(point.value)}</td><td>{valueFormatter(point.lower)}</td><td>{valueFormatter(point.upper)}</td></tr>)}</tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export function CandlestickChart({ data = ohlc }: { data?: typeof ohlc }) {
  const width = 400;
  const height = 220;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const valid = data.filter((point) =>
    [point.open, point.high, point.low, point.close].every(Number.isFinite) &&
    point.high >= Math.max(point.open, point.close, point.low) &&
    point.low <= Math.min(point.open, point.close, point.high),
  );
  if (!valid.length) return <ChartEmpty label="No valid OHLC data" />;
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleLinear().domain([d3.min(valid, (d) => d.low) ?? 0, d3.max(valid, (d) => d.high) ?? 1]).nice().range([h, 0]);
  const x = d3.scaleBand().domain(valid.map((d) => d.date)).range([0, w]).padding(0.35);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Candlestick chart with ${valid.length} periods`}>
        <title>Candlestick chart</title>
        <g transform={`translate(${pad.l},${pad.t})`}>
          {y.ticks(5).map((tick) => (
            <g key={tick}>
              <line x1="0" x2={w} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" />
              <text x="-6" y={y(tick) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{formatCompact(tick)}</text>
            </g>
          ))}
          {valid.map((d) => {
            const cx = (x(d.date) ?? 0) + x.bandwidth() / 2;
            const up = d.close >= d.open;
            const color = up ? SEMANTIC.positive : SEMANTIC.negative;
            const bodyTop = y(Math.max(d.open, d.close));
            const bodyBot = y(Math.min(d.open, d.close));
            return (
              <g key={d.date} tabIndex={0} aria-label={`${d.date}: open ${d.open}, high ${d.high}, low ${d.low}, close ${d.close}`}>
                <title>{`${d.date}: open ${d.open}, high ${d.high}, low ${d.low}, close ${d.close}`}</title>
                <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke={color} strokeWidth={1} />
                <rect x={cx - x.bandwidth() * 0.25} y={bodyTop} width={x.bandwidth() * 0.5} height={Math.max(2, bodyBot - bodyTop)} fill={color} />
              </g>
            );
          })}
          {valid.map((d) => (
            <text key={`label-${d.date}`} x={(x(d.date) ?? 0) + x.bandwidth() / 2} y={h + 18} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">{d.date}</text>
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function OHLCChart({ data = ohlc }: { data?: typeof ohlc }) {
  const width = 400;
  const height = 220;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const valid = data.filter((point) =>
    [point.open, point.high, point.low, point.close].every(Number.isFinite) &&
    point.high >= point.low,
  );
  if (!valid.length) return <ChartEmpty label="No valid OHLC data" />;
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleLinear().domain([d3.min(valid, (d) => d.low) ?? 0, d3.max(valid, (d) => d.high) ?? 1]).nice().range([h, 0]);
  const x = d3.scaleBand().domain(valid.map((d) => d.date)).range([0, w]).padding(0.35);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`OHLC chart with ${valid.length} periods`}>
        <title>Open-high-low-close chart</title>
        <g transform={`translate(${pad.l},${pad.t})`}>
          {y.ticks(5).map((tick) => (
            <g key={tick}>
              <line x1="0" x2={w} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" />
              <text x="-6" y={y(tick) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{formatCompact(tick)}</text>
            </g>
          ))}
          {valid.map((d) => {
            const cx = (x(d.date) ?? 0) + x.bandwidth() / 2;
            const tick = x.bandwidth() * 0.2;
            const color = d.close >= d.open ? SEMANTIC.positive : SEMANTIC.negative;
            return (
              <g key={d.date} stroke={color} tabIndex={0} aria-label={`${d.date}: open ${d.open}, high ${d.high}, low ${d.low}, close ${d.close}`}>
                <title>{`${d.date}: open ${d.open}, high ${d.high}, low ${d.low}, close ${d.close}`}</title>
                <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} strokeWidth={1.5} />
                <line x1={cx - tick} x2={cx} y1={y(d.open)} y2={y(d.open)} strokeWidth={2} />
                <line x1={cx} x2={cx + tick} y1={y(d.close)} y2={y(d.close)} strokeWidth={2} />
              </g>
            );
          })}
          {valid.map((d) => (
            <text key={`label-${d.date}`} x={(x(d.date) ?? 0) + x.bandwidth() / 2} y={h + 18} textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">{d.date}</text>
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function StockChart({ data = ohlc }: { data?: typeof ohlc }) {
  const anim = useChartAnimation();
  // Gradient ids must be unique per instance — two charts sharing a series key
  // on one page would otherwise reference the same <defs>.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <Shell>
      <div className="grid h-full w-full grid-rows-[3fr_1fr] gap-1">
        <CandlestickChart data={data} />
        <ChartResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 8, left: 0, bottom: 0 }} /* volume strip under candles */>
            <defs>
              {/* Depth without color math: the fill eases to 82% opacity toward
                  the baseline, which reads as a soft top light on both themes. */}
              <linearGradient id={`vol-${uid}-0`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[5]} stopOpacity={1} />
                <stop offset="100%" stopColor={CHART_COLORS[5]} stopOpacity={0.82} />
              </linearGradient>
            </defs>
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="volume" fill={`url(#vol-${uid}-0)`} radius={[2, 2, 0, 0]} maxBarSize={16} {...anim} />
          </BarChart>
        </ChartResponsiveContainer>
      </div>
    </Shell>
  );
}

export type FinancialDatum = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type RenkoBrick = {
  index: number;
  date: string;
  open: number;
  close: number;
  direction: "up" | "down";
};

export function buildRenkoBricks(
  data: readonly FinancialDatum[],
  requestedBrickSize?: number,
): { bricks: RenkoBrick[]; brickSize: number } {
  const closes = data.map((point) => point.close).filter(Number.isFinite);
  if (!closes.length) return { bricks: [], brickSize: 0 };
  const extent = d3.extent(closes) as [number, number];
  const automaticSize = Math.max((extent[1] - extent[0]) / 8, 1);
  const brickSize =
    requestedBrickSize != null && Number.isFinite(requestedBrickSize) && requestedBrickSize > 0
      ? requestedBrickSize
      : automaticSize;
  const bricks: RenkoBrick[] = [];
  let lastClose = closes[0];
  data.slice(1).forEach((point) => {
    if (!Number.isFinite(point.close)) return;
    while (point.close - lastClose >= brickSize) {
      const next = lastClose + brickSize;
      bricks.push({ index: bricks.length, date: point.date, open: lastClose, close: next, direction: "up" });
      lastClose = next;
    }
    while (lastClose - point.close >= brickSize) {
      const next = lastClose - brickSize;
      bricks.push({ index: bricks.length, date: point.date, open: lastClose, close: next, direction: "down" });
      lastClose = next;
    }
  });
  return { bricks, brickSize };
}

export function RenkoChart({
  data = ohlc,
  brickSize}: {
  data?: FinancialDatum[];
  brickSize?: number;
}) {
  const built = buildRenkoBricks(data, brickSize);
  const bricks = built.bricks;
  const width = 400;
  const height = 190;
  const pad = { left: 42, right: 14, top: 16, bottom: 24 };
  const y = d3.scaleLinear().domain([
    d3.min(bricks, (brick) => Math.min(brick.open, brick.close)) ?? 0,
    d3.max(bricks, (brick) => Math.max(brick.open, brick.close)) ?? 1,
  ]).nice().range([height - pad.bottom, pad.top]);
  const x = d3.scaleBand().domain(bricks.map((brick) => String(brick.index))).range([pad.left, width - pad.right]).padding(0.08);

  if (bricks.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Renko chart with ${bricks.length} bricks at brick size ${formatCompact(built.brickSize)}`}>
        <title>Renko chart</title>
        <desc>Fixed-size bricks are added only when closing price moves by at least one brick.</desc>
        {y.ticks(5).map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" />
            <text x={pad.left - 6} y={y(tick) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{formatCompact(tick)}</text>
          </g>
        ))}
        {bricks.map((brick) => (
          <rect
            key={brick.index}
            x={x(String(brick.index))}
            y={y(Math.max(brick.open, brick.close))}
            width={x.bandwidth()}
            height={Math.max(2, Math.abs(y(brick.open) - y(brick.close)))}
            fill={brick.direction === "up" ? SEMANTIC.positive : SEMANTIC.negative}
            rx={1}
            tabIndex={0}
            aria-label={`${brick.date}, ${brick.direction}, ${formatCompact(brick.open)} to ${formatCompact(brick.close)}`}
          >
            <title>{`${brick.date}: ${brick.direction} from ${formatCompact(brick.open)} to ${formatCompact(brick.close)}`}</title>
          </rect>
        ))}
      </svg>
    </Shell>
  );
}

export type KagiSegment = {
  x1: number;
  x2: number;
  value1: number;
  value2: number;
  yang: boolean;
};

export function buildKagiSegments(
  data: readonly FinancialDatum[],
  requestedReversal?: number,
): { segments: KagiSegment[]; reversal: number } {
  const closes = data.map((point) => point.close).filter(Number.isFinite);
  if (closes.length < 2) return { segments: [], reversal: 0 };
  const extent = d3.extent(closes) as [number, number];
  const reversal =
    requestedReversal != null && Number.isFinite(requestedReversal) && requestedReversal > 0
      ? requestedReversal
      : Math.max((extent[1] - extent[0]) * 0.08, 1);
  const segments: KagiSegment[] = [];
  let x = 0;
  let current = closes[0];
  let direction: -1 | 0 | 1 = 0;
  let shoulder = current;
  let waist = current;
  let yang = true;

  closes.slice(1).forEach((price) => {
    if (direction === 0) {
      if (Math.abs(price - current) < reversal) return;
      direction = price > current ? 1 : -1;
      segments.push({ x1: x, x2: x, value1: current, value2: price, yang });
      current = price;
      return;
    }
    if (direction === 1) {
      if (price >= current) {
        if (price > shoulder) {
          shoulder = price;
          yang = true;
        }
        segments.push({ x1: x, x2: x, value1: current, value2: price, yang });
        current = price;
      } else if (current - price >= reversal) {
        x += 1;
        segments.push({ x1: x - 1, x2: x, value1: current, value2: current, yang });
        direction = -1;
        if (price < waist) {
          waist = price;
          yang = false;
        }
        segments.push({ x1: x, x2: x, value1: current, value2: price, yang });
        current = price;
      }
    } else if (price <= current) {
      if (price < waist) {
        waist = price;
        yang = false;
      }
      segments.push({ x1: x, x2: x, value1: current, value2: price, yang });
      current = price;
    } else if (price - current >= reversal) {
      x += 1;
      segments.push({ x1: x - 1, x2: x, value1: current, value2: current, yang });
      direction = 1;
      if (price > shoulder) {
        shoulder = price;
        yang = true;
      }
      segments.push({ x1: x, x2: x, value1: current, value2: price, yang });
      current = price;
    }
  });
  return { segments, reversal };
}

export function KagiChart({
  data = ohlc,
  reversalAmount}: {
  data?: FinancialDatum[];
  reversalAmount?: number;
}) {
  const width = 400;
  const height = 190;
  const pad = { left: 42, right: 18, top: 16, bottom: 22 };
  const built = buildKagiSegments(data, reversalAmount);
  const segments = built.segments;

  if (segments.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  const values = segments.flatMap((segment) => [segment.value1, segment.value2]);
  const maxX = d3.max(segments, (segment) => Math.max(segment.x1, segment.x2)) ?? 1;
  const y = d3.scaleLinear().domain(d3.extent(values) as [number, number]).nice().range([height - pad.bottom, pad.top]);
  const x = d3.scaleLinear().domain([0, Math.max(maxX, 1)]).range([pad.left, width - pad.right]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`Kagi chart with reversal amount ${formatCompact(built.reversal)}`}>
        <title>Kagi chart</title>
        <desc>Orthogonal price lines reverse only after the configured amount; thick yang segments mark strength and thin yin segments mark weakness.</desc>
        {y.ticks(5).map((tick) => (
          <g key={tick}>
            <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="var(--chart-grid)" />
            <text x={pad.left - 6} y={y(tick) + 4} textAnchor="end" fill="var(--muted-foreground)" fontSize="11">{formatCompact(tick)}</text>
          </g>
        ))}
        {segments.map((segment, index) => (
          <line
            key={index}
            x1={x(segment.x1)}
            x2={x(segment.x2)}
            y1={y(segment.value1)}
            y2={y(segment.value2)}
            stroke={segment.yang ? SEMANTIC.positive : SEMANTIC.negative}
            strokeWidth={segment.yang ? 3.5 : 1.75}
            strokeLinecap="round"
          >
            <title>{`${formatCompact(segment.value1)} to ${formatCompact(segment.value2)}`}</title>
          </line>
        ))}
      </svg>
    </Shell>
  );
}

export function FinancialWaterfall({ data = waterfallData }: { data?: typeof waterfallData }) {
  return (
    <Shell>
      <WaterfallChart data={data} />
    </Shell>
  );
}

export function ParetoChart({ data = salesByRegion }: { data?: typeof salesByRegion }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const sorted = [...data].sort((a, b) => b.sales - a.sales);
  const total = d3.sum(sorted, (d) => d.sales) || 1;
  const shaped = sorted.reduce<{
    running: number;
    rows: Array<{ name: string; sales: number; cumulative: number }>;
  }>(
    (accumulator, point) => {
      const running = accumulator.running + point.sales;
      return {
        running,
        rows: [
          ...accumulator.rows,
          { name: point.name, sales: point.sales, cumulative: running / total },
        ]};
    },
    { running: 0, rows: [] },
  ).rows;

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={shaped} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <defs>
            {/* Depth without color math: the fill eases to 82% opacity toward
                the baseline, which reads as a soft top light on both themes. */}
            <linearGradient id={`pareto-${uid}-0`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={1} />
              <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.82} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis yAxisId="l" tickLine={false} axisLine={false} width={40} />
          <YAxis yAxisId="r" orientation="right" domain={[0, 1]} tickFormatter={(v) => formatPercent(Number(v), 0)} tickLine={false} axisLine={false} width={36} />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine yAxisId="r" y={0.8} stroke={SEMANTIC.warning} strokeDasharray="4 4" label={{ value: "80%", position: "insideTopRight" }} />
          <Bar yAxisId="l" dataKey="sales" fill={`url(#pareto-${uid}-0)`} fillOpacity={hover.opacityFor("sales")} radius={[4, 4, 0, 0]} maxBarSize={32} {...anim} {...hover.bind("sales")} />
          <Line yAxisId="r" type="monotone" dataKey="cumulative" stroke={CHART_COLORS[2]} strokeWidth={SERIES_STROKE_WIDTH} strokeLinecap="round" strokeOpacity={hover.opacityFor("cumulative")} dot={false} activeDot={ACTIVE_DOT} {...anim} {...hover.bind("cumulative")} />
        </ComposedChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export type ControlLimits = { mean: number; upper: number; lower: number; sigma: number };

export function calculateControlLimits(values: readonly number[]): ControlLimits | null {
  const finite = values.filter(Number.isFinite);
  if (finite.length < 2) return null;
  const mean = d3.mean(finite) ?? 0;
  const sigma = d3.deviation(finite) ?? 0;
  return { mean, upper: mean + sigma * 3, lower: mean - sigma * 3, sigma };
}

export function ControlChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const limits = calculateControlLimits(data.map((point) => point.revenue));
  if (!limits) return <ChartEmpty label="At least two observations are required" />;
  const shaped = data.map((d) => ({
    date: d.date,
    value: d.revenue,
    mean: limits.mean,
    ucl: limits.upper,
    lcl: limits.lower,
    outOfControl: d.revenue > limits.upper || d.revenue < limits.lower}));

  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={shaped} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          {/* Limit/center lines are reference marks, so they keep their thin
              dashed strokes; only the data line takes the full curve treatment. */}
          <Line type="monotone" dataKey="ucl" stroke={SEMANTIC.warning} strokeDasharray="4 4" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("ucl")} {...anim} {...hover.bind("ucl")} />
          <Line type="monotone" dataKey="lcl" stroke={SEMANTIC.warning} strokeDasharray="4 4" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("lcl")} {...anim} {...hover.bind("lcl")} />
          <Line type="monotone" dataKey="mean" stroke={SEMANTIC.neutral} strokeDasharray="2 2" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("mean")} {...anim} {...hover.bind("mean")} />
          <Line
            type="linear"
            dataKey="value"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            strokeOpacity={hover.opacityFor("value")}
            dot={(props) => {
              const point = shaped[props.index];
              return (
                <circle
                  cx={props.cx}
                  cy={props.cy}
                  r={point?.outOfControl ? 4.5 : 2.5}
                  fill={point?.outOfControl ? SEMANTIC.negative : CHART_COLORS[0]}
                />
              );
            }}
            activeDot={ACTIVE_DOT}
            {...anim}
            {...hover.bind("value")}
          />
        </ComposedChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

export type SpcObservation = { id?: string; category: string; value: number };
export type SpcRule = "beyond-3-sigma" | "two-of-three-2-sigma" | "four-of-five-1-sigma" | "eight-on-one-side";
export type SpcChartProps = {
  data?: readonly SpcObservation[] | typeof timeSeries;
  rules?: readonly SpcRule[];
  ariaLabel?: string;
  valueFormatter?: (value: number) => string;
};

export type SpcSignal = { rules: readonly SpcRule[] };

export function calculateSpcSignals(
  values: readonly number[],
  limits: ControlLimits,
  enabledRules: readonly SpcRule[],
): SpcSignal[] {
  const enabled = new Set(enabledRules);
  return values.map((value, index) => {
    const rules: SpcRule[] = [];
    if (enabled.has("beyond-3-sigma") && Math.abs(value - limits.mean) > limits.sigma * 3) rules.push("beyond-3-sigma");
    const lastThree = values.slice(Math.max(0, index - 2), index + 1);
    const lastFive = values.slice(Math.max(0, index - 4), index + 1);
    const lastEight = values.slice(Math.max(0, index - 7), index + 1);
    if (
      enabled.has("two-of-three-2-sigma") &&
      lastThree.length === 3 &&
      (lastThree.filter((point) => point > limits.mean + limits.sigma * 2).length >= 2 || lastThree.filter((point) => point < limits.mean - limits.sigma * 2).length >= 2)
    ) rules.push("two-of-three-2-sigma");
    if (
      enabled.has("four-of-five-1-sigma") &&
      lastFive.length === 5 &&
      (lastFive.filter((point) => point > limits.mean + limits.sigma).length >= 4 || lastFive.filter((point) => point < limits.mean - limits.sigma).length >= 4)
    ) rules.push("four-of-five-1-sigma");
    if (
      enabled.has("eight-on-one-side") &&
      lastEight.length === 8 &&
      (lastEight.every((point) => point > limits.mean) || lastEight.every((point) => point < limits.mean))
    ) rules.push("eight-on-one-side");
    return { rules };
  });
}

export function SPCChart({
  data = timeSeries,
  rules = ["beyond-3-sigma", "two-of-three-2-sigma", "four-of-five-1-sigma", "eight-on-one-side"],
  ariaLabel = "Statistical process control chart",
  valueFormatter = formatCompact}: SpcChartProps) {
  const anim = useChartAnimation();
  const observations = data.flatMap((point, index) => {
    const category = "category" in point ? point.category : point.date;
    const value = "value" in point ? point.value : point.revenue;
    return category?.trim() && Number.isFinite(value) ? [{ id: "id" in point ? point.id ?? String(index) : String(index), category, value }] : [];
  });
  const limits = calculateControlLimits(observations.map((point) => point.value));
  if (!limits || limits.sigma === 0) return <ChartEmpty label="SPC requires at least two varying observations" />;
  const signals = calculateSpcSignals(observations.map((point) => point.value), limits, rules);
  const shaped = observations.map((point, index) => ({ ...point, signalRules: signals[index].rules, signal: signals[index].rules.length > 0 }));
  const ruleLabel = (rule: SpcRule) => ({
    "beyond-3-sigma": "Beyond 3 sigma",
    "two-of-three-2-sigma": "Two of three beyond 2 sigma",
    "four-of-five-1-sigma": "Four of five beyond 1 sigma",
    "eight-on-one-side": "Eight on one side"})[rule];
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={shaped} margin={{ ...PLOT_MARGIN_COMPACT }} accessibilityLayer>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={valueFormatter} />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine y={limits.mean + limits.sigma * 3} stroke={SEMANTIC.negative} strokeDasharray="5 3" label={{ value: "+3σ", position: "insideTopRight" }} />
          <ReferenceLine y={limits.mean + limits.sigma * 2} stroke={SEMANTIC.warning} strokeDasharray="3 3" />
          <ReferenceLine y={limits.mean + limits.sigma} stroke={SEMANTIC.neutral} strokeDasharray="2 3" />
          <ReferenceLine y={limits.mean} stroke={SEMANTIC.neutral} label={{ value: "Mean", position: "insideTopRight" }} />
          <ReferenceLine y={limits.mean - limits.sigma} stroke={SEMANTIC.neutral} strokeDasharray="2 3" />
          <ReferenceLine y={limits.mean - limits.sigma * 2} stroke={SEMANTIC.warning} strokeDasharray="3 3" />
          <ReferenceLine y={limits.mean - limits.sigma * 3} stroke={SEMANTIC.negative} strokeDasharray="5 3" label={{ value: "−3σ", position: "insideBottomRight" }} />
          <Line type="linear" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={SERIES_STROKE_WIDTH} dot={(props) => {
            const point = shaped[props.index];
            const summary = point?.signalRules.map(ruleLabel).join("; ") || "No SPC rule triggered";
            return <circle cx={props.cx} cy={props.cy} r={point?.signal ? 4.5 : 2.5} fill={point?.signal ? SEMANTIC.negative : CHART_COLORS[0]} tabIndex={0} role="graphics-symbol" aria-label={`${point?.category}: ${valueFormatter(point?.value ?? 0)}. ${summary}`}><title>{summary}</title></circle>;
          }} activeDot={{ r: 5, strokeWidth: 0 }} {...anim} />
        </LineChart>
      </ChartResponsiveContainer>
      <ScreenReaderTable><caption>{ariaLabel} observations and rule signals</caption><thead><tr><th scope="col">Observation</th><th scope="col">Value</th><th scope="col">Signals</th></tr></thead><tbody>{shaped.map((point) => <tr key={point.id}><th scope="row">{point.category}</th><td>{valueFormatter(point.value)}</td><td>{point.signalRules.length ? point.signalRules.map(ruleLabel).join("; ") : "None"}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export function RunChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();
  const values = data.map((point) => point.revenue).filter(Number.isFinite).sort(d3.ascending);
  if (!values.length) return <ChartEmpty />;
  const median = d3.quantile(values, 0.5) ?? 0;
  const shaped = data.reduce<{
    side: "above" | "below" | null;
    runLength: number;
    rows: Array<(typeof data)[number] & { longRun: boolean }>;
  }>(
    (accumulator, point) => {
      const side = point.revenue >= median ? "above" as const : "below" as const;
      const runLength = side === accumulator.side ? accumulator.runLength + 1 : 1;
      return {
        side,
        runLength,
        rows: [...accumulator.rows, { ...point, longRun: runLength >= 7 }]};
    },
    { side: null, runLength: 0, rows: [] },
  ).rows;
  return (
    <Shell>
      <ChartResponsiveContainer width="100%" height="100%">
        <LineChart data={shaped} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <ReferenceLine y={median} stroke={SEMANTIC.neutral} strokeDasharray="4 4" label={{ value: "Median", position: "insideTopRight" }} />
          <Line
            type="linear"
            dataKey="revenue"
            stroke={CHART_COLORS[1]}
            strokeWidth={SERIES_STROKE_WIDTH}
            dot={(props) => {
              const point = shaped[props.index];
              return <circle cx={props.cx} cy={props.cy} r={point?.longRun ? 4.5 : 2.5} fill={point?.longRun ? SEMANTIC.warning : CHART_COLORS[1]} />;
            }}
            {...anim}
          />
        </LineChart>
      </ChartResponsiveContainer>
    </Shell>
  );
}

const fishboneCategories = ["Methods", "Materials", "Machines", "People"];

export function FishboneDiagram() {
  const width = 400;
  const height = 200;
  const spineY = height / 2;
  const arrowTip = 322;
  const boneRun = 34;
  const boneRise = 50;

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <line x1={28} y1={spineY} x2={arrowTip - 8} y2={spineY} stroke="var(--chart-axis)" strokeWidth={2} />
        <polygon points={`${arrowTip},${spineY} ${arrowTip - 16},${spineY - 9} ${arrowTip - 16},${spineY + 9}`} fill="var(--chart-axis)" />
        {fishboneCategories.map((label, i) => {
          const up = i % 2 === 0;
          const anchorX = 104 + i * 54;
          const tipX = anchorX - boneRun;
          const tipY = up ? spineY - boneRise : spineY + boneRise;
          return (
            <g key={label}>
              <line x1={anchorX} y1={spineY} x2={tipX} y2={tipY} stroke={colorAt(i)} strokeWidth={1.5} />
              <circle cx={anchorX} cy={spineY} r={2.5} fill={colorAt(i)} />
              <text
                x={tipX}
                y={up ? tipY - 6 : tipY + 14}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize={10}
                fontWeight={500}
              >
                {label}
              </text>
            </g>
          );
        })}
        <rect x={328} y={spineY - 13} width={52} height={26} rx={6} fill="var(--card)" stroke="var(--border)" />
        <text
          x={354}
          y={spineY}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--foreground)"
          fontSize={10}
          fontWeight={600}
        >
          Effect
        </text>
      </svg>
    </Shell>
  );
}

export function BowTieDiagram() {
  const width = 400;
  const height = 180;
  const cx = width / 2;
  const cy = height / 2;
  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <polygon points={`${cx},${cy} ${cx - 80},${cy - 50} ${cx - 80},${cy + 50}`} fill={CHART_COLORS[1]} fillOpacity={0.25} stroke={CHART_COLORS[1]} />
        <polygon points={`${cx},${cy} ${cx + 80},${cy - 50} ${cx + 80},${cy + 50}`} fill={CHART_COLORS[3]} fillOpacity={0.25} stroke={CHART_COLORS[3]} />
        <circle cx={cx} cy={cy} r={14} fill={SEMANTIC.warning} />
        {/* These name the two halves of the diagram, so they are data labels:
            foreground ink at the 10px floor, anchored against each wing rather
            than floating at a guessed offset. The centre node is the top event
            the wings converge on, which was previously left unlabelled. */}
        <text
          x={cx - 86}
          y={cy}
          textAnchor="end"
          dominantBaseline="central"
          fill="var(--foreground)"
          fontSize={10}
          fontWeight={500}
        >
          Threats
        </text>
        <text
          x={cx + 86}
          y={cy}
          textAnchor="start"
          dominantBaseline="central"
          fill="var(--foreground)"
          fontSize={10}
          fontWeight={500}
        >
          Consequences
        </text>
        <text
          x={cx}
          y={cy + 32}
          textAnchor="middle"
          dominantBaseline="central"
          fill="var(--muted-foreground)"
          fontSize={10}
        >
          Event
        </text>
      </svg>
    </Shell>
  );
}

/**
 * Symmetric three-set layout. Each label sits in its set's exclusive lobe — one
 * tint deep — so `--foreground` ink clears 4.5:1 in both themes without a plate
 * behind the glyphs.
 */
const vennSets = [
  { label: "A", cx: 174, cy: 67, labelX: 143, labelY: 50 },
  { label: "B", cx: 226, cy: 67, labelX: 257, labelY: 50 },
  { label: "C", cx: 200, cy: 113, labelX: 200, labelY: 148 },
];

export function VennDiagram() {
  const width = 400;
  const height = 180;
  const r = 53;
  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {vennSets.map((s, i) => (
          <circle key={s.label} cx={s.cx} cy={s.cy} r={r} fill={colorAt(i)} fillOpacity={0.28} stroke={colorAt(i)} />
        ))}
        {vennSets.map((s) => (
          <text
            key={s.label}
            x={s.labelX}
            y={s.labelY}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--foreground)"
            fontSize={11}
            fontWeight={600}
          >
            {s.label}
          </text>
        ))}
      </svg>
    </Shell>
  );
}

export function EulerDiagram() {
  return <VennDiagram />;
}

/** Manrope's SVG text box, measured: em above and below the baseline. */
const TEXT_ASCENT = 1.07;
const TEXT_DESCENT = 0.3;

/** Manrope semibold advance per glyph, in em, rounded up so an estimated word
 *  box always contains the real ink. */
function advanceEm(ch: string): number {
  if ("iIjl.,:;'!|".includes(ch)) return 0.32;
  if ("frt".includes(ch)) return 0.44;
  if ("mwMW".includes(ch)) return 0.94;
  if (ch === " " || ch === "-") return 0.34;
  if (ch >= "A" && ch <= "Z") return 0.76;
  return 0.65;
}

function wordWidth(text: string, size: number): number {
  let em = 0;
  for (const ch of text) em += advanceEm(ch);
  return em * size;
}

export type CloudDatum = { text: string; value: number };
type CloudWord = { key: string; text: string; value: number; size: number; width: number; tier: number };
type CloudRow = { words: CloudWord[]; sum: number; maxSize: number };
type CloudLayout = { rows: CloudRow[]; height: number; maxWidth: number };
type CloudPlacement = Omit<CloudWord, "width"> & { x: number; y: number };

const CLOUD_PAD = 12;
const CLOUD_LEAD = 2;
const CLOUD_TIERS = 4;

/** Word spacing keys off the row's largest word only, so re-ordering a row can
 *  never change how wide it is. */
const rowGap = (row: CloudRow) => Math.max(7, row.maxSize * 0.3);
const rowWidth = (row: CloudRow) => row.sum + rowGap(row) * (row.words.length - 1);
const rowHeight = (row: CloudRow) => (TEXT_ASCENT + TEXT_DESCENT) * row.maxSize;

function toRow(entries: CloudWord[]): CloudRow {
  return {
    words: entries,
    sum: entries.reduce((t, w) => t + w.width, 0),
    maxSize: entries.reduce((t, w) => Math.max(t, w.size), 0)};
}

/** Re-order a descending list so the heaviest item sits mid-sequence and the
 *  rest taper away from it on both sides. */
function taperFromCentre<T>(descending: readonly T[]): T[] {
  const out: T[] = [];
  descending.forEach((item, i) => (i % 2 === 0 ? out.push(item) : out.unshift(item)));
  return out;
}

/**
 * Deterministic word-cloud layout. Sizes come from the value ranking, words are
 * packed into centred rows, and both the row order and each row's internal order
 * taper away from the heaviest word so the block carries its mass in the middle.
 * Every box is measured against real Manrope metrics, so the art stays inside the
 * padded viewBox instead of pushing its ascenders past y=0.
 */
function layoutWordCloud(
  data: readonly { text: string; value: number }[],
  width: number,
  height: number,
): CloudPlacement[] {
  const boxW = width - CLOUD_PAD * 2;
  const boxH = height - CLOUD_PAD * 2;
  const ranked = data
    .map((d, i) => ({ ...d, i }))
    .filter((d) => d.text.trim().length > 0 && Number.isFinite(d.value))
    .sort((a, b) => b.value - a.value || a.i - b.i);
  if (ranked.length === 0) return [];

  const hi = ranked[0]!.value;
  const lo = ranked[ranked.length - 1]!.value;
  const span = hi - lo || 1;
  const perTier = Math.ceil(ranked.length / CLOUD_TIERS);

  const pack = (scale: number, floor: number): CloudLayout => {
    const sized: CloudWord[] = ranked.map((w, rank) => {
      const size = roundSvgNumber(Math.max(floor, (11 + Math.pow((w.value - lo) / span, 0.85) * 19) * scale));
      return {
        key: `${w.text}-${w.i}`,
        text: w.text,
        value: w.value,
        size,
        width: wordWidth(w.text, size),
        tier: Math.min(CLOUD_TIERS - 1, Math.floor(rank / perTier))};
    });

    const rows: CloudRow[] = [];
    let row = toRow([]);
    for (const word of taperFromCentre(sized)) {
      const grown = toRow([...row.words, word]);
      if (row.words.length > 0 && rowWidth(grown) > boxW) {
        rows.push(row);
        row = toRow([word]);
      } else {
        row = grown;
      }
    }
    if (row.words.length > 0) rows.push(row);

    // No lonely trailing word: pull one down from the row above.
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    if (last && prev && last.words.length === 1 && prev.words.length > 1) {
      const merged = toRow([prev.words[prev.words.length - 1]!, ...last.words]);
      if (rowWidth(merged) <= boxW) {
        rows[rows.length - 1] = merged;
        rows[rows.length - 2] = toRow(prev.words.slice(0, -1));
      }
    }

    const balanced = rows.map((r) =>
      toRow(taperFromCentre([...r.words].sort((a, b) => b.size - a.size || a.key.localeCompare(b.key)))),
    );
    return {
      rows: balanced,
      height: balanced.reduce((t, r) => t + rowHeight(r), 0) + Math.max(0, balanced.length - 1) * CLOUD_LEAD,
      maxWidth: balanced.reduce((t, r) => Math.max(t, rowWidth(r)), 0)};
  };

  // Largest type that still fits the padded box; 10px floor first, 9px only if
  // the caller passes far more words than the demo set.
  let best: CloudLayout | null = null;
  for (const floor of [10, 9]) {
    for (let s = 190; s >= 40 && !best; s -= 3) {
      const candidate = pack(s / 100, floor);
      if (candidate.height <= boxH && candidate.maxWidth <= boxW) best = candidate;
    }
    if (best) break;
  }
  let layout = best ?? pack(0.4, 9);
  // Last resort for pathological inputs: drop the smallest tail rows rather than
  // draw outside the viewBox.
  while (layout.rows.length > 1 && layout.height > boxH) {
    const rows = layout.rows.slice(0, -1);
    layout = {
      rows,
      height: layout.height - rowHeight(layout.rows[layout.rows.length - 1]!) - CLOUD_LEAD,
      maxWidth: rows.reduce((t, r) => Math.max(t, rowWidth(r)), 0)};
  }

  const placed: CloudPlacement[] = [];
  let top = CLOUD_PAD + (boxH - layout.height) / 2;
  for (const row of layout.rows) {
    const baseline = top + TEXT_ASCENT * row.maxSize;
    const gap = rowGap(row);
    let cursor = CLOUD_PAD + (boxW - rowWidth(row)) / 2;
    for (const w of row.words) {
      placed.push({ key: w.key, text: w.text, value: w.value, size: w.size, tier: w.tier, x: roundSvgNumber(cursor + w.width / 2), y: roundSvgNumber(baseline) });
      cursor += w.width + gap;
    }
    top += rowHeight(row) + CLOUD_LEAD;
  }
  return placed;
}

export type WordCloudProps = {
  data?: readonly CloudDatum[];
  ariaLabel?: string;
};

export function WordCloud({ data = words, ariaLabel = "Word cloud sized by value" }: WordCloudProps) {
  const width = 400;
  const height = 180;
  const placed = layoutWordCloud(data, width, height);

  if (placed.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet" role="img" aria-label={ariaLabel}>
        <title>{ariaLabel}</title>
        <desc>Words are sized by their numeric values and packed into deterministic rows.</desc>
        {placed.map((p) => (
          <text
            key={p.key}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            fill={colorAt(p.tier * 2)}
            fontSize={p.size}
            fontWeight={p.tier === 0 ? 600 : p.tier === 1 ? 500 : 400}
          >
            {p.text}
          </text>
        ))}
      </svg>
      <ScreenReaderTable><caption>{ariaLabel} data</caption><thead><tr><th scope="col">Word</th><th scope="col">Value</th></tr></thead><tbody>{placed.map((word) => <tr key={word.key}><th scope="row">{word.text}</th><td>{word.value}</td></tr>)}</tbody></ScreenReaderTable>
    </Shell>
  );
}

export function TagCloud(props: React.ComponentProps<typeof WordCloud>) {
  return <WordCloud {...props} />;
}

const DAY_IN_MS = 86_400_000;

export type CalendarDateInput = string | Date;

export type CalendarDatum = {
  date: CalendarDateInput;
  value: number;
  label?: string;
};

export type CalendarSelectionProps = {
  selectedDate?: string | null;
  defaultSelectedDate?: string | null;
  onDateSelect?: (date: string, datum: CalendarDatum) => void;
};

export type CalendarHeatmapProps = CalendarSelectionProps & {
  data?: readonly CalendarDatum[];
  weekStartsOn?: 0 | 1;
  locale?: string;
  ariaLabel?: string;
  color?: string;
  valueFormatter?: (value: number) => string;
};

export type CalendarVisualProps = CalendarSelectionProps & {
  data?: readonly CalendarDatum[];
  /** Month to show. ISO `YYYY-MM`, ISO date, and Date values are accepted. */
  month?: CalendarDateInput;
  weekStartsOn?: 0 | 1;
  locale?: string;
  ariaLabel?: string;
  color?: string;
  valueFormatter?: (value: number) => string;
  showValues?: boolean;
};

type NormalizedCalendarDatum = CalendarDatum & {
  dateObject: Date;
  isoDate: string;
};

function parseCalendarDate(value: CalendarDateInput): Date | null {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) return null;
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }
  const exact = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (exact) {
    const year = Number(exact[1]);
    const month = Number(exact[2]) - 1;
    const day = Number(exact[3]);
    const result = new Date(Date.UTC(year, month, day));
    if (
      result.getUTCFullYear() !== year ||
      result.getUTCMonth() !== month ||
      result.getUTCDate() !== day
    ) return null;
    return result;
  }
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function calendarIso(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
}

function normalizeCalendarData(data: readonly CalendarDatum[]) {
  const byDate = new Map<string, NormalizedCalendarDatum>();
  let invalid = 0;
  let duplicates = 0;
  for (const datum of data) {
    const dateObject = parseCalendarDate(datum.date);
    if (!dateObject || !Number.isFinite(datum.value)) {
      invalid += 1;
      continue;
    }
    const isoDate = calendarIso(dateObject);
    if (byDate.has(isoDate)) duplicates += 1;
    byDate.set(isoDate, { ...datum, dateObject, isoDate });
  }
  return {
    values: [...byDate.values()].sort((a, b) => a.dateObject.getTime() - b.dateObject.getTime()),
    invalid,
    duplicates};
}

function startOfCalendarWeek(date: Date, weekStartsOn: 0 | 1) {
  const result = new Date(date);
  const offset = (result.getUTCDay() - weekStartsOn + 7) % 7;
  result.setUTCDate(result.getUTCDate() - offset);
  return result;
}

function calendarDayIndex(date: Date, weekStartsOn: 0 | 1) {
  return (date.getUTCDay() - weekStartsOn + 7) % 7;
}

function calendarOpacity(value: number, min: number, max: number) {
  if (max === min) return 0.72;
  return 0.14 + ((value - min) / (max - min)) * 0.82;
}

function useCalendarSelection({
  selectedDate,
  defaultSelectedDate = null,
  onDateSelect}: CalendarSelectionProps) {
  const [internal, setInternal] = React.useState<string | null>(defaultSelectedDate);
  const selected = selectedDate === undefined ? internal : selectedDate;
  const select = React.useCallback((datum: NormalizedCalendarDatum) => {
    if (selectedDate === undefined) setInternal(datum.isoDate);
    onDateSelect?.(datum.isoDate, datum);
  }, [onDateSelect, selectedDate]);
  return { selected, select };
}

function CalendarDataTable({
  values,
  valueFormatter,
  caption}: {
  values: readonly NormalizedCalendarDatum[];
  valueFormatter: (value: number) => string;
  caption: string;
}) {
  return (
    <ScreenReaderTable>
      <caption>{caption}</caption>
      <thead><tr><th scope="col">Date</th><th scope="col">Value</th><th scope="col">Label</th></tr></thead>
      <tbody>
        {values.map((datum) => (
          <tr key={datum.isoDate}>
            <th scope="row">{datum.isoDate}</th>
            <td>{valueFormatter(datum.value)}</td>
            <td>{datum.label ?? ""}</td>
          </tr>
        ))}
      </tbody>
    </ScreenReaderTable>
  );
}

export function CalendarHeatmap({
  data = calendarHeat,
  weekStartsOn = 0,
  locale,
  ariaLabel = "Calendar heatmap",
  color = CHART_COLORS[0],
  valueFormatter = (value) => String(value),
  selectedDate,
  defaultSelectedDate,
  onDateSelect}: CalendarHeatmapProps) {
  const normalized = React.useMemo(() => normalizeCalendarData(data), [data]);
  const selection = useCalendarSelection({ selectedDate, defaultSelectedDate, onDateSelect });

  if (normalized.values.length === 0) {
    return <ChartEmpty label={normalized.invalid ? "No valid calendar dates" : "No calendar data"} />;
  }

  const firstWeek = startOfCalendarWeek(normalized.values[0].dateObject, weekStartsOn);
  const last = normalized.values[normalized.values.length - 1].dateObject;
  const weeks = Math.floor((last.getTime() - firstWeek.getTime()) / DAY_IN_MS / 7) + 1;
  const cell = weeks > 20 ? 15 : 24;
  const left = 42;
  const top = 30;
  const right = 10;
  const bottom = 22;
  const width = Math.max(400, left + weeks * cell + right);
  const height = top + 7 * cell + bottom;
  const extent = d3.extent(normalized.values, (datum) => datum.value) as [number, number];
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeZone: "UTC"});
  const weekdayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    timeZone: "UTC"});
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    timeZone: "UTC"});
  const monthLabels = new Map<string, { label: string; week: number }>();
  for (const datum of normalized.values) {
    const key = `${datum.dateObject.getUTCFullYear()}-${datum.dateObject.getUTCMonth()}`;
    if (!monthLabels.has(key)) {
      monthLabels.set(key, {
        label: monthFormatter.format(datum.dateObject),
        week: Math.floor((startOfCalendarWeek(datum.dateObject, weekStartsOn).getTime() - firstWeek.getTime()) / DAY_IN_MS / 7)});
    }
  }
  const weekdayOrigin = new Date(Date.UTC(2024, 0, weekStartsOn === 0 ? 7 : 8));

  return (
    <Shell>
      <div className="flex h-full min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-x-auto" tabIndex={0} aria-label="Scrollable calendar plot">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-full min-h-[210px]"
            style={{ width: `max(100%, ${width}px)` }}
            preserveAspectRatio="xMinYMid meet"
            role="img"
            aria-label={ariaLabel}
          >
            {[...monthLabels.entries()].map(([key, month]) => (
              <text key={key} x={left + month.week * cell + 2} y={17} fontSize={11} fill="var(--muted-foreground)">{month.label}</text>
            ))}
            {Array.from({ length: 7 }, (_, index) => {
              const date = new Date(weekdayOrigin);
              date.setUTCDate(date.getUTCDate() + index);
              return <text key={index} x={left - 7} y={top + index * cell + cell * 0.68} textAnchor="end" fontSize={11} fill="var(--muted-foreground)">{weekdayFormatter.format(date).slice(0, 2)}</text>;
            })}
            {normalized.values.map((datum) => {
              const week = Math.floor((startOfCalendarWeek(datum.dateObject, weekStartsOn).getTime() - firstWeek.getTime()) / DAY_IN_MS / 7);
              const day = calendarDayIndex(datum.dateObject, weekStartsOn);
              const label = `${dateFormatter.format(datum.dateObject)}: ${valueFormatter(datum.value)}${datum.label ? `, ${datum.label}` : ""}`;
              const interactive = Boolean(onDateSelect);
              return (
                <g
                  key={datum.isoDate}
                  role={interactive ? "button" : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  aria-label={interactive ? label : undefined}
                  onClick={interactive ? () => selection.select(datum) : undefined}
                  onKeyDown={interactive ? (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      selection.select(datum);
                    }
                  } : undefined}
                >
                  <title>{label}</title>
                  <rect
                    x={left + week * cell + 1}
                    y={top + day * cell + 1}
                    width={cell - 3}
                    height={cell - 3}
                    rx={3}
                    fill={color}
                    fillOpacity={calendarOpacity(datum.value, extent[0], extent[1])}
                    stroke={selection.selected === datum.isoDate ? "var(--ring)" : "var(--chart-grid)"}
                    strokeWidth={selection.selected === datum.isoDate ? 2.5 : 0.75}
                  />
                </g>
              );
            })}
          </svg>
        </div>
        {normalized.invalid || normalized.duplicates ? (
          <p role="status" className="px-2 text-[11px] text-muted-foreground">
            {normalized.invalid ? `${normalized.invalid} invalid row${normalized.invalid === 1 ? "" : "s"} omitted. ` : ""}
            {normalized.duplicates ? `${normalized.duplicates} duplicate date${normalized.duplicates === 1 ? "" : "s"} replaced by the last value.` : ""}
          </p>
        ) : null}
        <CalendarDataTable values={normalized.values} valueFormatter={valueFormatter} caption={`${ariaLabel} data`} />
      </div>
    </Shell>
  );
}

export function CalendarVisual({
  data = calendarHeat,
  month,
  weekStartsOn = 0,
  locale,
  ariaLabel = "Monthly calendar",
  color = CHART_COLORS[0],
  valueFormatter = (value) => String(value),
  showValues = true,
  selectedDate,
  defaultSelectedDate,
  onDateSelect}: CalendarVisualProps) {
  const normalized = React.useMemo(() => normalizeCalendarData(data), [data]);
  const selection = useCalendarSelection({ selectedDate, defaultSelectedDate, onDateSelect });
  const requestedMonth = month ? parseCalendarDate(month) : normalized.values[0]?.dateObject ?? null;

  if (!requestedMonth) {
    return <ChartEmpty label={normalized.invalid ? "No valid calendar dates" : "No calendar data"} />;
  }

  const year = requestedMonth.getUTCFullYear();
  const monthIndex = requestedMonth.getUTCMonth();
  const first = new Date(Date.UTC(year, monthIndex, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
  const offset = calendarDayIndex(first, weekStartsOn);
  const valuesByDay = new Map(
    normalized.values
      .filter((datum) => datum.dateObject.getUTCFullYear() === year && datum.dateObject.getUTCMonth() === monthIndex)
      .map((datum) => [datum.dateObject.getUTCDate(), datum]),
  );
  const values = [...valuesByDay.values()];
  const extent = d3.extent(values, (datum) => datum.value) as [number | undefined, number | undefined];
  const min = extent[0] ?? 0;
  const max = extent[1] ?? min;
  const width = 400;
  const height = 250;
  const left = 12;
  const right = 12;
  const top = 54;
  const bottom = 8;
  const cellWidth = (width - left - right) / 7;
  const cellHeight = (height - top - bottom) / 6;
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" });
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "full", timeZone: "UTC" });
  const weekdayOrigin = new Date(Date.UTC(2024, 0, weekStartsOn === 0 ? 7 : 8));

  return (
    <Shell>
      <div className="flex h-full min-h-0 flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-0 w-full flex-1" preserveAspectRatio="xMidYMid meet" role="img" aria-label={ariaLabel}>
          <text x={left} y={20} fontSize={13} fontWeight={600} fill="var(--foreground)">{monthFormatter.format(first)}</text>
          {Array.from({ length: 7 }, (_, index) => {
            const date = new Date(weekdayOrigin);
            date.setUTCDate(date.getUTCDate() + index);
            return <text key={index} x={left + index * cellWidth + cellWidth / 2} y={42} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">{weekdayFormatter.format(date).slice(0, 3)}</text>;
          })}
          {Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const slot = offset + index;
            const column = slot % 7;
            const row = Math.floor(slot / 7);
            const datum = valuesByDay.get(day);
            const date = new Date(Date.UTC(year, monthIndex, day));
            const isoDate = calendarIso(date);
            const label = `${dateFormatter.format(date)}: ${datum ? valueFormatter(datum.value) : "No value"}${datum?.label ? `, ${datum.label}` : ""}`;
            const interactive = Boolean(datum && onDateSelect);
            return (
              <g
                key={isoDate}
                role={interactive ? "button" : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={interactive ? label : undefined}
                onClick={interactive && datum ? () => selection.select(datum) : undefined}
                onKeyDown={interactive && datum ? (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selection.select(datum);
                  }
                } : undefined}
              >
                <title>{label}</title>
                <rect
                  x={left + column * cellWidth + 1.5}
                  y={top + row * cellHeight + 1.5}
                  width={cellWidth - 3}
                  height={cellHeight - 3}
                  rx={4}
                  fill={datum ? color : "var(--muted)"}
                  fillOpacity={datum ? calendarOpacity(datum.value, min, max) : 0.32}
                  stroke={selection.selected === isoDate ? "var(--ring)" : "var(--chart-grid)"}
                  strokeWidth={selection.selected === isoDate ? 2.5 : 0.75}
                />
                <text x={left + column * cellWidth + 7} y={top + row * cellHeight + 14} fontSize={11} fontWeight={600} fill="var(--foreground)">{day}</text>
                {showValues && datum ? <text x={left + column * cellWidth + cellWidth - 7} y={top + row * cellHeight + cellHeight - 8} textAnchor="end" fontSize={11} fill="var(--foreground)">{valueFormatter(datum.value)}</text> : null}
              </g>
            );
          })}
        </svg>
        {normalized.invalid || normalized.duplicates ? (
          <p role="status" className="px-2 text-[11px] text-muted-foreground">
            {normalized.invalid ? `${normalized.invalid} invalid row${normalized.invalid === 1 ? "" : "s"} omitted. ` : ""}
            {normalized.duplicates ? `${normalized.duplicates} duplicate date${normalized.duplicates === 1 ? "" : "s"} replaced by the last value.` : ""}
          </p>
        ) : null}
        <CalendarDataTable values={values} valueFormatter={valueFormatter} caption={`${ariaLabel} data for ${monthFormatter.format(first)}`} />
      </div>
    </Shell>
  );
}

export function KPITicker({ metrics = kpiMetrics }: { metrics?: typeof kpiMetrics }) {
  return (
    <Shell>
      <div className="flex h-full w-full items-center gap-4 overflow-hidden px-2">
        {metrics.map((m, i) => (
          <div key={m.label} className="shrink-0 rounded-lg border border-[var(--chart-grid)] px-3 py-2">
            <div className="text-[10px] text-muted-foreground">{m.label}</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: colorAt(i) }}>
              {formatCompact(m.value)}
            </div>
            <div className={cn("text-[10px] tabular-nums", m.delta >= 0 ? "text-[var(--chart-positive)]" : "text-[var(--chart-negative)]")}>
              {formatPercent(m.delta, 1)}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function DataTicker({ metrics = kpiMetrics }: { metrics?: typeof kpiMetrics }) {
  const [index, setIndex] = React.useState(0);
  useMotionInterval(
    () => setIndex((current) => (current + 1) % Math.max(metrics.length, 1)),
    2200,
    { enabled: metrics.length > 1 },
  );
  if (!metrics.length) return <ChartEmpty />;
  const metric = metrics[Math.min(index, metrics.length - 1)];
  return (
    <Shell>
      <div className="flex h-full items-center justify-center">
        <div role="status" aria-live="polite" className="min-w-48 rounded-xl border border-[var(--chart-grid)] bg-card px-5 py-4 text-center">
          <div className="text-xs text-muted-foreground">{metric.label}</div>
          <div className="mt-1 text-2xl font-bold tabular-nums">{formatCompact(metric.value)}</div>
          <div className={cn("mt-1 text-xs font-medium tabular-nums", metric.delta >= 0 ? "text-[var(--chart-positive)]" : "text-[var(--chart-negative)]")}>{formatPercent(metric.delta, 1)}</div>
          <div className="mt-3 text-[10px] text-muted-foreground">Metric {Math.min(index, metrics.length - 1) + 1} of {metrics.length}</div>
        </div>
      </div>
    </Shell>
  );
}

export function ScrollingText({
  items = words.map((w) => w.text),
  autoplay = true,
  intervalMs = 2000}: {
  items?: string[];
  autoplay?: boolean;
  intervalMs?: number;
}) {
  const [offset, setOffset] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  useMotionInterval(
    () => setOffset((current) => (current + 1) % Math.max(items.length, 1)),
    intervalMs,
    { enabled: autoplay && !paused && items.length > 1 },
  );

  const visible = items.slice(offset, offset + 3).concat(items.slice(0, Math.max(0, offset + 3 - items.length)));

  if (items.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative flex h-full w-full items-center justify-center gap-3 text-sm text-muted-foreground">
        <div role="status" aria-live="polite" className="flex gap-3">
          {visible.map((t, i) => (
            <span key={`${t}-${i}`} className="rounded-[var(--radius-sm)] border border-[var(--chart-grid)] px-3 py-1" style={{ color: colorAt(i) }}>
              {t}
            </span>
          ))}
        </div>
        {autoplay && items.length > 1 ? (
          <button type="button" onClick={() => setPaused((current) => !current)} aria-pressed={paused} className="absolute bottom-2 right-2 min-h-11 rounded-md border border-border bg-card px-3 text-xs font-medium">{paused ? "Play" : "Pause"}</button>
        ) : null}
      </div>
    </Shell>
  );
}

export type MotionMode = "auto" | "off";

export type AnimatedPlaybackProps = {
  /** Controlled zero-based frame index. */
  value?: number;
  /** Initial zero-based frame index for uncontrolled playback. */
  defaultValue?: number;
  onValueChange?: (frameIndex: number) => void;
  autoplay?: boolean;
  intervalMs?: number;
  motion?: MotionMode;
};

type FrameSetter = (next: number | ((current: number) => number)) => void;

function clampFrame(value: number | undefined, length: number) {
  if (!length || !Number.isFinite(value)) return 0;
  return Math.min(length - 1, Math.max(0, Math.trunc(value ?? 0)));
}

function useFrameValue({
  length,
  value,
  defaultValue = 0,
  onValueChange}: Pick<AnimatedPlaybackProps, "value" | "defaultValue" | "onValueChange"> & { length: number }) {
  const [internal, setInternal] = React.useState(() => clampFrame(defaultValue, length));
  const current = clampFrame(value === undefined ? internal : value, length);
  const setFrame = React.useCallback<FrameSetter>((next) => {
    const resolved = clampFrame(typeof next === "function" ? next(current) : next, length);
    if (value === undefined) setInternal(resolved);
    if (resolved !== current) onValueChange?.(resolved);
  }, [current, length, onValueChange, value]);
  return [current, setFrame] as const;
}

export type BarRaceDatum = {
  id?: string;
  name: string;
  value: number;
};

export type BarRaceFrame = {
  id?: string;
  label: string;
  values: readonly BarRaceDatum[];
};

export type AnimatedBarRaceProps = AnimatedPlaybackProps & {
  frames?: readonly BarRaceFrame[];
  ariaLabel?: string;
  topN?: number;
};

export function AnimatedBarRace({
  frames = [],
  autoplay = true,
  intervalMs = 1200,
  motion = "auto",
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Animated bar race",
  topN}: AnimatedBarRaceProps) {
  const [frame, setFrame] = useFrameValue({ length: frames.length, value, defaultValue, onValueChange });
  const [paused, setPaused] = React.useState(false);
  const [viewportRef, viewportVisible] = useElementVisible<HTMLDivElement>();
  const reduceMotion = usePrefersReducedMotion();
  useMotionInterval(
    () => setFrame((current) => (current + 1) % Math.max(frames.length, 1)),
    intervalMs,
    { enabled: autoplay && !paused && motion !== "off" && viewportVisible && frames.length > 1 },
  );

  const anim = useChartAnimation(motion !== "off" && viewportVisible);
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const entityKeys = [...new Set(frames.flatMap((item) => item.values.map((datum) => datum.id ?? datum.name)))];
  const currentFrame = frames[Math.min(frame, Math.max(frames.length - 1, 0))];
  const shaped = [...(currentFrame?.values ?? [])]
    .filter((datum) => Number.isFinite(datum.value))
    .sort((a, b) => b.value - a.value)
    .slice(0, topN && topN > 0 ? Math.trunc(topN) : undefined);

  if (!frames.length || !shaped.length) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div ref={viewportRef} className="relative h-full w-full pb-14" aria-label={ariaLabel}>
        <div className="absolute right-2 top-1 z-10 rounded-[var(--radius-sm)] bg-card/90 px-2 py-1 text-xs font-semibold">{currentFrame.label}</div>
        <ChartResponsiveContainer width="100%" height="100%">
          <BarChart data={shaped} layout="vertical" margin={{ ...PLOT_MARGIN_COMPACT, top: 20 }} /* race chart label room */ accessibilityLayer>
            <defs>
              {entityKeys.map((entityKey, index) => (
                <linearGradient key={entityKey} id={`race-${uid}-${index}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={colorAt(index)} stopOpacity={1} />
                  <stop offset="100%" stopColor={colorAt(index)} stopOpacity={0.82} />
                </linearGradient>
              ))}
            </defs>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={72} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18} {...anim}>
              {shaped.map((datum) => {
                const entityKey = datum.id ?? datum.name;
                return <Cell key={entityKey} fill={`url(#race-${uid}-${Math.max(0, entityKeys.indexOf(entityKey))})`} fillOpacity={hover.opacityFor(entityKey)} {...hover.bind(entityKey)} />;
              })}
            </Bar>
          </BarChart>
        </ChartResponsiveContainer>
        <div className="absolute inset-x-2 bottom-0 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
          <button type="button" onClick={() => setFrame((current) => (current - 1 + frames.length) % frames.length)} className="min-h-11 rounded-md border border-border px-3 text-xs">Previous</button>
          <label className="grid min-w-0 gap-0.5 text-[11px] text-muted-foreground">
            <span className="sr-only">Frame</span>
            <input type="range" min={0} max={frames.length - 1} value={frame} onChange={(event) => setFrame(Number(event.currentTarget.value))} className="w-full" />
            <span role="status" aria-live="polite" className="text-center">Frame {frame + 1} of {frames.length}</span>
          </label>
          <button type="button" onClick={() => setFrame((current) => (current + 1) % frames.length)} className="min-h-11 rounded-md border border-border px-3 text-xs">Next</button>
          {autoplay ? <button type="button" onClick={() => setPaused((current) => !current)} disabled={motion === "off" || reduceMotion} aria-pressed={paused} className="min-h-11 rounded-md border border-border px-3 text-xs disabled:opacity-50">{motion === "off" || reduceMotion ? "Motion off" : paused ? "Play" : "Pause"}</button> : null}
        </div>
        <ScreenReaderTable>
          <caption>{currentFrame.label} bar race values</caption>
          <thead><tr><th scope="col">Entity</th><th scope="col">Value</th></tr></thead>
          <tbody>{shaped.map((datum) => <tr key={datum.id ?? datum.name}><th scope="row">{datum.name}</th><td>{datum.value}</td></tr>)}</tbody>
        </ScreenReaderTable>
      </div>
    </Shell>
  );
}

export type AnimatedScatterFrame = {
  id?: string;
  label: string;
  points: readonly { id: string; x: number; y: number; size?: number; category?: string }[];
};

export type AnimatedScatterProps = AnimatedPlaybackProps & {
  frames?: readonly AnimatedScatterFrame[];
  ariaLabel?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
};

export function AnimatedScatter({
  frames = [],
  autoplay = true,
  intervalMs = 900,
  motion = "auto",
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Animated scatter chart",
  xAxisLabel,
  yAxisLabel}: AnimatedScatterProps) {
  const [frame, setFrame] = useFrameValue({ length: frames.length, value, defaultValue, onValueChange });
  const [paused, setPaused] = React.useState(false);
  const [viewportRef, viewportVisible] = useElementVisible<HTMLDivElement>();
  const reduceMotion = usePrefersReducedMotion();
  useMotionInterval(
    () => setFrame((current) => (current + 1) % Math.max(frames.length, 1)),
    intervalMs,
    { enabled: autoplay && !paused && motion !== "off" && viewportVisible && frames.length > 1 },
  );

  const anim = useChartAnimation(motion !== "off" && viewportVisible);

  const currentFrame = frames[Math.min(frame, Math.max(frames.length - 1, 0))];
  const points = (currentFrame?.points ?? []).filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  const categories = [...new Set(frames.flatMap((item) => item.points.map((point) => point.category ?? point.id)))];

  if (!frames.length || !points.length) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div ref={viewportRef} className="relative h-full w-full pb-14" aria-label={ariaLabel}>
        <div className="absolute right-2 top-1 z-10 rounded-[var(--radius-sm)] bg-card/90 px-2 py-1 text-xs font-semibold">{currentFrame.label}</div>
        <ChartResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ ...PLOT_MARGIN_COMPACT, left: 4, bottom: xAxisLabel ? 18 : 0 }} /* scatter axis label */ accessibilityLayer>
            <CartesianGrid />
            <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -12 } : undefined} />
            <YAxis type="number" dataKey="y" tickLine={false} axisLine={false} width={42} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft" } : undefined} />
            <ZAxis type="number" dataKey="size" range={[50, 360]} />
            <Tooltip content={<ChartTooltip />} />
            <Scatter data={points} fill={CHART_COLORS[4]} {...anim}>
              {points.map((point) => (
                <Cell key={point.id} fill={colorAt(Math.max(0, categories.indexOf(point.category ?? point.id)))} />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartResponsiveContainer>
        <div className="absolute inset-x-2 bottom-0 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
          <button type="button" onClick={() => setFrame((current) => (current - 1 + frames.length) % frames.length)} className="min-h-11 rounded-md border border-border px-3 text-xs">Previous</button>
          <label className="grid min-w-0 gap-0.5 text-[11px] text-muted-foreground"><span className="sr-only">Frame</span><input type="range" min={0} max={frames.length - 1} value={frame} onChange={(event) => setFrame(Number(event.currentTarget.value))} className="w-full" /><span role="status" aria-live="polite" className="text-center">Frame {frame + 1} of {frames.length}</span></label>
          <button type="button" onClick={() => setFrame((current) => (current + 1) % frames.length)} className="min-h-11 rounded-md border border-border px-3 text-xs">Next</button>
          {autoplay ? <button type="button" onClick={() => setPaused((current) => !current)} disabled={motion === "off" || reduceMotion} aria-pressed={paused} className="min-h-11 rounded-md border border-border px-3 text-xs disabled:opacity-50">{motion === "off" || reduceMotion ? "Motion off" : paused ? "Play" : "Pause"}</button> : null}
        </div>
        <ScreenReaderTable><caption>{currentFrame.label} scatter values</caption><thead><tr><th scope="col">Point</th><th scope="col">X</th><th scope="col">Y</th><th scope="col">Size</th><th scope="col">Category</th></tr></thead><tbody>{points.map((point) => <tr key={point.id}><th scope="row">{point.id}</th><td>{point.x}</td><td>{point.y}</td><td>{point.size ?? ""}</td><td>{point.category ?? ""}</td></tr>)}</tbody></ScreenReaderTable>
      </div>
    </Shell>
  );
}

export type AnimatedTimelineFrame = {
  id?: string;
  label: string;
  events: readonly TimelineEvent[];
};

export type AnimatedTimelineProps = AnimatedPlaybackProps & {
  frames?: readonly AnimatedTimelineFrame[];
  /** @deprecated Prefer explicit `frames`; retained for source compatibility. */
  events?: readonly TimelineEvent[];
  ariaLabel?: string;
};

export function AnimatedTimeline({
  frames = [],
  events = [],
  autoplay = true,
  intervalMs = 900,
  motion = "auto",
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Animated project timeline"}: AnimatedTimelineProps) {
  const resolvedFrames = React.useMemo<readonly AnimatedTimelineFrame[]>(() => {
    if (frames.length) return frames;
    return events.map((_, index) => ({ label: `${index + 1} of ${events.length} events`, events: events.slice(0, index + 1) }));
  }, [events, frames]);
  const [frame, setFrame] = useFrameValue({ length: resolvedFrames.length, value, defaultValue, onValueChange });
  const [paused, setPaused] = React.useState(false);
  const [viewportRef, viewportVisible] = useElementVisible<HTMLDivElement>();
  const reduceMotion = usePrefersReducedMotion();
  useMotionInterval(
    () => setFrame((current) => (current + 1) % Math.max(resolvedFrames.length, 1)),
    intervalMs,
    { enabled: autoplay && !paused && motion !== "off" && viewportVisible && resolvedFrames.length > 1 },
  );

  if (!resolvedFrames.length || !resolvedFrames[frame]?.events.length) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div ref={viewportRef} className="relative h-full w-full pb-14">
        <TimelineChart events={[...resolvedFrames[frame].events]} ariaLabel={ariaLabel} />
        <div className="absolute inset-x-2 bottom-0 grid grid-cols-[auto_1fr_auto_auto] items-center gap-2">
          <button type="button" onClick={() => setFrame((current) => Math.max(0, current - 1))} disabled={frame <= 0} className="min-h-11 rounded-md border border-border px-3 text-xs disabled:opacity-50">Previous</button>
          <label className="grid min-w-0 gap-0.5 text-[11px] text-muted-foreground"><span className="sr-only">Frame</span><input type="range" min={0} max={resolvedFrames.length - 1} value={frame} onChange={(event) => setFrame(Number(event.currentTarget.value))} className="w-full" /><span role="status" aria-live="polite" className="truncate text-center">{resolvedFrames[frame].label}</span></label>
          <button type="button" onClick={() => setFrame((current) => Math.min(resolvedFrames.length - 1, current + 1))} disabled={frame >= resolvedFrames.length - 1} className="min-h-11 rounded-md border border-border px-3 text-xs disabled:opacity-50">Next</button>
          {autoplay ? <button type="button" onClick={() => setPaused((current) => !current)} disabled={motion === "off" || reduceMotion} aria-pressed={paused} className="min-h-11 rounded-md border border-border px-3 text-xs disabled:opacity-50">{motion === "off" || reduceMotion ? "Motion off" : paused ? "Play" : "Pause"}</button> : null}
        </div>
      </div>
    </Shell>
  );
}

export type ChartImage = {
  id?: string;
  src: string;
  alt: string;
  caption?: string;
  fallbackSrc?: string;
  objectPosition?: string;
  loading?: "eager" | "lazy";
  width?: number;
  height?: number;
};

export type ImageGridProps = {
  images?: readonly ChartImage[];
  columns?: 1 | 2 | 3 | 4;
  fit?: "cover" | "contain";
  ariaLabel?: string;
  onImageLoad?: (image: ChartImage, index: number) => void;
  onImageError?: (image: ChartImage, index: number) => void;
};

function ChartImageMedia({
  image,
  index,
  fit,
  active = true,
  onLoad,
  onError}: {
  image: ChartImage;
  index: number;
  fit: "cover" | "contain";
  active?: boolean;
  onLoad?: ImageGridProps["onImageLoad"];
  onError?: ImageGridProps["onImageError"];
}) {
  const [source, setSource] = React.useState(image.src);
  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  return (
    <div className="relative h-full min-h-20 w-full overflow-hidden">
      {!loaded && !failed ? <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden="true" /> : null}
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={source}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading={active ? image.loading ?? "lazy" : "lazy"}
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            onLoad?.(image, index);
          }}
          onError={() => {
            if (image.fallbackSrc && source !== image.fallbackSrc) {
              setLoaded(false);
              setSource(image.fallbackSrc);
              return;
            }
            setFailed(true);
            onError?.(image, index);
          }}
          className={cn("h-full w-full", fit === "cover" ? "object-cover" : "object-contain", !loaded && "opacity-0")}
          style={{ objectPosition: image.objectPosition }}
        />
      ) : (
        <div role="status" className="flex h-full min-h-20 items-center justify-center bg-muted px-3 text-center text-xs text-muted-foreground">
          Image unavailable: {image.alt}
        </div>
      )}
    </div>
  );
}

export function ImageGrid({
  images = [],
  columns = 3,
  fit = "cover",
  ariaLabel = "Image grid",
  onImageLoad,
  onImageError}: ImageGridProps) {
  if (!images.length) return <ChartEmpty label="No images" />;
  return (
    <Shell>
      <div
        className="grid h-full w-full gap-2 overflow-auto p-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        role="list"
        aria-label={ariaLabel}
      >
        {images.map((image, index) => (
          <figure key={`${image.id ?? index}:${image.src}`} role="listitem" className="min-w-0 overflow-hidden rounded-md border border-[var(--chart-grid)] bg-muted">
            <ChartImageMedia image={image} index={index} fit={fit} onLoad={onImageLoad} onError={onImageError} />
            {image.caption ? <figcaption className="truncate px-2 py-1 text-xs text-muted-foreground">{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </Shell>
  );
}

export type ImageCarouselProps = AnimatedPlaybackProps & {
  images?: readonly ChartImage[];
  fit?: "cover" | "contain";
  ariaLabel?: string;
  onImageLoad?: ImageGridProps["onImageLoad"];
  onImageError?: ImageGridProps["onImageError"];
};

export function ImageCarousel({
  images = [],
  autoplay = true,
  intervalMs = 2500,
  motion = "auto",
  value,
  defaultValue,
  onValueChange,
  fit = "cover",
  ariaLabel = "Image carousel",
  onImageLoad,
  onImageError}: ImageCarouselProps) {
  const [index, setIndex] = useFrameValue({ length: images.length, value, defaultValue, onValueChange });
  const [paused, setPaused] = React.useState(false);
  const [interacting, setInteracting] = React.useState(false);
  const [viewportRef, viewportVisible] = useElementVisible<HTMLElement>();
  const reduceMotion = usePrefersReducedMotion();
  useMotionInterval(
    () => setIndex((current) => (current + 1) % Math.max(images.length, 1)),
    intervalMs,
    { enabled: autoplay && !paused && !interacting && motion !== "off" && viewportVisible && images.length > 1 },
  );

  if (!images.length) return <ChartEmpty label="No images" />;

  const visibleIndex = Math.min(index, images.length - 1);
  const previous = () => setIndex((current) => (current - 1 + images.length) % images.length);
  const next = () => setIndex((current) => (current + 1) % images.length);

  return (
    <Shell>
      <section
        ref={viewportRef}
        className="relative h-full w-full p-2"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={() => setInteracting(true)}
        onMouseLeave={() => setInteracting(false)}
        onFocus={() => setInteracting(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false);
        }}
      >
        {images.map((image, imageIndex) => (
          <figure
            key={image.id ?? `${image.src}-${imageIndex}`}
            className={cn(
              "absolute inset-2 overflow-hidden rounded-lg border border-[var(--chart-grid)] bg-muted transition-opacity duration-500",
              (motion === "off" || reduceMotion) && "transition-none",
              imageIndex === visibleIndex ? "opacity-100" : "pointer-events-none opacity-0",
            )}
            aria-hidden={imageIndex !== visibleIndex}
          >
            <ChartImageMedia image={image} index={imageIndex} fit={fit} active={imageIndex === visibleIndex} onLoad={onImageLoad} onError={onImageError} />
            {image.caption ? <figcaption className="absolute inset-x-0 bottom-0 bg-card/90 px-3 py-2 text-xs">{image.caption}</figcaption> : null}
          </figure>
        ))}
        {images.length > 1 ? (
          <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-2">
            <button type="button" onClick={previous} className="inline-flex min-h-11 items-center rounded-md border border-border bg-card/95 px-3 text-xs font-medium" aria-label="Previous image">Previous</button>
            <p role="status" aria-live="polite" className="rounded-[var(--radius-sm)] bg-card/95 px-2 py-1 text-xs tabular-nums">{visibleIndex + 1} / {images.length}</p>
            <button type="button" onClick={next} className="inline-flex min-h-11 items-center rounded-md border border-border bg-card/95 px-3 text-xs font-medium" aria-label="Next image">Next</button>
            {autoplay ? (
              <button type="button" onClick={() => setPaused((current) => !current)} disabled={motion === "off" || reduceMotion} className="inline-flex min-h-11 items-center rounded-md border border-border bg-card/95 px-3 text-xs font-medium disabled:opacity-50" aria-pressed={paused}>
                {motion === "off" || reduceMotion ? "Motion off" : paused ? "Play" : "Pause"}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </Shell>
  );
}
