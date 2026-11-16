import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "../lib/projects";
import { earlier } from "../lib/earlier";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected recent projects and earlier work in retrieval, platforms and agents.",
};

export default function WorkIndex() {
  return (
    <div className="wrap">
      <div className="case-head">
        <h1 className="page-title" style={{ marginTop: 0 }}>Projects</h1>
        <p className="lede">Three recent case studies, then earlier work.</p>
      </div>
      <ul className="index" style={{ marginTop: "2.5rem" }}>
        {projects.map((p) => (
          <li key={p.slug}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 650 }}>
                <Link href={`/work/${p.slug}/`}>{p.title}</Link>
              </h2>
              <p className="ctx">{p.role}</p>
            </div>
            <p>{p.summary}</p>
          </li>
        ))}
      </ul>
      <h2 className="subhead" style={{ marginTop: "3rem" }}>Earlier work</h2>
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
  );
}
