#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { load } from "cheerio";

const SITE_URL = "https://one360.com.au";
const SITEMAPS = [
  `${SITE_URL}/page-sitemap.xml`,
  `${SITE_URL}/post-sitemap.xml`,
  `${SITE_URL}/category-sitemap.xml`
];
const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "src", "data");
const PAGES_DIR = path.join(DATA_DIR, "pages");

const INCLUDED_ROUTES = [
  "/",
  "/wedding-car-hire-sydney/",
  "/glambot-hire/",
  "/brand-activations-sydney/",
  "/corporate-photo-booth-hire/",
  "/melbourne-360-video-booth-hire/",
  "/sydney-360-video-booth-hire/",
  "/locations/",
  "/one360-revolve-green-screen-hire/",
  "/360-video-booth-hire/",
  "/book/",
  "/360-photo-booth-hire-sydney/",
  "/thank-you/",
  "/sample-page/",
  "/blogs/",
  "/how-ai-tools-are-revolutionising-event-content-creation-in-australia/",
  "/360-photo-booth-vs-traditional-photo-booth/",
  "/how-one360-powered-onegos-smart-learning-launch/",
  "/experience-the-ultimate-glambot-hire-in-sydney/",
  "/why-glambot-is-the-ultimate-showstopper-for-your-next-event/",
  "/birthday-celebrations-with-360-photo-booth-video-booth/",
  "/elevate-your-event-with-360-video-booth-photo-booth-hire-in-sydney/"
];

const NOINDEX_ROUTES = new Set(["/thank-you/", "/sample-page/"]);

function normalizeRoute(route) {
  if (!route.startsWith("/")) {
    return `/${route}`;
  }
  if (route !== "/" && !route.endsWith("/")) {
    return `${route}/`;
  }
  return route;
}

