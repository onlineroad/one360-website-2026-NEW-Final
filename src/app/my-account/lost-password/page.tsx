import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Password Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function LostPasswordRedirectPage() {
  return <RedirectNotice destination="/book/" title="Password page has moved" />;
}
