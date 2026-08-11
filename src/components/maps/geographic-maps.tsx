"use client";

import * as React from "react";
import { colorAt } from "@/lib/chart-colors";
import { formatCompact } from "@/lib/utils";
import {
  clamp,
  clusterProjectedPoints,
  createClampedScale,
  createGeoLayout,
  normalizeFeatureValues,
  normalizeMapPoints,
  normalizeMapRoutes,
  validateFeatureCollection,
  validateSchematicRegions,
  type GeoCoordinate,
  type GeoFeature,
  type GeoFeatureCollection,
  type GeoFeatureValueDatum,
  type GeoLayout,
  type GeoPointDatum,
  type GeoProjectionKind,
  type GeoReferenceLayer,
  type MapPointDatum,
  type MapRouteDatum,
  type NormalizedMapPoint,
  type NormalizedMapRoute,
  type PlanarPointDatum,
  type SchematicRegion,
} from "./geo-core";
import {
  DEFAULT_CLUSTER_POINTS,
  DEFAULT_GEO_POINTS,
  DEFAULT_GEO_ROUTES,
} from "./map-fixtures";
import {
  ContinuousLegend,
  GeographicBackdrop,
  InteractiveFeatureLayer,
  MapAttribution,
  MapCanvas,
  MapConfigurationState,
  ProviderMapState,
  SchematicBackdrop,
  SchematicBadge,
} from "./map-primitives";

export type GeographicMapProps = {
  className?: string;
  label?: string;
  description?: string;
  features?: GeoFeatureCollection;
  projection?: GeoProjectionKind;
  featureIdProperty?: string;
  featureLabelProperty?: string;
  fit?: "data" | "world";
  dataAttribution?: string;
};

export type PointSelectionProps = {
  selectedPointId?: string | null;
  defaultSelectedPointId?: string | null;
  onPointSelect?: (pointId: string, point: NormalizedMapPoint) => void;
};

export type BubbleMapProps = GeographicMapProps &
  PointSelectionProps & {
    points?: readonly MapPointDatum[];
    /** Legacy x/y SVG regions. Their use switches the component to schematic mode. */
    regions?: readonly SchematicRegion[];
    showLegend?: boolean;
  };

export type ProportionalSymbolMapProps = BubbleMapProps;
export type MarkerMapProps = BubbleMapProps;
export type CustomIconMarkerMapProps = BubbleMapProps;
export type ImageMarkerMapProps = BubbleMapProps;
export type Column3DMapProps = BubbleMapProps & {
  /** Compatibility alias for `points`. */
  columns?: readonly MapPointDatum[];
};

type ProjectedMapPoint = NormalizedMapPoint & { x: number; y: number };

type PointLayout =
  | {
      ok: true;
      mode: "geographic" | "schematic";
      points: readonly ProjectedMapPoint[];
      geo?: GeoLayout;
    }
  | { ok: false; message: string };

function fitPlanarPoints(
  points: readonly NormalizedMapPoint[],
  preserveCoordinates: boolean,
): readonly ProjectedMapPoint[] {
  if (preserveCoordinates) {
    return points.map((point) => ({ ...point, x: point.x!, y: point.y! }));
  }
  const xs = points.map((point) => point.x!);
  const ys = points.map((point) => point.y!);
  const minX = xs.reduce((minimum, value) => Math.min(minimum, value), Infinity);
  const maxX = xs.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
  const minY = ys.reduce((minimum, value) => Math.min(minimum, value), Infinity);
  const maxY = ys.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min(340 / spanX, 220 / spanY);
  const usedWidth = spanX * scale;
  const usedHeight = spanY * scale;
  return points.map((point) => ({
    ...point,
    x: (400 - usedWidth) / 2 + (point.x! - minX) * scale,
    y: (280 - usedHeight) / 2 + (point.y! - minY) * scale,
  }));
}

function buildPointLayout(
  points: readonly MapPointDatum[],
  options: Pick<
    BubbleMapProps,
    | "features"
    | "projection"
    | "featureIdProperty"
    | "featureLabelProperty"
    | "fit"
    | "regions"
  >,
): PointLayout {
  const normalized = normalizeMapPoints(points);
  if (!normalized.ok) return normalized;
  const mode = normalized.data[0]!.mode;
  if (mode === "schematic") {
    if (options.features) {
      return {
        ok: false,
        message: "GeoJSON features cannot be combined with schematic x/y points.",
      };
    }
    if (options.regions) {
      const validatedRegions = validateSchematicRegions(options.regions);
      if (!validatedRegions.ok) return validatedRegions;
    }
    return {
      ok: true,
      mode,
      points: fitPlanarPoints(normalized.data, Boolean(options.regions)),
    };
  }
  if (options.regions) {
    return {
      ok: false,
      message: "Schematic SVG regions cannot be combined with longitude/latitude points.",
    };
  }
  const coordinates = normalized.data.map(
    (point) => [point.longitude!, point.latitude!] as GeoCoordinate,
  );
  const geo = createGeoLayout({
    features: options.features,
    coordinates,
    projection: options.projection,
    idProperty: options.featureIdProperty,
    labelProperty: options.featureLabelProperty,
    fit: options.fit,
  });
  if (!geo.ok) return geo;
  const projected: ProjectedMapPoint[] = [];
  for (const point of normalized.data) {
    const position = geo.data.project([point.longitude!, point.latitude!]);
    if (!position) {
      return {
        ok: false,
        message: `Map point ${JSON.stringify(point.id)} cannot be projected.`,
      };
    }
    projected.push({ ...point, x: position[0], y: position[1] });
  }
  return { ok: true, mode, points: projected, geo: geo.data };
}

type PointMapVariant =
  | "bubble"
  | "proportional"
  | "marker"
  | "icon"
  | "image"
  | "column";

function pinPath(size: number) {
  return `M0 ${-size}C${size * 0.55} ${-size} ${size} ${-size * 0.45} ${size} 0C${size} ${size * 0.55} 0 ${size * 1.4} 0 ${size * 1.4}C0 ${size * 1.4} ${-size} ${size * 0.55} ${-size} 0C${-size} ${-size * 0.45} ${-size * 0.55} ${-size} 0 ${-size}Z`;
}

function PointMark({
  point,
  index,
  variant,
  radius,
}: {
  point: ProjectedMapPoint;
  index: number;
  variant: PointMapVariant;
  radius: number;
}) {
  const color = point.color || colorAt(index);
  if (variant === "bubble") {
    return (
      <>
        <circle r={radius} fill={color} fillOpacity={0.25} stroke={color} strokeOpacity={0.75} />
        <circle r={Math.max(2.5, radius * 0.48)} fill={color} fillOpacity={0.78} stroke="var(--card)" strokeWidth={1} />
      </>
    );
  }
  if (variant === "proportional") {
    return (
      <>
        <circle r={radius} fill="var(--card)" fillOpacity={0.25} stroke={color} strokeWidth={2} />
        <circle r={2.5} fill={color} />
      </>
    );
  }
  if (variant === "marker") {
    return (
      <>
        <path d={pinPath(7.5)} fill={color} stroke="var(--card)" strokeWidth={1} />
        <circle cy={-2.6} r={2.1} fill="var(--card)" />
      </>
    );
  }
  if (variant === "icon") {
    return (
      <>
        <circle r={11} fill={color} fillOpacity={0.18} stroke={color} />
        <text textAnchor="middle" dominantBaseline="central" fill={color} fontSize={13} fontWeight={800}>
          {point.symbol || ["★", "◆", "●", "▲", "■"][index % 5]}
        </text>
      </>
    );
  }
  if (variant === "image") {
    return point.imageUrl ? (
      <>
        <rect x={-12} y={-12} width={24} height={24} rx={5} fill="var(--card)" stroke={color} strokeWidth={1.5} />
        <image href={point.imageUrl} x={-10} y={-10} width={20} height={20} preserveAspectRatio="xMidYMid slice" />
      </>
    ) : (
      <>
        <rect x={-11} y={-11} width={22} height={22} rx={5} fill={color} fillOpacity={0.25} stroke={color} />
        <text textAnchor="middle" dominantBaseline="central" fill="var(--foreground)" fontSize={9} fontWeight={700}>
          {point.label.slice(0, 1).toUpperCase()}
        </text>
      </>
    );
  }
  const height = clamp(radius * 2.5, 8, 64);
  const width = 12;
  return (
    <g transform="translate(-6,5)">
      <path d={`M0 0L${width} -4L${width} ${-height - 4}L0 ${-height}Z`} fill={color} fillOpacity={0.88} />
      <path d={`M${width} -4L${width + 5} 0L${width + 5} ${-height}L${width} ${-height - 4}Z`} fill={color} fillOpacity={0.62} />
      <path d={`M0 ${-height}L${width} ${-height - 4}L${width + 5} ${-height}L5 ${-height + 4}Z`} fill={color} />
    </g>
  );
}

