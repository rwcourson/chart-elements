"use client";

import * as React from "react";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useChartAnimation } from "@/lib/chart-motion";

const defaultData = [4, 7, 5, 9, 6, 11, 8, 12, 9, 14].map((v, i) => ({ i, v }));

export function LineSparkline({
  data = defaultData,
  dataKey = "v",
}: {
  data?: Record<string, number>[];
  dataKey?: string;
}) {
  const anim = useChartAnimation();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={CHART_COLORS[0]}
          strokeWidth={2.25}
          strokeLinecap="round"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          {...anim}
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
  const anim = useChartAnimation();
  // Gradient ids must be unique per instance — two sparklines on one page
  // would otherwise reference the same <defs>.
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <defs>
          {/* Depth without color math: the fill eases to 82% opacity toward
              the baseline, which reads as a soft top light on both themes. */}
          <linearGradient id={`spark-${uid}-0`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={1} />
            <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.82} />
          </linearGradient>
        </defs>
        <Bar
          dataKey={dataKey}
          fill={`url(#spark-${uid}-0)`}
          radius={[2, 2, 0, 0]}
          {...anim}
        />
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
          className="h-full rounded-full bg-[var(--chart-1)] transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value * 100))}%` }}
        />
      </div>
    </div>
  );
}
