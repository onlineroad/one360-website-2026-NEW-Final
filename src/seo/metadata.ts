import type { Metadata } from "next";

import type { PageContent, SiteConfig } from "@/types/content";

export function buildPageMetadata(page: PageContent, site: SiteConfig): Metadata {
  const canonical = page.seo.canonical || `${site.siteUrl}${page.route}`;

  return {
    title: page.seo.title,
    description: page.seo.description,
    robots: page.noindex ? "noindex, nofollow" : page.seo.robots ?? "index, follow",
    alternates: {
      canonical
    },
    openGraph: {
      type: "website",
      title: page.seo.title,
      description: page.seo.description,
      url: canonical,
      siteName: site.siteName,
      images: page.seo.ogImage
        ? [
            {
              url: page.seo.ogImage
            }
          ]
        : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: page.seo.title,
      description: page.seo.description,
      images: page.seo.ogImage ? [page.seo.ogImage] : undefined
    }
  };
}
