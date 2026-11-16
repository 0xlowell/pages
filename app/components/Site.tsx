import Link from "next/link";

export const GITHUB_URL = "https://github.com/0xlowell";
export const SITE_URL = "https://0xlowell.github.io/pages";

// Four steps, one of them decided by a model.
export function Logo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true">
      <rect className="logo-ink" x="1" y="1" width="8" height="8" rx="1.5" />
      <rect className="logo-ink" x="11" y="1" width="8" height="8" rx="1.5" />
      <rect className="logo-ink" x="1" y="11" width="8" height="8" rx="1.5" />
      <rect className="logo-model" x="11" y="11" width="8" height="8" rx="1.5" />
    </svg>
  );
}

export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span className="arrow" aria-hidden="true">
      {external ? "↗" : "→"}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="brand" aria-label="Lowell, home">
          <Logo />
          <span className="brand-name">Lowell</span>
        </Link>
        <nav aria-label="Primary">
          <ul>
            <li><Link href="/work/">Projects</Link></li>
            <li><Link href="/writing/">Writing</Link></li>
            <li>
              <a href={GITHUB_URL} rel="me noopener">
                GitHub
                <Arrow external />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <p>
          <Logo size={14} />
          Lowell, AI Engineer
        </p>
        <ul className="foot-links">
          <li><Link href="/work/">Projects</Link></li>
          <li><Link href="/writing/">Writing</Link></li>
          <li><Link href="/writing/feed.xml" prefetch={false}>Feed</Link></li>
          <li><a href={GITHUB_URL} rel="me noopener">GitHub</a></li>
        </ul>
      </div>
    </footer>
  );
}
