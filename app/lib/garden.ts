import { getFragments, type Fragment, type Stage } from "./fragments";
import { blob, hash, r1, rng } from "./shapes";

// The home page is a garden seen from above. Each subject is a bed whose area
// follows what grows in it; each wiki page is a plant whose size follows its
// stage and its sources. Everything is laid out once, at build time.

export type Plant = {
  id: string;
  kind: Fragment["kind"];
  html: string;
  text: string;
  subjects: string[];
  stage: Stage;
  planted: string;
  tended: string;
  sources: string[];
  href?: string;
  image?: string;
  alt?: string;
  bed: string;
  parent?: string; // set on a cutting: the same idea, growing in another bed
  x: number;
  y: number;
  r: number;
  seed: number;
  order: number;
};

export type Bed = {
  id: string;
  name: string;
  x: number;
  y: number;
  r: number;
  count: number;
  shape: string;
  rim: string;
  label: string;
};

export type Stone = { x: number; y: number; rx: number; ry: number; rot: number };
export type Walk = { id: string; a: string; b: string; n: number; stones: Stone[] };

const bedId = (s: string) => "bed-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const plantRadius = (f: Fragment) => {
  const base = f.kind === "page" ? 40 : f.kind === "article" ? 32 : { seedling: 14, budding: 22, evergreen: 30 }[f.stage];
  return base + Math.min(f.sources.length, 5) * 3 + (f.subjects.length - 1) * 2;
};

