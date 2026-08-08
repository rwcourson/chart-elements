"use client";

import * as React from "react";
import { cn, formatCompact } from "@/lib/utils";
import { CHART_COLORS, colorAt } from "@/lib/chart-colors";

/* ─── Shared types & primitives ─────────────────────────────────────────── */

type Point = { x: number; y: number };
type GeoRegion = { id: string; path: string; label: string; cx: number; cy: number };
type MapPoint = Point & { value?: number; label?: string; color?: string };
type MapRoute = { from: Point; to: Point; label?: string };

type MapCanvasProps = {
  children: React.ReactNode;
  className?: string;
  viewBox?: string;
  label?: string;
};

function MapCanvas({
  children,
  className,
  viewBox = "0 0 400 280",
  label = "Map visualization",
}: MapCanvasProps) {
  return (
    <svg
      viewBox={viewBox}
      className={cn("h-full w-full select-none", className)}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={label}
    >
      {children}
    </svg>
  );
}

function MapBackground({ opacity = 0.35 }: { opacity?: number }) {
  return (
  <rect
    x="0"
    y="0"
    width="400"
    height="280"
    fill="var(--muted)"
    opacity={opacity}
    rx="4"
  />
  );
}

function RegionLayer({
  regions,
  fill,
  // Region outlines carry the geography, so they need more presence than a
  // 12%-opacity UI hairline — against a near-white fill it vanished.
  stroke = "var(--border-strong)",
  strokeWidth = 1,
  opacity = 1,
}: {
  regions: GeoRegion[];
  fill?: (region: GeoRegion, i: number) => string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
}) {
  return (
    <g opacity={opacity}>
      {regions.map((r, i) => (
        <path
          key={r.id}
          d={r.path}
          fill={fill ? fill(r, i) : "var(--card)"}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />
      ))}
    </g>
  );
}

function GridPattern({ id = "map-grid" }: { id?: string }) {
  return (
    <defs>
      <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="var(--chart-grid)"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </pattern>
    </defs>
  );
}

/* ─── Sample geo layouts ────────────────────────────────────────────────── */

const COUNTRY_REGIONS: GeoRegion[] = [
  { id: "north", path: "M 48 38 L 168 28 L 188 88 L 108 98 L 38 78 Z", label: "North", cx: 108, cy: 62 },
  { id: "east", path: "M 188 28 L 358 48 L 338 118 L 188 88 Z", label: "East", cx: 262, cy: 72 },
  { id: "west", path: "M 38 78 L 108 98 L 98 168 L 28 148 Z", label: "West", cx: 68, cy: 128 },
  { id: "central", path: "M 108 98 L 188 88 L 198 158 L 118 168 Z", label: "Central", cx: 148, cy: 128 },
  { id: "south", path: "M 98 168 L 198 158 L 218 228 L 88 238 Z", label: "South", cx: 148, cy: 198 },
  { id: "coast", path: "M 198 158 L 338 118 L 348 198 L 218 228 Z", label: "Coast", cx: 268, cy: 178 },
];

const STATE_REGIONS: GeoRegion[] = [
  { id: "s1", path: "M 60 50 L 140 45 L 145 95 L 65 100 Z", label: "Alpha", cx: 102, cy: 72 },
  { id: "s2", path: "M 145 45 L 220 50 L 215 100 L 145 95 Z", label: "Beta", cx: 182, cy: 72 },
  { id: "s3", path: "M 220 50 L 300 55 L 295 105 L 215 100 Z", label: "Gamma", cx: 257, cy: 75 },
  { id: "s4", path: "M 65 100 L 145 95 L 150 155 L 70 160 Z", label: "Delta", cx: 107, cy: 127 },
  { id: "s5", path: "M 145 95 L 215 100 L 220 160 L 150 155 Z", label: "Epsilon", cx: 182, cy: 127 },
  { id: "s6", path: "M 215 100 L 295 105 L 290 165 L 220 160 Z", label: "Zeta", cx: 257, cy: 130 },
  { id: "s7", path: "M 70 160 L 150 155 L 155 215 L 75 220 Z", label: "Eta", cx: 112, cy: 187 },
  { id: "s8", path: "M 150 155 L 220 160 L 225 220 L 155 215 Z", label: "Theta", cx: 187, cy: 187 },
  { id: "s9", path: "M 220 160 L 290 165 L 285 225 L 225 220 Z", label: "Iota", cx: 257, cy: 192 },
];

const COUNTY_REGIONS: GeoRegion[] = STATE_REGIONS.flatMap((s, si) => {
  const ox = si % 3;
  const oy = Math.floor(si / 3);
  const bx = 55 + ox * 95;
  const by = 48 + oy * 72;
  return [
    { id: `${s.id}-a`, path: `M ${bx} ${by} L ${bx + 42} ${by - 3} L ${bx + 44} ${by + 28} L ${bx + 2} ${by + 31} Z`, label: `${s.label} A`, cx: bx + 22, cy: by + 14 },
    { id: `${s.id}-b`, path: `M ${bx + 42} ${by - 3} L ${bx + 78} ${by} L ${bx + 76} ${by + 31} L ${bx + 44} ${by + 28} Z`, label: `${s.label} B`, cx: bx + 60, cy: by + 14 },
  ];
});

const TERRITORY_REGIONS: GeoRegion[] = [
  { id: "t1", path: "M 280 40 L 360 35 L 365 90 L 285 95 Z", label: "Territory I", cx: 322, cy: 62 },
  { id: "t2", path: "M 300 110 L 370 105 L 375 160 L 305 165 Z", label: "Territory II", cx: 337, cy: 137 },
  { id: "t3", path: "M 40 200 L 120 195 L 125 250 L 45 255 Z", label: "Territory III", cx: 82, cy: 225 },
];

