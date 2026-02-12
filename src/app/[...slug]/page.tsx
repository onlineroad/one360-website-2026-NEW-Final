import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/PageTemplate";
import { buildPageMetadata } from "@/seo/metadata";
import { getPageByRoute, getRouteManifest, getSiteConfig } from "@/utils/content";
import { normalizeRoute, routeToSlugSegments, slugSegmentsToRoute } from "@/utils/routes";

interface RoutePageProps {
  params: Promise<{ slug: string[] }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const manifest = await getRouteManifest();
  return manifest.routes
    .map((entry) => normalizeRoute(entry.route))
    .filter((route) => route !== "/")
    .map((route) => ({ slug: routeToSlugSegments(route) }));
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = slugSegmentsToRoute(slug);

  const [site, page] = await Promise.all([getSiteConfig(), getPageByRoute(route)]);

  if (!page) {
    return {};
  }

  return buildPageMetadata(page, site);
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;
  const route = slugSegmentsToRoute(slug);

  const [site, page] = await Promise.all([getSiteConfig(), getPageByRoute(route)]);

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} site={site} />;
}
