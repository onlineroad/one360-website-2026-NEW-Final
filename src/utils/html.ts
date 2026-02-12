import type { Testimonial } from "@/types/content";

const sitePrefix = "https://one360.com.au";
const placeholderImagePattern = /^data:image\//i;

function decodeHtmlEntities(input: string): string {
  const map: Record<string, string> = {
    "&nbsp;": " ",
    "&amp;": "&",
    "&quot;": "\"",
    "&#39;": "'",
    "&apos;": "'",
    "&lt;": "<",
    "&gt;": ">",
    "&#8211;": "-",
    "&#8212;": "-",
    "&#8220;": "\"",
    "&#8221;": "\"",
    "&#8230;": "..."
  };

  const decoded = input.replace(/&#x([0-9a-f]+);/gi, (_, hex: string) =>
    String.fromCodePoint(parseInt(hex, 16))
  );

  const decodedNumeric = decoded.replace(/&#(\d+);/g, (_, dec: string) =>
    String.fromCodePoint(parseInt(dec, 10))
  );

  return decodedNumeric.replace(
    /&nbsp;|&amp;|&quot;|&#39;|&apos;|&lt;|&gt;|&#8211;|&#8212;|&#8220;|&#8221;|&#8230;/g,
    (entity) => map[entity] ?? entity
  );
}

function normalizeAssetUrl(url: string): string {
  const value = decodeHtmlEntities(url.trim());
  if (!value) {
    return value;
  }
  if (value.startsWith("//")) {
    return `https:${value}`;
  }
  if (value.startsWith("/wp-content/")) {
    return `${sitePrefix}${value}`;
  }
  if (/^wp-content\//i.test(value)) {
    return `${sitePrefix}/${value}`;
  }
  return value;
}

function isPlaceholderImage(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return !normalized || normalized === "about:blank" || placeholderImagePattern.test(normalized);
}

function extractAttributeValues(tag: string, attribute: string): string[] {
  const pattern = new RegExp(`(?:^|\\s)${attribute}\\s*=\\s*(\"([^\"]*)\"|'([^']*)'|([^\\s>]+))`, "gi");
  return Array.from(tag.matchAll(pattern))
    .map((match) => match[2] ?? match[3] ?? match[4] ?? "")
    .filter(Boolean);
}

function removeAttribute(tag: string, attribute: string): string {
  const pattern = new RegExp(`\\s${attribute}\\s*=\\s*(\"[^\"]*\"|'[^']*'|[^\\s>]+)`, "gi");
  return tag.replace(pattern, "");
}

function upsertAttribute(tag: string, attribute: string, value: string): string {
  const withoutAttribute = removeAttribute(tag, attribute);
  const closingMatch = withoutAttribute.match(/\s*\/?>$/);
  if (!closingMatch) {
    return withoutAttribute;
  }
  const closing = closingMatch[0];
  const body = withoutAttribute.slice(0, -closing.length);
  const closingToken = /\/>$/.test(closing) ? " />" : ">";
  const escaped = value.replace(/"/g, "&quot;");
  return `${body} ${attribute}="${escaped}"${closingToken}`;
}

function firstUrlFromSrcset(srcset: string): string {
  const firstEntry = srcset.split(",")[0]?.trim();
  if (!firstEntry) {
    return "";
  }
  return firstEntry.split(/\s+/)[0] ?? "";
}

function normalizeSrcset(srcset: string): string {
  return srcset
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawUrl, ...rest] = entry.split(/\s+/);
      if (!rawUrl) {
        return "";
      }
      const normalizedUrl = normalizeAssetUrl(rawUrl);
      return [normalizedUrl, ...rest].filter(Boolean).join(" ");
    })
    .filter(Boolean)
    .join(", ");
}

function pickBestImageSource(candidates: string[]): string | null {
  for (const candidate of candidates) {
    const normalized = normalizeAssetUrl(candidate);
    if (!isPlaceholderImage(normalized)) {
      return normalized;
    }
  }
  return null;
}