function PointMap({
  variant,
  title,
  points,
  className,
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
  regions,
  showLegend = true,
  selectedPointId,
  defaultSelectedPointId = null,
  onPointSelect,
}: BubbleMapProps & {
  variant: PointMapVariant;
  title: string;
  points: readonly MapPointDatum[];
}) {
  const layout = React.useMemo(
    () =>
      buildPointLayout(points, {
        features,
        projection,
        featureIdProperty,
        featureLabelProperty,
        fit,
        regions,
      }),
    [features, featureIdProperty, featureLabelProperty, fit, points, projection, regions],
  );
  const [internalSelection, setInternalSelection] = React.useState<string | null>(
    defaultSelectedPointId,
  );
  const selected = selectedPointId === undefined ? internalSelection : selectedPointId;
  if (!layout.ok) return <MapConfigurationState title={title} message={layout.message} className={className} />;
  const requestedSelection = selectedPointId ?? defaultSelectedPointId;
  if (requestedSelection && !layout.points.some((point) => point.id === requestedSelection)) {
    return (
      <MapConfigurationState
        title={title}
        message={`Selected point id ${JSON.stringify(requestedSelection)} does not exist.`}
        className={className}
      />
    );
  }
  const scale = createClampedScale(
    layout.points.map((point) => point.value),
    variant === "column" ? [5, 28] : [5, 26],
    "sqrt",
  );
  const isGeographic = layout.mode === "geographic" && layout.geo;
  const resolvedDescription =
    description ??
    `${layout.points.length} ${layout.mode === "geographic" ? "longitude/latitude points in a provider-free projection" : "x/y points in schematic compatibility mode"}.`;
  return (
    <MapCanvas
      className={className}
      title={title}
      description={resolvedDescription}
      interactive
      kind={layout.mode}
    >
      {isGeographic ? (
        <GeographicBackdrop layout={layout.geo!} />
      ) : (
        <SchematicBackdrop regions={regions} />
      )}
      <g role="group" aria-label={`${title} points`}>
        {layout.points.map((point, index) => {
          const radius = scale.map(point.value);
          const label = `${point.label}: ${formatCompact(point.value)}${layout.mode === "geographic" ? ` at ${point.latitude!.toFixed(3)}, ${point.longitude!.toFixed(3)}` : " schematic units"}`;
          const isSelected = selected === point.id;
          return (
            <g
              key={point.id}
              transform={`translate(${point.x},${point.y})`}
              tabIndex={0}
              role="button"
              aria-label={label}
              aria-pressed={isSelected}
              onClick={() => {
                if (selectedPointId === undefined) setInternalSelection(point.id);
                onPointSelect?.(point.id, point);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  if (selectedPointId === undefined) setInternalSelection(point.id);
                  onPointSelect?.(point.id, point);
                }
              }}
            >
              <title>{label}</title>
              {isSelected ? <circle r={Math.max(14, radius + 4)} fill="none" stroke="var(--foreground)" strokeWidth={2} /> : null}
              <PointMark point={point} index={index} variant={variant} radius={radius} />
              <text
                y={variant === "column" ? 16 : radius + 11}
                textAnchor="middle"
                fill="var(--foreground)"
                fontSize={7.5}
                fontWeight={500}
                pointerEvents="none"
              >
                {point.label.length > 12 ? `${point.label.slice(0, 11)}…` : point.label}
              </text>
            </g>
          );
        })}
      </g>
      {showLegend && ["bubble", "proportional", "column"].includes(variant) ? (
        <ContinuousLegend minimum={scale.minimum} maximum={scale.maximum} title="Value" />
      ) : null}
      {isGeographic ? (
        <MapAttribution
          text={dataAttribution || `Provider-free · ${layout.geo!.projection} projection`}
        />
      ) : (
        <SchematicBadge />
      )}
    </MapCanvas>
  );
}

export function BubbleMap({ points = DEFAULT_GEO_POINTS, label = "Bubble map", ...props }: BubbleMapProps = {}) {
  return <PointMap {...props} points={points} title={label} variant="bubble" />;
}

export function ProportionalSymbolMap({
  points = DEFAULT_GEO_POINTS,
  label = "Proportional symbol map",
  ...props
}: ProportionalSymbolMapProps = {}) {
  return <PointMap {...props} points={points} title={label} variant="proportional" />;
}

export function MarkerMap({ points = DEFAULT_GEO_POINTS, label = "Marker map", ...props }: MarkerMapProps = {}) {
  return <PointMap {...props} points={points} title={label} variant="marker" showLegend={false} />;
}

export function CustomIconMarkerMap({
  points = DEFAULT_GEO_POINTS,
  label = "Custom icon marker map",
  ...props
}: CustomIconMarkerMapProps = {}) {
  return <PointMap {...props} points={points} title={label} variant="icon" showLegend={false} />;
}

export function ImageMarkerMap({
  points = DEFAULT_GEO_POINTS,
  label = "Image marker map",
  ...props
}: ImageMarkerMapProps = {}) {
  return <PointMap {...props} points={points} title={label} variant="image" showLegend={false} />;
}

export function Column3DMap({
  points,
  columns,
  label = "Isometric column map",
  ...props
}: Column3DMapProps = {}) {
  return (
    <PointMap
      {...props}
      points={columns ?? points ?? DEFAULT_GEO_POINTS}
      title={label}
      variant="column"
    />
  );
}

export type ChoroplethMapProps = GeographicMapProps & {
  data?: readonly GeoFeatureValueDatum[];
  values?: Readonly<Record<string, number>>;
  regions?: readonly SchematicRegion[];
  selectedFeatureId?: string | null;
  defaultSelectedFeatureId?: string | null;
  onFeatureSelect?: (featureId: string, feature?: GeoFeature) => void;
  showLegend?: boolean;
  showLabels?: boolean;
  legendTitle?: string;
};

export type HeatMapGeoProps = ChoroplethMapProps;
export type FilledChoroplethMapProps = ChoroplethMapProps;

function colorForNormalized(value: number) {
  return colorAt(Math.floor(clamp(value, 0, 1) * 5));
}