function routeToId(route) {
  if (route === "/") {
    return "home";
  }
  return route.replace(/^\//, "").replace(/\/$/, "").replace(/\//g, "-");
}

function decode(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#8217;", "’")
    .replaceAll("&#8211;", "-")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&#160;", " ")
    .trim();
}

function classifyTemplate(route) {
  const blogRoutes = new Set([
    "/blogs/",
    "/how-ai-tools-are-revolutionising-event-content-creation-in-australia/",
    "/360-photo-booth-vs-traditional-photo-booth/",
    "/how-one360-powered-onegos-smart-learning-launch/",
    "/experience-the-ultimate-glambot-hire-in-sydney/",
    "/why-glambot-is-the-ultimate-showstopper-for-your-next-event/",
    "/birthday-celebrations-with-360-photo-booth-video-booth/",
    "/elevate-your-event-with-360-video-booth-photo-booth-hire-in-sydney/"
  ]);

  const utilityRoutes = new Set(["/book/", "/thank-you/", "/sample-page/", "/locations/"]);

  if (route === "/") return "landing";
  if (blogRoutes.has(route)) return "blog";
  if (utilityRoutes.has(route)) return "utility";
  return "service";
}

function cleanMain($, route) {
  const main = $("main").first();
  if (!main.length) {
    return route === "/locations/"
      ? `<section><h2>Locations</h2><p>ONE360 services Sydney, Melbourne and Brisbane.</p><p><a href="/sydney-360-video-booth-hire/">Sydney</a> | <a href="/melbourne-360-video-booth-hire/">Melbourne</a> | Brisbane</p></section>`
      : "";
  }

  main.find("script, style, noscript, iframe").remove();
  main.find("[data-src]").each((_, el) => {
    const value = $(el).attr("data-src");
    if (value) {
      $(el).attr("src", value);
    }
    $(el).removeAttr("data-src");
  });
  main.find("[data-srcset]").each((_, el) => {
    const value = $(el).attr("data-srcset");
    if (value) {
      $(el).attr("srcset", value);
    }
    $(el).removeAttr("data-srcset");
  });

  return main.html() ?? "";
}

function extractFaq($) {
  const items = [];
  $("main details").each((_, details) => {
    const summary = decode($(details).find("summary").first().text());
    const answerText = decode(
      $(details)
        .clone()
        .find("summary")
        .remove()
        .end()
        .text()
    );

    if (summary && answerText) {
      items.push({ question: summary, answer: answerText });
    }
  });
  return items;
}

function resolveOne360Url(url = "") {
  if (!url) return "";
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${SITE_URL}${url}`;
  return url;
}

function extractMedia($) {
  const media = [];
  const seen = new Set();

  $("main img").each((_, img) => {
    const src = resolveOne360Url($(img).attr("src") || $(img).attr("data-src") || "");
    if (!src || seen.has(src)) return;
    seen.add(src);
    media.push({
      sourceUrl: src,
      localOriginal: null,
      alt: decode($(img).attr("alt") || ""),
      variants: []
    });
  });

  $("main a[href], main source[src], main video[src]").each((_, element) => {
    const raw = $(element).attr("href") || $(element).attr("src") || "";
    const src = resolveOne360Url(raw);
    if (!/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(src)) return;
    if (seen.has(src)) return;
    seen.add(src);
    media.push({
      sourceUrl: src,
      localOriginal: null,
      alt: "",
      variants: []
    });
  });

  return media;
}

function extractInternalLinks($) {
  const links = new Set();
  $("main a[href]").each((_, link) => {
    const hrefRaw = $(link).attr("href") || "";
    if (!hrefRaw || hrefRaw.startsWith("#")) return;

    let href = hrefRaw;
    if (href.startsWith(SITE_URL)) {
      href = href.replace(SITE_URL, "");
    }
    if (!href.startsWith("/")) return;

    href = href.split("#")[0].split("?")[0];
    if (!href) return;
    links.add(normalizeRoute(href));
  });

  return Array.from(links);
}

function extractTestimonials($) {
  const testimonials = [];
  $("main blockquote").each((_, block) => {
    const quote = decode($(block).text());
    if (quote) {
      testimonials.push({ quote, author: "" });
    }
  });
  return testimonials;
}

function buildBreadcrumbs(route, h1) {
  if (route === "/") {
    return [{ label: "Home", href: "/" }];
  }

  const isBlogPost =
    route !== "/blogs/" &&
    [
      "/how-ai-tools-are-revolutionising-event-content-creation-in-australia/",
      "/360-photo-booth-vs-traditional-photo-booth/",
      "/how-one360-powered-onegos-smart-learning-launch/",
      "/experience-the-ultimate-glambot-hire-in-sydney/",
      "/why-glambot-is-the-ultimate-showstopper-for-your-next-event/",
      "/birthday-celebrations-with-360-photo-booth-video-booth/",
      "/elevate-your-event-with-360-video-booth-photo-booth-hire-in-sydney/"
    ].includes(route);

  if (isBlogPost) {
    return [
      { label: "Home", href: "/" },
      { label: "Blogs", href: "/blogs/" },
      { label: h1, href: route }
    ];
  }

  return [
    { label: "Home", href: "/" },
    { label: h1, href: route }
  ];
}

async function scrapeRoute(route) {
  const normalized = normalizeRoute(route);
  const response = await fetch(`${SITE_URL}${normalized}`);
  const html = await response.text();
  const $ = load(html);

  const title = decode($("head title").first().text());
  const description = decode($("meta[name='description']").attr("content") || "");
  const canonical =
    $("link[rel='canonical']").attr("href") || `${SITE_URL}${normalized}`;

  const mainHtml = cleanMain($, normalized);
  const h1 =
    decode($("main h1").first().text()) || title.replace(/\s*[-|].*$/, "") || "ONE360";
  const eyebrow = decode($("main h2").first().text()) || null;
  const intro = decode($("main p").first().text()) || null;
  const faq = extractFaq($);
  const media = extractMedia($);
  const internalLinks = extractInternalLinks($);
  const testimonials = extractTestimonials($);
  const hasHubspotForm = html.includes("hbspt.forms.create");

  return {
    id: routeToId(normalized),
    route: normalized,
    templateType: classifyTemplate(normalized),
    noindex: NOINDEX_ROUTES.has(normalized),
    seo: {
      title,
      description: description || title,
      canonical,
      robots: NOINDEX_ROUTES.has(normalized) ? "noindex, nofollow" : "index, follow"
    },
    h1,
    eyebrow,
    intro,
    contentHtml: mainHtml,
    media,
    faq,
    testimonials,
    breadcrumbs: buildBreadcrumbs(normalized, h1),
    internalLinks,
    hasHubspotForm
  };
}

async function main() {
  await mkdir(PAGES_DIR, { recursive: true });

  const routesPath = path.join(DATA_DIR, "routes.json");
  const routes = JSON.parse(await readFile(routesPath, "utf-8"));

  const routesFromSitemaps = new Set();
  for (const sitemapUrl of SITEMAPS) {
    const xml = await fetch(sitemapUrl).then((response) => response.text());
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const match of matches) {
      const loc = match[1];
      if (!loc.startsWith(SITE_URL)) continue;
      const route = normalizeRoute(loc.replace(SITE_URL, ""));
      routesFromSitemaps.add(route);
    }
  }

  const selectedRoutes = INCLUDED_ROUTES.filter((route) => routesFromSitemaps.has(route));
  const scrapeRoutes = selectedRoutes.length > 0 ? selectedRoutes : INCLUDED_ROUTES;

  const results = [];
  for (const route of scrapeRoutes) {
    const page = await scrapeRoute(route);
    results.push(page);

    const fileName = `${page.id}.json`;
    await writeFile(path.join(PAGES_DIR, fileName), `${JSON.stringify(page, null, 2)}\n`, "utf-8");

    const manifestEntry = routes.routes.find((entry) => entry.route === route);
    if (manifestEntry) {
      manifestEntry.pageFile = fileName;
      manifestEntry.id = page.id;
      manifestEntry.noindex = page.noindex;
    }
  }

  await writeFile(routesPath, `${JSON.stringify(routes, null, 2)}\n`, "utf-8");

  console.log(`Scraped ${results.length} routes into ${PAGES_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
