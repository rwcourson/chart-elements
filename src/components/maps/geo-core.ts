import * as d3 from "d3";

export type MapValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type GeoCoordinate = readonly [longitude: number, latitude: number];
export type GeoProperties = Readonly<Record<string, unknown>>;

export type GeoPointGeometry = {
  type: "Point";
  coordinates: GeoCoordinate;
};

export type GeoMultiPointGeometry = {
  type: "MultiPoint";
  coordinates: readonly GeoCoordinate[];
};

export type GeoLineStringGeometry = {
  type: "LineString";
  coordinates: readonly GeoCoordinate[];
};

export type GeoMultiLineStringGeometry = {
  type: "MultiLineString";
  coordinates: readonly (readonly GeoCoordinate[])[];
};

export type GeoPolygonGeometry = {
  type: "Polygon";
  coordinates: readonly (readonly GeoCoordinate[])[];
};

export type GeoMultiPolygonGeometry = {
  type: "MultiPolygon";
  coordinates: readonly (readonly (readonly GeoCoordinate[])[])[];
};

export type GeoGeometryCollection = {
  type: "GeometryCollection";
  geometries: readonly GeoGeometry[];
};

export type GeoGeometry =
  | GeoPointGeometry
  | GeoMultiPointGeometry
  | GeoLineStringGeometry
  | GeoMultiLineStringGeometry
  | GeoPolygonGeometry
  | GeoMultiPolygonGeometry
  | GeoGeometryCollection;

export type GeoFeature<Properties extends GeoProperties = GeoProperties> = {
  type: "Feature";
  id?: string | number;
  properties: Properties | null;
  geometry: GeoGeometry | null;
};

export type GeoFeatureCollection<Properties extends GeoProperties = GeoProperties> = {
  type: "FeatureCollection";
  features: readonly GeoFeature<Properties>[];
};

export type GeoProjectionKind =
  | "equal-earth"
  | "natural-earth"
  | "mercator"
  | "equirectangular";

export type GeoPointDatum = {
  id?: string;
  longitude: number;
  latitude: number;
  value?: number;
  label?: string;
  color?: string;
  category?: string;
  symbol?: string;
  imageUrl?: string;
};

/** Legacy/provider-free diagram coordinates, never interpreted as longitude/latitude. */
export type PlanarPointDatum = {
  id?: string;
  x: number;
  y: number;
  value?: number;
  label?: string;
  color?: string;
  category?: string;
  symbol?: string;
  imageUrl?: string;
};

export type MapPointDatum = GeoPointDatum | PlanarPointDatum;

export type GeoRouteEndpoint =
  | GeoCoordinate
  | Pick<GeoPointDatum, "longitude" | "latitude">
  | Pick<PlanarPointDatum, "x" | "y">;

export type MapRouteDatum = {
  id?: string;
  from: GeoRouteEndpoint;
  to: GeoRouteEndpoint;
  value?: number;
  label?: string;
  color?: string;
};

export type SchematicRegion = {
  id: string;
  path: string;
  label: string;
  cx: number;
  cy: number;
};

export type GeoFeatureValueDatum = {
  featureId: string;
  value: number;
  label?: string;
  color?: string;
};

export type GeoReferenceLayer = {
  id: string;
  label: string;
  features: GeoFeatureCollection;
  color?: string;
  fillOpacity?: number;
  strokeWidth?: number;
};

export type GeoLayoutFeature = {
  id: string;
  label: string;
  feature: GeoFeature;
  path: string;
  centroid: readonly [number, number];
};

export type GeoLayout = {
  width: number;
  height: number;
  padding: number;
  projection: GeoProjectionKind;
  features: readonly GeoLayoutFeature[];
  spherePath: string;
  graticulePath: string;
  geographicBounds: readonly [GeoCoordinate, GeoCoordinate];
  project: (coordinate: GeoCoordinate) => readonly [number, number] | undefined;
  pathForGeometry: (geometry: GeoGeometry) => string | undefined;
  invert: (point: readonly [number, number]) => GeoCoordinate | undefined;
  distanceForPixels: (
    start: readonly [number, number],
    pixels: number,
  ) => number | undefined;
};

export type NormalizedMapPoint = {
  id: string;
  mode: "geographic" | "schematic";
  longitude?: number;
  latitude?: number;
  x?: number;
  y?: number;
  value: number;
  label: string;
  color?: string;
  category?: string;
  symbol?: string;
  imageUrl?: string;
};

