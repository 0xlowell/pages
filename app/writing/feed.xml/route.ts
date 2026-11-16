import { SITE_URL } from "../../components/Site";
import { articles } from "../../lib/articles";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function GET() {
  const items = articles
    .map(
      (a) => `<item>
<title>${esc(a.title)}</title>
<link>${SITE_URL}/writing/${a.slug}/</link>
<guid>${SITE_URL}/writing/${a.slug}/</guid>
<pubDate>${new Date(a.date).toUTCString()}</pubDate>
<description>${esc(a.dek)}</description>
</item>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Lowell, writing</title>
<link>${SITE_URL}/writing/</link>
<description>Engineering notes on hybrid automation, AI workspaces, product intake and application authorization.</description>
${items}
</channel></rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
