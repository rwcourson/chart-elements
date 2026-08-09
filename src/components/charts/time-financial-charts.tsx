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
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, colorAt, SEMANTIC } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import {
  calendarHeat,
  kpiMetrics,
  ohlc,
  salesByRegion,
  stackedSeries,
  timeSeries,
  waterfallData,
  words,
} from "@/lib/sample-data";
import { cn, formatCompact, formatPercent } from "@/lib/utils";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip } from "./chart-tooltip";
import { WaterfallChart } from "./waterfall-chart";

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
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} stackOffset="wiggle">
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
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeOpacity={hover.opacityFor(k)}
              fill={colorAt(i)}
              fillOpacity={0.55 * hover.opacityFor(k)}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...anim}
              {...hover.bind(k)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
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
  bands = 4,
}: {
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
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="stepAfter" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2.25} strokeLinecap="round" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} />
        </LineChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function SplineChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[1]} strokeWidth={2.25} strokeLinecap="round" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} />
        </LineChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function RangeAreaChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();
  const shaped = data.map((d) => ({
    date: d.date,
    low: d.cost,
    high: d.revenue,
    mid: (d.cost + d.revenue) / 2,
  }));

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={shaped} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="high" stroke="none" fill={CHART_COLORS[2]} fillOpacity={0.15} {...anim} />
          <Area type="monotone" dataKey="low" stroke="none" fill="var(--background)" {...anim} />
          <Line type="monotone" dataKey="mid" stroke={CHART_COLORS[2]} strokeWidth={2.25} strokeLinecap="round" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} />
        </AreaChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function BandChart(props: React.ComponentProps<typeof RangeAreaChart>) {
  return <RangeAreaChart {...props} />;
}

export function FanChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();
  const shaped = data.map((d, i) => ({
    date: d.date,
    base: d.forecast,
    p10: d.forecast * 0.88,
    p50: d.forecast,
    p90: d.forecast * 1.12 + i * 20,
  }));

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={shaped} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="p90" stroke="none" fill={CHART_COLORS[3]} fillOpacity={0.1} {...anim} />
          <Area type="monotone" dataKey="p10" stroke="none" fill="var(--background)" {...anim} />
          <Line type="monotone" dataKey="p50" stroke={CHART_COLORS[3]} strokeWidth={2.25} strokeLinecap="round" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} />
        </AreaChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function ConfidenceIntervalChart(props: React.ComponentProps<typeof FanChart>) {
  return <FanChart {...props} />;
}

export function CandlestickChart({ data = ohlc }: { data?: typeof ohlc }) {
  const width = 400;
  const height = 220;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleLinear().domain([d3.min(data, (d) => d.low) ?? 0, d3.max(data, (d) => d.high) ?? 1]).range([h, 0]);
  const x = d3.scaleBand().domain(data.map((d) => d.date)).range([0, w]).padding(0.35);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${pad.l},${pad.t})`}>
          {data.map((d) => {
            const cx = (x(d.date) ?? 0) + x.bandwidth() / 2;
            const up = d.close >= d.open;
            const color = up ? SEMANTIC.positive : SEMANTIC.negative;
            const bodyTop = y(Math.max(d.open, d.close));
            const bodyBot = y(Math.min(d.open, d.close));
            return (
              <g key={d.date}>
                <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} stroke={color} strokeWidth={1} />
                <rect x={cx - x.bandwidth() * 0.25} y={bodyTop} width={x.bandwidth() * 0.5} height={Math.max(2, bodyBot - bodyTop)} fill={color} />
              </g>
            );
          })}
        </g>
      </svg>
    </Shell>
  );
}

export function OHLCChart({ data = ohlc }: { data?: typeof ohlc }) {
  const width = 400;
  const height = 220;
  const pad = { l: 36, r: 12, t: 12, b: 28 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const y = d3.scaleLinear().domain([d3.min(data, (d) => d.low) ?? 0, d3.max(data, (d) => d.high) ?? 1]).range([h, 0]);
  const x = d3.scaleBand().domain(data.map((d) => d.date)).range([0, w]).padding(0.35);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${pad.l},${pad.t})`}>
          {data.map((d, i) => {
            const cx = (x(d.date) ?? 0) + x.bandwidth() / 2;
            const tick = x.bandwidth() * 0.2;
            return (
              <g key={d.date} stroke={colorAt(i)}>
                <line x1={cx} x2={cx} y1={y(d.high)} y2={y(d.low)} strokeWidth={1.5} />
                <line x1={cx - tick} x2={cx} y1={y(d.open)} y2={y(d.open)} strokeWidth={2} />
                <line x1={cx} x2={cx + tick} y1={y(d.close)} y2={y(d.close)} strokeWidth={2} />
              </g>
            );
          })}
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
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.map((d) => ({ date: d.date, volume: d.high - d.low }))} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
            <defs>
              {/* Depth without color math: the fill eases to 82% opacity toward
                  the baseline, which reads as a soft top light on both themes. */}
              <linearGradient id={`vol-${uid}-0`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[5]} stopOpacity={1} />
                <stop offset="100%" stopColor={CHART_COLORS[5]} stopOpacity={0.82} />
              </linearGradient>
            </defs>
            <Bar dataKey="volume" fill={`url(#vol-${uid}-0)`} radius={[2, 2, 0, 0]} maxBarSize={16} {...anim} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Shell>
  );
}