export type NormalizedMapRoute = {
  id: string;
  mode: "geographic" | "schematic";
  fromGeo?: GeoCoordinate;
  toGeo?: GeoCoordinate;
  fromPlanar?: readonly [number, number];
  toPlanar?: readonly [number, number];
  value: number;
  label: string;
  color?: string;
};

export type ProjectedPointCluster = {
  id: string;
  x: number;
  y: number;
  count: number;
  value: number;
  pointIds: readonly string[];
  labels: readonly string[];
};

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function isGeoCoordinate(value: unknown): value is GeoCoordinate {
  return (
    Array.isArray(value) &&
    value.length >= 2 &&
    isFiniteNumber(value[0]) &&
    isFiniteNumber(value[1]) &&
    value[0] >= -180 &&
    value[0] <= 180 &&
    value[1] >= -90 &&
    value[1] <= 90
  );
}

export function isGeoPointDatum(point: MapPointDatum): point is GeoPointDatum {
  return "longitude" in point && "latitude" in point;
}

export function isPlanarPointDatum(point: MapPointDatum): point is PlanarPointDatum {
  return "x" in point && "y" in point;
}

function coordinatesInGeometry(geometry: GeoGeometry): readonly GeoCoordinate[] {
  switch (geometry.type) {
    case "Point":
      return [geometry.coordinates];
    case "MultiPoint":
    case "LineString":
      return geometry.coordinates;
    case "MultiLineString":
    case "Polygon":
      return geometry.coordinates.flat();
    case "MultiPolygon":
      return geometry.coordinates.flat(2);
    case "GeometryCollection":
      return geometry.geometries.flatMap(coordinatesInGeometry);
  }
}

function validateGeometry(geometry: GeoGeometry, context: string): string | undefined {
  const coordinates = coordinatesInGeometry(geometry);
  if (coordinates.length === 0) {
    return `${context} has no coordinates.`;
  }
  for (const coordinate of coordinates) {
    if (!isGeoCoordinate(coordinate)) {
      return `${context} contains an invalid longitude/latitude coordinate.`;
    }
  }
  if (geometry.type === "LineString" && geometry.coordinates.length < 2) {
    return `${context} line needs at least two coordinates.`;
  }
  if (geometry.type === "MultiLineString") {
    if (geometry.coordinates.some((line) => line.length < 2)) {
      return `${context} multiline contains a line with fewer than two coordinates.`;
    }
  }
  const rings =
    geometry.type === "Polygon"
      ? geometry.coordinates
      : geometry.type === "MultiPolygon"
        ? geometry.coordinates.flat()
        : [];
  for (const ring of rings) {
    if (ring.length < 4) return `${context} polygon rings need at least four coordinates.`;
    const first = ring[0];
    const last = ring[ring.length - 1];
    if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
      return `${context} polygon rings must be closed.`;
    }
  }
  if (geometry.type === "GeometryCollection") {
    for (const [index, child] of geometry.geometries.entries()) {
      const error = validateGeometry(child, `${context} geometry ${index + 1}`);
      if (error) return error;
    }
  }
  return undefined;
}

export function featureId(
  feature: GeoFeature,
  idProperty = "id",
): string | undefined {
  const propertyValue = feature.properties?.[idProperty];
  const raw = feature.id ?? propertyValue;
  if (typeof raw !== "string" && typeof raw !== "number") return undefined;
  const id = String(raw).trim();
  return id || undefined;
}

export function featureLabel(
  feature: GeoFeature,
  fallback: string,
  labelProperty = "name",
) {
  const raw = feature.properties?.[labelProperty];
  return typeof raw === "string" && raw.trim() ? raw.trim() : fallback;
}

export function validateFeatureCollection(
  collection: GeoFeatureCollection,
  options: { idProperty?: string; labelProperty?: string; allowEmpty?: boolean } = {},
): MapValidationResult<
  readonly { id: string; label: string; feature: GeoFeature }[]
