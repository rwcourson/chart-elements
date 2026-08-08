"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type LineAreaVariant =
  | "line"
  | "area"
  | "stacked-area"
  | "percent-area"
  | "step"
  | "spline";

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

export function LineAreaChart({
  data,
  categoryKey = "date",
  seriesKeys,
  variant = "line",
  showLegend = true,
}: {
  data: Row[];
  categoryKey?: string;
  seriesKeys: string[];
  variant?: LineAreaVariant;
  showLegend?: boolean;
}) {
  const percent = variant === "percent-area";
  const stacked = variant === "stacked-area" || percent;
  const chartData = percent ? toPercent(data, seriesKeys) : data;
  const isArea = variant.includes("area");
  const type =
    variant === "step" ? "stepAfter" : variant === "spline" ? "monotone" : "monotone";

  if (isArea) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
          <defs>
            {seriesKeys.map((key, i) => (
              <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS[i % CHART_COLORS.length]} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={percent ? (v) => `${Math.round(Number(v) * 100)}%` : undefined}
          />
          <Tooltip content={<ChartTooltip />} />
          {showLegend ? <Legend iconType="circle" formatter={legendLabel} /> : null}
          {seriesKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stackId={stacked ? "1" : undefined}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              fill={`url(#fill-${key})`}
              strokeWidth={2}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        {showLegend ? <Legend iconType="circle" formatter={legendLabel} /> : null}
        {seriesKeys.map((key, i) => (
          <Line
            key={key}
            type={type}
            dataKey={key}
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
