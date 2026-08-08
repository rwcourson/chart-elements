import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeaderActions } from "@/components/ui/header-actions";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
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
        className="relative z-10 mx-auto flex max-w-5xl items-center justify-between py-5"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <div className="text-[15px] font-bold tracking-[-0.02em] text-accent">
          Chart Elements
        </div>
        <HeaderActions />
      </header>
      <main
        className="relative z-10 mx-auto flex max-w-5xl flex-col gap-8 pb-24 pt-16"
        style={{ paddingInline: "var(--page-gutter)" }}
      >
        <Badge variant="secondary" className="w-fit">
          Next.js · Tailwind · Berry palette
        </Badge>
        <div className="max-w-2xl space-y-4">
          <h1 className="text-[clamp(32px,3.4vw,40px)] font-bold leading-[1.15] tracking-[-0.03em]">
            Power BI–class visuals for your web stack
          </h1>
          <p className="text-[17px] leading-relaxed text-muted-foreground">
            A plug-and-play suite of clean chart, KPI, map, slicer, and analytical
            components — tuned to the B&amp;G Time design system.
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
            336 visuals across 37 categories
          </span>
        </div>
        <div className="grid gap-4 pt-6 sm:grid-cols-3">
          {[
            ["Charts & statistical", "Bar, line, sankey, radar, violin, financial…"],
            ["KPI & tables", "Cards, gauges, matrices, sparklines, scorecards"],
            ["Maps & slicers", "Choropleth, routes, chiclet filters, date ranges"],
          ].map(([title, body]) => (
            <div
              key={title}
              className="rounded-[var(--radius-panel)] border border-border bg-card/90 p-5 shadow-[var(--overlay-shadow)]"
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
