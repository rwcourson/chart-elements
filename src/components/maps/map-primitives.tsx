"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { colorAt } from "@/lib/chart-colors";
import type { GeoLayout, GeoLayoutFeature, SchematicRegion } from "./geo-core";

export type MapCanvasProps = {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
  title: string;
  description: string;
  interactive?: boolean;
  kind?: "geographic" | "schematic" | "configuration";
};

export function MapCanvas({
  children,
  className,
  viewBox = "0 0 400 280",
  title,
  description,
  interactive = false,
  kind = "geographic",
}: MapCanvasProps) {
  const id = React.useId().replace(/:/g, "");
  const titleId = `map-title-${id}`;
  const descriptionId = `map-description-${id}`;
  return (
    <svg
      viewBox={viewBox}
      className={cn(
        "h-full w-full select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
      preserveAspectRatio="xMidYMid meet"
      role={interactive ? "group" : "img"}
      tabIndex={interactive ? -1 : 0}
      focusable={interactive ? "false" : "true"}
      aria-labelledby={`${titleId} ${descriptionId}`}
      data-map-kind={kind}
    >
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      {children}
    </svg>
  );
}

export function MapConfigurationState({
  title,
  message,
  className,
  attribution,
}: {
  title: string;
  message: string;
  className?: string;
  attribution?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full min-h-40 w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-[var(--border)] bg-[var(--muted)]/20 px-8 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
        className,
      )}
      role="img"
      aria-label={`${title}. ${message}${attribution ? ` ${attribution}` : ""}`}
      tabIndex={0}
      data-map-kind="configuration"
    >
      <strong className="text-sm font-semibold text-[var(--foreground)]">{title}</strong>
      <span className="max-w-lg text-xs leading-relaxed text-[var(--muted-foreground)]">
        {message}
      </span>
      {attribution ? (
        <span className="text-[10px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          {attribution}
        </span>
      ) : null}
    </div>
  );
}

export function ProviderMapState({
  provider,
  requirement,
  className,
}: {
  provider: string;
  requirement: string;
  className?: string;
}) {
  return (
    <MapConfigurationState
      title={`${provider} adapter`}
      message={`No provider SDK, tiles, credentials, or geographic data are bundled. ${requirement}`}
      attribution={`${provider} integration required`}
      className={className}
    />
  );
}

export function GeographicBackdrop({
  layout,
  showGraticule = true,
  showSphere = true,
  showFeatureBase = true,
}: {
  layout: GeoLayout;
  showGraticule?: boolean;
  showSphere?: boolean;
  showFeatureBase?: boolean;
}) {
  return (
    <g aria-hidden="true">
      {showSphere && layout.spherePath ? (
        <path
          d={layout.spherePath}
          fill="var(--muted)"
          fillOpacity={0.28}
          stroke="var(--border-strong)"
          strokeWidth={0.8}
        />
      ) : null}
      {showGraticule && layout.graticulePath ? (
        <path
          d={layout.graticulePath}
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth={0.55}
          strokeOpacity={0.75}
        />
      ) : null}
      {showFeatureBase
        ? layout.features.map((feature) => (
            <path
              key={feature.id}
              d={feature.path}
              fill="var(--card)"
              fillOpacity={0.82}
              stroke="var(--border-strong)"
              strokeWidth={0.8}
              strokeLinejoin="round"
            />
          ))
        : null}
    </g>
  );
}

