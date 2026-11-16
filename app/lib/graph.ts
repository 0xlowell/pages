import { readMeta, list } from "./content";
import { getFragments, type Stage } from "./fragments";
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
  stage?: Stage;
  zone?: "root" | "light";
};

export type GEdge = { id: string; from: string; to: string; subject: string };


// Ideas, articles and the work summary are nodes. Each subject is a node too,
// and every idea is wired to the subjects it touches.
export function buildGraph() {
  const fragments = getFragments();
  const counts = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => counts.set(s, (counts.get(s) || 0) + 1)));
  const subjects = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);

  // Foundational subjects grow down as roots; the others reach up for light.
  // content/subjects.md can name the roots; otherwise the most tended subjects are.
  const declared = list(readMeta("subjects.md").roots);
  const isRoot = (s: string) => (declared.length ? declared.includes(s) : (counts.get(s) || 0) >= 3);

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
    zone: isRoot(s) ? "root" : "light",
  }));

  fragments.forEach((f, i) => {
    const kind: GKind = f.kind === "thought" ? "idea" : f.kind;
    const text = f.html.replace(/<[^>]+>/g, "");
    const w = kind === "idea" ? (f.image ? 300 : 272) : 252;
    const perLine = kind === "idea" ? 25 : 30;
    const lines = Math.ceil(text.length / perLine);
    const h = 32 + f.subjects.length * 24 + 26 + lines * (kind === "idea" ? 25 : 22) + (f.image ? 190 : 0) + (f.href ? 34 : 0);
    nodes.push({ id: f.id, kind, html: f.html, text, subjects: f.subjects, href: f.href, image: f.image, alt: f.alt, x: 0, y: 0, w, h, n: i + 1, stage: f.stage });
  });

  const edges: GEdge[] = [];
  nodes.forEach((n) => {
    if (n.kind === "subject") return;
    n.subjects.forEach((s) => edges.push({ id: `${n.id}~${s}`, from: n.id, to: subjectId(s), subject: s }));
  });

  layout(nodes);
  return { nodes, edges, subjects };
}

// The graph grows like a plant in cross-section. The seed sits at the origin,
// on the ground line (y = 0). Root subjects fan out below it, light subjects
// fan out above. Each idea settles near the subjects it is wired to, pushed
// outwards from the seed, then cards are nudged apart so none overlap.
function layout(nodes: GNode[]) {
  const hubs = nodes.filter((n) => n.kind === "subject");
  const ideas = nodes.filter((n) => n.kind !== "subject");
  const roots = hubs.filter((h) => h.zone === "root");
  const lights = hubs.filter((h) => h.zone !== "root");

  const fan = (list: GNode[], down: boolean) =>
    list.forEach((h, i) => {
      const t = list.length === 1 ? 0.5 : i / (list.length - 1);
      // Alternate sides so the biggest subjects sit close to the stem.
      const side = i % 2 === 0 ? 1 : -1;
      const spread = Math.ceil(i / 2) / Math.max(1, Math.ceil((list.length - 1) / 2));
      const a = Math.PI / 2 + side * spread * 1.05; // radians from the vertical
      const R = 300 + (i % 2) * 60 + t * 30;
      const cx = Math.cos(a) * R * 2.1;
      const cy = (down ? 1 : -1) * Math.abs(Math.sin(a)) * R;
      h.x = Math.round(cx - h.w / 2);
      h.y = Math.round(cy - h.h / 2);
    });
  fan(roots, true);
  fan(lights, false);

  const centre = (n: GNode) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });
  const hubOf = new Map(hubs.map((h) => [h.text, h]));

  // Where each idea wants to be. An idea with one subject grows around it like
  // foliage, fanned across the side that faces away from the seed. An idea
  // with several subjects sits between them, a little further out.
  const want = new Map<string, { x: number; y: number }>();
  hubs.forEach((h) => {
    const own = ideas.filter((n) => n.subjects.length === 1 && n.subjects[0] === h.text);
    const c = centre(h);
    const out = Math.atan2(c.y, c.x || 0.001);
    own.forEach((n, i) => {
      const t = own.length === 1 ? 0.5 : i / (own.length - 1);
      const a = out + (t - 0.5) * Math.min(Math.PI * 1.1, own.length * 0.55);
      const r = 250 + (i % 2) * 110;
      want.set(n.id, { x: c.x + Math.cos(a) * r * 1.25, y: c.y + Math.sin(a) * r });
    });
  });
  ideas.forEach((n) => {
    if (want.has(n.id)) return;
    const hs = n.subjects.map((s) => hubOf.get(s)!).filter(Boolean).map(centre);
    const ax = hs.reduce((t, p) => t + p.x, 0) / (hs.length || 1);
    const ay = hs.reduce((t, p) => t + p.y, 0) / (hs.length || 1);
    const d = Math.hypot(ax, ay) || 1;
    want.set(n.id, { x: ax + (ax / d) * 140, y: ay + (ay / d) * 140 });
  });
  const P = ideas.map((n, i) => {
    const w = want.get(n.id)!;
    return { x: w.x + ((i * 37) % 60) - 30, y: w.y + ((i * 53) % 60) - 30 };
  });

  const boxes = () => [
    ...hubs.map((h) => ({ x: h.x + h.w / 2, y: h.y + h.h / 2, rx: h.w / 2 + 40, ry: h.h / 2 + 30, fixed: true })),
    ...ideas.map((n, i) => ({ x: P[i].x, y: P[i].y, rx: n.w / 2 + 26, ry: n.h / 2 + 26, fixed: false })),
  ];

  for (let it = 0; it < 500; it++) {
    const B = boxes();
    const D = P.map(() => ({ x: 0, y: 0 }));
    const off = hubs.length;
    for (let i = 0; i < B.length; i++) {
      for (let j = i + 1; j < B.length; j++) {
        const dx = B[j].x - B[i].x;
        const dy = B[j].y - B[i].y;
        const ox = B[i].rx + B[j].rx - Math.abs(dx);
        const oy = B[i].ry + B[j].ry - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        const horiz = ox < oy;
        const s = Math.sign(horiz ? dx : dy) || 1;
        const amount = (horiz ? ox : oy) / (B[i].fixed || B[j].fixed ? 1 : 2);
        if (!B[i].fixed) D[i - off][horiz ? "x" : "y"] -= s * amount;
        if (!B[j].fixed) D[j - off][horiz ? "x" : "y"] += s * amount;
      }
    }
    ideas.forEach((n, i) => {
      const w = want.get(n.id)!;
      D[i].x += (w.x - P[i].x) * 0.04;
      D[i].y += (w.y - P[i].y) * 0.04;
      P[i].x += Math.max(-24, Math.min(24, D[i].x));
      P[i].y += Math.max(-24, Math.min(24, D[i].y));
      // Ideas of one world stay in it: roots under the ground, the rest above.
      const zones = new Set(n.subjects.map((s) => hubOf.get(s)?.zone));
      if (zones.size === 1 && zones.has("root")) P[i].y = Math.max(P[i].y, n.h / 2 + 40);
      if (zones.size === 1 && zones.has("light")) P[i].y = Math.min(P[i].y, -n.h / 2 - 40);
    });
  }

  ideas.forEach((n, i) => {
    n.x = Math.round(P[i].x - n.w / 2);
    n.y = Math.round(P[i].y - n.h / 2);
  });
}
