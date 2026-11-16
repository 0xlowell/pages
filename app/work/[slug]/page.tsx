import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
  const p = projects.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <article className="wrap">
      <header className="case-head">
        <p className="crumbs">
          <Link href="/work/">Projects</Link>
        </p>
        <h1>{p.title}</h1>
        <p className="lede">{p.lede}</p>
        <dl className="facts">
          {p.facts.map((f) => (
            <div key={f.label}>
              <dt>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </header>
      <figure className="art case-art" style={{ maxWidth: "46rem" }}>
        <p.Art />
      </figure>
      <div className="case-body">
        <p.Body />
      </div>
    </article>
  );
}
