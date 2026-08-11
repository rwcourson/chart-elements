"use client";

import * as React from "react";
import {
  AlertTriangle,
  Bot,
  ChevronRight,
  MapPin,
  MessageSquare,
  Sparkles,
  TrendingDown,
  TrendingUp} from "lucide-react";
import {Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ReferenceDot,
  Tooltip,
  XAxis,
  YAxis} from "recharts";
import { ChartResponsiveContainer } from "@/components/charts/chart-responsive";
import { cn, formatCompact, formatPercent } from "@/lib/utils";
import { CHART_COLORS, SEMANTIC } from "@/lib/chart-colors";
import { PLOT_MARGIN_COMPACT, SERIES_STROKE_WIDTH } from "@/lib/chart-marks";
import { useChartAnimation, useSeriesHover } from "@/lib/chart-motion";
import { timeSeries } from "@/lib/sample-data";
import { ChartFrame } from "@/components/charts/chart-frame";
import { ChartTooltip } from "@/components/charts/chart-tooltip";
import {
  ConfusionMatrix,
  FeatureImportanceChart,
  ROCCurve} from "@/components/charts/statistical-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type AnalyticalTreeNode = {
  label: string;
  value: number;
  children?: AnalyticalTreeNode[];
};

export type InfluencerDatum = {
  factor: string;
  impact: number;
  direction: "up" | "down";
};

export type SegmentDatum = {
  segment: string;
  value: number;
  share: number;
  delta: number;
};

export type NarrativeInsight = {
  id: string;
  label: string;
  detail: string;
  tone?: "neutral" | "positive" | "warning" | "negative";
};

export type AnomalyDatum = {
  date: string;
  revenue: number;
  anomaly?: boolean;
  expectedLow?: number;
  expectedHigh?: number;
};

export type QAChartDatum = Record<string, string | number | null | undefined>;

export type QATableRow = {
  id: string;
  region: string;
  revenue: number;
  margin: number;
  orders: number;
};

export type QAMapRegion = {
  region: string;
  value: number;
  latitude: number;
  longitude: number;
};

export type QAEngineResult =
  | {
      kind: "chart";
      title: string;
      method: string;
      data: QAChartDatum[];
      categoryKey: string;
      valueKey: string;
    }
  | {
      kind: "table";
      title: string;
      method: string;
      columns: string[];
      rows: Array<Record<string, string | number>>;
    }
  | {
      kind: "narrative";
      title: string;
      method: string;
      text: string;
    };

export type QAEngineProvider = (question: string) => Promise<QAEngineResult>;

export type QAEngineVisualProps = {
  provider?: QAEngineProvider;
  /** Enables the deterministic local provider used by the gallery. */
  mock?: boolean;
  defaultQuestion?: string;
  onResult?: (result: QAEngineResult) => void;
  className?: string;
};

export type ForecastPoint = {
  date: string;
  actual: number | null;
  forecast: number | null;
  lower: number | null;
  upper: number | null;
};

export type MachineLearningResult =
  | {
      kind: "feature-importance";
      modelLabel: string;
      method: string;
      data: Array<{ feature: string; importance: number }>;
    }
  | {
      kind: "confusion-matrix";
      modelLabel: string;
      method: string;
      data: Array<{ actual: string; predicted: string; count: number }>;
    }
  | {
      kind: "roc";
      modelLabel: string;
      method: string;
      auc?: number;
      data: Array<{ fpr: number; tpr: number }>;
    };

export type MachineLearningResultPlotProps = {
  result: MachineLearningResult;
  className?: string;
};

const defaultTree: AnalyticalTreeNode = {
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
      ]},
    {
      label: "Services",
      value: 920_000,
      children: [
        { label: "Support", value: 520_000 },
        { label: "Consulting", value: 400_000 },
      ]},
  ]};

const defaultInfluencers: InfluencerDatum[] = [
  { factor: "Discount rate", impact: 0.42, direction: "up" as const },
  { factor: "Lead time", impact: 0.31, direction: "down" as const },
  { factor: "Region", impact: 0.24, direction: "up" as const },
  { factor: "Channel", impact: 0.18, direction: "up" as const },
  { factor: "Rep tenure", impact: 0.12, direction: "down" as const },
];

