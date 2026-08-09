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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS, colorAt, SEMANTIC } from "@/lib/chart-colors";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { salesByRegion, stackedSeries } from "@/lib/sample-data";
import { formatCompact, formatPercent } from "@/lib/utils";
import { ChartEmpty } from "./chart-frame";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full [&_.recharts-cartesian-grid_line]:stroke-[var(--chart-grid)]">
      {children}
    </div>
  );
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

const defaultRadar = [
  { metric: "Speed", current: 78, target: 62 },
  { metric: "Quality", current: 85, target: 70 },
  { metric: "Cost", current: 64, target: 82 },
  { metric: "Support", current: 72, target: 68 },
  { metric: "Scale", current: 88, target: 74 },
];

const defaultRose = [
  { name: "Q1", value: 32 },
  { name: "Q2", value: 48 },
  { name: "Q3", value: 38 },
  { name: "Q4", value: 54 },
  { name: "Q5", value: 42 },
  { name: "Q6", value: 36 },
];

const defaultLollipop = salesByRegion.map((r) => ({ name: r.name, value: r.sales }));

const defaultDumbbell = [
  { name: "North", start: 380, end: 420 },
  { name: "South", start: 340, end: 380 },
  { name: "East", start: 470, end: 510 },
  { name: "West", start: 250, end: 290 },
];

const defaultSlope = [
  { name: "A", y2024: 42, y2025: 58 },
  { name: "B", y2024: 55, y2025: 52 },
  { name: "C", y2024: 38, y2025: 64 },
  { name: "D", y2024: 48, y2025: 46 },
];

const defaultBump = stackedSeries.map((row, i) => ({
  period: row.name,
  product: 4 - (i % 4),
  service: 2 + (i % 3),
  other: 1 + (i % 2),
}));

const defaultLikert = [
  { topic: "UX", disagree: -18, neutral: 22, agree: 60 },
  { topic: "Price", disagree: -28, neutral: 30, agree: 42 },
  { topic: "Support", disagree: -12, neutral: 18, agree: 70 },
  { topic: "Features", disagree: -8, neutral: 24, agree: 68 },
];

const defaultWaffle = { total: 100, value: 64, label: "Satisfied" };

const defaultParallel = stackedSeries.map((r) => ({
  name: r.name,
  product: r.product,
  service: r.service,
  other: r.other,
}));

function PolarRoseSvg({ data = defaultRose }: { data?: typeof defaultRose }) {
  const width = 400;
  const height = 220;
  const cx = width / 2;
  const cy = height / 2 + 8;
  const maxR = 80;
  const max = d3.max(data, (d) => d.value) ?? 1;
  const angle = (2 * Math.PI) / (data.length || 1);

  if (data.length === 0) return <ChartEmpty />;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
      <g transform={`translate(${cx},${cy})`}>
        {data.map((d, i) => {
          const a0 = i * angle - Math.PI / 2;
          const a1 = a0 + angle;
          const r = (d.value / max) * maxR;
          const x0 = Math.cos(a0) * r;
          const y0 = Math.sin(a0) * r;
          const x1 = Math.cos(a1) * r;
          const y1 = Math.sin(a1) * r;
          return (
            <path
              key={d.name}
              d={`M0,0L${x0},${y0}A${r},${r},0,0,1,${x1},${y1}Z`}
              fill={colorAt(i)}
              fillOpacity={0.55}
              stroke={colorAt(i)}
              strokeWidth={0.5}
            />
          );
        })}
      </g>
    </svg>
  );
}

