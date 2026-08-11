/**
 * Pure validation and layout helpers for the flow / network / hierarchy
 * components. Keeping this module free of React makes the public data contract
 * usable in tests, server-side preprocessing, and non-visual tooling.
 */

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };

export type SankeyNodeDatum = {
  /** Stable link target. Falls back to `name` when omitted. */
  id?: string;
  name: string;
  /** Optional capacity. Link totals still determine the minimum rendered size. */
  value?: number;
  color?: string;
};

export type SankeyLinkDatum = {
  /** A node id/name or a zero-based node index. */
  source: string | number;
  /** A node id/name or a zero-based node index. */
  target: string | number;
  value: number;
  label?: string;
  color?: string;
};

export type SankeyLayoutNode = {
  id: string;
  name: string;
  index: number;
  layer: number;
  value: number;
  incomingValue: number;
  outgoingValue: number;
  color?: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
};

export type SankeyLayoutLink = {
  id: string;
  source: SankeyLayoutNode;
  target: SankeyLayoutNode;
  value: number;
  label?: string;
  color?: string;
  sourceY: number;
  targetY: number;
  thickness: number;
};

export type SankeyLayout = {
  width: number;
  height: number;
  nodes: readonly SankeyLayoutNode[];
  links: readonly SankeyLayoutLink[];
};

type ResolvedFlowLink = {
  sourceIndex: number;
  targetIndex: number;
  value: number;
  label?: string;
  color?: string;
  inputIndex: number;
};

function finiteNonNegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function resolveFlowEndpoint(
  endpoint: string | number,
  nodeIndex: ReadonlyMap<string, number>,
  nodeCount: number,
): number | undefined {
  if (typeof endpoint === "number") {
    return Number.isInteger(endpoint) && endpoint >= 0 && endpoint < nodeCount
      ? endpoint
      : undefined;
  }
  return nodeIndex.get(endpoint.trim());
}

/**
 * Produces a left-to-right, value-conserving Sankey layout. Node height is the
 * maximum of incoming flow, outgoing flow, and declared capacity. Each link is
 * stacked within both endpoint nodes at exactly one shared value scale.
 */
