"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { ChartTooltip, legendLabel } from "./chart-tooltip";

/** Rank-flow style ribbon using stacked areas (Power BI ribbon analogue). */
export function RibbonChart({
  data,
  categoryKey = "name",
  seriesKeys,
}: {
  data: Record<string, string | number>[];
  categoryKey?: string;
  seriesKeys: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 12, right: 16, left: 4, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={categoryKey} tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <Tooltip content={<ChartTooltip />} />
        <Legend iconType="circle" formatter={legendLabel} />
        {seriesKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="ribbon"
            stroke={CHART_COLORS[i % CHART_COLORS.length]}
            fill={CHART_COLORS[i % CHART_COLORS.length]}
            fillOpacity={0.55}
            strokeWidth={1.5}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
