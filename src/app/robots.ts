import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart/", "/checkout/", "/my-account/", "/shop/", "/product/"]
    },
    sitemap: "https://one360.com.au/sitemap.xml"
  };
}