const DEFAULT_POINTS: MapPoint[] = [
  { x: 108, y: 62, value: 420, label: "North Hub" },
  { x: 262, y: 72, value: 310, label: "East Port" },
  { x: 68, y: 128, value: 180, label: "West Gate" },
  { x: 148, y: 128, value: 540, label: "Central" },
  { x: 148, y: 198, value: 260, label: "South Bay" },
  { x: 268, y: 178, value: 390, label: "Coast City" },
];

const DEFAULT_ROUTES: MapRoute[] = [
  { from: { x: 108, y: 62 }, to: { x: 148, y: 128 }, label: "N→C" },
  { from: { x: 262, y: 72 }, to: { x: 268, y: 178 }, label: "E→Coast" },
  { from: { x: 68, y: 128 }, to: { x: 148, y: 198 }, label: "W→S" },
  { from: { x: 148, y: 128 }, to: { x: 262, y: 72 }, label: "C→E" },
];

const FLOOR_ROOMS = [
  { id: "lobby", x: 40, y: 40, w: 120, h: 80, label: "Lobby" },
  { id: "conf", x: 160, y: 40, w: 100, h: 60, label: "Conference" },
  { id: "office-a", x: 260, y: 40, w: 100, h: 80, label: "Office A" },
  { id: "office-b", x: 40, y: 150, w: 80, h: 90, label: "Office B" },
  { id: "kitchen", x: 150, y: 120, w: 90, h: 70, label: "Kitchen" },
  { id: "storage", x: 260, y: 150, w: 100, h: 90, label: "Storage" },
];

const WAREHOUSE_ZONES = [
  { id: "recv", x: 30, y: 50, w: 100, h: 180, label: "Receiving" },
  { id: "bulk", x: 140, y: 50, w: 120, h: 100, label: "Bulk Storage" },
  { id: "cold", x: 140, y: 160, w: 120, h: 70, label: "Cold Storage" },
  { id: "ship", x: 290, y: 50, w: 90, h: 180, label: "Shipping" },
];

const CAMPUS_BUILDINGS = [
  { id: "lib", x: 60, y: 50, w: 70, h: 50, label: "Library" },
  { id: "sci", x: 180, y: 40, w: 90, h: 60, label: "Science" },
  { id: "arts", x: 300, y: 55, w: 70, h: 45, label: "Arts" },
  { id: "gym", x: 50, y: 140, w: 100, h: 70, label: "Athletics" },
  { id: "admin", x: 180, y: 130, w: 80, h: 55, label: "Admin" },
  { id: "dorm", x: 300, y: 130, w: 80, h: 90, label: "Residence" },
];

const HEX_COORDS: Point[] = (() => {
  const pts: Point[] = [];
  const r = 22;
  const w = r * 1.732;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const offset = row % 2 === 0 ? 0 : w / 2;
      pts.push({ x: 50 + col * w + offset, y: 40 + row * (r * 1.5) });
    }
  }
  return pts;
})();

function hexPath(cx: number, cy: number, r: number): string {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  });
  return `M ${pts.join(" L ")} Z`;
}

function scaleRadius(value: number, min = 80, max = 520): number {
  const t = (value - min) / (max - min);
  return 6 + t * 22;
}

function choroplethFill(value: number, min = 0.2, max = 1): string {
  const t = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const idx = Math.floor(t * (CHART_COLORS.length - 1));
  return colorAt(idx);
}

