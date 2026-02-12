import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Checkout Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function CheckoutRedirectPage() {
  return <RedirectNotice destination="/book/" title="Checkout has moved" />;
}
