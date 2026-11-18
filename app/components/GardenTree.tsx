"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Sprout, { type StageName } from "./Sprout";

export type Leaf = {
  id: string;
  kind: "thought" | "article" | "page";
  html: string;
  href?: string;
  stage: StageName;
  also: string[];
};
export type Branch = { name: string; count: number; leaves: Leaf[] };

type Arc = { id: string; from: string; to: string; d: string };

// Thinking as a tree: subjects branch from one stem, ideas hang from their
// subject, and an arc in the margin joins an idea to every other subject it
// also touches.
export default function GardenTree({ branches, base }: { branches: Branch[]; base: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [arcs, setArcs] = useState<Arc[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hover, setHover] = useState<{ leaf?: string; subject?: string } | null>(null);

  const measure = useCallback(() => {
    const root = box.current;
    if (!root) return;
    const R = root.getBoundingClientRect();
    const gutter = R.width - 6;
    const subjectY = new Map<string, number>();
    root.querySelectorAll<HTMLElement>("[data-subject-head]").forEach((el) => {
      const r = el.getBoundingClientRect();
      subjectY.set(el.dataset.subjectHead!, r.top + r.height / 2 - R.top);
    });
    const out: Arc[] = [];
    root.querySelectorAll<HTMLElement>("[data-leaf]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const y = r.top + Math.min(r.height / 2, 16) - R.top;
      const x0 = r.right - R.left + 8;
      (el.dataset.also || "").split("|").filter(Boolean).forEach((s, i) => {
        const ty = subjectY.get(s);
        if (ty === undefined) return;
        const bulge = Math.min(gutter, x0 + 26 + Math.min(70, Math.abs(ty - y) * 0.12) + i * 8);
        out.push({
          id: `${el.dataset.leaf}~${s}`,
          from: el.dataset.leaf!,
          to: s,
          d: `M${x0} ${y} C${bulge} ${y} ${bulge} ${ty} ${x0 - 4} ${ty}`,
        });
      });
    });
    setSize({ w: R.width, h: R.height });
    setArcs(out);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, branches]);

  useEffect(() => {
    const ro = new ResizeObserver(() => measure());
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, [measure]);

  const leafOn = (b: Branch, l: Leaf) =>
    !hover ||
    hover.leaf === l.id ||
    (hover.subject !== undefined && (b.name === hover.subject || l.also.includes(hover.subject)));
  const subjectOn = (name: string) => {
    if (!hover) return true;
    if (hover.subject) return hover.subject === name;
    const leaf = branches.flatMap((b) => b.leaves.map((l) => ({ b, l }))).find((x) => x.l.id === hover.leaf);
    return !!leaf && (leaf.b.name === name || leaf.l.also.includes(name));
  };
  const arcOn = (a: Arc) => !!hover && (hover.leaf === a.from || hover.subject === a.to);

  return (
    <div className="gt" ref={box} data-hover={hover ? "" : undefined}>
      <p className="gt-root">
        <Sprout stage="evergreen" size={24} base={base} />
        <span>What I keep thinking about</span>
      </p>
      <ul className="gt-branches">
        {branches.map((b) => (
          <li key={b.name} className="gt-branch" data-on={subjectOn(b.name) ? "" : undefined}>
            <p
              className="gt-subject"
              data-subject-head={b.name}
              onPointerEnter={() => setHover({ subject: b.name })}
              onPointerLeave={() => setHover(null)}
            >
              <span className="gt-name">{b.name}</span>
              <span className="gt-count">{b.count}</span>
            </p>
            {b.leaves.length === 0 && <p className="gt-empty">Reached only through the arcs, so far.</p>}
            <ul className="gt-leaves">
              {b.leaves.map((l) => (
                <li
                  key={l.id}
                  className="gt-leaf"
                  data-kind={l.kind}
                  data-on={leafOn(b, l) ? "" : undefined}
                  onPointerEnter={() => setHover({ leaf: l.id })}
                  onPointerLeave={() => setHover(null)}
                >
                  <span className="gt-ico" aria-hidden="true">
                    {l.kind === "thought" ? <Sprout stage={l.stage} size={20} base={base} /> : <i className="gt-fruit" />}
                  </span>
                  <span className="gt-text" data-leaf={l.id} data-also={l.also.join("|")}>
                    {l.kind !== "thought" && <span className="gt-kind">{l.kind === "article" ? "Article" : "Notes"}</span>}
                    {l.href ? (
                      <a href={l.href} dangerouslySetInnerHTML={{ __html: l.html }} />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: l.html }} />
                    )}
                    {l.also.length > 0 && <span className="gt-also"> ↗ {l.also.join(", ")}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <svg className="gt-links" width={size.w} height={size.h} aria-hidden="true">
        {arcs.map((a) => (
          <path key={a.id} d={a.d} data-on={arcOn(a) ? "" : undefined} />
        ))}
      </svg>
    </div>
  );
}