function SchematicChoropleth({
  regions,
  values,
  title,
  description,
  className,
  variant,
  selectedFeatureId,
  defaultSelectedFeatureId = null,
  onFeatureSelect,
  showLegend,
  showLabels,
  legendTitle,
}: {
  regions: readonly SchematicRegion[];
  values: ReadonlyMap<string, GeoFeatureValueDatum>;
  title: string;
  description?: string;
  className?: string;
  variant: "filled" | "heat";
  selectedFeatureId?: string | null;
  defaultSelectedFeatureId?: string | null;
  onFeatureSelect?: (featureId: string, feature?: GeoFeature) => void;
  showLegend: boolean;
  showLabels: boolean;
  legendTitle: string;
}) {
  const groupId = React.useId().replace(/:/g, "");
  const [internalSelection, setInternalSelection] = React.useState<string | null>(
    defaultSelectedFeatureId,
  );
  const selected = selectedFeatureId === undefined ? internalSelection : selectedFeatureId;
  const numeric = regions.flatMap((region) => {
    const datum = values.get(region.id);
    return datum ? [datum.value] : [];
  });
  const scale = createClampedScale(numeric, [0, 1]);
  return (
    <MapCanvas
      className={className}
      title={`Schematic ${title}`}
      description={description ?? `${regions.length} SVG diagram regions joined by id; no geographic projection.`}
      interactive
      kind="schematic"
    >
      <SchematicBackdrop regions={regions} />
      <g role="group" aria-label="Schematic regions">
      {regions.map((region, index) => {
        const datum = values.get(region.id);
        const normalized = datum ? scale.map(datum.value) : 0;
        const label = `${datum?.label || region.label}: ${datum ? datum.value : "No data"}`;
        const isSelected = selected === region.id;
        const select = () => {
          if (selectedFeatureId === undefined) setInternalSelection(region.id);
          onFeatureSelect?.(region.id);
        };
        return (
          <g
            key={region.id}
            tabIndex={0}
            role="button"
            aria-label={label}
            aria-pressed={isSelected}
            data-schematic-region-group={groupId}
            data-schematic-region-index={index}
            onClick={select}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                select();
                return;
              }
              let next = index;
              if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                next = (index + 1) % regions.length;
              } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                next = (index - 1 + regions.length) % regions.length;
              } else if (event.key === "Home") {
                next = 0;
              } else if (event.key === "End") {
                next = regions.length - 1;
              } else {
                return;
              }
              event.preventDefault();
              event.currentTarget.ownerSVGElement
                ?.querySelector<SVGGElement>(
                  `[data-schematic-region-group="${groupId}"][data-schematic-region-index="${next}"]`,
                )
                ?.focus();
            }}
          >
            <title>{label}</title>
            <path
              d={region.path}
              fill={datum ? colorForNormalized(normalized) : "var(--muted)"}
              fillOpacity={variant === "heat" ? 0.2 + normalized * 0.68 : 0.82}
              stroke={isSelected ? "var(--foreground)" : "var(--card)"}
              strokeWidth={isSelected ? 2.2 : 1.2}
            />
            {variant === "heat" && datum ? (
              <circle
                cx={region.cx}
                cy={region.cy}
                r={3 + normalized * 8}
                fill={colorForNormalized(normalized)}
                fillOpacity={0.55}
              />
            ) : null}
            {showLabels ? (
              <text
                x={region.cx}
                y={region.cy}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={8}
                fontWeight={600}
                pointerEvents="none"
              >
                {region.label}
              </text>
            ) : null}
          </g>
        );
      })}
      </g>
      {showLegend ? (
        <ContinuousLegend
          minimum={scale.minimum}
          maximum={scale.maximum}
          title={legendTitle}
        />
      ) : null}
      <SchematicBadge text="SVG region diagram · not geography" />
    </MapCanvas>
  );
}

function ChoroplethMap({
  variant,
  title,
  className,
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
  data,
  values,
  regions,
  selectedFeatureId,
  defaultSelectedFeatureId,
  onFeatureSelect,
  showLegend = true,
  showLabels = true,
  legendTitle = "Value",
}: ChoroplethMapProps & { variant: "filled" | "heat"; title: string }) {
  const joined = React.useMemo(() => normalizeFeatureValues(data, values), [data, values]);
  const schematic = React.useMemo(
    () => (regions ? validateSchematicRegions(regions) : null),
    [regions],
  );
  const layout = React.useMemo(
    () =>
      features
        ? createGeoLayout({
            features,
            projection,
            idProperty: featureIdProperty,
            labelProperty: featureLabelProperty,
            fit,
          })
        : null,
    [features, featureIdProperty, featureLabelProperty, fit, projection],
  );
  if (!joined.ok) return <MapConfigurationState title={title} message={joined.message} className={className} />;
  if (!features) {
    if (regions) {
      if (!schematic?.ok) {
        return (
          <MapConfigurationState
            title={title}
            message={schematic?.message ?? "Unable to validate schematic regions."}
            className={className}
          />
        );
      }
      const regionIds = new Set(schematic.data.map((region) => region.id));
      const unknown = [...joined.data.keys()].find((id) => !regionIds.has(id));
      if (unknown) {
        return (
          <MapConfigurationState
            title={title}
            message={`Feature data id ${JSON.stringify(unknown)} does not match any schematic region.`}
            className={className}
          />
        );
      }
      const requestedSelection = selectedFeatureId ?? defaultSelectedFeatureId;
      if (requestedSelection && !regionIds.has(requestedSelection)) {
        return (
          <MapConfigurationState
            title={title}
            message={`Selected region id ${JSON.stringify(requestedSelection)} does not exist.`}
            className={className}
          />
        );
      }
      return (
        <SchematicChoropleth
          regions={schematic.data}
          values={joined.data}
          title={title}
          description={description}
          className={className}
          variant={variant}
          selectedFeatureId={selectedFeatureId}
          defaultSelectedFeatureId={defaultSelectedFeatureId}
          onFeatureSelect={onFeatureSelect}
          showLegend={showLegend}
          showLabels={showLabels}
          legendTitle={legendTitle}
        />
      );
    }
    return (
      <MapConfigurationState
        title={title}
        message="Provide a GeoJSON FeatureCollection with stable feature ids and joined values. No invented country or administrative boundaries are bundled."
        attribution="Boundary data and source attribution required"
        className={className}
      />
    );
  }
  if (!layout?.ok) {
    return <MapConfigurationState title={title} message={layout?.message || "Unable to create geographic layout."} className={className} />;
  }
  const featureIds = new Set(layout.data.features.map((feature) => feature.id));
  const unknown = [...joined.data.keys()].find((id) => !featureIds.has(id));
  if (unknown) {
    return (
      <MapConfigurationState
        title={title}
        message={`Feature data id ${JSON.stringify(unknown)} does not match any GeoJSON feature.`}
        className={className}
      />
    );
  }
  const requestedSelection = selectedFeatureId ?? defaultSelectedFeatureId;
  if (requestedSelection && !featureIds.has(requestedSelection)) {
    return (
      <MapConfigurationState
        title={title}
        message={`Selected feature id ${JSON.stringify(requestedSelection)} does not exist.`}
        className={className}
      />
    );
  }
  const numeric = layout.data.features.flatMap((feature) => {
    const datum = joined.data.get(feature.id);
    return datum ? [datum.value] : [];
  });
  const scale = createClampedScale(numeric, [0, 1]);
  return (
    <MapCanvas
      className={className}
      title={title}
      description={description ?? `${layout.data.features.length} projected GeoJSON features joined to ${numeric.length} values by stable id.`}
      interactive
    >
      <GeographicBackdrop layout={layout.data} showFeatureBase={false} />
      <InteractiveFeatureLayer
        features={layout.data.features}
        selectedFeatureId={selectedFeatureId}
        defaultSelectedFeatureId={defaultSelectedFeatureId}
        onFeatureSelect={(id, feature) => onFeatureSelect?.(id, feature.feature)}
        showLabels={showLabels}
        fill={(feature) => {
          const datum = joined.data.get(feature.id);
          return datum ? datum.color || colorForNormalized(scale.map(datum.value)) : "var(--muted)";
        }}
        label={(feature) => {
          const datum = joined.data.get(feature.id);
          return `${datum?.label || feature.label}: ${datum ? datum.value : "No data"}`;
        }}
      />
      {variant === "heat"
        ? layout.data.features.map((feature) => {
            const datum = joined.data.get(feature.id);
            if (!datum) return null;
            const normalized = scale.map(datum.value);
            return (
              <circle
                key={`${feature.id}-heat`}
                cx={feature.centroid[0]}
                cy={feature.centroid[1]}
                r={3 + normalized * 9}
                fill={datum.color || colorForNormalized(normalized)}
                fillOpacity={0.4}
                pointerEvents="none"
              />
            );
          })
        : null}
      {showLegend ? (
        <ContinuousLegend
          minimum={scale.minimum}
          maximum={scale.maximum}
          title={legendTitle}
        />
      ) : null}
      <MapAttribution
        text={dataAttribution || `Provider-free · ${layout.data.projection} · add data attribution`}
      />
    </MapCanvas>
  );
}

export function HeatMapGeo({ label = "Geographic heat map", ...props }: HeatMapGeoProps = {}) {
  return <ChoroplethMap {...props} title={label} variant="heat" />;
}

