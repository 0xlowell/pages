import { articles } from "./articles";
import { asset, list, readEntries, toInlineHtml } from "./content";

export type Fragment = {
  id: string;
  kind: "thought" | "image" | "article" | "page";
  html: string; // the fragment itself
  subjects: string[];
  href?: string;
  image?: string;
  alt?: string;
  wide: boolean;
};

// The home page is a collage of fragments. Thoughts and images come from
// content/fragments/; every article joins automatically.
export function getFragments(): Fragment[] {
  const own: Fragment[] = readEntries("fragments").map((e) => ({
    id: e.slug,
    kind: e.meta.image ? "image" : "thought",
    html: toInlineHtml(e.body.replace(/\s*\n\s*/g, " ")),
    subjects: list(e.meta.subjects),
    href: e.meta.link || undefined,
    image: e.meta.image ? asset(e.meta.image) : undefined,
    alt: e.meta.alt || "",
    wide: e.meta.size === "wide" || (!e.meta.size && e.body.length > 130),
  }));

  const fromArticles: Fragment[] = articles.map((a) => ({
    id: `article-${a.slug}`,
    kind: "article",
    html: a.title,
    subjects: a.subjects,
    href: `/writing/${a.slug}/`,
    wide: false,
  }));

  const synthesis: Fragment = {
    id: "page-work",
    kind: "page",
    html: "What I am working on, without the names",
    subjects: ["agents", "authority", "evidence"],
    href: "/work/",
    wide: false,
  };

  // Interleave so the page does not read as a list followed by another list.
  const links = [synthesis, ...fromArticles];
  const out: Fragment[] = [];
  const step = Math.max(1, Math.floor(own.length / (links.length + 1)));
  own.forEach((f, i) => {
    out.push(f);
    if ((i + 1) % step === 0 && links.length) out.push(links.shift()!);
  });
  return [...out, ...links];
}

export function getSubjects(fragments: Fragment[]): string[] {
  const count = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => count.set(s, (count.get(s) || 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);
}
