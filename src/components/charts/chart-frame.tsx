"use client";

import * as React from "react";
import { BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ChartDataColumn = {
  key: string;
  label: string;
  /** Screen-reader table formatting; visual chart formatting stays independent. */
  format?: (
    value: unknown,
    row: Readonly<Record<string, unknown>>,
    rowIndex: number,
  ) => React.ReactNode;
};

/**
 * Optional text-equivalent for a visual. The table is visually hidden but stays
 * available to assistive technology and copy/navigation commands.
 */
export type ChartAccessibleData = {
  caption?: string;
  columns: readonly ChartDataColumn[];
  rows: readonly Readonly<Record<string, unknown>>[];
};

export type ChartFrameProps = {
  title?: string;
  description?: string;
  className?: string;
  contentClassName?: string;
  /**
   * `"auto"` lets the body size to its content. Charts need a fixed height —
   * Recharts measures its parent on mount — but a panel of form controls or
   * buttons has a natural height, and pinning it leaves dead space below.
   */
  height?: number | string | "auto";
  actions?: React.ReactNode;
  /** Accessible name used when the visible frame intentionally has no title. */
  ariaLabel?: string;
  /** One-sentence takeaway, units, or reading instructions for the visual. */
  accessibleSummary?: string;
  /** Tabular equivalent of the marks for nonvisual reading. */
  accessibleData?: ChartAccessibleData;
  children: React.ReactNode;
};

/**
 * Keeps semantic table layout out of visual flow. Applying `sr-only` directly
 * to a table lets its intrinsic column widths enlarge the document in some
 * browsers even though the table is clipped.
 */
export function ScreenReaderTable({
  children,
  ...props
}: React.ComponentPropsWithoutRef<"table">) {
  return (
    <div className="sr-only">
      <table {...props}>{children}</table>
    </div>
  );
}

function readableValue(value: unknown): React.ReactNode {
  if (value == null || value === "") return "Not available";
  if (typeof value === "number") return Number.isFinite(value) ? value.toLocaleString() : "Not available";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toLocaleString();
  if (Array.isArray(value)) return value.map(String).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "Data value";
    }
  }
  return String(value);
}

function AccessibleChartTable({
  data,
  fallbackCaption,
}: {
  data: ChartAccessibleData;
  fallbackCaption: string;
}) {
  return (
    <div className="sr-only">
      <table>
        <caption>{data.caption ?? `${fallbackCaption} data`}</caption>
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column.key} scope="col">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {data.columns.map((column, columnIndex) => {
                const value = row[column.key];
                const content = column.format
                  ? column.format(value, row, rowIndex)
                  : readableValue(value);
                return columnIndex === 0 ? (
                  <th key={column.key} scope="row">
                    {content}
                  </th>
                ) : (
                  <td key={column.key}>{content}</td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChartFrame({
  title,
  description,
  className,
  contentClassName,
  height = 280,
  actions,
  ariaLabel,
  accessibleSummary,
  accessibleData,
  children,
}: ChartFrameProps) {
  const auto = height === "auto";
  const pxHeight = typeof height === "number" ? height : undefined;
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const titleId = title ? `chart-title-${uid}` : undefined;
  const descriptionId = description ? `chart-description-${uid}` : undefined;
  const summaryId = accessibleSummary ? `chart-summary-${uid}` : undefined;
  const describedBy = [descriptionId, summaryId].filter(Boolean).join(" ") || undefined;
  const accessibleName = title ?? ariaLabel ?? "Chart";

  return (
    // No overflow clipping anywhere on the frame: the SVG clips its own marks,
    // and clipping here would cut off tooltips near the card edge and the
    // focus rings of form controls in auto-height frames.
    <Card
      className={className}
      role="figure"
      aria-labelledby={titleId}
      aria-label={titleId ? undefined : accessibleName}
      aria-describedby={describedBy}
    >
      {(title || description || actions) && (
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="min-w-0 space-y-1">
            {/* Wraps to a second line rather than truncating: several catalog
                titles are long enough that an ellipsis hid what they were. */}
            {title ? (
              <CardTitle id={titleId} className="text-pretty">{title}</CardTitle>
            ) : null}
            {description ? (
              <CardDescription id={descriptionId}>
                {description}
              </CardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </CardHeader>
      )}
      <CardContent
        className={cn(!(title || description || actions) && "pt-5", contentClassName)}
      >
        {/*
          Explicit block sizing (not flex % height) so Recharts ResponsiveContainer
          can measure a non-zero clientWidth/clientHeight. `chart-surface` is the
          positioning context — only attach it when we actually have a plot.
        */}
        <div
          className={cn("relative w-full", !auto && "chart-surface")}
          style={
            auto
              ? undefined
              : { height: pxHeight ?? height, minHeight: pxHeight ?? 200 }
          }
        >
          {children}
        </div>
      </CardContent>
      {accessibleSummary ? (
        <p id={summaryId} className="sr-only">
          {accessibleSummary}
        </p>
      ) : null}
      {accessibleData ? (
        <AccessibleChartTable data={accessibleData} fallbackCaption={accessibleName} />
      ) : null}
    </Card>
  );
}

export function ChartEmpty({ label = "No data" }: { label?: string }) {
  return (
    <div
      className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <BarChart3 aria-hidden="true" className="h-5 w-5 opacity-50" strokeWidth={1.75} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Loading placeholder: a muted panel with a soft sheen sweeping across it. */
export function ChartSkeleton({
  className,
  label = "Loading chart",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("chart-skeleton h-full w-full", className)}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}