function arcPath(from: Point, to: Point, bend = 0.3): string {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

function PieSlice({
  cx,
  cy,
  r,
  startAngle,
  endAngle,
  fill,
}: {
  cx: number;
  cy: number;
  r: number;
  startAngle: number;
  endAngle: number;
  fill: string;
}) {
  const x1 = cx + r * Math.cos(startAngle);
  const y1 = cy + r * Math.sin(startAngle);
  const x2 = cx + r * Math.cos(endAngle);
  const y2 = cy + r * Math.sin(endAngle);
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  return (
    <path
      d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
      fill={fill}
      stroke="var(--card)"
      strokeWidth={0.5}
    />
  );
}

function MiniPie({ cx, cy, values }: { cx: number; cy: number; values: number[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  const r = 14;
  const start = -Math.PI / 2;

  // Precompute slice angles so nothing mutates during render.
  const slices = values.map((v, i) => {
    const startAngle =
      start +
      values.slice(0, i).reduce((sum, p) => sum + (p / total) * Math.PI * 2, 0);
    return { startAngle, endAngle: startAngle + (v / total) * Math.PI * 2, i };
  });

  return (
    <g>
      {slices.map((s) => (
        <PieSlice
          key={s.i}
          cx={cx}
          cy={cy}
          r={r}
          startAngle={s.startAngle}
          endAngle={s.endAngle}
          fill={colorAt(s.i)}
        />
      ))}
      <circle cx={cx} cy={cy} r={r + 1} fill="none" stroke="var(--border)" strokeWidth={0.5} />
    </g>
  );
}

function PinMarker({ x, y, color, size = 10 }: { x: number; y: number; color: string; size?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={`M 0 ${-size} C ${size * 0.55} ${-size} ${size} ${-size * 0.45} ${size} 0 C ${size} ${size * 0.55} 0 ${size * 1.4} 0 ${size * 1.4} C 0 ${size * 1.4} ${-size} ${size * 0.55} ${-size} 0 C ${-size} ${-size * 0.45} ${-size * 0.55} ${-size} 0 ${-size} Z`}
        fill={color}
        stroke="var(--card)"
        strokeWidth={1}
      />
      <circle cx={0} cy={-size * 0.35} r={size * 0.28} fill="var(--card)" />
    </g>
  );
}

function IsometricColumn({
  x,
  y,
  height,
  color,
  width = 14,
}: {
  x: number;
  y: number;
  height: number;
  color: string;
  width?: number;
}) {
  const w = width;
  const h = height;
  const d = w * 0.4;
  return (
    <g>
      <path d={`M ${x} ${y} L ${x + w} ${y - d} L ${x + w} ${y - d - h} L ${x} ${y - h} Z`} fill={color} opacity={0.85} />
      <path d={`M ${x + w} ${y - d} L ${x + w + d} ${y} L ${x + w + d} ${y - h} L ${x + w} ${y - d - h} Z`} fill={color} opacity={0.65} />
      <path d={`M ${x} ${y - h} L ${x + w} ${y - d - h} L ${x + w + d} ${y - h} L ${x + d} ${y - h + d} Z`} fill={color} />
    </g>
  );
}

/* ─── Map components ────────────────────────────────────────────────────── */

export type BubbleMapProps = {
  className?: string;
  points?: MapPoint[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function BubbleMap({ className, points = DEFAULT_POINTS, regions = COUNTRY_REGIONS, label }: BubbleMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Bubble map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.9} />
      {points.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={scaleRadius(p.value ?? 200)}
            fill={p.color ?? colorAt(i)}
            opacity={0.35}
          />
          <circle
            cx={p.x}
            cy={p.y}
            r={scaleRadius(p.value ?? 200) * 0.55}
            fill={p.color ?? colorAt(i)}
            opacity={0.7}
            stroke="var(--card)"
            strokeWidth={1}
          />
        </g>
      ))}
    </MapCanvas>
  );
}

export type ProportionalSymbolMapProps = BubbleMapProps;

export function ProportionalSymbolMap({
  className,
  points = DEFAULT_POINTS,
  regions = COUNTRY_REGIONS,
  label,
}: ProportionalSymbolMapProps) {
  const maxVal = Math.max(...points.map((p) => p.value ?? 0), 1);
  return (
    <MapCanvas className={className} label={label ?? "Proportional symbol map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {points.map((p, i) => {
        const r = Math.sqrt((p.value ?? 100) / maxVal) * 28;
        return (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill="none"
              stroke={p.color ?? colorAt(i)}
              strokeWidth={2}
              opacity={0.9}
            />
            <circle cx={p.x} cy={p.y} r={2.5} fill={p.color ?? colorAt(i)} />
          </g>
        );
      })}
    </MapCanvas>
  );
}

export type HeatMapGeoProps = {
  className?: string;
  regions?: GeoRegion[];
  values?: Record<string, number>;
  /** Accessible name for the map. */
  label?: string;
};

export function HeatMapGeo({
  className,
  regions = COUNTRY_REGIONS,
  values = { north: 0.9, east: 0.6, west: 0.3, central: 0.75, south: 0.45, coast: 0.85 },
  label,
}: HeatMapGeoProps) {
  return (
    <MapCanvas className={className} label={label ?? "Geographic heat map"}>
      <MapBackground opacity={0.2} />
      <defs>
        <linearGradient id="heat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.15} />
          <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0.85} />
        </linearGradient>
      </defs>
      {regions.map((r) => {
        const v = values[r.id] ?? 0.4;
        return (
          <path
            key={r.id}
            d={r.path}
            fill={CHART_COLORS[0]}
            opacity={0.15 + v * 0.75}
            stroke="var(--border)"
            strokeWidth={1}
          />
        );
      })}
      {regions.map((r) => (
        <circle key={`${r.id}-dot`} cx={r.cx} cy={r.cy} r={3 + (values[r.id] ?? 0.4) * 8} fill={CHART_COLORS[0]} opacity={0.5} />
      ))}
    </MapCanvas>
  );
}

export type FilledChoroplethMapProps = HeatMapGeoProps;

export function FilledChoroplethMap({
  className,
  regions = COUNTRY_REGIONS,
  values = { north: 0.82, east: 0.55, west: 0.28, central: 0.71, south: 0.42, coast: 0.88 },
  label,
}: FilledChoroplethMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Filled choropleth map"}>
      <MapBackground opacity={0.15} />
      <RegionLayer
        regions={regions}
        fill={(r) => choroplethFill(values[r.id] ?? 0.5)}
        stroke="var(--card)"
        strokeWidth={1.5}
      />
      {regions.map((r) => (
        <text
          key={r.id}
          x={r.cx}
          y={r.cy}
          textAnchor="middle"
          // Sits on a saturated choropleth fill, so it needs the on-fill ink.
          // --muted-foreground collides with --chart-6 and vanishes.
          fill="var(--chart-label)"
          fontSize={9}
          fontWeight={500}
        >
          {r.label}
        </text>
      ))}
    </MapCanvas>
  );
}

export type MarkerMapProps = {
  className?: string;
  points?: MapPoint[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function MarkerMap({ className, points = DEFAULT_POINTS, regions = COUNTRY_REGIONS, label }: MarkerMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Marker map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.88} />
      {points.map((p, i) => (
        <PinMarker key={i} x={p.x} y={p.y} color={p.color ?? colorAt(i)} />
      ))}
    </MapCanvas>
  );
}

export type CustomIconMarkerMapProps = MarkerMapProps;