> {
  if (!collection || collection.type !== "FeatureCollection" || !Array.isArray(collection.features)) {
    return { ok: false, message: "Expected a GeoJSON FeatureCollection." };
  }
  if (!options.allowEmpty && collection.features.length === 0) {
    return { ok: false, message: "GeoJSON FeatureCollection has no features." };
  }
  const ids = new Set<string>();
  const normalized: Array<{ id: string; label: string; feature: GeoFeature }> = [];
  for (const [index, feature] of collection.features.entries()) {
    if (!feature || feature.type !== "Feature") {
      return { ok: false, message: `GeoJSON item ${index + 1} is not a Feature.` };
    }
    if (!feature.geometry) {
      return { ok: false, message: `GeoJSON feature ${index + 1} has no geometry.` };
    }
    const id = featureId(feature, options.idProperty);
    if (!id) {
      return {
        ok: false,
        message: `GeoJSON feature ${index + 1} needs feature.id or properties.${options.idProperty ?? "id"}.`,
      };
    }
    if (ids.has(id)) {
      return { ok: false, message: `GeoJSON feature id ${JSON.stringify(id)} is duplicated.` };
    }
    const error = validateGeometry(feature.geometry, `GeoJSON feature ${JSON.stringify(id)}`);
    if (error) return { ok: false, message: error };
    ids.add(id);
    normalized.push({
      id,
      label: featureLabel(feature, id, options.labelProperty),
      feature,
    });
  }
  return { ok: true, data: normalized };
}

export function normalizeMapPoints(
  points: readonly MapPointDatum[],
): MapValidationResult<readonly NormalizedMapPoint[]> {
  if (points.length === 0) return { ok: false, message: "Add at least one map point." };
  const ids = new Set<string>();
  let mode: "geographic" | "schematic" | undefined;
  const normalized: NormalizedMapPoint[] = [];
  for (const [index, point] of points.entries()) {
    if (!isGeoPointDatum(point) && !isPlanarPointDatum(point)) {
      return {
        ok: false,
        message: `Map point ${index + 1} needs longitude/latitude or x/y coordinates.`,
      };
    }
    const currentMode = isGeoPointDatum(point) ? "geographic" : "schematic";
    if (mode && currentMode !== mode) {
      return { ok: false, message: "Do not mix geographic and schematic points." };
    }
    mode = currentMode;
    const id = point.id?.trim() || `point-${index + 1}`;
    if (ids.has(id)) {
      return { ok: false, message: `Map point id ${JSON.stringify(id)} is duplicated.` };
    }
    if (isGeoPointDatum(point)) {
      if (!isGeoCoordinate([point.longitude, point.latitude])) {
        return { ok: false, message: `Map point ${JSON.stringify(id)} has invalid longitude/latitude.` };
      }
      normalized.push({
        id,
        mode: "geographic",
        longitude: point.longitude,
        latitude: point.latitude,
        value: point.value ?? 1,
        label: point.label?.trim() || id,
        ...(point.color ? { color: point.color } : {}),
        ...(point.category ? { category: point.category } : {}),
        ...(point.symbol ? { symbol: point.symbol } : {}),
        ...(point.imageUrl ? { imageUrl: point.imageUrl } : {}),
      });
    } else if (!isFiniteNumber(point.x) || !isFiniteNumber(point.y)) {
      return { ok: false, message: `Map point ${JSON.stringify(id)} has invalid x/y coordinates.` };
    } else {
      normalized.push({
        id,
        mode: "schematic",
        x: point.x,
        y: point.y,
        value: point.value ?? 1,
        label: point.label?.trim() || id,
        ...(point.color ? { color: point.color } : {}),
        ...(point.category ? { category: point.category } : {}),
        ...(point.symbol ? { symbol: point.symbol } : {}),
        ...(point.imageUrl ? { imageUrl: point.imageUrl } : {}),
      });
    }
    if (point.value !== undefined && (!isFiniteNumber(point.value) || point.value < 0)) {
      return { ok: false, message: `Map point ${JSON.stringify(id)} has an invalid value.` };
    }
    ids.add(id);
  }
  return { ok: true, data: normalized };
}

function geoEndpoint(endpoint: GeoRouteEndpoint): GeoCoordinate | undefined {
  if (Array.isArray(endpoint)) return isGeoCoordinate(endpoint) ? endpoint : undefined;
  if ("longitude" in endpoint && "latitude" in endpoint) {
    const coordinate: GeoCoordinate = [endpoint.longitude, endpoint.latitude];
    return isGeoCoordinate(coordinate) ? coordinate : undefined;
  }
  return undefined;
}

