import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalogManifest, catalogManifestById } from "@/registry/catalog-manifest";
import type { CatalogManifestId } from "@/registry/catalog-manifest";
import { VisualDetailClient } from "./visual-detail-client";

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogManifest.map((entry) => ({ visualId: entry.id }));
}

function isCatalogId(value: string): value is CatalogManifestId {
  return Object.prototype.hasOwnProperty.call(catalogManifestById, value);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ visualId: string }>;
}): Promise<Metadata> {
  const { visualId } = await params;
  if (!isCatalogId(visualId)) return {};
  const entry = catalogManifestById[visualId];
  return {
    title: `${entry.title} · Chart Elements`,
    description: entry.semantic.distinction,
  };
}

export default async function VisualDetailPage({
  params,
}: {
  params: Promise<{ visualId: string }>;
}) {
  const { visualId } = await params;
  if (!isCatalogId(visualId)) notFound();
  return <VisualDetailClient visualId={visualId} />;
}
