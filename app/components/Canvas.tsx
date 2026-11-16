"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { GEdge, GNode } from "../lib/graph";
import { subjectId } from "../lib/ids";
import { GITHUB_URL } from "./Site";

type Cam = { x: number; y: number; k: number };
type Pt = { x: number; y: number };

// Node anatomy, shared with the CSS: a header, then one socket row per subject.
const HEAD = 32;
const ROW = 24;
const HUB = 36;

// Sockets are colour-coded by subject, the way node editors colour sockets by
// type. Roots take earth tones, branches take greens, so the palette stays calm.
const EARTH = ["#d6a24a", "#c9774f", "#b9a27a", "#a8794f"];
const LEAF = ["#5f9a6a", "#3f8a86", "#8aae5f", "#6f8f8a"];

// The garden's vocabulary. Kept in one place so every label speaks the same language.
const KIND: Record<GNode["kind"], string> = { idea: "Plant", article: "Harvest", page: "Field notes", subject: "Subject" };
const zoneName = (n: GNode) => (n.kind === "subject" ? (n.zone === "root" ? "Root" : "Branch") : KIND[n.kind]);

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const pad2 = (n: number) => String(n).padStart(2, "0");

export default function Canvas({ nodes, edges, subjects }: { nodes: GNode[]; edges: GEdge[]; subjects: string[] }) {
  const vp = useRef<HTMLDivElement>(null);
  const camRef = useRef<Cam | null>(null);
  const flying = useRef(0);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [cam, setCam] = useState<Cam | null>(null);
  const [pos, setPos] = useState<Map<string, Pt>>(() => new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }])));
  const [sel, setSel] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<"graph" | "tree">("graph");
  const [palette, setPalette] = useState(false);
  const [dragging, setDragging] = useState<"pan" | "node" | null>(null);

  useEffect(() => {
    camRef.current = cam;
  }, [cam]);

  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const color = useCallback(
    (s: string) => {
      const hub = byId.get(subjectId(s));
      const same = nodes.filter((n) => n.kind === "subject" && n.zone === hub?.zone);
      const list = hub?.zone === "root" ? EARTH : LEAF;
      return list[Math.max(0, same.findIndex((n) => n.text === s)) % list.length];
    },
    [byId, nodes],
  );
  const items = useMemo(() => nodes.filter((n) => n.kind !== "subject"), [nodes]);

  /* ---------- What is lit ---------- */

  const focus = hover ?? sel;
  const lit = useMemo(() => {
    if (!focus) return null;
    const on = new Set<string>([focus]);
    const wires = new Set<string>();
    edges.forEach((e) => {
      if (e.from === focus || e.to === focus) {
        wires.add(e.id);
        on.add(e.from);
        on.add(e.to);
      }
    });
    // One step further: ideas that share a subject with the focused idea.
    const near = new Set<string>();
    if (byId.get(focus)?.kind !== "subject") {
      edges.forEach((e) => {
        if (on.has(e.to) && !on.has(e.from)) near.add(e.from);
      });
    }
    return { on, wires, near };
  }, [focus, edges, byId]);

  /* ---------- Camera ---------- */

  useEffect(() => {
    const el = vp.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setSize({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const reduce = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const fly = useCallback((to: Cam, instant = false) => {
    cancelAnimationFrame(flying.current);
    const from = camRef.current;
    if (!from || instant || reduce()) {
      setCam(to);
      return;
    }
    const t0 = performance.now();
    const dur = 560;
    const tick = (now: number) => {
      const t = clamp((now - t0) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 4);
      // Zoom out a little mid-flight when travelling far, like a camera pulling back.
      const dist = Math.hypot(to.x - from.x, to.y - from.y);
      const dip = 1 - Math.sin(Math.PI * t) * clamp(dist / 4000, 0, 0.18);
      setCam({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e, k: (from.k + (to.k - from.k) * e) * dip });
      if (t < 1) flying.current = requestAnimationFrame(tick);
    };
    flying.current = requestAnimationFrame(tick);
  }, []);

  const panelWidth = size.w > 900 ? 380 : 0;

  const frame = useCallback(
    (ids: string[] | null, opts: { instant?: boolean; maxK?: number; withPanel?: boolean } = {}) => {
      if (!size.w) return;
      const list = ids ? nodes.filter((n) => ids.includes(n.id)) : nodes;
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      list.forEach((n) => {
        const p = pos.get(n.id)!;
        x0 = Math.min(x0, p.x);
        y0 = Math.min(y0, p.y);
        x1 = Math.max(x1, p.x + n.w);
        y1 = Math.max(y1, p.y + n.h);
      });
      const side = opts.withPanel ? panelWidth : 0;
      const bottomSheet = opts.withPanel && !panelWidth ? size.h * 0.45 : 0;
      const availW = size.w - side - 96;
      const availH = size.h - bottomSheet - 180;
      const k = clamp(Math.min(availW / (x1 - x0), availH / (y1 - y0)), 0.28, opts.maxK ?? 1);
      const cx = (size.w - side) / 2;
      const cy = 70 + (size.h - bottomSheet - 70 - 64) / 2;
      fly({ k, x: cx - ((x0 + x1) / 2) * k, y: cy - ((y0 + y1) / 2) * k }, opts.instant);
    },
    [nodes, pos, size, panelWidth, fly],
  );

  const neighbourhood = useCallback(
    (id: string) => {
      const ids = new Set([id]);
      edges.forEach((e) => {
        if (e.from === id) ids.add(e.to);
        if (e.to === id) ids.add(e.from);
      });
      return [...ids];
    },
    [edges],
  );

  const select = useCallback(
    (id: string | null, move = true) => {
      setSel(id);
      setHover(null);
      history.replaceState(null, "", id ? `#${id}` : location.pathname + location.search);
      if (move) {
        if (id) frame(neighbourhood(id), { maxK: 1.05, withPanel: true });
        else frame(null);
      }
    },
    [frame, neighbourhood],
  );

  // First frame: fit everything, then honour a #hash if there is one.
  const ready = cam !== null;
  useEffect(() => {
    if (!size.w || ready) return;
    let timer = 0;
    const raf = requestAnimationFrame(() => {
      frame(null, { instant: true });
      const h = decodeURIComponent(location.hash.slice(1));
      const id = byId.has(h) ? h : byId.has(subjectId(h)) ? subjectId(h) : null;
      if (id) timer = window.setTimeout(() => select(id), 900);
    });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [size.w, ready, frame, byId, select]);

  const zoomBy = useCallback(
    (f: number, at?: Pt) => {
      setCam((c) => {
        if (!c) return c;
        const k = clamp(c.k * f, 0.22, 2.2);
        const mx = at?.x ?? size.w / 2;
        const my = at?.y ?? size.h / 2;
        return { k, x: mx - ((mx - c.x) * k) / c.k, y: my - ((my - c.y) * k) / c.k };
      });
    },
    [size],
  );

  // Wheel pans; pinch or ctrl/cmd + wheel zooms around the pointer.
  useEffect(() => {
    const el = vp.current;
    if (!el || view !== "graph") return;
    const onWheel = (e: WheelEvent) => {
      if ((e.target as Element).closest(".panel, .palette")) return;
      e.preventDefault();
      cancelAnimationFrame(flying.current);
      const r = el.getBoundingClientRect();
      if (e.ctrlKey || e.metaKey) zoomBy(Math.exp(-e.deltaY * 0.01), { x: e.clientX - r.left, y: e.clientY - r.top });
      else setCam((c) => (c ? { ...c, x: c.x - e.deltaX, y: c.y - e.deltaY } : c));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomBy, view]);

  /* ---------- Dragging: the canvas pans, a node moves ---------- */

  const pointers = useRef(new Map<number, Pt>());

  const startPan = (e: React.PointerEvent) => {
    if ((e.target as Element).closest(".node, .hud, .panel, .palette, .minimap")) return;
    cancelAnimationFrame(flying.current);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging("pan");
  };

  const movePan = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const all = [...pointers.current.values()];
    if (all.length === 2) {
      const other = all.find((p) => p !== prev)!;
      const before = Math.hypot(prev.x - other.x, prev.y - other.y);
      const after = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const r = vp.current!.getBoundingClientRect();
      if (before > 0) zoomBy(after / before, { x: (e.clientX + other.x) / 2 - r.left, y: (e.clientY + other.y) / 2 - r.top });
    } else {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      setCam((c) => (c ? { ...c, x: c.x + dx, y: c.y + dy } : c));
    }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  };

  const endPan = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (!pointers.current.size) setDragging(null);
  };

  const nodeDrag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);

  const startNode = (e: React.PointerEvent, id: string) => {
    if (e.button !== 0) return;
    const p = pos.get(id)!;
    nodeDrag.current = { id, sx: e.clientX, sy: e.clientY, ox: p.x, oy: p.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const moveNode = (e: React.PointerEvent) => {
    const d = nodeDrag.current;
    const c = camRef.current;
    if (!d || !c) return;
    const dx = (e.clientX - d.sx) / c.k;
    const dy = (e.clientY - d.sy) / c.k;
    if (!d.moved && Math.hypot(dx, dy) * c.k < 4) return;
    if (!d.moved) setDragging("node");
    d.moved = true;
    setPos((m) => new Map(m).set(d.id, { x: Math.round(d.ox + dx), y: Math.round(d.oy + dy) }));
  };

  const endNode = (id: string) => {
    const d = nodeDrag.current;
    nodeDrag.current = null;
    setDragging(null);
    if (d && !d.moved) select(sel === id ? null : id);
  };

  // Moved nodes are remembered in this browser, so a refresh keeps them.
  // Nodes that did not exist when the positions were saved use the layout.
  const STORE = "lowell-map-positions-v1";
  const restored = useRef(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORE) || "null") as Record<string, Pt> | null;
        if (saved) {
          setPos((m) => {
            const next = new Map(m);
            Object.entries(saved).forEach(([id, p]) => {
              if (next.has(id) && Number.isFinite(p?.x) && Number.isFinite(p?.y)) next.set(id, { x: p.x, y: p.y });
            });
            return next;
          });
        }
      } catch {
        // Storage can be unavailable (private mode, blocked site data); the layout still works.
      }
      restored.current = true;
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      const changed: Record<string, Pt> = {};
      nodes.forEach((n) => {
        const p = pos.get(n.id)!;
        if (p.x !== n.x || p.y !== n.y) changed[n.id] = p;
      });
      if (Object.keys(changed).length) localStorage.setItem(STORE, JSON.stringify(changed));
      else localStorage.removeItem(STORE);
    } catch {
      // Not saved; nothing else depends on it.
    }
  }, [pos, nodes]);

  // Put every node back where the layout placed it.
  const arrange = useCallback(() => {
    setPos(new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }])));
  }, [nodes]);

  const moved = nodes.some((n) => {
    const p = pos.get(n.id)!;
    return p.x !== n.x || p.y !== n.y;
  });

  /* ---------- Keyboard ---------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as Element).closest("input, textarea");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setPalette(true);
        return;
      }
      if (typing || palette) return;
      if (e.key === "Escape") {
        if (sel) select(null);
      } else if (e.key === "f") frame(null);
      else if (e.key === "t") setView((v) => (v === "graph" ? "tree" : "graph"));
      else if (e.key === "a") arrange();
      else if (e.key === "=" || e.key === "+") zoomBy(1.2);
      else if (e.key === "-") zoomBy(1 / 1.2);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, sel, select, frame, zoomBy, arrange]);

  /* ---------- Geometry ---------- */

  const wires = edges.map((e) => {
    const a = byId.get(e.from)!;
    const b = byId.get(e.to)!;
    const pa = pos.get(a.id)!;
    const pb = pos.get(b.id)!;
    const row = a.subjects.indexOf(e.subject);
    const right = pb.x + b.w / 2 > pa.x + a.w / 2;
    const ax = right ? pa.x + a.w : pa.x;
    const ay = pa.y + HEAD + row * ROW + ROW / 2;
    const bx = right ? pb.x : pb.x + b.w;
    const by = pb.y + HUB / 2;
    const dx = Math.max(60, Math.abs(bx - ax) * 0.5) * (right ? 1 : -1);
    return { e, right, d: `M${ax} ${ay} C${ax + dx} ${ay} ${bx - dx} ${by} ${bx} ${by}` };
  });

  const socketSide = new Map<string, "l" | "r">();
  const hubSides = new Map<string, Set<"l" | "r">>();
  wires.forEach(({ e, right }) => {
    socketSide.set(`${e.from}|${e.subject}`, right ? "r" : "l");
    const s = hubSides.get(e.to) ?? new Set();
    s.add(right ? "l" : "r");
    hubSides.set(e.to, s);
  });

  /* ---------- Minimap ---------- */

  const bounds = useMemo(() => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach((n) => {
      const p = pos.get(n.id)!;
      x0 = Math.min(x0, p.x);
      y0 = Math.min(y0, p.y);
      x1 = Math.max(x1, p.x + n.w);
      y1 = Math.max(y1, p.y + n.h);
    });
    const m = 200;
    return { x0: x0 - m, y0: y0 - m, w: x1 - x0 + 2 * m, h: y1 - y0 + 2 * m };
  }, [nodes, pos]);

  const MM = 184;
  const mmScale = MM / bounds.w;
  const mmH = Math.round(bounds.h * mmScale);

  const jumpMinimap = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const wx = bounds.x0 + (e.clientX - r.left) / mmScale;
    const wy = bounds.y0 + (e.clientY - r.top) / mmScale;
    const c = camRef.current;
    if (c) fly({ k: c.k, x: size.w / 2 - wx * c.k, y: size.h / 2 - wy * c.k });
  };

  /* ---------- Panel content ---------- */

  const selected = sel ? byId.get(sel) : null;
  const related = useMemo(() => {
    if (!selected) return [];
    if (selected.kind === "subject") {
      const list = edges.filter((e) => e.to === selected.id).map((e) => byId.get(e.from)!);
      const meets = new Map<string, number>();
      list.forEach((n) => n.subjects.forEach((s) => s !== selected.text && meets.set(s, (meets.get(s) || 0) + 1)));
      return [{ title: "Grows here", list }, ...(meets.size ? [{ title: "Shares soil with", subjects: [...meets.keys()] }] : [])];
    }
    return selected.subjects.map((s) => ({
      title: s,
      list: edges.filter((e) => e.subject === s && e.from !== selected.id).map((e) => byId.get(e.from)!),
    }));
  }, [selected, edges, byId]);

  const counts = {
    ideas: items.length,
    roots: nodes.filter((n) => n.kind === "subject" && n.zone === "root").length,
    branches: nodes.filter((n) => n.kind === "subject" && n.zone !== "root").length,
  };

  return (
    <div className="studio" data-view={view} data-dragging={dragging ?? undefined}>
      <div
        ref={vp}
        className="viewport"
        onPointerDown={startPan}
        onPointerMove={movePan}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        style={
          cam
            ? {
                backgroundSize: `${24 * cam.k}px ${24 * cam.k}px, 100% 100%, 100% 100%`,
                backgroundPosition: `${cam.x}px ${cam.y}px, 0 0, 0 0`,
                ["--ground" as string]: `${cam.y}px`,
              }
            : undefined
        }
      >
        <div
          className="world"
          data-ready={ready ? "" : undefined}
          data-lit={lit ? "" : undefined}
          style={cam ? { transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.k})` } : undefined}
        >
          {/* The plant: ground line, roots down to foundational subjects, stems up to the others. */}
          <svg className="plant" aria-hidden="true">
            <rect x={-6000} y={-9} width={12000} height={9} className="grass" />
            <line x1={-6000} y1={0} x2={6000} y2={0} className="ground" />
            {Array.from({ length: 41 }, (_, i) => (i - 20) * 100).map((x) => (
              <g key={x}>
                <line x1={x} y1={0} x2={x} y2={x % 400 === 0 ? 14 : 7} className="tick" />
                {x % 400 === 0 && (
                  <text x={x + 5} y={26} className="tick-label">
                    {x === 0 ? "0 · seed" : x > 0 ? `+${x}` : `${x}`}
                  </text>
                )}
              </g>
            ))}
            {nodes
              .filter((n) => n.kind === "subject")
              .map((h) => {
                const p = pos.get(h.id)!;
                const hx = p.x + h.w / 2;
                const hy = p.y + HUB / 2;
                const root = h.zone === "root";
                const d = `M0 0 C${root ? hx * 0.15 : hx * 0.05} ${hy * 0.65} ${hx * 0.7} ${hy * (root ? 0.85 : 0.95)} ${hx} ${hy}`;
                return (
                  <path
                    key={h.id}
                    d={d}
                    pathLength={1}
                    className={root ? "root" : "stem"}
                    style={{ strokeWidth: 3 + (h.count ?? 1) * 1.6 }}
                    data-on={lit?.on.has(h.id) ? "" : undefined}
                  />
                );
              })}
            <circle cx={0} cy={0} r={16} className="seed" />
            <circle cx={-4} cy={-5} r={5} className="seed-light" />
          </svg>

          <svg className="wires" aria-hidden="true">
            {wires.map(({ e, d }, i) => (
              <path
                key={e.id}
                d={d}
                pathLength={1}
                className="wire"
                style={{ stroke: color(e.subject), ["--i" as string]: i }}
                data-on={lit?.wires.has(e.id) ? "" : undefined}
              />
            ))}
          </svg>

          {nodes.map((n, i) => {
            const p = pos.get(n.id)!;
            const state = lit ? (lit.on.has(n.id) ? "on" : lit.near.has(n.id) ? "near" : "off") : undefined;
            const common = {
              className: "node",
              "data-kind": n.kind,
              "data-state": state,
              "data-sel": sel === n.id ? "" : undefined,
              style: { left: p.x, top: p.y, width: n.w, ["--i" as string]: i } as React.CSSProperties,
              onPointerEnter: () => !dragging && setHover(n.id),
              onPointerLeave: () => setHover(null),
              onPointerDown: (e: React.PointerEvent) => startNode(e, n.id),
              onPointerMove: moveNode,
              onPointerUp: () => endNode(n.id),
              onFocus: () => setHover(n.id),
              onBlur: () => setHover(null),
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  select(sel === n.id ? null : n.id);
                }
              },
              tabIndex: 0,
              role: "button",
              "aria-pressed": sel === n.id,
            };
            if (n.kind === "subject") {
              const sides = hubSides.get(n.id);
              return (
                <div key={n.id} {...common} aria-label={`${zoneName(n)} ${n.text}, ${n.count} plants`} style={{ ...common.style, ["--c" as string]: color(n.text) }}>
                  {sides?.has("l") && <i className="socket" data-side="l" />}
                  <span className="hub-name">{n.text}</span>
                  <span className="hub-count">{pad2(n.count ?? 0)}</span>
                  {sides?.has("r") && <i className="socket" data-side="r" />}
                </div>
              );
            }
            return (
              <div key={n.id} {...common} aria-label={`${KIND[n.kind]}: ${n.text}`}>
                <div className="node-head">
                  <span>
                    {KIND[n.kind]}
                    {n.stage && <em className="stage" data-stage={n.stage}>{n.stage}</em>}
                  </span>
                  <span>{pad2(n.n)}</span>
                </div>
                <ul className="node-rows">
                  {n.subjects.map((s) => (
                    <li key={s} style={{ ["--c" as string]: color(s) }}>
                      <i className="socket" data-side={socketSide.get(`${n.id}|${s}`) ?? "r"} />
                      {s}
                    </li>
                  ))}
                </ul>
                {n.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.image} alt={n.alt ?? ""} draggable={false} />
                )}
                <p className="node-text" dangerouslySetInnerHTML={{ __html: n.html }} />
                {n.href && <p className="node-open">Open →</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tree: the same graph as an outline, one branch per subject. */}
      {view === "tree" && (
        <div className="tree">
          <div className="tree-inner">
            <p className="tree-path">herbarium/ · every plant, pressed and sorted by subject</p>
            <ul>
              {subjects.map((s, si) => {
                const list = edges.filter((e) => e.subject === s).map((e) => byId.get(e.from)!);
                const last = si === subjects.length - 1;
                return (
                  <li key={s} style={{ ["--c" as string]: color(s) }}>
                    <button
                      type="button"
                      className="tree-subject"
                      onClick={() => {
                        setView("graph");
                        select(subjectId(s));
                      }}
                    >
                      <span className="glyph">{last ? "└──" : "├──"}</span>
                      <i className="dot" />
                      {s}/
                      <span className="tree-count">{list.length}</span>
                    </button>
                    <ul>
                      {list.map((n, ni) => (
                        <li key={n.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setView("graph");
                              select(n.id);
                            }}
                          >
                            <span className="glyph">
                              {last ? "    " : "│   "}
                              {ni === list.length - 1 ? "└── " : "├── "}
                            </span>
                            <span className="tree-text">{n.text}</span>
                            {n.subjects.length > 1 && (
                              <span className="tree-also">also {n.subjects.filter((x) => x !== s).join(", ")}</span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Depth gauge, pinned to the ground line. */}
      {view === "graph" && cam && cam.y > 140 && cam.y < size.h - 90 && (
        <div className="gauge" style={{ top: cam.y }} aria-hidden="true">
          <span className="up">↑ light · reaching out</span>
          <span className="down">↓ roots · foundations</span>
        </div>
      )}

      {/* Overlays */}
      <header className="hud hud-top">
        <div className="hud-intro">
          <p className="hud-name">
            <span className="hud-mark" aria-hidden="true" />
            Lowell
          </p>
          <p className="hud-lede">
            A garden of ideas, grown from one seed. Foundations go down as roots; ideas that reach for other
            fields grow toward the light.
          </p>
        </div>
        <nav className="hud-nav" aria-label="Primary">
          <Link href="/work/">Work</Link>
          <Link href="/writing/">Writing</Link>
          <a href={GITHUB_URL} rel="me noopener">GitHub ↗</a>
        </nav>
      </header>

      <div className="hud hud-bar">
        <div className="seg-mini" role="group" aria-label="View">
          <button type="button" aria-pressed={view === "graph"} onClick={() => setView("graph")}>
            Garden
          </button>
          <button type="button" aria-pressed={view === "tree"} onClick={() => setView("tree")}>
            Herbarium
          </button>
        </div>
        {view === "graph" && (
          <div className="zoom" role="group" aria-label="Zoom">
            <button type="button" onClick={() => zoomBy(1 / 1.25)} aria-label="Zoom out">
              −
            </button>
            <button type="button" className="zoom-level" onClick={() => frame(null)} title="Fit everything (F)">
              {cam ? Math.round(cam.k * 100) : 100}%
            </button>
            <button type="button" onClick={() => zoomBy(1.25)} aria-label="Zoom in">
              +
            </button>
          </div>
        )}
        {view === "graph" && moved && (
          <button type="button" onClick={arrange} title="Put every plant back in its place (A)">
            Tidy
          </button>
        )}
        <button type="button" className="search" onClick={() => setPalette(true)}>
          Find <kbd>/</kbd>
        </button>
        <p className="stats" aria-hidden="true">
          {counts.ideas} plants · {counts.roots} roots · {counts.branches} branches
        </p>
      </div>

      {view === "graph" && cam && size.w > 720 && (
        <svg
          className="hud minimap"
          width={MM}
          height={mmH}
          viewBox={`0 0 ${MM} ${mmH}`}
          onPointerDown={jumpMinimap}
          role="img"
          aria-label="Map of the whole garden"
        >
          {wires.map(({ e }) => {
            const a = pos.get(e.from)!;
            const b = pos.get(e.to)!;
            const na = byId.get(e.from)!;
            const nb = byId.get(e.to)!;
            return (
              <line
                key={e.id}
                x1={(a.x + na.w / 2 - bounds.x0) * mmScale}
                y1={(a.y + 30 - bounds.y0) * mmScale}
                x2={(b.x + nb.w / 2 - bounds.x0) * mmScale}
                y2={(b.y + 18 - bounds.y0) * mmScale}
                stroke={color(e.subject)}
                strokeOpacity={lit?.wires.has(e.id) ? 0.9 : 0.25}
              />
            );
          })}
          {nodes.map((n) => {
            const p = pos.get(n.id)!;
            return (
              <rect
                key={n.id}
                x={(p.x - bounds.x0) * mmScale}
                y={(p.y - bounds.y0) * mmScale}
                width={n.w * mmScale}
                height={(n.kind === "subject" ? HUB : n.h) * mmScale}
                rx={n.kind === "subject" ? 2 : 1}
                className="mm-node"
                data-on={sel === n.id || lit?.on.has(n.id) ? "" : undefined}
              />
            );
          })}
          {(() => {
            const vx = (-cam.x / cam.k - bounds.x0) * mmScale;
            const vy = (-cam.y / cam.k - bounds.y0) * mmScale;
            const x = clamp(vx, 1, MM - 1);
            const y = clamp(vy, 1, mmH - 1);
            const w = clamp(vx + (size.w / cam.k) * mmScale, 1, MM - 1) - x;
            const h = clamp(vy + (size.h / cam.k) * mmScale, 1, mmH - 1) - y;
            return <rect className="mm-view" x={x} y={y} width={Math.max(0, w)} height={Math.max(0, h)} />;
          })()}
        </svg>
      )}

      {selected && (
        <aside className="panel" aria-label="Details">
          <div className="panel-head">
            <span>
              {zoneName(selected)} {pad2(selected.n)}
            </span>
            <button type="button" onClick={() => select(null)} aria-label="Close">
              Esc
            </button>
          </div>
          {selected.kind === "subject" ? (
            <p className="panel-subject" style={{ ["--c" as string]: color(selected.text) }}>
              <i className="dot" />
              {selected.text}
            </p>
          ) : (
            <>
              {selected.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="panel-img" src={selected.image} alt={selected.alt ?? ""} />
              )}
              <p className="panel-text" dangerouslySetInnerHTML={{ __html: selected.html }} />
              {selected.href && (
                <a className="panel-open" href={selected.href}>
                  {selected.kind === "article" ? "Read the harvest" : selected.kind === "page" ? "Open the field notes" : "Follow the thread"}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </>
          )}
          {related.map((g) => (
            <section key={g.title} className="panel-group">
              {"subjects" in g && g.subjects ? (
                <>
                  <h2>{g.title}</h2>
                  <p className="chips">
                    {g.subjects.map((s) => (
                      <button key={s} type="button" style={{ ["--c" as string]: color(s) }} onClick={() => select(subjectId(s))}>
                        <i className="dot" />
                        {s}
                      </button>
                    ))}
                  </p>
                </>
              ) : (
                <>
                  <h2>
                    {selected.kind !== "subject" ? (
                      <button type="button" style={{ ["--c" as string]: color(g.title) }} onClick={() => select(subjectId(g.title))}>
                        <i className="dot" />
                        {g.title}
                      </button>
                    ) : (
                      g.title
                    )}
                    <span>{pad2(("list" in g && g.list?.length) || 0)}</span>
                  </h2>
                  <ul>
                    {"list" in g &&
                      g.list?.map((n) => (
                        <li key={n.id}>
                          <button type="button" onClick={() => select(n.id)} onPointerEnter={() => setHover(n.id)} onPointerLeave={() => setHover(null)}>
                            <span className="k">{n.kind === "idea" ? (n.stage ?? "") : KIND[n.kind]}</span>
                            {n.text}
                          </button>
                        </li>
                      ))}
                    {"list" in g && !g.list?.length && <li className="empty">Nothing else grows here yet.</li>}
                  </ul>
                </>
              )}
            </section>
          ))}
        </aside>
      )}

      {palette && (
        <Palette
          nodes={nodes}
          color={color}
          onClose={() => setPalette(false)}
          onPick={(id) => {
            setPalette(false);
            setView("graph");
            select(id);
          }}
        />
      )}
    </div>
  );
}

function Palette({
  nodes,
  color,
  onClose,
  onPick,
}: {
  nodes: GNode[];
  color: (s: string) => string;
  onClose: () => void;
  onPick: (id: string) => void;
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  const list = nodes
    .filter((n) => (n.text + " " + n.subjects.join(" ")).toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => Number(b.kind === "subject") - Number(a.kind === "subject"))
    .slice(0, 9);
  const at = Math.min(i, Math.max(0, list.length - 1));
  return (
    <div className="palette-back" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-label="Search">
        <input
          ref={input}
          value={q}
          placeholder="Find a plant, a root or a branch"
          onChange={(e) => {
            setQ(e.target.value);
            setI(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setI((v) => Math.min(v + 1, list.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setI((v) => Math.max(v - 1, 0));
            }
            if (e.key === "Enter" && list[at]) onPick(list[at].id);
          }}
          aria-label="Search"
        />
        <ul>
          {list.map((n, j) => (
            <li key={n.id}>
              <button type="button" aria-current={j === at ? "true" : undefined} onPointerEnter={() => setI(j)} onClick={() => onPick(n.id)}>
                <span className="k">{zoneName(n)}</span>
                {n.kind === "subject" && <i className="dot" style={{ ["--c" as string]: color(n.text) }} />}
                <span className="t">{n.text}</span>
              </button>
            </li>
          ))}
          {!list.length && <li className="empty">No match.</li>}
        </ul>
        <p className="palette-foot">↑↓ to move · Enter to go · Esc to close</p>
      </div>
    </div>
  );
}
