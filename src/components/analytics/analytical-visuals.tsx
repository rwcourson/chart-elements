"use client";

import * as React from "react";
import {
  AlertTriangle,
  Bot,
  ChevronDown,
  ChevronRight,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn, formatCompact, formatPercent } from "@/lib/utils";
import { CHART_COLORS, SEMANTIC } from "@/lib/chart-colors";
import { timeSeries } from "@/lib/sample-data";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TreeNode = {
  label: string;
  value: number;
  children?: TreeNode[];
};

const defaultTree: TreeNode = {
  label: "Total Revenue",
  value: 2_840_000,
  children: [
    {
      label: "Product",
      value: 1_920_000,
      children: [
        { label: "Hardware", value: 980_000 },
        { label: "Software", value: 640_000 },
        { label: "Accessories", value: 300_000 },
      ],
    },
    {
      label: "Services",
      value: 920_000,
      children: [
        { label: "Support", value: 520_000 },
        { label: "Consulting", value: 400_000 },
      ],
    },
  ],
};

const defaultInfluencers = [
  { factor: "Discount rate", impact: 0.42, direction: "up" as const },
  { factor: "Lead time", impact: 0.31, direction: "down" as const },
  { factor: "Region", impact: 0.24, direction: "up" as const },
  { factor: "Channel", impact: 0.18, direction: "up" as const },
  { factor: "Rep tenure", impact: 0.12, direction: "down" as const },
];

const defaultSegments = [
  { segment: "Enterprise · West", value: 1_240_000, share: 0.28, delta: 0.12 },
  { segment: "Mid-market · East", value: 980_000, share: 0.22, delta: 0.08 },
  { segment: "SMB · Central", value: 760_000, share: 0.17, delta: -0.03 },
  { segment: "Consumer · South", value: 540_000, share: 0.12, delta: 0.05 },
];

const defaultAnomalies = timeSeries.map((row, i) => ({
  ...row,
  anomaly: i === 3 || i === 6,
}));

const defaultMapRegions = [
  { region: "West", value: 1_420, lat: 38, lng: -122 },
  { region: "East", value: 1_180, lat: 41, lng: -74 },
  { region: "Central", value: 960, lat: 39, lng: -98 },
  { region: "South", value: 840, lat: 33, lng: -84 },
];