export function CustomIconMarkerMap({
  className,
  points = DEFAULT_POINTS.slice(0, 5),
  regions = COUNTRY_REGIONS,
  label,
}: CustomIconMarkerMapProps) {
  const icons = ["★", "◆", "●", "▲", "■"];
  return (
    <MapCanvas className={className} label={label ?? "Custom icon marker map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.88} />
      {points.map((p, i) => (
        <g key={i} transform={`translate(${p.x}, ${p.y})`}>
          <circle r={12} fill={colorAt(i)} opacity={0.2} />
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={14}
            fill={colorAt(i)}
            fontWeight={700}
          >
            {icons[i % icons.length]}
          </text>
        </g>
      ))}
    </MapCanvas>
  );
}

export type ImageMarkerMapProps = MarkerMapProps;

export function ImageMarkerMap({
  className,
  points = DEFAULT_POINTS.slice(0, 4),
  regions = COUNTRY_REGIONS,
  label,
}: ImageMarkerMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Image marker map"}>
      <defs>
        {points.map((_, i) => (
          <pattern key={i} id={`img-marker-${i}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={colorAt(i)} opacity={0.25} />
            <circle cx="10" cy="10" r="6" fill={colorAt(i)} />
          </pattern>
        ))}
      </defs>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.88} />
      {points.map((p, i) => (
        <g key={i}>
          <rect x={p.x - 10} y={p.y - 10} width={20} height={20} fill={`url(#img-marker-${i})`} rx={4} />
          <circle cx={p.x} cy={p.y} r={3} fill="var(--card)" />
        </g>
      ))}
    </MapCanvas>
  );
}

export type PathMapProps = {
  className?: string;
  routes?: MapRoute[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function PathMap({ className, routes = DEFAULT_ROUTES, regions = COUNTRY_REGIONS, label }: PathMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Path map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {routes.map((r, i) => (
        <path
          key={i}
          d={`M ${r.from.x} ${r.from.y} L ${r.to.x} ${r.to.y}`}
          fill="none"
          stroke={colorAt(i)}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.8}
        />
      ))}
      {routes.flatMap((r, i) => [
        <circle key={`f-${i}`} cx={r.from.x} cy={r.from.y} r={4} fill={colorAt(i)} />,
        <circle key={`t-${i}`} cx={r.to.x} cy={r.to.y} r={4} fill={colorAt(i)} opacity={0.6} />,
      ])}
    </MapCanvas>
  );
}

export type RouteMapProps = PathMapProps;

export function RouteMap({ className, routes = DEFAULT_ROUTES, regions = COUNTRY_REGIONS, label }: RouteMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Route map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {routes.map((r, i) => (
        <g key={i}>
          <path
            d={arcPath(r.from, r.to, 0.25)}
            fill="none"
            stroke={colorAt(i)}
            strokeWidth={2.5}
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity={0.85}
          />
          <circle cx={r.from.x} cy={r.from.y} r={5} fill="var(--card)" stroke={colorAt(i)} strokeWidth={2} />
          <circle cx={r.to.x} cy={r.to.y} r={5} fill={colorAt(i)} />
        </g>
      ))}
    </MapCanvas>
  );
}

export type PolygonMapProps = {
  className?: string;
  highlightIds?: string[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function PolygonMap({
  className,
  highlightIds = ["central", "coast"],
  regions = COUNTRY_REGIONS,
  label,
}: PolygonMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Polygon map"}>
      <MapBackground />
      {regions.map((r, i) => {
        const highlighted = highlightIds.includes(r.id);
        return (
          <path
            key={r.id}
            d={r.path}
            fill={highlighted ? colorAt(i) : "var(--card)"}
            opacity={highlighted ? 0.55 : 0.85}
            stroke={highlighted ? colorAt(i) : "var(--border)"}
            strokeWidth={highlighted ? 2 : 1}
          />
        );
      })}
    </MapCanvas>
  );
}

export type PointClusterMapProps = MarkerMapProps;

export function PointClusterMap({
  className,
  points = [
    ...DEFAULT_POINTS,
    { x: 145, y: 125, value: 80 },
    { x: 152, y: 132, value: 60 },
    { x: 140, y: 118, value: 90 },
    { x: 265, y: 175, value: 70 },
    { x: 272, y: 182, value: 55 },
  ],
  regions = COUNTRY_REGIONS,
  label,
}: PointClusterMapProps) {
  const clusters = [
    { x: 148, y: 128, count: 4, label: "Central cluster" },
    { x: 268, y: 178, count: 3, label: "Coast cluster" },
    { x: 108, y: 62, count: 1, label: "North" },
    { x: 68, y: 128, count: 1, label: "West" },
    { x: 148, y: 198, count: 1, label: "South" },
  ];

  return (
    <MapCanvas className={className} label={label ?? "Point cluster map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.88} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={3} fill={colorAt(i % 3)} opacity={0.5} />
      ))}
      {clusters.map((c, i) => (
        <g key={c.label}>
          <circle cx={c.x} cy={c.y} r={10 + c.count * 4} fill={colorAt(i)} opacity={0.2} />
          <circle cx={c.x} cy={c.y} r={12 + c.count * 4} fill="none" stroke={colorAt(i)} strokeWidth={1.5} opacity={0.5} />
          {/* Counts used to sit straight on the tint halo — with a 50% member
              dot underneath, that backdrop composites to a mid-tone that no ink
              can clear. The cluster now gets a solid series-colored core, which
              is a defined backdrop, so the count uses knockout label ink. */}
          <circle
            cx={c.x}
            cy={c.y}
            r={9 + (String(c.count).length - 1) * 3}
            fill={colorAt(i)}
            stroke="var(--card)"
            strokeWidth={1.5}
          />
          <text x={c.x} y={c.y} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight={600} fill="var(--chart-label)">
            {c.count}
          </text>
        </g>
      ))}
    </MapCanvas>
  );
}

