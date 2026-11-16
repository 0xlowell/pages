import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GITHUB_URL } from "../../components/Site";
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
    <article className="wrap">
      <header className="article-head">
        <p className="post-meta" style={{ margin: 0 }}>
          <Link href="/writing/">Writing</Link>
        </p>
        <h1 className="page-title" style={{ marginTop: "1rem" }}>{a.title}</h1>
        <p className="dek">{a.dek}</p>
        <p className="post-meta">
          Lowell, <time dateTime={a.date}>{formatDate(a.date)}</time>, {a.minutes} min read
        </p>
      </header>
      <div className="prose" style={{ marginTop: "2.5rem" }}>
        <a.Body />
      </div>
      <nav className="article-end" aria-label="More writing">
        {other.slug !== a.slug && (
          <p>
            Next: <Link href={`/writing/${other.slug}/`}>{other.title}</Link>
          </p>
        )}
        <p>
          Comments and corrections are welcome on <a href={GITHUB_URL} rel="me noopener">GitHub</a>.
        </p>
      </nav>
    </article>
  );
}