export function buildGarden() {
  const fragments = getFragments();
  const subjects = new Map<string, Fragment[]>();
  fragments.forEach((f) => f.subjects.forEach((s) => subjects.set(s, [...(subjects.get(s) || []), f])));

  // Each plant grows in the bed of its first subject. In every other subject's
  // bed it leaves a small cutting, and the beds are joined by a path.
  type Slot = { f: Fragment; cutting: boolean };
  const home = new Map<string, Slot[]>();
  fragments.forEach((f) =>
    f.subjects.forEach((s, i) => home.set(s, [...(home.get(s) || []), { f, cutting: i > 0 }])),
  );
  const slotRadius = (x: Slot) => (x.cutting ? 10 : plantRadius(x.f));

  const names = [...subjects.keys()].sort((a, b) => subjects.get(b)!.length - subjects.get(a)!.length || a.localeCompare(b));

  // Bed size: enough ground for its plants, with room to breathe.
  const beds: Bed[] = names.map((name) => {
    const own = home.get(name) || [];
    const area = own.reduce((t, x) => t + Math.PI * Math.pow(slotRadius(x) + 10, 2), 0);
    const r = Math.max(56, Math.sqrt(area / 0.5 / Math.PI) + 18);
    return { id: bedId(name), name, x: 0, y: 0, r: Math.round(r), count: subjects.get(name)!.length, shape: "", rim: "", label: "" };
  });

  // How strongly two beds belong together: the pages they share.
  const shared = new Map<string, number>();
  fragments.forEach((f) => {
    for (let i = 0; i < f.subjects.length; i++)
      for (let j = i + 1; j < f.subjects.length; j++) {
        const key = [f.subjects[i], f.subjects[j]].sort().join("|");
        shared.set(key, (shared.get(key) || 0) + 1);
      }
  });
  const affinity = (a: string, b: string) => shared.get([a, b].sort().join("|")) || 0;

  // Place beds one by one around the ones already planted, close to the beds
  // they share pages with, never overlapping.
  const GAP = 128;
  const placed: Bed[] = [];
  beds.forEach((b, i) => {
    if (i === 0) {
      placed.push(b);
      return;
    }
    let best: { x: number; y: number; score: number } | null = null;
    placed.forEach((p) => {
      for (let deg = 0; deg < 360; deg += 8) {
        const a = (deg * Math.PI) / 180;
        const x = p.x + Math.cos(a) * (p.r + b.r + GAP);
        const y = p.y + Math.sin(a) * (p.r + b.r + GAP);
        if (placed.some((q) => Math.hypot(q.x - x, q.y - y) < q.r + b.r + GAP - 1)) continue;
        const pull = placed.reduce((t, q) => t + affinity(q.name, b.name) * Math.hypot(q.x - x, q.y - y), 0);
        const score = pull + 0.6 * Math.hypot(x * 0.75, y * 1.25);
        if (!best || score < best.score) best = { x, y, score };
      }
    });
    b.x = best!.x;
    b.y = best!.y;
    placed.push(b);
  });

  // Plants: largest near the middle of the bed, then a sunflower spiral.
  const plants: Plant[] = [];
  beds.forEach((b) => {
    const own = [...(home.get(b.name) || [])].sort((x, y) => slotRadius(y) - slotRadius(x));
    const pos = own.map((x, i) => {
      const t = Math.sqrt((i + 0.5) / own.length);
      const a = i * 2.39996 + (hash(b.name) % 10);
      return { x: b.x + Math.cos(a) * t * b.r * 0.62, y: b.y + Math.sin(a) * t * b.r * 0.62, r: slotRadius(x) };
    });
    // Nudge apart and keep inside the bed.
    for (let it = 0; it < 120; it++) {
      for (let i = 0; i < pos.length; i++) {
        for (let j = i + 1; j < pos.length; j++) {
          const dx = pos[j].x - pos[i].x;
          const dy = pos[j].y - pos[i].y;
          const d = Math.hypot(dx, dy) || 0.01;
          const min = pos[i].r + pos[j].r + 8;
          if (d < min) {
            const push = (min - d) / 2;
            pos[i].x -= (dx / d) * push;
            pos[i].y -= (dy / d) * push;
            pos[j].x += (dx / d) * push;
            pos[j].y += (dy / d) * push;
          }
        }
        const dx = pos[i].x - b.x;
        const dy = pos[i].y - b.y;
        const d = Math.hypot(dx, dy) || 0.01;
        const max = b.r - pos[i].r - 10;
        if (d > max) {
          pos[i].x = b.x + (dx / d) * Math.max(0, max);
          pos[i].y = b.y + (dy / d) * Math.max(0, max);
        }
      }
    }
    own.forEach(({ f, cutting }, i) =>
      plants.push({
        id: cutting ? `${f.id}::${b.id}` : f.id,
        parent: cutting ? f.id : undefined,
        kind: f.kind,
        html: f.html,
        text: f.html.replace(/<[^>]+>/g, ""),
        subjects: f.subjects,
        stage: f.stage,
        planted: f.planted,
        tended: f.tended,
        sources: f.sources,
        href: f.href,
        image: f.image,
        alt: f.alt,
        bed: b.id,
        x: Math.round(pos[i].x),
        y: Math.round(pos[i].y),
        r: pos[i].r,
        seed: hash(f.id + b.id),
        order: 0,
      }),
    );
  });

  // Planting order, for the "watch it grow" replay.
  const ordered = plants
    .filter((p) => !p.parent)
    .sort((a, b) => a.planted.localeCompare(b.planted) || a.r - b.r || a.id.localeCompare(b.id));
  ordered.forEach((p, i) => (p.order = i));
  const orderOf = new Map(ordered.map((p) => [p.id, p.order]));
  plants.forEach((p) => p.parent && (p.order = orderOf.get(p.parent)! + 0.5));

  // Stepping-stone paths between beds that share pages.
  const byName = new Map(beds.map((b) => [b.name, b]));
  const walks: Walk[] = [];
  shared.forEach((n, key) => {
    const [an, bn] = key.split("|");
    const A = byName.get(an)!;
    const B = byName.get(bn)!;
    const rand = rng(hash(key));
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const len = Math.hypot(dx, dy);
    const ux = dx / len;
    const uy = dy / len;
    const sx = A.x + ux * (A.r + 6);
    const sy = A.y + uy * (A.r + 6);
    const ex = B.x - ux * (B.r + 6);
    const ey = B.y - uy * (B.r + 6);
    const bend = (rand() - 0.5) * 0.5 * len;
    const cx = (sx + ex) / 2 - uy * bend;
    const cy = (sy + ey) / 2 + ux * bend;
    const span = Math.hypot(ex - sx, ey - sy);
    const count = Math.max(2, Math.round(span / 19));
    const stones: Stone[] = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = (1 - t) * (1 - t) * sx + 2 * (1 - t) * t * cx + t * t * ex;
      const y = (1 - t) * (1 - t) * sy + 2 * (1 - t) * t * cy + t * t * ey;
      const size = 1 + Math.min(n - 1, 3) * 0.18;
      stones.push({
        x: r1(x + (rand() - 0.5) * 4),
        y: r1(y + (rand() - 0.5) * 4),
        rx: r1((5 + rand() * 2.5) * size),
        ry: r1((3.6 + rand() * 1.6) * size),
        rot: Math.round(rand() * 180),
      });
    }
    walks.push({ id: key, a: A.id, b: B.id, n, stones });
  });

  // Frame the garden with a margin, and draw the beds.
  const M = 140;
  const x0 = Math.min(...beds.map((b) => b.x - b.r)) - M;
  const y0 = Math.min(...beds.map((b) => b.y - b.r)) - M - 30;
  const x1 = Math.max(...beds.map((b) => b.x + b.r)) + M;
  const y1 = Math.max(...beds.map((b) => b.y + b.r)) + M;
  const shift = (p: { x: number; y: number }) => {
    p.x = Math.round(p.x - x0);
    p.y = Math.round(p.y - y0);
  };
  beds.forEach(shift);
  plants.forEach(shift);
  walks.forEach((w) => w.stones.forEach((s) => ((s.x = r1(s.x - x0)), (s.y = r1(s.y - y0)))));
  beds.forEach((b) => {
    b.shape = blob(b.x, b.y, b.r, hash(b.name), 0.07, 14);
    b.rim = blob(b.x, b.y, b.r + 7, hash(b.name) + 1, 0.06, 14);
    const lr = b.r + 18;
    const a0 = (205 * Math.PI) / 180;
    const a1 = (335 * Math.PI) / 180;
    b.label = `M${r1(b.x + Math.cos(a0) * lr)} ${r1(b.y + Math.sin(a0) * lr)} A${lr} ${lr} 0 0 1 ${r1(b.x + Math.cos(a1) * lr)} ${r1(b.y + Math.sin(a1) * lr)}`;
  });

  return { beds, plants, walks, width: Math.round(x1 - x0), height: Math.round(y1 - y0) };
}
