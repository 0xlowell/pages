import { getFragments, type Fragment, type Stage } from "./fragments";

// The home page is a small farm seen from above, drawn with CC0 pixel art
// (see public/garden/CREDITS.txt). Everything is laid out once, at build
// time, on a grid of 16-pixel tiles.
//
//   subject       -> a field, with a wooden sign
//   idea          -> a crop in the field of its first subject, at its stage
//   harvest       -> a fruit tree beside the field it belongs to
//   field notes   -> the cottage

export type Sheet = "t" | "f"; // t: Kenney Tiny Town, f: LushMustache PixelFarm
export type Tile = { s: Sheet; i: number; x: number; y: number; z?: number }; // z: drawn z times larger

export type Thing = {
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
  x: number; // tile coordinates of the top-left corner
  y: number;
  w: number;
  h: number;
  field?: string;
};

export type Field = { id: string; name: string; x: number; y: number; w: number; h: number; count: number };

const fieldId = (s: string) => "field-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Kenney Tiny Town tiles used here (12 per row in the sheet).
const T = {
  grass: 0,
  tuft: 1,
  flowers: 2,
  dirt: { tl: 12, t: 13, tr: 14, l: 24, c: 25, r: 26, bl: 36, b: 37, br: 38 },
  path: 25,
  sign: 83,
  tallTree: [4, 16],
  tallAutumn: [3, 15],
  smallTree: 28,
  smallAutumn: 27,
  bush: 5,
  sprout: 17,
  mushroom: 29,
  hive: 94,
  barrel: 107,
  house: [
    [52, 53, 53, 54],
    [64, 65, 65, 66],
    [72, 84, 73, 75],
    [72, 85, 73, 75],
  ],
};

// PixelFarm crop stages (8 per row in the sheet): seeds, sprout, ... grown.
const CROP: Record<Stage, number> = { seedling: 50, budding: 52, evergreen: 54 };