export function SchematicBackdrop({
  regions,
  showGrid = true,
}: {
  regions?: readonly SchematicRegion[];
  showGrid?: boolean;
}) {
  const id = React.useId().replace(/:/g, "");
  const patternId = `schematic-grid-${id}`;
  return (
    <g aria-hidden="true">
      <rect width="400" height="280" rx="4" fill="var(--muted)" fillOpacity={0.25} />
      {showGrid ? (
        <>
          <defs>
            <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M20 0H0V20"
                fill="none"
                stroke="var(--chart-grid)"
                strokeWidth={0.5}
                strokeOpacity={0.7}
              />
            </pattern>
          </defs>
          <rect width="400" height="280" fill={`url(#${patternId})`} />
        </>
      ) : null}
      {regions?.map((region) => (
        <path
          key={region.id}
          d={region.path}
          fill="var(--card)"
          fillOpacity={0.88}
          stroke="var(--border-strong)"
          strokeWidth={0.9}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

export function SchematicBadge({ text = "Schematic coordinates · no map provider" }: { text?: string }) {
  const width = Math.max(116, text.length * 4.6 + 12);
  return (
    <g transform={`translate(${396 - width},6)`} aria-label={text} role="note">
      <rect width={width} height={18} rx={5} fill="var(--card)" stroke="var(--border)" />
      <text
        x={width / 2}
        y={9.5}
        textAnchor="middle"
        dominantBaseline="central"
        fill="var(--muted-foreground)"
        fontSize={7.5}
        fontWeight={600}
      >
        {text}
      </text>
    </g>
  );
}

export function MapAttribution({
  text,
  x = 8,
  y = 272,
}: {
  text: string;
  x?: number;
  y?: number;
}) {
  const width = Math.max(88, text.length * 4.2 + 10);
  return (
    <g transform={`translate(${x},${y - 14})`} role="note" aria-label={text}>
      <rect width={width} height={14} rx={3} fill="var(--card)" fillOpacity={0.9} />
      <text
        x={5}
        y={7.5}
        dominantBaseline="central"
        fill="var(--muted-foreground)"
        fontSize={7}
      >
        {text}
      </text>
    </g>
  );
}

export function ContinuousLegend({
  minimum,
  maximum,
  title = "Value",
  colors = [colorAt(0), colorAt(2), colorAt(4)],
  x = 276,
  y = 244,
}: {
  minimum: number;
  maximum: number;
  title?: string;
  colors?: readonly string[];
  x?: number;
  y?: number;
}) {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `map-legend-${id}`;
  const format = (value: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
  return (
    <g
      transform={`translate(${x},${y})`}
      role="img"
      aria-label={`${title}, ${format(minimum)} to ${format(maximum)}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="1">
          {colors.map((color, index) => (
            <stop
              key={`${color}-${index}`}
              offset={`${(index / Math.max(colors.length - 1, 1)) * 100}%`}
              stopColor={color}
            />
          ))}
        </linearGradient>
      </defs>
      <text x={0} y={-5} fill="var(--foreground)" fontSize={7.5} fontWeight={600}>
        {title}
      </text>
      <rect width={108} height={8} rx={2} fill={`url(#${gradientId})`} />
      <text x={0} y={19} fill="var(--muted-foreground)" fontSize={7}>
        {format(minimum)}
      </text>
      <text x={108} y={19} textAnchor="end" fill="var(--muted-foreground)" fontSize={7}>
        {format(maximum)}
      </text>
    </g>
  );
}

export type InteractiveFeatureLayerProps = {
  features: readonly GeoLayoutFeature[];
  fill: (feature: GeoLayoutFeature, index: number) => string;
  label: (feature: GeoLayoutFeature, index: number) => string;
  selectedFeatureId?: string | null;
  defaultSelectedFeatureId?: string | null;
  onFeatureSelect?: (featureId: string, feature: GeoLayoutFeature) => void;
  showLabels?: boolean;
};

export function InteractiveFeatureLayer({
  features,
  fill,
  label,
  selectedFeatureId,
  defaultSelectedFeatureId = null,
  onFeatureSelect,
  showLabels = false,
}: InteractiveFeatureLayerProps) {
  const groupId = React.useId().replace(/:/g, "");
  const [internalSelection, setInternalSelection] = React.useState<string | null>(
    defaultSelectedFeatureId,
  );
  const selected = selectedFeatureId === undefined ? internalSelection : selectedFeatureId;
  const select = (feature: GeoLayoutFeature) => {
    if (selectedFeatureId === undefined) setInternalSelection(feature.id);
    onFeatureSelect?.(feature.id, feature);
  };
  const moveFocus = (event: React.KeyboardEvent<SVGPathElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % features.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + features.length) % features.length;
    } else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = features.length - 1;
    else return false;
    event.preventDefault();
    const target = event.currentTarget.ownerSVGElement?.querySelector<SVGPathElement>(
      `[data-feature-group="${groupId}"][data-feature-index="${next}"]`,
    );
    target?.focus();
    return true;
  };

  return (
    <g role="group" aria-label="Map regions">
      {features.map((feature, index) => {
        const accessibleLabel = label(feature, index);
        const isSelected = selected === feature.id;
        return (
          <g key={feature.id}>
            <path
              id={`map-feature-${groupId}-${index}`}
              d={feature.path}
              fill={fill(feature, index)}
              fillOpacity={isSelected ? 0.96 : 0.78}
              stroke={isSelected ? "var(--foreground)" : "var(--card)"}
              strokeWidth={isSelected ? 2.2 : 1.1}
              strokeLinejoin="round"
              tabIndex={0}
              role="button"
              aria-label={accessibleLabel}
              aria-pressed={isSelected}
              data-feature-group={groupId}
              data-feature-index={index}
              data-feature-id={feature.id}
              onClick={() => select(feature)}
              onKeyDown={(event) => {
                if (moveFocus(event, index)) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(feature);
                }
              }}
            >
              <title>{accessibleLabel}</title>
            </path>
            {showLabels ? (
              <text
                x={feature.centroid[0]}
                y={feature.centroid[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={8}
                fontWeight={600}
                pointerEvents="none"
              >
                {feature.label.length > 14 ? `${feature.label.slice(0, 13)}…` : feature.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
}
