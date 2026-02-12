import type { FaqItem, PageContent, SiteConfig } from "@/types/content";

export function createLocalBusinessSchema(site: SiteConfig): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.siteName,
    url: site.siteUrl,
    image: `${site.siteUrl}${site.logo}`,
    telephone: site.contact.phoneDisplay,
    email: site.contact.email,
    areaServed: ["Sydney", "Melbourne", "Brisbane"],
    sameAs: site.socials.map((social) => social.href)
  };
}

export function createBreadcrumbSchema(page: PageContent, site: SiteConfig): Record<string, unknown> {
  const items = page.breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.label,
    item: `${site.siteUrl}${crumb.href}`.replace(/([^:]\/)\/+/, "$1")
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items
  };
}

export function createFaqSchema(faq: FaqItem[]): Record<string, unknown> | null {
  if (faq.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
