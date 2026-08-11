import assert from "node:assert/strict";
import test from "node:test";

import {
  clusterProjectedPoints,
  createClampedScale,
  createGeoLayout,
  featureCollection,
  normalizeFeatureValues,
  normalizeMapPoints,
  normalizeMapRoutes,
  validateFeatureCollection,
  validateSchematicRegions,
} from "../geo-core.ts";

const square = {
  type: "Feature",
  id: "square",
  properties: { name: "Test square" },
  geometry: {
    type: "Polygon",
    coordinates: [[[-88, 41], [-87, 41], [-87, 42], [-88, 42], [-88, 41]]],
  },
};

test("validates and fits provider-free GeoJSON", () => {
  const features = featureCollection([square]);
  const validated = validateFeatureCollection(features);
  assert.equal(validated.ok, true);

  const layout = createGeoLayout({ features, projection: "equal-earth" });
  assert.equal(layout.ok, true);
  assert.equal(layout.data.features.length, 1);
  assert.match(layout.data.features[0].path, /^M/);
  assert.ok(layout.data.features[0].centroid.every(Number.isFinite));
  assert.ok(layout.data.distanceForPixels([200, 140], 50) > 0);
});

test("fails malformed polygons and duplicate feature ids", () => {
  const open = {
    ...square,
    geometry: { ...square.geometry, coordinates: [[[-88, 41], [-87, 41], [-87, 42], [-88, 42]]] },
  };
  assert.equal(validateFeatureCollection(featureCollection([open])).ok, false);
  assert.equal(validateFeatureCollection(featureCollection([square, square])).ok, false);
});

test("keeps geographic and schematic coordinates explicit", () => {
  assert.equal(
    normalizeMapPoints([{ id: "geo", longitude: -87.6, latitude: 41.8, value: 2 }]).ok,
    true,
  );
  assert.equal(
    normalizeMapPoints([
      { id: "geo", longitude: -87.6, latitude: 41.8 },
      { id: "xy", x: 100, y: 80 },
    ]).ok,
    false,
  );
  assert.equal(
    normalizeMapRoutes([{ from: [-88, 41], to: { x: 100, y: 80 } }]).ok,
    false,
  );
});

test("rejects ambiguous joins and invalid schematic regions", () => {
  assert.equal(
    normalizeFeatureValues([{ featureId: "a", value: 2 }], { a: 1 }).ok,
    false,
  );
  assert.equal(
    validateSchematicRegions([
      { id: "a", label: "A", path: "M0,0Z", cx: 0, cy: 0 },
      { id: "a", label: "Again", path: "M1,1Z", cx: 1, cy: 1 },
    ]).ok,
    false,
  );
});

test("clamps quantitative scales and produces order-stable clusters", () => {
  const scale = createClampedScale([10, 20], [2, 8]);
  assert.equal(scale.map(-100), 2);
  assert.equal(scale.map(100), 8);

  const points = [
    { id: "b", x: 10, y: 12, value: 2, label: "B" },
    { id: "a", x: 12, y: 10, value: 1, label: "A" },
    { id: "c", x: 80, y: 80, value: 4, label: "C" },
  ];
  const forward = clusterProjectedPoints(points, 30);
  const reversed = clusterProjectedPoints([...points].reverse(), 30);
  assert.equal(forward.ok, true);
  assert.equal(reversed.ok, true);
  assert.deepEqual(
    forward.data.map(({ id, count, value, pointIds }) => ({ id, count, value, pointIds })),
    reversed.data.map(({ id, count, value, pointIds }) => ({ id, count, value, pointIds })),
  );
});
