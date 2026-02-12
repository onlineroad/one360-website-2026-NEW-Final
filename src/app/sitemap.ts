import type { MetadataRoute } from "next";

import { getRouteManifest, getSiteConfig } from "@/utils/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [manifest, site] = await Promise.all([getRouteManifest(), getSiteConfig()]);

  return manifest.routes
    .filter((entry) => !entry.noindex)
    .map((entry) => ({
      url: `${site.siteUrl}${entry.route}`,
      changeFrequency: entry.changefreq,
      priority: entry.priority,
      lastModified: new Date()
    }));
}
