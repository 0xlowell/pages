import Link from "next/link";
import { Arrow, GitHubLink, GITHUB_URL } from "./components/Site";
import { articles, formatDate } from "./lib/articles";
import { earlier } from "./lib/earlier";
import { projects } from "./lib/projects";

export default function Home() {
  return (
    <div className="col" data-page="home">
      <header className="who">
        <h1>
          Lowell <span>AI Engineer</span>
        </h1>
        <GitHubLink />
      </header>

      <section className="intro">
        <p className="lead">
          I design and build AI-powered applications, from agent workflows to the systems around them.
        </p>
        <p>
          Most of my work is the part around the model: what an agent is allowed to do, what it actually did, and
          how the application recovers when a run, a stream or a person interrupts it.
        </p>
        <p className="muted">
          This page describes what I am working on without the names. Employers and products stay private. The
          engineering does not have to.
        </p>
      </section>

      <section className="block" aria-labelledby="now-title">
        <h2 className="label" id="now-title">Current work</h2>
        {projects.map((p) => (
          <article className="work" key={p.slug}>
            <header>
              <h3>{p.title}</h3>
              <p className="role">{p.role}</p>
            </header>
            <p className="body">{p.body}</p>
            <dl className="pairs">
              {p.parts.map((x) => (
                <div key={x.term}>
                  <dt>{x.term}</dt>
                  <dd>{x.text}</dd>
                </div>
              ))}
              <div>
                <dt>Stage</dt>
                <dd>{p.stage}</dd>
              </div>
            </dl>
            <p className="more">
              <Link href={`/work/${p.slug}/`}>{p.more}</Link>
              <Arrow />
            </p>
          </article>
        ))}
      </section>

      <section className="block" aria-labelledby="earlier-title">
        <h2 className="label" id="earlier-title">Earlier</h2>
        <dl className="pairs">
          {earlier.map((e) => (
            <div key={e.title}>
              <dt>
                {e.title}
                <small>{e.context}</small>
              </dt>
              <dd>{e.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="block" aria-labelledby="writing-title">
        <h2 className="label" id="writing-title">Writing</h2>
        <ul className="rows">
          {articles.map((a) => (
            <li key={a.slug}>
              <Link href={`/writing/${a.slug}/`}>
                <span>{a.title}</span>
                <time dateTime={a.date}>{formatDate(a.date)}</time>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="block" aria-labelledby="contact-title">
        <h2 className="label" id="contact-title">Contact</h2>
        <p className="contact">
          I am on GitHub as <a href={GITHUB_URL} rel="me noopener">0xlowell</a>.
        </p>
      </section>
    </div>
  );
}
