import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Cart Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function CartRedirectPage() {
  return <RedirectNotice destination="/book/" title="Cart has moved" />;
}
