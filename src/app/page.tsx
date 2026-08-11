import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeaderActions } from "@/components/ui/header-actions";
import { Badge } from "@/components/ui/badge";
import { catalogManifest } from "@/registry/catalog-manifest";
import type { CatalogManifestEntry } from "@/registry/catalog-types";
import { ChartFrame } from "@/components/charts/chart-frame";
import { BarColumnChart } from "@/components/charts/bar-column-chart";
import { LineAreaChart } from "@/components/charts/line-area-chart";
import { PieDonutChart } from "@/components/charts/pie-donut-chart";
import { ModernCard } from "@/components/cards/kpi-cards";
import {
  salesByRegion,
  stackedSeries,
  partToWhole,
  kpiMetrics,
} from "@/lib/sample-data";

export default function HomePage() {
  const entries = catalogManifest as readonly CatalogManifestEntry[];
  const verifiedCount = entries.filter((entry) => entry.status === "verified").length;
  const totalCount = entries.length;
  const categories = new Set(entries.map((entry) => entry.category)).size;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 480px at 8% -12%, color-mix(in oklab, var(--accent) 14%, transparent), transparent), radial-gradient(900px 420px at 92% 0%, color-mix(in oklab, var(--ring) 12%, transparent), transparent)",
        }}
      />
      <header
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between py-5"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="text-[15px] font-bold tracking-[-0.02em] text-accent">
          Chart Elements
        </div>
        <HeaderActions />
      </header>
      <main
        className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 pb-24 pt-12 sm:pt-16"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <Badge variant="secondary" className="w-fit">
          Next.js · Tailwind · Theme-aware
        </Badge>
        <div className="max-w-2xl space-y-4">
          <h1 className="text-[clamp(32px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.03em]">
            Power BI–class visuals for your web stack
          </h1>
          <p className="text-[17px] leading-relaxed text-muted-foreground">
            A plug-and-play suite of clean chart, KPI, map, slicer, and analytical
            components — tuned to a flexible, token-driven design system.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/gallery"
            className="inline-flex h-11 items-center gap-2 rounded-[10px] bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Open gallery <ArrowRight className="h-4 w-4" />
          </Link>
          <span className="text-[14px] text-muted-foreground">
            {verifiedCount} verified · {totalCount} total across {categories} categories
          </span>
        </div>

        <section aria-labelledby="hero-previews-heading" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="hero-previews-heading"
                className="text-[15px] font-semibold tracking-[-0.01em]"
              >
                Live previews
              </h2>
              <p className="mt-1 text-[13px] text-muted-foreground">
                The same refined-neutral marks you get in the gallery — light and dark.
              </p>
            </div>
            <Link
              href="/gallery"
              className="text-[13px] font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Browse all visuals
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <ChartFrame title="Revenue by region" description="Clustered columns" height={260}>
              <BarColumnChart
                data={salesByRegion}
                categoryKey="name"
                seriesKeys={["sales", "profit"]}
                variant="clustered-column"
              />
            </ChartFrame>
            <ChartFrame title="Monthly mix" description="Stacked area" height={260}>
              <LineAreaChart
                data={stackedSeries}
                categoryKey="name"
                seriesKeys={["product", "service", "other"]}
                variant="stacked-area"
              />
            </ChartFrame>
            <ChartFrame title="Segment share" description="Donut" height={260}>
              <PieDonutChart data={partToWhole} variant="donut" innerLabel="Share" />
            </ChartFrame>
            <div className="grid gap-4 sm:grid-cols-2">
              {kpiMetrics.slice(0, 2).map((metric) => (
                <ModernCard key={metric.label} metric={metric} size="sm" />
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Charts & statistical", "Bar, line, sankey, radar, violin, financial…"],
            ["KPI & tables", "Cards, gauges, matrices, sparklines, scorecards"],
            ["Maps & slicers", "Choropleth, routes, chiclet filters, date ranges"],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-[var(--radius-panel)] border border-border bg-card/90 p-5 shadow-[var(--card-shadow)]"
            >
              <div className="text-[15px] font-semibold tracking-[-0.01em]">
                {title}
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