export function FilledChoroplethMap({
  label = "Filled choropleth map",
  ...props
}: FilledChoroplethMapProps = {}) {
  return <ChoroplethMap {...props} title={label} variant="filled" />;
}

export type PolygonMapProps = ChoroplethMapProps & {
  highlightIds?: readonly string[];
};

export function PolygonMap({
  highlightIds = [],
  values,
  label = "Polygon feature map",
  ...props
}: PolygonMapProps = {}) {
  const highlightValues =
    values ?? Object.fromEntries(highlightIds.map((id) => [id, 1] as const));
  return (
    <FilledChoroplethMap
      {...props}
      values={highlightValues}
      label={label}
      legendTitle="Highlight"
    />
  );
}

export type ShapeMapProps = ChoroplethMapProps;

export function ShapeMap({ label = "Custom GeoJSON shape map", ...props }: ShapeMapProps = {}) {
  return <FilledChoroplethMap {...props} label={label} />;
}

export type CountryMapProps = ChoroplethMapProps;
export type StateMapProps = ChoroplethMapProps;
export type CountyMapProps = ChoroplethMapProps;
export type TerritoryMapProps = ChoroplethMapProps;

export function CountryMap({ label = "Country boundary map", ...props }: CountryMapProps = {}) {
  return <FilledChoroplethMap {...props} label={label} />;
}

export function StateMap({ label = "State or province boundary map", ...props }: StateMapProps = {}) {
  return <FilledChoroplethMap {...props} label={label} />;
}

export function CountyMap({ label = "County boundary map", ...props }: CountyMapProps = {}) {
  return <FilledChoroplethMap {...props} label={label} />;
}

export function TerritoryMap({ label = "Territory boundary map", ...props }: TerritoryMapProps = {}) {
  return <FilledChoroplethMap {...props} label={label} />;
}

export type RouteSelectionProps = {
  selectedRouteId?: string | null;
  defaultSelectedRouteId?: string | null;
  onRouteSelect?: (routeId: string, route: NormalizedMapRoute) => void;
};

export type PathMapProps = GeographicMapProps &
  RouteSelectionProps & {
    routes?: readonly MapRouteDatum[];
    regions?: readonly SchematicRegion[];
    showLegend?: boolean;
  };

export type RouteMapProps = PathMapProps;
export type ArcMapProps = PathMapProps;
export type FlowMapProps = PathMapProps;

type ProjectedRoute = NormalizedMapRoute & {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  geographicPath?: string;
};

type RouteLayout =
  | {
      ok: true;
      mode: "geographic" | "schematic";
      routes: readonly ProjectedRoute[];
      geo?: GeoLayout;
    }
  | { ok: false; message: string };

function fitPlanarRoutePoints(
  routes: readonly NormalizedMapRoute[],
  preserveCoordinates: boolean,
) {
  const coordinates = routes.flatMap((route) => [route.fromPlanar!, route.toPlanar!]);
  if (preserveCoordinates) return coordinates;
  const xs = coordinates.map((coordinate) => coordinate[0]);
  const ys = coordinates.map((coordinate) => coordinate[1]);
  const minX = xs.reduce((minimum, value) => Math.min(minimum, value), Infinity);
  const maxX = xs.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
  const minY = ys.reduce((minimum, value) => Math.min(minimum, value), Infinity);
  const maxY = ys.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
  const spanX = Math.max(maxX - minX, 1);
  const spanY = Math.max(maxY - minY, 1);
  const scale = Math.min(330 / spanX, 210 / spanY);
  const usedWidth = spanX * scale;
  const usedHeight = spanY * scale;
  return coordinates.map(
    (coordinate) =>
      [
        (400 - usedWidth) / 2 + (coordinate[0] - minX) * scale,
        (280 - usedHeight) / 2 + (coordinate[1] - minY) * scale,
      ] as const,
  );
}

function buildRouteLayout(
  routes: readonly MapRouteDatum[],
  options: Pick<
    PathMapProps,
    | "features"
    | "projection"
    | "featureIdProperty"
    | "featureLabelProperty"
    | "fit"
    | "regions"
  >,
): RouteLayout {
  const normalized = normalizeMapRoutes(routes);
  if (!normalized.ok) return normalized;
  const mode = normalized.data[0]!.mode;
  if (mode === "schematic") {
    if (options.features) {
      return {
        ok: false,
        message: "GeoJSON features cannot be combined with schematic x/y routes.",
      };
    }
    if (options.regions) {
      const validatedRegions = validateSchematicRegions(options.regions);
      if (!validatedRegions.ok) return validatedRegions;
    }
    const points = fitPlanarRoutePoints(normalized.data, Boolean(options.regions));
    return {
      ok: true,
      mode,
      routes: normalized.data.map((route, index) => ({
        ...route,
        x1: points[index * 2]![0],
        y1: points[index * 2]![1],
        x2: points[index * 2 + 1]![0],
        y2: points[index * 2 + 1]![1],
      })),
    };
  }
  if (options.regions) {
    return {
      ok: false,
      message: "Schematic SVG regions cannot be combined with longitude/latitude routes.",
    };
  }
  const coordinates = normalized.data.flatMap((route) => [route.fromGeo!, route.toGeo!]);
  const geo = createGeoLayout({
    features: options.features,
    coordinates,
    projection: options.projection,
    idProperty: options.featureIdProperty,
    labelProperty: options.featureLabelProperty,
    fit: options.fit,
  });
  if (!geo.ok) return geo;
  const projected: ProjectedRoute[] = [];
  for (const route of normalized.data) {
    const from = geo.data.project(route.fromGeo!);
    const to = geo.data.project(route.toGeo!);
    const path = geo.data.pathForGeometry({
      type: "LineString",
      coordinates: [route.fromGeo!, route.toGeo!],
    });
    if (!from || !to || !path) {
      return { ok: false, message: `Route ${JSON.stringify(route.id)} cannot be projected.` };
    }
    projected.push({
      ...route,
      x1: from[0],
      y1: from[1],
      x2: to[0],
      y2: to[1],
      geographicPath: path,
    });
  }
  return { ok: true, mode, routes: projected, geo: geo.data };
}

function curvedScreenPath(route: ProjectedRoute, bend = 0.24) {
  const middleX = (route.x1 + route.x2) / 2;
  const middleY = (route.y1 + route.y2) / 2;
  const dx = route.x2 - route.x1;
  const dy = route.y2 - route.y1;
  return `M${route.x1},${route.y1}Q${middleX - dy * bend},${middleY + dx * bend} ${route.x2},${route.y2}`;
}

type RouteVariant = "path" | "route" | "arc" | "flow";

