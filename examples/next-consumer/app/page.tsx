import { BarColumnChart } from "@rwcourson/chart-elements/charts/bar-column";
import { ChartFrame } from "@rwcourson/chart-elements/charts/frame";
import { VegaLiteChart } from "@rwcourson/chart-elements/declarative";
import { vegaLiteScatterSpec } from "@rwcourson/chart-elements/sample-data";

const rows = [
  { name: "North", revenue: 420, margin: 120 },
  { name: "South", revenue: 380, margin: 90 },
  { name: "East", revenue: 510, margin: 160 }
];

export default function Page() {
  return (
    <main style={{ display: "grid", gap: 24, margin: "48px auto", maxWidth: 760, padding: "0 24px" }}>
      <ChartFrame title="Revenue by region" description="Compiled package in Next.js" height={320}>
        <BarColumnChart data={rows} seriesKeys={["revenue", "margin"]} />
      </ChartFrame>
      <ChartFrame title="Declarative scatter" description="Lazy Vega-Lite runtime in Next.js" height={320}>
        <VegaLiteChart spec={vegaLiteScatterSpec} ariaLabel="Declarative scatter consumer fixture" />
      </ChartFrame>
    </main>
  );
}
