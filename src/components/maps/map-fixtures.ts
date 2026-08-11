import type {
  GeoPointDatum,
  MapRouteDatum,
  PlanarPointDatum,
  SchematicRegion,
} from "./geo-core";

/** Provider-free demo points using real longitude/latitude coordinates. */
export const DEFAULT_GEO_POINTS = [
  { id: "chicago", longitude: -87.6298, latitude: 41.8781, value: 540, label: "Chicago" },
  { id: "new-york", longitude: -74.006, latitude: 40.7128, value: 420, label: "New York" },
  { id: "london", longitude: -0.1276, latitude: 51.5072, value: 390, label: "London" },
  { id: "tokyo", longitude: 139.6917, latitude: 35.6895, value: 470, label: "Tokyo" },
  { id: "sydney", longitude: 151.2093, latitude: -33.8688, value: 310, label: "Sydney" },
  { id: "sao-paulo", longitude: -46.6333, latitude: -23.5505, value: 350, label: "São Paulo" },
] satisfies readonly GeoPointDatum[];

export const DEFAULT_CLUSTER_POINTS = [
  ...DEFAULT_GEO_POINTS,
  { id: "brooklyn", longitude: -73.9442, latitude: 40.6782, value: 80, label: "Brooklyn" },
  { id: "queens", longitude: -73.7949, latitude: 40.7282, value: 65, label: "Queens" },
  { id: "newark", longitude: -74.1724, latitude: 40.7357, value: 55, label: "Newark" },
  { id: "yokohama", longitude: 139.638, latitude: 35.4437, value: 70, label: "Yokohama" },
  { id: "chiba", longitude: 140.1233, latitude: 35.6074, value: 50, label: "Chiba" },
] satisfies readonly GeoPointDatum[];

/** Great-circle-capable routes between the default geographic points. */
export const DEFAULT_GEO_ROUTES = [
  {
    id: "chicago-new-york",
    from: [-87.6298, 41.8781],
    to: [-74.006, 40.7128],
    value: 38,
    label: "Chicago to New York",
  },
  {
    id: "new-york-london",
    from: [-74.006, 40.7128],
    to: [-0.1276, 51.5072],
    value: 26,
    label: "New York to London",
  },
  {
    id: "london-tokyo",
    from: [-0.1276, 51.5072],
    to: [139.6917, 35.6895],
    value: 18,
    label: "London to Tokyo",
  },
  {
    id: "tokyo-sydney",
    from: [139.6917, 35.6895],
    to: [151.2093, -33.8688],
    value: 14,
    label: "Tokyo to Sydney",
  },
] satisfies readonly MapRouteDatum[];

/**
 * Compatibility-only schematic regions. They are deliberately named and
 * labeled as diagram regions; they are not country, state, or county borders.
 */
export const DEFAULT_SCHEMATIC_REGIONS = [
  {
    id: "north",
    path: "M 48 38 L 168 28 L 188 88 L 108 98 L 38 78 Z",
    label: "North zone",
    cx: 108,
    cy: 62,
  },
  {
    id: "east",
    path: "M 188 28 L 358 48 L 338 118 L 188 88 Z",
    label: "East zone",
    cx: 262,
    cy: 72,
  },
  {
    id: "west",
    path: "M 38 78 L 108 98 L 98 168 L 28 148 Z",
    label: "West zone",
    cx: 68,
    cy: 128,
  },
  {
    id: "central",
    path: "M 108 98 L 188 88 L 198 158 L 118 168 Z",
    label: "Central zone",
    cx: 148,
    cy: 128,
  },
  {
    id: "south",
    path: "M 98 168 L 198 158 L 218 228 L 88 238 Z",
    label: "South zone",
    cx: 148,
    cy: 198,
  },
  {
    id: "coast",
    path: "M 198 158 L 338 118 L 348 198 L 218 228 Z",
    label: "Coast zone",
    cx: 268,
    cy: 178,
  },
] satisfies readonly SchematicRegion[];

export const DEFAULT_PLANAR_POINTS = [
  { id: "north", x: 108, y: 62, value: 420, label: "North hub" },
  { id: "east", x: 262, y: 72, value: 310, label: "East hub" },
  { id: "west", x: 68, y: 128, value: 180, label: "West hub" },
  { id: "central", x: 148, y: 128, value: 540, label: "Central hub" },
  { id: "south", x: 148, y: 198, value: 260, label: "South hub" },
  { id: "coast", x: 268, y: 178, value: 390, label: "Coast hub" },
] satisfies readonly PlanarPointDatum[];
