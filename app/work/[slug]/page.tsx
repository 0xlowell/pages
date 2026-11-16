import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "../../components/Site";
import { projects } from "../../lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.title, description: p.lede };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <article className="col">
      <header className="page-head">
        <h1 className="page-title">{p.title}</h1>
        <p className="lede">{p.lede}</p>
        <dl className="pairs">
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <figure className="case-art">
        <p.Art />
      </figure>
      <div className="case-body">
        <p.Body />
      </div>
      <nav className="page-end" aria-label="More work">
        <p className="label">Next</p>
        <p className="next">
          <Link href={`/work/${next.slug}/`}>{next.title}</Link>
          <Arrow />
        </p>
      </nav>
    </article>
  );
}
