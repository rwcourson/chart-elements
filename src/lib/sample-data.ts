export const salesByRegion = [
  { name: "North", sales: 420, target: 400, profit: 120 },
  { name: "South", sales: 380, target: 360, profit: 95 },
  { name: "East", sales: 510, target: 480, profit: 160 },
  { name: "West", sales: 290, target: 320, profit: 70 },
  { name: "Central", sales: 450, target: 420, profit: 130 },
];

export const stackedSeries = [
  { name: "Jan", product: 120, service: 80, other: 40 },
  { name: "Feb", product: 140, service: 90, other: 35 },
  { name: "Mar", product: 160, service: 100, other: 50 },
  { name: "Apr", product: 130, service: 110, other: 45 },
  { name: "May", product: 180, service: 120, other: 55 },
  { name: "Jun", product: 200, service: 130, other: 60 },
];

export const timeSeries = [
  { date: "Jan", revenue: 4200, cost: 2800, forecast: 4000 },
  { date: "Feb", revenue: 4800, cost: 3000, forecast: 4500 },
  { date: "Mar", revenue: 5100, cost: 3200, forecast: 4900 },
  { date: "Apr", revenue: 4600, cost: 3100, forecast: 5000 },
  { date: "May", revenue: 5600, cost: 3400, forecast: 5400 },
  { date: "Jun", revenue: 6100, cost: 3600, forecast: 5800 },
  { date: "Jul", revenue: 5900, cost: 3500, forecast: 6000 },
  { date: "Aug", revenue: 6400, cost: 3700, forecast: 6200 },
];

export const waterfallData = [
  { name: "Start", value: 1000, type: "total" as const },
  { name: "Sales", value: 420, type: "increase" as const },
  { name: "Returns", value: -80, type: "decrease" as const },
  { name: "Marketing", value: -120, type: "decrease" as const },
  { name: "Ops", value: -90, type: "decrease" as const },
  { name: "Other", value: 40, type: "increase" as const },
  { name: "End", value: 1170, type: "total" as const },
];

export const partToWhole = [
  { name: "Enterprise", value: 38 },
  { name: "Mid-market", value: 27 },
  { name: "SMB", value: 22 },
  { name: "Consumer", value: 13 },
];

export const funnelStages = [
  { name: "Leads", value: 1200 },
  { name: "Qualified", value: 780 },
  { name: "Proposal", value: 420 },
  { name: "Negotiation", value: 210 },
  { name: "Closed", value: 96 },
];

export const scatterPoints = Array.from({ length: 40 }, (_, i) => ({
  x: 20 + ((i * 17) % 80),
  y: 15 + ((i * 23) % 70),
  z: 8 + ((i * 11) % 40),
  category: ["A", "B", "C"][i % 3]!,
  name: `P${i + 1}`,
}));

export const treemapData = [
  {
    name: "Products",
    children: [
      { name: "Hardware", size: 120 },
      { name: "Software", size: 180 },
      { name: "Services", size: 95 },
    ],
  },
  {
    name: "Regions",
    children: [
      { name: "Americas", size: 160 },
      { name: "EMEA", size: 140 },
      { name: "APAC", size: 110 },
    ],
  },
];

export const kpiMetrics = [
  { label: "Revenue", value: 2.4e6, delta: 0.12, target: 2.2e6 },
  { label: "Orders", value: 18420, delta: 0.048, target: 18000 },
  { label: "AOV", value: 132.4, delta: -0.02, target: 135 },
  { label: "NPS", value: 62, delta: 0.05, target: 60 },
];

export const matrixRows = [
  { region: "North", q1: 120, q2: 140, q3: 155, q4: 170 },
  { region: "South", q1: 90, q2: 100, q3: 110, q4: 125 },
  { region: "East", q1: 150, q2: 160, q3: 175, q4: 190 },
  { region: "West", q1: 80, q2: 95, q3: 105, q4: 115 },
];

export const ohlc = [
  { date: "Mon", open: 100, high: 112, low: 96, close: 108 },
  { date: "Tue", open: 108, high: 118, low: 104, close: 110 },
  { date: "Wed", open: 110, high: 115, low: 100, close: 102 },
  { date: "Thu", open: 102, high: 120, low: 101, close: 118 },
  { date: "Fri", open: 118, high: 125, low: 112, close: 122 },
];

export const distribution = Array.from({ length: 80 }, (_, i) => {
  const u = (i / 80) * 6 - 3;
  // Deterministic jitter (avoid Math.random for SSR hydration)
  const jitter = ((i * 17) % 10) * 0.4;
  return { x: u, y: Math.exp(-0.5 * u * u) * 40 + jitter };
});

export const ganttTasks = [
  { id: "1", name: "Discovery", start: 0, end: 3, lane: 0 },
  { id: "2", name: "Design", start: 2, end: 6, lane: 1 },
  { id: "3", name: "Build", start: 5, end: 12, lane: 2 },
  { id: "4", name: "QA", start: 10, end: 14, lane: 1 },
  { id: "5", name: "Launch", start: 13, end: 15, lane: 0 },
];

export const sankeyNodes = [
  { name: "Website" },
  { name: "Ads" },
  { name: "Partners" },
  { name: "Trial" },
  { name: "Paid" },
  { name: "Churned" },
];

export const sankeyLinks = [
  { source: 0, target: 3, value: 40 },
  { source: 1, target: 3, value: 30 },
  { source: 2, target: 3, value: 20 },
  { source: 3, target: 4, value: 55 },
  { source: 3, target: 5, value: 35 },
];

export const calendarHeat = Array.from({ length: 84 }, (_, i) => ({
  day: i,
  value: (i * 7 + 3) % 12,
}));

export const words = [
  { text: "revenue", value: 64 },
  { text: "growth", value: 48 },
  { text: "retention", value: 42 },
  { text: "pipeline", value: 38 },
  { text: "conversion", value: 35 },
  { text: "churn", value: 28 },
  { text: "NPS", value: 26 },
  { text: "CAC", value: 22 },
  { text: "LTV", value: 30 },
  { text: "margin", value: 24 },
];
