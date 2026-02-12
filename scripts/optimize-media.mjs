#!/usr/bin/env node
import crypto from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

const ROOT = process.cwd();
const DATA_PAGES_DIR = path.join(ROOT, "src", "data", "pages");
const MEDIA_MANIFEST_PATH = path.join(ROOT, "src", "data", "media-manifest.json");
const PUBLIC_IMAGES_DIR = path.join(ROOT, "public", "images");
const RAW_DIR = path.join(PUBLIC_IMAGES_DIR, "raw");
const ALLOWED_PREFIX = "https://one360.com.au/wp-content/uploads/";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov", ".m4v"]);
const WIDTHS = [480, 768, 1200];

function parseExtension(url) {
  const clean = url.split("?")[0].toLowerCase();
  return path.extname(clean);
}

function hash(input) {
  return crypto.createHash("sha1").update(input).digest("hex").slice(0, 10);
}

function safeBaseName(sourceUrl) {
  const clean = sourceUrl.split("?")[0];
  const base = path.basename(clean).replace(/[^a-zA-Z0-9._-]+/g, "-");
  const suffix = hash(sourceUrl);
  const ext = path.extname(base);
  const name = ext ? base.slice(0, -ext.length) : base;
  return `${name}-${suffix}`;
}

async function fetchToBuffer(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function readPages() {
  const files = await readdir(DATA_PAGES_DIR);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));

  const entries = await Promise.all(
    jsonFiles.map(async (file) => {
      const filePath = path.join(DATA_PAGES_DIR, file);
      const page = JSON.parse(await readFile(filePath, "utf-8"));
      return { file, filePath, page };
    })
  );

  return entries;
}

function extractMediaUrlsFromHtml(html = "") {
  const urls = new Set();
  const regex = /(src|href)=["']([^"']+)["']/gi;
  let match = regex.exec(html);
  while (match) {
    const raw = match[2];
    if (raw.startsWith(ALLOWED_PREFIX)) {
      urls.add(raw);
    }
    match = regex.exec(html);
  }
  return Array.from(urls);
}

async function main() {
  await mkdir(PUBLIC_IMAGES_DIR, { recursive: true });
  await mkdir(RAW_DIR, { recursive: true });

  const pageEntries = await readPages();
  const sourceUrls = new Set();

  for (const { page } of pageEntries) {
    for (const media of page.media || []) {
      if (typeof media.sourceUrl === "string" && media.sourceUrl.startsWith(ALLOWED_PREFIX)) {
        sourceUrls.add(media.sourceUrl);
      }
    }

    const urlsFromHtml = extractMediaUrlsFromHtml(page.contentHtml || "");
    for (const url of urlsFromHtml) {
      sourceUrls.add(url);
    }
  }

  const manifestAssets = [];
  const sourceToLocal = new Map();

  for (const sourceUrl of sourceUrls) {
    const ext = parseExtension(sourceUrl);
    const basename = safeBaseName(sourceUrl);

    if (![...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS].includes(ext)) {
      continue;
    }

    const buffer = await fetchToBuffer(sourceUrl);
    const rawFile = `${basename}${ext}`;
    const rawPath = path.join(RAW_DIR, rawFile);
    await writeFile(rawPath, buffer);

    if (VIDEO_EXTENSIONS.has(ext)) {
      const publicPath = `/images/${rawFile}`;
      await writeFile(path.join(PUBLIC_IMAGES_DIR, rawFile), buffer);

      sourceToLocal.set(sourceUrl, publicPath);
      manifestAssets.push({
        sourceUrl,
        localOriginal: publicPath,
        variants: []
      });
      continue;
    }

    const image = sharp(buffer);
    const metadata = await image.metadata();

    const originalPath = `/images/${rawFile}`;
    await writeFile(path.join(PUBLIC_IMAGES_DIR, rawFile), buffer);

    const variants = [];

    for (const width of WIDTHS) {
      if (metadata.width && metadata.width < width) {
        continue;
      }

      const webpFile = `${basename}-${width}.webp`;
      const fallbackFile = `${basename}-${width}${ext}`;

      const webpPath = path.join(PUBLIC_IMAGES_DIR, webpFile);
      const fallbackPath = path.join(PUBLIC_IMAGES_DIR, fallbackFile);

      await image.resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(webpPath);
      await image.resize({ width, withoutEnlargement: true }).toFile(fallbackPath);

      variants.push({
        format: "webp",
        width,
        url: `/images/${webpFile}`
      });
      variants.push({
        format: ext.replace(".", ""),
        width,
        url: `/images/${fallbackFile}`
      });
    }

    sourceToLocal.set(sourceUrl, originalPath);
    manifestAssets.push({
      sourceUrl,
      localOriginal: originalPath,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      variants
    });
  }

  for (const entry of pageEntries) {
    const page = entry.page;

    page.media = (page.media || []).map((media) => {
      const local = sourceToLocal.get(media.sourceUrl);
      const manifest = manifestAssets.find((asset) => asset.sourceUrl === media.sourceUrl);
      return {
        ...media,
        localOriginal: local ?? media.localOriginal ?? null,
        variants: manifest?.variants ?? media.variants ?? []
      };
    });

    if (typeof page.contentHtml === "string") {
      for (const [sourceUrl, localUrl] of sourceToLocal.entries()) {
        page.contentHtml = page.contentHtml.split(sourceUrl).join(localUrl);
      }
    }

    await writeFile(entry.filePath, `${JSON.stringify(page, null, 2)}\n`, "utf-8");
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    assets: manifestAssets
  };

  await writeFile(MEDIA_MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf-8");

  console.log(`Optimized ${manifestAssets.length} assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