export function buildFarm() {
  const fragments = getFragments();
  const ideas = fragments.filter((f) => f.kind === "thought");
  const harvests = fragments.filter((f) => f.kind === "article");
  const notes = fragments.find((f) => f.kind === "page");

  // Fields: one per subject that has crops of its own (its first subject).
  const own = new Map<string, Fragment[]>();
  ideas.forEach((f) => {
    const s = f.subjects[0] ?? "unsorted";
    own.set(s, [...(own.get(s) || []), f]);
  });
  const counts = new Map<string, number>();
  fragments.forEach((f) => f.subjects.forEach((s) => counts.set(s, (counts.get(s) || 0) + 1)));
  const names = [...own.keys()].sort((a, b) => (counts.get(b) || 0) - (counts.get(a) || 0) || a.localeCompare(b));

  // Field sizes: crops sit one per tile inside a border of soil.
  const fields: Field[] = names.map((name) => {
    const n = own.get(name)!.length;
    const cols = Math.max(2, Math.ceil(Math.sqrt(n * 1.6)));
    const rows = Math.max(1, Math.ceil(n / cols));
    return { id: fieldId(name), name, x: 0, y: 0, w: cols * 2 + 2, h: rows * 2 + 2, count: counts.get(name) || 0 };
  });

  // Shelf packing to the right of the cottage, with room for trees and paths.
  const W = Math.max(32, 12 + fields.reduce((t, f) => t + f.w + 6, 0) / 2);
  const GAP = 6;
  let cx = 12;
  let cy = 4;
  let rowH = 0;
  const rows: { y: number; h: number }[] = [];
  fields.forEach((f) => {
    if (cx + f.w > W - 3) {
      rows.push({ y: cy, h: rowH });
      cx = 12;
      cy += rowH + 5;
      rowH = 0;
    }
    f.x = cx;
    f.y = cy;
    cx += f.w + GAP;
    rowH = Math.max(rowH, f.h);
  });
  rows.push({ y: cy, h: rowH });
  const H = cy + rowH + 7;
  const Wi = Math.ceil(W);

  // Occupancy grid, so trees and decoration never overlap fields or paths.
  const used = Array.from({ length: H }, () => new Array<boolean>(Wi).fill(false));
  const mark = (x: number, y: number, w: number, h: number) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (used[j]?.[i] !== undefined) used[j][i] = true;
  };
  const free = (x: number, y: number, w: number, h: number) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (used[j]?.[i] !== false) return false;
    return true;
  };

  const ground: Tile[] = [];
  const things: Tile[] = [];

  // Grass everywhere, with tufts and flowers here and there.
  const rand = rng(7);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < Wi; x++) {
      const r = rand();
      ground.push({ s: "t", i: r < 0.08 ? T.tuft : r < 0.12 ? T.flowers : T.grass, x, y });
    }

  // Cottage (the field notes).
  const house = { x: 3, y: 4 };
  mark(house.x - 1, house.y - 1, 6, 7);
  T.house.forEach((row, j) => row.forEach((i, k) => things.push({ s: "t", i, x: house.x + k, y: house.y + j })));

  // Paths: one under each row of fields, and one down from the cottage door.
  const pathTiles = new Set<string>();
  const addPath = (x: number, y: number) => {
    if (x < 1 || y < 1 || x >= Wi - 1 || y >= H - 1) return;
    pathTiles.add(`${x},${y}`);
  };
  rows.forEach((r) => {
    for (let x = 4; x < Wi - 2; x++) addPath(x, r.y + r.h + 1);
  });
  for (let y = house.y + 4; y <= rows[rows.length - 1].y + rows[rows.length - 1].h + 1; y++) addPath(house.x + 1, y);
  pathTiles.forEach((k) => {
    const [x, y] = k.split(",").map(Number);
    ground.push({ s: "t", i: T.path, x, y });
    mark(x, y, 1, 1);
  });

  // Fields: a soil nine-slice, crops on alternate tiles, a sign at the corner.
  const crops: Thing[] = [];
  fields.forEach((f) => {
    mark(f.x - 1, f.y - 2, f.w + 2, f.h + 3);
    for (let j = 0; j < f.h; j++)
      for (let i = 0; i < f.w; i++) {
        const top = j === 0;
        const bottom = j === f.h - 1;
        const left = i === 0;
        const right = i === f.w - 1;
        const d = T.dirt;
        const tile = top ? (left ? d.tl : right ? d.tr : d.t) : bottom ? (left ? d.bl : right ? d.br : d.b) : left ? d.l : right ? d.r : d.c;
        ground.push({ s: "t", i: tile, x: f.x + i, y: f.y + j });
      }
    things.push({ s: "t", i: T.sign, x: f.x, y: f.y - 1 });
    const list = own.get(f.name)!;
    const cols = (f.w - 2) / 2;
    list.forEach((idea, k) => {
      const x = f.x + 1 + (k % cols) * 2;
      const y = f.y + 1 + Math.floor(k / cols) * 2;
      crops.push(thing(idea, x, y, 2, 2, f.id)); // crops are drawn at twice the tile size

    });
  });

  // Fruit trees: each harvest grows beside the field of its first subject.
  const trees: Thing[] = [];
  const fieldOf = new Map(fields.map((f) => [f.name, f]));
  harvests.forEach((h, k) => {
    const f = fieldOf.get(h.subjects.find((s) => fieldOf.has(s)) ?? "") ?? fields[k % fields.length];
    let spot: { x: number; y: number } | null = null;
    for (let r = 0; r < 12 && !spot; r++)
      for (const [dx, dy] of [
        [f.w + 1 + r, 0],
        [f.w + 1 + r, Math.max(0, f.h - 2)],
        [-3 - r, 0],
        [f.w + 1 + r, -3],
      ]) {
        if (free(f.x + dx, f.y + dy, 2, 2)) {
          spot = { x: f.x + dx, y: f.y + dy };
          break;
        }
      }
    if (!spot) return;
    mark(spot.x - 1, spot.y, 4, 2);
    // A round tree, drawn at twice the size of the scenery so harvests stand out.
    things.push({ s: "t", i: T.bush, x: spot.x, y: spot.y, z: 2 });
    trees.push(thing(h, spot.x, spot.y, 2, 2, f.id));
  });

  // The cottage is clickable too.
  const cottage = notes ? thing(notes, house.x, house.y, 4, 4) : null;

  // Decoration: a ring of woods around the farm, a few things near the cottage.
  const deco = rng(21);
  const decor = (x: number, y: number, tiles: number[], w: number, h: number) => {
    if (!free(x, y, w, h)) return;
    mark(x, y, w, h);
    tiles.forEach((i, n) => things.push({ s: "t", i, x: x + (n % w), y: y + Math.floor(n / w) }));
  };
  [
    [house.x + 4, house.y + 3, [T.barrel]],
    [house.x - 1, house.y + 3, [T.hive]],
  ].forEach(([x, y, t]) => decor(x as number, y as number, t as number[], 1, 1));
  for (let x = 0; x < Wi; x += 1) {
    if (deco() < 0.55) decor(x, 0, deco() < 0.7 ? T.tallTree : T.tallAutumn, 1, 2);
    if (deco() < 0.55) decor(x, H - 2, deco() < 0.7 ? T.tallTree : T.tallAutumn, 1, 2);
  }
  for (let y = 2; y < H - 2; y += 1) {
    if (deco() < 0.5) decor(0, y, [deco() < 0.6 ? T.smallTree : T.bush], 1, 1);
    if (deco() < 0.5) decor(Wi - 1, y, [deco() < 0.6 ? T.smallTree : T.smallAutumn], 1, 1);
  }
  for (let n = 0; n < 40; n++) {
    const x = 1 + Math.floor(deco() * (Wi - 2));
    const y = 2 + Math.floor(deco() * (H - 4));
    const r = deco();
    decor(x, y, [r < 0.3 ? T.bush : r < 0.5 ? T.mushroom : r < 0.75 ? T.smallTree : T.sprout], 1, 1);
  }

  return { W: Wi, H, ground, things, fields, crops, trees, cottage, cropTile: CROP };
}

function thing(f: Fragment, x: number, y: number, w: number, h: number, field?: string): Thing {
  return {
    id: f.id,
    kind: f.kind,
    html: f.html,
    text: f.html.replace(/<[^>]+>/g, ""),
    subjects: f.subjects,
    stage: f.stage,
    planted: f.planted,
    tended: f.tended,
    sources: f.sources,
    href: f.href,
    x,
    y,
    w,
    h,
    field,
  };
}