function extractUrlFromCssValue(value: string): string {
  const match = value.match(/url\((['"]?)(.*?)\1\)/i);
  return match?.[2]?.trim() ?? value.trim();
}

function removeClassToken(tag: string, token: string): string {
  return tag.replace(/class=(["'])(.*?)\1/i, (_match, quote: string, value: string) => {
    const classNames = value
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .filter((item) => item !== token);

    if (classNames.length === 0) {
      return "";
    }

    return `class=${quote}${classNames.join(" ")}${quote}`;
  });
}

function normalizeBackgroundDivTag(tag: string): string {
  const lazyBackgroundCandidates = [
    ...extractAttributeValues(tag, "data-bg-image"),
    ...extractAttributeValues(tag, "data-lazy-bg-image"),
    ...extractAttributeValues(tag, "data-background-image"),
    ...extractAttributeValues(tag, "data-bg"),
    ...extractAttributeValues(tag, "data-lazy-bg")
  ].map((value) => extractUrlFromCssValue(value));

  const preferredSource = pickBestImageSource(lazyBackgroundCandidates);
  if (!preferredSource) {
    return tag;
  }

  const styleValue = extractAttributeValues(tag, "style").at(-1) ?? "";
  const cleanedStyle = styleValue.replace(/background-image\s*:[^;]+;?/gi, "").trim();
  const nextStyle = cleanedStyle
    ? `${cleanedStyle}${cleanedStyle.endsWith(";") ? "" : ";"}background-image:url(${preferredSource});background-size:cover;background-position:center;`
    : `background-image:url(${preferredSource});background-size:cover;background-position:center;`;

  let output = tag;
  output = upsertAttribute(output, "style", nextStyle);
  output = removeAttribute(output, "data-bg-image");
  output = removeAttribute(output, "data-lazy-bg-image");
  output = removeAttribute(output, "data-background-image");
  output = removeAttribute(output, "data-bg");
  output = removeAttribute(output, "data-lazy-bg");
  output = removeClassToken(output, "lazyload");

  return output;
}

function normalizeImageTag(tag: string): string {
  const srcValues = extractAttributeValues(tag, "src");
  const lazySourceValues = [
    ...extractAttributeValues(tag, "data-src"),
    ...extractAttributeValues(tag, "data-lazy-src"),
    ...extractAttributeValues(tag, "data-original"),
    ...extractAttributeValues(tag, "data-orig-file")
  ];
  const srcsetValues = [
    ...extractAttributeValues(tag, "srcset"),
    ...extractAttributeValues(tag, "data-srcset"),
    ...extractAttributeValues(tag, "data-lazy-srcset")
  ];

  const sourceFromSrcset = srcsetValues.map((value) => firstUrlFromSrcset(value));
  const preferredSource = pickBestImageSource([...lazySourceValues, ...srcValues, ...sourceFromSrcset]);

  if (!preferredSource) {
    return "";
  }

  let output = tag;
  output = upsertAttribute(output, "src", preferredSource);

  const preferredSrcset = srcsetValues
    .map((value) => normalizeSrcset(value))
    .find((value) => !isPlaceholderImage(firstUrlFromSrcset(value)));

  if (preferredSrcset) {
    output = upsertAttribute(output, "srcset", preferredSrcset);
  } else {
    output = removeAttribute(output, "srcset");
  }

  output = removeAttribute(output, "data-src");
  output = removeAttribute(output, "data-lazy-src");
  output = removeAttribute(output, "data-srcset");
  output = removeAttribute(output, "data-lazy-srcset");
  output = removeAttribute(output, "data-original");
  output = removeAttribute(output, "data-orig-file");
  output = removeAttribute(output, "sizes");
  output = removeAttribute(output, "data-sizes");
  output = removeAttribute(output, "decoding");

  if (!/\sloading=/i.test(output)) {
    output = upsertAttribute(output, "loading", "lazy");
  }

  return output;
}

function normalizeVideoAndSourceTag(tag: string): string {
  const srcValues = extractAttributeValues(tag, "src");
  const lazySourceValues = [
    ...extractAttributeValues(tag, "data-src"),
    ...extractAttributeValues(tag, "data-lazy-src")
  ];
  const preferredSource = pickBestImageSource([...lazySourceValues, ...srcValues]);
  if (!preferredSource) {
    return tag;
  }

  let output = upsertAttribute(tag, "src", preferredSource);
  output = removeAttribute(output, "data-src");
  output = removeAttribute(output, "data-lazy-src");
  return output;
}

function normalizeInternalLinks(html: string): string {
  return html.replace(
    /href=(["'])https:\/\/one360\.com\.au(\/[^"']*)\1/gi,
    (_match, quote: string, path: string) => `href=${quote}${path}${quote}`
  );
}

function stripNestedDocumentWrappers(html: string): string {
  return html
    .replace(/<!doctype[\s\S]*?>/gi, "")
    .replace(/<html[^>]*>/gi, "")
    .replace(/<\/html>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<body[^>]*>/gi, "")
    .replace(/<\/body>/gi, "");
}

function toPlainText(htmlFragment: string): string {
  return decodeHtmlEntities(htmlFragment)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTestimonialText(text: string): Testimonial | null {
  const normalized = text.replace(/^["'“”]+/, "").replace(/["'“”]+$/, "").trim();
  if (!normalized) {
    return null;
  }

  const authorSeparator = normalized.match(/\s[-–]\s([^-\n]+)$/);
  if (!authorSeparator || authorSeparator.index === undefined) {
    return { quote: normalized };
  }

  const quote = normalized
    .slice(0, authorSeparator.index)
    .replace(/["“”]+$/, "")
    .trim();
  const author = authorSeparator[1].trim();

  if (!quote) {
    return null;
  }

  return { quote, author };
}

export function extractTestimonialsFromContent(html: string): Testimonial[] {
  const slides = Array.from(
    html.matchAll(/<div[^>]*class="[^"]*wp-block-cb-slide[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)
  );

  const collected = slides
    .map((slide) => {
      const italicMatch = slide[1].match(/<em>([\s\S]*?)<\/em>/i);
      const raw = italicMatch ? italicMatch[1] : slide[1];
      return parseTestimonialText(toPlainText(raw));
    })
    .filter((item): item is Testimonial => item !== null);

  const unique = new Map<string, Testimonial>();
  for (const item of collected) {
    if (!unique.has(item.quote)) {
      unique.set(item.quote, item);
    }
  }

  return Array.from(unique.values());
}

export function transformContentHtml(html: string): string {
  let output = html;

  output = stripNestedDocumentWrappers(output);
  output = output.replace(/<script[\s\S]*?<\/script>/gi, "");
  output = output.replace(/<noscript[\s\S]*?<\/noscript>/gi, "");
  output = output.replace(/<iframe[\s\S]*?<\/iframe>/gi, "");
  output = output.replace(/<!--[\s\S]*?-->/g, "");

  output = output.replace(/<img\b[^>]*>/gi, (tag) => normalizeImageTag(tag));
  output = output.replace(/<(video|source)\b[^>]*>/gi, (tag) => normalizeVideoAndSourceTag(tag));
  output = output.replace(
    /<div\b[^>]*data-(?:bg-image|lazy-bg-image|background-image|bg|lazy-bg)=["'][^"']+["'][^>]*>/gi,
    (tag) => normalizeBackgroundDivTag(tag)
  );
  output = normalizeInternalLinks(output);

  return output;
}

export function stripDetailsFromContent(html: string): string {
  return html
    .replace(/<h1[\s\S]*?<\/h1>/gi, "")
    .replace(/<div[^>]*class="[^"]*wp-block-cover[^"]*"[^>]*>[\s\S]*?wp-block-cover__video-background[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*wp-block-columns[^"]*"[^>]*>[\s\S]*?wp-block-cb-carousel[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<div[^>]*id="reviews"[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<div[^>]*id="gallery"[\s\S]*?<\/div>\s*<\/div>/gi, "")
    .replace(/<div[^>]*id="instagram-gallery-feed-[^"]*"[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*wp-block-cb-slide[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*wp-block-cb-carousel[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<details[\s\S]*?<\/details>/gi, "")
    .replace(/<figure[^>]*>\s*<\/figure>/gi, "")
    .replace(/<div[^>]*class="hs-form-frame"[^>]*><\/div>/gi, "");
}
