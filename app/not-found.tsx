import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap page-head">
      <h1 className="page-title">This page does not exist</h1>
      <p className="dek">
        Go back to the <Link href="/">home page</Link>, see the <Link href="/work/">projects</Link> or read the{" "}
        <Link href="/writing/">writing</Link>.
      </p>
    </div>
  );
}
