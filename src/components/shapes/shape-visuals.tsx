"use client";

import * as React from "react";
import { ImageIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

type VisualFrameProps = {
  className?: string;
  children: React.ReactNode;
  title?: string;
};

function VisualFrame({ className, children, title }: VisualFrameProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      {title ? (
        <div className="border-b border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {title}
        </div>
      ) : null}
      <CardContent className="p-0">{children}</CardContent>
    </Card>
  );
}

export function ImageVisual({
  src,
  alt = "Image visual",
  className,
  height = 200,
}: {
  src?: string;
  alt?: string;
  className?: string;
  height?: number | string;
}) {
  return (
    <VisualFrame className={className} title="Image">
      <div
        className="relative flex items-center justify-center overflow-hidden bg-muted/40"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs">Image visual</span>
          </div>
        )}
      </div>
    </VisualFrame>
  );
}

/**
 * Placeholder artwork is rendered as inline SVG (not a data URI) so that
 * `var(--…)` tokens resolve and the artwork follows light/dark theme.
 */
function PlaceholderSurface({
  className,
  height,
  label,
  children,
}: {
  className?: string;
  height: number | string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <VisualFrame className={className} title="Image">
      <div
        className="relative overflow-hidden"
        style={{ height: typeof height === "number" ? `${height}px` : height }}
      >
        <svg
          viewBox="0 0 400 200"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
          role="img"
          aria-label={label}
        >
          {children}
        </svg>
      </div>
    </VisualFrame>
  );
}

export function StaticImage({
  className,
  height = 160,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <PlaceholderSurface className={className} height={height} label="Static placeholder image">
      <defs>
        <linearGradient id="ce-static-image" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" />
          <stop offset="100%" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#ce-static-image)" />
      <text
        x="200"
        y="108"
        textAnchor="middle"
        fill="var(--chart-label)"
        fontSize="20"
        fontWeight="600"
      >
        Static Image
      </text>
    </PlaceholderSurface>
  );
}

export function DynamicImage({
  value = "Q4 Revenue",
  className,
  height = 160,
}: {
  value?: string;
  className?: string;
  height?: number;
}) {
  return (
    <PlaceholderSurface className={className} height={height} label={value}>
      <rect width="400" height="200" fill="var(--background-deep)" />
      <rect
        x="24"
        y="24"
        width="352"
        height="152"
        rx="12"
        fill="var(--card)"
        stroke="var(--border)"
      />
      <text x="200" y="96" textAnchor="middle" fill="var(--muted-foreground)" fontSize="12">
        Dynamic field
      </text>
      <text
        x="200"
        y="124"
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize="22"
        fontWeight="600"
      >
        {value}
      </text>
    </PlaceholderSurface>
  );
}

export function TextBox({
  text = "Add a text box to annotate your report.",
  className,
  align = "left",
}: {
  text?: string;
  className?: string;
  align?: "left" | "center" | "right";
}) {
  return (
    <VisualFrame className={className} title="Text box">
      <div
        className={cn(
          "min-h-[80px] p-4 text-sm leading-relaxed text-foreground",
          align === "center" && "text-center",
          align === "right" && "text-right",
        )}
      >
        {text}
      </div>
    </VisualFrame>
  );
}

export function DynamicText({
  field = "Total Revenue",
  value = "$2.84M",
  className,
}: {
  field?: string;
  value?: string;
  className?: string;
}) {
  return (
    <VisualFrame className={className} title="Dynamic text">
      <div className="flex min-h-[88px] flex-col justify-center gap-1 p-4">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Type className="h-3 w-3" />
          {field}
        </div>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
      </div>
    </VisualFrame>
  );
}

export function RectangleShape({
  className,
  fill = "var(--accent)",
  label,
  width = "100%",
  height = 120,
}: {
  className?: string;
  fill?: string;
  label?: string;
  width?: number | string;
  height?: number | string;
}) {
  return (
    <VisualFrame className={className} title="Rectangle">
      <div
        className="relative flex items-center justify-center"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        <div
          className="h-full w-full rounded-sm border border-border/60 opacity-90"
          style={{ backgroundColor: fill }}
        />
        {label ? (
          <span className="absolute text-xs font-medium text-[var(--chart-label)] drop-shadow-sm">{label}</span>
        ) : null}
      </div>
    </VisualFrame>
  );
}

export function OvalShape({
  className,
  fill = "var(--chart-2)",
  width = 160,
  height = 100,
}: {
  className?: string;
  fill?: string;
  width?: number;
  height?: number;
}) {
  return (
    <VisualFrame className={className} title="Oval">
      <div className="flex items-center justify-center p-6">
        <div
          className="border border-border/60 opacity-90"
          style={{
            width,
            height,
            borderRadius: "9999px",
            backgroundColor: fill,
          }}
        />
      </div>
    </VisualFrame>
  );
}

export function LineShape({
  className,
  color = "var(--foreground)",
  orientation = "horizontal",
}: {
  className?: string;
  color?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <VisualFrame className={className} title="Line">
      <div className="flex h-24 items-center justify-center p-4">
        <div
          className={cn(
            orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          )}
          style={{ backgroundColor: color }}
        />
      </div>
    </VisualFrame>
  );
}

export function ArrowShape({
  className,
  color = "var(--accent)",
  direction = "right",
}: {
  className?: string;
  color?: string;
  direction?: "right" | "left" | "up" | "down";
}) {
  const rotation = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  }[direction];

  return (
    <VisualFrame className={className} title="Arrow">
      <div className="flex h-24 items-center justify-center p-4">
        <svg
          width="120"
          height="24"
          viewBox="0 0 120 24"
          fill="none"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <path d="M0 12 H96" stroke={color} strokeWidth="2" />
          <path
            d="M96 4 L112 12 L96 20 Z"
            fill={color}
          />
        </svg>
      </div>
    </VisualFrame>
  );
}

export function ReportShape({
  className,
  title = "KPI callout",
  subtitle = "vs. prior period",
  value = "+12.4%",
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  value?: string;
}) {
  return (
    <VisualFrame className={className} title="Shape">
      {/*
        Was a dashed rect with a clip-path that ate the top-right corner — it
        read as a broken selection outline. A complete callout frame is the
        report-shape pattern.
      */}
      <div className="flex min-h-[140px] items-center p-4">
        <div className="w-full rounded-[var(--radius)] border border-dashed border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3.5">
          <div className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 text-2xl font-bold tracking-[-0.02em] tabular-nums text-accent">
            {value}
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </VisualFrame>
  );
}