function RouteLayerMap({
  variant,
  title,
  routes,
  className,
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
  regions,
  showLegend = variant === "flow",
  selectedRouteId,
  defaultSelectedRouteId = null,
  onRouteSelect,
}: PathMapProps & { variant: RouteVariant; title: string; routes: readonly MapRouteDatum[] }) {
  const layout = React.useMemo(
    () =>
      buildRouteLayout(routes, {
        features,
        projection,
        featureIdProperty,
        featureLabelProperty,
        fit,
        regions,
      }),
    [features, featureIdProperty, featureLabelProperty, fit, projection, regions, routes],
  );
  const markerPrefix = `map-route-arrow-${React.useId().replace(/:/g, "")}`;
  const [internalSelection, setInternalSelection] = React.useState<string | null>(
    defaultSelectedRouteId,
  );
  const selected = selectedRouteId === undefined ? internalSelection : selectedRouteId;
  if (!layout.ok) return <MapConfigurationState title={title} message={layout.message} className={className} />;
  const requestedSelection = selectedRouteId ?? defaultSelectedRouteId;
  if (requestedSelection && !layout.routes.some((route) => route.id === requestedSelection)) {
    return (
      <MapConfigurationState
        title={title}
        message={`Selected route id ${JSON.stringify(requestedSelection)} does not exist.`}
        className={className}
      />
    );
  }
  const scale = createClampedScale(
    layout.routes.map((route) => route.value),
    variant === "flow" ? [1.5, 9] : [1.4, 3.6],
    "sqrt",
  );
  const isGeographic = layout.mode === "geographic" && layout.geo;
  return (
    <MapCanvas
      className={className}
      title={title}
      description={
        description ??
        `${layout.routes.length} validated ${layout.mode === "geographic" ? "longitude/latitude" : "schematic"} routes${variant === "flow" ? " with value-scaled widths" : ""}.`
      }
      interactive
      kind={layout.mode}
    >
      {isGeographic ? <GeographicBackdrop layout={layout.geo!} /> : <SchematicBackdrop regions={regions} />}
      <defs>
        {layout.routes.map((route, index) => (
          <marker
            key={route.id}
            id={`${markerPrefix}-${index}`}
            markerWidth="7"
            markerHeight="7"
            refX="6"
            refY="3.5"
            orient="auto"
          >
            <path d="M0,0L7,3.5L0,7Z" fill={route.color || colorAt(index)} />
          </marker>
        ))}
      </defs>
      {layout.routes.map((route, index) => {
        const path =
          variant === "arc"
            ? curvedScreenPath(route, 0.28)
            : variant === "path"
              ? `M${route.x1},${route.y1}L${route.x2},${route.y2}`
              : route.geographicPath || `M${route.x1},${route.y1}L${route.x2},${route.y2}`;
        const color = route.color || colorAt(index);
        const label = `${route.label}: ${formatCompact(route.value)}`;
        const isSelected = selected === route.id;
        return (
          <g
            key={route.id}
            tabIndex={0}
            role="button"
            aria-label={label}
            aria-pressed={isSelected}
            onClick={() => {
              if (selectedRouteId === undefined) setInternalSelection(route.id);
              onRouteSelect?.(route.id, route);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                if (selectedRouteId === undefined) setInternalSelection(route.id);
                onRouteSelect?.(route.id, route);
              }
            }}
          >
            <title>{label}</title>
            {isSelected ? (
              <path d={path} fill="none" stroke="var(--foreground)" strokeWidth={scale.map(route.value) + 4} strokeOpacity={0.25} />
            ) : null}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={scale.map(route.value)}
              strokeOpacity={variant === "flow" ? 0.52 : 0.82}
              strokeDasharray={variant === "route" ? "6 4" : undefined}
              strokeLinecap="round"
              markerEnd={variant === "arc" || variant === "flow" ? `url(#${markerPrefix}-${index})` : undefined}
            />
            <circle cx={route.x1} cy={route.y1} r={3.5} fill="var(--card)" stroke={color} strokeWidth={1.5} />
            <circle cx={route.x2} cy={route.y2} r={3.5} fill={color} />
          </g>
        );
      })}
      {showLegend ? <ContinuousLegend minimum={scale.minimum} maximum={scale.maximum} title="Flow" /> : null}
      {isGeographic ? (
        <MapAttribution text={dataAttribution || `Provider-free · ${layout.geo!.projection} projection`} />
      ) : (
        <SchematicBadge text="Schematic routes · no routing engine" />
      )}
    </MapCanvas>
  );
}

export function PathMap({ routes = DEFAULT_GEO_ROUTES, label = "Path map", ...props }: PathMapProps = {}) {
  return <RouteLayerMap {...props} routes={routes} title={label} variant="path" />;
}

export function RouteMap({ routes = DEFAULT_GEO_ROUTES, label = "Route map", ...props }: RouteMapProps = {}) {
  return <RouteLayerMap {...props} routes={routes} title={label} variant="route" />;
}

export function ArcMap({ routes = DEFAULT_GEO_ROUTES, label = "Arc map", ...props }: ArcMapProps = {}) {
  return <RouteLayerMap {...props} routes={routes} title={label} variant="arc" />;
}

export function FlowMap({ routes = DEFAULT_GEO_ROUTES, label = "Flow map", ...props }: FlowMapProps = {}) {
  return <RouteLayerMap {...props} routes={routes} title={label} variant="flow" />;
}

export type PointClusterMapProps = BubbleMapProps & {
  clusterCellSize?: number;
  onClusterSelect?: (pointIds: readonly string[]) => void;
};

export function PointClusterMap({
  points = DEFAULT_CLUSTER_POINTS,
  clusterCellSize = 36,
  onClusterSelect,
  className,
  label = "Point cluster map",
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
  regions,
}: PointClusterMapProps = {}) {
  const layout = React.useMemo(
    () =>
      buildPointLayout(points, {
        features,
        projection,
        featureIdProperty,
        featureLabelProperty,
        fit,
        regions,
      }),
    [features, featureIdProperty, featureLabelProperty, fit, points, projection, regions],
  );
  const clusters = React.useMemo(
    () =>
      layout.ok
        ? clusterProjectedPoints(
            layout.points.map((point) => ({
              id: point.id,
              x: point.x,
              y: point.y,
              value: point.value,
              label: point.label,
            })),
            clusterCellSize,
          )
        : null,
    [clusterCellSize, layout],
  );
  if (!layout.ok) return <MapConfigurationState title={label} message={layout.message} className={className} />;
  if (!clusters?.ok) {
    return <MapConfigurationState title={label} message={clusters?.message || "Unable to cluster points."} className={className} />;
  }
  const isGeographic = layout.mode === "geographic" && layout.geo;
  const radiusScale = createClampedScale(
    clusters.data.map((cluster) => cluster.count),
    [8, 24],
    "sqrt",
  );
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${layout.points.length} points grouped into ${clusters.data.length} deterministic screen-space clusters.`}
      interactive
      kind={layout.mode}
    >
      {isGeographic ? <GeographicBackdrop layout={layout.geo!} /> : <SchematicBackdrop regions={regions} />}
      {layout.points.map((point, index) => (
        <circle key={point.id} cx={point.x} cy={point.y} r={2.5} fill={point.color || colorAt(index)} fillOpacity={0.45}>
          <title>{point.label}</title>
        </circle>
      ))}
      {clusters.data.map((cluster, index) => {
        const radius = radiusScale.map(cluster.count);
        const label = `${cluster.count} point${cluster.count === 1 ? "" : "s"}: ${cluster.labels.join(", ")}; total ${formatCompact(cluster.value)}`;
        return (
          <g
            key={cluster.id}
            tabIndex={onClusterSelect ? 0 : undefined}
            role={onClusterSelect ? "button" : "img"}
            aria-label={label}
            onClick={() => onClusterSelect?.(cluster.pointIds)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClusterSelect?.(cluster.pointIds);
              }
            }}
          >
            <title>{label}</title>
            <circle cx={cluster.x} cy={cluster.y} r={radius + 4} fill={colorAt(index)} fillOpacity={0.17} />
            <circle cx={cluster.x} cy={cluster.y} r={radius} fill={colorAt(index)} stroke="var(--card)" strokeWidth={1.5} />
            <text x={cluster.x} y={cluster.y} textAnchor="middle" dominantBaseline="central" fill="var(--chart-label)" fontSize={10} fontWeight={700}>
              {cluster.count}
            </text>
          </g>
        );
      })}
      {isGeographic ? (
        <MapAttribution text={dataAttribution || `Provider-free · ${layout.geo!.projection} projection`} />
      ) : (
        <SchematicBadge text="Screen-space clusters · schematic mode" />
      )}
    </MapCanvas>
  );
}

export type GeoPieOverlayDatum =
  | (Omit<GeoPointDatum, "value"> & { values: readonly number[] })
  | (Omit<PlanarPointDatum, "value"> & { values: readonly number[] });

export type PieChartMapOverlayProps = GeographicMapProps & {
  overlays?: readonly GeoPieOverlayDatum[];
  regions?: readonly SchematicRegion[];
};

const DEFAULT_PIE_OVERLAYS = DEFAULT_GEO_POINTS.slice(0, 4).map((point, index) => ({
  ...point,
  values: [30 + index * 4, 25, 20, 15],
})) satisfies readonly GeoPieOverlayDatum[];

function pieSlicePath(radius: number, startAngle: number, endAngle: number) {
  const x1 = radius * Math.cos(startAngle);
  const y1 = radius * Math.sin(startAngle);
  const x2 = radius * Math.cos(endAngle);
  const y2 = radius * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return `M0,0L${x1},${y1}A${radius},${radius},0,${large},1,${x2},${y2}Z`;
}

export function PieChartMapOverlay({
  overlays = DEFAULT_PIE_OVERLAYS,
  regions,
  className,
  label = "Pie chart map overlay",
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
}: PieChartMapOverlayProps = {}) {
  const prepared = React.useMemo(
    () => ({
      points: overlays.map<MapPointDatum>((overlay) =>
        "longitude" in overlay
          ? {
              id: overlay.id,
              longitude: overlay.longitude,
              latitude: overlay.latitude,
              label: overlay.label,
              color: overlay.color,
              value: overlay.values.reduce((sum, value) => sum + value, 0),
            }
          : {
              id: overlay.id,
              x: overlay.x,
              y: overlay.y,
              label: overlay.label,
              color: overlay.color,
              value: overlay.values.reduce((sum, value) => sum + value, 0),
            },
      ),
      invalid: overlays.some(
        (overlay) =>
          overlay.values.length === 0 ||
          overlay.values.some((value) => !Number.isFinite(value) || value < 0) ||
          overlay.values.every((value) => value === 0),
      ),
    }),
    [overlays],
  );
  const layout = React.useMemo(
    () =>
      prepared.invalid
        ? ({ ok: false, message: "Pie overlays need at least one positive finite slice." } as const)
        : buildPointLayout(prepared.points, {
            features,
            projection,
            featureIdProperty,
            featureLabelProperty,
            fit,
            regions,
          }),
    [featureIdProperty, featureLabelProperty, features, fit, prepared, projection, regions],
  );
  if (!layout.ok) return <MapConfigurationState title={label} message={layout.message} className={className} />;
  const isGeographic = layout.mode === "geographic" && layout.geo;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${overlays.length} pie overlays positioned by ${layout.mode === "geographic" ? "longitude/latitude" : "x/y"}.`}
      interactive
      kind={layout.mode}
    >
      {isGeographic ? <GeographicBackdrop layout={layout.geo!} /> : <SchematicBackdrop regions={regions} />}
      {layout.points.map((point, pointIndex) => {
        const overlay = overlays[pointIndex]!;
        const total = overlay.values.reduce((sum, value) => sum + value, 0);
        let cursor = -Math.PI / 2;
        return (
          <g key={point.id} transform={`translate(${point.x},${point.y})`} tabIndex={0} role="img" aria-label={`${point.label}: ${overlay.values.join(", ")}`}>
            <title>{`${point.label}: ${overlay.values.join(", ")}`}</title>
            {overlay.values.map((value, index) => {
              const start = cursor;
              const end = start + (value / total) * Math.PI * 2;
              cursor = end;
              return (
                <path
                  key={`${point.id}-slice-${index}`}
                  d={pieSlicePath(15, start, end)}
                  fill={colorAt(index)}
                  stroke="var(--card)"
                  strokeWidth={0.8}
                />
              );
            })}
            <text y={24} textAnchor="middle" fill="var(--foreground)" fontSize={7.5}>
              {point.label}
            </text>
          </g>
        );
      })}
      {isGeographic ? <MapAttribution text={dataAttribution || `Provider-free · ${layout.geo!.projection} projection`} /> : <SchematicBadge />}
    </MapCanvas>
  );
}

