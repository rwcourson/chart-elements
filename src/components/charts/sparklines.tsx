"use client";

import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";

const defaultData = [4, 7, 5, 9, 6, 11, 8, 12, 9, 14].map((v, i) => ({ i, v }));

export function LineSparkline({
  data = defaultData,
  dataKey = "v",
}: {
  data?: Record<string, number>[];
  dataKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={CHART_COLORS[0]}
          strokeWidth={1.75}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ColumnSparkline({
  data = defaultData,
  dataKey = "v",
}: {
  data?: Record<string, number>[];
  dataKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <Bar dataKey={dataKey} fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DataBar({
  value = 0.72,
}: {
  value?: number;
}) {
  return (
    <div className="flex h-full items-center px-2">
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-[var(--chart-1)]"
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </div>
    </div>
  );
}