function planarEndpoint(endpoint: GeoRouteEndpoint): readonly [number, number] | undefined {
  if (!Array.isArray(endpoint) && "x" in endpoint && "y" in endpoint) {
    return isFiniteNumber(endpoint.x) && isFiniteNumber(endpoint.y)
      ? [endpoint.x, endpoint.y]
      : undefined;
  }
  return undefined;
}

export function normalizeMapRoutes(
  routes: readonly MapRouteDatum[],
): MapValidationResult<readonly NormalizedMapRoute[]> {
  if (routes.length === 0) return { ok: false, message: "Add at least one map route." };
  let mode: "geographic" | "schematic" | undefined;
  const ids = new Set<string>();
  const normalized: NormalizedMapRoute[] = [];
  for (const [index, route] of routes.entries()) {
    const fromGeo = geoEndpoint(route.from);
    const toGeo = geoEndpoint(route.to);
    const fromPlanar = planarEndpoint(route.from);
    const toPlanar = planarEndpoint(route.to);
    const currentMode = fromGeo && toGeo ? "geographic" : fromPlanar && toPlanar ? "schematic" : undefined;
    if (!currentMode) {
      return {
        ok: false,
        message: `Map route ${index + 1} must use two geographic endpoints or two schematic endpoints.`,
      };
    }
    if (mode && currentMode !== mode) {
      return { ok: false, message: "Do not mix geographic and schematic routes." };
    }
    mode = currentMode;
    const id = route.id?.trim() || `route-${index + 1}`;
    if (ids.has(id)) return { ok: false, message: `Map route id ${JSON.stringify(id)} is duplicated.` };
    if (route.value !== undefined && (!isFiniteNumber(route.value) || route.value <= 0)) {
      return { ok: false, message: `Map route ${JSON.stringify(id)} has an invalid value.` };
    }
    if (
      (fromGeo && toGeo && fromGeo[0] === toGeo[0] && fromGeo[1] === toGeo[1]) ||
      (fromPlanar &&
        toPlanar &&
        fromPlanar[0] === toPlanar[0] &&
        fromPlanar[1] === toPlanar[1])
    ) {
      return { ok: false, message: `Map route ${JSON.stringify(id)} has identical endpoints.` };
    }
    ids.add(id);
    normalized.push({
      id,
      mode: currentMode,
      value: route.value ?? 1,
      label: route.label?.trim() || id,
      ...(fromGeo && toGeo ? { fromGeo, toGeo } : { fromPlanar: fromPlanar!, toPlanar: toPlanar! }),
      ...(route.color ? { color: route.color } : {}),
    });
  }
  return { ok: true, data: normalized };
}

function projectionFor(kind: GeoProjectionKind): d3.GeoProjection {
  switch (kind) {
    case "mercator":
      return d3.geoMercator();
    case "natural-earth":
      return d3.geoNaturalEarth1();
    case "equirectangular":
      return d3.geoEquirectangular();
    case "equal-earth":
      return d3.geoEqualEarth();
  }
}

function featureCollectionObject(features: readonly GeoFeature[]) {
  return {
    type: "FeatureCollection",
    features,
  } as GeoFeatureCollection;
}