export function buildSankeyLayout(
  inputNodes: readonly SankeyNodeDatum[],
  inputLinks: readonly SankeyLinkDatum[],
  options: {
    width?: number;
    height?: number;
    nodeWidth?: number;
    paddingX?: number;
    paddingY?: number;
  } = {},
): ValidationResult<SankeyLayout> {
  const width = options.width ?? 400;
  const height = options.height ?? 220;
  const nodeWidth = options.nodeWidth ?? 12;
  const paddingX = options.paddingX ?? 42;
  const paddingY = options.paddingY ?? 14;

  if (![width, height, nodeWidth, paddingX, paddingY].every(Number.isFinite)) {
    return { ok: false, message: "Layout dimensions must be finite numbers." };
  }
  if (width <= 0 || height <= 0 || nodeWidth <= 0 || paddingX < 0 || paddingY < 0) {
    return { ok: false, message: "Layout dimensions must be positive." };
  }
  if (width <= paddingX * 2 + nodeWidth || height <= paddingY * 2) {
    return { ok: false, message: "Layout padding leaves no room for the flow diagram." };
  }
  if (inputNodes.length === 0) {
    return { ok: false, message: "Add at least one flow node." };
  }
  if (inputLinks.length === 0) {
    return { ok: false, message: "Add at least one positive flow link." };
  }

  const nodeIndex = new Map<string, number>();
  const nameCounts = new Map<string, number>();
  const normalizedNodes: Array<{
    id: string;
    name: string;
    value: number;
    color?: string;
  }> = [];

  for (const [index, node] of inputNodes.entries()) {
    const name = node.name?.trim();
    const id = node.id?.trim() || name;
    if (!name) {
      return { ok: false, message: `Flow node ${index + 1} needs a name.` };
    }
    if (!id) {
      return { ok: false, message: `Flow node ${index + 1} needs an id or name.` };
    }
    if (nodeIndex.has(id)) {
      return { ok: false, message: `Flow node id ${JSON.stringify(id)} is duplicated.` };
    }
    if (node.value !== undefined && !finiteNonNegative(node.value)) {
      return {
        ok: false,
        message: `Flow node ${JSON.stringify(id)} has an invalid value.`,
      };
    }
    nodeIndex.set(id, index);
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
    normalizedNodes.push({
      id,
      name,
      value: node.value ?? 0,
      ...(node.color ? { color: node.color } : {}),
    });
  }

  // Names are convenient endpoints when they are unambiguous. Explicit ids
  // remain authoritative if a name collides with another node's id.
  normalizedNodes.forEach((node, index) => {
    if (nameCounts.get(node.name) === 1 && !nodeIndex.has(node.name)) {
      nodeIndex.set(node.name, index);
    }
  });

  const resolvedLinks: ResolvedFlowLink[] = [];
  for (const [inputIndex, link] of inputLinks.entries()) {
    if (!Number.isFinite(link.value) || link.value <= 0) {
      return {
        ok: false,
        message: `Flow link ${inputIndex + 1} must have a positive finite value.`,
      };
    }
    const sourceIndex = resolveFlowEndpoint(link.source, nodeIndex, inputNodes.length);
    const targetIndex = resolveFlowEndpoint(link.target, nodeIndex, inputNodes.length);
    if (sourceIndex === undefined) {
      return {
        ok: false,
        message: `Flow link ${inputIndex + 1} has an unresolved source ${JSON.stringify(link.source)}.`,
      };
    }
    if (targetIndex === undefined) {
      return {
        ok: false,
        message: `Flow link ${inputIndex + 1} has an unresolved target ${JSON.stringify(link.target)}.`,
      };
    }
    if (sourceIndex === targetIndex) {
      return { ok: false, message: `Flow link ${inputIndex + 1} cannot target itself.` };
    }
    resolvedLinks.push({
      sourceIndex,
      targetIndex,
      value: link.value,
      inputIndex,
      ...(link.label ? { label: link.label } : {}),
      ...(link.color ? { color: link.color } : {}),
    });
  }

  // Longest-path strata via stable Kahn traversal. Cycles cannot be represented
  // truthfully by a left-to-right Sankey, so fail before drawing back-links.
  const indegree = Array(inputNodes.length).fill(0) as number[];
  const outgoing = Array.from({ length: inputNodes.length }, () => [] as ResolvedFlowLink[]);
  const incoming = Array.from({ length: inputNodes.length }, () => [] as ResolvedFlowLink[]);
  for (const link of resolvedLinks) {
    indegree[link.targetIndex] += 1;
    outgoing[link.sourceIndex]!.push(link);
    incoming[link.targetIndex]!.push(link);
  }
  const queue = indegree
    .map((degree, index) => ({ degree, index }))
    .filter(({ degree }) => degree === 0)
    .map(({ index }) => index);
  const layers = Array(inputNodes.length).fill(0) as number[];
  let visited = 0;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const sourceIndex = queue[cursor]!;
    visited += 1;
    for (const link of outgoing[sourceIndex]!) {
      layers[link.targetIndex] = Math.max(
        layers[link.targetIndex]!,
        layers[sourceIndex]! + 1,
      );
      indegree[link.targetIndex] -= 1;
      if (indegree[link.targetIndex] === 0) queue.push(link.targetIndex);
    }
  }
  if (visited !== inputNodes.length) {
    return {
      ok: false,
      message: "Flow links contain a cycle. Sankey and alluvial strata must be acyclic.",
    };
  }

  const maxLayer = layers.reduce((maximum, layer) => Math.max(maximum, layer), 0);
  // Justify terminal nodes to the final stratum, matching standard Sankey
  // alignment while preserving every edge's forward direction.
  layers.forEach((layer, index) => {
    if (outgoing[index]!.length === 0 && incoming[index]!.length > 0) {
      layers[index] = maxLayer;
    } else {
      layers[index] = layer;
    }
  });

  const incomingTotals = incoming.map((group) =>
    group.reduce((sum, link) => sum + link.value, 0),
  );
  const outgoingTotals = outgoing.map((group) =>
    group.reduce((sum, link) => sum + link.value, 0),
  );
  const isolatedValue =
    resolvedLinks.reduce((minimum, link) => Math.min(minimum, link.value), Infinity) * 0.2;
  const values = normalizedNodes.map((node, index) =>
    Math.max(node.value, incomingTotals[index]!, outgoingTotals[index]!, isolatedValue),
  );

  const columns = Array.from({ length: maxLayer + 1 }, () => [] as number[]);
  layers.forEach((layer, index) => columns[layer]!.push(index));
  const innerHeight = height - paddingY * 2;
  const columnGaps = columns.map((column) =>
    column.length > 1 ? Math.min(12, innerHeight / (column.length * 3)) : 0,
  );
  const scaleCandidates = columns
    .filter((column) => column.length > 0)
    .map((column, columnIndex) => {
      const total = column.reduce((sum, nodeIndexValue) => sum + values[nodeIndexValue]!, 0);
      const available = innerHeight - columnGaps[columnIndex]! * (column.length - 1);
      return total > 0 ? available / total : Infinity;
    });
  const valueScale = scaleCandidates.reduce(
    (minimum, candidate) => Math.min(minimum, candidate),
    Infinity,
  );
  if (!Number.isFinite(valueScale) || valueScale <= 0) {
    return { ok: false, message: "Flow values cannot fit within the requested layout." };
  }

  const innerWidth = Math.max(0, width - paddingX * 2 - nodeWidth);
  const layoutNodes: SankeyLayoutNode[] = normalizedNodes.map((node, index) => ({
    ...node,
    index,
    layer: layers[index]!,
    value: values[index]!,
    incomingValue: incomingTotals[index]!,
    outgoingValue: outgoingTotals[index]!,
    x0:
      paddingX +
      (maxLayer === 0 ? innerWidth / 2 : (layers[index]! / maxLayer) * innerWidth),
    x1:
      paddingX +
      (maxLayer === 0 ? innerWidth / 2 : (layers[index]! / maxLayer) * innerWidth) +
      nodeWidth,
    y0: 0,
    y1: 0,
  }));

  columns.forEach((column, columnIndex) => {
    const gap = columnGaps[columnIndex]!;
    const used =
      column.reduce((sum, nodeIndexValue) => sum + values[nodeIndexValue]! * valueScale, 0) +
      gap * Math.max(0, column.length - 1);
    let cursor = paddingY + (innerHeight - used) / 2;
    for (const nodeIndexValue of column) {
      const node = layoutNodes[nodeIndexValue]!;
      node.y0 = cursor;
      node.y1 = cursor + values[nodeIndexValue]! * valueScale;
      cursor = node.y1 + gap;
    }
  });

  const sourceY = new Map<number, number>();
  const targetY = new Map<number, number>();
  const sourceOffsets = new Map<number, number>();
  const targetOffsets = new Map<number, number>();
  [...resolvedLinks]
    .sort(
      (a, b) =>
        a.sourceIndex - b.sourceIndex ||
        layoutNodes[a.targetIndex]!.y0 - layoutNodes[b.targetIndex]!.y0 ||
        a.inputIndex - b.inputIndex,
    )
    .forEach((link) => {
      const node = layoutNodes[link.sourceIndex]!;
      const offset = sourceOffsets.get(link.sourceIndex) ?? 0;
      sourceY.set(link.inputIndex, node.y0 + offset + (link.value * valueScale) / 2);
      sourceOffsets.set(link.sourceIndex, offset + link.value * valueScale);
    });
  [...resolvedLinks]
    .sort(
      (a, b) =>
        a.targetIndex - b.targetIndex ||
        layoutNodes[a.sourceIndex]!.y0 - layoutNodes[b.sourceIndex]!.y0 ||
        a.inputIndex - b.inputIndex,
    )
    .forEach((link) => {
      const node = layoutNodes[link.targetIndex]!;
      const offset = targetOffsets.get(link.targetIndex) ?? 0;
      targetY.set(link.inputIndex, node.y0 + offset + (link.value * valueScale) / 2);
      targetOffsets.set(link.targetIndex, offset + link.value * valueScale);
    });

  const layoutLinks: SankeyLayoutLink[] = resolvedLinks.map((link) => ({
    id: `${layoutNodes[link.sourceIndex]!.id}->${layoutNodes[link.targetIndex]!.id}:${link.inputIndex}`,
    source: layoutNodes[link.sourceIndex]!,
    target: layoutNodes[link.targetIndex]!,
    value: link.value,
    ...(link.label ? { label: link.label } : {}),
    ...(link.color ? { color: link.color } : {}),
    sourceY: sourceY.get(link.inputIndex)!,
    targetY: targetY.get(link.inputIndex)!,
    thickness: link.value * valueScale,
  }));

  return {
    ok: true,
    data: { width, height, nodes: layoutNodes, links: layoutLinks },
  };
}

