"use client";

import Link from "next/link";
import { useState } from "react";
import type { Fragment } from "../lib/fragments";

const kindLabel: Record<Fragment["kind"], string> = {
  thought: "",
  image: "",
  article: "Article",
  page: "Synthesis",
};

function Inner({ f }: { f: Fragment }) {
  return (
    <>
      {kindLabel[f.kind] && <span className="frag-kind">{kindLabel[f.kind]}</span>}
      {f.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.image} alt={f.alt} loading="lazy" />
      )}
      {f.html && <span className="frag-text" dangerouslySetInnerHTML={{ __html: f.html }} />}
      <span className="frag-foot">
        <span>{f.subjects.join(" · ")}</span>
        {f.href && <span aria-hidden="true">{f.href.startsWith("/") ? "→" : "↗"}</span>}
      </span>
    </>
  );
}

export default function Collage({ fragments, subjects }: { fragments: Fragment[]; subjects: string[] }) {
  const [active, setActive] = useState<string | null>(null);

  // Subjects that share at least one fragment with the selected one.
  const near = new Set<string>();
  if (active) fragments.filter((f) => f.subjects.includes(active)).forEach((f) => f.subjects.forEach((s) => near.add(s)));

  return (
    <div className="collage">
      <div className="subjects" role="group" aria-label="Subjects">
        <button type="button" aria-pressed={active === null} onClick={() => setActive(null)}>
          Everything
        </button>
        {subjects.map((s) => (
          <button
            type="button"
            key={s}
            aria-pressed={active === s}
            data-near={active && active !== s && near.has(s) ? "" : undefined}
            onClick={() => setActive(active === s ? null : s)}
          >
            {s}
          </button>
        ))}
      </div>

      <ul className="frags">
        {fragments.map((f) => {
          const off = active !== null && !f.subjects.includes(active);
          const props = {
            className: "frag",
            "data-kind": f.kind,
            "data-wide": f.wide ? "" : undefined,
            "data-off": off ? "" : undefined,
          };
          return (
            <li key={f.id} {...props}>
              {f.href ? (
                f.href.startsWith("/") ? (
                  <Link href={f.href}><Inner f={f} /></Link>
                ) : (
                  <a href={f.href} rel="noopener"><Inner f={f} /></a>
                )
              ) : (
                <div><Inner f={f} /></div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
