import type { MediaAsset, PageContent } from "@/types/content";

const defaultHeroVideo = "https://one360.com.au/wp-content/uploads/2025/02/Untitled-design-1.mp4";

const heroVideoByRoute: Record<string, string> = {
  "/": "https://one360.com.au/wp-content/uploads/2025/02/Untitled-design-1.mp4",
  "/360-video-booth-hire/": "https://one360.com.au/wp-content/uploads/2024/10/Untitled-design-1-1.mp4",
  "/360-photo-booth-hire-sydney/":
    "https://one360.com.au/wp-content/uploads/2024/10/Untitled-design-1-1.mp4",
  "/glambot-hire/": "https://one360.com.au/wp-content/uploads/2025/02/ONEGLAM-Sydney.mp4",
  "/brand-activations-sydney/":
    "https://one360.com.au/wp-content/uploads/2025/04/Brand-Activation-Sydney.mp4",
  "/corporate-photo-booth-hire/":
    "https://one360.com.au/wp-content/uploads/2025/04/Brand-Activation-Sydney.mp4",
  "/melbourne-360-video-booth-hire/":
    "https://one360.com.au/wp-content/uploads/2025/06/360-Photo-Booth-Hire-Melbourne.mp4",
  "/sydney-360-video-booth-hire/":
    "https://one360.com.au/wp-content/uploads/2025/06/360-Photo-Booth-Hire-Sydney.mp4",
  "/one360-revolve-green-screen-hire/":
    "https://one360.com.au/wp-content/uploads/2025/02/Untitled-design-1-3.mp4",
  "/wedding-car-hire-sydney/":
    "https://one360.com.au/wp-content/uploads/2025/02/ONEGLAM-Sydney.mp4"
};

export function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
}

export function isBrandLogoAsset(asset: MediaAsset): boolean {
  const source = asset.sourceUrl.toLowerCase();
  return (
    /\/(1|2|3|4|5|6)-1\.png$/i.test(source) ||
    /\/\d{1,2}-edited(?:-\d+)?\.png$/i.test(source)
  );
}

export function isEventCaptureAsset(asset: MediaAsset): boolean {
  if (isVideoUrl(asset.sourceUrl) || isBrandLogoAsset(asset)) {
    return false;
  }

  const source = asset.sourceUrl.toLowerCase();
  const alt = asset.alt.toLowerCase();

  return (
    /event|premiere|setup|awards|jaecoo|samsung|camellia|camilla|redken|afterpay|tiktok|instagram|foxtel|sephora|doltone/.test(
      `${source} ${alt}`
    ) || alt.length > 0
  );
}

export function uniqueMediaBySource(assets: MediaAsset[]): MediaAsset[] {
  return Array.from(new Map(assets.map((asset) => [asset.sourceUrl, asset])).values());
}

export function buildCaption(asset: MediaAsset): string {
  if (asset.alt.trim()) {
    return asset.alt.trim();
  }

  const filename = decodeURIComponent(asset.sourceUrl.split("/").pop() || "ONE360 Event")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const withCaps = filename.replace(/\b(one360|oneglam|jaecoo|acra|samsung|meta|tiktok)\b/gi, (part) =>
    part.toUpperCase()
  );

  return withCaps || "ONE360 Event Capture";
}

export function getHeroVideoForPage(page: PageContent): string | undefined {
  const mappedVideo = heroVideoByRoute[page.route];
  if (mappedVideo) {
    return mappedVideo;
  }

  const mediaVideo = page.media.find((asset) => isVideoUrl(asset.sourceUrl))?.sourceUrl;
  if (mediaVideo) {
    return mediaVideo;
  }

  return page.route === "/" || page.templateType === "service" ? defaultHeroVideo : undefined;
}