export type MapNetworkEdgeDatum = {
  id?: string;
  from: string | number;
  to: string | number;
  value?: number;
  label?: string;
  color?: string;
};

export type NetworkMapProps = GeographicMapProps & {
  nodes?: readonly MapPointDatum[];
  edges?: readonly MapNetworkEdgeDatum[];
  regions?: readonly SchematicRegion[];
};

const DEFAULT_NETWORK_EDGES = [
  { id: "chicago-new-york", from: "chicago", to: "new-york", value: 3 },
  { id: "new-york-london", from: "new-york", to: "london", value: 4 },
  { id: "london-tokyo", from: "london", to: "tokyo", value: 2 },
  { id: "tokyo-sydney", from: "tokyo", to: "sydney", value: 2 },
  { id: "sao-paulo-chicago", from: "sao-paulo", to: "chicago", value: 1 },
] satisfies readonly MapNetworkEdgeDatum[];

export function NetworkMap({
  nodes = DEFAULT_GEO_POINTS,
  edges = DEFAULT_NETWORK_EDGES,
  regions,
  className,
  label = "Geographic network map",
  description,
  features,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
}: NetworkMapProps = {}) {
  const layout = React.useMemo(
    () =>
      buildPointLayout(nodes, {
        features,
        projection,
        featureIdProperty,
        featureLabelProperty,
        fit,
        regions,
      }),
    [features, featureIdProperty, featureLabelProperty, fit, nodes, projection, regions],
  );
  const resolvedEdges = React.useMemo(() => {
    if (!layout.ok) return null;
    if (edges.length === 0) {
      return { error: "Add at least one network edge." } as const;
    }
    const byId = new Map(layout.points.map((point, index) => [point.id, { point, index }]));
    const ids = new Set<string>();
    const result: Array<{
      id: string;
      from: ProjectedMapPoint;
      to: ProjectedMapPoint;
      value: number;
      label: string;
      color?: string;
    }> = [];
    for (const [index, edge] of edges.entries()) {
      const source =
        typeof edge.from === "number"
          ? Number.isInteger(edge.from)
            ? layout.points[edge.from]
            : undefined
          : byId.get(edge.from)?.point;
      const target =
        typeof edge.to === "number"
          ? Number.isInteger(edge.to)
            ? layout.points[edge.to]
            : undefined
          : byId.get(edge.to)?.point;
      if (!source) return { error: `Network edge ${index + 1} has an unresolved source.` } as const;
      if (!target) return { error: `Network edge ${index + 1} has an unresolved target.` } as const;
      if (source.id === target.id) return { error: `Network edge ${index + 1} cannot target itself.` } as const;
      if (edge.value !== undefined && (!Number.isFinite(edge.value) || edge.value <= 0)) {
        return { error: `Network edge ${index + 1} has an invalid value.` } as const;
      }
      const id = edge.id?.trim() || `${source.id}-${target.id}-${index + 1}`;
      if (ids.has(id)) return { error: `Network edge id ${JSON.stringify(id)} is duplicated.` } as const;
      ids.add(id);
      result.push({
        id,
        from: source,
        to: target,
        value: edge.value ?? 1,
        label: edge.label?.trim() || `${source.label} to ${target.label}`,
        ...(edge.color ? { color: edge.color } : {}),
      });
    }
    return { data: result } as const;
  }, [edges, layout]);
  if (!layout.ok) return <MapConfigurationState title={label} message={layout.message} className={className} />;
  if (!resolvedEdges || "error" in resolvedEdges) {
    return (
      <MapConfigurationState
        title={label}
        message={
          resolvedEdges && "error" in resolvedEdges
            ? (resolvedEdges.error ?? "Unable to resolve network edges.")
            : "Unable to resolve network edges."
        }
        className={className}
      />
    );
  }
  const widthScale = createClampedScale(
    resolvedEdges.data.map((edge) => edge.value),
    [1, 5],
    "sqrt",
  );
  const isGeographic = layout.mode === "geographic" && layout.geo;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${layout.points.length} positioned nodes and ${resolvedEdges.data.length} validated id/index edges.`}
      interactive
      kind={layout.mode}
    >
      {isGeographic ? <GeographicBackdrop layout={layout.geo!} /> : <SchematicBackdrop regions={regions} />}
      {resolvedEdges.data.map((edge, index) => {
        const dx = edge.to.x - edge.from.x;
        const dy = edge.to.y - edge.from.y;
        const length = Math.hypot(dx, dy) || 1;
        const ux = dx / length;
        const uy = dy / length;
        const color = edge.color || colorAt(index);
        const accessibleLabel = `${edge.label}: ${formatCompact(edge.value)}`;
        const geographicPath =
          isGeographic &&
          edge.from.longitude !== undefined &&
          edge.from.latitude !== undefined &&
          edge.to.longitude !== undefined &&
          edge.to.latitude !== undefined
            ? layout.geo!.pathForGeometry({
                type: "LineString",
                coordinates: [
                  [edge.from.longitude, edge.from.latitude],
                  [edge.to.longitude, edge.to.latitude],
                ],
              })
            : undefined;
        return (
          <path
            key={edge.id}
            d={
              geographicPath ??
              `M${edge.from.x + ux * 7},${edge.from.y + uy * 7}L${edge.to.x - ux * 7},${edge.to.y - uy * 7}`
            }
            fill="none"
            stroke={color}
            strokeWidth={widthScale.map(edge.value)}
            strokeOpacity={0.58}
            tabIndex={0}
            role="img"
            aria-label={accessibleLabel}
          >
            <title>{accessibleLabel}</title>
          </path>
        );
      })}
      {layout.points.map((point, index) => (
        <g key={point.id} tabIndex={0} role="img" aria-label={point.label}>
          <title>{point.label}</title>
          <circle cx={point.x} cy={point.y} r={8} fill={point.color || colorAt(index)} fillOpacity={0.28} />
          <circle cx={point.x} cy={point.y} r={4.5} fill={point.color || colorAt(index)} stroke="var(--card)" strokeWidth={1.2} />
          <text x={point.x} y={point.y + 15} textAnchor="middle" fill="var(--foreground)" fontSize={7.5}>
            {point.label}
          </text>
        </g>
      ))}
      {isGeographic ? <MapAttribution text={dataAttribution || `Provider-free · ${layout.geo!.projection} projection`} /> : <SchematicBadge />}
    </MapCanvas>
  );
}

export type IsochroneBandDatum = {
  id?: string;
  minutes: number;
  feature: GeoFeature;
  color?: string;
  label?: string;
};

export type IsochroneMapProps = GeographicMapProps & {
  /** Real travel-time polygons supplied by a routing/isochrone engine. */
  bands?: readonly IsochroneBandDatum[];
  origin?: GeoCoordinate;
  /** Legacy schematic center. Used only with `rings`. */
  center?: { x: number; y: number };
  /** Legacy diagram radii; deliberately labeled as diagram units, never minutes. */
  rings?: readonly number[];
};

export function IsochroneMap({
  bands,
  origin,
  center,
  rings,
  className,
  label = "Isochrone map",
  description,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
}: IsochroneMapProps = {}) {
  const geographic = React.useMemo(() => {
    if (!bands) return null;
    if (bands.length === 0) return { ok: false, message: "Add at least one isochrone band." } as const;
    const ids = new Set<string>();
    const features: GeoFeature[] = [];
    const metadata = new Map<string, IsochroneBandDatum>();
    for (const [index, band] of bands.entries()) {
      if (!Number.isFinite(band.minutes) || band.minutes <= 0) {
        return { ok: false, message: `Isochrone band ${index + 1} needs positive minutes.` } as const;
      }
      if (!band.feature.geometry || !["Polygon", "MultiPolygon"].includes(band.feature.geometry.type)) {
        return { ok: false, message: `Isochrone band ${index + 1} must be a Polygon or MultiPolygon feature.` } as const;
      }
      const id = band.id?.trim() || `isochrone-${band.minutes}-${index + 1}`;
      if (ids.has(id)) return { ok: false, message: `Isochrone id ${JSON.stringify(id)} is duplicated.` } as const;
      ids.add(id);
      features.push({
        ...band.feature,
        id,
        properties: { ...(band.feature.properties ?? {}), id, name: band.label || `${band.minutes} minutes` },
      });
      metadata.set(id, { ...band, id });
    }
    const layout = createGeoLayout({
      features: { type: "FeatureCollection", features },
      coordinates: origin ? [origin] : undefined,
      projection,
      idProperty: featureIdProperty,
      labelProperty: featureLabelProperty,
      fit,
    });
    return layout.ok ? ({ ok: true, layout: layout.data, metadata } as const) : layout;
  }, [bands, featureIdProperty, featureLabelProperty, fit, origin, projection]);

  if (bands) {
    if (!geographic?.ok) {
      return <MapConfigurationState title={label} message={geographic?.message || "Unable to build isochrone layout."} className={className} />;
    }
    const sorted = [...geographic.layout.features].sort(
      (a, b) => geographic.metadata.get(b.id)!.minutes - geographic.metadata.get(a.id)!.minutes,
    );
    const originPoint = origin ? geographic.layout.project(origin) : undefined;
    return (
      <MapCanvas
        className={className}
        title={label}
        description={description ?? `${sorted.length} supplied travel-time polygons in a provider-free projection.`}
        interactive
      >
        <GeographicBackdrop layout={geographic.layout} showFeatureBase={false} />
        {sorted.map((feature, index) => {
          const band = geographic.metadata.get(feature.id)!;
          const bandLabel = band.label || `${band.minutes} minute travel-time band`;
          return (
            <path
              key={feature.id}
              d={feature.path}
              fill={band.color || colorAt(index)}
              fillOpacity={0.16 + index * 0.1}
              stroke={band.color || colorAt(index)}
              strokeWidth={1.2}
              tabIndex={0}
              role="img"
              aria-label={bandLabel}
            >
              <title>{bandLabel}</title>
            </path>
          );
        })}
        {originPoint ? (
          <g tabIndex={0} role="img" aria-label="Isochrone origin">
            <title>Isochrone origin</title>
            <circle cx={originPoint[0]} cy={originPoint[1]} r={6} fill={colorAt(0)} stroke="var(--card)" strokeWidth={2} />
          </g>
        ) : null}
        <MapAttribution text={dataAttribution || `Travel-time polygons supplied by consumer · ${geographic.layout.projection}`} />
      </MapCanvas>
    );
  }

  if (rings || center) {
    const resolvedRings = rings ?? [];
    const resolvedCenter = center ?? { x: 200, y: 140 };
    if (
      !Number.isFinite(resolvedCenter.x) ||
      !Number.isFinite(resolvedCenter.y) ||
      resolvedRings.length === 0 ||
      resolvedRings.some((ring) => !Number.isFinite(ring) || ring <= 0)
    ) {
      return (
        <MapConfigurationState
          title="Schematic distance rings"
          message="Provide a finite center and at least one positive ring radius."
          className={className}
        />
      );
    }
    return (
      <MapCanvas
        className={className}
        title="Schematic distance rings"
        description="Concentric x/y diagram radii. These are not routing-derived travel-time isochrones."
        interactive
        kind="schematic"
      >
        <SchematicBackdrop />
        {[...resolvedRings]
          .sort((a, b) => b - a)
          .map((ring, index) => (
            <g key={`${ring}-${index}`} tabIndex={0} role="img" aria-label={`${ring} diagram units`}>
              <title>{`${ring} diagram units`}</title>
              <circle
                cx={resolvedCenter.x}
                cy={resolvedCenter.y}
                r={ring}
                fill={colorAt(index)}
                fillOpacity={0.12 + index * 0.07}
                stroke={colorAt(index)}
              />
            </g>
          ))}
        <circle cx={resolvedCenter.x} cy={resolvedCenter.y} r={5} fill={colorAt(0)} />
        <SchematicBadge text="Distance rings · not travel time" />
      </MapCanvas>
    );
  }

  return (
    <MapConfigurationState
      title={label}
      message="Provide routing-engine isochrone Polygon/MultiPolygon bands and their travel times. Concentric circles are not presented as travel-time geography."
      attribution="Routing or isochrone data source required"
      className={className}
    />
  );
}

export type ReferenceLayerMapProps = GeographicMapProps & {
  layers?: readonly GeoReferenceLayer[];
  regions?: readonly SchematicRegion[];
  showGrid?: boolean;
  showLabels?: boolean;
  showScale?: boolean;
};

type ReferenceLayout =
  | {
      ok: true;
      layout: GeoLayout;
      layerByFeatureId: ReadonlyMap<string, GeoReferenceLayer>;
      layers: readonly GeoReferenceLayer[];
    }
  | { ok: false; message: string };

function buildReferenceLayout(
  layers: readonly GeoReferenceLayer[],
  options: Pick<
    ReferenceLayerMapProps,
    "projection" | "featureIdProperty" | "featureLabelProperty" | "fit"
  >,
): ReferenceLayout {
  if (layers.length === 0) {
    return {
      ok: false,
      message: "Provide at least one GeoJSON reference layer or an explicit schematic region set.",
    };
  }
  const layerIds = new Set<string>();
  const features: GeoFeature[] = [];
  const layerByFeatureId = new Map<string, GeoReferenceLayer>();
  for (const [layerIndex, layer] of layers.entries()) {
    const layerId = layer.id?.trim();
    if (!layerId || !layer.label?.trim()) {
      return { ok: false, message: `Reference layer ${layerIndex + 1} needs an id and label.` };
    }
    if (layerIds.has(layerId)) {
      return { ok: false, message: `Reference layer id ${JSON.stringify(layerId)} is duplicated.` };
    }
    if (
      (layer.fillOpacity !== undefined &&
        (!Number.isFinite(layer.fillOpacity) || layer.fillOpacity < 0 || layer.fillOpacity > 1)) ||
      (layer.strokeWidth !== undefined &&
        (!Number.isFinite(layer.strokeWidth) || layer.strokeWidth < 0))
    ) {
      return {
        ok: false,
        message: `Reference layer ${JSON.stringify(layerId)} has invalid visual settings.`,
      };
    }
    const validated = validateFeatureCollection(layer.features, {
      idProperty: options.featureIdProperty,
      labelProperty: options.featureLabelProperty,
    });
    if (!validated.ok) {
      return {
        ok: false,
        message: `Reference layer ${JSON.stringify(layerId)}: ${validated.message}`,
      };
    }
    layerIds.add(layerId);
    for (const normalized of validated.data) {
      const feature = normalized.feature;
      const originalId = normalized.id;
      const id = `${layerId}:${originalId}`;
      const cloned: GeoFeature = {
        ...feature,
        id,
        properties: {
          ...(feature.properties ?? {}),
          id,
          name:
            typeof feature.properties?.[options.featureLabelProperty ?? "name"] === "string"
              ? feature.properties[options.featureLabelProperty ?? "name"]
              : normalized.label,
        },
      };
      features.push(cloned);
      layerByFeatureId.set(id, layer);
    }
  }
  const layout = createGeoLayout({
    features: { type: "FeatureCollection", features },
    projection: options.projection,
    idProperty: "id",
    labelProperty: "name",
    fit: options.fit,
  });
  return layout.ok
    ? { ok: true, layout: layout.data, layerByFeatureId, layers }
    : layout;
}

export function ReferenceLayerMap({
  layers,
  features,
  regions,
  showGrid = true,
  showLabels = true,
  showScale = true,
  className,
  label = "Reference layer map",
  description,
  projection,
  featureIdProperty,
  featureLabelProperty,
  fit,
  dataAttribution,
}: ReferenceLayerMapProps = {}) {
  const resolvedLayers = React.useMemo<readonly GeoReferenceLayer[]>(
    () =>
      layers ??
      (features
        ? [
            {
              id: "reference",
              label: "Reference",
              features,
              color: colorAt(0),
            },
          ]
        : []),
    [features, layers],
  );
  const result = React.useMemo(
    () =>
      buildReferenceLayout(resolvedLayers, {
        projection,
        featureIdProperty,
        featureLabelProperty,
        fit,
      }),
    [featureIdProperty, featureLabelProperty, fit, projection, resolvedLayers],
  );
  if (regions && resolvedLayers.length === 0) {
    return (
      <MapCanvas
        className={className}
        title="Schematic reference diagram"
        description="Authored SVG paths and diagram units; no geographic reference system."
        interactive
        kind="schematic"
      >
        <SchematicBackdrop regions={regions} showGrid={showGrid} />
        {showLabels
          ? regions.map((region) => (
              <text key={region.id} x={region.cx} y={region.cy} textAnchor="middle" fill="var(--foreground)" fontSize={8}>
                {region.label}
              </text>
            ))
          : null}
        {showScale ? (
          <g transform="translate(30,250)" role="img" aria-label="60 diagram units">
            <line x2={60} stroke="var(--foreground)" strokeWidth={2} />
            <text x={30} y={14} textAnchor="middle" fill="var(--muted-foreground)" fontSize={8}>
              60 diagram units
            </text>
          </g>
        ) : null}
        <SchematicBadge text="Reference diagram · no CRS" />
      </MapCanvas>
    );
  }
  if (!result.ok) return <MapConfigurationState title={label} message={result.message} className={className} />;
  const scaleKilometers = showScale
    ? result.layout.distanceForPixels([30, 245], 60)
    : undefined;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${result.layers.length} validated GeoJSON reference layers in a shared ${result.layout.projection} projection.`}
      interactive
    >
      <GeographicBackdrop layout={result.layout} showGraticule={showGrid} showFeatureBase={false} />
      {result.layout.features.map((feature) => {
        const layer = result.layerByFeatureId.get(feature.id)!;
        const color = layer.color || colorAt(result.layers.indexOf(layer));
        const featureLabelValue = `${layer.label}: ${feature.label}`;
        return (
          <g key={feature.id} tabIndex={0} role="img" aria-label={featureLabelValue}>
            <title>{featureLabelValue}</title>
            <path
              d={feature.path}
              fill={color}
              fillOpacity={layer.fillOpacity ?? 0.18}
              stroke={color}
              strokeWidth={layer.strokeWidth ?? 1.1}
              strokeLinejoin="round"
            />
            {showLabels ? (
              <text
                x={feature.centroid[0]}
                y={feature.centroid[1]}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--foreground)"
                fontSize={7.5}
              >
                {feature.label}
              </text>
            ) : null}
          </g>
        );
      })}
      {result.layers.map((layer, index) => (
        <g key={layer.id} transform={`translate(12,${16 + index * 16})`} role="note" aria-label={layer.label}>
          <rect width={8} height={8} rx={2} fill={layer.color || colorAt(index)} />
          <text x={12} y={4.5} dominantBaseline="central" fill="var(--foreground)" fontSize={7.5}>
            {layer.label}
          </text>
        </g>
      ))}
      {scaleKilometers ? (
        <g transform="translate(30,245)" role="img" aria-label={`${formatCompact(scaleKilometers)} kilometer projection scale`}>
          <line x2={60} stroke="var(--foreground)" strokeWidth={2} />
          <line y1={-4} y2={4} stroke="var(--foreground)" strokeWidth={2} />
          <line x1={60} x2={60} y1={-4} y2={4} stroke="var(--foreground)" strokeWidth={2} />
          <text x={30} y={14} textAnchor="middle" fill="var(--foreground)" fontSize={8}>
            {formatCompact(scaleKilometers)} km
          </text>
        </g>
      ) : null}
      <MapAttribution
        text={dataAttribution || `Provider-free · ${result.layout.projection} · source attribution not supplied`}
      />
    </MapCanvas>
  );
}

