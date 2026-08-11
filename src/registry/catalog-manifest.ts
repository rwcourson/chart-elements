/**
 * GENERATED FILE — do not edit by hand.
 * Source: scripts/generate-catalog.mjs · regenerate with `pnpm catalog`.
 *
 * Unlike the gallery renderer, this module is serializable and does not import
 * every visual. Tooling can inspect implementation truth without loading the UI.
 */

import type { CatalogManifestEntry } from "./catalog-types";

export const catalogManifest = [
{
  "id": "clustered-bar-chart",
  "title": "Clustered bar chart",
  "category": "Bar and Column Charts",
  "variant": "clustered-bar",
  "component": "BarColumnChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: horizontal layout, shared margins/radius, empty state, hover isolation (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for the clustered-bar configuration of BarColumnChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "clustered-bar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Clustered bar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "stacked-bar-chart",
  "title": "Stacked bar chart",
  "category": "Bar and Column Charts",
  "variant": "stacked-bar",
  "component": "BarColumnChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "clustered-bar-chart",
    "distinction": "Configures BarColumnChart with the explicit stacked-bar variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "stacked-bar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Stacked bar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "100-stacked-bar-chart",
  "title": "100% stacked bar chart",
  "category": "Bar and Column Charts",
  "variant": "percent-bar",
  "component": "BarColumnChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "clustered-bar-chart",
    "distinction": "Configures BarColumnChart with the explicit percent-bar variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "100-stacked-bar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "100% stacked bar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "clustered-column-chart",
  "title": "Clustered column chart",
  "category": "Bar and Column Charts",
  "variant": "clustered-column",
  "component": "BarColumnChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: shared mark constants, empty state, gradient bars, series hover, light/dark tokens (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "variant",
    "of": "clustered-bar-chart",
    "distinction": "Configures BarColumnChart with the explicit clustered-column variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "clustered-column-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Clustered column chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "stacked-column-chart",
  "title": "Stacked column chart",
  "category": "Bar and Column Charts",
  "variant": "stacked-column",
  "component": "BarColumnChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "clustered-bar-chart",
    "distinction": "Configures BarColumnChart with the explicit stacked-column variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "stacked-column-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Stacked column chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "100-stacked-column-chart",
  "title": "100% stacked column chart",
  "category": "Bar and Column Charts",
  "variant": "percent-column",
  "component": "BarColumnChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "clustered-bar-chart",
    "distinction": "Configures BarColumnChart with the explicit percent-column variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BarColumnChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "100-stacked-column-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "100% stacked column chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "line-chart",
  "title": "Line chart",
  "category": "Line and Area Charts",
  "variant": "line",
  "component": "LineAreaChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: SERIES_STROKE_WIDTH/ACTIVE_DOT, empty series, legend hover dim (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for the line configuration of LineAreaChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "line-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Line chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "area-chart",
  "title": "Area chart",
  "category": "Line and Area Charts",
  "variant": "area",
  "component": "LineAreaChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: area gradients, shared stroke, reduced-motion animation gate (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "variant",
    "of": "line-chart",
    "distinction": "Configures LineAreaChart with the explicit area variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "area-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Area chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "stacked-area-chart",
  "title": "Stacked area chart",
  "category": "Line and Area Charts",
  "variant": "stacked-area",
  "component": "LineAreaChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "line-chart",
    "distinction": "Configures LineAreaChart with the explicit stacked-area variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "stacked-area-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Stacked area chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "100-stacked-area-chart",
  "title": "100% stacked area chart",
  "category": "Line and Area Charts",
  "variant": "percent-area",
  "component": "LineAreaChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "line-chart",
    "distinction": "Configures LineAreaChart with the explicit percent-area variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LineAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "100-stacked-area-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "100% stacked area chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "line-and-clustered-column-chart",
  "title": "Line and clustered column chart",
  "category": "Combination Charts",
  "variant": "line-clustered-column",
  "component": "ComboChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: combo empty state, shared bar/line marks, dual-series hover (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for the line-clustered-column configuration of ComboChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ComboChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ComboChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "salesByRegion"
    ]
  },
  "docs": {
    "slug": "line-and-clustered-column-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Line and clustered column chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "line-and-stacked-column-chart",
  "title": "Line and stacked column chart",
  "category": "Combination Charts",
  "variant": "line-stacked-column",
  "component": "ComboChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "line-and-clustered-column-chart",
    "distinction": "Configures ComboChart with the explicit line-stacked-column variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ComboChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ComboChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "salesByRegion"
    ]
  },
  "docs": {
    "slug": "line-and-stacked-column-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Line and stacked column chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "dual-axis-combo-chart-configurations",
  "title": "Dual-axis combo chart configurations",
  "category": "Combination Charts",
  "variant": "dual-axis",
  "component": "ComboChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "line-and-clustered-column-chart",
    "distinction": "Configures ComboChart with the explicit dual-axis variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ComboChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ComboChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "salesByRegion"
    ]
  },
  "docs": {
    "slug": "dual-axis-combo-chart-configurations",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dual-axis combo chart configurations",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "waterfall-chart",
  "title": "Waterfall chart",
  "category": "Change and Ranking Charts",
  "variant": null,
  "component": "WaterfallChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: shared tooltip tokens, semantic increase/decrease, empty path (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for WaterfallChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "WaterfallChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "WaterfallChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "waterfallData"
    ]
  },
  "docs": {
    "slug": "waterfall-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Waterfall chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "ribbon-chart",
  "title": "Ribbon chart",
  "category": "Change and Ranking Charts",
  "variant": null,
  "component": "RibbonChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RibbonChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RibbonChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RibbonChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "stackedSeries"
    ]
  },
  "docs": {
    "slug": "ribbon-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Ribbon chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "pie-chart",
  "title": "Pie chart",
  "category": "Part-to-Whole and Process Charts",
  "variant": "pie",
  "component": "PieDonutChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: callout leaders, empty slices, CSS hover isolation, legend craft (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for the pie configuration of PieDonutChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PieDonutChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PieDonutChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "partToWhole"
    ]
  },
  "docs": {
    "slug": "pie-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pie chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "donut-chart",
  "title": "Donut chart",
  "category": "Part-to-Whole and Process Charts",
  "variant": "donut",
  "component": "PieDonutChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: inner label, stroke dividers, empty state, token series colors (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "variant",
    "of": "pie-chart",
    "distinction": "Configures PieDonutChart with the explicit donut variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PieDonutChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PieDonutChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "partToWhole"
    ]
  },
  "docs": {
    "slug": "donut-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Donut chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "treemap",
  "title": "Treemap",
  "category": "Part-to-Whole and Process Charts",
  "variant": null,
  "component": "TreemapChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TreemapChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TreemapChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TreemapChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "treemapData"
    ]
  },
  "docs": {
    "slug": "treemap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Treemap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "funnel-chart",
  "title": "Funnel chart",
  "category": "Part-to-Whole and Process Charts",
  "variant": null,
  "component": "FunnelChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: custom SVG stages, empty invalid stages, series hover focus (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FunnelChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FunnelChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FunnelChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "funnelStages"
    ]
  },
  "docs": {
    "slug": "funnel-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Funnel chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "scatter-plot",
  "title": "Scatter plot",
  "category": "Relationship and Distribution Charts",
  "variant": "scatter",
  "component": "ScatterBubbleChart",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: shared plot margin, empty data, category colors from tokens (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for the scatter configuration of ScatterBubbleChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "scatterPoints"
    ]
  },
  "docs": {
    "slug": "scatter-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Scatter plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "bubble-chart",
  "title": "Bubble chart",
  "category": "Relationship and Distribution Charts",
  "variant": "bubble",
  "component": "ScatterBubbleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "scatter-plot",
    "distinction": "Configures ScatterBubbleChart with the explicit bubble variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "scatterPoints"
    ]
  },
  "docs": {
    "slug": "bubble-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Bubble chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "dot-plot",
  "title": "Dot plot",
  "category": "Relationship and Distribution Charts",
  "variant": "dot-plot",
  "component": "ScatterBubbleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "scatter-plot",
    "distinction": "Configures ScatterBubbleChart with the explicit dot-plot variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "scatterPoints"
    ]
  },
  "docs": {
    "slug": "dot-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dot plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "table",
  "title": "Table",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: empty rows status UI, sticky header, token density (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "matrix",
  "title": "Matrix",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "MatrixTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MatrixTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "MatrixTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "MatrixTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "hierarchical-matrix",
  "title": "Hierarchical matrix",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "MatrixTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MatrixTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "MatrixTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "MatrixTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "hierarchical-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Hierarchical matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "pivot-style-matrix",
  "title": "Pivot-style matrix",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "MatrixTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MatrixTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "MatrixTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "MatrixTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "pivot-style-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pivot-style matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-with-totals",
  "title": "Table with totals",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-with-totals",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table with totals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "matrix-with-subtotals",
  "title": "Matrix with subtotals",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "MatrixTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "hierarchical-matrix",
    "distinction": "Both labels intentionally demonstrate the same current subtotal configuration; hierarchy remains under review. Catalog label: Matrix with subtotals."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "MatrixTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "MatrixTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "matrix-with-subtotals",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Matrix with subtotals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "matrix-with-grand-totals",
  "title": "Matrix with grand totals",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "MatrixTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "pivot-style-matrix",
    "distinction": "Both labels intentionally demonstrate the same current grand-total configuration; pivot behavior remains under review. Catalog label: Matrix with grand totals."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "MatrixTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "MatrixTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "matrix-with-grand-totals",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Matrix with grand totals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-conditional-background-colors",
  "title": "Table/matrix with conditional background colors",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-conditional-background-colors",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with conditional background colors",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-conditional-font-colors",
  "title": "Table/matrix with conditional font colors",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-conditional-font-colors",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with conditional font colors",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-icons",
  "title": "Table/matrix with icons",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-icons",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with icons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-data-bars",
  "title": "Table/matrix with data bars",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-data-bars",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with data bars",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-web-urls",
  "title": "Table/matrix with web URLs",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRowsWithLinks"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-web-urls",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with web URLs",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-images",
  "title": "Table/matrix with images",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRowsWithImages"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-images",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with images",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "table-matrix-with-sparklines",
  "title": "Table/matrix with sparklines",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTable."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "table-matrix-with-sparklines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Table/matrix with sparklines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "line-sparkline",
  "title": "Line sparkline",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "LineSparkline",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LineSparkline."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LineSparkline"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LineSparkline",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "line-sparkline",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Line sparkline",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "column-sparkline",
  "title": "Column sparkline",
  "category": "Tables and Matrix Visualizations",
  "variant": null,
  "component": "ColumnSparkline",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ColumnSparkline."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ColumnSparkline"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ColumnSparkline",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "column-sparkline",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Column sparkline",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "modern-card-visual-single-card-layout",
  "title": "Modern Card visual — Single-card layout",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "ModernCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ModernCard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ModernCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ModernCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-single-card-layout",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Single-card layout",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "modern-card-visual-multi-card-layout",
  "title": "Modern Card visual — Multi-card layout",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "MultiCardLayout",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MultiCardLayout."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "MultiCardLayout"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "MultiCardLayout",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-multi-card-layout",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Multi-card layout",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "modern-card-visual-multi-category-card-layout",
  "title": "Modern Card visual — Multi-category card layout",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "MultiCategoryCards",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MultiCategoryCards."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "MultiCategoryCards"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "MultiCategoryCards",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-multi-category-card-layout",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Multi-category card layout",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": 350
},
{
  "id": "modern-card-visual-card-with-reference-labels",
  "title": "Modern Card visual — Card with reference labels",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "ModernCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "modern-card-visual-single-card-layout",
    "distinction": "The two card labels intentionally share the same reference-label card recipe. Catalog label: Modern Card visual — Card with reference labels."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ModernCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ModernCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-card-with-reference-labels",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Card with reference labels",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "modern-card-visual-card-with-images",
  "title": "Modern Card visual — Card with images",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "ModernCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ModernCard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ModernCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ModernCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-card-with-images",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Card with images",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "modern-card-visual-data-driven-card-images",
  "title": "Modern Card visual — Data-driven card images",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "ModernCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ModernCard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ModernCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ModernCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "modern-card-visual-data-driven-card-images",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Modern Card visual — Data-driven card images",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "legacy-single-card",
  "title": "Legacy single Card",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "LegacyCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LegacyCard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "LegacyCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "LegacyCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "legacy-single-card",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Legacy single Card",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "legacy-multi-row-card",
  "title": "Legacy Multi-row Card",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "MultiRowCard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MultiRowCard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "MultiRowCard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "MultiRowCard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "legacy-multi-row-card",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Legacy Multi-row Card",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "kpi-visual",
  "title": "KPI visual",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "KpiVisual",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: tabular values, semantic delta badges, card shadow tokens (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for KpiVisual."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "KpiVisual"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "KpiVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "kpi-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "KPI visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "radial-gauge",
  "title": "Radial Gauge",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "RadialGauge",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: meter ARIA, semantic thresholds, range notices (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RadialGauge."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "RadialGauge"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "RadialGauge",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "radial-gauge",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Radial Gauge",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "goals-scorecard-visual",
  "title": "Goals / Scorecard visual",
  "category": "Cards, KPIs, and Gauges",
  "variant": null,
  "component": "Scorecard",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Scorecard."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "Scorecard"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "Scorecard",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "goals-scorecard-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Goals / Scorecard visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "hex-maps",
  "title": "Hex maps",
  "category": "Geographic and Map Visualizations",
  "variant": null,
  "component": "HexMap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HexMap."
  },
  "source": {
    "module": "@/components/maps",
    "exportName": "HexMap"
  },
  "dependencies": [
    "react",
    "d3"
  ],
  "lazyLoader": {
    "module": "@/components/maps",
    "exportName": "HexMap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hex-maps",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Hex maps",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "tile-grid-maps",
  "title": "Tile / grid maps",
  "category": "Geographic and Map Visualizations",
  "variant": null,
  "component": "TileGridMap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TileGridMap."
  },
  "source": {
    "module": "@/components/maps",
    "exportName": "TileGridMap"
  },
  "dependencies": [
    "react",
    "d3"
  ],
  "lazyLoader": {
    "module": "@/components/maps",
    "exportName": "TileGridMap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "tile-grid-maps",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Tile / grid maps",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "decomposition-tree",
  "title": "Decomposition Tree",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "DecompositionTree",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DecompositionTree."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "DecompositionTree"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "DecompositionTree",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "decomposition-tree",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Decomposition Tree",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "ai-assisted-decomposition-tree",
  "title": "AI-assisted Decomposition Tree",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "AIDecompositionTree",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AIDecompositionTree."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "AIDecompositionTree"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "AIDecompositionTree",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "ai-assisted-decomposition-tree",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "AI-assisted Decomposition Tree",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "key-influencers",
  "title": "Key Influencers",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "KeyInfluencers",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for KeyInfluencers."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "KeyInfluencers"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "KeyInfluencers",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "key-influencers",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Key Influencers",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "top-segments",
  "title": "Top Segments",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "TopSegments",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TopSegments."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "TopSegments"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "TopSegments",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "top-segments",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Top Segments",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "smart-narrative",
  "title": "Smart Narrative",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "SmartNarrative",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SmartNarrative."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "SmartNarrative"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "SmartNarrative",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "smart-narrative",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Smart Narrative",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "anomaly-detection",
  "title": "Anomaly Detection",
  "category": "AI and Analytical Visuals",
  "variant": null,
  "component": "AnomalyDetection",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AnomalyDetection."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "AnomalyDetection"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "AnomalyDetection",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "anomaly-detection",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Anomaly Detection",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "q-a-visual",
  "title": "Q&A visual",
  "category": "Natural-Language Visualization",
  "variant": null,
  "component": "QAVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for QAVisual."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "QAVisual"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "QAVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "q-a-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Q&A visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "other-compatible-visuals-selected-by-the-q-a-engine",
  "title": "Other compatible visuals selected by the Q&A engine",
  "category": "Natural-Language Visualization",
  "variant": null,
  "component": "QAEngineVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for QAEngineVisual."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "QAEngineVisual"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "QAEngineVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "other-compatible-visuals-selected-by-the-q-a-engine",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Other compatible visuals selected by the Q&A engine",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "standard-slicer",
  "title": "Standard Slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "StandardSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StandardSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "StandardSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "StandardSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "standard-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Standard Slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "button-slicer",
  "title": "Button Slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ButtonSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ButtonSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ButtonSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ButtonSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "button-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Button Slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "list-slicer",
  "title": "List Slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ListSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ListSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ListSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ListSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "list-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "List Slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "input-slicer",
  "title": "Input Slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "InputSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for InputSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "InputSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "InputSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "input-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Input Slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "vertical-list-slicer",
  "title": "Vertical list slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "VerticalListSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for VerticalListSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "VerticalListSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "VerticalListSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "vertical-list-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Vertical list slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "dropdown-slicer",
  "title": "Dropdown slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "DropdownSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DropdownSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "DropdownSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "DropdownSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dropdown-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Dropdown slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "tile-slicer",
  "title": "Tile slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "TileSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TileSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "TileSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "TileSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "tile-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Tile slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "hierarchical-slicer",
  "title": "Hierarchical slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "HierarchicalSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HierarchicalSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "HierarchicalSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "HierarchicalSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hierarchical-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Hierarchical slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "searchable-slicer",
  "title": "Searchable slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "SearchableSlicer",
  "status": "verified",
  "statusNote": "Verified 2026-08-10: focus rings, empty options copy, accent selection tokens (docs/VISUAL_AUDIT.md).",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SearchableSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "SearchableSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "SearchableSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "searchable-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Searchable slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": 250
},
{
  "id": "numeric-slicer",
  "title": "Numeric slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "NumericSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NumericSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "NumericSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "NumericSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "numeric-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Numeric slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "numeric-range-slicer",
  "title": "Numeric range slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "NumericRangeSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NumericRangeSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "NumericRangeSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "NumericRangeSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "numeric-range-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Numeric range slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "between-slicer",
  "title": "Between slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "BetweenSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BetweenSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "BetweenSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "BetweenSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "between-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Between slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "greater-than-after-slicer",
  "title": "Greater-than / After slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "GreaterThanSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for GreaterThanSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "GreaterThanSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "GreaterThanSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "greater-than-after-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Greater-than / After slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "less-than-before-slicer",
  "title": "Less-than / Before slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "LessThanSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LessThanSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "LessThanSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "LessThanSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "less-than-before-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Less-than / Before slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "date-range-slicer",
  "title": "Date range slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "DateRangeSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DateRangeSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "DateRangeSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "DateRangeSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "date-range-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Date range slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "date-hierarchy-slicer",
  "title": "Date hierarchy slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "DateHierarchySlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DateHierarchySlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "DateHierarchySlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "DateHierarchySlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "date-hierarchy-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Date hierarchy slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "relative-date-slicer",
  "title": "Relative date slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "RelativeDateSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RelativeDateSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "RelativeDateSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "RelativeDateSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "relative-date-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Relative date slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "relative-time-slicer",
  "title": "Relative time slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "RelativeTimeSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RelativeTimeSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "RelativeTimeSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "RelativeTimeSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "relative-time-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Relative time slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "date-picker",
  "title": "Date picker",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "DatePickerSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DatePickerSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "DatePickerSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "DatePickerSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "date-picker",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Date picker",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "single-select-buttons",
  "title": "Single-select buttons",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "SingleSelectButtons",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SingleSelectButtons."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "SingleSelectButtons"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "SingleSelectButtons",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "single-select-buttons",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Single-select buttons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "multi-select-buttons",
  "title": "Multi-select buttons",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "MultiSelectButtons",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MultiSelectButtons."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "MultiSelectButtons"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "MultiSelectButtons",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "multi-select-buttons",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Multi-select buttons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "button-grid",
  "title": "Button grid",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ButtonGrid",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ButtonGrid."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ButtonGrid"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ButtonGrid",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "button-grid",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Button grid",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "button-list",
  "title": "Button list",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ButtonList",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ButtonList."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ButtonList"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ButtonList",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "button-list",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Button list",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "image-buttons",
  "title": "Image buttons",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ImageButtons",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ImageButtons."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ImageButtons"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ImageButtons",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "image-buttons",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Image buttons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "icon-buttons",
  "title": "Icon buttons",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "IconButtons",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for IconButtons."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "IconButtons"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "IconButtons",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "icon-buttons",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Icon buttons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "searchable-list",
  "title": "Searchable list",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "SearchableListSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SearchableListSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "SearchableListSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "SearchableListSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "searchable-list",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Searchable list",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": 250
},
{
  "id": "hierarchical-list",
  "title": "Hierarchical list",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "HierarchicalListSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HierarchicalListSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "HierarchicalListSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "HierarchicalListSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hierarchical-list",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Hierarchical list",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "conditionally-formatted-list",
  "title": "Conditionally formatted list",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ConditionalListSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConditionalListSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ConditionalListSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ConditionalListSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "conditionally-formatted-list",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Conditionally formatted list",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "exact-text-filter",
  "title": "Exact-text filter",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ExactTextFilter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ExactTextFilter."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ExactTextFilter"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ExactTextFilter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "exact-text-filter",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Exact-text filter",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "contains-filter",
  "title": "Contains filter",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ContainsFilter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ContainsFilter."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ContainsFilter"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ContainsFilter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "contains-filter",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Contains filter",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "starts-with-filter",
  "title": "Starts-with filter",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "StartsWithFilter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StartsWithFilter."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "StartsWithFilter"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "StartsWithFilter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "starts-with-filter",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Starts-with filter",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "numeric-input-filter",
  "title": "Numeric-input filter",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "NumericInputFilter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NumericInputFilter."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "NumericInputFilter"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "NumericInputFilter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "numeric-input-filter",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Numeric-input filter",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "free-form-input",
  "title": "Free-form input",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "FreeFormInput",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FreeFormInput."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "FreeFormInput"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "FreeFormInput",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "free-form-input",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Free-form input",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "pasted-value-filtering",
  "title": "Pasted-value filtering",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "PastedValueFilter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PastedValueFilter."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "PastedValueFilter"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "PastedValueFilter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pasted-value-filtering",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Pasted-value filtering",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "input-collection-for-write-back-translytical-scenarios",
  "title": "Input collection for write-back / translytical scenarios",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "InputCollection",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for InputCollection."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "InputCollection"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "InputCollection",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "input-collection-for-write-back-translytical-scenarios",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Input collection for write-back / translytical scenarios",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "chiclet-slicer",
  "title": "Chiclet slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "ChicletSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ChicletSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "ChicletSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "ChicletSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "chiclet-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Chiclet slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "timeline-slicer",
  "title": "Timeline slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "TimelineSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TimelineSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "TimelineSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "TimelineSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "timeline-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Timeline slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "advanced-date-slicer",
  "title": "Advanced date slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "AdvancedDateSlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AdvancedDateSlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "AdvancedDateSlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "AdvancedDateSlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "advanced-date-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Advanced date slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "advanced-hierarchy-slicer",
  "title": "Advanced hierarchy slicer",
  "category": "Slicer Visualizations",
  "variant": null,
  "component": "AdvancedHierarchySlicer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AdvancedHierarchySlicer."
  },
  "source": {
    "module": "@/components/slicers",
    "exportName": "AdvancedHierarchySlicer"
  },
  "dependencies": [
    "react",
    "date-fns",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/slicers",
    "exportName": "AdvancedHierarchySlicer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "advanced-hierarchy-slicer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Advanced hierarchy slicer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "image-visual",
  "title": "Image visual",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "ImageVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ImageVisual."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "ImageVisual"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "ImageVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "image-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Image visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 240
},
{
  "id": "static-image",
  "title": "Static image",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "StaticImage",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StaticImage."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "StaticImage"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "StaticImage",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "static-image",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Static image",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 200
},
{
  "id": "dynamic-data-driven-image",
  "title": "Dynamic / data-driven image",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "DynamicImage",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DynamicImage."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "DynamicImage"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "DynamicImage",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-data-driven-image",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Dynamic / data-driven image",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 200
},
{
  "id": "text-box",
  "title": "Text box",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "TextBox",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TextBox."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "TextBox"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "TextBox",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "text-box",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Text box",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "dynamic-data-bound-text",
  "title": "Dynamic / data-bound text",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "DynamicText",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DynamicText."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "DynamicText"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "DynamicText",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-data-bound-text",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Dynamic / data-bound text",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "rectangle",
  "title": "Rectangle",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "RectangleShape",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RectangleShape."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "RectangleShape"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "RectangleShape",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "rectangle",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Rectangle",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 180
},
{
  "id": "oval",
  "title": "Oval",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "OvalShape",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for OvalShape."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "OvalShape"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "OvalShape",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "oval",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Oval",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 180
},
{
  "id": "line",
  "title": "Line",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "LineShape",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LineShape."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "LineShape"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "LineShape",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "line",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Line",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 180
},
{
  "id": "arrow",
  "title": "Arrow",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "ArrowShape",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ArrowShape."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "ArrowShape"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "ArrowShape",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "arrow",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Arrow",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 180
},
{
  "id": "other-report-shapes",
  "title": "Other report shapes",
  "category": "Text, Images, and Shapes",
  "variant": null,
  "component": "ReportShape",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ReportShape."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "ReportShape"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "ReportShape",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "other-report-shapes",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Other report shapes",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 180
},
{
  "id": "button",
  "title": "Button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "NavButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NavButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "NavButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "NavButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "blank-button",
  "title": "Blank button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "BlankButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BlankButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "BlankButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "BlankButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "blank-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Blank button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "back-button",
  "title": "Back button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "BackButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BackButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "BackButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "BackButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "back-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Back button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "bookmark-button",
  "title": "Bookmark button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "BookmarkButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BookmarkButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "BookmarkButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "BookmarkButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "bookmark-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Bookmark button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "drill-through-button",
  "title": "Drill-through button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "DrillThroughButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DrillThroughButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "DrillThroughButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "DrillThroughButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "drill-through-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Drill-through button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "page-navigation-button",
  "title": "Page navigation button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "PageNavigationButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PageNavigationButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "PageNavigationButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "PageNavigationButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "page-navigation-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Page navigation button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "web-url-button",
  "title": "Web URL button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "WebUrlButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for WebUrlButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "WebUrlButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "WebUrlButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "web-url-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Web URL button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "q-a-button",
  "title": "Q&A button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "QAButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for QAButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "QAButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "QAButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "q-a-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Q&A button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "apply-all-slicers-button",
  "title": "Apply-all-slicers button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "ApplyAllSlicersButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ApplyAllSlicersButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "ApplyAllSlicersButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "ApplyAllSlicersButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "apply-all-slicers-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Apply-all-slicers button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "clear-all-slicers-button",
  "title": "Clear-all-slicers button",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "ClearAllSlicersButton",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ClearAllSlicersButton."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "ClearAllSlicersButton"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "ClearAllSlicersButton",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "clear-all-slicers-button",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Clear-all-slicers button",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "page-navigator",
  "title": "Page Navigator",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "PageNavigator",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PageNavigator."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "PageNavigator"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "PageNavigator",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "page-navigator",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Page Navigator",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "bookmark-navigator",
  "title": "Bookmark Navigator",
  "category": "Navigation and Interactivity Visuals",
  "variant": null,
  "component": "BookmarkNavigator",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BookmarkNavigator."
  },
  "source": {
    "module": "@/components/navigation",
    "exportName": "BookmarkNavigator"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/navigation",
    "exportName": "BookmarkNavigator",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "bookmark-navigator",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Bookmark Navigator",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "interactive-control",
    "component-default-fixture",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "power-apps-visual",
  "title": "Power Apps visual",
  "category": "Embedded and Application Visuals",
  "variant": null,
  "component": "PowerAppsVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PowerAppsVisual."
  },
  "source": {
    "module": "@/components/integrations",
    "exportName": "PowerAppsVisual"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/integrations",
    "exportName": "PowerAppsVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "power-apps-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Power Apps visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "power-automate-visual",
  "title": "Power Automate visual",
  "category": "Embedded and Application Visuals",
  "variant": null,
  "component": "PowerAutomateVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PowerAutomateVisual."
  },
  "source": {
    "module": "@/components/integrations",
    "exportName": "PowerAutomateVisual"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/integrations",
    "exportName": "PowerAutomateVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "power-automate-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Power Automate visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "self-framed"
  ],
  "height": "auto",
  "selfFramed": true
},
{
  "id": "histogram",
  "title": "Histogram",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "Histogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Histogram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Histogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Histogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "histogram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Histogram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "density-plot",
  "title": "Density plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "DensityPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DensityPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DensityPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DensityPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "density-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Density plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "kernel-density-plot",
  "title": "Kernel-density plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "KernelDensityPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for KernelDensityPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "KernelDensityPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "KernelDensityPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "kernel-density-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Kernel-density plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "box-plot",
  "title": "Box plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "BoxPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BoxPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BoxPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BoxPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "box-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Box plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "violin-plot",
  "title": "Violin plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ViolinPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ViolinPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ViolinPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ViolinPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "violin-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Violin plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "ridgeline-plot",
  "title": "Ridgeline plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "RidgelinePlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RidgelinePlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RidgelinePlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RidgelinePlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "ridgeline-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Ridgeline plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "hexbin-plot",
  "title": "Hexbin plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "HexbinPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HexbinPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "HexbinPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "HexbinPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hexbin-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Hexbin plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "correlogram",
  "title": "Correlogram",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "Correlogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Correlogram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Correlogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Correlogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "correlogram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Correlogram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "scatterplot-matrix",
  "title": "Scatterplot matrix",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ScatterplotMatrix",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ScatterplotMatrix."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScatterplotMatrix"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScatterplotMatrix",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "scatterplot-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Scatterplot matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "statistical-heatmap",
  "title": "Statistical heatmap",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "StatisticalHeatmap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StatisticalHeatmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "statistical-heatmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Statistical heatmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "dendrogram",
  "title": "Dendrogram",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "Dendrogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Dendrogram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Dendrogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Dendrogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dendrogram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dendrogram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "hierarchical-clustering-plot",
  "title": "Hierarchical clustering plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "Dendrogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "dendrogram",
    "distinction": "The hierarchical-clustering label intentionally aliases the dendrogram recipe. Catalog label: Hierarchical clustering plot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Dendrogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Dendrogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hierarchical-clustering-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Hierarchical clustering plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "survival-curve",
  "title": "Survival curve",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "SurvivalCurve",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SurvivalCurve."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SurvivalCurve"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SurvivalCurve",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "survival-curve",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Survival curve",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "roc-curve",
  "title": "ROC curve",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ROCCurve",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ROCCurve."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ROCCurve"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ROCCurve",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "roc-curve",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "ROC curve",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "precision-recall-curve",
  "title": "Precision-recall curve",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "PrecisionRecallCurve",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PrecisionRecallCurve."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PrecisionRecallCurve"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PrecisionRecallCurve",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "precision-recall-curve",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Precision-recall curve",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "qq-plot",
  "title": "QQ plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "QQPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for QQPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "QQPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "QQPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "qq-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "QQ plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "residual-plot",
  "title": "Residual plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ResidualPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ResidualPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ResidualPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ResidualPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "residual-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Residual plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "regression-plot",
  "title": "Regression plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "RegressionPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RegressionPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RegressionPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RegressionPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "regression-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Regression plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "contour-plot",
  "title": "Contour plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ContourPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ContourPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ContourPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ContourPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "contour-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Contour plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "faceted-plots",
  "title": "Faceted plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "FacetedPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FacetedPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FacetedPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FacetedPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "faceted-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Faceted plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "confidence-band-plots",
  "title": "Confidence-band plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ConfidenceBandPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConfidenceBandPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ConfidenceBandPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ConfidenceBandPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "confidence-band-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Confidence-band plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "network-plots",
  "title": "Network plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "NetworkPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NetworkPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "NetworkPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "NetworkPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "network-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Network plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "specialized-scientific-plots",
  "title": "Specialized scientific plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ScientificSpecVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ScientificSpecVisual."
  },
  "source": {
    "module": "@/components/declarative",
    "exportName": "ScientificSpecVisual"
  },
  "dependencies": [
    "react",
    "vega",
    "vega-lite",
    "vega-embed"
  ],
  "lazyLoader": {
    "module": "@/components/declarative",
    "exportName": "ScientificSpecVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "scientificContourSpec"
    ]
  },
  "docs": {
    "slug": "specialized-scientific-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Specialized scientific plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "kde-plot",
  "title": "KDE plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "KernelDensityPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "kernel-density-plot",
    "distinction": "KDE and kernel-density labels intentionally share the same estimator recipe. Catalog label: KDE plot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "KernelDensityPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "KernelDensityPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "kde-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "KDE plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "heatmap",
  "title": "Heatmap",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "StatisticalHeatmap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "statistical-heatmap",
    "distinction": "The generic and matrix labels intentionally share one statistical-heatmap recipe. Catalog label: Heatmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "heatmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Heatmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "correlation-matrix",
  "title": "Correlation matrix",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "Correlogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "correlogram",
    "distinction": "The three correlation labels intentionally share one correlogram recipe while naming different analytical contexts. Catalog label: Correlation matrix."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Correlogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Correlogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "correlation-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Correlation matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "pair-plot",
  "title": "Pair plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "PairPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PairPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PairPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PairPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pair-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pair plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "regression-chart",
  "title": "Regression chart",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "RegressionPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "regression-plot",
    "distinction": "The regression naming variants intentionally share the same regression recipe. Catalog label: Regression chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RegressionPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RegressionPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "regression-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Regression chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "contour-chart",
  "title": "Contour chart",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ContourPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "contour-plot",
    "distinction": "The contour and density naming variants intentionally share one sampled-field contour recipe. Catalog label: Contour chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ContourPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ContourPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "contour-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Contour chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "error-bar-plot",
  "title": "Error-bar plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ErrorBarPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ErrorBarPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ErrorBarPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ErrorBarPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "error-bar-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Error-bar plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "statistical-distribution-plot",
  "title": "Statistical distribution plot",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "DensityPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "density-plot",
    "distinction": "The generic distribution label intentionally aliases the density-plot recipe. Catalog label: Statistical distribution plot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DensityPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DensityPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "statistical-distribution-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Statistical distribution plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "time-series-analysis-chart",
  "title": "Time-series analysis chart",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "TrendAnalysis",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TrendAnalysis."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "TrendAnalysis"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "TrendAnalysis",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "time-series-analysis-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Time-series analysis chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "forecast-visualization",
  "title": "Forecast visualization",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ForecastDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ForecastDemo."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "ForecastDemo"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "ForecastDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "forecast-visualization",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Forecast visualization",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "machine-learning-result-plots",
  "title": "Machine-learning result plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "MachineLearningResultPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MachineLearningResultPlot."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "MachineLearningResultPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "MachineLearningResultPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "mlFeatureResult"
    ]
  },
  "docs": {
    "slug": "machine-learning-result-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Machine-learning result plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "cluster-plots",
  "title": "Cluster plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ClusterPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ClusterPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ClusterPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ClusterPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "cluster-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Cluster plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "pca-plots",
  "title": "PCA plots",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "PCAPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PCAPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PCAPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PCAPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pca-plots",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "PCA plots",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "confusion-matrix",
  "title": "Confusion matrix",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "ConfusionMatrix",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConfusionMatrix."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ConfusionMatrix"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ConfusionMatrix",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "confusion-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Confusion matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "feature-importance-chart",
  "title": "Feature-importance chart",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "FeatureImportanceChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FeatureImportanceChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FeatureImportanceChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FeatureImportanceChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "feature-importance-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Feature-importance chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "precision-recall-chart",
  "title": "Precision-recall chart",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "PrecisionRecallCurve",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "precision-recall-curve",
    "distinction": "Chart and curve naming variants intentionally share the same precision-recall recipe. Catalog label: Precision-recall chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PrecisionRecallCurve"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PrecisionRecallCurve",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "precision-recall-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Precision-recall chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "custom-matplotlib-visualizations",
  "title": "Custom Matplotlib visualizations",
  "category": "Statistical & Scientific Charts",
  "variant": null,
  "component": "MatplotlibArtifact",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MatplotlibArtifact."
  },
  "source": {
    "module": "@/components/content",
    "exportName": "MatplotlibArtifact"
  },
  "dependencies": [
    "react",
    "dompurify"
  ],
  "lazyLoader": {
    "module": "@/components/content",
    "exportName": "MatplotlibArtifact",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "custom-matplotlib-visualizations",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Custom Matplotlib visualizations",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "gantt-chart",
  "title": "Gantt chart",
  "category": "Project and Timeline Visuals",
  "variant": null,
  "component": "GanttChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for GanttChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "GanttChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "GanttChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "gantt-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Gantt chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "advanced-gantt-chart",
  "title": "Advanced Gantt chart",
  "category": "Project and Timeline Visuals",
  "variant": null,
  "component": "AdvancedGanttChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AdvancedGanttChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "AdvancedGanttChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "AdvancedGanttChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "advanced-gantt-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Advanced Gantt chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "timeline-chart",
  "title": "Timeline chart",
  "category": "Project and Timeline Visuals",
  "variant": null,
  "component": "TimelineChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TimelineChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TimelineChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TimelineChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "timeline-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Timeline chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "milestone-chart",
  "title": "Milestone chart",
  "category": "Project and Timeline Visuals",
  "variant": null,
  "component": "MilestoneChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MilestoneChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "MilestoneChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "MilestoneChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "milestone-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Milestone chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "project-roadmap",
  "title": "Project roadmap",
  "category": "Project and Timeline Visuals",
  "variant": null,
  "component": "ProjectRoadmap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ProjectRoadmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ProjectRoadmap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ProjectRoadmap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "project-roadmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Project roadmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "sankey-diagram",
  "title": "Sankey diagram",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "SankeyDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SankeyDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SankeyDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SankeyDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "sankey-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Sankey diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "alluvial-diagram",
  "title": "Alluvial diagram",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "AlluvialDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AlluvialDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "AlluvialDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "AlluvialDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "alluvial-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Alluvial diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "chord-diagram",
  "title": "Chord diagram",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "ChordDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ChordDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ChordDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ChordDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "chord-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Chord diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "network-diagram",
  "title": "Network diagram",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "NetworkDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NetworkDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "NetworkDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "NetworkDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "network-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Network diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "force-directed-network",
  "title": "Force-directed network",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "ForceDirectedNetwork",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ForceDirectedNetwork."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ForceDirectedNetwork"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ForceDirectedNetwork",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "force-directed-network",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Force-directed network",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "dependency-graph",
  "title": "Dependency graph",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "DependencyGraph",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DependencyGraph."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DependencyGraph"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DependencyGraph",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dependency-graph",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dependency graph",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "organizational-chart",
  "title": "Organizational chart",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "OrgChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for OrgChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "OrgChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "OrgChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "organizational-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Organizational chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "process-flow",
  "title": "Process flow",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "ProcessFlow",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ProcessFlow."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ProcessFlow"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ProcessFlow",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "process-flow",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Process flow",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "flowchart",
  "title": "Flowchart",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "Flowchart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Flowchart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Flowchart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Flowchart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "flowchart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Flowchart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "journey-map",
  "title": "Journey map",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "JourneyMap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for JourneyMap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "JourneyMap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "JourneyMap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "journey-map",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Journey map",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "decision-tree",
  "title": "Decision tree",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "DecisionTree",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DecisionTree."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DecisionTree"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DecisionTree",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "decision-tree",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Decision tree",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "tree-diagram",
  "title": "Tree diagram",
  "category": "Flow and Network Visuals",
  "variant": null,
  "component": "TreeDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TreeDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TreeDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TreeDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "tree-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Tree diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "sunburst-chart",
  "title": "Sunburst chart",
  "category": "Hierarchy Visuals",
  "variant": null,
  "component": "SunburstChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SunburstChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SunburstChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SunburstChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "sunburst-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Sunburst chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "icicle-chart",
  "title": "Icicle chart",
  "category": "Hierarchy Visuals",
  "variant": null,
  "component": "IcicleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for IcicleChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "IcicleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "IcicleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "icicle-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Icicle chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "circle-packing",
  "title": "Circle packing",
  "category": "Hierarchy Visuals",
  "variant": null,
  "component": "CirclePacking",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CirclePacking."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "CirclePacking"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "CirclePacking",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "circle-packing",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Circle packing",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "hierarchical-edge-bundling",
  "title": "Hierarchical edge bundling",
  "category": "Hierarchy Visuals",
  "variant": null,
  "component": "HierarchicalEdgeBundling",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HierarchicalEdgeBundling."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "HierarchicalEdgeBundling"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "HierarchicalEdgeBundling",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "hierarchical-edge-bundling",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Hierarchical edge bundling",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "radar-chart",
  "title": "Radar chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "RadarChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RadarChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RadarChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RadarChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "radar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Radar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "spider-chart",
  "title": "Spider chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "SpiderChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SpiderChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SpiderChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SpiderChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "spider-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Spider chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "polar-chart",
  "title": "Polar chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "PolarChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PolarChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PolarChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PolarChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "polar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Polar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "rose-chart",
  "title": "Rose chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "RoseChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RoseChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RoseChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RoseChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "rose-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Rose chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "coxcomb-chart",
  "title": "Coxcomb chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "CoxcombChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CoxcombChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "CoxcombChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "CoxcombChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "coxcomb-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Coxcomb chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "nightingale-rose-chart",
  "title": "Nightingale rose chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "NightingaleRose",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for NightingaleRose."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "NightingaleRose"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "NightingaleRose",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "nightingale-rose-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Nightingale rose chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "polar-area-chart",
  "title": "Polar area chart",
  "category": "Polar and Radial Visuals",
  "variant": null,
  "component": "PolarAreaChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PolarAreaChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PolarAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PolarAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "polar-area-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Polar area chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "bullet-chart",
  "title": "Bullet chart",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "BulletChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BulletChart."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "BulletChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "BulletChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "bullet-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Bullet chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "linear-gauge",
  "title": "Linear gauge",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "LinearGauge",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LinearGauge."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "LinearGauge"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "LinearGauge",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "linear-gauge",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Linear gauge",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "thermometer-gauge",
  "title": "Thermometer gauge",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "ThermometerGauge",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ThermometerGauge."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ThermometerGauge"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ThermometerGauge",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "thermometer-gauge",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Thermometer gauge",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "dial-gauge",
  "title": "Dial gauge",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "DialGauge",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DialGauge."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "DialGauge"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "DialGauge",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "dial-gauge",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Dial gauge",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "speedometer",
  "title": "Speedometer",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "DialGauge",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DialGauge."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "DialGauge"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "DialGauge",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "speedometer",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Speedometer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "advanced-kpi",
  "title": "Advanced KPI",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "KpiVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "kpi-visual",
    "distinction": "Advanced KPI currently aliases the base KPI recipe and is tracked separately as an extended-family label. Catalog label: Advanced KPI."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "KpiVisual"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "KpiVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "advanced-kpi",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Advanced KPI",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "self-framed"
  ],
  "selfFramed": true
},
{
  "id": "traffic-light-kpi",
  "title": "Traffic-light KPI",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "TrafficLightKpi",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TrafficLightKpi."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "TrafficLightKpi"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "TrafficLightKpi",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "kpiMetrics"
    ]
  },
  "docs": {
    "slug": "traffic-light-kpi",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Traffic-light KPI",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "progress-bar",
  "title": "Progress bar",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "ProgressBar",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ProgressBar."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ProgressBar"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ProgressBar",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "progress-bar",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Progress bar",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "progress-ring",
  "title": "Progress ring",
  "category": "KPI and Gauge Visuals (Extended)",
  "variant": null,
  "component": "ProgressRing",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ProgressRing."
  },
  "source": {
    "module": "@/components/cards",
    "exportName": "ProgressRing"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/cards",
    "exportName": "ProgressRing",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "progress-ring",
    "state": "draft"
  },
  "reference": {
    "kind": "component-pattern",
    "label": "Progress ring",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "waffle-chart",
  "title": "Waffle chart",
  "category": "Infographic Visuals",
  "variant": null,
  "component": "WaffleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for WaffleChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "WaffleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "WaffleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "waffle-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Waffle chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "pictogram-chart",
  "title": "Pictogram chart",
  "category": "Infographic Visuals",
  "variant": null,
  "component": "PictogramChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PictogramChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PictogramChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PictogramChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pictogram-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pictogram chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "icon-array",
  "title": "Icon array",
  "category": "Infographic Visuals",
  "variant": null,
  "component": "IconArray",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for IconArray."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "IconArray"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "IconArray",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "icon-array",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Icon array",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "infographic-chart",
  "title": "Infographic chart",
  "category": "Infographic Visuals",
  "variant": null,
  "component": "WaffleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "waffle-chart",
    "distinction": "The generic infographic label intentionally uses the waffle chart as its concrete example. Catalog label: Infographic chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "WaffleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "WaffleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "infographic-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Infographic chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "lollipop-chart",
  "title": "Lollipop chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "LollipopChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LollipopChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LollipopChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LollipopChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "lollipop-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Lollipop chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "dumbbell-chart",
  "title": "Dumbbell chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "DumbbellChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DumbbellChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DumbbellChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DumbbellChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dumbbell-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dumbbell chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "connected-dot-plot",
  "title": "Connected-dot plot",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "ConnectedDotPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConnectedDotPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ConnectedDotPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ConnectedDotPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "connected-dot-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Connected-dot plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "slope-chart",
  "title": "Slope chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "SlopeChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SlopeChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SlopeChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SlopeChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "slope-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Slope chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "bump-chart",
  "title": "Bump chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "BumpChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BumpChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BumpChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BumpChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "bump-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Bump chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "butterfly-chart",
  "title": "Butterfly chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "ButterflyChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ButterflyChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ButterflyChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ButterflyChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "butterfly-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Butterfly chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "tornado-chart",
  "title": "Tornado chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "TornadoChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TornadoChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TornadoChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TornadoChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "tornado-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Tornado chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "population-pyramid",
  "title": "Population pyramid",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "PopulationPyramid",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PopulationPyramid."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "PopulationPyramid"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "PopulationPyramid",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "population-pyramid",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Population pyramid",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "diverging-bar-chart",
  "title": "Diverging bar chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "DivergingBarChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DivergingBarChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DivergingBarChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DivergingBarChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "diverging-bar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Diverging bar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "likert-chart",
  "title": "Likert chart",
  "category": "Comparison Visuals",
  "variant": null,
  "component": "LikertChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for LikertChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "LikertChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "LikertChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "likert-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Likert chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "dot-density-chart",
  "title": "Dot-density chart",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "DotDensityChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DotDensityChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DotDensityChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DotDensityChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dot-density-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dot-density chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "strip-plot",
  "title": "Strip plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "StripPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StripPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StripPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StripPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "strip-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Strip plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "beeswarm-plot",
  "title": "Beeswarm plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "BeeswarmPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BeeswarmPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BeeswarmPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BeeswarmPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "beeswarm-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Beeswarm plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "jitter-plot",
  "title": "Jitter plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "JitterPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for JitterPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "JitterPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "JitterPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "jitter-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Jitter plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "box-and-whisker-plot",
  "title": "Box-and-whisker plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "BoxPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "box-plot",
    "distinction": "Box-plot naming variants intentionally share the same component-default recipe. Catalog label: Box-and-whisker plot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BoxPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BoxPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "box-and-whisker-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Box-and-whisker plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "raincloud-plot",
  "title": "Raincloud plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "RaincloudPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RaincloudPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RaincloudPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RaincloudPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "raincloud-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Raincloud plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "frequency-polygon",
  "title": "Frequency polygon",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "FrequencyPolygon",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FrequencyPolygon."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FrequencyPolygon"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FrequencyPolygon",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "frequency-polygon",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Frequency polygon",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "ridgeline-chart",
  "title": "Ridgeline chart",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "RidgelinePlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "ridgeline-plot",
    "distinction": "Ridgeline naming variants intentionally share the same component-default recipe. Catalog label: Ridgeline chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RidgelinePlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RidgelinePlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "ridgeline-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Ridgeline chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "2d-density-plot",
  "title": "2D density plot",
  "category": "Distribution Visuals",
  "variant": null,
  "component": "ContourPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "contour-plot",
    "distinction": "The contour and density naming variants intentionally share one sampled-field contour recipe. Catalog label: 2D density plot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ContourPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ContourPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "2d-density-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "2D density plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "calendar-heatmap",
  "title": "Calendar heatmap",
  "category": "Heatmap and Matrix Visuals",
  "variant": null,
  "component": "CalendarHeatmap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CalendarHeatmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "CalendarHeatmap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "CalendarHeatmap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "calendar-heatmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Calendar heatmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "matrix-heatmap",
  "title": "Matrix heatmap",
  "category": "Heatmap and Matrix Visuals",
  "variant": null,
  "component": "StatisticalHeatmap",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "statistical-heatmap",
    "distinction": "The generic and matrix labels intentionally share one statistical-heatmap recipe. Catalog label: Matrix heatmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StatisticalHeatmap",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "matrix-heatmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Matrix heatmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "correlation-heatmap",
  "title": "Correlation heatmap",
  "category": "Heatmap and Matrix Visuals",
  "variant": null,
  "component": "Correlogram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "correlogram",
    "distinction": "The three correlation labels intentionally share one correlogram recipe while naming different analytical contexts. Catalog label: Correlation heatmap."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Correlogram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Correlogram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "correlation-heatmap",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Correlation heatmap",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "risk-matrix",
  "title": "Risk matrix",
  "category": "Heatmap and Matrix Visuals",
  "variant": null,
  "component": "RiskMatrix",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RiskMatrix."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RiskMatrix"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RiskMatrix",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "risk-matrix",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Risk matrix",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "quadrant-chart",
  "title": "Quadrant chart",
  "category": "Heatmap and Matrix Visuals",
  "variant": "quadrant",
  "component": "ScatterBubbleChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "scatter-plot",
    "distinction": "Configures ScatterBubbleChart with the explicit quadrant variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScatterBubbleChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "scatterPoints"
    ]
  },
  "docs": {
    "slug": "quadrant-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Quadrant chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "mekko-chart",
  "title": "Mekko chart",
  "category": "Composition Visuals",
  "variant": null,
  "component": "MekkoChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MekkoChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "MekkoChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "MekkoChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "mekko-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Mekko chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "marimekko-chart",
  "title": "Marimekko chart",
  "category": "Composition Visuals",
  "variant": null,
  "component": "MarimekkoChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MarimekkoChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "MarimekkoChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "MarimekkoChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "marimekko-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Marimekko chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "mosaic-plot",
  "title": "Mosaic plot",
  "category": "Composition Visuals",
  "variant": null,
  "component": "MosaicPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MosaicPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "MosaicPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "MosaicPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "mosaic-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Mosaic plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "parallel-coordinates-plot",
  "title": "Parallel coordinates plot",
  "category": "Multivariate Visuals",
  "variant": null,
  "component": "ParallelCoordinates",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ParallelCoordinates."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ParallelCoordinates"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ParallelCoordinates",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "parallel-coordinates-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Parallel coordinates plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "parallel-sets",
  "title": "Parallel sets",
  "category": "Multivariate Visuals",
  "variant": null,
  "component": "ParallelSets",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ParallelSets."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ParallelSets"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ParallelSets",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "parallel-sets",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Parallel sets",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "ternary-plot",
  "title": "Ternary plot",
  "category": "Multivariate Visuals",
  "variant": null,
  "component": "TernaryPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TernaryPlot."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TernaryPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TernaryPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "ternary-plot",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Ternary plot",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "streamgraph",
  "title": "Streamgraph",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "Streamgraph",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for Streamgraph."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "Streamgraph"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "Streamgraph",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "streamgraph",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Streamgraph",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "horizon-chart",
  "title": "Horizon chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "HorizonChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for HorizonChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "HorizonChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "HorizonChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "horizon-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Horizon chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "step-chart",
  "title": "Step chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "StepChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StepChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StepChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StepChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "step-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Step chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "spline-chart",
  "title": "Spline chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "SplineChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SplineChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SplineChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SplineChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "spline-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Spline chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "range-area-chart",
  "title": "Range area chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "RangeAreaChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RangeAreaChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RangeAreaChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RangeAreaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "range-area-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Range area chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "band-chart",
  "title": "Band chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "BandChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BandChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BandChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BandChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "band-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Band chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "fan-chart",
  "title": "Fan chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "FanChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FanChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FanChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FanChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "fan-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Fan chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "confidence-interval-chart",
  "title": "Confidence-interval chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "ConfidenceIntervalChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConfidenceIntervalChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ConfidenceIntervalChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ConfidenceIntervalChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "confidence-interval-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Confidence-interval chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "error-bar-chart",
  "title": "Error-bar chart",
  "category": "Time-Series and Range Visuals",
  "variant": null,
  "component": "ErrorBarPlot",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "error-bar-plot",
    "distinction": "Chart and plot naming variants intentionally share the same error-bar recipe. Catalog label: Error-bar chart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ErrorBarPlot"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ErrorBarPlot",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "error-bar-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Error-bar chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "candlestick-chart",
  "title": "Candlestick chart",
  "category": "Financial Visuals",
  "variant": null,
  "component": "CandlestickChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CandlestickChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "CandlestickChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "CandlestickChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "candlestick-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Candlestick chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "ohlc-chart",
  "title": "OHLC chart",
  "category": "Financial Visuals",
  "variant": null,
  "component": "OHLCChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for OHLCChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "OHLCChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "OHLCChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "ohlc-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "OHLC chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "stock-chart",
  "title": "Stock chart",
  "category": "Financial Visuals",
  "variant": null,
  "component": "StockChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for StockChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "StockChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "StockChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "stock-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Stock chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "renko-chart",
  "title": "Renko chart",
  "category": "Financial Visuals",
  "variant": null,
  "component": "RenkoChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RenkoChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RenkoChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RenkoChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "renko-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Renko chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "kagi-chart",
  "title": "Kagi chart",
  "category": "Financial Visuals",
  "variant": null,
  "component": "KagiChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for KagiChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "KagiChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "KagiChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "kagi-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Kagi chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "financial-waterfall",
  "title": "Financial waterfall",
  "category": "Financial Visuals",
  "variant": null,
  "component": "FinancialWaterfall",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FinancialWaterfall."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FinancialWaterfall"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FinancialWaterfall",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "financial-waterfall",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Financial waterfall",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "pareto-chart",
  "title": "Pareto chart",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "ParetoChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ParetoChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ParetoChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ParetoChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pareto-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pareto chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "control-chart",
  "title": "Control chart",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "ControlChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ControlChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ControlChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ControlChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "control-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Control chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "spc-chart",
  "title": "SPC chart",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "SPCChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SPCChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "SPCChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "SPCChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "spc-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "SPC chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "run-chart",
  "title": "Run chart",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "RunChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for RunChart."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "RunChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "RunChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "run-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Run chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "fishbone-ishikawa-diagram",
  "title": "Fishbone / Ishikawa diagram",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "FishboneDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FishboneDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FishboneDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FishboneDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "fishbone-ishikawa-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Fishbone / Ishikawa diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "bow-tie-diagram",
  "title": "Bow-tie diagram",
  "category": "Quality and Process Visuals",
  "variant": null,
  "component": "BowTieDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for BowTieDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "BowTieDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "BowTieDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "bow-tie-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Bow-tie diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "funnel-variants",
  "title": "Funnel variants",
  "category": "Specialty Composition Visuals",
  "variant": null,
  "component": "FunnelChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "funnel-chart",
    "distinction": "Funnel variants currently reuses the base funnel recipe until distinct funnel options are supplied. Catalog label: Funnel variants."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FunnelChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FunnelChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "funnelStages"
    ]
  },
  "docs": {
    "slug": "funnel-variants",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Funnel variants",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "pyramid-chart",
  "title": "Pyramid chart",
  "category": "Specialty Composition Visuals",
  "variant": "pyramid",
  "component": "FunnelChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "funnel-chart",
    "distinction": "Configures FunnelChart with the explicit pyramid variant."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "FunnelChart"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "FunnelChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "funnelStages"
    ]
  },
  "docs": {
    "slug": "pyramid-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Pyramid chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "venn-diagram",
  "title": "Venn diagram",
  "category": "Specialty Composition Visuals",
  "variant": null,
  "component": "VennDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for VennDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "VennDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "VennDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "venn-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Venn diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "euler-diagram",
  "title": "Euler diagram",
  "category": "Specialty Composition Visuals",
  "variant": null,
  "component": "EulerDiagram",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for EulerDiagram."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "EulerDiagram"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "EulerDiagram",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "euler-diagram",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Euler diagram",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "word-cloud",
  "title": "Word cloud",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "WordCloud",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for WordCloud."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "WordCloud"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "WordCloud",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "word-cloud",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Word cloud",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "tag-cloud",
  "title": "Tag cloud",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "TagCloud",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TagCloud."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "TagCloud"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "TagCloud",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "tag-cloud",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Tag cloud",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "calendar-visual",
  "title": "Calendar visual",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "CalendarVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CalendarVisual."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "CalendarVisual"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "CalendarVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "calendar-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Calendar visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ]
},
{
  "id": "kpi-ticker",
  "title": "KPI ticker",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "KPITicker",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for KPITicker."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "KPITicker"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "KPITicker",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "kpi-ticker",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "KPI ticker",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "animated"
  ]
},
{
  "id": "data-ticker",
  "title": "Data ticker",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "DataTicker",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DataTicker."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "DataTicker"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "DataTicker",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "data-ticker",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Data ticker",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "animated"
  ]
},
{
  "id": "scrolling-text-visual",
  "title": "Scrolling text visual",
  "category": "Text and Calendar Visuals",
  "variant": null,
  "component": "ScrollingText",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ScrollingText."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ScrollingText"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ScrollingText",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "scrolling-text-visual",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Scrolling text visual",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "animated"
  ]
},
{
  "id": "animated-bar-race-chart",
  "title": "Animated bar-race chart",
  "category": "Animated Visuals",
  "variant": null,
  "component": "AnimatedBarRace",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AnimatedBarRace."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "AnimatedBarRace"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "AnimatedBarRace",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "animated-bar-race-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Animated bar-race chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "animated"
  ]
},
{
  "id": "animated-scatter-chart",
  "title": "Animated scatter chart",
  "category": "Animated Visuals",
  "variant": null,
  "component": "AnimatedScatter",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AnimatedScatter."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "AnimatedScatter"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "AnimatedScatter",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "animated-scatter-chart",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Animated scatter chart",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "animated"
  ]
},
{
  "id": "animated-timeline",
  "title": "Animated timeline",
  "category": "Animated Visuals",
  "variant": null,
  "component": "AnimatedTimeline",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AnimatedTimeline."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "AnimatedTimeline"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "AnimatedTimeline",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "animatedTimelineFrames"
    ]
  },
  "docs": {
    "slug": "animated-timeline",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Animated timeline",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data",
    "animated"
  ]
},
{
  "id": "image-grid",
  "title": "Image grid",
  "category": "Image, SVG, and HTML Visuals",
  "variant": null,
  "component": "ImageGrid",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ImageGrid."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ImageGrid"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ImageGrid",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "image-grid",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Image grid",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data"
  ]
},
{
  "id": "image-carousel",
  "title": "Image carousel",
  "category": "Image, SVG, and HTML Visuals",
  "variant": null,
  "component": "ImageCarousel",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ImageCarousel."
  },
  "source": {
    "module": "@/components/charts",
    "exportName": "ImageCarousel"
  },
  "dependencies": [
    "react",
    "recharts",
    "d3",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/charts",
    "exportName": "ImageCarousel",
    "clientOnly": true
  },
  "fixture": {
    "kind": "none",
    "ids": []
  },
  "docs": {
    "slug": "image-carousel",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Image carousel",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "animated"
  ]
},
{
  "id": "svg-visualizations",
  "title": "SVG visualizations",
  "category": "Image, SVG, and HTML Visuals",
  "variant": null,
  "component": "SafeSvgVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SafeSvgVisual."
  },
  "source": {
    "module": "@/components/content",
    "exportName": "SafeSvgVisual"
  },
  "dependencies": [
    "react",
    "dompurify"
  ],
  "lazyLoader": {
    "module": "@/components/content",
    "exportName": "SafeSvgVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "gallerySafeSvg"
    ]
  },
  "docs": {
    "slug": "svg-visualizations",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "SVG visualizations",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "html-based-visualizations",
  "title": "HTML-based visualizations",
  "category": "Image, SVG, and HTML Visuals",
  "variant": null,
  "component": "SafeHtmlVisual",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SafeHtmlVisual."
  },
  "source": {
    "module": "@/components/content",
    "exportName": "SafeHtmlVisual"
  },
  "dependencies": [
    "react",
    "dompurify"
  ],
  "lazyLoader": {
    "module": "@/components/content",
    "exportName": "SafeHtmlVisual",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "gallerySafeHtml"
    ]
  },
  "docs": {
    "slug": "html-based-visualizations",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "HTML-based visualizations",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "vega-charts",
  "title": "Vega charts",
  "category": "Grammar-of-Graphics / Declarative Visuals",
  "variant": null,
  "component": "VegaChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for VegaChart."
  },
  "source": {
    "module": "@/components/declarative",
    "exportName": "VegaChart"
  },
  "dependencies": [
    "react",
    "vega",
    "vega-lite",
    "vega-embed"
  ],
  "lazyLoader": {
    "module": "@/components/declarative",
    "exportName": "VegaChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "vegaBarSpec"
    ]
  },
  "docs": {
    "slug": "vega-charts",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Vega charts",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "vega-lite-charts",
  "title": "Vega-Lite charts",
  "category": "Grammar-of-Graphics / Declarative Visuals",
  "variant": null,
  "component": "VegaLiteChart",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for VegaLiteChart."
  },
  "source": {
    "module": "@/components/declarative",
    "exportName": "VegaLiteChart"
  },
  "dependencies": [
    "react",
    "vega",
    "vega-lite",
    "vega-embed"
  ],
  "lazyLoader": {
    "module": "@/components/declarative",
    "exportName": "VegaLiteChart",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "vegaLiteScatterSpec"
    ]
  },
  "docs": {
    "slug": "vega-lite-charts",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Vega-Lite charts",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "deneb-visuals",
  "title": "Deneb visuals",
  "category": "Grammar-of-Graphics / Declarative Visuals",
  "variant": null,
  "component": "DenebSpecRenderer",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DenebSpecRenderer."
  },
  "source": {
    "module": "@/components/declarative",
    "exportName": "DenebSpecRenderer"
  },
  "dependencies": [
    "react",
    "vega",
    "vega-lite",
    "vega-embed"
  ],
  "lazyLoader": {
    "module": "@/components/declarative",
    "exportName": "DenebSpecRenderer",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "denebCompatibleSpec"
    ]
  },
  "docs": {
    "slug": "deneb-visuals",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Deneb visuals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ]
},
{
  "id": "small-multiples",
  "title": "Small multiples",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "SmallMultiples",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for SmallMultiples."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "SmallMultiples"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "SmallMultiples",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "small-multiples",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Small multiples",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "trellis-charts",
  "title": "Trellis charts",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "TrellisCharts",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for TrellisCharts."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "TrellisCharts"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "TrellisCharts",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "trellis-charts",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Trellis charts",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "faceted-charts",
  "title": "Faceted charts",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "FacetedCharts",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for FacetedCharts."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "FacetedCharts"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "FacetedCharts",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "faceted-charts",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Faceted charts",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "drill-down",
  "title": "Drill-down",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DrillDownDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DrillDownDemo."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "DrillDownDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "DrillDownDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "drill-down",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Drill-down",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "drill-up",
  "title": "Drill-up",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DrillDownDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "drill-down",
    "distinction": "Drill-down and drill-up currently share one static drill-path demonstration. Catalog label: Drill-up."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "DrillDownDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "DrillDownDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "drill-up",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Drill-up",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "expand-all-hierarchy",
  "title": "Expand-all hierarchy",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DecompositionTree",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "decomposition-tree",
    "distinction": "Expand-all hierarchy intentionally demonstrates the existing decomposition-tree component. Catalog label: Expand-all hierarchy."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "DecompositionTree"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "DecompositionTree",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "expand-all-hierarchy",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Expand-all hierarchy",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "height": 260,
  "selfFramed": true
},
{
  "id": "cross-filtering",
  "title": "Cross-filtering",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "CrossFilterDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for CrossFilterDemo."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "CrossFilterDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "CrossFilterDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "cross-filtering",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Cross-filtering",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "cross-highlighting",
  "title": "Cross-highlighting",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "CrossFilterDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "cross-filtering",
    "distinction": "Cross-filter and cross-highlight currently share one static paired-chart demonstration. Catalog label: Cross-highlighting."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "CrossFilterDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "CrossFilterDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "cross-highlighting",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Cross-highlighting",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "report-page-tooltips",
  "title": "Report-page tooltips",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "VisualTooltipDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for VisualTooltipDemo."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "VisualTooltipDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "VisualTooltipDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "report-page-tooltips",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Report-page tooltips",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "visual-tooltips",
  "title": "Visual tooltips",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "VisualTooltipDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "report-page-tooltips",
    "distinction": "Both tooltip labels intentionally share the same tooltip demonstration. Catalog label: Visual tooltips."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "VisualTooltipDemo"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "VisualTooltipDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "visual-tooltips",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Visual tooltips",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "forecasting",
  "title": "Forecasting",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "ForecastDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "forecast-visualization",
    "distinction": "The statistical and analytical-technique labels intentionally share the same forecast demo. Catalog label: Forecasting."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "ForecastDemo"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "ForecastDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "forecasting",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Forecasting",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "height": 260,
  "selfFramed": true
},
{
  "id": "anomaly-overlays",
  "title": "Anomaly overlays",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "AnomalyOverlayDemo",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AnomalyOverlayDemo."
  },
  "source": {
    "module": "@/components/analytics",
    "exportName": "AnomalyOverlayDemo"
  },
  "dependencies": [
    "react",
    "recharts",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/analytics",
    "exportName": "AnomalyOverlayDemo",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "anomaly-overlays",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Anomaly overlays",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture",
    "self-framed"
  ],
  "height": 260,
  "selfFramed": true
},
{
  "id": "error-bars",
  "title": "Error bars",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "ErrorBarsOverlay",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ErrorBarsOverlay."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "ErrorBarsOverlay"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "ErrorBarsOverlay",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "error-bars",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Error bars",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "constant-lines",
  "title": "Constant lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "ConstantLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConstantLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "ConstantLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "ConstantLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "constant-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Constant lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "x-axis-reference-lines",
  "title": "X-axis reference lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "XAxisReferenceLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for XAxisReferenceLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "XAxisReferenceLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "XAxisReferenceLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "x-axis-reference-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "X-axis reference lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "y-axis-reference-lines",
  "title": "Y-axis reference lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "YAxisReferenceLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for YAxisReferenceLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "YAxisReferenceLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "YAxisReferenceLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "y-axis-reference-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Y-axis reference lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "average-lines",
  "title": "Average lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "AverageLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for AverageLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "AverageLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "AverageLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "average-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Average lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "minimum-lines",
  "title": "Minimum lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "MinLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MinLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "MinLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "MinLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "minimum-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Minimum lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "maximum-lines",
  "title": "Maximum lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "MaxLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MaxLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "MaxLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "MaxLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "maximum-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Maximum lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "median-lines",
  "title": "Median lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "MedianLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for MedianLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "MedianLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "MedianLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "median-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Median lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "percentile-lines",
  "title": "Percentile lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "PercentileLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for PercentileLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "PercentileLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "PercentileLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "percentile-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Percentile lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "dynamic-reference-lines",
  "title": "Dynamic reference lines",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DynamicReferenceLine",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DynamicReferenceLine."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "DynamicReferenceLine"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "DynamicReferenceLine",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-reference-lines",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dynamic reference lines",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "trend-analysis",
  "title": "Trend analysis",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "TrendAnalysis",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "time-series-analysis-chart",
    "distinction": "The generic time-series-analysis label intentionally aliases the current trend-analysis recipe. Catalog label: Trend analysis."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "TrendAnalysis"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "TrendAnalysis",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "trend-analysis",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Trend analysis",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "conditional-data-colors",
  "title": "Conditional data colors",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "ConditionalDataColors",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for ConditionalDataColors."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "ConditionalDataColors"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "ConditionalDataColors",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "conditional-data-colors",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Conditional data colors",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "conditional-icons",
  "title": "Conditional icons",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "table-matrix-with-icons",
    "distinction": "The analytical-technique and table-family labels intentionally share one conditional-icon recipe. Catalog label: Conditional icons."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "conditional-icons",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Conditional icons",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "conditional-data-bars",
  "title": "Conditional data bars",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "table-matrix-with-data-bars",
    "distinction": "The analytical-technique and table-family labels intentionally share one data-bar recipe. Catalog label: Conditional data bars."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "conditional-data-bars",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Conditional data bars",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "conditional-backgrounds",
  "title": "Conditional backgrounds",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DataTable",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "table-matrix-with-conditional-background-colors",
    "distinction": "The analytical-technique and table-family labels intentionally share one conditional-background recipe. Catalog label: Conditional backgrounds."
  },
  "source": {
    "module": "@/components/tables",
    "exportName": "DataTable"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/tables",
    "exportName": "DataTable",
    "clientOnly": true
  },
  "fixture": {
    "kind": "catalog",
    "ids": [
      "matrixRows"
    ]
  },
  "docs": {
    "slug": "conditional-backgrounds",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Conditional backgrounds",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "catalog-fixture",
    "consumer-data"
  ],
  "height": "auto"
},
{
  "id": "dynamic-titles",
  "title": "Dynamic titles",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DynamicTitle",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Primary catalog recipe for DynamicTitle."
  },
  "source": {
    "module": "@/components/overlays",
    "exportName": "DynamicTitle"
  },
  "dependencies": [
    "react",
    "recharts"
  ],
  "lazyLoader": {
    "module": "@/components/overlays",
    "exportName": "DynamicTitle",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-titles",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dynamic titles",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "dynamic-labels",
  "title": "Dynamic labels",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DynamicText",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "dynamic-data-bound-text",
    "distinction": "The visual-family and analytical-technique labels intentionally share one dynamic-text example. Catalog label: Dynamic labels."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "DynamicText"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "DynamicText",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-labels",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dynamic labels",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": "auto"
},
{
  "id": "dynamic-images",
  "title": "Dynamic images",
  "category": "Analytical and Formatting Techniques",
  "variant": null,
  "component": "DynamicImage",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "alias",
    "of": "dynamic-data-driven-image",
    "distinction": "The visual-family and analytical-technique labels intentionally share one dynamic-image example. Catalog label: Dynamic images."
  },
  "source": {
    "module": "@/components/shapes",
    "exportName": "DynamicImage"
  },
  "dependencies": [
    "react",
    "lucide-react"
  ],
  "lazyLoader": {
    "module": "@/components/shapes",
    "exportName": "DynamicImage",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "dynamic-images",
    "state": "draft"
  },
  "reference": {
    "kind": "chart-convention",
    "label": "Dynamic images",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "component-default-fixture"
  ],
  "height": 260
},
{
  "id": "page-measurement",
  "title": "Page measurement",
  "category": "Paginated Report Visualizations",
  "variant": "page-measurement",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "canonical",
    "distinction": "Measures physical paper, printable body, margins, and point-to-inch conversion."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "page-measurement",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Page measurement",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "explicit-page-breaks",
  "title": "Explicit page breaks",
  "category": "Paginated Report Visualizations",
  "variant": "explicit-page-breaks",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Starts a named detail row in a fresh flow frame without changing source order."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "explicit-page-breaks",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Explicit page breaks",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "repeated-table-headers",
  "title": "Repeated table headers",
  "category": "Paginated Report Visualizations",
  "variant": "repeated-table-headers",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Repeats the detail-column header on every continuation frame."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "repeated-table-headers",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Repeated table headers",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "group-headers",
  "title": "Group headers",
  "category": "Paginated Report Visualizations",
  "variant": "group-headers",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Creates one named section header before each geographic group."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "group-headers",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Group headers",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "nested-groups",
  "title": "Nested groups",
  "category": "Paginated Report Visualizations",
  "variant": "nested-groups",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Nests deterministic team headers beneath geographic group headers."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "nested-groups",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Nested groups",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "group-subtotals",
  "title": "Group subtotals",
  "category": "Paginated Report Visualizations",
  "variant": "group-subtotals",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Calculates quantity and amount subtotal rows independently per group."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "group-subtotals",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Group subtotals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "grand-total",
  "title": "Grand total",
  "category": "Paginated Report Visualizations",
  "variant": "grand-total",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Adds one report-level quantity and amount total after all detail rows."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "grand-total",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Grand total",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "running-totals",
  "title": "Running totals",
  "category": "Paginated Report Visualizations",
  "variant": "running-totals",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Displays a cumulative amount from the filtered and sorted row stream."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "running-totals",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Running totals",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "page-numbers",
  "title": "Page numbers",
  "category": "Paginated Report Visualizations",
  "variant": "page-numbers",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Labels generated pages as page n of the deterministic total page count."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "page-numbers",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Page numbers",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "first-and-last-page-sections",
  "title": "First and last page sections",
  "category": "Paginated Report Visualizations",
  "variant": "first-last-page-sections",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Uses distinct first-page context and last-page completion sections."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "first-and-last-page-sections",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "First and last page sections",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "keep-groups-together",
  "title": "Keep groups together",
  "category": "Paginated Report Visualizations",
  "variant": "keep-groups-together",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Moves a fitting group to a fresh frame when remaining space is insufficient."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "keep-groups-together",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Keep groups together",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "orphan-control",
  "title": "Orphan control",
  "category": "Paginated Report Visualizations",
  "variant": "orphan-control",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Requires three detail rows to remain with a newly placed group header."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "orphan-control",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Orphan control",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "nested-data-regions",
  "title": "Nested data regions",
  "category": "Paginated Report Visualizations",
  "variant": "nested-data-regions",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Places a measured matrix summary before the paginated detail region."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "nested-data-regions",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Nested data regions",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "subreport-region",
  "title": "Subreport region",
  "category": "Paginated Report Visualizations",
  "variant": "subreport-region",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Reserves measured flow space for an independently labeled nested subreport."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "subreport-region",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Subreport region",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "chart-data-region",
  "title": "Chart data region",
  "category": "Paginated Report Visualizations",
  "variant": "chart-data-region",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Renders a source-backed aggregate chart inside a measured report block."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "chart-data-region",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Chart data region",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "table-data-region",
  "title": "Table data region",
  "category": "Paginated Report Visualizations",
  "variant": "table-data-region",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Uses a fixed-column detail table as the primary paginated data region."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "table-data-region",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Table data region",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "matrix-data-region",
  "title": "Matrix data region",
  "category": "Paginated Report Visualizations",
  "variant": "matrix-data-region",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Cross-tabulates group and team amounts with row totals."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "matrix-data-region",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Matrix data region",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "list-data-region",
  "title": "List data region",
  "category": "Paginated Report Visualizations",
  "variant": "list-data-region",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Flows records as labeled list cards while retaining deterministic row heights."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "list-data-region",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "List data region",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "two-column-flow",
  "title": "Two-column flow",
  "category": "Paginated Report Visualizations",
  "variant": "two-column-flow",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Flows continuation frames into two physical columns before adding a page."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "two-column-flow",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Two-column flow",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "letter-landscape",
  "title": "Letter landscape",
  "category": "Paginated Report Visualizations",
  "variant": "letter-landscape",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Measures against a 792 by 612 point US Letter landscape page."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "letter-landscape",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Letter landscape",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "legal-portrait",
  "title": "Legal portrait",
  "category": "Paginated Report Visualizations",
  "variant": "legal-portrait",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Measures against a 612 by 1008 point US Legal portrait page."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "legal-portrait",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Legal portrait",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "custom-page-size",
  "title": "Custom page size",
  "category": "Paginated Report Visualizations",
  "variant": "custom-page-size",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Uses an explicit 420 by 595 point page and custom margins."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "custom-page-size",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Custom page size",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "print-margin-guide",
  "title": "Print margin guide",
  "category": "Paginated Report Visualizations",
  "variant": "print-margin-guide",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Displays the printable boundary separately from paper edges and body content."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "print-margin-guide",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Print margin guide",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "report-header-and-footer",
  "title": "Report header and footer",
  "category": "Paginated Report Visualizations",
  "variant": "report-header-footer",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Reserves non-flowing page header and footer bands around each body frame."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "report-header-and-footer",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Report header and footer",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "conditional-group-page-breaks",
  "title": "Conditional group page breaks",
  "category": "Paginated Report Visualizations",
  "variant": "conditional-group-breaks",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Starts selected named groups on fresh pages while others flow naturally."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "conditional-group-page-breaks",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Conditional group page breaks",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "deterministic-sort-and-group",
  "title": "Deterministic sort and group",
  "category": "Paginated Report Visualizations",
  "variant": "deterministic-sort-group",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Sorts by group, subgroup, and label with original-position tie breaking."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "deterministic-sort-and-group",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Deterministic sort and group",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "parameter-and-filter-summary",
  "title": "Parameter and filter summary",
  "category": "Paginated Report Visualizations",
  "variant": "parameter-filter-summary",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Filters rows and records the active rule in a measured summary block."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "parameter-and-filter-summary",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Parameter and filter summary",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "document-map",
  "title": "Document map",
  "category": "Paginated Report Visualizations",
  "variant": "document-map",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Builds a navigable group outline targeting stable report section anchors."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "document-map",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Document map",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "drillthrough-links",
  "title": "Drillthrough links",
  "category": "Paginated Report Visualizations",
  "variant": "drillthrough-links",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Uses caller-supplied row destinations instead of inventing navigation targets."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "drillthrough-links",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Drillthrough links",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "monochrome-print-style",
  "title": "Monochrome print style",
  "category": "Paginated Report Visualizations",
  "variant": "monochrome-print-style",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Applies high-contrast monochrome styling without changing pagination."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "monochrome-print-style",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Monochrome print style",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "pdf-export-layout-preview",
  "title": "PDF export layout preview",
  "category": "Paginated Report Visualizations",
  "variant": "pdf-export-layout-preview",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Previews fixed page boxes and reserved bands without claiming a PDF-render baseline."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "pdf-export-layout-preview",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "PDF export layout preview",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
},
{
  "id": "accessible-reading-order",
  "title": "Accessible reading order",
  "category": "Paginated Report Visualizations",
  "variant": "accessible-reading-order",
  "component": "PaginatedReport",
  "status": "review",
  "statusNote": "A backing component exists, but this catalog entry has not completed verification.",
  "semantic": {
    "kind": "variant",
    "of": "page-measurement",
    "distinction": "Exposes pages, columns, headers, details, and totals in deterministic DOM order."
  },
  "source": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport"
  },
  "dependencies": [
    "react"
  ],
  "lazyLoader": {
    "module": "@/components/reports",
    "exportName": "PaginatedReport",
    "clientOnly": true
  },
  "fixture": {
    "kind": "component-default",
    "ids": []
  },
  "docs": {
    "slug": "accessible-reading-order",
    "state": "draft"
  },
  "reference": {
    "kind": "power-bi",
    "label": "Accessible reading order",
    "state": "catalog-label"
  },
  "capabilities": [
    "themed",
    "visualization",
    "responsive-container",
    "consumer-data",
    "component-default-fixture"
  ],
  "height": 480
}
] as const satisfies readonly CatalogManifestEntry[];

export type CatalogManifestId = (typeof catalogManifest)[number]["id"];

export const catalogManifestById = Object.fromEntries(
  catalogManifest.map((entry) => [entry.id, entry]),
) as Record<CatalogManifestId, (typeof catalogManifest)[number]>;