export type ChordDatum = {
  id: string;
  label: string;
  color?: string;
};

export type ChordInput = {
  groups: readonly ChordDatum[];
  matrix: readonly (readonly number[])[];
};

export function validateChordInput(
  groups: readonly ChordDatum[],
  matrix: readonly (readonly number[])[],
): ValidationResult<ChordInput> {
  if (groups.length === 0) {
    return { ok: false, message: "Add at least one chord group." };
  }
  const ids = new Set<string>();
  for (const [index, group] of groups.entries()) {
    if (!group.id?.trim() || !group.label?.trim()) {
      return { ok: false, message: `Chord group ${index + 1} needs an id and label.` };
    }
    const id = group.id.trim();
    if (ids.has(id)) {
      return {
        ok: false,
        message: `Chord group id ${JSON.stringify(id)} is duplicated.`,
      };
    }
    ids.add(id);
  }
  if (matrix.length !== groups.length) {
    return { ok: false, message: "Chord matrix size must match the group count." };
  }
  let total = 0;
  for (const [rowIndex, row] of matrix.entries()) {
    if (row.length !== groups.length) {
      return {
        ok: false,
        message: `Chord matrix row ${rowIndex + 1} must contain ${groups.length} values.`,
      };
    }
    for (const value of row) {
      if (!finiteNonNegative(value)) {
        return { ok: false, message: "Chord matrix values must be finite and non-negative." };
      }
      total += value;
    }
  }
  if (total <= 0) {
    return { ok: false, message: "Chord matrix must contain at least one positive value." };
  }
  return { ok: true, data: { groups, matrix } };
}

