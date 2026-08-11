"use client";

import * as React from "react";
import type {
  EmbedOptions,
  Result as VegaEmbedResult,
  VisualizationSpec,
} from "vega-embed";
import { cn } from "@/lib/utils";

export type DeclarativeRendererMode = "vega" | "vega-lite";

export type DeclarativeVisualProps = {
  spec: VisualizationSpec;
  mode?: DeclarativeRendererMode;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
  renderer?: "svg" | "canvas";
  /**
   * Vega specifications can load remote data and images. Network access is
   * disabled by default; opt in only for trusted specifications and sources.
   */
  allowExternalData?: boolean;
  options?: Omit<EmbedOptions, "mode" | "renderer" | "actions" | "defaultStyle">;
  onViewReady?: (view: VegaEmbedResult["view"]) => void;
  onError?: (error: Error) => void;
};

export type VegaChartProps = Omit<DeclarativeVisualProps, "mode">;
export type VegaLiteChartProps = Omit<DeclarativeVisualProps, "mode">;
export type DenebSpecRendererProps = DeclarativeVisualProps & {
  showNonAffiliationNotice?: boolean;
};

export type ScientificSpecVisualProps = VegaLiteChartProps & {
  methodLabel: string;
  units?: string;
  reference?: string;
};

const EMPTY_EMBED_OPTIONS: NonNullable<DeclarativeVisualProps["options"]> = {};

/**
 * Theme vega-tooltip to our chart chrome. `defaultStyle: false` skips Vega's
 * bundled CSS, so without this the floating panel is unstyled / hard to track
 * and hover feels broken even when the handler fires.
 */
function ensureVegaTooltipStyles() {
  if (typeof document === "undefined") return;
  const id = "ce-vega-tooltip-styles";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.textContent = `
#vg-tooltip-element {
  z-index: 40 !important;
  max-width: 16rem;
  padding: 0.5rem 0.75rem !important;
  border: 1px solid var(--chart-tooltip-border, rgb(15 23 42 / 0.12)) !important;
  border-radius: var(--radius, 10px) !important;
  background: var(--chart-tooltip-bg, #fff) !important;
  color: var(--chart-tooltip-fg, #10141c) !important;
  box-shadow: var(--overlay-shadow, 0 12px 32px rgb(15 23 42 / 0.14)) !important;
  font-family: var(--font-manrope), "Manrope", ui-sans-serif, system-ui, sans-serif !important;
  font-size: 12px !important;
  line-height: 1.45 !important;
  pointer-events: none !important;
}
#vg-tooltip-element table {
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
}
#vg-tooltip-element td {
  padding: 0.1rem 0;
  vertical-align: baseline;
}
#vg-tooltip-element td.key {
  color: var(--muted-foreground, #5b6675) !important;
  padding-right: 0.85rem;
  font-weight: 500;
}
#vg-tooltip-element td.value {
  color: var(--chart-tooltip-fg, #10141c) !important;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  text-align: right;
}
/* Dim non-hovered siblings is handled in the VL spec; keep canvas crisp. */
.ce-vega-host .marks .role-mark > path,
.ce-vega-host .marks .role-mark > rect {
  transition: opacity 120ms ease, stroke 120ms ease;
}
`;
  document.head.appendChild(style);
}

function pathLabel(path: Array<string | number>) {
  return path.reduce<string>(
    (label, segment) =>
      typeof segment === "number" ? `${label}[${segment}]` : label ? `${label}.${segment}` : segment,
    "",
  );
}

/** Return spec locations that can initiate a network request. */
export function findExternalReferences(spec: unknown): string[] {
  const references: string[] = [];
  const seen = new WeakSet<object>();

  const visit = (value: unknown, path: Array<string | number>) => {
    if (value == null || typeof value !== "object") return;
    if (seen.has(value)) return;
    seen.add(value);

    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, [...path, index]));
      return;
    }

    for (const [key, child] of Object.entries(value)) {
      const nextPath = [...path, key];
      if ((key === "url" || key === "href") && child != null) {
        const inline = typeof child === "string" && child.startsWith("data:");
        if (!inline) references.push(pathLabel(nextPath));
      }
      visit(child, nextPath);
    }
  };

  visit(spec, []);
  return references;
}

function cssValue(style: CSSStyleDeclaration, name: string, fallback: string) {
  return style.getPropertyValue(name).trim() || fallback;
}

