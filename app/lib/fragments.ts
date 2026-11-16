import { articles } from "./articles";
import { asset, list, readEntries, toInlineHtml } from "./content";

export type Fragment = {
  id: string;
  kind: "thought" | "article" | "page";
  html: string;
  subjects: string[];
  href?: string;
  image?: string;
  alt?: string;
};

// The home page is an index of fragments. Thoughts and images come from
// content/fragments/; articles and the work summary join as links.
export function getFragments(): Fragment[] {
  const own: Fragment[] = readEntries("fragments").map((e) => ({
    id: e.slug,
    kind: "thought",
    html: toInlineHtml(e.body.replace(/\s*\n\s*/g, " ")),
    subjects: list(e.meta.subjects),
    href: e.meta.link ? asset(e.meta.link) : undefined,
    image: e.meta.image ? asset(e.meta.image) : undefined,
    alt: e.meta.alt || "",
  }));

  const links: Fragment[] = [
    {
      id: "page-work",
      kind: "page",
      html: "What I am working on, without the names",
      subjects: ["agents", "authority", "evidence"],
      href: asset("/work/"),
    },
    ...articles.map(
      (a): Fragment => ({
        id: `article-${a.slug}`,
        kind: "article",
        html: a.title,
        subjects: a.subjects,
        href: asset(`/writing/${a.slug}/`),
      }),
    ),
  ];

  // A link after every second thought, so the page never reads as two lists.
  const out: Fragment[] = [];
  own.forEach((f, i) => {
    out.push(f);
    if (i % 2 === 1 && links.length) out.push(links.shift()!);
  });
  return [...out, ...links];
}

export function getSubjects(fragments: Fragment[]): { name: string; count: number }[] {
  const count = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => count.set(s, (count.get(s) || 0) + 1)));
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, n]) => ({ name, count: n }));
}

// A stable name shared by a link and the heading of the page it leads to,
// so the browser can carry the title across the navigation.
export function transitionName(href: string): string {
  const path = href.replace(/^https?:\/\/[^/]+/, "").replace(process.env.PAGES_BASE_PATH || "", "");
  return "t" + path.replace(/[^a-z0-9]+/gi, "-").replace(/-$/, "");
}