export type PieChartMapOverlayProps = {
  className?: string;
  overlays?: { x: number; y: number; values: number[]; label?: string }[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function PieChartMapOverlay({
  className,
  overlays = [
    { x: 108, y: 62, values: [30, 25, 20, 25], label: "North" },
    { x: 148, y: 128, values: [40, 35, 25], label: "Central" },
    { x: 268, y: 178, values: [50, 30, 20], label: "Coast" },
  ],
  regions = COUNTRY_REGIONS,
  label,
}: PieChartMapOverlayProps) {
  return (
    <MapCanvas className={className} label={label ?? "Pie chart map overlay"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {overlays.map((o, i) => (
        <g key={i}>
          <MiniPie cx={o.x} cy={o.y} values={o.values} />
          {o.label ? (
            <text x={o.x} y={o.y + 22} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
              {o.label}
            </text>
          ) : null}
        </g>
      ))}
    </MapCanvas>
  );
}

export type ShapeMapProps = MarkerMapProps;

export function ShapeMap({
  className,
  points = DEFAULT_POINTS,
  regions = COUNTRY_REGIONS,
  label,
}: ShapeMapProps) {
  const shapes = ["circle", "square", "triangle", "diamond", "hex"] as const;
  return (
    <MapCanvas className={className} label={label ?? "Shape map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.88} />
      {points.map((p, i) => {
        const color = p.color ?? colorAt(i);
        const shape = shapes[i % shapes.length];
        const s = 8;
        if (shape === "circle") return <circle key={i} cx={p.x} cy={p.y} r={s} fill={color} />;
        if (shape === "square") return <rect key={i} x={p.x - s} y={p.y - s} width={s * 2} height={s * 2} fill={color} rx={2} />;
        if (shape === "triangle")
          return <polygon key={i} points={`${p.x},${p.y - s} ${p.x + s},${p.y + s} ${p.x - s},${p.y + s}`} fill={color} />;
        if (shape === "diamond")
          return <polygon key={i} points={`${p.x},${p.y - s} ${p.x + s},${p.y} ${p.x},${p.y + s} ${p.x - s},${p.y}`} fill={color} />;
        return <path key={i} d={hexPath(p.x, p.y, s)} fill={color} />;
      })}
    </MapCanvas>
  );
}

export type CountryMapProps = FilledChoroplethMapProps;

export function CountryMap(props: CountryMapProps) {
  return (
    <FilledChoroplethMap
      {...props}
      regions={props.regions ?? COUNTRY_REGIONS}
      label={props.label ?? "Country map"}
    />
  );
}

export type StateMapProps = FilledChoroplethMapProps;

export function StateMap({
  className,
  regions = STATE_REGIONS,
  values = { s1: 0.7, s2: 0.5, s3: 0.85, s4: 0.4, s5: 0.65, s6: 0.55, s7: 0.35, s8: 0.75, s9: 0.6 },
  label,
}: StateMapProps) {
  return (
    <FilledChoroplethMap
      className={className}
      regions={regions}
      values={values}
      label={label ?? "State map"}
    />
  );
}

export type CountyMapProps = FilledChoroplethMapProps;

export function CountyMap({ className, regions = COUNTY_REGIONS, label }: CountyMapProps) {
  const values: Record<string, number> = {};
  regions.forEach((r, i) => {
    values[r.id] = 0.2 + ((i * 17) % 80) / 100;
  });
  return (
    <FilledChoroplethMap
      className={className}
      regions={regions}
      values={values}
      label={label ?? "County map"}
    />
  );
}

export type TerritoryMapProps = FilledChoroplethMapProps;

export function TerritoryMap({
  className,
  regions = [...COUNTRY_REGIONS, ...TERRITORY_REGIONS],
  values = { north: 0.6, east: 0.45, west: 0.3, central: 0.7, south: 0.5, coast: 0.8, t1: 0.9, t2: 0.55, t3: 0.4 },
  label,
}: TerritoryMapProps) {
  return (
    <FilledChoroplethMap
      className={className}
      regions={regions}
      values={values}
      label={label ?? "Territory map"}
    />
  );
}

export type FloorPlanMapProps = {
  className?: string;
  rooms?: typeof FLOOR_ROOMS;
  /** Accessible name for the map. */
  label?: string;
};

export function FloorPlanMap({ className, rooms = FLOOR_ROOMS, label }: FloorPlanMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Floor plan map"}>
      <rect x="20" y="20" width="360" height="240" fill="var(--card)" stroke="var(--border)" strokeWidth={2} rx={4} />
      <GridPattern id="floor-grid" />
      <rect x="20" y="20" width="360" height="240" fill="url(#floor-grid)" opacity={0.4} />
      {rooms.map((room, i) => (
        <g key={room.id}>
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            fill={colorAt(i)}
            opacity={0.12}
            stroke={colorAt(i)}
            strokeWidth={1.5}
            rx={3}
          />
          <text
            x={room.x + room.w / 2}
            y={room.y + room.h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={9}
            fontWeight={500}
            fill="var(--foreground)"
          >
            {room.label}
          </text>
        </g>
      ))}
    </MapCanvas>
  );
}

export type BuildingLayoutMapProps = FloorPlanMapProps;

export function BuildingLayoutMap({ className, rooms = FLOOR_ROOMS, label }: BuildingLayoutMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Building layout map"}>
      <rect x="30" y="30" width="340" height="220" fill="var(--muted)" opacity={0.3} rx={6} />
      {rooms.map((room, i) => (
        <g key={room.id}>
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            fill="var(--card)"
            stroke="var(--border)"
            strokeWidth={1}
            rx={2}
          />
          <line x1={room.x} y1={room.y + room.h} x2={room.x + room.w} y2={room.y + room.h} stroke={colorAt(i)} strokeWidth={3} opacity={0.6} />
          <text x={room.x + 6} y={room.y + 14} fontSize={8} fill="var(--muted-foreground)">{room.label}</text>
        </g>
      ))}
      <circle cx="200" cy="140" r={6} fill={CHART_COLORS[0]} opacity={0.8} />
      <text x={210} y={143} fontSize={8} fill="var(--muted-foreground)">You are here</text>
    </MapCanvas>
  );
}

export type SeatingPlanMapProps = {
  className?: string;
  rows?: number;
  cols?: number;
  /** Accessible name for the map. */
  label?: string;
};

export function SeatingPlanMap({ className, rows = 6, cols = 10, label }: SeatingPlanMapProps) {
  const seatW = 28;
  const seatH = 22;
  const gap = 6;
  const ox = 50;
  const oy = 50;
  const occupied = new Set(["1-3", "1-4", "2-5", "3-2", "4-7", "5-1", "5-8"]);

  return (
    <MapCanvas className={className} label={label ?? "Seating plan map"}>
      <rect x="30" y="30" width="340" height="220" fill="var(--card)" stroke="var(--border)" rx={6} />
      <text x="200" y="42" textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--muted-foreground)">STAGE</text>
      <line x1="80" y1="48" x2="320" y2="48" stroke="var(--border)" strokeWidth={2} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const x = ox + c * (seatW + gap);
          const y = oy + r * (seatH + gap);
          const key = `${r}-${c}`;
          const taken = occupied.has(key);
          return (
            <rect
              key={key}
              x={x}
              y={y}
              width={seatW}
              height={seatH}
              rx={3}
              fill={taken ? colorAt(r) : "var(--muted)"}
              opacity={taken ? 0.7 : 0.4}
              stroke={taken ? colorAt(r) : "var(--border)"}
              strokeWidth={1}
            />
          );
        }),
      )}
    </MapCanvas>
  );
}

