import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Product Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function ProductRedirectPage() {
  return <RedirectNotice destination="/book/" title="Product page moved" />;
}