export type NetworkNodeDatum = {
  id: string;
  label?: string;
  group?: string | number;
  value?: number;
  /** Optional initial coordinates in the chart's 400×240 viewBox. */
  x?: number;
  y?: number;
  color?: string;
};

export type NetworkLinkDatum = {
  source: string;
  target: string;
  value?: number;
  label?: string;
};

export type ResolvedNetworkNode = NetworkNodeDatum & {
  id: string;
  label: string;
  group: string | number;
  value: number;
};

export type ResolvedNetworkLink = NetworkLinkDatum & {
  source: string;
  target: string;
  value: number;
};

export function validateNetworkInput(
  inputNodes: readonly NetworkNodeDatum[],
  inputLinks: readonly NetworkLinkDatum[],
): ValidationResult<{
  nodes: readonly ResolvedNetworkNode[];
  links: readonly ResolvedNetworkLink[];
}> {
  if (inputNodes.length === 0) {
    return { ok: false, message: "Add at least one network node." };
  }
  const ids = new Set<string>();
  const nodes: ResolvedNetworkNode[] = [];
  for (const [index, node] of inputNodes.entries()) {
    const id = node.id?.trim();
    if (!id) return { ok: false, message: `Network node ${index + 1} needs an id.` };
    if (ids.has(id)) {
      return { ok: false, message: `Network node id ${JSON.stringify(id)} is duplicated.` };
    }
    if ((node.x === undefined) !== (node.y === undefined)) {
      return {
        ok: false,
        message: `Network node ${JSON.stringify(id)} must provide both x and y, or neither.`,
      };
    }
    if (
      (node.x !== undefined && !Number.isFinite(node.x)) ||
      (node.y !== undefined && !Number.isFinite(node.y))
    ) {
      return { ok: false, message: `Network node ${JSON.stringify(id)} has invalid coordinates.` };
    }
    if (node.value !== undefined && (!Number.isFinite(node.value) || node.value <= 0)) {
      return { ok: false, message: `Network node ${JSON.stringify(id)} has an invalid value.` };
    }
    ids.add(id);
    nodes.push({
      ...node,
      id,
      label: node.label?.trim() || id,
      group: node.group ?? 0,
      value: node.value ?? 1,
    });
  }

  const links: ResolvedNetworkLink[] = [];
  for (const [index, link] of inputLinks.entries()) {
    const source = link.source?.trim();
    const target = link.target?.trim();
    if (!source || !ids.has(source)) {
      return {
        ok: false,
        message: `Network link ${index + 1} has an unresolved source ${JSON.stringify(link.source)}.`,
      };
    }
    if (!target || !ids.has(target)) {
      return {
        ok: false,
        message: `Network link ${index + 1} has an unresolved target ${JSON.stringify(link.target)}.`,
      };
    }
    if (source === target) {
      return { ok: false, message: `Network link ${index + 1} cannot target itself.` };
    }
    if (link.value !== undefined && (!Number.isFinite(link.value) || link.value <= 0)) {
      return { ok: false, message: `Network link ${index + 1} has an invalid value.` };
    }
    links.push({ ...link, source, target, value: link.value ?? 1 });
  }
  return { ok: true, data: { nodes, links } };
}

