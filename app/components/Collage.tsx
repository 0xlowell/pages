"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Fragment } from "../lib/fragments";

type Subject = { name: string; count: number };
type Item = Fragment & { vt?: string };

const kindLabel: Record<Fragment["kind"], string> = { thought: "", article: "Article", page: "Summary" };

export default function Collage({ items, subjects, intro }: { items: Item[]; subjects: Subject[]; intro: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [hot, setHot] = useState<string[]>([]);
  const rows = useRef(new Map<string, HTMLElement>());
  const before = useRef(new Map<string, number>());
  const stream = useRef<HTMLOListElement>(null);

  const select = useCallback((next: string | null) => {
    // Remember where every row is, so it can travel to its new place.
    before.current = new Map([...rows.current].map(([id, el]) => [id, el.getBoundingClientRect().top]));
    setActive(next);
    history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
  }, []);

  // Rows glide to their new position instead of jumping.
  useLayoutEffect(() => {
    if (!before.current.size) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = stream.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 24, behavior: reduce ? "auto" : "smooth" });
    if (!reduce) {
      rows.current.forEach((el, id) => {
        const was = before.current.get(id);
        if (was === undefined) return;
        const dy = was - el.getBoundingClientRect().top;
        if (Math.abs(dy) > 1) {
          el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], {
            duration: 460,
            easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
          });
        }
      });
    }
    before.current = new Map();
  }, [active]);

  // A subject can be linked to (#agents) and driven from the keyboard.
  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      setActive(subjects.some((s) => s.name === h) ? h : null);
    };
    fromHash();
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Escape") select(null);
      const n = Number(e.key);
      if (n >= 1 && n <= subjects.length) select(subjects[n - 1].name);
    };
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("keydown", onKey);
    };
  }, [subjects, select]);

  // Subjects that share at least one fragment with the selected one.
  const near = new Set<string>();
  if (active) items.filter((f) => f.subjects.includes(active)).forEach((f) => f.subjects.forEach((s) => near.add(s)));

  const ordered = active
    ? [...items.filter((f) => f.subjects.includes(active)), ...items.filter((f) => !f.subjects.includes(active))]
    : items;
  const shown = active ? items.filter((f) => f.subjects.includes(active)).length : items.length;

  return (
    <div className="index">
      <aside className="index-side">
        <h1>{intro}</h1>
        <ul className="subject-list" aria-label="Subjects">
          {subjects.map((s, i) => (
            <li key={s.name}>
              <button
                type="button"
                aria-pressed={active === s.name}
                data-near={active && active !== s.name && near.has(s.name) ? "" : undefined}
                data-hot={hot.includes(s.name) ? "" : undefined}
                onClick={() => select(active === s.name ? null : s.name)}
              >
                <span className="key" aria-hidden="true">{i + 1}</span>
                <span className="name">{s.name}</span>
                <span className="count">{s.count}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="index-status" aria-live="polite">
          {active ? (
            <>
              {shown} of {items.length} on {active}.{" "}
              <button type="button" onClick={() => select(null)}>Show everything</button>
            </>
          ) : (
            <span className="hint">Press 1 to {subjects.length} to follow a subject, Esc to let go.</span>
          )}
        </p>
      </aside>

      <ol className="stream" ref={stream}>
        {ordered.map((f) => {
          const off = active !== null && !f.subjects.includes(active);
          const inner = (
            <>
              {f.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.image} alt={f.alt} loading="lazy" />
              )}
              {kindLabel[f.kind] && <span className="row-kind">{kindLabel[f.kind]}</span>}
              <span
                className="row-text"
                style={f.vt ? { viewTransitionName: f.vt } : undefined}
                dangerouslySetInnerHTML={{ __html: f.html }}
              />
              <span className="row-foot">
                <span>{f.subjects.join(", ")}</span>
                {f.href && <span className="row-arrow" aria-hidden="true">{f.href.startsWith("http") ? "↗" : "→"}</span>}
              </span>
            </>
          );
          return (
            <li
              key={f.id}
              ref={(el) => {
                if (el) rows.current.set(f.id, el);
                else rows.current.delete(f.id);
              }}
              className="row"
              data-kind={f.image ? "image" : f.kind}
              data-off={off ? "" : undefined}
              onPointerEnter={() => setHot(f.subjects)}
              onPointerLeave={() => setHot([])}
              onFocus={() => setHot(f.subjects)}
              onBlur={() => setHot([])}
            >
              {f.href ? (
                // A plain link on purpose: a full navigation lets the title travel to the next page.
                <a href={f.href} rel={f.href.startsWith("http") ? "noopener" : undefined}>{inner}</a>
              ) : (
                <div>{inner}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
