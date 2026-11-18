import Link from "next/link";
import { GITHUB_URL } from "./components/Site";
import GardenTree, { type Branch } from "./components/GardenTree";
import Sprout from "./components/Sprout";
import { articles } from "./lib/articles";
import { getFragments } from "./lib/fragments";
import { getLog, getPeople } from "./lib/logbook";

const BASE = process.env.PAGES_BASE_PATH || "";

const short = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

export default function Home() {
  const log = getLog();
  const people = getPeople();
  const fragments = getFragments().filter((f) => f.kind !== "page");
  const allSubjects = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => allSubjects.set(s, (allSubjects.get(s) || 0) + 1)));
  // Each idea or article hangs from its first subject; the others become arcs.
  const order = [...allSubjects.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
  const branches: Branch[] = order
    .map((name) => ({
      name,
      count: allSubjects.get(name) || 0,
      leaves: fragments
        .filter((f) => f.subjects[0] === name)
        .sort((a, b) => Number(a.kind === "article") - Number(b.kind === "article"))
        .map((f) => ({ id: f.id, kind: f.kind, html: f.html, href: f.href, stage: f.stage, also: f.subjects.slice(1) })),
    }));
  const updated = [...log.map((l) => l.date), ...articles.map((a) => a.date)].sort().pop();

  return (
    <div className="log col" data-page="home">
      <header className="log-head">
        <h1>
          Lowell
          <Sprout stage="budding" size={32} base={BASE} />
        </h1>
        <p className="log-lede">
          A logbook. What I am working on, things I find worth thinking about, and the people I learn from. Mostly
          software and AI agents for now; other subjects will grow here too.
        </p>
        <p className="log-nav">
          <a href="#log">Logbook</a> · <a href="#writing">Writing</a> · <a href="#garden">Garden</a> ·{" "}
          <a href="#people">People</a> · <Link href="/work/">Work</Link> · <a href={GITHUB_URL} rel="me noopener">GitHub</a> ·{" "}
          <a href={`${BASE}/writing/feed.xml`}>RSS</a>
        </p>
      </header>

      <section id="log" className="log-section">
        <h2>Logbook</h2>
        <ul className="entries">
          {log.map((l) => (
            <li key={l.id}>
              <time dateTime={l.date}>{short(l.date)}</time>
              <span dangerouslySetInnerHTML={{ __html: l.html }} />
            </li>
          ))}
        </ul>
      </section>

      <section id="writing" className="log-section">
        <h2>Writing</h2>
        <ul className="entries">
          {articles.map((a) => (
            <li key={a.slug}>
              <time dateTime={a.date}>{short(a.date)}</time>
              <span>
                <Link href={`/writing/${a.slug}/`}>{a.title}</Link>
                <span className="dek">{a.dek}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section id="garden" className="log-section">
        <h2>Garden</h2>
        <p className="note">
          Short ideas I keep coming back to, grown as a tree: each subject is a branch, each idea a leaf at its stage
          of growth (<span className="key"><Sprout stage="seedling" base={BASE} /> seedling</span>,{" "}
          <span className="key"><Sprout stage="budding" base={BASE} /> budding</span>,{" "}
          <span className="key"><Sprout stage="evergreen" base={BASE} /> evergreen</span>). Arcs in the margin show
          where an idea reaches another branch. Or <Link href="/garden/">wander the farm</Link>.
        </p>
        <GardenTree branches={branches} base={BASE} />
      </section>

      <section id="interests" className="log-section">
        <h2>Interests</h2>
        <p className="tags">
          {[...allSubjects.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([s, n]) => (
              <span key={s}>
                {s} <small>{n}</small>
              </span>
            ))}
        </p>
      </section>

      <section id="people" className="log-section">
        <h2>{people.title}</h2>
        <div className="people" dangerouslySetInnerHTML={{ __html: people.html }} />
      </section>

      <footer className="log-foot">
        <p>
          Last updated {updated ? short(updated) : ""}. Built by hand, with AI help; the facts are mine. Pixel crops by
          LushMustache (CC0). Find me on <a href={GITHUB_URL} rel="me noopener">GitHub</a>.
        </p>
      </footer>
    </div>
  );
}
