export function normalizeRoute(route: string): string {
  if (!route) {
    return "/";
  }

  let normalized = route.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  if (normalized !== "/" && !normalized.endsWith("/")) {
    normalized = `${normalized}/`;
  }

  return normalized;
}

export function routeToId(route: string): string {
  const normalized = normalizeRoute(route);
  if (normalized === "/") {
    return "home";
  }

  return normalized
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/[^a-zA-Z0-9/\-]+/g, "")
    .replace(/\//g, "-")
    .toLowerCase();
}

export function routeToSlugSegments(route: string): string[] {
  const normalized = normalizeRoute(route);
  if (normalized === "/") {
    return [];
  }

  return normalized
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .split("/")
    .filter(Boolean);
}

export function slugSegmentsToRoute(segments?: string[]): string {
  if (!segments || segments.length === 0) {
    return "/";
  }

  return normalizeRoute(`/${segments.join("/")}`);
}
