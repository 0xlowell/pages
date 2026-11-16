import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter, SiteHeader, SITE_URL } from "./components/Site";

const switzer = localFont({
  src: [
    { path: "./fonts/Switzer-Variable.woff2", style: "normal" },
    { path: "./fonts/Switzer-VariableItalic.woff2", style: "italic" },
  ],
  weight: "300 900",
  variable: "--font-switzer",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: "Lowell", template: "%s | Lowell" },
  description:
    "Subjects Lowell keeps coming back to, and what connects them. For now, mostly software and AI agents.",
  alternates: { types: { "application/rss+xml": "writing/feed.xml" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={switzer.variable}>
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