export function RenkoChart({ data = ohlc }: { data?: typeof ohlc }) {
  const bricks = data.flatMap((d, i) => [
    { x: i * 2, y: d.open, up: d.close >= d.open },
    { x: i * 2 + 1, y: d.close, up: d.close >= d.open },
  ]);
  const width = 400;
  const height = 160;
  const pad = 24;
  const y = d3.scaleLinear().domain([d3.min(bricks, (b) => b.y) ?? 0, d3.max(bricks, (b) => b.y) ?? 1]).range([height - pad, pad]);
  const x = d3.scaleLinear().domain([0, bricks.length]).range([pad, width - pad]);
  const brickW = (width - pad * 2) / (bricks.length || 1) - 2;

  if (bricks.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {bricks.map((b, i) => (
          <rect
            key={i}
            x={x(b.x)}
            y={y(b.y) - 8}
            width={brickW}
            height={16}
            fill={b.up ? SEMANTIC.positive : SEMANTIC.negative}
            rx={1}
          />
        ))}
      </svg>
    </Shell>
  );
}

export function KagiChart({ data = ohlc }: { data?: typeof ohlc }) {
  const width = 400;
  const height = 160;
  const pad = 24;
  const closes = data.map((d) => d.close);
  const y = d3.scaleLinear().domain([d3.min(closes) ?? 0, d3.max(closes) ?? 1]).range([height - pad, pad]);
  const x = d3.scaleLinear().domain([0, data.length - 1]).range([pad, width - pad]);
  const thick = closes.map((c, i) => c >= (closes[i - 1] ?? c));

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <path
          d={data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.close)}`).join("")}
          fill="none"
          stroke={CHART_COLORS[0]}
          strokeWidth={3}
        />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.close)} r={thick[i] ? 4 : 2} fill={thick[i] ? SEMANTIC.positive : SEMANTIC.negative} />
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
  // Pure cumulative scan (no mutation after render).
  const shaped = sorted.map((d, i) => ({
    name: d.name,
    sales: d.sales,
    cumulative:
      sorted.slice(0, i + 1).reduce((sum, r) => sum + r.sales, 0) / total,
  }));

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={shaped} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
          <Bar yAxisId="l" dataKey="sales" fill={`url(#pareto-${uid}-0)`} fillOpacity={hover.opacityFor("sales")} radius={[4, 4, 0, 0]} maxBarSize={32} {...anim} {...hover.bind("sales")} />
          <Line yAxisId="r" type="monotone" dataKey="cumulative" stroke={CHART_COLORS[2]} strokeWidth={2.25} strokeLinecap="round" strokeOpacity={hover.opacityFor("cumulative")} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} {...hover.bind("cumulative")} />
        </ComposedChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function ControlChart({ data = timeSeries }: { data?: typeof timeSeries }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const mean = d3.mean(data, (d) => d.revenue) ?? 0;
  const shaped = data.map((d) => ({
    date: d.date,
    value: d.revenue,
    mean,
    ucl: mean * 1.08,
    lcl: mean * 0.92,
  }));

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={shaped} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltip />} />
          {/* Limit/center lines are reference marks, so they keep their thin
              dashed strokes; only the data line takes the full curve treatment. */}
          <Line type="monotone" dataKey="ucl" stroke={SEMANTIC.warning} strokeDasharray="4 4" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("ucl")} {...anim} {...hover.bind("ucl")} />
          <Line type="monotone" dataKey="lcl" stroke={SEMANTIC.warning} strokeDasharray="4 4" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("lcl")} {...anim} {...hover.bind("lcl")} />
          <Line type="monotone" dataKey="mean" stroke={SEMANTIC.neutral} strokeDasharray="2 2" dot={false} strokeWidth={1} strokeOpacity={hover.opacityFor("mean")} {...anim} {...hover.bind("mean")} />
          <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2.25} strokeLinecap="round" strokeOpacity={hover.opacityFor("value")} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} {...hover.bind("value")} />
        </ComposedChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function SPCChart(props: React.ComponentProps<typeof ControlChart>) {
  return <ControlChart {...props} />;
}

