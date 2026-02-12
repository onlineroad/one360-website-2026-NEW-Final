import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "My Account Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function MyAccountRedirectPage() {
  return <RedirectNotice destination="/book/" title="Account page has moved" />;
}
