"use client";

import * as React from "react";
import { colorAt } from "@/lib/chart-colors";
import type { PlanarPointDatum } from "./geo-core";
import {
  MapCanvas,
  MapConfigurationState,
  SchematicBackdrop,
  SchematicBadge,
} from "./map-primitives";

export type SchematicMapProps = {
  className?: string;
  label?: string;
  description?: string;
};

export type SchematicRoomDatum = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  value?: number;
  color?: string;
};

export type SchematicZoneDatum = SchematicRoomDatum;
export type SchematicBuildingDatum = SchematicRoomDatum;

const DEFAULT_ROOMS = [
  { id: "lobby", x: 40, y: 40, width: 120, height: 80, label: "Lobby" },
  { id: "conference", x: 160, y: 40, width: 100, height: 60, label: "Conference" },
  { id: "office-a", x: 260, y: 40, width: 100, height: 80, label: "Office A" },
  { id: "office-b", x: 40, y: 150, width: 80, height: 90, label: "Office B" },
  { id: "kitchen", x: 150, y: 120, width: 90, height: 70, label: "Kitchen" },
  { id: "storage", x: 260, y: 150, width: 100, height: 90, label: "Storage" },
] satisfies readonly SchematicRoomDatum[];

const DEFAULT_WAREHOUSE_ZONES = [
  { id: "receiving", x: 30, y: 50, width: 100, height: 180, label: "Receiving" },
  { id: "bulk", x: 140, y: 50, width: 120, height: 100, label: "Bulk storage" },
  { id: "cold", x: 140, y: 160, width: 120, height: 70, label: "Cold storage" },
  { id: "shipping", x: 290, y: 50, width: 90, height: 180, label: "Shipping" },
] satisfies readonly SchematicZoneDatum[];

const DEFAULT_CAMPUS_BUILDINGS = [
  { id: "library", x: 60, y: 50, width: 70, height: 50, label: "Library" },
  { id: "science", x: 180, y: 40, width: 90, height: 60, label: "Science" },
  { id: "arts", x: 300, y: 55, width: 70, height: 45, label: "Arts" },
  { id: "athletics", x: 50, y: 140, width: 100, height: 70, label: "Athletics" },
  { id: "admin", x: 180, y: 130, width: 80, height: 55, label: "Admin" },
  { id: "residence", x: 300, y: 130, width: 80, height: 90, label: "Residence" },
] satisfies readonly SchematicBuildingDatum[];

const DEFAULT_INDOOR_ROUTE = [
  { id: "route-1", x: 40, y: 250, label: "Entrance" },
  { id: "route-2", x: 80, y: 200 },
  { id: "route-3", x: 150, y: 220 },
  { id: "route-4", x: 200, y: 160 },
  { id: "route-5", x: 280, y: 180 },
  { id: "route-6", x: 320, y: 120, label: "Destination" },
] satisfies readonly PlanarPointDatum[];

function validateAreas(areas: readonly SchematicRoomDatum[]) {
  if (areas.length === 0) return "Add at least one schematic area.";
  const ids = new Set<string>();
  for (const [index, area] of areas.entries()) {
    if (!area.id?.trim() || !area.label?.trim()) return `Area ${index + 1} needs an id and label.`;
    if (ids.has(area.id)) return `Area id ${JSON.stringify(area.id)} is duplicated.`;
    if (
      ![area.x, area.y, area.width, area.height].every(Number.isFinite) ||
      area.x < 0 ||
      area.y < 0 ||
      area.width <= 0 ||
      area.height <= 0 ||
      area.x + area.width > 400 ||
      area.y + area.height > 280
    ) {
      return `Area ${JSON.stringify(area.id)} must fit within the 400 by 280 schematic viewBox.`;
    }
    if (area.value !== undefined && (!Number.isFinite(area.value) || area.value < 0)) {
      return `Area ${JSON.stringify(area.id)} has an invalid value.`;
    }
    ids.add(area.id);
  }
  return null;
}

