import type { Metadata } from "next";

import { RedirectNotice } from "@/components/RedirectNotice";

export const metadata: Metadata = {
  title: "Blogs Redirect | ONE360",
  robots: "noindex, nofollow"
};

export default function CategoryBlogsRedirectPage() {
  return <RedirectNotice destination="/blogs/" title="Blogs category moved" />;
}
