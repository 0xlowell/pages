import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter, SiteHeader, SITE_URL } from "./components/Site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: "Lowell, AI Engineer", template: "%s | Lowell" },
  description:
    "Lowell is an AI Engineer designing and building AI-powered applications, from agent workflows to the systems around them.",
  alternates: { types: { "application/rss+xml": "writing/feed.xml" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
