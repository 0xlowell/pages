import type { Metadata } from "next";
import ProjectCard, { EarlierWork, RoleKey } from "../components/ProjectCard";
import { projects } from "../lib/projects";
import { earlier } from "../lib/earlier";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected recent projects and earlier work in retrieval, platforms and agents.",
};

export default function WorkIndex() {
  const [lead, ...rest] = projects;
  return (
    <div className="wrap">
      <div className="page-head">
        <h1 className="page-title">Projects</h1>
        <p className="lede">Three recent case studies, then earlier work.</p>
      </div>
      <section aria-labelledby="recent-title">
        <div className="section-head">
          <h2 id="recent-title">Case studies</h2>
          <RoleKey />
        </div>
        <div className="cards">
          <ProjectCard project={lead} lead />
          {rest.map((p) => (
            <ProjectCard project={p} key={p.slug} />
          ))}
        </div>
      </section>
      <section className="section" aria-labelledby="earlier-title">
        <div className="section-head">
          <h2 id="earlier-title">Earlier work</h2>
          <p>Retrieval, platforms and agents.</p>
        </div>
        <EarlierWork items={earlier} />
      </section>
    </div>
  );
}