export type ProviderMapAdapterProps = {
  className?: string;
};

export function AzureMapsAdapter({ className }: ProviderMapAdapterProps = {}) {
  return (
    <ProviderMapState
      provider="Azure Maps"
      requirement="Configure the Azure Maps Web SDK, an authorized account/key flow, tiles, and required attribution before rendering provider content."
      className={className}
    />
  );
}

export function ArcGISMapsAdapter({ className }: ProviderMapAdapterProps = {}) {
  return (
    <ProviderMapState
      provider="ArcGIS"
      requirement="Configure the ArcGIS Maps SDK, portal or service access, licensed layers, and required attribution before rendering provider content."
      className={className}
    />
  );
}

export function BingMapsAdapter({ className }: ProviderMapAdapterProps = {}) {
  return (
    <ProviderMapState
      provider="Bing Maps"
      requirement="Configure an authorized Bing Maps integration and required tile attribution. TileGridMap is intentionally not used as a substitute."
      className={className}
    />
  );
}

export function EsriShapefileAdapter({ className }: ProviderMapAdapterProps = {}) {
  return (
    <ProviderMapState
      provider="Esri shapefile"
      requirement="Parse and project an authorized shapefile into GeoJSON, then pass the resulting FeatureCollection to ReferenceLayerMap."
      className={className}
    />
  );
}