export function RunChart(props: React.ComponentProps<typeof StepChart>) {
  return <StepChart {...props} />;
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

type CloudWord = { key: string; text: string; size: number; width: number; tier: number };
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
    maxSize: entries.reduce((t, w) => Math.max(t, w.size), 0),
  };
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
    .filter((d) => d.text.trim().length > 0)
    .sort((a, b) => b.value - a.value || a.i - b.i);
  if (ranked.length === 0) return [];

  const hi = ranked[0]!.value;
  const lo = ranked[ranked.length - 1]!.value;
  const span = hi - lo || 1;
  const perTier = Math.ceil(ranked.length / CLOUD_TIERS);

  const pack = (scale: number, floor: number): CloudLayout => {
    const sized: CloudWord[] = ranked.map((w, rank) => {
      const size = Math.max(floor, (11 + Math.pow((w.value - lo) / span, 0.85) * 19) * scale);
      return {
        key: `${w.text}-${w.i}`,
        text: w.text,
        size,
        width: wordWidth(w.text, size),
        tier: Math.min(CLOUD_TIERS - 1, Math.floor(rank / perTier)),
      };
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
      maxWidth: balanced.reduce((t, r) => Math.max(t, rowWidth(r)), 0),
    };
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
      maxWidth: rows.reduce((t, r) => Math.max(t, rowWidth(r)), 0),
    };
  }

  const placed: CloudPlacement[] = [];
  let top = CLOUD_PAD + (boxH - layout.height) / 2;
  for (const row of layout.rows) {
    const baseline = top + TEXT_ASCENT * row.maxSize;
    const gap = rowGap(row);
    let cursor = CLOUD_PAD + (boxW - rowWidth(row)) / 2;
    for (const w of row.words) {
      placed.push({ key: w.key, text: w.text, size: w.size, tier: w.tier, x: cursor + w.width / 2, y: baseline });
      cursor += w.width + gap;
    }
    top += rowHeight(row) + CLOUD_LEAD;
  }
  return placed;
}

export function WordCloud({ data = words }: { data?: typeof words }) {
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
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
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
    </Shell>
  );
}

export function TagCloud(props: React.ComponentProps<typeof WordCloud>) {
  return <WordCloud {...props} />;
}

export function CalendarHeatmap({ data = calendarHeat }: { data?: typeof calendarHeat }) {
  const cols = 12;
  const rows = Math.ceil(data.length / cols) || 1;
  const width = 400;
  const height = 200;
  const cellW = (width - 24) / cols;
  const cellH = (height - 24) / rows;
  const max = d3.max(data, (d) => d.value) ?? 1;

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          return (
            <rect
              key={d.day}
              x={12 + col * cellW}
              y={12 + row * cellH}
              width={cellW - 2}
              height={cellH - 2}
              rx={2}
              fill={CHART_COLORS[0]}
              fillOpacity={0.12 + (d.value / max) * 0.88}
            />
          );
        })}
      </svg>
    </Shell>
  );
}

export function CalendarVisual(props: React.ComponentProps<typeof CalendarHeatmap>) {
  return <CalendarHeatmap {...props} />;
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
  return <KPITicker metrics={metrics} />;
}