export type WarehouseLayoutMapProps = {
  className?: string;
  zones?: typeof WAREHOUSE_ZONES;
  /** Accessible name for the map. */
  label?: string;
};

export function WarehouseLayoutMap({ className, zones = WAREHOUSE_ZONES, label }: WarehouseLayoutMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Warehouse layout map"}>
      <rect x="20" y="30" width="360" height="220" fill="var(--muted)" opacity={0.25} rx={4} />
      {zones.map((z, i) => (
        <g key={z.id}>
          <rect
            x={z.x}
            y={z.y}
            width={z.w}
            height={z.h}
            fill={colorAt(i)}
            opacity={0.15}
            stroke={colorAt(i)}
            strokeWidth={1.5}
            strokeDasharray={i % 2 === 0 ? undefined : "4 3"}
            rx={3}
          />
          {/* A 15% tint is a tinted fill, not a solid one, so the zone name
              takes foreground ink — the series color on its own tint only
              reached 4.35:1 in the light theme. The stroke carries the hue. */}
          <text x={z.x + z.w / 2} y={z.y + 16} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            {z.label}
          </text>
          {Array.from({ length: 3 }, (_, j) => (
            <rect
              key={j}
              x={z.x + 10 + j * 22}
              y={z.y + z.h - 28}
              width={16}
              height={16}
              fill="var(--card)"
              stroke="var(--border)"
              opacity={0.7}
              rx={2}
            />
          ))}
        </g>
      ))}
    </MapCanvas>
  );
}

export type CampusMapProps = {
  className?: string;
  buildings?: typeof CAMPUS_BUILDINGS;
  /** Accessible name for the map. */
  label?: string;
};

export function CampusMap({ className, buildings = CAMPUS_BUILDINGS, label }: CampusMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Campus map"}>
      <MapBackground opacity={0.2} />
      <path d="M 30 110 Q 200 80 370 110" fill="none" stroke={CHART_COLORS[5]} strokeWidth={3} opacity={0.3} />
      <path d="M 50 200 Q 200 170 350 200" fill="none" stroke={CHART_COLORS[5]} strokeWidth={2} opacity={0.2} />
      {buildings.map((b, i) => (
        <g key={b.id}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={colorAt(i)}
            /*
              45%, not 55%: in the dark theme a 55% pastel tint composites to a
              mid-tone that leaves foreground ink at 4.4:1. Backing off the tint
              keeps the fill dark enough for the label to clear 4.5:1.
            */
            opacity={0.45}
            stroke="var(--card)"
            strokeWidth={1.5}
            rx={4}
          />
          <text
            x={b.x + b.w / 2}
            y={b.y + b.h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={8}
            fontWeight={600}
            // Buildings are a tint, not a solid fill, so knockout ink was
            // washing out. Foreground ink flips with the theme instead.
            fill="var(--foreground)"
          >
            {b.label}
          </text>
        </g>
      ))}
    </MapCanvas>
  );
}

export type HexMapProps = {
  className?: string;
  values?: number[];
  /** Accessible name for the map. */
  label?: string;
};

