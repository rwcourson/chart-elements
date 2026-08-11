"use client";

import * as React from "react";
import { ImageIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export interface VisualFrameProps {
  className?: string;
  children: React.ReactNode;
  frameTitle?: React.ReactNode;
  /** Set false when composing the visual inside an existing card or chart frame. */
  framed?: boolean;
}

function VisualFrame({
  className,
  children,
  frameTitle,
  framed = true,
}: VisualFrameProps) {
  if (!framed) {
    return <div className={cn("min-w-0", className)}>{children}</div>;
  }

  return (
    <Card className={cn("min-w-0 overflow-hidden", className)}>
      {frameTitle ? (
        <div className="border-b border-border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {frameTitle}
        </div>
      ) : null}
      <CardContent className="min-w-0 p-0">{children}</CardContent>
    </Card>
  );
}

export type ImageFit = "cover" | "contain" | "fill" | "none" | "scale-down";

export interface ImageSourceModel {
  src: string;
  alt: string;
  caption?: React.ReactNode;
}

export interface ImageFallbackState {
  src?: string;
  alt: string;
  reason: "missing" | "error";
}

export type ImageFallback =
  | React.ReactNode
  | ((state: ImageFallbackState) => React.ReactNode);

export interface ImageVisualProps {
  source?: ImageSourceModel;
  src?: string;
  alt?: string;
  caption?: React.ReactNode;
  fallback?: ImageFallback;
  fit?: ImageFit;
  objectPosition?: React.CSSProperties["objectPosition"];
  className?: string;
  imageClassName?: string;
  height?: number | string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

function DefaultImageFallback({ alt, reason }: ImageFallbackState) {
  return (
    <div className="flex h-full min-h-24 w-full flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
      <ImageIcon aria-hidden="true" className="h-8 w-8" />
      <span className="text-xs">{reason === "error" ? `${alt || "Image"} unavailable` : alt || "Image visual"}</span>
    </div>
  );
}

function renderImageFallback(fallback: ImageFallback | undefined, state: ImageFallbackState) {
  if (typeof fallback === "function") return fallback(state);
  if (fallback !== undefined) return fallback;
  return <DefaultImageFallback {...state} />;
}

export function ImageVisual({
  source,
  src,
  alt,
  caption,
  fallback,
  fit = "cover",
  objectPosition = "center",
  className,
  imageClassName,
  height = 200,
  framed = true,
  frameTitle = "Image",
  loading = "lazy",
  decoding = "async",
  onLoad,
  onError,
}: ImageVisualProps) {
  const resolvedSrc = src ?? source?.src;
  const resolvedAlt = alt ?? source?.alt ?? "Image visual";
  const resolvedCaption = caption ?? source?.caption;
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const failureReason: ImageFallbackState["reason"] = resolvedSrc ? "error" : "missing";
  const canRenderImage = Boolean(resolvedSrc && failedSrc !== resolvedSrc);

  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <figure className="min-w-0">
        <div
          className="relative flex min-w-0 items-center justify-center overflow-hidden bg-muted/40"
          style={{ height: typeof height === "number" ? `${height}px` : height }}
        >
          {canRenderImage ? (
            // A native image keeps this library compatible with arbitrary remote and data URLs.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={resolvedSrc}
              src={resolvedSrc}
              alt={resolvedAlt}
              loading={loading}
              decoding={decoding}
              className={cn("h-full min-h-0 w-full min-w-0", imageClassName)}
              style={{ objectFit: fit, objectPosition }}
              onLoad={onLoad}
              onError={(event) => {
                setFailedSrc(resolvedSrc ?? null);
                onError?.(event);
              }}
            />
          ) : (
            <div
              className="h-full min-h-0 w-full min-w-0"
              role={resolvedAlt ? "img" : undefined}
              aria-label={resolvedAlt || undefined}
            >
              {renderImageFallback(fallback, {
                src: resolvedSrc,
                alt: resolvedAlt,
                reason: failureReason,
              })}
            </div>
          )}
        </div>
        {resolvedCaption ? (
          <figcaption className="border-t border-border px-3 py-2 text-xs leading-relaxed text-muted-foreground">
            {resolvedCaption}
          </figcaption>
        ) : null}
      </figure>
    </VisualFrame>
  );
}

function useSvgId(prefix: string) {
  const reactId = React.useId();
  return `${prefix}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

function StaticImageFallback({ id, label }: { id: string; label: string }) {
  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--chart-1)" />
          <stop offset="100%" stopColor="var(--chart-2)" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill={`url(#${id})`} />
      <rect x="104" y="74" width="192" height="52" rx="10" fill="var(--card)" fillOpacity="0.92" />
      <text
        x="200"
        y="107"
        textAnchor="middle"
        fill="var(--foreground)"
        fontSize="18"
        fontWeight="600"
      >
        {label}
      </text>
    </svg>
  );
}

export interface StaticImageProps extends ImageVisualProps {
  placeholderLabel?: string;
}

export function StaticImage({
  source,
  alt,
  fallback,
  height = 160,
  frameTitle = "Static image",
  placeholderLabel = "Static image",
  ...props
}: StaticImageProps) {
  const gradientId = useSvgId("ce-static-image");
  return (
    <ImageVisual
      {...props}
      source={source}
      alt={alt ?? source?.alt ?? "Static image"}
      height={height}
      frameTitle={frameTitle}
      fallback={fallback === undefined
        ? <StaticImageFallback id={gradientId} label={placeholderLabel} />
        : fallback}
    />
  );
}

export interface DynamicImageProps extends ImageVisualProps {
  /** Key used to select an entry from sources and label the default fallback. */
  value?: string;
  sources?: Readonly<Record<string, ImageSourceModel | undefined>>;
}

function DynamicImageFallback({ value }: { value: string }) {
  return (
    <div className="flex h-full min-h-24 items-center justify-center bg-[var(--background-deep)] p-6">
      <div className="w-full max-w-sm min-w-0 rounded-[var(--radius)] border border-border bg-card px-4 py-5 text-center shadow-[var(--card-shadow)]">
        <div className="text-[12px] font-medium uppercase tracking-[0.04em] text-muted-foreground">
          Image unavailable
        </div>
        <div className="mt-1.5 truncate text-lg font-semibold tracking-tight text-foreground">
          {value}
        </div>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Provide a source for this field to render media.
        </p>
      </div>
    </div>
  );
}

export function DynamicImage({
  value = "Q4 Revenue",
  sources,
  source,
  src,
  alt,
  caption,
  fallback,
  height = 160,
  frameTitle = "Dynamic image",
  ...props
}: DynamicImageProps) {
  const selectedSource = source ?? sources?.[value];
  const resolvedSrc = src ?? selectedSource?.src;
  const resolvedAlt = alt ?? selectedSource?.alt ?? value;
  const resolvedCaption = caption ?? selectedSource?.caption;

  return (
    <ImageVisual
      {...props}
      source={selectedSource}
      src={resolvedSrc}
      alt={resolvedAlt}
      caption={resolvedCaption}
      height={height}
      frameTitle={frameTitle}
      fallback={fallback === undefined ? <DynamicImageFallback value={value} /> : fallback}
    />
  );
}

export interface TextBoxProps {
  text?: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function TextBox({
  text = "Add a text box to annotate your report.",
  className,
  align = "left",
  framed = true,
  frameTitle = "Text box",
}: TextBoxProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
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

export interface DynamicTextProps {
  field?: React.ReactNode;
  value?: React.ReactNode;
  className?: string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function DynamicText({
  field = "Total Revenue",
  value = "$2.84M",
  className,
  framed = true,
  frameTitle = "Dynamic text",
}: DynamicTextProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <dl className="flex min-h-[88px] flex-col justify-center gap-1 p-4">
        <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Type aria-hidden="true" className="h-3 w-3" />
          {field}
        </dt>
        <dd className="m-0 text-2xl font-semibold tracking-tight tabular-nums">{value}</dd>
      </dl>
    </VisualFrame>
  );
}

export interface RectangleShapeProps {
  className?: string;
  fill?: string;
  label?: React.ReactNode;
  labelColor?: string;
  ariaLabel?: string;
  width?: number | string;
  height?: number | string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function RectangleShape({
  className,
  fill = "var(--accent)",
  label,
  labelColor = "var(--accent-foreground)",
  ariaLabel,
  width = "100%",
  height = 120,
  framed = true,
  frameTitle = "Rectangle",
}: RectangleShapeProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <div
        className="relative flex max-w-full min-w-0 items-center justify-center overflow-hidden"
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          maxWidth: "100%",
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        <div
          aria-hidden="true"
          className="h-full w-full rounded-sm border border-border/60"
          style={{ backgroundColor: fill }}
        />
        {label ? (
          <span className="absolute max-w-full px-2 text-center text-xs font-medium" style={{ color: labelColor }}>
            {label}
          </span>
        ) : null}
      </div>
    </VisualFrame>
  );
}

export interface OvalShapeProps {
  className?: string;
  fill?: string;
  label?: React.ReactNode;
  labelColor?: string;
  ariaLabel?: string;
  width?: number | string;
  height?: number | string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function OvalShape({
  className,
  fill = "var(--chart-2)",
  label,
  labelColor = "var(--chart-on-2, var(--foreground))",
  ariaLabel,
  width = 160,
  height = 100,
  framed = true,
  frameTitle = "Oval",
}: OvalShapeProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <div className="flex min-w-0 items-center justify-center overflow-hidden p-6">
        <div
          className="flex max-w-full min-w-0 items-center justify-center overflow-hidden rounded-[9999px] border border-border/60"
          role={ariaLabel ? "img" : undefined}
          aria-label={ariaLabel}
          style={{
            width: typeof width === "number" ? `${width}px` : width,
            maxWidth: "100%",
            height: typeof height === "number" ? `${height}px` : height,
            backgroundColor: fill,
          }}
        >
          {label ? (
            <span className="max-w-full px-3 text-center text-xs font-medium" style={{ color: labelColor }}>
              {label}
            </span>
          ) : null}
        </div>
      </div>
    </VisualFrame>
  );
}

export interface LineShapeProps {
  className?: string;
  color?: string;
  orientation?: "horizontal" | "vertical";
  thickness?: number;
  ariaLabel?: string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function LineShape({
  className,
  color = "var(--foreground)",
  orientation = "horizontal",
  thickness = 1,
  ariaLabel,
  framed = true,
  frameTitle = "Line",
}: LineShapeProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <div
        className="flex h-24 min-w-0 items-center justify-center overflow-hidden p-4"
        role="separator"
        aria-orientation={orientation}
        aria-label={ariaLabel}
      >
        <div
          aria-hidden="true"
          className={orientation === "horizontal" ? "w-full" : "h-full"}
          style={orientation === "horizontal"
            ? { height: `${thickness}px`, backgroundColor: color }
            : { width: `${thickness}px`, backgroundColor: color }}
        />
      </div>
    </VisualFrame>
  );
}

export interface ArrowShapeProps {
  className?: string;
  color?: string;
  direction?: "right" | "left" | "up" | "down";
  ariaLabel?: string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

const arrowPaths = {
  right: { viewBox: "0 0 120 24", line: "M4 12 H96", head: "M96 4 L116 12 L96 20 Z" },
  left: { viewBox: "0 0 120 24", line: "M24 12 H116", head: "M24 4 L4 12 L24 20 Z" },
  down: { viewBox: "0 0 24 120", line: "M12 4 V96", head: "M4 96 L12 116 L20 96 Z" },
  up: { viewBox: "0 0 24 120", line: "M12 24 V116", head: "M4 24 L12 4 L20 24 Z" },
} as const;

export function ArrowShape({
  className,
  color = "var(--accent)",
  direction = "right",
  ariaLabel,
  framed = true,
  frameTitle = "Arrow",
}: ArrowShapeProps) {
  const path = arrowPaths[direction];
  const isVertical = direction === "up" || direction === "down";

  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <div className="flex h-24 min-w-0 items-center justify-center overflow-hidden p-4">
        <svg
          viewBox={path.viewBox}
          fill="none"
          className={isVertical ? "h-16 w-8 max-w-full" : "h-8 w-full max-w-[120px]"}
          role="img"
          aria-label={ariaLabel ?? `${direction} arrow`}
        >
          <path d={path.line} stroke={color} strokeWidth="2" strokeLinecap="round" />
          <path d={path.head} fill={color} />
        </svg>
      </div>
    </VisualFrame>
  );
}

export interface ReportShapeProps {
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  value?: React.ReactNode;
  ariaLabel?: string;
  framed?: boolean;
  frameTitle?: React.ReactNode;
}

export function ReportShape({
  className,
  title = "KPI callout",
  subtitle = "vs. prior period",
  value = "+12.4%",
  ariaLabel,
  framed = true,
  frameTitle = "Shape",
}: ReportShapeProps) {
  return (
    <VisualFrame className={className} frameTitle={frameTitle} framed={framed}>
      <div className="flex min-h-[140px] min-w-0 items-center p-4">
        <div
          className="w-full min-w-0 rounded-[var(--radius)] border border-dashed border-[var(--border-strong)] bg-[var(--accent-soft)] px-4 py-3.5"
          role={ariaLabel ? "group" : undefined}
          aria-label={ariaLabel}
        >
          <div className="truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </div>
          <div className="mt-1 truncate text-2xl font-bold tracking-[-0.02em] tabular-nums text-foreground">
            {value}
          </div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</div>
        </div>
      </div>
    </VisualFrame>
  );
}
