import type { PaginatedReportRow } from "./pagination";

const REGIONS = [
  { group: "North", base: 31_000 },
  { group: "Central", base: 27_500 },
  { group: "South", base: 25_000 },
  { group: "West", base: 34_500 },
] as const;

const ACCOUNTS = [
  { subgroup: "Enterprise", label: "Atlas Manufacturing", quantity: 18, offset: 8_400 },
  { subgroup: "Enterprise", label: "Beacon Health", quantity: 14, offset: 5_200 },
  { subgroup: "Enterprise", label: "Crescent Retail", quantity: 21, offset: 10_100 },
  { subgroup: "Field", label: "Delta Services", quantity: 11, offset: 2_900 },
  { subgroup: "Field", label: "Evergreen Foods", quantity: 16, offset: 6_300 },
  { subgroup: "Field", label: "Foundry Logistics", quantity: 9, offset: 1_700 },
] as const;

export const DEFAULT_PAGINATED_REPORT_ROWS = REGIONS.flatMap((region, regionIndex) =>
  ACCOUNTS.map((account, accountIndex) => {
    const slug = `${region.group.toLowerCase()}-${account.subgroup.toLowerCase()}-${(accountIndex % 3) + 1}`;
    return {
      id: slug,
      group: region.group,
      subgroup: account.subgroup,
      label: account.label,
      quantity: account.quantity + regionIndex,
      amount: region.base + account.offset + regionIndex * 1_250,
      date: `2026-${String(regionIndex * 2 + Math.floor(accountIndex / 3) + 1).padStart(2, "0")}-15`,
      href: `#report-row-${slug}`,
    };
  }),
) satisfies readonly PaginatedReportRow[];