export function DeclarativeVisual({
  spec,
  mode,
  className,
  style,
  ariaLabel = "Declarative data visualization",
  renderer = "svg",
  allowExternalData = false,
  options = EMPTY_EMBED_OPTIONS,
  onViewReady,
  onError,
}: DeclarativeVisualProps) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const [state, setState] = React.useState<"loading" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let active = true;
    let result: VegaEmbedResult | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const render = async () => {
      setState("loading");
      setErrorMessage("");
      ensureVegaTooltipStyles();
      const externalReferences = findExternalReferences(spec);
      if (!allowExternalData && externalReferences.length) {
        throw new Error(
          `External data is disabled. Remove or explicitly allow: ${externalReferences.join(", ")}`,
        );
      }

      const computed = getComputedStyle(host);
      const foreground = cssValue(computed, "--foreground", "#172033");
      const muted = cssValue(computed, "--muted-foreground", "#667085");
      const border = cssValue(computed, "--border", "#d0d5dd");
      const accent = cssValue(computed, "--chart-1", "#315fbb");
      const { default: embed } = await import("vega-embed");
      if (!active) return;

      result = await embed(host, spec, {
        ...options,
        mode,
        renderer,
        actions: false,
        // Keep Vega's internal layout helpers off; we inject themed tooltip CSS.
        defaultStyle: false,
        // Always enable the HTML tooltip handler unless the caller opts out.
        tooltip: options.tooltip === false ? false : (options.tooltip ?? true),
        config: (options.config ?? {
          background: "transparent",
          view: { stroke: "transparent" },
          axis: {
            domainColor: border,
            gridColor: border,
            labelColor: muted,
            titleColor: foreground,
          },
          legend: { labelColor: foreground, titleColor: foreground },
          range: { category: [accent] },
          mark: { tooltip: true },
        }) as EmbedOptions["config"],
      });
      if (!active) {
        result.finalize();
        return;
      }

      result.view.description(ariaLabel);
      await result.view.runAsync();
      const renderedSvg = host.querySelector("svg");
      if (renderedSvg) {
        renderedSvg.setAttribute("role", "img");
        renderedSvg.setAttribute("aria-label", ariaLabel);
        // Help pointer events hit rect marks in tight heatmaps.
        renderedSvg.style.overflow = "visible";
      }
      onViewReady?.(result.view);
      setState("ready");

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          void result?.view.resize().runAsync();
        });
        resizeObserver.observe(host);
      }
    };

    void render().catch((reason: unknown) => {
      if (!active) return;
      const error = reason instanceof Error ? reason : new Error(String(reason));
      setState("error");
      setErrorMessage(error.message);
      onError?.(error);
    });

    return () => {
      active = false;
      resizeObserver?.disconnect();
      result?.finalize();
      host.replaceChildren();
    };
  }, [allowExternalData, ariaLabel, mode, onError, onViewReady, options, renderer, spec]);

  return (
    <div
      className={cn("relative min-h-[240px] w-full", className)}
      style={style}
      role="figure"
      aria-label={ariaLabel}
      aria-busy={state === "loading"}
    >
      <div
        ref={hostRef}
        // overflow-auto only on the scroll wrapper; keep marks hoverable and
        // avoid clipping the SVG. Tooltips mount on document.body.
        className="ce-vega-host h-full min-h-[240px] w-full overflow-x-auto overflow-y-visible"
        tabIndex={0}
        aria-label={`Scrollable ${ariaLabel}`}
      />
      {state === "loading" ? (
        <div className="absolute inset-0 grid place-items-center rounded-[var(--radius)] bg-card/75 text-sm text-muted-foreground" role="status">
          Rendering specification…
        </div>
      ) : null}
      {state === "error" ? (
        <div className="absolute inset-0 grid place-items-center rounded-[var(--radius)] border border-dashed border-[var(--chart-negative)]/45 bg-card p-5 text-center" role="alert">
          <div>
            <div className="font-semibold text-[var(--chart-negative)]">Specification could not render</div>
            <div className="mt-1 text-sm text-muted-foreground">{errorMessage}</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function VegaChart(props: VegaChartProps) {
  return <DeclarativeVisual {...props} mode="vega" />;
}

export function VegaLiteChart(props: VegaLiteChartProps) {
  return <DeclarativeVisual {...props} mode="vega-lite" />;
}

/**
 * Independent compatibility surface for Vega/Vega-Lite specifications often
 * authored for Deneb. This component is not the Microsoft visual and does not
 * implement Deneb host APIs.
 */
export function DenebSpecRenderer({
  showNonAffiliationNotice = true,
  ...props
}: DenebSpecRendererProps) {
  return (
    <div className="space-y-2">
      <DeclarativeVisual {...props} />
      {showNonAffiliationNotice ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          Independent Vega/Vega-Lite specification renderer. Not affiliated with or endorsed by Deneb or Microsoft.
        </p>
      ) : null}
    </div>
  );
}

/** General scientific-spec surface with explicit method, units, and provenance. */
export function ScientificSpecVisual({
  methodLabel,
  units,
  reference,
  ...props
}: ScientificSpecVisualProps) {
  return (
    <div className="flex h-full min-h-[260px] flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-2 text-xs">
        <div>
          <div className="font-semibold text-foreground">{methodLabel}</div>
          {reference ? <div className="text-muted-foreground">Reference: {reference}</div> : null}
        </div>
        {units ? <span className="rounded-[var(--radius-sm)] border border-border bg-muted px-2 py-1 text-muted-foreground">Units: {units}</span> : null}
      </div>
      <div className="min-h-0 flex-1">
        <VegaLiteChart {...props} />
      </div>
    </div>
  );
}
