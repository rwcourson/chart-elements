"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Copy, Package } from "lucide-react";
import { catalog, type CatalogEntry } from "@/registry/catalog";
import type { CatalogManifestId } from "@/registry/catalog-manifest";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Badge } from "@/components/ui/badge";
import { PalettePicker } from "@/components/ui/palette-picker";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

function familySubpath(entry: CatalogEntry) {
  const family = entry.source.module.split("/").at(-1);
  return family ? `/${family}` : "";
}

function statusVariant(status: CatalogEntry["status"]) {
  if (status === "verified") return "success" as const;
  if (status === "implementing") return "warning" as const;
  return "secondary" as const;
}

function CodeSample({ children }: { children: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className="group relative min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-muted/35">
      <pre
        className="max-w-full overflow-x-auto p-4 pr-14 text-[12px] leading-relaxed"
        tabIndex={0}
        aria-label="Code sample"
      ><code>{children}</code></pre>
      <button
        type="button"
        onClick={copy}
        className="absolute right-2 top-2 inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Copy ${children.split("\n")[0]}`}
      >
        {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function VisualDetailClient({ visualId }: { visualId: CatalogManifestId }) {
  const index = catalog.findIndex((candidate) => candidate.id === visualId);
  const entry = catalog[index];
  const previous = catalog[(index - 1 + catalog.length) % catalog.length];
  const next = catalog[(index + 1) % catalog.length];
  const packagePath = `@rwcourson/chart-elements${familySubpath(entry)}`;
  const install = `pnpm add @rwcourson/chart-elements\n\nimport { ${entry.source.exportName} } from "${packagePath}";`;
  const copySource = `npx @rwcourson/chart-elements-cli add ${entry.id}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
        <div
          className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 py-3"
          style={{ paddingInline: "var(--page-gutter)" }}
        >
          <Link
            href="/gallery"
            className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-accent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="h-4 w-4" /> Gallery
          </Link>
          <div className="flex items-center gap-2">
            <PalettePicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main
        className="mx-auto grid max-w-[1180px] gap-8 py-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:py-12"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="min-w-0 space-y-8">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant(entry.status)}>{entry.status}</Badge>
              <Badge variant="secondary">{entry.semantic.kind}</Badge>
              <span className="text-sm text-muted-foreground">{entry.category}</span>
            </div>
            <div className="space-y-3">
              <h1 className="text-[clamp(30px,5vw,48px)] font-bold leading-tight tracking-[-0.035em]">
                {entry.title}
              </h1>
              <p className="max-w-3xl text-[16px] leading-relaxed text-muted-foreground">
                {entry.semantic.distinction}
              </p>
            </div>
            {entry.status !== "verified" ? (
              <div className="rounded-lg border border-[var(--chart-warning)]/35 bg-[var(--chart-warning)]/8 p-3 text-sm">
                <span className="font-semibold">Not release-verified.</span>{" "}
                {entry.statusNote}
              </div>
            ) : null}
          </section>

          <section aria-labelledby="preview-heading" className="space-y-3">
            <h2 id="preview-heading" className="text-xl font-semibold tracking-tight">Live preview</h2>
            <React.Suspense
              fallback={<div className="h-[320px] animate-pulse rounded-xl bg-muted" aria-label="Loading preview" />}
            >
              {entry.selfFramed ? (
                <div className="min-h-[260px]">{entry.render()}</div>
              ) : (
                <ChartFrame
                  title={entry.title}
                  description={entry.category}
                  height={typeof entry.height === "number" ? Math.max(320, entry.height) : entry.height ?? 320}
                  accessibleSummary={entry.semantic.distinction}
                >
                  {entry.render()}
                </ChartFrame>
              )}
            </React.Suspense>
          </section>

          <section className="grid gap-4 sm:grid-cols-2" aria-label="Usage guidance">
            <article className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Use it when</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The supplied data and intended comparison match this entry’s documented distinction. Validate units, domains, missing values, and the nonvisual summary before shipping.
              </p>
            </article>
            <article className="rounded-xl border border-border bg-card p-5">
              <h2 className="font-semibold">Avoid it when</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                A simpler table communicates the result more accurately, or when the current {entry.status} status does not meet your production acceptance bar.
              </p>
            </article>
          </section>

          <section className="space-y-4" aria-labelledby="install-heading">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-accent" />
              <h2 id="install-heading" className="text-xl font-semibold tracking-tight">Install</h2>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="min-w-0 space-y-2">
                <h3 className="text-sm font-semibold">Compiled package</h3>
                <CodeSample>{install}</CodeSample>
              </div>
              <div className="min-w-0 space-y-2">
                <h3 className="text-sm font-semibold">Copy source</h3>
                <CodeSample>{copySource}</CodeSample>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5 shadow-[var(--overlay-shadow)]">
            <h2 className="font-semibold">Component contract</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Public export</dt>
                <dd className="mt-0.5 font-mono text-xs">{entry.source.exportName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Source family</dt>
                <dd className="mt-0.5 font-mono text-xs">{entry.source.module}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Renderer dependencies</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {entry.dependencies.map((dependency) => (
                    <Badge key={dependency} variant="secondary">{dependency}</Badge>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fixture policy</dt>
                <dd className="mt-0.5">{entry.fixture.kind.replaceAll("-", " ")}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Accessibility and behavior</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {entry.capabilities.includes("interactive-control")
                ? "Interactive controls must expose keyboard operation, visible focus, controlled and uncontrolled state, and status feedback."
                : "The visual must expose a labelled figure, concise summary, and a structured data equivalent when marks are not independently keyboard navigable."}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Declared capabilities">
              {entry.capabilities.map((capability) => (
                <li key={capability}><Badge variant="secondary">{capability}</Badge></li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-semibold">Reference status</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {entry.reference.state === "source-linked"
                ? "The algorithm or pattern reference is linked and reviewable."
                : "This is currently a catalog label, not a sourced fidelity claim."}
            </p>
          </div>
        </aside>
      </main>

      <nav
        aria-label="Adjacent visuals"
        className="mx-auto flex max-w-[1180px] items-stretch justify-between gap-4 border-t border-border py-8"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        {[{ item: previous, direction: "previous" as const }, { item: next, direction: "next" as const }].map(({ item, direction }) => (
          <Link
            key={direction}
            href={`/gallery/${item.id}`}
            className={cn(
              "flex min-h-14 max-w-[48%] items-center gap-2 rounded-lg px-3 text-sm hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              direction === "next" && "ml-auto text-right",
            )}
          >
            {direction === "previous" ? <ArrowLeft className="h-4 w-4 shrink-0" /> : null}
            <span className="min-w-0">
              <span className="block text-xs text-muted-foreground">{direction}</span>
              <span className="block truncate font-semibold">{item.title}</span>
            </span>
            {direction === "next" ? <ArrowRight className="h-4 w-4 shrink-0" /> : null}
          </Link>
        ))}
      </nav>
    </div>
  );
}