export function HexMap({ className, values, label }: HexMapProps) {
  const vals = values ?? HEX_COORDS.map((_, i) => 0.2 + ((i * 13) % 80) / 100);
  const r = 18;
  return (
    <MapCanvas className={className} label={label ?? "Hex tile map"}>
      <MapBackground opacity={0.15} />
      {HEX_COORDS.map((pt, i) => (
        <path
          key={i}
          d={hexPath(pt.x, pt.y, r)}
          fill={choroplethFill(vals[i] ?? 0.5)}
          stroke="var(--card)"
          strokeWidth={1}
          opacity={0.85}
        />
      ))}
    </MapCanvas>
  );
}

export type TileGridMapProps = {
  className?: string;
  cols?: number;
  rows?: number;
  /** Accessible name for the map. */
  label?: string;
};

export function TileGridMap({ className, cols = 12, rows = 7, label }: TileGridMapProps) {
  const tileW = 28;
  const tileH = 28;
  const ox = 44;
  const oy = 36;

  return (
    <MapCanvas className={className} label={label ?? "Tile grid map"}>
      <MapBackground opacity={0.12} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const v = ((r * cols + c) * 7) % 100;
          return (
            <rect
              key={`${r}-${c}`}
              x={ox + c * tileW}
              y={oy + r * tileH}
              width={tileW - 2}
              height={tileH - 2}
              fill={choroplethFill(v / 100)}
              opacity={0.75}
              stroke="var(--card)"
              strokeWidth={0.5}
              rx={2}
            />
          );
        }),
      )}
    </MapCanvas>
  );
}

export type ArcMapProps = PathMapProps;

export function ArcMap({ className, routes = DEFAULT_ROUTES, regions = COUNTRY_REGIONS, label }: ArcMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Arc map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {routes.map((r, i) => (
        <g key={i}>
          <path
            d={arcPath(r.from, r.to, 0.35)}
            fill="none"
            stroke={colorAt(i)}
            strokeWidth={2}
            opacity={0.75}
            markerEnd="url(#arc-arrow)"
          />
          <circle cx={r.from.x} cy={r.from.y} r={3} fill={colorAt(i)} />
          <circle cx={r.to.x} cy={r.to.y} r={3} fill={colorAt(i)} opacity={0.5} />
        </g>
      ))}
      <defs>
        <marker id="arc-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CHART_COLORS[0]} />
        </marker>
      </defs>
    </MapCanvas>
  );
}

export type FlowMapProps = PathMapProps;

export function FlowMap({ className, routes = DEFAULT_ROUTES, regions = COUNTRY_REGIONS, label }: FlowMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Flow map"}>
      <MapBackground />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} />
      {routes.map((r, i) => {
        const dx = r.to.x - r.from.x;
        const dy = r.to.y - r.from.y;
        const len = Math.hypot(dx, dy);
        const nx = -dy / len;
        const ny = dx / len;
        const offset = (i % 2 === 0 ? 1 : -1) * 6;
        return (
          <g key={i}>
            <path
              d={`M ${r.from.x + nx * offset} ${r.from.y + ny * offset} L ${r.to.x + nx * offset} ${r.to.y + ny * offset}`}
              fill="none"
              stroke={colorAt(i)}
              strokeWidth={3 + i}
              opacity={0.35 + i * 0.1}
              strokeLinecap="round"
            />
            <polygon
              points={`${r.to.x + nx * offset},${r.to.y + ny * offset} ${r.to.x + nx * offset - dx * 0.04 - 5},${r.to.y + ny * offset - dy * 0.04 - 3} ${r.to.x + nx * offset - dx * 0.04 + 5},${r.to.y + ny * offset - dy * 0.04 + 3}`}
              fill={colorAt(i)}
              opacity={0.7}
            />
          </g>
        );
      })}
    </MapCanvas>
  );
}

export type NetworkMapProps = {
  className?: string;
  nodes?: MapPoint[];
  edges?: { from: number; to: number }[];
  /** Accessible name for the map. */
  label?: string;
};

export function NetworkMap({
  className,
  nodes = DEFAULT_POINTS,
  edges = [
    { from: 0, to: 3 },
    { from: 1, to: 5 },
    { from: 2, to: 4 },
    { from: 3, to: 1 },
    { from: 3, to: 4 },
    { from: 5, to: 1 },
  ],
  label,
}: NetworkMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Network map"}>
      <MapBackground opacity={0.2} />
      <GridPattern id="network-grid" />
      <rect width="400" height="280" fill="url(#network-grid)" opacity={0.35} />
      {edges.map((e, i) => {
        const a = nodes[e.from];
        const b = nodes[e.to];
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="var(--chart-axis)"
            strokeWidth={1.5}
            opacity={0.5}
          />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={10} fill={colorAt(i)} opacity={0.25} />
          <circle cx={n.x} cy={n.y} r={5} fill={colorAt(i)} stroke="var(--card)" strokeWidth={1.5} />
          {n.label ? (
            <text x={n.x} y={n.y + 16} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              {n.label}
            </text>
          ) : null}
        </g>
      ))}
    </MapCanvas>
  );
}

export type IndoorMapProps = BuildingLayoutMapProps;