export function createGeoLayout(options: {
  features?: GeoFeatureCollection;
  coordinates?: readonly GeoCoordinate[];
  projection?: GeoProjectionKind;
  width?: number;
  height?: number;
  padding?: number;
  idProperty?: string;
  labelProperty?: string;
  fit?: "data" | "world";
}): MapValidationResult<GeoLayout> {
  const width = options.width ?? 400;
  const height = options.height ?? 280;
  const padding = options.padding ?? 18;
  const projectionKind = options.projection ?? "equal-earth";
  if (![width, height, padding].every(isFiniteNumber)) {
    return { ok: false, message: "Map dimensions must be finite numbers." };
  }
  if (width <= padding * 2 || height <= padding * 2 || padding < 0) {
    return { ok: false, message: "Map padding leaves no drawable area." };
  }

  const normalizedFeatures = options.features
    ? validateFeatureCollection(options.features, {
        idProperty: options.idProperty,
        labelProperty: options.labelProperty,
      })
    : ({ ok: true, data: [] } as const);
  if (!normalizedFeatures.ok) return normalizedFeatures;
  const coordinates = options.coordinates ?? [];
  for (const coordinate of coordinates) {
    if (!isGeoCoordinate(coordinate)) {
      return { ok: false, message: "Map bounds include an invalid longitude/latitude coordinate." };
    }
  }

  const geometries: GeoGeometry[] = normalizedFeatures.data.flatMap(({ feature }) =>
    feature.geometry ? [feature.geometry] : [],
  );
  if (coordinates.length) {
    geometries.push({ type: "MultiPoint", coordinates });
  }
  // Degenerate one-point bounds are expanded by one degree so fitExtent never
  // produces an infinite or unusably large projection scale.
  if (geometries.length === 1 && coordinates.length === 1 && normalizedFeatures.data.length === 0) {
    const [longitude, latitude] = coordinates[0]!;
    geometries.push({
      type: "MultiPoint",
      coordinates: [
        [clamp(longitude - 1, -180, 180), clamp(latitude - 1, -90, 90)],
        [clamp(longitude + 1, -180, 180), clamp(latitude + 1, -90, 90)],
      ],
    });
  }

  const fitObject =
    options.fit === "world" || geometries.length === 0
      ? ({ type: "Sphere" } as const)
      : ({ type: "GeometryCollection", geometries } as GeoGeometryCollection);
  const projection = projectionFor(projectionKind);
  projection.fitExtent(
    [
      [padding, padding],
      [width - padding, height - padding],
    ],
    fitObject as unknown as d3.GeoPermissibleObjects,
  );
  projection.scale(clamp(projection.scale(), 24, 5000));
  const path = d3.geoPath(projection);
  const spherePath = path({ type: "Sphere" } as d3.GeoPermissibleObjects) ?? "";
  const graticulePath = path(d3.geoGraticule10()) ?? "";
  const layoutFeatures: GeoLayoutFeature[] = [];
  for (const normalized of normalizedFeatures.data) {
    const datum = normalized.feature as unknown as d3.GeoPermissibleObjects;
    const featurePath = path(datum);
    const centroid = path.centroid(datum);
    if (!featurePath || !centroid.every(Number.isFinite)) {
      return {
        ok: false,
        message: `GeoJSON feature ${JSON.stringify(normalized.id)} cannot be projected.`,
      };
    }
    layoutFeatures.push({
      ...normalized,
      path: featurePath,
      centroid: [centroid[0], centroid[1]],
    });
  }

  const project = (coordinate: GeoCoordinate) => {
    const point = projection(coordinate as [number, number]);
    return point && point.every(Number.isFinite)
      ? ([point[0], point[1]] as const)
      : undefined;
  };
  const pathForGeometry = (geometry: GeoGeometry) => {
    const result = path(geometry as unknown as d3.GeoPermissibleObjects);
    return result || undefined;
  };
  const invert = (point: readonly [number, number]) => {
    const coordinate = projection.invert?.(point as [number, number]);
    return coordinate && isGeoCoordinate(coordinate)
      ? ([coordinate[0], coordinate[1]] as const)
      : undefined;
  };
  const distanceForPixels = (start: readonly [number, number], pixels: number) => {
    if (!Number.isFinite(pixels) || pixels <= 0) return undefined;
    const from = invert(start);
    const to = invert([start[0] + pixels, start[1]]);
    if (!from || !to) return undefined;
    return d3.geoDistance(from as [number, number], to as [number, number]) * 6371.0088;
  };
  const bounds = d3.geoBounds(fitObject as unknown as d3.GeoPermissibleObjects);
  return {
    ok: true,
    data: {
      width,
      height,
      padding,
      projection: projectionKind,
      features: layoutFeatures,
      spherePath,
      graticulePath,
      geographicBounds: [
        [bounds[0][0], bounds[0][1]],
        [bounds[1][0], bounds[1][1]],
      ],
      project,
      pathForGeometry,
      invert,
      distanceForPixels,
    },
  };
}

export function normalizeFeatureValues(
  data: readonly GeoFeatureValueDatum[] | undefined,
  values: Readonly<Record<string, number>> | undefined,
): MapValidationResult<ReadonlyMap<string, GeoFeatureValueDatum>> {
  const joined = new Map<string, GeoFeatureValueDatum>();
  if (values) {
    for (const [featureIdValue, value] of Object.entries(values)) {
      if (!featureIdValue.trim() || !isFiniteNumber(value)) {
        return { ok: false, message: "Feature value records need non-empty ids and finite values." };
      }
      joined.set(featureIdValue, { featureId: featureIdValue, value });
    }
  }
  const dataIds = new Set<string>();
  for (const [index, datum] of (data ?? []).entries()) {
    const id = datum.featureId?.trim();
    if (!id || !isFiniteNumber(datum.value)) {
      return { ok: false, message: `Feature data row ${index + 1} needs an id and finite value.` };
    }
    if (dataIds.has(id)) {
      return { ok: false, message: `Feature data id ${JSON.stringify(id)} is duplicated.` };
    }
    if (joined.has(id)) {
      return {
        ok: false,
        message: `Feature id ${JSON.stringify(id)} is supplied in both data and values. Use one join source.`,
      };
    }
    dataIds.add(id);
    joined.set(id, { ...datum, featureId: id });
  }
  return { ok: true, data: joined };
}

