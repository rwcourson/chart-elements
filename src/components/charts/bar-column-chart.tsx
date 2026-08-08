"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type BarColumnVariant =
  | "clustered-bar"
  | "stacked-bar"
  | "percent-bar"
  | "clustered-column"
  | "stacked-column"
  | "percent-column";

type Row = Record<string, string | number>;

function toPercent(data: Row[], keys: string[]): Row[] {
  return data.map((row) => {
    const total = keys.reduce((s, k) => s + Number(row[k] ?? 0), 0) || 1;
    const next: Row = { ...row };
    keys.forEach((k) => {
      next[k] = Number(row[k] ?? 0) / total;
    });
    return next;
  });
}

export function BarColumnChart({
  data,
  categoryKey = "name",
  seriesKeys,
  variant = "clustered-column",
  showLegend = true,
}: {
  data: Row[];
  categoryKey?: string;
  seriesKeys: string[];
  variant?: BarColumnVariant;
  showLegend?: boolean;
}) {
  // `isBar` = horizontal bars, which Recharts expresses as layout="vertical".
  const isBar = variant.includes("bar");
  const stacked = variant.includes("stacked") || variant.includes("percent");
  const percent = variant.includes("percent");
  const chartData = percent ? toPercent(data, seriesKeys) : data;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout={isBar ? "vertical" : "horizontal"}
        margin={{ top: 12, right: 16, left: 4, bottom: 8 }}
        barCategoryGap="18%"
        // Clustered bars share a narrow band; a wide gap starves each bar.
        barGap={stacked ? 0 : 2}
      >
        {/* Gridlines belong on the value axis, which flips with the layout. */}
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={!isBar}
          vertical={isBar}
        />
        {isBar ? (
          <>
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
            />
            <YAxis
              type="category"
              dataKey={categoryKey}
              width={72}
              tickLine={false}
              axisLine={false}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={40}
              tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
            />
          </>
        )}
        <Tooltip
          content={
            <ChartTooltip
              valueFormatter={
                percent
                  ? (n) => `${Math.round(n * 100)}%`
                  : undefined
              }
            />
          }
        />
        {showLegend ? <Legend iconType="circle" formatter={legendLabel} /> : null}
        {seriesKeys.map((key, i) => (
          <Bar
            key={key}
            dataKey={key}
            stackId={stacked ? "a" : undefined}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]}
            maxBarSize={36}
            // Keeps a dense cluster from collapsing into hairlines.
            minPointSize={1}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
