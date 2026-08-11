"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { catalog, categories } from "@/registry/catalog";
import { ChartFrame } from "@/components/charts/chart-frame";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PalettePicker, useActivePalette } from "@/components/ui/palette-picker";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { DeferredVisual } from "./deferred-visual";

export function GalleryClient() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");
  const palette = useActivePalette();
  const verifiedCount = catalog.filter((item) => item.status === "verified").length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalog.filter((item) => {
      const catOk = active === "All" || item.category === active;
      const textOk =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.id.includes(q);
      return catOk && textOk;
    });
  }, [query, active]);

  const mixedCategories = active === "All";

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of catalog) {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    }
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-[var(--header-bg)] backdrop-blur-md">
        <div
          className="mx-auto grid max-w-[1400px] grid-cols-1 gap-2.5 py-2.5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-4 sm:py-3"
          style={{ paddingInline: "var(--page-gutter)" }}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Link
              href="/"
              className="truncate text-[15px] font-bold tracking-[-0.02em] text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Chart Elements
            </Link>
            <Badge
              variant="secondary"
              className="shrink-0"
              aria-label={`${verifiedCount} verified visuals out of ${catalog.length} total`}
            >
              <span className="sm:hidden">{verifiedCount} / {catalog.length}</span>
              <span className="hidden sm:inline">
                {verifiedCount} verified · {catalog.length} total
              </span>
            </Badge>
          </div>
          <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:ml-auto sm:w-full sm:max-w-[520px] sm:gap-2.5">
            <div className="relative min-w-0" role="search">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search visuals…"
                aria-label="Search visuals"
                className="h-[38px] pl-9"
              />
            </div>
            <PalettePicker />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div
        className="mx-auto grid max-w-[1400px] grid-cols-1 gap-4 py-4 md:grid-cols-[248px_minmax(0,1fr)] md:gap-8 md:py-6"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <aside className="hidden md:sticky md:top-[72px] md:block md:h-[calc(100vh-96px)] md:overflow-auto md:pr-1">
          <div className="rounded-[var(--radius-panel)] border border-border bg-[var(--sidebar-bg)] p-3 shadow-[var(--overlay-shadow)]">
            <div className="mb-2.5 px-2 text-[12px] font-bold uppercase tracking-[0.06em] text-muted-foreground">
              Categories
            </div>
            <nav className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setActive("All")}
                className={cn(
                  "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[14px] transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active === "All"
                    ? "bg-[var(--sidebar-active)] font-semibold text-accent"
                    : "text-foreground hover:bg-[var(--sidebar-hover)]",
                )}
                aria-current={active === "All" ? "page" : undefined}
              >
                <span>All</span>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {catalog.length}
                </span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-[10px] px-3 py-2.5 text-left text-[14px] transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active === cat
                      ? "bg-[var(--sidebar-active)] font-semibold text-accent"
                      : "text-foreground hover:bg-[var(--sidebar-hover)]",
                  )}
                  aria-current={active === cat ? "page" : undefined}
                >
                  <span className="min-w-0 leading-snug">{cat}</span>
                  <span className="shrink-0 pt-0.5 text-[12px] font-medium text-muted-foreground">
                    {counts.get(cat)}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-4 md:hidden">
            <label
              htmlFor="gallery-category"
              className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-muted-foreground"
            >
              Category
            </label>
            <select
              id="gallery-category"
              value={active}
              onChange={(event) => setActive(event.target.value)}
              className="h-11 w-full rounded-[var(--radius)] border border-border bg-card px-3 text-[14px] font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="All">All visuals ({catalog.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({counts.get(cat)})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-5 space-y-1.5">
            <h1 className="text-[26px] font-bold tracking-[-0.02em]">
              {active === "All" ? "Visualization gallery" : active}
            </h1>
            <p className="text-[14px] text-muted-foreground" aria-live="polite">
              Showing {filtered.length} theme-aware elements · {palette.label} palette
            </p>
          </div>

          <div
            className="grid grid-cols-1 gap-5 xl:grid-cols-2"
            style={{ gap: "var(--section-gap)" }}
          >
            {filtered.map((item) => {
              // Only worth showing when results span categories. Inside a
              // single category it just repeats the page heading on every
              // card and steals a line from the plot.
              const description = mixedCategories ? item.category : undefined;
              const key = `${item.category}-${item.id}`;

              // Deferred so "All" (hundreds of entries) doesn't mount every Recharts
              // container at once — which is both slow and a source of 0x0
              // measure bugs.
              if (item.selfFramed) {
                return (
                  <figure
                    key={key}
                    className="flex min-w-0 flex-col gap-2.5"
                    aria-label={item.title}
                  >
                    <figcaption className="px-1">
                      <Link
                        href={`/gallery/${item.id}`}
                        className="text-[14px] font-semibold leading-snug tracking-[-0.01em] hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {item.title}
                      </Link>
                      {description ? (
                        <div className="text-[13px] text-muted-foreground">
                          {description}
                        </div>
                      ) : null}
                    </figcaption>
                    <DeferredVisual
                      reserveHeight={
                        typeof item.height === "number" ? item.height : 300
                      }
                    >
                      {item.render()}
                    </DeferredVisual>
                  </figure>
                );
              }

              // An auto-height frame gives the deferred slot nothing to fill, so
              // the placeholder needs its own box or every slot collapses to 0px
              // and they all mount in the same frame.
              const auto = item.height === "auto";

              return (
                <ChartFrame
                  key={key}
                  title={item.title}
                  description={description}
                  height={item.height ?? 300}
                  actions={
                    <Link
                      href={`/gallery/${item.id}`}
                      className="rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Details
                    </Link>
                  }
                >
                  <DeferredVisual reserveHeight={auto ? 120 : undefined}>
                    {item.render()}
                  </DeferredVisual>
                </ChartFrame>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div
              className="rounded-[var(--radius-panel)] border border-dashed border-border bg-card p-10 text-center sm:p-16"
              role="status"
            >
              <div className="text-[15px] font-semibold text-foreground">
                No visuals match that filter
              </div>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try another category or clear the search — the catalog spans charts,
                cards, slicers, maps, and reports.
              </p>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