function AreaLayer({
  areas,
  variant = "filled",
}: {
  areas: readonly SchematicRoomDatum[];
  variant?: "filled" | "outline" | "campus";
}) {
  return (
    <g role="group" aria-label="Schematic areas">
      {areas.map((area, index) => {
        const color = area.color || colorAt(index);
        const label = `${area.label}${area.value === undefined ? "" : `, value ${area.value}`}`;
        return (
          <g key={area.id} tabIndex={0} role="img" aria-label={label}>
            <title>{label}</title>
            <rect
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              fill={variant === "outline" ? "var(--card)" : color}
              fillOpacity={variant === "outline" ? 0.9 : variant === "campus" ? 0.42 : 0.16}
              stroke={color}
              strokeWidth={variant === "campus" ? 1.5 : 1.2}
              rx={variant === "campus" ? 5 : 3}
            />
            {variant === "outline" ? (
              <line
                x1={area.x}
                y1={area.y + area.height}
                x2={area.x + area.width}
                y2={area.y + area.height}
                stroke={color}
                strokeWidth={3}
              />
            ) : null}
            <text
              x={variant === "outline" ? area.x + 6 : area.x + area.width / 2}
              y={variant === "outline" ? area.y + 14 : area.y + area.height / 2}
              textAnchor={variant === "outline" ? "start" : "middle"}
              dominantBaseline="central"
              fill="var(--foreground)"
              fontSize={8.5}
              fontWeight={600}
              pointerEvents="none"
            >
              {area.label.length > 16 ? `${area.label.slice(0, 15)}…` : area.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export type FloorPlanMapProps = SchematicMapProps & {
  rooms?: readonly SchematicRoomDatum[];
};

export function FloorPlanMap({
  className,
  rooms = DEFAULT_ROOMS,
  label = "Schematic floor plan",
  description,
}: FloorPlanMapProps = {}) {
  const error = React.useMemo(() => validateAreas(rooms), [rooms]);
  if (error) return <MapConfigurationState title={label} message={error} className={className} />;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${rooms.length} authored x/y room rectangles; not geographic data.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop />
      <rect x={20} y={20} width={360} height={240} fill="none" stroke="var(--border-strong)" strokeWidth={2} rx={4} />
      <AreaLayer areas={rooms} />
      <SchematicBadge text="Schematic floor plan · x/y units" />
    </MapCanvas>
  );
}

export type BuildingLayoutMapProps = FloorPlanMapProps & {
  currentLocation?: PlanarPointDatum | null;
};

export function BuildingLayoutMap({
  className,
  rooms = DEFAULT_ROOMS,
  currentLocation,
  label = "Schematic building layout",
  description,
}: BuildingLayoutMapProps = {}) {
  const error = React.useMemo(() => validateAreas(rooms), [rooms]);
  if (error) return <MapConfigurationState title={label} message={error} className={className} />;
  const location =
    currentLocation === undefined && rooms === DEFAULT_ROOMS
      ? ({ id: "current", x: 200, y: 140, label: "You are here" } satisfies PlanarPointDatum)
      : currentLocation;
  const locationValid =
    !location || (Number.isFinite(location.x) && Number.isFinite(location.y));
  if (!locationValid) {
    return <MapConfigurationState title={label} message="Current location needs finite x/y coordinates." className={className} />;
  }
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${rooms.length} authored building areas in schematic coordinates.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop showGrid={false} />
      <AreaLayer areas={rooms} variant="outline" />
      {location ? (
        <g tabIndex={0} role="img" aria-label={location.label || "Current location"}>
          <title>{location.label || "Current location"}</title>
          <circle cx={location.x} cy={location.y} r={6} fill={colorAt(0)} stroke="var(--card)" strokeWidth={2} />
          <text x={location.x + 10} y={location.y + 3} fill="var(--foreground)" fontSize={8}>
            {location.label || "Current"}
          </text>
        </g>
      ) : null}
      <SchematicBadge text="Building diagram · no indoor provider" />
    </MapCanvas>
  );
}

export type SeatingPlanMapProps = SchematicMapProps & {
  rows?: number;
  cols?: number;
  occupiedSeatIds?: readonly string[];
  selectedSeatId?: string | null;
  defaultSelectedSeatId?: string | null;
  onSeatSelect?: (seatId: string) => void;
};

const DEFAULT_OCCUPIED_SEATS = ["2-4", "2-5", "3-6", "4-3", "5-8", "6-2", "6-9"];

export function SeatingPlanMap({
  className,
  rows = 6,
  cols = 10,
  occupiedSeatIds = DEFAULT_OCCUPIED_SEATS,
  selectedSeatId,
  defaultSelectedSeatId = null,
  onSeatSelect,
  label = "Schematic seating plan",
  description,
}: SeatingPlanMapProps = {}) {
  const [internalSelection, setInternalSelection] = React.useState<string | null>(
    defaultSelectedSeatId,
  );
  const selected = selectedSeatId === undefined ? internalSelection : selectedSeatId;
  if (
    !Number.isInteger(rows) ||
    !Number.isInteger(cols) ||
    rows < 1 ||
    cols < 1 ||
    rows > 20 ||
    cols > 30
  ) {
    return <MapConfigurationState title={label} message="Rows must be 1–20 and columns 1–30." className={className} />;
  }
  const validSeatId = (seatId: string) => {
    const match = /^(\d+)-(\d+)$/.exec(seatId);
    return Boolean(
      match &&
        Number(match[1]) >= 1 &&
        Number(match[1]) <= rows &&
        Number(match[2]) >= 1 &&
        Number(match[2]) <= cols,
    );
  };
  const occupiedIds = new Set<string>();
  for (const seatId of occupiedSeatIds) {
    if (!validSeatId(seatId)) {
      return <MapConfigurationState title={label} message={`Occupied seat id ${JSON.stringify(seatId)} is outside the grid.`} className={className} />;
    }
    if (occupiedIds.has(seatId)) {
      return <MapConfigurationState title={label} message={`Occupied seat id ${JSON.stringify(seatId)} is duplicated.`} className={className} />;
    }
    occupiedIds.add(seatId);
  }
  if (selected && (!validSeatId(selected) || occupiedIds.has(selected))) {
    return <MapConfigurationState title={label} message={`Selected seat id ${JSON.stringify(selected)} is unavailable.`} className={className} />;
  }
  const occupied = occupiedIds;
  const availableWidth = 320;
  const availableHeight = 170;
  const gap = Math.min(5, availableWidth / Math.max(cols * 7, 1));
  const seatWidth = (availableWidth - gap * (cols - 1)) / cols;
  const seatHeight = Math.min(22, (availableHeight - gap * (rows - 1)) / rows);
  const originX = (400 - (seatWidth * cols + gap * (cols - 1))) / 2;
  const originY = 66;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${rows * cols} selectable seats in an authored grid; not geographic.`}
      kind="schematic"
      interactive
    >
      <rect x={24} y={24} width={352} height={232} fill="var(--card)" stroke="var(--border)" rx={6} />
      <text x={200} y={40} textAnchor="middle" fill="var(--foreground)" fontSize={9} fontWeight={700}>
        STAGE
      </text>
      <line x1={90} y1={49} x2={310} y2={49} stroke="var(--border-strong)" strokeWidth={2} />
      {Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, column) => {
          const seatId = `${row + 1}-${column + 1}`;
          const taken = occupied.has(seatId);
          const isSelected = selected === seatId;
          const x = originX + column * (seatWidth + gap);
          const y = originY + row * (seatHeight + gap);
          const seatLabel = `Row ${row + 1}, seat ${column + 1}, ${taken ? "occupied" : "available"}`;
          return (
            <rect
              key={seatId}
              x={x}
              y={y}
              width={seatWidth}
              height={seatHeight}
              rx={Math.min(3, seatWidth / 4)}
              fill={taken ? colorAt(row) : "var(--muted)"}
              fillOpacity={taken ? 0.72 : 0.45}
              stroke={isSelected ? "var(--foreground)" : taken ? colorAt(row) : "var(--border)"}
              strokeWidth={isSelected ? 2 : 1}
              tabIndex={taken ? -1 : 0}
              role={taken ? "img" : "button"}
              aria-label={seatLabel}
              aria-pressed={taken ? undefined : isSelected}
              onClick={
                taken
                  ? undefined
                  : () => {
                      if (selectedSeatId === undefined) setInternalSelection(seatId);
                      onSeatSelect?.(seatId);
                    }
              }
              onKeyDown={
                taken
                  ? undefined
                  : (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        if (selectedSeatId === undefined) setInternalSelection(seatId);
                        onSeatSelect?.(seatId);
                      }
                    }
              }
            >
              <title>{seatLabel}</title>
            </rect>
          );
        }),
      )}
      <SchematicBadge text="Seating grid · not geographic" />
    </MapCanvas>
  );
}

export type WarehouseLayoutMapProps = SchematicMapProps & {
  zones?: readonly SchematicZoneDatum[];
};

export function WarehouseLayoutMap({
  className,
  zones = DEFAULT_WAREHOUSE_ZONES,
  label = "Schematic warehouse layout",
  description,
}: WarehouseLayoutMapProps = {}) {
  const error = React.useMemo(() => validateAreas(zones), [zones]);
  if (error) return <MapConfigurationState title={label} message={error} className={className} />;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${zones.length} authored warehouse zones in x/y coordinates.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop />
      <AreaLayer areas={zones} />
      <SchematicBadge text="Warehouse diagram · x/y units" />
    </MapCanvas>
  );
}

export type CampusMapProps = SchematicMapProps & {
  buildings?: readonly SchematicBuildingDatum[];
};

export function CampusMap({
  className,
  buildings = DEFAULT_CAMPUS_BUILDINGS,
  label = "Schematic campus map",
  description,
}: CampusMapProps = {}) {
  const error = React.useMemo(() => validateAreas(buildings), [buildings]);
  if (error) return <MapConfigurationState title={label} message={error} className={className} />;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${buildings.length} authored building footprints; no geographic projection.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop showGrid={false} />
      <path d="M30 110Q200 80 370 110" fill="none" stroke="var(--chart-grid)" strokeWidth={4} />
      <path d="M50 210Q200 170 350 205" fill="none" stroke="var(--chart-grid)" strokeWidth={3} />
      <AreaLayer areas={buildings} variant="campus" />
      <SchematicBadge text="Campus diagram · no basemap" />
    </MapCanvas>
  );
}

function hexPath(cx: number, cy: number, radius: number) {
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 3) * index - Math.PI / 6;
    return `${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`;
  });
  return `M${points.join("L")}Z`;
}

function heatColor(value: number) {
  const normalized = Math.min(1, Math.max(0, value));
  return colorAt(Math.floor(normalized * 5));
}

export type HexMapProps = SchematicMapProps & {
  values?: readonly number[];
  rows?: number;
  cols?: number;
};

export function HexMap({
  className,
  values,
  rows = 5,
  cols = 7,
  label = "Schematic hex grid",
  description,
}: HexMapProps = {}) {
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows > 10 || cols > 14) {
    return <MapConfigurationState title={label} message="Hex rows must be 1–10 and columns 1–14." className={className} />;
  }
  const count = rows * cols;
  const resolvedValues = values ?? Array.from({ length: count }, (_, index) => ((index * 13) % 100) / 100);
  if (values && values.length !== count) {
    return <MapConfigurationState title={label} message={`Provide exactly ${count} hex values for this grid.`} className={className} />;
  }
  if (resolvedValues.some((value) => !Number.isFinite(value))) {
    return <MapConfigurationState title={label} message="Hex values must be finite numbers." className={className} />;
  }
  const radius = Math.min(20, 145 / Math.max(cols, rows * 1.15));
  const cellWidth = radius * Math.sqrt(3);
  const usedWidth = (cols - 1) * cellWidth + cellWidth + cellWidth / 2;
  const usedHeight = (rows - 1) * radius * 1.5 + radius * 2;
  const originX = (400 - usedWidth) / 2 + radius;
  const originY = (280 - usedHeight) / 2 + radius;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${count} data cells in a regular hex grid; no geographic topology.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop />
      {Array.from({ length: count }, (_, index) => {
        const row = Math.floor(index / cols);
        const column = index % cols;
        const x = originX + column * cellWidth + (row % 2 ? cellWidth / 2 : 0);
        const y = originY + row * radius * 1.5;
        const value = resolvedValues[index] ?? 0;
        return (
          <path
            key={`hex-${row}-${column}`}
            d={hexPath(x, y, radius)}
            fill={heatColor(value)}
            fillOpacity={0.82}
            stroke="var(--card)"
            strokeWidth={1}
            tabIndex={0}
            role="img"
            aria-label={`Hex row ${row + 1}, column ${column + 1}: ${value}`}
          >
            <title>{`Hex row ${row + 1}, column ${column + 1}: ${value}`}</title>
          </path>
        );
      })}
      <SchematicBadge text="Hex grid · no geography" />
    </MapCanvas>
  );
}

export type TileGridMapProps = SchematicMapProps & {
  cols?: number;
  rows?: number;
  values?: readonly number[];
};

export function TileGridMap({
  className,
  cols = 12,
  rows = 7,
  values,
  label = "Schematic tile grid",
  description,
}: TileGridMapProps = {}) {
  if (!Number.isInteger(rows) || !Number.isInteger(cols) || rows < 1 || cols < 1 || rows > 14 || cols > 24) {
    return <MapConfigurationState title={label} message="Tile rows must be 1–14 and columns 1–24." className={className} />;
  }
  const count = rows * cols;
  const resolvedValues = values ?? Array.from({ length: count }, (_, index) => ((index * 7) % 100) / 100);
  if (values && values.length !== count) {
    return <MapConfigurationState title={label} message={`Provide exactly ${count} tile values for this grid.`} className={className} />;
  }
  if (resolvedValues.some((value) => !Number.isFinite(value))) {
    return <MapConfigurationState title={label} message="Tile values must be finite numbers." className={className} />;
  }
  const gap = 2;
  const tileWidth = Math.min(28, (344 - gap * (cols - 1)) / cols);
  const tileHeight = Math.min(28, (204 - gap * (rows - 1)) / rows);
  const usedWidth = tileWidth * cols + gap * (cols - 1);
  const usedHeight = tileHeight * rows + gap * (rows - 1);
  const originX = (400 - usedWidth) / 2;
  const originY = (280 - usedHeight) / 2;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${count} rectangular data cells; this component does not request web map tiles.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop />
      {Array.from({ length: count }, (_, index) => {
        const row = Math.floor(index / cols);
        const column = index % cols;
        const value = resolvedValues[index] ?? 0;
        return (
          <rect
            key={`tile-${row}-${column}`}
            x={originX + column * (tileWidth + gap)}
            y={originY + row * (tileHeight + gap)}
            width={tileWidth}
            height={tileHeight}
            fill={heatColor(value)}
            fillOpacity={0.8}
            stroke="var(--card)"
            strokeWidth={0.5}
            rx={2}
            tabIndex={0}
            role="img"
            aria-label={`Tile row ${row + 1}, column ${column + 1}: ${value}`}
          >
            <title>{`Tile row ${row + 1}, column ${column + 1}: ${value}`}</title>
          </rect>
        );
      })}
      <SchematicBadge text="Data grid · not web tiles" />
    </MapCanvas>
  );
}

export type IndoorMapProps = FloorPlanMapProps & {
  route?: readonly PlanarPointDatum[] | null;
};

export function IndoorMap({
  className,
  rooms = DEFAULT_ROOMS,
  route,
  label = "Schematic indoor map",
  description,
}: IndoorMapProps = {}) {
  const error = React.useMemo(() => validateAreas(rooms), [rooms]);
  if (error) return <MapConfigurationState title={label} message={error} className={className} />;
  const resolvedRoute = route === undefined && rooms === DEFAULT_ROOMS ? DEFAULT_INDOOR_ROUTE : route;
  if (
    resolvedRoute &&
    (resolvedRoute.length < 2 ||
      resolvedRoute.some(
        (point) =>
          !Number.isFinite(point.x) ||
          !Number.isFinite(point.y) ||
          point.x < 0 ||
          point.x > 400 ||
          point.y < 0 ||
          point.y > 280,
      ))
  ) {
    return <MapConfigurationState title={label} message="Indoor routes need at least two finite points inside the 400 by 280 viewBox." className={className} />;
  }
  const routePath = resolvedRoute?.length
    ? `M${resolvedRoute.map((point) => `${point.x},${point.y}`).join("L")}`
    : undefined;
  return (
    <MapCanvas
      className={className}
      title={label}
      description={description ?? `${rooms.length} indoor areas${resolvedRoute?.length ? ` and a ${resolvedRoute.length}-point authored route` : ""}; no positioning provider.`}
      kind="schematic"
      interactive
    >
      <SchematicBackdrop />
      <rect x={25} y={25} width={350} height={230} fill="var(--card)" fillOpacity={0.55} stroke="var(--border-strong)" strokeWidth={2} rx={6} />
      <AreaLayer areas={rooms} />
      {routePath ? (
        <path
          d={routePath}
          fill="none"
          stroke={colorAt(0)}
          strokeWidth={2.2}
          strokeDasharray="5 4"
          strokeLinecap="round"
          role="img"
          aria-label={`Authored indoor route with ${resolvedRoute!.length} points`}
          tabIndex={0}
        >
          <title>{`Authored indoor route with ${resolvedRoute!.length} points`}</title>
        </path>
      ) : null}
      <SchematicBadge text="Indoor diagram · no positioning SDK" />
    </MapCanvas>
  );
}
