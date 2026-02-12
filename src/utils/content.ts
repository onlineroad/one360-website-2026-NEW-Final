import { promises as fs } from "node:fs";
import path from "node:path";

import type { PageContent, RouteManifest, SiteConfig } from "@/types/content";
import { normalizeRoute } from "@/utils/routes";

const dataDir = path.join(process.cwd(), "src", "data");
const pagesDir = path.join(dataDir, "pages");

let siteConfigCache: SiteConfig | null = null;
let manifestCache: RouteManifest | null = null;
let pagesCache: Map<string, PageContent> | null = null;

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (siteConfigCache) {
    return siteConfigCache;
  }

  siteConfigCache = await readJson<SiteConfig>(path.join(dataDir, "site.json"));
  return siteConfigCache;
}

export async function getRouteManifest(): Promise<RouteManifest> {
  if (manifestCache) {
    return manifestCache;
  }

  manifestCache = await readJson<RouteManifest>(path.join(dataDir, "routes.json"));
  return manifestCache;
}

export async function getAllPages(): Promise<PageContent[]> {
  if (pagesCache) {
    return Array.from(pagesCache.values());
  }

  const manifest = await getRouteManifest();
  const pageFiles = manifest.routes.map((route) => route.pageFile);

  const loaded = await Promise.all(
    pageFiles.map(async (pageFile) => {
      const page = await readJson<PageContent>(path.join(pagesDir, pageFile));
      return [normalizeRoute(page.route), page] as const;
    })
  );

  pagesCache = new Map(loaded);
  return Array.from(pagesCache.values());
}

export async function getPageByRoute(route: string): Promise<PageContent | undefined> {
  const normalized = normalizeRoute(route);
  const pages = await getAllPages();
  return pages.find((page) => normalizeRoute(page.route) === normalized);
}

export async function getIndexablePages(): Promise<PageContent[]> {
  const pages = await getAllPages();
  return pages.filter((page) => !page.noindex);
}
