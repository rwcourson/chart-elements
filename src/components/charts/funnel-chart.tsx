"use client";

import * as React from "react";
import { colorAt, foregroundAt } from "@/lib/chart-colors";
import { useSeriesHover } from "@/lib/chart-motion";
import { formatCompact } from "@/lib/utils";
import { ChartEmpty } from "./chart-frame";

export type FunnelDatum = Record<string, string | number | null | undefined>;

export type FunnelChartProps = {
  data: FunnelDatum[];
  nameKey?: string;
  valueKey?: string;
  variant?: "funnel" | "pyramid";
  valueFormatter?: (value: number) => string;
  ariaLabel?: string;
};

const WIDTH = 720;
const HEIGHT = 320;
const LABEL_COL = 128;
const PLOT_LEFT = 148;
const PLOT_RIGHT = 560;
const RATE_COL = 580;

function validStages(data: FunnelDatum[], nameKey: string, valueKey: string) {
  return data.flatMap((row, index) => {
    const value = Number(row[valueKey]);
    if (!Number.isFinite(value) || value < 0) return [];
    return [{ label: String(row[nameKey] ?? `Stage ${index + 1}`), value }];
  });
}

/**
 * Continuous process funnel: stages share edges (no white gutters), widths
 * follow values, and conversion rates sit on the right. Sequential palette
 * reads as one flow rather than five unrelated categorical blocks.
 */
export function FunnelChart({
  data,
  nameKey = "name",
  valueKey = "value",
  variant = "funnel",
  valueFormatter = formatCompact,
  ariaLabel,
}: FunnelChartProps) {
  const hover = useSeriesHover();
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const source = React.useMemo(
    () => validStages(data, nameKey, valueKey),
    [data, nameKey, valueKey],
  );
  const stages = variant === "pyramid" ? [...source].reverse() : source;
  const max = Math.max(...stages.map((stage) => stage.value), 0);
  const first = stages[0]?.value ?? 0;

  if (!stages.length || max <= 0) {
    return <ChartEmpty label="No valid funnel stages" />;
  }

  const center = (PLOT_LEFT + PLOT_RIGHT) / 2;
  const plotWidth = PLOT_RIGHT - PLOT_LEFT;
  // Slight inset so the top stage doesn't feel edge-to-edge in the card.
  const maxBand = plotWidth * 0.96;
  const minBand = Math.max(48, plotWidth * 0.16);
  const widthFor = (value: number) =>
    minBand + (Math.max(0, value) / max) * (maxBand - minBand);

  const stageGap = 3;
  const usable = HEIGHT - 24;
  const stageHeight = Math.min(
    52,
    (usable - stageGap * (stages.length - 1)) / stages.length,
  );
  const plotTop =
    (HEIGHT - (stageHeight * stages.length + stageGap * (stages.length - 1))) /
    2;
  const label =
    ariaLabel ??
    `${variant === "pyramid" ? "Pyramid" : "Funnel"} chart with ${stages.length} stages`;

  return (
    <div className="h-full w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-full min-w-[36rem] w-full"
        role="img"
        aria-label={label}
        data-chart-svg
      >
        <title>{label}</title>
        <desc>
          Process stages taper by value. Hover a stage to isolate it; conversion
          is relative to the first stage.
        </desc>
        <defs>
          {stages.map((stage, index) => {
            const fill = colorAt(index);
            return (
              <linearGradient
                key={stage.label}
                id={`funnel-${uid}-${index}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={fill} stopOpacity={1} />
                <stop offset="100%" stopColor={fill} stopOpacity={0.82} />
              </linearGradient>
            );
          })}
        </defs>

        {stages.map((stage, index) => {
          const y = plotTop + index * (stageHeight + stageGap);
          const topWidth = widthFor(stage.value);
          const next = stages[index + 1];
          // Continuous funnel: bottom edge matches the next stage's top width.
          // Final stage keeps a quiet taper so it doesn't end as a blunt bar.
          const bottomWidth = next
            ? widthFor(next.value)
            : variant === "funnel"
              ? Math.max(minBand, topWidth * 0.72)
              : topWidth;

          const path = [
            `M ${center - topWidth / 2} ${y}`,
            `L ${center + topWidth / 2} ${y}`,
            `L ${center + bottomWidth / 2} ${y + stageHeight}`,
            `L ${center - bottomWidth / 2} ${y + stageHeight}`,
            "Z",
          ].join(" ");

          const opacity = hover.opacityFor(stage.label);
          const conversion =
            index === 0 || first === 0 ? 1 : stage.value / first;
          const dropFromPrev =
            index === 0 || !stages[index - 1] || stages[index - 1]!.value === 0
              ? null
              : stage.value / stages[index - 1]!.value;
          const ink = foregroundAt(index);
          const shortLabel =
            stage.label.length > 18
              ? `${stage.label.slice(0, 17)}…`
              : stage.label;

          return (
            <g
              key={`${stage.label}-${index}`}
              tabIndex={0}
              role="group"
              aria-label={`${stage.label}: ${valueFormatter(stage.value)}, ${Math.round(conversion * 100)} percent of first stage`}
              {...hover.bind(stage.label)}
              style={{
                opacity,
                transition: "opacity 160ms ease-out",
                cursor: "pointer",
              }}
            >
              <path
                d={path}
                fill={`url(#funnel-${uid}-${index})`}
                stroke="var(--card)"
                strokeWidth={stageGap > 0 ? 1.5 : 0}
              />

              {/* Stage name — left rail */}
              <text
                x={LABEL_COL}
                y={y + stageHeight / 2}
                textAnchor="end"
                dominantBaseline="central"
                fill="var(--secondary-foreground)"
                fontSize="12.5"
                fontWeight={500}
                letterSpacing="-0.01em"
              >
                {shortLabel}
                <title>{stage.label}</title>
              </text>

              {/* Value on the band — no floating pill chrome */}
              <text
                x={center}
                y={y + stageHeight / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={ink}
                fontSize="12.5"
                fontWeight={600}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {valueFormatter(stage.value)}
              </text>

              {/* Overall conversion from first stage; title carries step retention */}
              <text
                x={RATE_COL}
                y={y + stageHeight / 2}
                textAnchor="start"
                dominantBaseline="central"
                fill="var(--muted-foreground)"
                fontSize="12"
                fontWeight={500}
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {Math.round(conversion * 100)}%
                <title>
                  {dropFromPrev != null
                    ? `${Math.round(dropFromPrev * 100)}% of previous stage · ${Math.round(conversion * 100)}% of first stage`
                    : "First stage (100% of funnel)"}
                </title>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
