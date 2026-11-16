import type { Metadata } from "next";
import Link from "next/link";
import { articles, formatDate } from "../lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering notes on hybrid automation, AI workspaces, product intake and application authorization.",
};

export default function WritingIndex() {
  return (
    <div className="wrap">
      <div className="article-head">
        <h1 className="page-title">Writing</h1>
        <p className="dek">
          Working notes on agents, the applications around them and the boundaries between suggestions and actions.{" "}
          <Link href="/writing/feed.xml" prefetch={false}>Feed</Link>.
        </p>
      </div>
      <ul className="post-list" style={{ marginTop: "2.5rem" }}>
        {articles.map((a) => (
          <li key={a.slug}>
            <p className="post-meta">
              <time dateTime={a.date}>{formatDate(a.date)}</time>
              <br />
              {a.minutes} min read
            </p>
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 600, lineHeight: 1.25, margin: "0 0 0.5rem" }}>
                <Link href={`/writing/${a.slug}/`}>{a.title}</Link>
              </h2>
              <p style={{ margin: 0 }}>{a.dek}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
