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

// A tidy, layered arrangement, computed once at build time.
// Subjects form a spine down the middle; ideas sit in a column on either side.
// Orders are refined by barycentre (each item moves towards the average height
// of what it is wired to), which keeps wires short and crossings rare.
function layout(nodes: GNode[], edges: GEdge[]) {
  const hubs = nodes.filter((n) => n.kind === "subject");
  const ideas = nodes.filter((n) => n.kind !== "subject");
  const GAP = 30; // between stacked ideas
  const HUB_GAP = 54; // between subjects
  const SPAN = 250; // horizontal distance from the spine to a column

  const hubOf = new Map(hubs.map((h) => [h.text, h]));
  const linksOf = (n: GNode) => n.subjects.map((s) => hubOf.get(s)!).filter(Boolean);
  const ideasOf = new Map(hubs.map((h) => [h.id, [] as GNode[]]));
  edges.forEach((e) => ideasOf.get(e.to)?.push(nodes.find((n) => n.id === e.from)!));

  // Where a wire leaves an idea: the socket row for that subject.
  const socketY = (n: GNode, s: string) => n.y + 32 + n.subjects.indexOf(s) * 24 + 12;
  const hubY = (h: GNode) => h.y + 18;

  // Stack items in order, centred on their wished-for positions, without overlap.
  const stack = (list: GNode[], want: (n: GNode) => number, gap: number) => {
    let cursor = -Infinity;
    list.forEach((n) => {
      n.y = Math.max(want(n), cursor);
      cursor = n.y + n.h + gap;
    });
    // Recentre the block on the mean of what was wanted.
    const shift = list.reduce((t, n) => t + (want(n) - n.y), 0) / (list.length || 1);
    list.forEach((n) => (n.y = Math.round(n.y + shift)));
  };

  // Initial spine: subjects by size, spaced evenly.
  hubs.forEach((h, i) => (h.y = i * 160));
  let left: GNode[] = [];
  let right: GNode[] = [];

  for (let round = 0; round < 8; round++) {
    // Ideas want to sit level with the subjects they are wired to.
    const want = new Map(
      ideas.map((n) => {
        const hs = linksOf(n);
        const y = hs.reduce((t, h) => t + hubY(h), 0) / (hs.length || 1);
        return [n.id, y - 32 - ((n.subjects.length - 1) * 24) / 2 - 12];
      }),
    );
    const order = [...ideas].sort((a, b) => want.get(a.id)! - want.get(b.id)! || a.n - b.n);

    // Split into two columns of similar height, keeping each column in order.
    left = [];
    right = [];
    let hl = 0;
    let hr = 0;
    order.forEach((n) => {
      if (hl <= hr) {
        left.push(n);
        hl += n.h + GAP;
      } else {
        right.push(n);
        hr += n.h + GAP;
      }
    });
    stack(left, (n) => want.get(n.id)!, GAP);
    stack(right, (n) => want.get(n.id)!, GAP);

    // Subjects move to the average height of their wires, in that order.
    const hubWant = new Map(
      hubs.map((h) => {
        const list = ideasOf.get(h.id)!;
        const y = list.reduce((t, n) => t + socketY(n, h.text), 0) / (list.length || 1);
        return [h.id, y - 18];
      }),
    );
    hubs.sort((a, b) => hubWant.get(a.id)! - hubWant.get(b.id)!);
    stack(hubs, (h) => hubWant.get(h.id)!, HUB_GAP);
  }

  const hubW = Math.max(...hubs.map((h) => h.w));
  hubs.forEach((h) => (h.x = Math.round(-h.w / 2)));
  left.forEach((n) => (n.x = Math.round(-hubW / 2 - SPAN - n.w)));
  right.forEach((n) => (n.x = Math.round(hubW / 2 + SPAN)));
}
