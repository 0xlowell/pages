import type { Metadata } from "next";
import Link from "next/link";
import { articles, formatDate } from "../lib/articles";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering notes on hybrid automation, AI workspaces, product intake and application authorization.",
};

export default function WritingIndex() {
  return (
    <div className="col">
      <div className="page-head">
        <h1 className="page-title">Writing</h1>
        <p className="dek">
          Working notes on agents, the applications around them and the boundaries between suggestions and actions.{" "}
          <Link href="/writing/feed.xml" prefetch={false}>Feed</Link>.
        </p>
      </div>
      <ul className="rows" style={{ marginTop: "2.5rem" }}>
        {articles.map((a) => (
          <li key={a.slug}>
            <Link href={`/writing/${a.slug}/`}>
              <span>{a.title}</span>
              <time dateTime={a.date}>{formatDate(a.date)}</time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