export function RadarChart({ data = defaultRadar, keys = ["current", "target"] as const }: {
  data?: typeof defaultRadar;
  keys?: readonly string[];
}) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} margin={{ top: 8, right: 24, left: 24, bottom: 8 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--chart-axis)", fontSize: 10 }} />
          {/* Radius ticks are rotated 90° by default, so they stacked on top of
              each other along one spoke and sat on the filled web. The grid
              rings carry the scale; exact values come from the tooltip. */}
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Tooltip content={<ChartTooltip />} />
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
          {keys.map((k, i) => (
            <Radar
              key={k}
              name={k}
              dataKey={k}
              stroke={colorAt(i)}
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeOpacity={hover.opacityFor(k)}
              fill={colorAt(i)}
              fillOpacity={0.2 * hover.opacityFor(k)}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...anim}
              {...hover.bind(k)}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function SpiderChart(props: React.ComponentProps<typeof RadarChart>) {
  return <RadarChart {...props} />;
}

export function PolarChart({ data = defaultRose }: { data?: typeof defaultRose }) {
  return (
    <Shell>
      <PolarRoseSvg data={data} />
    </Shell>
  );
}

export function RoseChart(props: React.ComponentProps<typeof PolarChart>) {
  return <PolarChart {...props} />;
}

export function CoxcombChart(props: React.ComponentProps<typeof PolarChart>) {
  return <PolarChart {...props} />;
}

export function NightingaleRose(props: React.ComponentProps<typeof PolarChart>) {
  return <PolarChart {...props} />;
}

export function PolarAreaChart(props: React.ComponentProps<typeof PolarChart>) {
  return <PolarChart {...props} />;
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

export function ConnectedDotPlot({ data = defaultSlope }: { data?: typeof defaultSlope }) {
  return <SlopeChart data={data} />;
}

export function SlopeChart({ data = defaultSlope }: { data?: typeof defaultSlope }) {
  const width = 400;
  const height = 220;
  const pad = { l: 48, r: 48, t: 20, b: 28 };
  const h = height - pad.t - pad.b;
  const vals = data.flatMap((d) => [d.y2024, d.y2025]);
  const y = d3.scaleLinear().domain([d3.min(vals) ?? 0, d3.max(vals) ?? 1]).range([h, 0]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <text x={pad.l} y={14} textAnchor="middle" className="fill-[var(--chart-axis)] text-[9px]">2024</text>
        <text x={width - pad.r} y={14} textAnchor="middle" className="fill-[var(--chart-axis)] text-[9px]">2025</text>
        <g transform={`translate(0,${pad.t})`}>
          {data.map((d, i) => (
            <g key={d.name}>
              <line x1={pad.l} x2={width - pad.r} y1={y(d.y2024)} y2={y(d.y2025)} stroke={colorAt(i)} strokeWidth={2} />
              <circle cx={pad.l} cy={y(d.y2024)} r={4} fill={colorAt(i)} />
              <circle cx={width - pad.r} cy={y(d.y2025)} r={4} fill={colorAt(i)} />
              <text x={pad.l - 8} y={y(d.y2024) + 3} textAnchor="end" className="fill-[var(--chart-axis)] text-[8px]">{d.name}</text>
            </g>
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function BumpChart({ data = defaultBump }: { data?: typeof defaultBump }) {
  const keys = ["product", "service", "other"] as const;
  const width = 400;
  const height = 220;
  const pad = { l: 32, r: 12, t: 16, b: 28 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const x = d3.scalePoint().domain(data.map((d) => d.period)).range([0, w]);
  const y = d3.scaleLinear().domain([1, 4]).range([h, 0]);

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        <g transform={`translate(${pad.l},${pad.t})`}>
          {keys.map((k, ki) => (
            <path
              key={k}
              d={data.map((d, i) => `${i === 0 ? "M" : "L"}${x(d.period)},${y(Number(d[k]))}`).join("")}
              fill="none"
              stroke={colorAt(ki)}
              strokeWidth={2}
            />
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function ButterflyChart({ data = salesByRegion }: { data?: typeof salesByRegion }) {
  const shaped = data.map((d) => ({ name: d.name, left: -d.target, right: d.sales }));
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={shaped} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 0 }} stackOffset="sign">
          <BarGradients uid={uid} colors={[SEMANTIC.negative, SEMANTIC.positive]} />
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" width={56} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip valueFormatter={(n) => formatCompact(Math.abs(n))} />} />
          <Bar
            dataKey="left"
            stackId="b"
            fill={`url(#polar-${uid}-0)`}
            fillOpacity={hover.opacityFor("left")}
            radius={[4, 0, 0, 4]}
            {...anim}
            {...hover.bind("left")}
          />
          <Bar
            dataKey="right"
            stackId="b"
            fill={`url(#polar-${uid}-1)`}
            fillOpacity={hover.opacityFor("right")}
            radius={[0, 4, 4, 0]}
            {...anim}
            {...hover.bind("right")}
          />
        </BarChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function TornadoChart(props: React.ComponentProps<typeof ButterflyChart>) {
  return <ButterflyChart {...props} />;
}

export function PopulationPyramid() {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const male = [
    { age: "0-9", value: -22 },
    { age: "10-19", value: -18 },
    { age: "20-29", value: -24 },
    { age: "30-39", value: -20 },
    { age: "40-49", value: -16 },
  ];
  const female = [
    { age: "0-9", value: 21 },
    { age: "10-19", value: 17 },
    { age: "20-29", value: 23 },
    { age: "30-39", value: 19 },
    { age: "40-49", value: 15 },
  ];
  const data = male.map((m, i) => ({ age: m.age, male: m.value, female: female[i]?.value ?? 0 }));

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
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 12, left: 0, bottom: 0 }} stackOffset="sign">
          <BarGradients uid={uid} colors={[CHART_COLORS[1], CHART_COLORS[4]]} />
          <CartesianGrid horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(Math.abs(Number(v)))} />
          <YAxis type="category" dataKey="age" width={48} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip valueFormatter={(n) => formatCompact(Math.abs(n))} />} />
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
          <Bar
            dataKey="male"
            stackId="p"
            fill={`url(#polar-${uid}-0)`}
            fillOpacity={hover.opacityFor("male")}
            {...anim}
            {...hover.bind("male")}
          />
          <Bar
            dataKey="female"
            stackId="p"
            fill={`url(#polar-${uid}-1)`}
            fillOpacity={hover.opacityFor("female")}
            {...anim}
            {...hover.bind("female")}
          />
        </BarChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function DivergingBarChart({ data = defaultLikert }: { data?: typeof defaultLikert }) {
  const anim = useChartAnimation();
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");

  if (!data.length) {
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
  const lo = Math.min(0, ...data.map((d) => d.disagree));
  const hi = Math.max(0, ...data.map((d) => d.neutral + d.agree));
  const from = Math.floor(lo / step) * step;
  const to = Math.ceil(hi / step) * step;
  const ticks = Array.from(
    { length: Math.round((to - from) / step) + 1 },
    (_, i) => from + i * step,
  );

  return (
    <Shell>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 0, bottom: 0 }} stackOffset="sign">
          <BarGradients uid={uid} colors={[SEMANTIC.negative, SEMANTIC.neutral, SEMANTIC.positive]} />
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[from, to]}
            ticks={ticks}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${Math.abs(Number(v))}%`}
          />
          <YAxis type="category" dataKey="topic" width={64} tickLine={false} axisLine={false} />
          <Tooltip content={<ChartTooltip valueFormatter={(n) => `${Math.abs(n)}%`} />} />
          {/* Three unlabelled colours are not readable on their own. */}
          <Legend
            iconType="circle"
            formatter={legendLabel}
            {...hover.legendHandlers}
          />
          <Bar
            dataKey="disagree"
            stackId="d"
            fill={`url(#polar-${uid}-0)`}
            fillOpacity={hover.opacityFor("disagree")}
            {...anim}
            {...hover.bind("disagree")}
          />
          <Bar
            dataKey="neutral"
            stackId="d"
            fill={`url(#polar-${uid}-1)`}
            fillOpacity={hover.opacityFor("neutral")}
            {...anim}
            {...hover.bind("neutral")}
          />
          <Bar
            dataKey="agree"
            stackId="d"
            fill={`url(#polar-${uid}-2)`}
            fillOpacity={hover.opacityFor("agree")}
            {...anim}
            {...hover.bind("agree")}
          />
        </BarChart>
      </ResponsiveContainer>
    </Shell>
  );
}

export function LikertChart(props: React.ComponentProps<typeof DivergingBarChart>) {
  return <DivergingBarChart {...props} />;
}

export function WaffleChart({ total = defaultWaffle.total, value = defaultWaffle.value, label = defaultWaffle.label }: {
  total?: number;
  value?: number;
  label?: string;
}) {
  const cols = 10;
  const safeTotal = total || 1;
  const filled = Math.round((value / safeTotal) * total);

  if (total <= 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-sm"
              style={{
                background: i < filled ? CHART_COLORS[0] : "var(--chart-grid)",
              }}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          {label}: {formatPercent(value / safeTotal, 0)}
        </div>
      </div>
    </Shell>
  );
}

export function PictogramChart({ count = 10, filled = 7 }: { count?: number; filled?: number }) {
  return (
    <Shell>
      <div className="flex h-full w-full items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-medium"
            style={{
              background: i < filled ? colorAt(i % 5) : "var(--chart-grid)",
              color: i < filled ? "var(--chart-label)" : "var(--chart-axis)",
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </Shell>
  );
}

export function IconArray(props: React.ComponentProps<typeof PictogramChart>) {
  return <PictogramChart {...props} />;
}

export function MekkoChart({ data = salesByRegion }: { data?: typeof salesByRegion }) {
  const width = 400;
  const height = 120;
  const total = d3.sum(data, (d) => d.sales) || 1;

  // Precompute cumulative offsets so nothing mutates during render.
  const columns = data.map((d, i) => {
    const w = (d.sales / total) * width;
    const x = data
      .slice(0, i)
      .reduce((sum, prev) => sum + (prev.sales / total) * width, 0);
    return { ...d, x, w };
  });

  if (columns.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {columns.map((d, i) => (
          <rect
            key={d.name}
            x={d.x}
            y={0}
            width={d.w}
            height={height * (d.profit / 200)}
            fill={colorAt(i)}
            rx={2}
          />
        ))}
      </svg>
    </Shell>
  );
}

export function MarimekkoChart(props: React.ComponentProps<typeof MekkoChart>) {
  return <MekkoChart {...props} />;
}

export function MosaicPlot({ data = stackedSeries }: { data?: typeof stackedSeries }) {
  const width = 400;
  const height = 220;
  const keys = ["product", "service", "other"] as const;
  const totals = data.map((r) => keys.reduce((s, k) => s + Number(r[k]), 0) || 1);
  const totalAll = d3.sum(totals) || 1;

  // Precompute column x offsets and cell y offsets (no render-time mutation).
  const columns = data.map((row, ri) => {
    const colW = (totals[ri]! / totalAll) * width;
    const x = totals
      .slice(0, ri)
      .reduce((sum, t) => sum + (t / totalAll) * width, 0);
    const cells = keys.map((k, ki) => {
      const h = (Number(row[k]) / totals[ri]!) * height;
      const y = keys
        .slice(0, ki)
        .reduce((sum, pk) => sum + (Number(row[pk]) / totals[ri]!) * height, 0);
      return { key: k, y, h, ki };
    });
    return { name: row.name, x, colW, cells };
  });

  if (columns.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {columns.map((col) => (
          <g key={col.name}>
            {col.cells.map((cell) => (
              <rect
                key={cell.key}
                x={col.x}
                y={cell.y}
                width={col.colW}
                height={cell.h}
                fill={colorAt(cell.ki)}
                fillOpacity={0.75}
                stroke="var(--background)"
              />
            ))}
          </g>
        ))}
      </svg>
    </Shell>
  );
}

export function ParallelCoordinates({ data = defaultParallel }: { data?: typeof defaultParallel }) {
  const keys = ["product", "service", "other"] as const;
  const width = 400;
  const height = 220;
  const pad = { l: 24, r: 12, t: 12, b: 24 };
  const w = width - pad.l - pad.r;
  const h = height - pad.t - pad.b;
  const x = d3.scalePoint().domain(keys).range([0, w]);
  const extents = keys.map((k) => d3.extent(data, (d) => Number(d[k])) as [number, number]);
  const y = keys.map((k, i) =>
    d3.scaleLinear().domain(extents[i] ?? [0, 1]).range([h, 0]),
  );

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
        <g transform={`translate(${pad.l},${pad.t})`}>
          {keys.map((k) => (
            <line key={k} x1={x(k)!} x2={x(k)!} y1={0} y2={h} stroke="var(--chart-axis)" strokeWidth={1} />
          ))}
          {data.map((row, ri) => (
            <path
              key={ri}
              d={keys.map((k, i) => `${i === 0 ? "M" : "L"}${x(k)},${y[i]!(Number(row[k]))}`).join("")}
              fill="none"
              stroke={colorAt(ri)}
              strokeOpacity={0.55}
              strokeWidth={1.5}
            />
          ))}
        </g>
      </svg>
    </Shell>
  );
}

export function ParallelSets() {
  const width = 400;
  const height = 220;
  const bands = [
    { x: 60, flows: [0.5, 0.3, 0.2] },
    { x: 200, flows: [0.4, 0.35, 0.25] },
    { x: 340, flows: [0.45, 0.3, 0.25] },
  ];

  return (
    <Shell>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {bands.flatMap((b, bi) =>
          b.flows.map((f, fi) => {
            const y0 = 30 + fi * 50;
            const next = bands[bi + 1];
            if (!next) return null;
            const ty = 30 + fi * 50;
            return (
              <path
                key={`${bi}-${fi}`}
                d={`M${b.x},${y0}C${(b.x + next.x) / 2},${y0} ${(b.x + next.x) / 2},${ty} ${next.x},${ty}`}
                fill="none"
                stroke={colorAt(fi)}
                strokeOpacity={0.35}
                strokeWidth={f * 40}
              />
            );
          }),
        )}
      </svg>
    </Shell>
  );
}

type TernaryPoint = { a: number; b: number; c: number; group?: number };

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
}: {
  data?: TernaryPoint[];
  labels?: { a: string; b: string; c: string };
}) {
  if (data.length === 0) {
    return (
      <Shell>
        <ChartEmpty />
      </Shell>
    );
  }

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
      y: aa * A.y + bb * B.y + cc * C.y,
    };
  };

  const gridLevels = [0.25, 0.5, 0.75];
  const gridLines = gridLevels.flatMap((t) => [
    // constant a (parallel to BC), constant b (∥ AC), constant c (∥ AB)
    [project(t, 1 - t, 0), project(t, 0, 1 - t)],
    [project(1 - t, t, 0), project(0, t, 1 - t)],
    [project(1 - t, 0, t), project(0, 1 - t, t)],
  ]);

  const points = data.map((d, i) => ({ ...project(d.a, d.b, d.c), i, group: d.group ?? i % 6 }));

  return (
    <Shell>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
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
        {points.map((p) => (
          <circle
            key={p.i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={colorAt(p.group)}
            fillOpacity={0.9}
            stroke={colorAt(p.group)}
            strokeWidth={1}
          />
        ))}
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
    </Shell>
  );
}