const defaultSegments: SegmentDatum[] = [
  { segment: "Enterprise · West", value: 1_240_000, share: 0.28, delta: 0.12 },
  { segment: "Mid-market · East", value: 980_000, share: 0.22, delta: 0.08 },
  { segment: "SMB · Central", value: 760_000, share: 0.17, delta: -0.03 },
  { segment: "Consumer · South", value: 540_000, share: 0.12, delta: 0.05 },
];

const defaultAnomalies: AnomalyDatum[] = timeSeries.map((row, i) => ({
  date: row.date,
  revenue: row.revenue,
  anomaly: i === 3 || i === 6,
  expectedLow: row.forecast * 0.9,
  expectedHigh: row.forecast * 1.1}));

const defaultNarrative: NarrativeInsight[] = [
  {
    id: "revenue",
    label: "Revenue",
    detail: "Revenue reached $6.1M in June, up 8.2% versus May.",
    tone: "positive"},
  {
    id: "contributor",
    label: "Contributor",
    detail: "Enterprise · West contributed the largest absolute increase at $420K."},
  {
    id: "outlier",
    label: "Outlier",
    detail: "Returns in the South region declined 3.1% in the supplied result.",
    tone: "warning"},
];

const defaultTableRows: QATableRow[] = [
  { id: "west", region: "West", revenue: 1_420_000, margin: 0.34, orders: 2840 },
  { id: "east", region: "East", revenue: 1_180_000, margin: 0.29, orders: 2310 },
  { id: "central", region: "Central", revenue: 960_000, margin: 0.31, orders: 1980 },
  { id: "south", region: "South", revenue: 840_000, margin: 0.26, orders: 1760 },
];

const defaultMapRegions: QAMapRegion[] = [
  { region: "West", value: 1_420, latitude: 38, longitude: -122 },
  { region: "East", value: 1_180, latitude: 41, longitude: -74 },
  { region: "Central", value: 960, latitude: 39, longitude: -98 },
  { region: "South", value: 840, latitude: 33, longitude: -84 },
];