export function validateSchematicRegions(
  regions: readonly SchematicRegion[],
): MapValidationResult<readonly SchematicRegion[]> {
  if (regions.length === 0) {
    return { ok: false, message: "Add at least one schematic region." };
  }
  const ids = new Set<string>();
  const normalized: SchematicRegion[] = [];
  for (const [index, region] of regions.entries()) {
    const id = region.id?.trim();
    const label = region.label?.trim();
    if (!id || !label || !region.path?.trim()) {
      return {
        ok: false,
        message: `Schematic region ${index + 1} needs an id, label, and SVG path.`,
      };
    }
    if (ids.has(id)) {
      return { ok: false, message: `Schematic region id ${JSON.stringify(id)} is duplicated.` };
    }
    if (!isFiniteNumber(region.cx) || !isFiniteNumber(region.cy)) {
      return {
        ok: false,
        message: `Schematic region ${JSON.stringify(id)} needs a finite label position.`,
      };
    }
    ids.add(id);
    normalized.push({ ...region, id, label, path: region.path.trim() });
  }
  return { ok: true, data: normalized };
}

export function createClampedScale(
  values: readonly number[],
  range: readonly [number, number],
  transform: "linear" | "sqrt" = "linear",
) {
  const finite = values.filter(isFiniteNumber);
  const minimum = finite.reduce((current, value) => Math.min(current, value), Infinity);
  const maximum = finite.reduce((current, value) => Math.max(current, value), -Infinity);
  const low = Number.isFinite(minimum) ? minimum : 0;
  const high = Number.isFinite(maximum) ? maximum : 1;
  const map = (value: number) => {
    const normalized = high === low ? 0.5 : clamp((value - low) / (high - low), 0, 1);
    const eased = transform === "sqrt" ? Math.sqrt(normalized) : normalized;
    return range[0] + eased * (range[1] - range[0]);
  };
  return { minimum: low, maximum: high, map };
}

export function clusterProjectedPoints(
  points: readonly { id: string; x: number; y: number; value: number; label: string }[],
  cellSize = 34,
): MapValidationResult<readonly ProjectedPointCluster[]> {
  if (!Number.isFinite(cellSize) || cellSize <= 0) {
    return { ok: false, message: "Cluster cell size must be a positive finite number." };
  }
  const buckets = new Map<
    string,
    { points: typeof points[number][]; xTotal: number; yTotal: number; value: number }
  >();
  for (const point of points) {
    if (![point.x, point.y, point.value].every(isFiniteNumber)) {
      return { ok: false, message: `Projected point ${JSON.stringify(point.id)} is invalid.` };
    }
    const key = `${Math.floor(point.x / cellSize)}:${Math.floor(point.y / cellSize)}`;
    const bucket = buckets.get(key) ?? { points: [], xTotal: 0, yTotal: 0, value: 0 };
    bucket.points.push(point);
    bucket.xTotal += point.x;
    bucket.yTotal += point.y;
    bucket.value += point.value;
    buckets.set(key, bucket);
  }
  return {
    ok: true,
    data: [...buckets.entries()]
      .sort(([left], [right]) => left.localeCompare(right, "en", { numeric: true }))
      .map(([key, bucket]) => {
        const orderedPoints = [...bucket.points].sort((left, right) =>
          left.id.localeCompare(right.id),
        );
        return {
          id: `cluster-${key}`,
          x: bucket.xTotal / bucket.points.length,
          y: bucket.yTotal / bucket.points.length,
          count: bucket.points.length,
          value: bucket.value,
          pointIds: orderedPoints.map((point) => point.id),
          labels: orderedPoints.map((point) => point.label),
        };
      }),
  };
}

export function featureCollection(
  features: readonly GeoFeature[],
): GeoFeatureCollection {
  return featureCollectionObject(features);
}