export function ScrollingText({ items = words.map((w) => w.text) }: { items?: string[] }) {
  const [offset, setOffset] = React.useState(0);
  React.useEffect(() => {
    if (items.length === 0) return;
    const id = setInterval(() => setOffset((o) => (o + 1) % (items.length || 1)), 2000);
    return () => clearInterval(id);
  }, [items.length]);

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
      <div className="flex h-full w-full items-center justify-center gap-3 text-sm text-muted-foreground">
        {visible.map((t, i) => (
          <span key={`${t}-${i}`} className="rounded-full border border-[var(--chart-grid)] px-3 py-1" style={{ color: colorAt(i) }}>
            {t}
          </span>
        ))}
      </div>
    </Shell>
  );
}

export function AnimatedBarRace({ data = salesByRegion }: { data?: typeof salesByRegion }) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    if (data.length === 0) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % (data.length || 1)), 1200);
    return () => clearInterval(id);
  }, [data.length]);

  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  const shaped = data.map((d, i) => ({
    name: d.name,
    value: d.sales * (0.6 + ((i + frame) % (data.length || 1)) / (data.length || 1) * 0.5),
  })).sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shaped} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            {shaped.map((_, i) => (
              // Depth without color math: the fill eases to 82% opacity toward
              // the baseline, which reads as a soft top light on both themes.
              <linearGradient key={i} id={`race-${uid}-${i}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={colorAt(i)} stopOpacity={1} />
                <stop offset="100%" stopColor={colorAt(i)} stopOpacity={0.82} />
              </linearGradient>
            ))}
          </defs>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={64} tickLine={false} axisLine={false} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18} {...anim}>
            {shaped.map((d, i) => (
              <Cell key={i} fill={`url(#race-${uid}-${i})`} fillOpacity={hover.opacityFor(d.name)} {...hover.bind(d.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function AnimatedScatter({ data = timeSeries }: { data?: typeof timeSeries }) {
  const [frame, setFrame] = React.useState(0);
  React.useEffect(() => {
    if (data.length === 0) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % (data.length || 1)), 900);
    return () => clearInterval(id);
  }, [data.length]);

  const anim = useChartAnimation();

  const points = data.map((d, i) => ({
    x: i * 12 + 20,
    y: d.revenue / 80 + (i <= frame ? 0 : -20),
    name: d.date,
  }));

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="x" tickLine={false} axisLine={false} />
          <YAxis type="number" dataKey="y" tickLine={false} axisLine={false} width={36} />
          <Scatter data={points} fill={CHART_COLORS[4]} {...anim}>
            {points.map((_, i) => (
              <Cell key={i} fill={i <= frame ? colorAt(i) : "var(--chart-grid)"} />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function AnimatedTimeline({ data = timeSeries }: { data?: typeof timeSeries }) {
  const [frame, setFrame] = React.useState(1);
  React.useEffect(() => {
    if (data.length === 0) return;
    const id = setInterval(() => setFrame((f) => (f >= data.length ? 1 : f + 1)), 800);
    return () => clearInterval(id);
  }, [data.length]);

  const anim = useChartAnimation();

  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.slice(0, frame)} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={40} />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2.25} strokeLinecap="round" dot={false} activeDot={{ r: 4, strokeWidth: 0 }} {...anim} />
        </LineChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function ImageGrid({ count = 6 }: { count?: number }) {
  return (
    <Shell>
      <div className="grid h-full w-full grid-cols-3 gap-2 p-2">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="rounded-md"
            style={{
              background: `linear-gradient(135deg, ${colorAt(i)} 0%, ${colorAt(i + 2)} 100%)`,
              opacity: 0.65,
            }}
          />
        ))}
      </div>
    </Shell>
  );
}

export function ImageCarousel({ count = 4 }: { count?: number }) {
  const [index, setIndex] = React.useState(0);
  React.useEffect(() => {
    if (count <= 0) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % (count || 1)), 2500);
    return () => clearInterval(id);
  }, [count]);

  if (count <= 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="relative h-full w-full p-2">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-2 rounded-lg transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: `linear-gradient(160deg, ${colorAt(i)} 0%, ${colorAt(i + 3)} 100%)`,
            }}
          />
        ))}
      </div>
    </Shell>
  );
}
