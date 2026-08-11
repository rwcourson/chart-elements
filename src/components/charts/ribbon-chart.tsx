"use client";

import * as React from "react";
import { CHART_COLORS } from "@/lib/chart-colors";
import { useSeriesHover } from "@/lib/chart-motion";
import { formatCompact, roundSvgNumber, roundSvgPath } from "@/lib/utils";
import { ChartEmpty, ScreenReaderTable } from "./chart-frame";

export type RibbonDatum = Record<string, string | number | null | undefined>;

export type RibbonChartProps = {
  data: RibbonDatum[];
  categoryKey?: string;
  seriesKeys: string[];
  valueFormatter?: (value: number) => string;
  ariaLabel?: string;
};

type Segment = {
  key: string;
  value: number;
  rank: number;
  y0: number;
  y1: number;
};

const WIDTH = 720;
const HEIGHT = 340;
const MARGIN = { top: 28, right: 68, bottom: 42, left: 68 };

function finitePositive(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

/**
 * A real ribbon chart ranks each series independently at every category and
 * connects the resulting stacked positions. Series can therefore cross as
 * their rank changes; a conventional stacked area cannot represent that.
 */
export function RibbonChart({
  data,
  categoryKey = "name",
  seriesKeys,
  valueFormatter = formatCompact,
  ariaLabel = "Ribbon chart showing how series ranks change across categories",
}: RibbonChartProps) {
  const hover = useSeriesHover();
  const chartWidth = WIDTH - MARGIN.left - MARGIN.right;
  const chartHeight = HEIGHT - MARGIN.top - MARGIN.bottom;

  const columns = React.useMemo(() => {
    return data.map((row) => {
      const ranked = seriesKeys
        .map((key) => ({ key, value: finitePositive(row[key]) }))
        .sort((a, b) => b.value - a.value || a.key.localeCompare(b.key));
      const total = ranked.reduce((sum, item) => sum + item.value, 0);
      let running = 0;
      const segments = new Map<string, Segment>();
      ranked.forEach((item, rank) => {
        const share = total > 0 ? item.value / total : 1 / Math.max(ranked.length, 1);
        const y0 = roundSvgNumber(MARGIN.top + running * chartHeight);
        running += share;
        segments.set(item.key, {
          ...item,
          rank: rank + 1,
          y0,
          y1: roundSvgNumber(MARGIN.top + running * chartHeight),
        });
      });
      return {
        label: String(row[categoryKey] ?? ""),
        segments,
      };
    });
  }, [categoryKey, chartHeight, data, seriesKeys]);

  if (columns.length < 2 || seriesKeys.length === 0) {
    return <ChartEmpty label="Ribbon charts need at least two categories" />;
  }
  if (new Set(seriesKeys).size !== seriesKeys.length) {
    return <ChartEmpty label="Ribbon chart series keys must be unique" />;
  }

  const xFor = (index: number) =>
    roundSvgNumber(MARGIN.left + (index / Math.max(columns.length - 1, 1)) * chartWidth);

  return (
    <div className="h-full w-full overflow-x-auto" tabIndex={0} aria-label={`Scrollable ${ariaLabel}`}>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full min-w-[38rem] w-full"
        role="group"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        <desc>
          Each colored ribbon changes vertical position when its rank changes. Values are normalized within each category.
        </desc>

        {columns.map((column, columnIndex) => (
          <g key={`${column.label}-${columnIndex}`}>
            <line
              x1={xFor(columnIndex)}
              x2={xFor(columnIndex)}
              y1={MARGIN.top}
              y2={MARGIN.top + chartHeight}
              stroke="var(--border)"
              strokeWidth="1"
            />
            <text
              x={xFor(columnIndex)}
              y={HEIGHT - 14}
              textAnchor="middle"
              fill="var(--muted-foreground)"
              fontSize="12"
            >
              {column.label.length > 14 ? `${column.label.slice(0, 13)}…` : column.label}
              <title>{column.label}</title>
            </text>
          </g>
        ))}

        {seriesKeys.map((key, seriesIndex) => {
          const color = CHART_COLORS[seriesIndex % CHART_COLORS.length];
          const opacity = hover.opacityFor(key);
          return (
            <g
              key={key}
              tabIndex={0}
              role="group"
              aria-label={`${key} ribbon`}
              {...hover.bind(key)}
              style={{ opacity, transition: "opacity 160ms ease-out" }}
            >
              {columns.slice(0, -1).map((column, index) => {
                const current = column.segments.get(key);
                const next = columns[index + 1].segments.get(key);
                if (!current || !next) return null;
                const x1 = xFor(index);
                const x2 = xFor(index + 1);
                const control = roundSvgNumber(Math.max(18, (x2 - x1) * 0.44));
                const path = roundSvgPath([
                  `M ${x1} ${current.y0}`,
                  `C ${x1 + control} ${current.y0}, ${x2 - control} ${next.y0}, ${x2} ${next.y0}`,
                  `L ${x2} ${next.y1}`,
                  `C ${x2 - control} ${next.y1}, ${x1 + control} ${current.y1}, ${x1} ${current.y1}`,
                  "Z",
                ].join(" "));
                return (
                  <path key={`${key}-${index}`} d={path} fill={color} fillOpacity="0.72" />
                );
              })}
              {columns.map((column, index) => {
                const segment = column.segments.get(key);
                if (!segment) return null;
                return (
                  <rect
                    key={`${key}-anchor-${index}`}
                    x={xFor(index) - 2}
                    y={segment.y0}
                    width="4"
                    height={Math.max(1, segment.y1 - segment.y0)}
                    fill={color}
                  />
                );
              })}
              {columns[0].segments.get(key) ? (
                <text
                  x={MARGIN.left - 8}
                  y={(columns[0].segments.get(key)!.y0 + columns[0].segments.get(key)!.y1) / 2 + 4}
                  textAnchor="end"
                  fill="var(--foreground)"
                  fontSize="11"
                >
                  {key.length > 10 ? `${key.slice(0, 9)}…` : key}
                </text>
              ) : null}
            </g>
          );
        })}
      </svg>
      <ScreenReaderTable>
        <caption>{ariaLabel} data</caption>
        <thead><tr><th scope="col">Category</th><th scope="col">Series</th><th scope="col">Value</th><th scope="col">Rank</th></tr></thead>
        <tbody>
          {columns.flatMap((column, columnIndex) => seriesKeys.map((key) => {
            const segment = column.segments.get(key);
            return segment ? (
              <tr key={`${columnIndex}-${key}`}><th scope="row">{column.label}</th><td>{key}</td><td>{valueFormatter(segment.value)}</td><td>{segment.rank}</td></tr>
            ) : null;
          }))}
        </tbody>
      </ScreenReaderTable>
    </div>
  );
}
