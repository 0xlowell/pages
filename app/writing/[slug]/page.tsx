import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, GITHUB_URL } from "../../components/Site";
import { articles, formatDate } from "../../lib/articles";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};
  return { title: a.title, description: a.dek };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = articles.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const a = articles[index];
  const other = articles[(index + 1) % articles.length];

  return (
    <article className="col">
      <header className="page-head">
        <h1 className="page-title" style={{ viewTransitionName: `t-writing-${a.slug}` }}>{a.title}</h1>
        <p className="dek">{a.dek}</p>
        <p className="post-meta">
          <time dateTime={a.date}>{formatDate(a.date)}</time>, {a.minutes} min read
        </p>
      </header>
      <div className="prose">
        <a.Body />
      </div>
      <nav className="page-end" aria-label="More writing">
        {other.slug !== a.slug && (
          <>
            <p className="label">Next</p>
            <p className="next">
              <Link href={`/writing/${other.slug}/`}>{other.title}</Link>
              <Arrow />
            </p>
          </>
        )}
        <p className="feedback">
          Comments and corrections are welcome on <a href={GITHUB_URL} rel="me noopener">GitHub</a>.
        </p>
      </nav>
    </article>
  );
}
