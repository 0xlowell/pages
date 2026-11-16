import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter, SiteHeader, SITE_URL } from "./components/Site";

const mono = localFont({
  src: [{ path: "./fonts/GeistMono-Variable.woff2", style: "normal" }],
  weight: "100 900",
  variable: "--font-mono",
  display: "swap",
});

const serif = localFont({
  src: [
    { path: "./fonts/Newsreader-Variable.woff2", style: "normal" },
    { path: "./fonts/Newsreader-VariableItalic.woff2", style: "italic" },
  ],
  weight: "200 800",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + "/"),
  title: { default: "Lowell", template: "%s | Lowell" },
  description:
    "A map of what Lowell keeps thinking about: ideas wired to the subjects they touch. For now, mostly software and AI agents.",
  alternates: { types: { "application/rss+xml": "writing/feed.xml" } },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable}`}>
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