export type ProcessFlowStepDatum = {
  id: string;
  label: string;
  /** Optional authored coordinates. Supply both x and y for every step. */
  x?: number;
  y?: number;
  color?: string;
};

export type ProcessFlowLinkDatum = {
  source: string;
  target: string;
  label?: string;
};

export type PositionedProcessStep = ProcessFlowStepDatum & {
  cx: number;
  cy: number;
};

export type ProcessFlowLayout = {
  width: number;
  height: number;
  steps: readonly PositionedProcessStep[];
  links: readonly ProcessFlowLinkDatum[];
};

export function layoutProcessFlow(
  inputSteps: readonly ProcessFlowStepDatum[],
  inputLinks: readonly ProcessFlowLinkDatum[] | undefined,
  options: {
    width?: number;
    height?: number;
    nodeWidth?: number;
    nodeHeight?: number;
    padding?: number;
  } = {},
): ValidationResult<ProcessFlowLayout> {
  const width = options.width ?? 400;
  const height = options.height ?? 160;
  const nodeWidth = options.nodeWidth ?? 82;
  const nodeHeight = options.nodeHeight ?? 32;
  const padding = options.padding ?? 14;
  if (![width, height, nodeWidth, nodeHeight, padding].every(Number.isFinite)) {
    return { ok: false, message: "Process layout dimensions must be finite numbers." };
  }
  if (
    width <= nodeWidth + padding * 2 ||
    height <= nodeHeight + padding * 2 ||
    nodeWidth <= 0 ||
    nodeHeight <= 0 ||
    padding < 0
  ) {
    return { ok: false, message: "Process layout dimensions leave no room for steps." };
  }
  if (inputSteps.length === 0) {
    return { ok: false, message: "Add at least one process step." };
  }

  const ids = new Set<string>();
  const steps: ProcessFlowStepDatum[] = [];
  let positionedCount = 0;
  for (const [index, step] of inputSteps.entries()) {
    const id = step.id?.trim();
    const label = step.label?.trim();
    if (!id || !label) {
      return { ok: false, message: `Process step ${index + 1} needs an id and label.` };
    }
    if (ids.has(id)) {
      return { ok: false, message: `Process step id ${JSON.stringify(id)} is duplicated.` };
    }
    if ((step.x === undefined) !== (step.y === undefined)) {
      return {
        ok: false,
        message: `Process step ${JSON.stringify(id)} must provide both x and y, or neither.`,
      };
    }
    if (
      (step.x !== undefined && !Number.isFinite(step.x)) ||
      (step.y !== undefined && !Number.isFinite(step.y))
    ) {
      return { ok: false, message: `Process step ${JSON.stringify(id)} has invalid coordinates.` };
    }
    if (step.x !== undefined) positionedCount += 1;
    ids.add(id);
    steps.push({ ...step, id, label });
  }
  if (positionedCount !== 0 && positionedCount !== steps.length) {
    return {
      ok: false,
      message: "Either position every process step or let the chart position all of them.",
    };
  }

  const links = inputLinks
    ? inputLinks.map((link) => ({
        ...link,
        source: link.source?.trim(),
        target: link.target?.trim(),
      }))
    : steps.slice(0, -1).map((step, index) => ({
        source: step.id,
        target: steps[index + 1]!.id,
      }));
  for (const [index, link] of links.entries()) {
    if (!ids.has(link.source)) {
      return {
        ok: false,
        message: `Process link ${index + 1} has an unresolved source ${JSON.stringify(link.source)}.`,
      };
    }
    if (!ids.has(link.target)) {
      return {
        ok: false,
        message: `Process link ${index + 1} has an unresolved target ${JSON.stringify(link.target)}.`,
      };
    }
    if (link.source === link.target) {
      return { ok: false, message: `Process link ${index + 1} cannot target itself.` };
    }
  }

  const minX = nodeWidth / 2 + padding;
  const maxX = width - nodeWidth / 2 - padding;
  const minY = nodeHeight / 2 + padding;
  const maxY = height - nodeHeight / 2 - padding;
  const fit = (value: number, low: number, high: number, outLow: number, outHigh: number) =>
    high === low ? (outLow + outHigh) / 2 : outLow + ((value - low) / (high - low)) * (outHigh - outLow);

  if (positionedCount === steps.length) {
    const xs = steps.map((step) => step.x!);
    const ys = steps.map((step) => step.y!);
    const xLow = xs.reduce((minimum, value) => Math.min(minimum, value), Infinity);
    const xHigh = xs.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
    const yLow = ys.reduce((minimum, value) => Math.min(minimum, value), Infinity);
    const yHigh = ys.reduce((maximum, value) => Math.max(maximum, value), -Infinity);
    const positionedSteps = steps.map((step) => ({
      ...step,
      cx: fit(step.x!, xLow, xHigh, minX, maxX),
      cy: fit(step.y!, yLow, yHigh, minY, maxY),
    }));
    const occupied = new Set<string>();
    for (const step of positionedSteps) {
      const key = `${step.cx}\u0000${step.cy}`;
      if (occupied.has(key)) {
        return {
          ok: false,
          message: "Authored process coordinates place multiple steps at the same point.",
        };
      }
      occupied.add(key);
    }
    return {
      ok: true,
      data: {
        width,
        height,
        steps: positionedSteps,
        links,
      },
    };
  }

  const indexById = new Map(steps.map((step, index) => [step.id, index]));
  const indegree = Array(steps.length).fill(0) as number[];
  const outgoing = Array.from({ length: steps.length }, () => [] as number[]);
  for (const link of links) {
    const source = indexById.get(link.source)!;
    const target = indexById.get(link.target)!;
    indegree[target] += 1;
    outgoing[source]!.push(target);
  }
  const queue = indegree
    .map((degree, index) => ({ degree, index }))
    .filter(({ degree }) => degree === 0)
    .map(({ index }) => index);
  const layers = Array(steps.length).fill(0) as number[];
  let visited = 0;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const source = queue[cursor]!;
    visited += 1;
    for (const target of outgoing[source]!) {
      layers[target] = Math.max(layers[target]!, layers[source]! + 1);
      indegree[target] -= 1;
      if (indegree[target] === 0) queue.push(target);
    }
  }

  if (visited !== steps.length) {
    // Cyclic processes are valid. A radial fallback preserves every branch and
    // loop instead of inventing a false left-to-right order.
    const radiusX = Math.max(0, (maxX - minX) / 2);
    const radiusY = Math.max(0, (maxY - minY) / 2);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    return {
      ok: true,
      data: {
        width,
        height,
        steps: steps.map((step, index) => {
          const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
          return {
            ...step,
            cx: centerX + Math.cos(angle) * radiusX,
            cy: centerY + Math.sin(angle) * radiusY,
          };
        }),
        links,
      },
    };
  }

  const maxLayer = layers.reduce((maximum, layer) => Math.max(maximum, layer), 0);
  const columns = Array.from({ length: maxLayer + 1 }, () => [] as number[]);
  layers.forEach((layer, index) => columns[layer]!.push(index));
  const positioned = new Array<PositionedProcessStep>(steps.length);
  columns.forEach((column, layer) => {
    column.forEach((stepIndex, row) => {
      positioned[stepIndex] = {
        ...steps[stepIndex]!,
        cx: maxLayer === 0 ? (minX + maxX) / 2 : fit(layer, 0, maxLayer, minX, maxX),
        cy: fit(row, 0, Math.max(column.length - 1, 0), minY, maxY),
      };
    });
  });
  return { ok: true, data: { width, height, steps: positioned, links } };
}

