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

// One plant per foundational subject: a seed on the ground line, that subject
// as its root, and the subjects it reaches for as branches. Subjects with no
// root at all grow as a young plant of their own.
export type GPlant = { id: string; x: number; roots: string[]; branches: string[] };


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

  const plants = layout(nodes);
  return { nodes, edges, subjects, plants };
}

// The garden in cross-section. Seeds sit on the ground line (y = 0), spaced
// along it. Below each seed hangs its root subject; above it, the branch
// subjects it shares the most plants with. Ideas settle near their subjects:
// around a root or a branch when they have one subject, between two roots
// (underground, where root systems meet) when they join two plants, and on the
// ground line when they join a root to a branch.
function layout(nodes: GNode[]): GPlant[] {
  const hubs = nodes.filter((n) => n.kind === "subject");
  const ideas = nodes.filter((n) => n.kind !== "subject");
  const hubOf = new Map(hubs.map((h) => [h.text, h]));
  const shared = (a: string, b: string) => ideas.filter((n) => n.subjects.includes(a) && n.subjects.includes(b)).length;

  // 1. Plants: one per root; each branch joins the root it shares most with.
  const roots = hubs.filter((h) => h.zone === "root");
  const branches = hubs.filter((h) => h.zone !== "root");
  const plants: { id: string; roots: GNode[]; branches: GNode[]; size: number }[] = roots.map((r) => ({
    id: "plant-" + r.id,
    roots: [r],
    branches: [],
    size: 0,
  }));
  const orphans: GNode[] = [];
  branches.forEach((b) => {
    let best = -1;
    let score = 0;
    plants.forEach((p, i) => {
      const sc = shared(p.roots[0].text, b.text);
      if (sc > score) {
        score = sc;
        best = i;
      }
    });
    if (best >= 0) plants[best].branches.push(b);
    else orphans.push(b);
  });
  // Branches with no root group into young plants, by what they share.
  orphans.forEach((b) => {
    const p = plants.find((q) => !q.roots.length && q.branches.some((x) => shared(x.text, b.text) > 0));
    if (p) p.branches.push(b);
    else plants.push({ id: "plant-" + b.id, roots: [], branches: [b], size: 0 });
  });
  plants.forEach((p) => (p.size = [...p.roots, ...p.branches].reduce((t, h) => t + (h.count || 0), 0)));

  // 2. Order along the ground: biggest in the middle, neighbours by what they share.
  const bySize = [...plants].sort((a, b) => b.size - a.size);
  const row: typeof plants = [bySize[0]];
  const key = (p: (typeof plants)[number]) => [...p.roots, ...p.branches].map((h) => h.text);
  const link = (a: (typeof plants)[number], b: (typeof plants)[number]) =>
    key(a).reduce((t, x) => t + key(b).reduce((u, y) => u + shared(x, y), 0), 0);
  bySize.slice(1).forEach((p) => {
    const left = link(p, row[0]);
    const right = link(p, row[row.length - 1]);
    if (left > right || (left === right && row.length % 2 === 0)) row.unshift(p);
    else row.push(p);
  });

  // 3. Seeds along the ground, each given room in proportion to its size.
  const widths = row.map((p) => 520 + p.size * 55);
  let cursor = -widths.reduce((t, w) => t + w, 0) / 2;
  const seedX = new Map<string, number>();
  row.forEach((p, i) => {
    seedX.set(p.id, cursor + widths[i] / 2);
    cursor += widths[i];
  });

  // 4. Hubs: the root below its seed, branches fanned above it.
  row.forEach((p) => {
    const x = seedX.get(p.id)!;
    p.roots.forEach((r) => {
      r.x = Math.round(x - r.w / 2);
      r.y = Math.round(240 - r.h / 2);
    });
    p.branches.forEach((b, i) => {
      const n = p.branches.length;
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      b.x = Math.round(x + t * 520 - b.w / 2);
      b.y = Math.round(-300 - Math.abs(t) * -60 - (i % 2) * 70 - b.h / 2);
    });
  });

  const centre = (n: GNode) => ({ x: n.x + n.w / 2, y: n.y + n.h / 2 });

  // 5. Where each idea wants to be.
  const want = new Map<string, { x: number; y: number }>();
  hubs.forEach((h) => {
    const own = ideas.filter((n) => n.subjects.length === 1 && n.subjects[0] === h.text);
    const c = centre(h);
    const down = h.zone === "root";
    own.forEach((n, i) => {
      const t = own.length === 1 ? 0.5 : i / (own.length - 1);
      const a = (down ? Math.PI / 2 : -Math.PI / 2) + (t - 0.5) * Math.min(Math.PI * 1.15, own.length * 0.6);
      const r = 230 + (i % 2) * 120;
      want.set(n.id, { x: c.x + Math.cos(a) * r * 1.2, y: c.y + Math.sin(a) * r });
    });
  });
  ideas.forEach((n) => {
    if (want.has(n.id)) return;
    const hs = n.subjects.map((s) => hubOf.get(s)!).filter(Boolean);
    const cs = hs.map(centre);
    const ax = cs.reduce((t, p) => t + p.x, 0) / (cs.length || 1);
    const zones = new Set(hs.map((h) => h.zone));
    let y: number;
    if (zones.size > 1) {
      // A root and a branch: on the ground line, beside the seed rather than on it.
      y = 40;
      want.set(n.id, { x: ax + n.w / 2 + 90, y });
      return;
    }
    else if (zones.has("root")) y = 560; // several roots: deep, where root systems meet
    else y = cs.reduce((t, p) => t + p.y, 0) / (cs.length || 1) - 200;
    want.set(n.id, { x: ax, y });
  });

  // 6. Nudge cards apart; keep each in its world.
  const P = ideas.map((n, i) => {
    const w = want.get(n.id)!;
    return { x: w.x + ((i * 37) % 50) - 25, y: w.y + ((i * 53) % 50) - 25 };
  });
  const off = hubs.length;
  for (let it = 0; it < 600; it++) {
    const B = [
      ...hubs.map((h) => ({ x: h.x + h.w / 2, y: h.y + h.h / 2, rx: h.w / 2 + 40, ry: h.h / 2 + 30, fixed: true })),
      ...ideas.map((n, i) => ({ x: P[i].x, y: P[i].y, rx: n.w / 2 + 24, ry: n.h / 2 + 24, fixed: false })),
    ];
    const D = P.map(() => ({ x: 0, y: 0 }));
    for (let i = 0; i < B.length; i++) {
      for (let j = i + 1; j < B.length; j++) {
        const dx = B[j].x - B[i].x;
        const dy = B[j].y - B[i].y;
        const ox = B[i].rx + B[j].rx - Math.abs(dx);
        const oy = B[i].ry + B[j].ry - Math.abs(dy);
        if (ox <= 0 || oy <= 0) continue;
        const horiz = ox < oy;
        const sgn = Math.sign(horiz ? dx : dy) || 1;
        const amount = (horiz ? ox : oy) / (B[i].fixed || B[j].fixed ? 1 : 2);
        if (!B[i].fixed) D[i - off][horiz ? "x" : "y"] -= sgn * amount;
        if (!B[j].fixed) D[j - off][horiz ? "x" : "y"] += sgn * amount;
      }
    }
    ideas.forEach((n, i) => {
      const w = want.get(n.id)!;
      D[i].x += (w.x - P[i].x) * 0.04;
      D[i].y += (w.y - P[i].y) * 0.04;
      P[i].x += Math.max(-24, Math.min(24, D[i].x));
      P[i].y += Math.max(-24, Math.min(24, D[i].y));
      const zones = new Set(n.subjects.map((s) => hubOf.get(s)?.zone));
      if (zones.size === 1 && zones.has("root")) P[i].y = Math.max(P[i].y, n.h / 2 + 50);
      if (zones.size === 1 && zones.has("light")) P[i].y = Math.min(P[i].y, -n.h / 2 - 50);
    });
  }
  ideas.forEach((n, i) => {
    n.x = Math.round(P[i].x - n.w / 2);
    n.y = Math.round(P[i].y - n.h / 2);
  });

  return row.map((p) => ({
    id: p.id,
    x: Math.round(seedX.get(p.id)!),
    roots: p.roots.map((h) => h.id),
    branches: p.branches.map((h) => h.id),
  }));
}
