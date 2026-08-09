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
  children: React.ReactNode;
};

export function ChartFrame({
  title,
  description,
  className,
  contentClassName,
  height = 280,
  actions,
  children,
}: ChartFrameProps) {
  const auto = height === "auto";
  const pxHeight = typeof height === "number" ? height : undefined;

  return (
    // No overflow clipping anywhere on the frame: the SVG clips its own marks,
    // and clipping here would cut off tooltips near the card edge and the
    // focus rings of form controls in auto-height frames.
    <Card className={className}>
      {(title || description || actions) && (
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div className="min-w-0 space-y-1">
            {/* Wraps to a second line rather than truncating: several catalog
                titles are long enough that an ellipsis hid what they were. */}
            {title ? (
              <CardTitle className="text-pretty">{title}</CardTitle>
            ) : null}
            {description ? (
              <CardDescription className="line-clamp-1">
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
    </Card>
  );
}

export function ChartEmpty({ label = "No data" }: { label?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <BarChart3 className="h-5 w-5 opacity-50" strokeWidth={1.75} />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Loading placeholder: a muted panel with a soft sheen sweeping across it. */
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("chart-skeleton h-full w-full", className)}
    />
  );
}
