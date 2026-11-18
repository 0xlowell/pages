"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Field, Thing, Tile } from "../lib/farm";
import { GITHUB_URL } from "./Site";

const TS = 16; // tile size in the sheets
const SHEETS = { t: { src: "garden/town.png", cols: 12 }, f: { src: "garden/farm.png", cols: 8 } };
const STAGE: Record<Thing["stage"], string> = { seedling: "Seedling", budding: "Budding", evergreen: "Evergreen" };
const KIND: Record<Thing["kind"], string> = { thought: "Crop", article: "Harvest", page: "Field notes" };

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

type Props = {
  W: number;
  H: number;
  ground: Tile[];
  things: Tile[];
  fields: Field[];
  crops: Thing[];
  trees: Thing[];
  cottage: Thing | null;
  cropTile: Record<Thing["stage"], number>;
  base: string;
};

export default function Farm({ W, H, ground, things, fields, crops, trees, cottage, cropTile, base }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(3);
  const [hover, setHover] = useState<string | null>(null);
  const [field, setField] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
    const [tipAt, setTipAt] = useState<{ x: number; y: number } | null>(null);

  const all = useMemo(() => [...crops, ...trees, ...(cottage ? [cottage] : [])], [crops, trees, cottage]);
  const byId = useMemo(() => new Map(all.map((t) => [t.id, t])), [all]);

  // The largest whole-number scale that fits the window, so pixels stay crisp.
  useEffect(() => {
    const fit = () => {
      // On wide screens the journal takes a column on the right.
      const side = window.innerWidth >= 1000 ? 440 : 0;
      const availW = window.innerWidth - side - 32;
      const availH = side ? window.innerHeight - 32 : Infinity;
      const s = Math.floor(Math.min(availW / (W * TS), availH / (H * TS)) * 2) / 2;
      setScale(Math.max(1, Math.min(4, s)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [W, H]);

  // Paint the ground and the scenery once per scale.
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    c.width = W * TS * scale;
    c.height = H * TS * scale;
    ctx.imageSmoothingEnabled = false;
    const imgs = { t: new Image(), f: new Image() };
    let loaded = 0;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      const put = (t: Tile) => {
        const sh = SHEETS[t.s];
        const sx = (t.i % sh.cols) * TS;
        const sy = Math.floor(t.i / sh.cols) * TS;
        const z = t.z ?? 1;
        ctx.drawImage(imgs[t.s], sx, sy, TS, TS, t.x * TS * scale, t.y * TS * scale, TS * scale * z, TS * scale * z);
      };
      ground.forEach(put);
      things.forEach(put);
    };
    (["t", "f"] as const).forEach((k) => {
      imgs[k].onload = () => {
        loaded += 1;
        if (loaded === 2) draw();
      };
      imgs[k].src = `${base}/${SHEETS[k].src}`;
    });
  }, [W, H, ground, things, scale, base]);

  const select = useCallback((id: string | null) => {
    setSel(id);
    history.replaceState(null, "", id ? `#${id}` : location.pathname + location.search);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (byId.has(h)) setSel(h);
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        select(null);
        setField(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, [byId, select]);

  const px = (n: number) => n * TS * scale;
  const focus = hover ?? sel;
  const focusSubjects = focus ? byId.get(focus)?.subjects ?? [] : field ? [fields.find((f) => f.id === field)!.name] : [];
  const dim = (t: Thing) => (focus || field ? !(t.id === focus || t.subjects.some((s) => focusSubjects.includes(s))) : false);

  const selected = sel ? byId.get(sel) : null;
  const tip = hover && !selected ? byId.get(hover) : null;
  const neighbours = selected
    ? selected.subjects.map((s) => ({ s, list: all.filter((t) => t.id !== selected.id && t.subjects.includes(s)) }))
    : [];

  const thingButton = (t: Thing, extra: string) => (
    <button
      key={t.id}
      type="button"
      className={`f-hit ${extra}`}
      data-dim={dim(t) ? "" : undefined}
      data-sel={sel === t.id ? "" : undefined}
      style={{ left: px(t.x), top: px(t.y), width: px(t.w), height: px(t.h) }}
      aria-label={`${KIND[t.kind]}, ${STAGE[t.stage].toLowerCase()}: ${t.text}`}
      onPointerEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTipAt({ x: r.left + r.width / 2, y: r.top });
        setHover(t.id);
      }}
      onPointerLeave={() => setHover(null)}
      onFocus={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setTipAt({ x: r.left + r.width / 2, y: r.top });
        setHover(t.id);
      }}
      onBlur={() => setHover(null)}
      onClick={() => select(sel === t.id ? null : t.id)}
    >
      {t.kind === "thought" && (
        <span
          className="f-crop"
          style={{
            backgroundImage: `url(${base}/garden/farm.png)`,
            backgroundSize: `${8 * TS * scale * 2}px auto`,
            backgroundPosition: `-${(cropTile[t.stage] % 8) * TS * scale * 2}px -${Math.floor(cropTile[t.stage] / 8) * TS * scale * 2}px`,
          }}
        />
      )}
      {t.kind === "article" && <span className="f-fruit" />}
    </button>
  );

  const activeField = field ? fields.find((f) => f.id === field) : null;
  const shownFields = activeField ? [activeField] : fields;
  const row = (t: Thing) => (
    <li key={t.id}>
      <button
        type="button"
        data-on={hover === t.id ? "" : undefined}
        onPointerEnter={() => setHover(t.id)}
        onPointerLeave={() => setHover(null)}
        onFocus={() => setHover(t.id)}
        onBlur={() => setHover(null)}
        onClick={() => select(t.id)}
      >
        <span className="f-ico" data-kind={t.kind} data-stage={t.stage} aria-hidden="true" />
        <span className="t">{t.text}</span>
        <span className="k">{t.kind === "thought" ? STAGE[t.stage] : KIND[t.kind]}</span>
      </button>
    </li>
  );

  return (
    <div className="farm" style={{ ["--s" as string]: scale }}>
      <header className="f-head">
        <div className="f-head-row">
          <p className="f-name">Lowell&apos;s garden</p>
          <nav aria-label="Primary">
            <Link href="/work/">Work</Link>
            <Link href="/writing/">Writing</Link>
            <a href={GITHUB_URL} rel="me noopener">
              GitHub
            </a>
          </nav>
        </div>
        <p className="f-lede">
          Things I find worth thinking about, kept as a garden. Each field is a subject, each crop an idea at its
          stage of growth, each fruit tree a longer piece. Read them in the journal, or wander the farm.
        </p>
        <p className="f-legend" aria-hidden="true">
          <span><span className="f-ico" data-kind="thought" data-stage="seedling" /> seedling</span>
          <span><span className="f-ico" data-kind="thought" data-stage="budding" /> budding</span>
          <span><span className="f-ico" data-kind="thought" data-stage="evergreen" /> evergreen</span>
          <span><span className="f-ico" data-kind="article" /> harvest</span>
        </p>
      </header>

      <div className="f-scroll" ref={wrap}>
        <div className="f-map" style={{ width: px(W), height: px(H) }}>
          <canvas ref={canvas} style={{ width: px(W), height: px(H) }} aria-hidden="true" />

          {fields.map((f) => (
            <button
              key={f.id}
              type="button"
              className="f-sign"
              data-on={field === f.id || focusSubjects.includes(f.name) ? "" : undefined}
              style={{ left: px(f.x + 1) + 2, top: px(f.y - 1) + px(1) * 0.12 }}
              onPointerEnter={() => setField(f.id)}
              onFocus={() => setField(f.id)}
              onClick={() => {
                select(null);
                setField(field === f.id ? null : f.id);
              }}
            >
              {f.name} <span>{f.count}</span>
            </button>
          ))}

          {crops.map((t) => thingButton(t, "is-crop"))}
          {trees.map((t) => thingButton(t, "is-tree"))}
          {cottage && thingButton(cottage, "is-house")}
        </div>
      </div>

      {tip && tipAt && (
        <div className="f-tip" style={{ left: tipAt.x, top: tipAt.y }} role="tooltip">
          <p className="f-tip-kind">
            {KIND[tip.kind]} · {STAGE[tip.stage]}
          </p>
          <p className="f-tip-text">{tip.text}</p>
        </div>
      )}

      <aside className="f-journal" aria-label="Journal">
        {selected ? (
          <article className="f-detail">
            <button type="button" className="f-back" onClick={() => select(null)}>
              ← Journal
            </button>
            <p className="f-detail-kind">
              <span className="f-ico" data-kind={selected.kind} data-stage={selected.stage} aria-hidden="true" />
              {KIND[selected.kind]} · {STAGE[selected.stage]}
            </p>
            <p className="f-detail-text" dangerouslySetInnerHTML={{ __html: selected.html }} />
            <p className="f-detail-dates">
              Planted {fmt(selected.planted)}
              {selected.tended !== selected.planted && <> · tended {fmt(selected.tended)}</>}
            </p>
            {selected.href && (
              <a className="f-open" href={selected.href}>
                {selected.kind === "article" ? "Read the harvest" : selected.kind === "page" ? "Open the field notes" : "Follow the thread"} →
              </a>
            )}
            {neighbours.map(({ s, list }) => (
              <section key={s}>
                <h2>
                  Also in the {s} field <span>{list.length}</span>
                </h2>
                <ul className="f-rows">{list.length ? list.map(row) : <li className="f-empty">Nothing else grows here yet.</li>}</ul>
              </section>
            ))}
          </article>
        ) : (
          <>
            {activeField && (
              <button type="button" className="f-back" onClick={() => setField(null)}>
                ← Every field
              </button>
            )}
            {shownFields.map((f) => (
              <section key={f.id} data-on={field === f.id ? "" : undefined}>
                <h2>
                  {f.name} <span>{f.count}</span>
                </h2>
                <ul className="f-rows">{all.filter((t) => t.subjects.includes(f.name)).map(row)}</ul>
              </section>
            ))}
          </>
        )}
        <p className="f-credit">
          Pixel art by <a href="https://kenney.nl/assets/tiny-town">Kenney</a> and{" "}
          <a href="https://lushmustache.itch.io/pixelfarm">LushMustache</a>, CC0.
        </p>
      </aside>
    </div>
  );
}