function TreeBranch({
  node,
  total,
  depth = 0,
  ai = false}: {
  node: AnalyticalTreeNode;
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
          "relative flex w-full items-center gap-2 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
          <ChevronRight
            className={cn(
              "relative h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-90",
            )}
          />
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
      {hasChildren ? (
        /*
          Indentation lives on this wrapper, and its left border draws the branch
          guide. Indenting the row itself with a margin while it was `w-full`
          pushed every child past its parent's right edge, which is what knocked
          the value columns out of alignment.

          Children stay mounted inside a 0fr→1fr grid fold (see
          .ce-tree-children in globals.css) so expanding and collapsing both
          animate instead of snapping.
        */
        <div className="ce-tree-children" data-open={open}>
          <div>
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
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DecompositionTree({
  root = defaultTree,
  title = "Revenue decomposition",
  className}: {
  root?: AnalyticalTreeNode;
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
  methodLabel,
  generatedBy,
  className}: {
  root?: AnalyticalTreeNode;
  title?: string;
  /** Name of the documented decomposition method used to create `root`. */
  methodLabel?: string;
  /** Provider or callback name that produced the supplied result. */
  generatedBy?: string;
  className?: string;
}) {
  const provenance = [methodLabel, generatedBy].filter(Boolean).join(" · ");
  return (
    <ChartFrame
      title={title}
      description={provenance || "Provided driver tree"}
      className={className}
      height="auto"
      actions={
        <Badge variant={provenance ? "default" : "secondary"} className="gap-1">
          {provenance ? <Bot className="h-3 w-3" /> : null}
          {provenance ? "AI-assisted" : "Result"}
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
  className}: {
  data?: InfluencerDatum[];
  title?: string;
  className?: string;
}) {
  const chartData = data.map((d) => ({
    ...d,
    signed: d.direction === "up" ? d.impact : -d.impact}));
  const extent = Math.max(0.01, ...chartData.map((d) => Math.abs(d.signed))) * 1.1;
  const anim = useChartAnimation();
  const hover = useSeriesHover();

  return (
    <ChartFrame title={title} description="What drives the metric" className={className}>
      <ChartResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ ...PLOT_MARGIN_COMPACT, top: 4, left: 8 }} /* dense influencer bars */>
          <CartesianGrid horizontal={false} />
          <XAxis
            type="number"
            domain={[-extent, extent]}
            tickFormatter={(v) => formatPercent(Math.abs(Number(v)))}
            tickLine={false}
            axisLine={false}
          />
          <YAxis type="category" dataKey="factor" width={96} tickLine={false} axisLine={false} />
          <Tooltip
            content={
              <ChartTooltip
                valueFormatter={(n) => formatPercent(Math.abs(n))}
              />
            }
          />
          <Bar dataKey="signed" radius={[0, 4, 4, 0]} barSize={18} {...anim}>
            {chartData.map((entry) => (
              <Cell
                key={entry.factor}
                fill={entry.direction === "up" ? SEMANTIC.positive : SEMANTIC.negative}
                fillOpacity={hover.opacityFor(entry.factor)}
                {...hover.bind(entry.factor)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartResponsiveContainer>
    </ChartFrame>
  );
}

export function TopSegments({
  segments = defaultSegments,
  title = "Top segments",
  className}: {
  segments?: SegmentDatum[];
  title?: string;
  className?: string;
}) {
  return (
    <ChartFrame title={title} description="Highest-value cohorts" className={className} height={300}>
      <div className="flex h-full flex-col gap-2 overflow-auto">
        {[...segments]
          .filter((segment) => Number.isFinite(segment.value))
          .sort((a, b) => b.value - a.value)
          .map((seg, i) => {
          const up = seg.delta >= 0;
          return (
            <div
              key={seg.segment}
              className="flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card px-3 py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{seg.segment}</div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-accent"
                    style={{ width: `${Math.max(0, Math.min(1, seg.share)) * 100}%` }}
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
  insights = defaultNarrative,
  methodLabel,
  className}: {
  title?: string;
  insights?: NarrativeInsight[];
  /** Optional method/provider label for an externally generated result. */
  methodLabel?: string;
  className?: string;
}) {
  return (
    /*
      Sized by the narrative rather than pinned: how many lines the copy takes
      depends on the card's width, and a fixed height left the tag row stranded
      at the bottom of the card, ~90px below the text it summarises.
    */
    <ChartFrame
      title={title}
      description={methodLabel ? `Generated with ${methodLabel}` : "Provided insight summary"}
      className={className}
      height="auto"
    >
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground">
        {insights.length ? (
          <ul className="space-y-2" aria-label="Supplied insights">
            {insights.map((insight) => (
              <li key={insight.id}>
                <span
                  className={cn(
                    "font-semibold",
                    insight.tone === "positive" && "text-[var(--chart-positive)]",
                    insight.tone === "warning" && "text-[var(--chart-warning)]",
                    insight.tone === "negative" && "text-[var(--chart-negative)]",
                    (!insight.tone || insight.tone === "neutral") && "text-accent",
                  )}
                >
                  {insight.label}:
                </span>{" "}
                {insight.detail}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No insights were supplied.</p>
        )}
        {/*
          inline-grid + auto-cols-fr sizes every tag to the widest label, so
          "Outlier" and "Revenue" share one footprint instead of stepping down
          the row by character count.
        */}
        <div className="mt-1 inline-grid grid-flow-col auto-cols-fr gap-2">
          {insights.slice(0, 3).map((insight) => (
            <Badge
              key={insight.id}
              variant={
                insight.tone === "positive"
                  ? "success"
                  : insight.tone === "warning" || insight.tone === "negative"
                    ? "warning"
                    : "secondary"
              }
              className="justify-center"
            >
              {insight.label}
            </Badge>
          ))}
        </div>
      </div>
    </ChartFrame>
  );
}

export function AnomalyDetection({
  data = defaultAnomalies,
  title = "Anomaly detection",
  methodLabel = "Provided anomaly flags",
  className}: {
  data?: AnomalyDatum[];
  title?: string;
  methodLabel?: string;
  className?: string;
}) {
  const anomalies = data.filter((d) => d.anomaly);
  const anim = useChartAnimation();

  return (
    <ChartFrame
      title={title}
      description={`${anomalies.length} flagged point${anomalies.length === 1 ? "" : "s"} · ${methodLabel}`}
      className={className}
      actions={
        <Badge variant="warning" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Review
        </Badge>
      }
    >
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
          />
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
      </ChartResponsiveContainer>
    </ChartFrame>
  );
}

export function QAVisual({
  title = "Q&A",
  question,
  defaultQuestion = "",
  suggestions = [
    "Revenue by region last quarter",
    "Top 5 products by margin",
    "YoY growth trend",
  ],
  onQuestionChange,
  onSubmit,
  className}: {
  title?: string;
  question?: string;
  defaultQuestion?: string;
  suggestions?: string[];
  onQuestionChange?: (question: string) => void;
  onSubmit?: (question: string) => void | Promise<void>;
  className?: string;
}) {
  const [internalQuestion, setInternalQuestion] = React.useState(defaultQuestion);
  const [status, setStatus] = React.useState("");
  const currentQuestion = question ?? internalQuestion;
  const setQuestion = (nextQuestion: string) => {
    if (question === undefined) setInternalQuestion(nextQuestion);
    onQuestionChange?.(nextQuestion);
    setStatus("");
  };
  const submitQuestion = async (event?: React.FormEvent) => {
    event?.preventDefault();
    const nextQuestion = currentQuestion.trim();
    if (!nextQuestion) {
      setStatus("Enter a question before submitting.");
      return;
    }
    if (!onSubmit) {
      setStatus("Connect onSubmit to a query provider to run this question.");
      return;
    }
    setStatus("Submitting question…");
    await onSubmit(nextQuestion);
    setStatus("Question submitted.");
  };

  return (
    <ChartFrame title={title} description="Ask questions in natural language" className={className} height="auto">
      <form className="flex flex-col gap-3" onSubmit={submitQuestion}>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            aria-label="Question"
            placeholder="Ask a question about your data…"
            value={currentQuestion}
            onChange={(event) => setQuestion(event.target.value)}
          />
        </div>
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Suggested
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <Button
              key={q}
              type="button"
              variant="outline"
              size="sm"
              className="h-auto whitespace-normal py-1.5 text-left"
              onClick={() => setQuestion(q)}
            >
              {q}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit" size="sm">Submit question</Button>
          <span className="text-xs text-muted-foreground" role="status" aria-live="polite">
            {status}
          </span>
        </div>
      </form>
    </ChartFrame>
  );
}

const mockQAProvider: QAEngineProvider = async (question) => {
  const normalized = question.toLowerCase();
  if (normalized.includes("region")) {
    return {
      kind: "table",
      title: "Revenue by region",
      method: "Deterministic local mock",
      columns: ["region", "revenue", "margin"],
      rows: defaultTableRows.map((row) => ({
        region: row.region,
        revenue: row.revenue,
        margin: formatPercent(row.margin)}))};
  }
  if (normalized.includes("why") || normalized.includes("summary")) {
    return {
      kind: "narrative",
      title: "Supplied narrative result",
      method: "Deterministic local mock",
      text: "The local mock selected a narrative because the question asked for an explanation. No analytical claim was generated by a model."};
  }
  return {
    kind: "chart",
    title: "Revenue trend",
    method: "Deterministic local mock",
    data: timeSeries,
    categoryKey: "date",
    valueKey: "revenue"};
};

export function QAEngineVisual({
  provider,
  mock = false,
  defaultQuestion = "Revenue by region",
  onResult,
  className}: QAEngineVisualProps) {
  const activeProvider = provider ?? (mock ? mockQAProvider : undefined);
  const [question, setQuestion] = React.useState(defaultQuestion);
  const [result, setResult] = React.useState<QAEngineResult | null>(null);
  const [status, setStatus] = React.useState("");
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!activeProvider) {
      setStatus("Connect a Q&A provider to select a compatible result visual.");
      return;
    }
    if (!question.trim()) {
      setStatus("Enter a question before submitting.");
      return;
    }
    setStatus("Selecting a compatible result…");
    try {
      const next = await activeProvider(question.trim());
      setResult(next);
      setStatus(`${next.kind} result selected using ${next.method}.`);
      onResult?.(next);
    } catch (reason) {
      setResult(null);
      setStatus(reason instanceof Error ? reason.message : String(reason));
    }
  };

  return (
    <ChartFrame
      title="Q&A result selector"
      description={mock ? "Deterministic local mock provider" : "Provider-backed result selection"}
      className={className}
      height="auto"
    >
      <div className="space-y-4">
        <form className="flex flex-col gap-2 sm:flex-row sm:items-center" onSubmit={submit}>
          <Input
            aria-label="Question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="min-w-0 flex-1"
          />
          {/* Same h-11 + --radius as Input so the pair shares one silhouette. */}
          <Button type="submit" className="h-11 shrink-0 rounded-[var(--radius)]">
            Select result
          </Button>
        </form>
        <p className="text-xs text-muted-foreground" role="status" aria-live="polite">{status}</p>
        {result?.kind === "chart" ? (
          <div className="h-56" aria-label={result.title}>
            <ChartResponsiveContainer width="100%" height="100%">
              <BarChart data={result.data} margin={{ ...PLOT_MARGIN_COMPACT }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey={result.categoryKey} tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={44} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey={result.valueKey} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartResponsiveContainer>
          </div>
        ) : null}
        {result?.kind === "table" ? (
          <div className="overflow-auto rounded-[var(--radius)] border border-border">
            <table className="w-full text-sm" aria-label={result.title}>
              <thead><tr>{result.columns.map((column) => <th key={column} scope="col" className="border-b border-border p-2 text-left capitalize">{column}</th>)}</tr></thead>
              <tbody>{result.rows.map((row, rowIndex) => <tr key={rowIndex}>{result.columns.map((column) => <td key={column} className="border-b border-border/60 p-2 last:border-0">{String(row[column] ?? "")}</td>)}</tr>)}</tbody>
            </table>
          </div>
        ) : null}
        {result?.kind === "narrative" ? (
          <div className="rounded-[var(--radius)] border border-border bg-muted/40 p-4 text-sm leading-relaxed">
            <div className="font-semibold">{result.title}</div>
            <p className="mt-1 text-muted-foreground">{result.text}</p>
          </div>
        ) : null}
        {!activeProvider ? (
          <p className="rounded-[var(--radius)] border border-dashed border-border p-3 text-sm text-muted-foreground">
            No query provider is configured. The component will not fabricate a result.
          </p>
        ) : null}
      </div>
    </ChartFrame>
  );
}

export function AutoQAChart({
  question = "Show revenue trend by month",
  data = timeSeries,
  categoryKey = "date",
  valueKey = "revenue",
  comparisonKey = "forecast",
  className}: {
  question?: string;
  data?: QAChartDatum[];
  categoryKey?: string;
  valueKey?: string;
  comparisonKey?: string | null;
  className?: string;
}) {
  const anim = useChartAnimation();

  return (
    <ChartFrame
      title="Q&A result"
      description={question}
      className={className}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Provided result
        </Badge>
      }
    >
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey={valueKey} fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} opacity={0.85} {...anim} />
          {/* Dashed projection line — the dash reads as "not actuals", so it
              keeps the thin reference treatment rather than the 2.25 data line. */}
          {comparisonKey ? (
            <Line type="monotone" dataKey={comparisonKey} stroke={CHART_COLORS[1]} strokeDasharray="4 4" dot={false} {...anim} />
          ) : null}
        </ComposedChart>
      </ChartResponsiveContainer>
    </ChartFrame>
  );
}

export function AutoQATable({
  question = "Revenue by region",
  rows = defaultTableRows,
  className}: {
  question?: string;
  rows?: QATableRow[];
  className?: string;
}) {
  return (
    <ChartFrame
      title="Q&A result"
      description={question}
      className={className}
      height={260}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Provided result
        </Badge>
      }
    >
      <div className="h-full overflow-auto">
        <table className="w-full text-sm" aria-label={question}>
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
              <tr key={row.id} className="border-b border-border/60 last:border-0">
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
  question = "Sales by region",
  className}: {
  regions?: QAMapRegion[];
  question?: string;
  className?: string;
}) {
  const max = Math.max(1, ...regions.map((r) => r.value));

  return (
    <ChartFrame
      title="Q&A result"
      description={`${question} · schematic coordinates`}
      className={className}
      height={280}
      actions={
        <Badge variant="default" className="gap-1">
          <Sparkles className="h-3 w-3" />
          Provided result
        </Badge>
      }
    >
      <div className="relative h-full overflow-hidden rounded-[var(--radius)] border border-border bg-muted/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,var(--chart-1)_0%,transparent_45%),radial-gradient(circle_at_70%_55%,var(--chart-2)_0%,transparent_40%)] opacity-20" />
        {regions.map((r) => {
          const size = 12 + (r.value / max) * 28;
          return (
            <div
              key={r.region}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((r.longitude + 130) / 65) * 100}%`,
                top: `${((52 - r.latitude) / 28) * 100}%`}}
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

export function AnomalyOverlayDemo({
  data = defaultAnomalies,
  className}: {
  data?: AnomalyDatum[];
  className?: string;
}) {
  const anim = useChartAnimation();
  const chartData = data.map((point) => ({
    ...point,
    expectedRange:
      Number.isFinite(point.expectedLow) && Number.isFinite(point.expectedHigh)
        ? [point.expectedLow as number, point.expectedHigh as number]
        : undefined}));

  return (
    <ChartFrame
      title="Anomaly overlay"
      description="Expected range vs. actuals"
      className={className}
      height={300}
    >
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="expectedRange"
            fill={CHART_COLORS[1]}
            fillOpacity={0.18}
            stroke={CHART_COLORS[1]}
            strokeOpacity={0.55}
            connectNulls={false}
            {...anim}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            dot={{ r: 3 }}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
          />
          {data
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
      </ChartResponsiveContainer>
    </ChartFrame>
  );
}

const defaultForecast: ForecastPoint[] = [
  ...timeSeries.map((point) => ({
    date: point.date,
    actual: point.revenue,
    forecast: point.date === "Aug" ? point.revenue : null,
    lower: null,
    upper: null})),
  { date: "Sep", actual: null, forecast: 6500, lower: 6100, upper: 6900 },
  { date: "Oct", actual: null, forecast: 6800, lower: 6250, upper: 7350 },
  { date: "Nov", actual: null, forecast: 7100, lower: 6400, upper: 7800 },
];

export function ForecastDemo({
  data = defaultForecast,
  methodLabel = "Provided projection",
  confidenceLabel = "80% interval",
  className}: {
  data?: ForecastPoint[];
  methodLabel?: string;
  confidenceLabel?: string;
  className?: string;
}) {
  const forecastData = data.map((point) => ({
    ...point,
    interval:
      Number.isFinite(point.lower) && Number.isFinite(point.upper)
        ? [point.lower as number, point.upper as number]
        : undefined}));
  const anim = useChartAnimation();
  const projectedPeriods = data.filter((point) => point.forecast != null && point.actual == null).length;

  return (
    <ChartFrame
      title="Forecast"
      description={`${projectedPeriods}-period projection · ${confidenceLabel}`}
      className={className}
      actions={<Badge variant="secondary">{methodLabel}</Badge>}
    >
      <ChartResponsiveContainer width="100%" height="100%">
        <ComposedChart data={forecastData} margin={{ ...PLOT_MARGIN_COMPACT }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={44} tickFormatter={(v) => formatCompact(v)} />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="interval"
            fill={CHART_COLORS[2]}
            fillOpacity={0.18}
            stroke={CHART_COLORS[2]}
            strokeOpacity={0.45}
            connectNulls={false}
            {...anim}
          />
          <Line
            type="monotone"
            dataKey="actual"
            stroke={CHART_COLORS[0]}
            strokeWidth={SERIES_STROKE_WIDTH}
            strokeLinecap="round"
            connectNulls={false}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
            {...anim}
          />
          {/* Dashed projection — keeps the reference-line treatment. */}
          <Line
            type="monotone"
            dataKey="forecast"
            stroke={CHART_COLORS[2]}
            strokeWidth={2}
            strokeDasharray="6 4"
            connectNulls
            dot={false}
            {...anim}
          />
        </ComposedChart>
      </ChartResponsiveContainer>
    </ChartFrame>
  );
}

/** Renders an explicit calculated model result; it never trains or fabricates a model. */
export function MachineLearningResultPlot({
  result,
  className}: MachineLearningResultPlotProps) {
  const validCount = result.data.length;
  return (
    <div className={cn("flex h-full min-h-[260px] flex-col gap-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-semibold">{result.modelLabel}</div>
          <div className="text-xs text-muted-foreground">
            {result.kind.replaceAll("-", " ")} · {validCount} supplied result row{validCount === 1 ? "" : "s"}
          </div>
        </div>
        <Badge variant="secondary">{result.method}</Badge>
      </div>
      <div className="min-h-0 flex-1">
        {result.kind === "feature-importance" ? (
          <FeatureImportanceChart data={result.data} />
        ) : null}
        {result.kind === "confusion-matrix" ? (
          <ConfusionMatrix cells={result.data} />
        ) : null}
        {result.kind === "roc" ? (
          <ROCCurve data={result.data} />
        ) : null}
      </div>
      {result.kind === "roc" && result.auc != null ? (
        <p className="text-xs text-muted-foreground">
          Supplied area under curve: {result.auc.toLocaleString(undefined, { maximumFractionDigits: 3 })}
        </p>
      ) : null}
    </div>
  );
}