function TreeBranch({
  node,
  total,
  depth = 0,
  ai = false,
}: {
  node: TreeNode;
  /** Root value, so every level's share is read against the same whole. */
  total: number;
  depth?: number;
  ai?: boolean;
}) {
  const [open, setOpen] = React.useState(depth < 1);
  const hasChildren = Boolean(node.children?.length);
  const share = total > 0 ? node.value / total : 0;

  return (
    <div>
      <button
        type="button"
        onClick={() => hasChildren && setOpen((v) => !v)}
        aria-expanded={hasChildren ? open : undefined}
        className={cn(
          "relative flex w-full items-center gap-2 overflow-hidden rounded-[8px] border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60",
          !hasChildren && "cursor-default",
        )}
      >
        {/* A decomposition tree exists to show contribution, so each row carries
            its share of the root as a fill behind the label rather than leaving
            the reader to divide the figures in their head. */}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 bg-[var(--chart-1)]/12"
          style={{ width: `${share * 100}%` }}
        />
        {hasChildren ? (
          open ? (
            <ChevronDown className="relative h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="relative h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          )
        ) : (
          <span className="relative inline-block w-3.5" />
        )}
        <span className="relative min-w-0 flex-1 truncate font-medium">
          {node.label}
        </span>
        {ai && depth === 0 ? (
          <Badge variant="default" className="relative gap-1">
            <Sparkles className="h-3 w-3" />
            AI
          </Badge>
        ) : null}
        {/* Fixed widths so the two figures form columns across every depth. */}
        <span className="relative w-9 shrink-0 text-right text-[12px] tabular-nums text-muted-foreground">
          {Math.round(share * 100)}%
        </span>
        <span className="relative w-14 shrink-0 text-right font-semibold tabular-nums">
          ${formatCompact(node.value)}
        </span>
      </button>
      {open && hasChildren ? (
        /*
          Indentation lives on this wrapper, and its left border draws the branch
          guide. Indenting the row itself with a margin while it was `w-full`
          pushed every child past its parent's right edge, which is what knocked
          the value columns out of alignment.
        */
        <div className="ml-3.5 mt-1 space-y-1 border-l border-border pl-3">
          {node.children?.map((child) => (
            <TreeBranch
              key={child.label}
              node={child}
              total={total}
              depth={depth + 1}
              ai={ai}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DecompositionTree({
  root = defaultTree,
  title = "Revenue decomposition",
  className,
}: {
  root?: TreeNode;
  title?: string;
  className?: string;
}) {
  return (
    // The card grows as branches expand rather than reserving room for a drill
    // that may not happen: three rows in a 280px frame left 158px of empty card.
    <ChartFrame title={title} description="Drill into contributors" className={className} height="auto">
      <div className="pr-1">
        <TreeBranch node={root} total={root.value} />
      </div>
    </ChartFrame>
  );
}

export function AIDecompositionTree({
  root = defaultTree,
  title = "AI decomposition",
  className,
}: {
  root?: TreeNode;
  title?: string;
  className?: string;
}) {
  return (
    <ChartFrame
      title={title}
      description="Auto-generated driver tree"
      className={className}
      height="auto"
      actions={
        <Badge variant="default" className="gap-1">
          <Bot className="h-3 w-3" />
          Copilot
        </Badge>
      }
    >
      <div className="pr-1">
        <TreeBranch node={root} total={root.value} ai />
      </div>
    </ChartFrame>
  );
}

export function KeyInfluencers({
  data = defaultInfluencers,
  title = "Key influencers",
  className,
}: {
  data?: typeof defaultInfluencers;
  title?: string;
  className?: string;
}) {
  const chartData = data.map((d) => ({
    ...d,
    signed: d.direction === "up" ? d.impact : -d.impact,
  }));

  return (
    <ChartFrame title={title} description="What drives the metric" className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[-0.5, 0.5]}
            tickFormatter={(v) => formatPercent(Math.abs(Number(v)))}
            tickLine={false}
            axisLine={false}
          />
          <YAxis type="category" dataKey="factor" width={96} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => formatPercent(Math.abs(Number(value ?? 0)))}
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="signed" radius={[0, 4, 4, 0]} barSize={18}>
            {chartData.map((entry) => (
              <Cell
                key={entry.factor}
                fill={entry.direction === "up" ? SEMANTIC.positive : SEMANTIC.negative}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function TopSegments({
  segments = defaultSegments,
  title = "Top segments",
  className,
}: {
  segments?: typeof defaultSegments;
  title?: string;
  className?: string;
}) {
  return (
    <ChartFrame title={title} description="Highest-value cohorts" className={className} height={300}>
      <div className="flex h-full flex-col gap-2 overflow-auto">
        {segments.map((seg, i) => {
          const up = seg.delta >= 0;
          return (
            <div
              key={seg.segment}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{seg.segment}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${seg.share * 100}%` }}
                  />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-semibold tabular-nums">${formatCompact(seg.value)}</div>
                <div
                  className={cn(
                    "inline-flex items-center gap-0.5 text-xs tabular-nums",
                    up ? "text-[var(--chart-positive)]" : "text-[var(--chart-negative)]",
                  )}
                >
                  {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {formatPercent(Math.abs(seg.delta), 1)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}

export function SmartNarrative({
  title = "Smart narrative",
  className,
}: {
  title?: string;
  className?: string;
}) {
  return (
    /*
      Sized by the narrative rather than pinned: how many lines the copy takes
      depends on the card's width, and a fixed height left the tag row stranded
      at the bottom of the card, ~90px below the text it summarises.
    */
    <ChartFrame title={title} description="Auto-generated insights" className={className} height="auto">
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
        <p>
          <span className="font-semibold text-accent">Revenue</span> reached{" "}
          <span className="font-semibold">$6.1M</span> in June, up{" "}
          <span className="font-semibold text-[var(--chart-positive)]">8.2%</span> vs. May.
        </p>
        <p>
          The largest contributor was <span className="font-medium">Enterprise · West</span>, which
          added <span className="font-semibold">$420K</span>. Returns in the South region were an
          outlier, down <span className="font-semibold text-[var(--chart-negative)]">3.1%</span>.
        </p>
        {/*
          inline-grid + auto-cols-fr sizes every tag to the widest label, so
          "Outlier" and "Revenue" share one footprint instead of stepping down
          the row by character count.
        */}
        <div className="mt-1 inline-grid grid-flow-col auto-cols-fr gap-2">
          <Badge variant="secondary" className="justify-center">
            Revenue
          </Badge>
          <Badge variant="success" className="justify-center">
            Growth
          </Badge>
          <Badge variant="warning" className="justify-center">
            Outlier
          </Badge>
        </div>
      </div>
    </ChartFrame>
  );
}

export function AnomalyDetection({
  data = defaultAnomalies,
  title = "Anomaly detection",
  className,
}: {
  data?: typeof defaultAnomalies;
  title?: string;
  className?: string;
}) {
  const anomalies = data.filter((d) => d.anomaly);

  return (
    <ChartFrame
      title={title}
      description={`${anomalies.length} anomalies detected`}
      className={className}
      actions={
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Review
        </Badge>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
          />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
          {anomalies.map((point) => (
            <ReferenceDot
              key={point.date}
              x={point.date}
              y={point.revenue}
              r={6}
              fill={SEMANTIC.warning}
              stroke="var(--card)"
              strokeWidth={2}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function QAVisual({
  title = "Q&A",
  className,
}: {
  title?: string;
  className?: string;
}) {
  const suggestions = [
    "Revenue by region last quarter",
    "Top 5 products by margin",
    "YoY growth trend",
  ];

  return (
    <ChartFrame title={title} description="Ask questions in natural language" className={className} height="auto">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Ask a question about your data…" defaultValue="" />
        </div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Suggested
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <Button key={q} variant="outline" size="sm" className="h-auto whitespace-normal py-1.5 text-left">
              {q}
            </Button>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

export function AutoQAChart({
  question = "Show revenue trend by month",
  className,
}: {
  question?: string;
  className?: string;
}) {
  return (
    <ChartFrame
      title="Q&A result"
      description={question}
      className={className}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Auto chart
        </Badge>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={timeSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} opacity={0.85} />
          <Line type="monotone" dataKey="forecast" stroke={CHART_COLORS[1]} strokeDasharray="4 4" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function AutoQATable({
  className,
}: {
  className?: string;
}) {
  const rows = [
    { region: "West", revenue: 1_420_000, margin: 0.34, orders: 2840 },
    { region: "East", revenue: 1_180_000, margin: 0.29, orders: 2310 },
    { region: "Central", revenue: 960_000, margin: 0.31, orders: 1980 },
    { region: "South", revenue: 840_000, margin: 0.26, orders: 1760 },
  ];

  return (
    <ChartFrame
      title="Q&A result"
      description="Revenue by region"
      className={className}
      height={260}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Auto table
        </Badge>
      }
    >
      <div className="h-full overflow-auto">
        <table className="w-full text-sm" aria-label="Revenue by region">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th scope="col" className="pb-2 pr-4 font-medium">Region</th>
              <th scope="col" className="pb-2 pr-4 font-medium text-right">Revenue</th>
              <th scope="col" className="pb-2 pr-4 font-medium text-right">Margin</th>
              <th scope="col" className="pb-2 font-medium text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.region} className="border-b border-border/60 last:border-0">
                <td className="py-2 pr-4 font-medium">{row.region}</td>
                <td className="py-2 pr-4 text-right tabular-nums">${formatCompact(row.revenue)}</td>
                <td className="py-2 pr-4 text-right tabular-nums">{formatPercent(row.margin)}</td>
                <td className="py-2 text-right tabular-nums">{row.orders.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

export function AutoQAMap({
  regions = defaultMapRegions,
  className,
}: {
  regions?: typeof defaultMapRegions;
  className?: string;
}) {
  const max = Math.max(1, ...regions.map((r) => r.value));

  return (
    <ChartFrame
      title="Q&A result"
      description="Sales by region"
      className={className}
      height={280}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Auto map
        </Badge>
      }
    >
      <div className="relative h-full overflow-hidden rounded-lg border border-border bg-muted/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,var(--chart-1)_0%,transparent_45%),radial-gradient(circle_at_70%_55%,var(--chart-2)_0%,transparent_40%)] opacity-20" />
        {regions.map((r) => {
          const size = 12 + (r.value / max) * 28;
          return (
            <div
              key={r.region}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${r.lng + 130}%`, top: `${70 - r.lat}%` }}
            >
              <div
                className="rounded-full bg-accent/80 shadow-sm ring-2 ring-card"
                style={{ width: size, height: size }}
              />
              <div className="mt-1 flex items-center gap-1 whitespace-nowrap text-xs font-medium">
                <MapPin className="h-3 w-3 text-accent" />
                {r.region}
              </div>
            </div>
          );
        })}
        <div className="absolute bottom-3 left-3 rounded-md border border-border bg-card/90 px-2 py-1 text-xs text-muted-foreground backdrop-blur-sm">
          Bubble size = revenue
        </div>
      </div>
    </ChartFrame>
  );
}

export function AnomalyOverlayDemo({ className }: { className?: string }) {
  return (
    <ChartFrame
      title="Anomaly overlay"
      description="Expected range vs. actuals"
      className={className}
      height={300}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={defaultAnomalies} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="forecast" fill={CHART_COLORS[1]} opacity={0.2} radius={[4, 4, 0, 0]} />
          <Line type="monotone" dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ r: 3 }} />
          {defaultAnomalies
            .filter((d) => d.anomaly)
            .map((point) => (
              <ReferenceDot
                key={point.date}
                x={point.date}
                y={point.revenue}
                r={7}
                fill={SEMANTIC.negative}
                stroke="var(--card)"
                strokeWidth={2}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

export function ForecastDemo({ className }: { className?: string }) {
  const forecastData = [
    ...timeSeries,
    { date: "Sep", revenue: null, cost: null, forecast: 6500 },
    { date: "Oct", revenue: null, cost: null, forecast: 6800 },
    { date: "Nov", revenue: null, cost: null, forecast: 7100 },
  ];

  return (
    <ChartFrame
      title="Forecast"
      description="12-week projection with confidence band"
      className={className}
      actions={<Badge variant="secondary">Prophet</Badge>}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={forecastData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip
            contentStyle={{
              background: "var(--chart-tooltip-bg)",
              border: "1px solid var(--chart-tooltip-border)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS[0]}
            strokeWidth={2}
            connectNulls={false}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke={CHART_COLORS[2]}
            strokeWidth={2}
            strokeDasharray="6 4"
            connectNulls
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
