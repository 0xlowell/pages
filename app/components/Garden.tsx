"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Bed, Plant, Walk } from "../lib/garden";
import { blob, r1, rng } from "../lib/shapes";
import { GITHUB_URL } from "./Site";

const STAGE: Record<Plant["stage"], string> = { seedling: "Seedling", budding: "Budding", evergreen: "Evergreen" };
const KIND: Record<Plant["kind"], string> = { thought: "Idea", article: "Article", page: "Summary" };
const FLOWERS = ["#f6d36b", "#f2a59c", "#fff6e0", "#d996bf", "#f0b467"];

// Canopy palettes, light to dark. Articles are blue-green; the summary is an old golden tree.
const CANOPY: Record<string, [string, string, string]> = {
  thought: ["#b7d98c", "#79ae5e", "#3f7442"],
  article: ["#a9d3b3", "#5f9f86", "#2f6556"],
  page: ["#f1d98a", "#d3a94f", "#8d6a2c"],
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

/* ---------- One plant, seen from above ---------- */

function PlantShape({ p }: { p: Plant }) {
  const rand = rng(p.seed);
  const { x, y, r } = p;
  const [light, mid, dark] = CANOPY[p.kind];

  if (p.parent) {
    // A cutting: three small leaves around a stake, the idea's echo in another bed.
    const a = rand() * 120;
    return (
      <g transform={`rotate(${r1(a)} ${x} ${y})`}>
        <ellipse cx={x + 1.5} cy={y + 2.5} rx={r * 0.9} ry={r * 0.7} className="g-shadow" />
        {[0, 120, 240].map((d) => (
          <ellipse key={d} cx={x + r * 0.45} cy={y} rx={r * 0.55} ry={r * 0.26} fill={d ? "#86c05c" : "#9fd06f"} transform={`rotate(${d} ${x} ${y})`} />
        ))}
        <circle cx={x} cy={y} r={r * 0.2} fill={CANOPY[p.kind][1]} />
      </g>
    );
  }

  if (p.stage === "seedling" && p.kind === "thought") {
    // A small patch of turned soil with two leaves.
    const a = rand() * 180;
    return (
      <>
        <ellipse cx={x + 2} cy={y + 3} rx={r * 0.95} ry={r * 0.8} className="g-shadow" />
        <path d={blob(x, y, r * 0.8, p.seed, 0.12, 9)} fill="#b58b5f" />
        <g transform={`rotate(${r1(a)} ${x} ${y})`}>
          <ellipse cx={x - r * 0.42} cy={y} rx={r * 0.5} ry={r * 0.24} fill="#9fd06f" transform={`rotate(-28 ${x} ${y})`} />
          <ellipse cx={x + r * 0.42} cy={y} rx={r * 0.5} ry={r * 0.24} fill="#86c05c" transform={`rotate(28 ${x} ${y})`} />
          <circle cx={x} cy={y} r={r * 0.12} fill="#5d9443" />
        </g>
      </>
    );
  }

  if (p.stage === "budding" && p.kind === "thought") {
    const flowers = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + rand();
      const d = r * (0.38 + rand() * 0.3);
      return { cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d, c: FLOWERS[Math.floor(rand() * FLOWERS.length)] };
    });
    return (
      <>
        <path d={blob(x + r * 0.22, y + r * 0.3, r * 1.02, p.seed + 3, 0.1)} className="g-shadow" />
        <path d={blob(x, y, r, p.seed, 0.14, 11)} fill={mid} />
        <path d={blob(x - r * 0.12, y - r * 0.14, r * 0.68, p.seed + 1, 0.16, 10)} fill={light} opacity="0.9" />
        {flowers.map((f, i) => (
          <g key={i}>
            <circle cx={r1(f.cx)} cy={r1(f.cy)} r={r * 0.15} fill={f.c} />
            <circle cx={r1(f.cx)} cy={r1(f.cy)} r={r * 0.05} fill="#c98a3a" />
          </g>
        ))}
      </>
    );
  }

  // A tree: soft cast shadow, then the canopy in three washes, lightest towards the sun.
  const leaves = Array.from({ length: 5 }, () => {
    const a = rand() * Math.PI * 2;
    const d = r * (0.2 + rand() * 0.45);
    return { cx: x - r * 0.2 + Math.cos(a) * d, cy: y - r * 0.22 + Math.sin(a) * d * 0.8, rr: r * (0.09 + rand() * 0.07) };
  });
  return (
    <>
      <path d={blob(x + r * 0.32, y + r * 0.42, r * 1.05, p.seed + 3, 0.1)} className="g-shadow" />
      <path d={blob(x, y, r, p.seed, 0.12, 13)} fill={dark} />
      <path d={blob(x - r * 0.1, y - r * 0.12, r * 0.8, p.seed + 1, 0.14, 12)} fill={mid} />
      <path d={blob(x - r * 0.26, y - r * 0.3, r * 0.45, p.seed + 2, 0.18, 10)} fill={light} opacity="0.95" />
      {leaves.map((l, i) => (
        <circle key={i} cx={r1(l.cx)} cy={r1(l.cy)} r={r1(l.rr)} fill={light} opacity="0.75" />
      ))}
      {p.kind !== "thought" && <circle cx={x + r * 0.62} cy={y + r * 0.62} r={4.5} className="g-tag" />}
    </>
  );
}