export type TreeDatum = {
  id?: string;
  name: string;
  /** Own contribution. Leaf nodes without a value default to one. */
  value?: number;
  children?: readonly TreeDatum[];
};

export function validateTreeInput(data: TreeDatum): ValidationResult<TreeDatum> {
  if (!data || typeof data !== "object") {
    return { ok: false, message: "Add a hierarchy root." };
  }
  const seenObjects = new WeakSet<object>();
  const ids = new Set<string>();
  const visit = (node: TreeDatum, path: string): string | undefined => {
    if (!node || typeof node !== "object") return `${path} is not a valid hierarchy node.`;
    if (seenObjects.has(node)) return `${path} reuses a node object or contains a cycle.`;
    seenObjects.add(node);
    if (!node.name?.trim()) return `${path} needs a name.`;
    if (node.id !== undefined) {
      const id = node.id.trim();
      if (!id) return `${path} has an empty id.`;
      if (ids.has(id)) return `Hierarchy node id ${JSON.stringify(id)} is duplicated.`;
      ids.add(id);
    }
    if (node.value !== undefined && !finiteNonNegative(node.value)) {
      return `${path} has an invalid value.`;
    }
    if (node.children !== undefined && !Array.isArray(node.children)) {
      return `${path} children must be an array.`;
    }
    for (const [index, child] of (node.children ?? []).entries()) {
      const error = visit(child, `${path} > child ${index + 1}`);
      if (error) return error;
    }
    return undefined;
  };
  const error = visit(data, "Hierarchy root");
  return error ? { ok: false, message: error } : { ok: true, data };
}
