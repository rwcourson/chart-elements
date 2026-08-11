"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SafeHtmlVisualProps = {
  html: string;
  className?: string;
  ariaLabel?: string;
  allowLinks?: boolean;
  emptyMessage?: string;
};

export type SafeSvgVisualProps = {
  svg: string;
  title: string;
  description?: string;
  className?: string;
};

export type MatplotlibArtifactProps = {
  src: string;
  alt: string;
  format: "svg" | "png";
  generatedBy?: string;
  caption?: string;
  className?: string;
  fit?: "contain" | "cover";
};

function hardenLinks(html: string) {
  const document = new DOMParser().parseFromString(html, "text/html");
  for (const anchor of document.querySelectorAll("a")) {
    const href = anchor.getAttribute("href") ?? "";
    let safe = false;
    try {
      const url = new URL(href, window.location.origin);
      safe = url.protocol === "http:" || url.protocol === "https:";
    } catch {
      safe = false;
    }
    if (!safe) {
      anchor.removeAttribute("href");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      continue;
    }
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
  }
  return document.body.innerHTML;
}

export function SafeHtmlVisual({
  html,
  className,
  ariaLabel = "Sanitized HTML visualization",
  allowLinks = false,
  emptyMessage = "No HTML content was supplied.",
}: SafeHtmlVisualProps) {
  const [sanitized, setSanitized] = React.useState("");
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    void import("dompurify").then(({ default: DOMPurify }) => {
      if (!active) return;
      const clean = DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
        FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input", "button"],
        FORBID_ATTR: ["style", "srcdoc"],
        FORBID_CONTENTS: ["script", "style", "iframe", "object", "embed"],
        ALLOW_UNKNOWN_PROTOCOLS: false,
        ...(allowLinks ? { ADD_ATTR: ["target", "rel"] } : { FORBID_TAGS: ["a", "script", "style", "iframe", "object", "embed", "form", "input", "button"] }),
      });
      setSanitized(allowLinks ? hardenLinks(clean) : clean);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [allowLinks, html]);

  if (!html.trim()) {
    return <div className="rounded-lg border border-dashed border-border p-5 text-sm text-muted-foreground" role="status">{emptyMessage}</div>;
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none rounded-lg border border-border bg-card p-4 text-foreground [&_a]:text-accent [&_a]:underline [&_table]:w-full [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2",
        className,
      )}
      role="figure"
      aria-label={ariaLabel}
      aria-busy={!ready}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

function replaceIdReferences(value: string, ids: Map<string, string>) {
  let next = value;
  for (const [oldId, newId] of ids) {
    next = next.replaceAll(`url(#${oldId})`, `url(#${newId})`);
    if (next === `#${oldId}`) next = `#${newId}`;
  }
  return next;
}

function prepareSvg(source: string, prefix: string, title: string, description?: string) {
  const document = new DOMParser().parseFromString(source, "image/svg+xml");
  const svg = document.documentElement;
  if (svg.nodeName.toLowerCase() !== "svg" || document.querySelector("parsererror")) {
    throw new Error("The supplied content is not valid SVG.");
  }

  const ids = new Map<string, string>();
  for (const element of svg.querySelectorAll("[id]")) {
    const oldId = element.getAttribute("id");
    if (!oldId) continue;
    const newId = `${prefix}-${oldId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
    ids.set(oldId, newId);
    element.setAttribute("id", newId);
  }
  for (const element of svg.querySelectorAll("*")) {
    for (const attribute of [...element.attributes]) {
      element.setAttribute(attribute.name, replaceIdReferences(attribute.value, ids));
    }
  }

  const titleId = `${prefix}-title`;
  const descriptionId = `${prefix}-description`;
  svg.querySelectorAll(":scope > title, :scope > desc").forEach((element) => element.remove());
  const titleNode = document.createElementNS("http://www.w3.org/2000/svg", "title");
  titleNode.setAttribute("id", titleId);
  titleNode.textContent = title;
  svg.prepend(titleNode);
  if (description) {
    const descriptionNode = document.createElementNS("http://www.w3.org/2000/svg", "desc");
    descriptionNode.setAttribute("id", descriptionId);
    descriptionNode.textContent = description;
    titleNode.after(descriptionNode);
  }
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-labelledby", description ? `${titleId} ${descriptionId}` : titleId);
  svg.setAttribute("preserveAspectRatio", svg.getAttribute("preserveAspectRatio") ?? "xMidYMid meet");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  return new XMLSerializer().serializeToString(svg);
}

export function SafeSvgVisual({ svg, title, description, className }: SafeSvgVisualProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [sanitized, setSanitized] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let active = true;
    void import("dompurify")
      .then(({ default: DOMPurify }) => {
        const clean = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ["script", "style", "foreignObject", "iframe", "object", "embed"],
          FORBID_ATTR: ["style"],
          ALLOW_UNKNOWN_PROTOCOLS: false,
        });
        const prepared = prepareSvg(clean, `ce-svg-${uid}`, title, description);
        if (!active) return;
        setSanitized(prepared);
        setError("");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setSanitized("");
        setError(reason instanceof Error ? reason.message : String(reason));
      });
    return () => {
      active = false;
    };
  }, [description, svg, title, uid]);

  if (error) {
    return <div role="alert" className="rounded-lg border border-dashed border-[var(--chart-negative)]/50 p-5 text-sm text-[var(--chart-negative)]">{error}</div>;
  }

  return (
    <div
      className={cn("grid min-h-[220px] w-full place-items-center overflow-hidden rounded-lg border border-border bg-card p-3 [&_svg]:h-full [&_svg]:max-h-[260px] [&_svg]:w-full", className)}
      aria-busy={!sanitized}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}

export function MatplotlibArtifact({
  src,
  alt,
  format,
  generatedBy = "Matplotlib",
  caption,
  className,
  fit = "contain",
}: MatplotlibArtifactProps) {
  const [failed, setFailed] = React.useState(false);
  return (
    <figure className={cn("space-y-2", className)}>
      <div className="grid min-h-[220px] place-items-center overflow-hidden rounded-lg border border-border bg-card">
        {failed ? (
          <div role="alert" className="p-5 text-sm text-muted-foreground">The {format.toUpperCase()} artifact could not be loaded.</div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- accepts generated data/blob URLs and consumer artifact URLs.
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className={cn("h-full max-h-[280px] w-full", fit === "cover" ? "object-cover" : "object-contain")}
          />
        )}
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{caption ?? alt}</span>
        <span>{generatedBy} · {format.toUpperCase()} artifact</span>
      </figcaption>
    </figure>
  );
}
