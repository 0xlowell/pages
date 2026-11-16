import Link from "next/link";

export const GITHUB_URL = "https://github.com/0xlowell";
export const SITE_URL = "https://0xlowell.github.io/pages";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="home-link">
          Home
        </Link>
        <nav aria-label="Primary">
          <ul>
            <li><Link href="/#projects">Projects</Link></li>
            <li><Link href="/writing/">Writing</Link></li>
            <li>
              <a className="btn" href={GITHUB_URL} rel="me noopener">
                GitHub
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
        <p>Lowell, AI Engineer</p>
        <ul className="foot-links">
          <li><Link href="/writing/">Writing</Link></li>
          <li><Link href="/writing/feed.xml" prefetch={false}>Feed</Link></li>
          <li><a href={GITHUB_URL} rel="me noopener">Find me on GitHub</a></li>
        </ul>
      </div>
    </footer>
  );
}
