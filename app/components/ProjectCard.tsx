import Link from "next/link";
import type { Project } from "../lib/projects";
import { Arrow } from "./Site";

export default function ProjectCard({ project: p, lead = false }: { project: Project; lead?: boolean }) {
  return (
    <article className="card" data-lead={lead ? "" : undefined}>
      <figure className="card-art">
        <p.Art />
      </figure>
      <div className="card-text">
        <p className="role" data-kind={p.kind}>{p.role}</p>
        <h3>
          <Link href={`/work/${p.slug}/`}>{p.title}</Link>
        </h3>
        <p className="summary">{p.summary}</p>
        <p className="stage">
          <b>Stage.</b> {p.stage}
        </p>
        <p className="more" aria-hidden="true">
          Read the case study
          <Arrow />
        </p>
      </div>
    </article>
  );
}

export function RoleKey() {
  return (
    <p className="role-key">
      <span className="role" data-kind="proposed">My proposal</span>
      <span className="role" data-kind="contributing">Existing product</span>
    </p>
  );
}

export function EarlierWork({ items }: { items: { title: string; context: string; body: string; tools: string }[] }) {
  return (
    <ul className="earlier">
      {items.map((e) => (
        <li key={e.title}>
          <h3>{e.title}</h3>
          <p className="ctx">{e.context}</p>
          <p className="body">{e.body}</p>
          <p className="tools">{e.tools}</p>
        </li>
      ))}
    </ul>
  );
}
