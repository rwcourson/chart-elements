"use client";

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

export type ComboVariant =
  | "line-clustered-column"
  | "line-stacked-column"
  | "dual-axis";

type Row = Record<string, string | number>;

export function ComboChart({
  data,
  categoryKey = "name",
  barKeys,
  lineKeys,
  variant = "line-clustered-column",
}: {
  data: Row[];
  categoryKey?: string;
  barKeys: string[];
  lineKeys: string[];
  variant?: ComboVariant;
}) {
  const stacked = variant === "line-stacked-column";
  const dual = variant === "dual-axis";

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data} margin={{ top: 12, right: dual ? 20 : 16, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis yAxisId="left" tickLine={false} axisLine={false} width={40} />
        {dual ? (
          <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={40} />
        ) : null}
        <Tooltip content={<ChartTooltip />} />
        <Legend iconType="circle" formatter={legendLabel} />
        {barKeys.map((key, i) => (
          <Bar
            key={key}
            yAxisId="left"
            dataKey={key}
            stackId={stacked ? "bars" : undefined}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        ))}
        {lineKeys.map((key, i) => (
          <Line
            key={key}
            yAxisId={dual ? "right" : "left"}
            type="monotone"
            dataKey={key}
            stroke={CHART_COLORS[(barKeys.length + i) % CHART_COLORS.length]}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
}
