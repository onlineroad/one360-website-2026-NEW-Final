import type { PageContent, SiteConfig } from "@/types/content";
import { createBreadcrumbSchema, createFaqSchema, createLocalBusinessSchema } from "@/seo/schema";
import { stripDetailsFromContent } from "@/utils/html";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CtaBanner } from "@/components/CtaBanner";
import { FaqAccordion } from "@/components/FaqAccordion";
import { Hero } from "@/components/Hero";
import { HubspotFormEmbed } from "@/components/HubspotFormEmbed";
import { JsonLd } from "@/components/JsonLd";
import { MediaGallery } from "@/components/MediaGallery";
import { RichContent } from "@/components/RichContent";
import { ServiceCards } from "@/components/ServiceCards";
import { Testimonials } from "@/components/Testimonials";
import { TrustStrip } from "@/components/TrustStrip";

interface PageTemplateProps {
  page: PageContent;
  site: SiteConfig;
}

const serviceCardSummaries: Record<string, string> = {
  "/360-video-booth-hire/": "Ultimate slow-motion 360 video booth experience for events.",
  "/glambot-hire/": "Cinematic glam-style motion capture for premium events.",
  "/one360-revolve-green-screen-hire/": "Custom green screen backgrounds for immersive branded content."
};

function isHome(route: string): boolean {
  return route === "/";
}

function shouldIncludeLocalBusiness(route: string): boolean {
  return ["/", "/book/", "/corporate-photo-booth-hire/", "/brand-activations-sydney/"].includes(
    route
  );
}

export function PageTemplate({ page, site }: PageTemplateProps) {
  const faqSchema = createFaqSchema(page.faq);
  const breadcrumbSchema = createBreadcrumbSchema(page, site);
  const localBusinessSchema = shouldIncludeLocalBusiness(page.route)
    ? createLocalBusinessSchema(site)
    : null;

  const serviceMenu = site.nav.find((item) => item.label.toLowerCase() === "services");
  const serviceCards =
    serviceMenu?.children?.map((child) => ({
      label: child.label,
      href: child.href,
      summary: serviceCardSummaries[child.href] ?? "Discover this ONE360 service."
    })) ?? [];

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}
      {localBusinessSchema ? <JsonLd data={localBusinessSchema} /> : null}

      <Hero title={page.h1} eyebrow={page.eyebrow} intro={page.intro} />
      <Breadcrumbs items={page.breadcrumbs} />

      {isHome(page.route) ? <ServiceCards items={serviceCards} /> : null}

      <RichContent html={stripDetailsFromContent(page.contentHtml)} />
      {page.templateType === "service" || page.templateType === "landing" ? <TrustStrip /> : null}
      <MediaGallery media={page.media} title="Gallery" />
      <Testimonials items={page.testimonials ?? []} />

      {page.hasHubspotForm ? <HubspotFormEmbed /> : null}
      {!page.hasHubspotForm && page.route !== "/thank-you/" ? <CtaBanner /> : null}

      <FaqAccordion items={page.faq} />
    </>
  );
}
