import Link from "next/link";
import { GITHUB_URL } from "./components/Site";
import { articles, formatDate } from "./lib/articles";
import { earlier } from "./lib/earlier";
import { projects } from "./lib/projects";

export default function Home() {
  return (
    <>
      <div className="wrap hero">
        <div>
          <h1>Lowell</h1>
          <p className="role">AI Engineer</p>
          <p className="intro">
            I design and build AI-powered applications, from agent workflows to the systems around them.
          </p>
          <ul className="hero-actions">
            <li><Link className="btn" data-solid="" href="/#projects">See the projects</Link></li>
            <li><Link className="btn" href="/writing/">Read the writing</Link></li>
          </ul>
        </div>
        <dl className="hero-facts">
          <div>
            <dt>Focus</dt>
            <dd>Agent workflows, retrieval, and the applications that surround them</dd>
          </div>
          <div>
            <dt>Works with</dt>
            <dd>Python, React, Azure, Kubernetes</dd>
          </div>
          <div>
            <dt>Find me</dt>
            <dd><a href={GITHUB_URL} rel="me noopener">GitHub</a></dd>
          </div>
        </dl>
      </div>

      <section className="section" id="projects" aria-labelledby="projects-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="projects-title">Selected projects</h2>
            <p>Recent work, with the part I did and where each piece stands.</p>
          </div>
          {projects.map((p) => (
            <article className="project" key={p.slug}>
              <div>
                <h3>{p.title}</h3>
                <p className="role-line">{p.role}</p>
                <p className="summary">{p.summary}</p>
                <p className="stage">{p.stage}</p>
                <Link className="go" href={`/work/${p.slug}/`}>
                  Read the case study<span className="sr-only">: {p.title}</span>
                </Link>
              </div>
              <figure className="art">
                <p.Art />
              </figure>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="earlier" aria-labelledby="earlier-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="earlier-title">Earlier work</h2>
            <p>Retrieval, platforms and agents.</p>
          </div>
          <ul className="index">
            {earlier.map((e) => (
              <li key={e.title}>
                <div>
                  <h3>{e.title}</h3>
                  <p className="ctx">{e.context}</p>
                </div>
                <div>
                  <p>{e.body}</p>
                  <p className="tools">{e.tools}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="writing" aria-labelledby="writing-title">
        <div className="wrap">
          <div className="section-head">
            <h2 id="writing-title">Writing</h2>
            <p><Link href="/writing/">All writing</Link></p>
          </div>
          <ul className="index">
            {articles.map((a) => (
              <li key={a.slug}>
                <p className="when">
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                </p>
                <h3>
                  <Link href={`/writing/${a.slug}/`}>{a.title}</Link>
                </h3>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="contact-title">
        <div className="wrap">
          <div className="contact">
            <div>
              <h2 id="contact-title">Say hello</h2>
              <p>You can find me on GitHub.</p>
            </div>
            <a className="btn" href={GITHUB_URL} rel="me noopener">Find me on GitHub</a>
          </div>
        </div>
      </section>
    </>
  );
}
