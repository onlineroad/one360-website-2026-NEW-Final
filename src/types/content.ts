export type JsonLd = Record<string, unknown>;

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  isCta?: boolean;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface ContactInfo {
  phoneRaw: string;
  phoneDisplay: string;
  email: string;
  locationsLine: string;
}

export interface SiteConfig {
  siteUrl: string;
  siteName: string;
  logo: string;
  nav: NavItem[];
  socials: SocialLink[];
  contact: ContactInfo;
  footerDescription: string;
}

export interface SeoMeta {
  title: string;
  description: string;
  canonical: string;
  robots?: string;
  ogImage?: string;
}

export interface MediaVariant {
  url: string;
  width: number;
  height?: number;
  format: string;
}

export interface MediaAsset {
  sourceUrl: string;
  localOriginal?: string;
  alt: string;
  width?: number;
  height?: number;
  variants?: MediaVariant[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  author?: string;
}

export interface PageContent {
  id: string;
  route: string;
  templateType: "service" | "blog" | "landing" | "utility";
  noindex?: boolean;
  seo: SeoMeta;
  h1: string;
  eyebrow?: string;
  heroImage?: MediaAsset;
  intro?: string;
  contentHtml: string;
  media: MediaAsset[];
  faq: FaqItem[];
  testimonials?: Testimonial[];
  breadcrumbs: { label: string; href: string }[];
  internalLinks: string[];
  hasHubspotForm?: boolean;
}

export interface RouteManifestEntry {
  id: string;
  route: string;
  pageFile: string;
  noindex: boolean;
  priority: number;
  changefreq: "daily" | "weekly" | "monthly";
}

export interface RouteManifest {
  routes: RouteManifestEntry[];
  excludedRoutes: string[];
}
