import { getFragments } from "./fragments";
import { subjectId } from "./ids";

export { subjectId };

export type GKind = "idea" | "article" | "page" | "subject";

export type GNode = {
  id: string;
  kind: GKind;
  html: string;
  text: string;
  subjects: string[];
  href?: string;
  image?: string;
  alt?: string;
  x: number;
  y: number;
  w: number;
  h: number; // estimate, used for layout and framing only
  n: number;
  count?: number;
};

export type GEdge = { id: string; from: string; to: string; subject: string };


function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Ideas, articles and the work summary are nodes. Each subject is a node too,
// and every idea is wired to the subjects it touches.
export function buildGraph() {
  const fragments = getFragments();
  const counts = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => counts.set(s, (counts.get(s) || 0) + 1)));
  const subjects = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);

  const nodes: GNode[] = subjects.map((s, i) => ({
    id: subjectId(s),
    kind: "subject",
    html: s,
    text: s,
    subjects: [s],
    x: 0,
    y: 0,
    w: Math.round(62 + s.length * 7.8),
    h: 36,
    n: i + 1,
    count: counts.get(s),
  }));

  fragments.forEach((f, i) => {
    const kind: GKind = f.kind === "thought" ? "idea" : f.kind;
    const text = f.html.replace(/<[^>]+>/g, "");
    const w = kind === "idea" ? (f.image ? 300 : 272) : 252;
    const perLine = kind === "idea" ? 25 : 30;
    const lines = Math.ceil(text.length / perLine);
    const h = 32 + f.subjects.length * 24 + 26 + lines * (kind === "idea" ? 25 : 22) + (f.image ? 190 : 0) + (f.href ? 34 : 0);
    nodes.push({ id: f.id, kind, html: f.html, text, subjects: f.subjects, href: f.href, image: f.image, alt: f.alt, x: 0, y: 0, w, h, n: i + 1 });
  });

  const edges: GEdge[] = [];
  nodes.forEach((n) => {
    if (n.kind === "subject") return;
    n.subjects.forEach((s) => edges.push({ id: `${n.id}~${s}`, from: n.id, to: subjectId(s), subject: s }));
  });

  layout(nodes, edges);
  return { nodes, edges, subjects };
}

// A small force layout, run once at build time with a fixed seed so the map
// is the same for every visitor.
function layout(nodes: GNode[], edges: GEdge[]) {
  const rand = rng(11);
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const P = nodes.map(() => ({ x: 0, y: 0 }));
  const hubs = nodes.filter((n) => n.kind === "subject");
  hubs.forEach((s, i) => {
    const a = (i / hubs.length) * Math.PI * 2;
    P[idx.get(s.id)!] = { x: Math.cos(a) * 560, y: Math.sin(a) * 380 };
  });
  nodes.forEach((n, i) => {
    if (n.kind === "subject") return;
    const at = n.subjects.map((s) => P[idx.get(subjectId(s))!]).filter(Boolean);
    const cx = at.reduce((t, p) => t + p.x, 0) / (at.length || 1);
    const cy = at.reduce((t, p) => t + p.y, 0) / (at.length || 1);
    P[i] = { x: cx + (rand() - 0.5) * 420, y: cy + (rand() - 0.5) * 420 };
  });
  const R = nodes.map((n) => ({ rx: n.w / 2 + 34, ry: n.h / 2 + 34 }));
  const pairs = edges.map((e) => [idx.get(e.from)!, idx.get(e.to)!] as const);

  const step = (springs: boolean, t: number) => {
    const D = P.map(() => ({ x: 0, y: 0 }));
    if (springs) {
      pairs.forEach(([a, b]) => {
        const dx = P[b].x - P[a].x;
        const dy = P[b].y - P[a].y;
        const d = Math.hypot(dx, dy) || 1;
        const f = ((d - 330) / d) * 0.035;
        D[a].x += dx * f;
        D[a].y += dy * f;
        D[b].x -= dx * f * 0.4;
        D[b].y -= dy * f * 0.4;
      });
    }
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const dx = P[j].x - P[i].x;
        const dy = P[j].y - P[i].y;
        const ox = R[i].rx + R[j].rx - Math.abs(dx);
        const oy = R[i].ry + R[j].ry - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) {
            const s = Math.sign(dx) || 1;
            D[i].x -= (s * ox) / 2;
            D[j].x += (s * ox) / 2;
          } else {
            const s = Math.sign(dy) || 1;
            D[i].y -= (s * oy) / 2;
            D[j].y += (s * oy) / 2;
          }
        } else if (springs) {
          const d2 = dx * dx + dy * dy + 1;
          const f = 14000 / d2;
          const d = Math.sqrt(d2);
          D[i].x -= (dx / d) * f;
          D[i].y -= (dy / d) * f;
          D[j].x += (dx / d) * f;
          D[j].y += (dy / d) * f;
        }
      }
      if (springs) {
        D[i].x -= P[i].x * 0.004;
        D[i].y -= P[i].y * 0.009;
      }
    }
    P.forEach((p, i) => {
      const lim = 30 + 30 * t;
      p.x += Math.max(-lim, Math.min(lim, D[i].x)) * (0.35 + 0.65 * t);
      p.y += Math.max(-lim, Math.min(lim, D[i].y)) * (0.35 + 0.65 * t);
    });
  };

  for (let it = 0; it < 700; it++) step(true, 1 - it / 700);
  for (let it = 0; it < 200; it++) step(false, 0);

  nodes.forEach((n, i) => {
    n.x = Math.round(P[i].x - n.w / 2);
    n.y = Math.round(P[i].y - n.h / 2);
  });
}