export function IndoorMap({ className, rooms = FLOOR_ROOMS, label }: IndoorMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Indoor map"}>
      <rect x="25" y="25" width="350" height="230" fill="var(--card)" stroke="var(--border)" strokeWidth={2} rx={6} />
      {rooms.map((room, i) => (
        <g key={room.id}>
          <rect x={room.x} y={room.y} width={room.w} height={room.h} fill={colorAt(i)} opacity={0.1} stroke={colorAt(i)} strokeWidth={1} rx={2} />
          <circle cx={room.x + room.w - 10} cy={room.y + 10} r={3} fill={colorAt(i)} opacity={0.6} />
        </g>
      ))}
      <path d="M 40 250 L 80 200 L 150 220 L 200 160 L 280 180 L 320 120" fill="none" stroke={CHART_COLORS[0]} strokeWidth={2} strokeDasharray="5 4" opacity={0.7} />
    </MapCanvas>
  );
}

export type IsochroneMapProps = {
  className?: string;
  center?: Point;
  rings?: number[];
  /** Accessible name for the map. */
  label?: string;
};

export function IsochroneMap({
  className,
  center = { x: 200, y: 140 },
  rings = [30, 55, 80, 105],
  label,
}: IsochroneMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Isochrone map"}>
      <MapBackground opacity={0.15} />
      <RegionLayer regions={COUNTRY_REGIONS} fill={() => "var(--card)"} opacity={0.6} />
      {rings.map((r, i) => (
        <circle
          key={i}
          cx={center.x}
          cy={center.y}
          r={r}
          fill={colorAt(i)}
          opacity={0.15 + i * 0.08}
          stroke={colorAt(i)}
          strokeWidth={1}
          strokeDasharray={i === rings.length - 1 ? undefined : "4 3"}
        />
      ))}
      <circle cx={center.x} cy={center.y} r={6} fill={CHART_COLORS[0]} stroke="var(--card)" strokeWidth={2} />
      {rings.map((r, i) => {
        // Labels land under every larger ring, so the backdrop is an
        // unpredictable stack of tints — three deep near the centre, which
        // drops foreground ink to 3.6:1 in the dark theme. Each one gets a
        // card-colored chip, walked around the arc so the chips never abut.
        const text = `${5 + i * 5} min`;
        const angle = ((-55 + (i % 4) * 30) * Math.PI) / 180;
        const x = center.x + r * Math.cos(angle);
        const y = center.y + r * Math.sin(angle);
        return (
          <g key={`lbl-${i}`}>
            <rect
              x={x - 3}
              y={y - 8}
              width={text.length * 4.4 + 6}
              height={13}
              rx={3}
              fill="var(--card)"
              stroke="var(--border-soft)"
              strokeWidth={1}
            />
            <text x={x} y={y} fontSize={8} fill="var(--foreground)">
              {text}
            </text>
          </g>
        );
      })}
    </MapCanvas>
  );
}

export type Column3DMapProps = {
  className?: string;
  columns?: { x: number; y: number; value: number; label?: string }[];
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function Column3DMap({
  className,
  columns = DEFAULT_POINTS.map((p) => ({ x: p.x, y: p.y, value: p.value ?? 200, label: p.label })),
  regions = COUNTRY_REGIONS,
  label,
}: Column3DMapProps) {
  const maxVal = Math.max(...columns.map((c) => c.value), 1);
  return (
    <MapCanvas className={className} label={label ?? "3D column map"}>
      <MapBackground opacity={0.15} />
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.7} />
      {columns.map((col, i) => {
        const h = (col.value / maxVal) * 60;
        return (
          <g key={i}>
            <IsometricColumn x={col.x - 7} y={col.y + 10} height={h} color={colorAt(i)} />
            {col.label ? (
              <text x={col.x} y={col.y + 28} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                {formatCompact(col.value)}
              </text>
            ) : null}
          </g>
        );
      })}
    </MapCanvas>
  );
}

export type ReferenceLayerMapProps = {
  className?: string;
  showGrid?: boolean;
  showLabels?: boolean;
  showScale?: boolean;
  regions?: GeoRegion[];
  /** Accessible name for the map. */
  label?: string;
};

export function ReferenceLayerMap({
  className,
  showGrid = true,
  showLabels = true,
  showScale = true,
  regions = COUNTRY_REGIONS,
  label,
}: ReferenceLayerMapProps) {
  return (
    <MapCanvas className={className} label={label ?? "Reference layer map"}>
      <MapBackground opacity={0.12} />
      {showGrid ? (
        <>
          <GridPattern id="ref-grid" />
          <rect width="400" height="280" fill="url(#ref-grid)" opacity={0.5} />
        </>
      ) : null}
      <RegionLayer regions={regions} fill={() => "var(--card)"} opacity={0.85} stroke="var(--chart-axis)" />
      {showLabels
        ? regions.map((r) => (
            <text key={r.id} x={r.cx} y={r.cy} textAnchor="middle" dominantBaseline="central" fontSize={9} fill="var(--muted-foreground)">
              {r.label}
            </text>
          ))
        : null}
      {showScale ? (
        <g transform="translate(30, 250)">
          <line x1={0} y1={0} x2={60} y2={0} stroke="var(--foreground)" strokeWidth={2} />
          <line x1={0} y1={-4} x2={0} y2={4} stroke="var(--foreground)" strokeWidth={2} />
          <line x1={60} y1={-4} x2={60} y2={4} stroke="var(--foreground)" strokeWidth={2} />
          <text x={30} y={14} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">50 km</text>
        </g>
      ) : null}
      <g opacity={0.4}>
        <line x1={0} y1={140} x2={400} y2={140} stroke="var(--chart-axis)" strokeWidth={0.5} strokeDasharray="2 4" />
        <line x1={200} y1={0} x2={200} y2={280} stroke="var(--chart-axis)" strokeWidth={0.5} strokeDasharray="2 4" />
      </g>
    </MapCanvas>
  );
}
