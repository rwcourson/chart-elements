/**
 * Serializable catalog metadata. The gallery renderer lives in `catalog.tsx`;
 * this manifest is intentionally safe to inspect without loading every visual.
 */
/**
 * Evidence ladder for an entry's implementation. `review` means a backing
 * component exists but has not completed catalog verification; only an entry
 * with recorded verification evidence may move to `verified`.
 */
export type CatalogImplementationStatus =
  | "planned"
  | "implementing"
  | "review"
  | "verified";

export type CatalogSemanticKind =
  | "canonical"
  | "variant"
  | "alias"
  | "placeholder";

export type CatalogCapability =
  | "visualization"
  | "interactive-control"
  | "consumer-data"
  | "component-default-fixture"
  | "catalog-fixture"
  | "responsive-container"
  | "themed"
  | "animated"
  | "self-framed"
  | "demo-only";

export type CatalogManifestEntry = {
  /** Stable, globally unique catalog key. */
  id: string;
  title: string;
  category: string;
  /** Component-level variant, when the recipe selects one explicitly. */
  variant: string | null;
  component: string;
  status: CatalogImplementationStatus;
  /** Why the entry currently occupies its implementation status. */
  statusNote: string;
  semantic: {
    kind: CatalogSemanticKind;
    /** Canonical entry when this is a variant, alias, or placeholder mapping. */
    of?: string;
    /** Human-readable reason this entry exists separately. */
    distinction: string;
  };
  source: {
    module: string;
    exportName: string;
  };
  /** Runtime packages used by the source family, for lazy-loading/tooling hints. */
  dependencies: readonly string[];
  /** Serializable dynamic-import metadata; the renderer may choose how to load it. */
  lazyLoader: {
    module: string;
    exportName: string;
    clientOnly: boolean;
  };
  fixture:
    | { kind: "catalog"; ids: readonly string[] }
    | { kind: "component-default"; ids: readonly [] }
    | { kind: "none"; ids: readonly [] };
  docs: {
    slug: string;
    state: "missing" | "draft" | "published";
  };
  reference: {
    kind: "power-bi" | "chart-convention" | "component-pattern";
    label: string;
    /** Current entries are labels to research, not claims of a sourced match. */
    state: "catalog-label" | "source-linked";
    url?: string;
  };
  capabilities: readonly CatalogCapability[];
  /** Gallery compatibility metadata. */
  height?: number | "auto";
  selfFramed?: boolean;
};
