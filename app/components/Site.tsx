import Link from "next/link";

export const GITHUB_URL = "https://github.com/0xlowell";
export const SITE_URL = "https://0xlowell.github.io/pages";

export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span className="arrow" aria-hidden="true">
      {external ? "↗" : "→"}
    </span>
  );
}

export function GitHubLink() {
  return (
    <a href={GITHUB_URL} rel="me noopener">
      GitHub
      <Arrow external />
    </a>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="col top">
        <Link href="/" className="name">Lowell</Link>
        <nav aria-label="Primary">
          <GitHubLink />
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="col site-footer">
      <p>
        Built with AI assistance. The facts are mine, and I reviewed each of them. Names of employers and products
        are left out on purpose.
      </p>
    </footer>
  );
}
