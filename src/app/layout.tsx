import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@/app/globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getSiteConfig } from "@/utils/content";

export const metadata: Metadata = {
  metadataBase: new URL("https://one360.com.au"),
  title: "ONE360",
  description: "ONE360 photobooth and video booth hire website.",
  applicationName: "ONE360"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  const site = await getSiteConfig();

  return (
    <html lang="en-AU">
      <body>
        <Header site={site} />
        <main>{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
