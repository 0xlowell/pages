"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Fragment } from "../lib/fragments";

type Subject = { name: string; count: number };
type Item = Fragment & { vt?: string };

const kindLabel: Record<Fragment["kind"], string> = { thought: "", article: "Article", page: "Summary" };

// One pigment per subject, in order of appearance. `on` is the ink that reads on it.
const pigments = [
  { name: "ultramarine", bg: "#2438c9", on: "#ffffff" },
  { name: "vermilion", bg: "#e2442a", on: "#ffffff" },
  { name: "viridian", bg: "#147a5a", on: "#ffffff" },
  { name: "cadmium", bg: "#f0c02c", on: "#161616" },
  { name: "madder", bg: "#c63c76", on: "#ffffff" },
  { name: "cerulean", bg: "#2588bd", on: "#ffffff" },
  { name: "umber", bg: "#76553a", on: "#ffffff" },
  { name: "ink", bg: "#161616", on: "#ffffff" },
];

const C = 500;
const R = 470;
const n1 = (n: number) => Math.round(n * 10) / 10;

export default function Collage({ items, subjects, intro }: { items: Item[]; subjects: Subject[]; intro: string }) {
  const [active, setActive] = useState<string | null>(null); // pinned subject
  const [over, setOver] = useState<string | null>(null); // subject under the pointer
  const [focus, setFocus] = useState<string | null>(null); // fragment under the pointer
  const rows = useRef(new Map<string, HTMLElement>());
  const before = useRef(new Map<string, number>());

  const index = new Map(subjects.map((s, i) => [s.name, i]));
  const pigment = (name: string) => pigments[(index.get(name) ?? 0) % pigments.length];
  const point = (name: string, r = R, shift = 0) => {
    const a = ((index.get(name) ?? 0) / subjects.length) * Math.PI * 2 - Math.PI / 2 + shift;
    return { x: C + r * Math.cos(a), y: C + r * Math.sin(a), cos: Math.cos(a), sin: Math.sin(a) };
  };

  const select = useCallback((next: string | null) => {
    before.current = new Map([...rows.current].map(([id, el]) => [id, el.getBoundingClientRect().top]));
    setActive(next);
    history.replaceState(null, "", next ? `#${next}` : location.pathname + location.search);
  }, []);

  // Rows glide to their new position instead of jumping.
  useLayoutEffect(() => {
    if (!before.current.size) return;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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

  // The pinned subject floods the whole page with its pigment.
  useEffect(() => {
    const root = document.documentElement;
    const vars = ["--bg", "--paper", "--ink", "--ink-2", "--rule", "--line", "--focus"];
    if (active) {
      const p = pigments[(subjects.findIndex((s) => s.name === active) + pigments.length) % pigments.length];
      root.style.setProperty("--bg", p.bg);
      root.style.setProperty("--paper", p.bg);
      root.style.setProperty("--ink", p.on);
      root.style.setProperty("--focus", p.on);
      root.style.setProperty("--ink-2", `color-mix(in srgb, ${p.on} 74%, ${p.bg})`);
      root.style.setProperty("--rule", `color-mix(in srgb, ${p.on} 22%, ${p.bg})`);
      root.style.setProperty("--line", `color-mix(in srgb, ${p.on} 38%, ${p.bg})`);
    }
    return () => vars.forEach((v) => root.style.removeProperty(v));
  }, [active, subjects]);

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

  const lit = over ?? active; // the subject currently emphasised
  const focused = items.find((f) => f.id === focus) || null;
  const isOn = (f: Item) => (focus ? f.id === focus : lit ? f.subjects.includes(lit) : false);
  const anyOn = Boolean(focus || lit);
  const flood = over && over !== active ? pigment(over) : null;

  const near = new Set<string>();
  if (focused) focused.subjects.forEach((s) => near.add(s));
  else if (lit) items.filter((f) => f.subjects.includes(lit)).forEach((f) => f.subjects.forEach((s) => near.add(s)));

  // Geometry: an idea with two subjects is a line across the wheel; with three, a
  // triangle; with one, a bead just inside the rim.
  const pairCount = new Map<string, number>();
  const soloCount = new Map<string, number>();
  const pairTotal = new Map<string, number>();
  items.forEach((f) => {
    const s = f.subjects.filter((x) => index.has(x));
    if (s.length === 2) {
      const key = [...s].sort().join("|");
      pairTotal.set(key, (pairTotal.get(key) || 0) + 1);
    }
  });
  const shapes = items.map((f) => {
    const s = f.subjects.filter((x) => index.has(x));
    if (s.length === 1) {
      const k = soloCount.get(s[0]) || 0;
      soloCount.set(s[0], k + 1);
      // Beads sit on the rim itself, threaded just after their subject.
      const p = point(s[0], R, (k + 1) * 0.075);
      return { f, bead: p, d: "" };
    }
    if (s.length === 2) {
      const key = [...s].sort().join("|");
      const k = pairCount.get(key) || 0;
      pairCount.set(key, k + 1);
      const [a, b] = [...s].sort().map((x) => point(x));
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const spread = (k - ((pairTotal.get(key) || 1) - 1) / 2) * 46;
      const cx = mx + (C - mx) * 0.7 + (-(b.y - a.y) / len) * spread;
      const cy = my + (C - my) * 0.7 + ((b.x - a.x) / len) * spread;
      return { f, bead: null, d: `M${n1(a.x)} ${n1(a.y)} Q${n1(cx)} ${n1(cy)} ${n1(b.x)} ${n1(b.y)}` };
    }
    const pts = s.map((x) => point(x));
    let d = `M${n1(pts[0].x)} ${n1(pts[0].y)}`;
    pts.forEach((p, i) => {
      const q = pts[(i + 1) % pts.length];
      const mx = (p.x + q.x) / 2;
      const my = (p.y + q.y) / 2;
      d += ` Q${n1(mx + (C - mx) * 0.45)} ${n1(my + (C - my) * 0.45)} ${n1(q.x)} ${n1(q.y)}`;
    });
    return { f, bead: null, d: d + "Z" };
  });

  const ordered = active
    ? [...items.filter((f) => f.subjects.includes(active)), ...items.filter((f) => !f.subjects.includes(active))]
    : items;
  const activeCount = active ? items.filter((f) => f.subjects.includes(active)).length : 0;
  const open = (f: Item) => {
    if (f.href) window.location.assign(f.href);
  };

  return (
    <div className="atlas">
      <div className="atlas-top">
        <div className="wheel" style={flood ? ({ "--w-ink": flood.on } as React.CSSProperties) : undefined}>
          <svg viewBox="0 0 1000 1000" role="group" aria-label="Subjects on a wheel, joined by the ideas that connect them">
            <circle className="w-disc" cx={C} cy={C} r={R} style={{ fill: flood ? flood.bg : "transparent" }} />
            {shapes.map(({ f, bead, d }) => {
              const on = isOn(f);
              const props = {
                className: "w-idea",
                "data-on": on ? "" : undefined,
                "data-dim": anyOn && !on ? "" : undefined,
                "data-link": f.href ? "" : undefined,
                tabIndex: 0,
                role: f.href ? "link" : "img",
                "aria-label": f.html.replace(/<[^>]+>/g, ""),
                onPointerEnter: () => setFocus(f.id),
                onPointerLeave: () => setFocus(null),
                onFocus: () => setFocus(f.id),
                onBlur: () => setFocus(null),
                onClick: () => open(f),
                onKeyDown: (e: React.KeyboardEvent) => e.key === "Enter" && open(f),
              };
              return bead ? (
                <g key={f.id} {...props}>
                  <circle className="w-hit" cx={n1(bead.x)} cy={n1(bead.y)} r="18" />
                  <circle className="w-bead" cx={n1(bead.x)} cy={n1(bead.y)} r="8" />
                </g>
              ) : (
                <g key={f.id} {...props}>
                  <path className="w-hit" d={d} />
                  <path className="w-line" d={d} />
                </g>
              );
            })}
            {subjects.map((s) => {
              const p = point(s.name);
              return <circle key={s.name} className="w-node" cx={n1(p.x)} cy={n1(p.y)} r="9" data-on={near.has(s.name) || lit === s.name ? "" : undefined} />;
            })}
          </svg>
          {subjects.map((s, i) => {
            const p = point(s.name);
            const tx = p.cos > 0.3 ? "0.875rem" : p.cos < -0.3 ? "calc(-100% - 0.875rem)" : "-50%";
            const ty = p.sin > 0.3 ? "0.5rem" : p.sin < -0.3 ? "calc(-100% - 0.5rem)" : "-50%";
            return (
              <button
                type="button"
                key={s.name}
                className="w-label"
                style={{ left: `${50 + 50 * (R / C) * p.cos}%`, top: `${50 + 50 * (R / C) * p.sin}%`, transform: `translate(${tx}, ${ty})` }}
                aria-pressed={active === s.name}
                data-near={near.has(s.name) ? "" : undefined}
                title={`Press ${i + 1}`}
                onPointerEnter={() => setOver(s.name)}
                onPointerLeave={() => setOver(null)}
                onFocus={() => setOver(s.name)}
                onBlur={() => setOver(null)}
                onClick={() => select(active === s.name ? null : s.name)}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <div className="pane" aria-live="polite">
          {focused ? (
            <>
              {kindLabel[focused.kind] && <p className="pane-kind">{kindLabel[focused.kind]}</p>}
              <p className="pane-idea" dangerouslySetInnerHTML={{ __html: focused.html }} />
              <p className="pane-meta">
                {focused.subjects.join(" + ")}
                {focused.href ? " →" : ""}
              </p>
            </>
          ) : lit ? (
            <>
              <p className="pane-subject">{lit}</p>
              <p className="pane-meta">
                {items.filter((f) => f.subjects.includes(lit)).length} ideas
                {near.size > 1 && <>, tied to {[...near].filter((s) => s !== lit).join(", ")}</>}.
              </p>
            </>
          ) : (
            <>
              <h1>{intro}</h1>
              <p className="pane-meta">
                Each line is an idea that ties two subjects together. Each bead is one that stays with a single
                subject. Point at them, or pick a subject.
              </p>
            </>
          )}
        </div>
      </div>

      <div className="stream-head">
        <p>
          {active ? (
            <>
              {activeCount} of {items.length} on {active}.{" "}
              <button type="button" onClick={() => select(null)}>Show everything</button>
            </>
          ) : (
            <>Everything, in order.</>
          )}
        </p>
      </div>

      <ol className="stream">
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
