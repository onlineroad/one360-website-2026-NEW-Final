import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Shop Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function ShopRedirectPage() {
  return <RedirectNotice destination="/book/" title="Shop has moved" />;
}
