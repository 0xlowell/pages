import Link from "next/link";
import ProjectCard, { EarlierWork, RoleKey } from "./components/ProjectCard";
import { Arrow, GITHUB_URL } from "./components/Site";
import { articles, formatDate } from "./lib/articles";
import { earlier } from "./lib/earlier";
import { projects } from "./lib/projects";

// One design position from each recent project.
const rules = [
  { text: "Procedures by default, a model for the step that needs one.", slug: "hybrid-automation" },
  { text: "The interface shows. The server decides.", slug: "application-authorization" },
  { text: "An assistant proposes. A person submits.", slug: "ai-workspaces" },
];

export default function Home() {
  const [lead, ...rest] = projects;
  return (
    <div data-page="home">
      <div className="wrap hero">
        <div>
          <h1>
            Lowell <span>AI Engineer</span>
          </h1>
          <p className="intro">
            I design and build AI-powered applications, from agent workflows to the systems around them.
          </p>
          <ul className="hero-actions">
            <li><Link className="btn" href="/#projects">See the projects</Link></li>
            <li>
              <a href={GITHUB_URL} rel="me noopener">
                Find me on GitHub
                <Arrow external />
              </a>
            </li>
          </ul>
        </div>
        <nav className="rules" aria-labelledby="rules-title">
          <h2 className="label" id="rules-title">Three rules from recent work</h2>
          <ol>
            {rules.map((r) => (
              <li key={r.slug}>
                <Link href={`/work/${r.slug}/`}>
                  <span>{r.text}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <section className="section" id="projects" aria-labelledby="projects-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="projects-title">Selected projects</h2>
            <RoleKey />
          </div>
          <div className="cards">
            <ProjectCard project={lead} lead />
            {rest.map((p) => (
              <ProjectCard project={p} key={p.slug} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="writing" aria-labelledby="writing-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="writing-title">Writing</h2>
            <p>
              <Link href="/writing/">
                All writing
                <Arrow />
              </Link>
            </p>
          </div>
          <ul className="posts">
            {articles.map((a) => (
              <li key={a.slug}>
                <Link href={`/writing/${a.slug}/`}>
                  <div>
                    <h3>{a.title}</h3>
                    <p className="dek">{a.dek}</p>
                  </div>
                  <p className="when">
                    <time dateTime={a.date}>{formatDate(a.date)}</time>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="earlier" aria-labelledby="earlier-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="earlier-title">Earlier work</h2>
            <p>Retrieval, platforms and agents.</p>
          </div>
          <EarlierWork items={earlier} />
        </div>
      </section>
    </div>
  );
}
