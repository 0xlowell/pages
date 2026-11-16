import type { ComponentType } from "react";
import { createElement } from "react";
import HybridArticle from "../articles/hybrid";
import ObservabilityArticle from "../articles/observability";
import PlatformArticle from "../articles/platform";
import { list, readEntries, toHtml } from "./content";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  minutes: number;
  subjects: string[];
  Body: ComponentType;
};

const builtIn: Article[] = [
  {
    slug: "the-applications-around-the-agent",
    title: "The applications around the agent",
    dek: "A proposed application-access solution, an existing employee AI workspace and an assisted product-intake service: three connected problems, with different contributions and stages of delivery.",
    date: "2026-11-13",
    minutes: 4,
    subjects: ["agents", "authority"],
    Body: PlatformArticle,
  },
  {
    slug: "from-computer-use-to-hybrid-automation",
    title: "From continuous computer use to hybrid automation",
    dek: "Why I questioned an agent that decides every click, and what I proposed in its place: explore with the model, replay with procedures, and hand back only the steps that need it.",
    date: "2026-11-13",
    minutes: 6,
    subjects: ["agents"],
    Body: HybridArticle,
  },
  {
    slug: "proposed-executed-confirmed",
    title: "Proposed, executed, confirmed: logging what an automation did",
    dek: "A short note on keeping three facts apart, and on recording missing evidence as unknown instead of zero.",
    date: "2026-11-13",
    minutes: 4,
    subjects: ["evidence", "agents"],
    Body: ObservabilityArticle,
  },
];

// Articles written as Markdown files in content/writing/.
const written: Article[] = readEntries("writing").map((e) => {
  const html = toHtml(e.body);
  return {
    slug: e.slug.replace(/^\d{4}-\d{2}-\d{2}-/, ""),
    title: e.meta.title || e.slug,
    dek: e.meta.dek || "",
    date: e.meta.date || (e.slug.match(/^\d{4}-\d{2}-\d{2}/)?.[0] ?? "1970-01-01"),
    minutes: Math.max(1, Math.round(e.body.split(/\s+/).length / 220)),
    subjects: list(e.meta.subjects),
    Body: () => createElement("div", { className: "md", dangerouslySetInnerHTML: { __html: html } }),
  };
});

export const articles: Article[] = [...written, ...builtIn].sort((a, b) => b.date.localeCompare(a.date));

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
