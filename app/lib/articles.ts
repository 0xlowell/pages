import type { ComponentType } from "react";
import HybridArticle from "../articles/hybrid";
import ObservabilityArticle from "../articles/observability";
import PlatformArticle from "../articles/platform";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO
  minutes: number;
  Body: ComponentType;
};

export const articles: Article[] = [
  {
    slug: "the-applications-around-the-agent",
    title: "The applications around the agent",
    dek: "A proposed application-access solution, an existing employee AI workspace and an assisted product-intake service: three connected problems, with different contributions and stages of delivery.",
    date: "2026-11-13",
    minutes: 4,
    Body: PlatformArticle,
  },
  {
    slug: "from-computer-use-to-hybrid-automation",
    title: "From continuous computer use to hybrid automation",
    dek: "Why I questioned an agent that decides every click, and what I proposed in its place: explore with the model, replay with procedures, and hand back only the steps that need it.",
    date: "2026-11-13",
    minutes: 6,
    Body: HybridArticle,
  },
  {
    slug: "proposed-executed-confirmed",
    title: "Proposed, executed, confirmed: logging what an automation did",
    dek: "A short note on keeping three facts apart, and on recording missing evidence as unknown instead of zero.",
    date: "2026-11-13",
    minutes: 4,
    Body: ObservabilityArticle,
  },
];

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(iso),
  );
}