/* ---------- The garden ---------- */

export default function Garden({ beds, plants, walks, width, height }: { beds: Bed[]; plants: Plant[]; walks: Walk[]; width: number; height: number }) {
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [bedFocus, setBedFocus] = useState<string | null>(null);
  const [grown, setGrown] = useState(Infinity);
  const [view, setView] = useState<"garden" | "list">("garden");
  const [tip, setTip] = useState<{ x: number; y: number; p: Plant } | null>(null);
  const timer = useRef(0);

  const byId = useMemo(() => new Map(plants.filter((p) => !p.parent).map((p) => [p.id, p])), [plants]);
  const ideas = useMemo(() => plants.filter((p) => !p.parent), [plants]);
  const idOf = (p: Plant) => p.parent ?? p.id;
  const bedById = useMemo(() => new Map(beds.map((b) => [b.id, b])), [beds]);
  const bedByName = useMemo(() => new Map(beds.map((b) => [b.name, b])), [beds]);

  const select = useCallback((id: string | null) => {
    setSel(id);
    setTip(null);
    history.replaceState(null, "", id ? `#${id}` : location.pathname + location.search);
  }, []);

  const stage = useRef<HTMLDivElement>(null);

  // Open a page from the address (#some-page) once the garden is drawn.
  // On a phone, start with the middle of the garden in view.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const st = stage.current;
      if (st && st.scrollWidth > st.clientWidth) st.scrollLeft = (st.scrollWidth - st.clientWidth) / 2;
      const h = decodeURIComponent(location.hash.slice(1));
      if (byId.has(h)) setSel(h);
    });
    return () => cancelAnimationFrame(raf);
  }, [byId]);

  // Replay the garden growing, one plant at a time, in planting order.
  const grow = useCallback(() => {
    clearInterval(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setGrown(ideas.length);
      return;
    }
    setGrown(0);
    let n = 0;
    timer.current = window.setInterval(() => {
      n += 1;
      setGrown(n);
      if (n >= ideas.length) clearInterval(timer.current);
    }, 280);
  }, [ideas.length]);

  useEffect(() => () => clearInterval(timer.current), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as Element).closest("input, textarea")) return;
      if (e.key === "Escape") {
        select(null);
        setBedFocus(null);
      } else if (e.key === "g") grow();
      else if (e.key === "l") setView((v) => (v === "garden" ? "list" : "garden"));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [select, grow]);

  // What is in focus: a plant (and the beds it belongs to) or a bed.
  const focusPlant = hover ?? sel;
  const litBeds = new Set<string>();
  if (focusPlant) byId.get(focusPlant)?.subjects.forEach((s) => bedByName.get(s) && litBeds.add(bedByName.get(s)!.id));
  if (bedFocus) litBeds.add(bedFocus);
  const plantLit = (p: Plant) => {
    if (focusPlant) return idOf(p) === focusPlant || p.subjects.some((s) => litBeds.has(bedByName.get(s)?.id ?? ""));
    if (bedFocus) return p.subjects.includes(bedById.get(bedFocus)!.name);
    return true;
  };
  const dim = Boolean(focusPlant || bedFocus);

  const selected = sel ? byId.get(sel) : null;
  const neighbours = selected
    ? selected.subjects.map((s) => ({ s, list: ideas.filter((p) => p.id !== selected.id && p.subjects.includes(s)) }))
    : [];

  const showTip = (e: React.PointerEvent | React.FocusEvent, p: Plant) => {
    const r = (e.currentTarget as Element).getBoundingClientRect();
    setTip({ x: r.left + r.width / 2, y: r.top, p: byId.get(idOf(p)) ?? p });
  };

  const stats = { plants: ideas.length, beds: beds.length };

  return (
    <div className="garden" data-view={view}>
      <div className="g-sky" aria-hidden="true" />

      <div className="g-stage" ref={stage}>
        <svg
          className="g-map"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label="A garden of ideas. Beds are subjects; plants are pages."
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              select(null);
              setBedFocus(null);
            }
          }}
        >
          <defs>
            <radialGradient id="soil" cx="40%" cy="35%" r="75%">
              <stop offset="0" stopColor="#d9b78c" />
              <stop offset="0.7" stopColor="#c19a6c" />
              <stop offset="1" stopColor="#a87f55" />
            </radialGradient>
            <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <filter id="meadow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="38" />
            </filter>
            <filter id="grain">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
              <feColorMatrix values="0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.35 0" />
              <feComposite in2="SourceGraphic" operator="in" />
            </filter>
          </defs>

          {/* Meadow: soft washes of green, painted once. */}
          <g filter="url(#meadow)" aria-hidden="true">
            {Array.from({ length: 9 }, (_, i) => {
              const rand = rng(100 + i);
              return (
                <ellipse
                  key={i}
                  cx={r1(rand() * width)}
                  cy={r1(rand() * height)}
                  rx={r1(160 + rand() * 260)}
                  ry={r1(110 + rand() * 180)}
                  fill={["#bcd49a", "#9fc07f", "#c9dba5", "#93b673"][i % 4]}
                  opacity="0.75"
                />
              );
            })}
          </g>

          {/* Little wild flowers and clover in the grass. */}
          <g aria-hidden="true">
            {Array.from({ length: 170 }, (_, i) => {
              const rand = rng(900 + i);
              const x = r1(rand() * width);
              const y = r1(rand() * height);
              if (beds.some((b) => Math.hypot(b.x - x, b.y - y) < b.r + 40)) return null;
              const kind = rand();
              if (kind < 0.55)
                return <path key={i} d={`M${x} ${y} l-3 -7 M${x} ${y} l1 -8 M${x} ${y} l4 -6`} className="g-tuft" />;
              return <circle key={i} cx={x} cy={y} r={r1(1.6 + rand() * 1.6)} fill={["#fffaf0", "#f6e08a", "#f4c3c0", "#e8f1d4"][Math.floor(rand() * 4)]} />;
            })}
          </g>

          {/* Stepping stones between beds that share pages. */}
          {walks.map((w) => (
            <g key={w.id} className="g-walk" data-on={litBeds.has(w.a) && litBeds.has(w.b) ? "" : undefined} aria-hidden="true">
              {w.stones.map((s, i) => (
                <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
              ))}
            </g>
          ))}

          {/* Beds */}
          {beds.map((b) => (
            <g
              key={b.id}
              className="g-bed"
              data-lit={litBeds.has(b.id) ? "" : undefined}
              data-dim={dim && !litBeds.has(b.id) ? "" : undefined}
              onPointerEnter={() => !sel && setBedFocus(b.id)}
              onPointerLeave={() => !sel && setBedFocus(null)}
            >
              <path d={b.rim} className="g-bed-shadow" transform="translate(5 7)" />
              <path d={b.rim} className="g-bed-rim" />
              <path d={b.shape} fill="url(#soil)" />
              <path d={b.shape} filter="url(#grain)" fill="#000" />
              <circle cx={b.x} cy={b.y} r={b.r * 0.62} className="g-furrow" />
              <circle cx={b.x} cy={b.y} r={b.r * 0.32} className="g-furrow" />
              <path id={`label-${b.id}`} d={b.label} fill="none" />
              <text className="g-label">
                <textPath href={`#label-${b.id}`} startOffset="50%" textAnchor="middle">
                  {b.name}
                  <tspan className="g-count"> · {b.count}</tspan>
                </textPath>
              </text>
            </g>
          ))}

          {/* Plants, bottom to top so lower canopies overlap the ones behind them. */}
          {[...plants]
            .sort((a, b) => a.y - b.y)
            .map((p) => (
              <g
                key={p.id}
                className="g-plant"
                data-grown={p.order < grown ? "" : undefined}
                data-sel={sel === idOf(p) ? "" : undefined}
                data-cutting={p.parent ? "" : undefined}
                data-dim={!plantLit(p) ? "" : undefined}
                style={{ transformOrigin: `${p.x}px ${p.y}px`, ["--d" as string]: `${p.order * 40}ms` }}
                tabIndex={0}
                role="button"
                aria-label={`${p.parent ? "Cutting of " : ""}${STAGE[p.stage]} ${KIND[p.kind].toLowerCase()}: ${p.text}`}
                aria-pressed={sel === idOf(p)}
                onPointerEnter={(e) => {
                  setHover(idOf(p));
                  showTip(e, p);
                }}
                onPointerLeave={() => {
                  setHover(null);
                  setTip(null);
                }}
                onFocus={(e) => {
                  setHover(idOf(p));
                  showTip(e, p);
                }}
                onBlur={() => {
                  setHover(null);
                  setTip(null);
                }}
                onClick={() => select(sel === idOf(p) ? null : idOf(p))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    select(sel === idOf(p) ? null : idOf(p));
                  }
                }}
              >
                <circle cx={p.x} cy={p.y} r={p.r + 9} className="g-halo" />
                <PlantShape p={p} />
              </g>
            ))}
        </svg>

        {/* Light and weather, above the map. */}
        <div className="g-light" aria-hidden="true" />
        <div className="g-clouds" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="g-motes" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => {
            const rand = rng(40 + i);
            return <i key={i} style={{ ["--i" as string]: i, left: `${r1(rand() * 96)}%`, top: `${r1(10 + rand() * 80)}%` }} />;
          })}
        </div>
      </div>

      {tip && !selected && (
        <p className="g-tip" style={{ left: tip.x, top: tip.y }} role="tooltip">
          <span className="g-tip-stage">{STAGE[tip.p.stage]}</span>
          {tip.p.text}
        </p>
      )}

      {view === "list" && (
        <div className="g-list">
          <div className="g-list-inner">
            {beds.map((b) => (
              <section key={b.id}>
                <h2>
                  {b.name} <span>{b.count}</span>
                </h2>
                <ul>
                  {ideas
                    .filter((p) => p.subjects.includes(b.name))
                    .map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setView("garden");
                            select(p.id);
                          }}
                        >
                          <span className="g-stage-dot" data-stage={p.stage} aria-hidden="true" />
                          <span className="t">{p.text}</span>
                          <span className="k">{STAGE[p.stage]}</span>
                        </button>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}

      <header className="g-top">
        <div>
          <p className="g-name">Lowell&apos;s garden</p>
          <p className="g-lede">Ideas I keep tending. A subject grows as I write about it.</p>
        </div>
        <nav aria-label="Primary">
          <Link href="/work/">Work</Link>
          <Link href="/writing/">Writing</Link>
          <a href={GITHUB_URL} rel="me noopener">
            GitHub ↗
          </a>
        </nav>
      </header>

      <div className="g-bar">
        <button type="button" onClick={grow} title="Replay the garden growing (G)">
          Watch it grow
        </button>
        <span className="g-sep" />
        <button type="button" aria-pressed={view === "list"} onClick={() => setView((v) => (v === "garden" ? "list" : "garden"))}>
          {view === "list" ? "Back to the garden" : "Plant list"}
        </button>
        <span className="g-sep" />
        <ul className="g-legend" aria-label="Growth stages">
          <li>
            <span className="g-stage-dot" data-stage="seedling" />
            seedling
          </li>
          <li>
            <span className="g-stage-dot" data-stage="budding" />
            budding
          </li>
          <li>
            <span className="g-stage-dot" data-stage="evergreen" />
            evergreen
          </li>
        </ul>
        <span className="g-stats">
          {stats.plants} plants · {stats.beds} beds
        </span>
      </div>

      {selected && (
        <aside className="g-panel" aria-label="Page">
          <div className="g-panel-head">
            <span>
              {KIND[selected.kind]} · {STAGE[selected.stage]}
            </span>
            <button type="button" onClick={() => select(null)} aria-label="Close">
              ×
            </button>
          </div>
          {selected.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={selected.image} alt={selected.alt ?? ""} />
          )}
          <p className="g-panel-text" dangerouslySetInnerHTML={{ __html: selected.html }} />
          <p className="g-panel-dates">
            Planted {fmt(selected.planted)}
            {selected.tended !== selected.planted && <> · tended {fmt(selected.tended)}</>}
          </p>
          {selected.href && (
            <a className="g-open" href={selected.href}>
              {selected.kind === "article" ? "Read the article" : selected.kind === "page" ? "Open the summary" : "Follow the thread"} →
            </a>
          )}
          {selected.sources.length > 0 && (
            <section>
              <h2>Grew from</h2>
              <ul className="g-sources">
                {selected.sources.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>
          )}
          {neighbours.map(({ s, list }) => (
            <section key={s}>
              <h2>
                <button type="button" onClick={() => (select(null), setBedFocus(bedByName.get(s)?.id ?? null))}>
                  In the {s} bed
                </button>
                <span>{list.length}</span>
              </h2>
              <ul>
                {list.map((p) => (
                  <li key={p.id}>
                    <button type="button" onClick={() => select(p.id)}>
                      <span className="g-stage-dot" data-stage={p.stage} aria-hidden="true" />
                      {p.text}
                    </button>
                  </li>
                ))}
                {!list.length && <li className="g-empty">Nothing else grows here yet.</li>}
              </ul>
            </section>
          ))}
        </aside>
      )}
    </div>
  );
}
