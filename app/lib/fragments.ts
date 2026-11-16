import { articles } from "./articles";
import { asset, list, readEntries, toInlineHtml } from "./content";

export type Stage = "seedling" | "budding" | "evergreen";

export type Fragment = {
  id: string;
  kind: "thought" | "article" | "page";
  html: string;
  subjects: string[];
  stage: Stage;
  planted: string; // ISO date
  tended: string; // ISO date
  sources: string[];
  href?: string;
  image?: string;
  alt?: string;
};

const stageOf = (s: string | undefined): Stage => (s === "evergreen" || s === "budding" ? s : "seedling");

// Pages of the wiki (content/wiki/), plus the articles and the work summary.
export function getFragments(): Fragment[] {
  const own: Fragment[] = readEntries("wiki").map((e) => ({
    id: e.slug,
    kind: "thought",
    html: toInlineHtml(e.body.replace(/\s*\n\s*/g, " ")),
    subjects: list(e.meta.subjects),
    stage: stageOf(e.meta.stage),
    planted: e.meta.planted || "2026-11-13",
    tended: e.meta.tended || e.meta.planted || "2026-11-13",
    sources: list(e.meta.sources),
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
      stage: "evergreen",
      planted: "2026-11-16",
      tended: "2026-11-16",
      sources: [],
      href: asset("/work/"),
    },
    ...articles.map(
      (a): Fragment => ({
        id: `article-${a.slug}`,
        kind: "article",
        html: a.title,
        subjects: a.subjects,
        stage: "evergreen",
        planted: a.date,
        tended: a.date,
        sources: [],
        href: asset(`/writing/${a.slug}/`),
      }),
    ),
  ];

  return [...own, ...links];
}
