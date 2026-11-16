import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap article-head">
      <h1 className="page-title">This page does not exist</h1>
      <p className="dek" style={{ marginTop: "1rem" }}>
        Go back to the <Link href="/">home page</Link> or read the <Link href="/writing/">writing</Link>.
      </p>
    </div>
  );
}
