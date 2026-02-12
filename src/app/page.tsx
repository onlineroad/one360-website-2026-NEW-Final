import { notFound } from "next/navigation";

import { PageTemplate } from "@/components/PageTemplate";
import { buildPageMetadata } from "@/seo/metadata";
import { getPageByRoute, getSiteConfig } from "@/utils/content";

export async function generateMetadata() {
  const [site, page] = await Promise.all([getSiteConfig(), getPageByRoute("/")]);

  if (!page) {
    return {};
  }

  return buildPageMetadata(page, site);
}

export default async function HomePage() {
  const [site, page] = await Promise.all([getSiteConfig(), getPageByRoute("/")]);

  if (!page) {
    notFound();
  }

  return <PageTemplate page={page} site={site} />;
}
