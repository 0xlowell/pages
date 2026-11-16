// Small, pure drawing helpers shared by the build-time layout and the browser.

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const hash = (s: string) => [...s].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
export const r1 = (n: number) => Math.round(n * 10) / 10;

// A soft, slightly irregular closed shape, like a hand-cut bed or a canopy.
export function blob(cx: number, cy: number, r: number, seed: number, wobble = 0.09, points = 12): string {
  const rand = rng(seed);
  const phase = rand() * Math.PI * 2;
  const pts = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2 + phase;
    const k = 1 + wobble * (rand() * 2 - 1) + wobble * 0.5 * Math.sin(a * 3 + phase);
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
  // Catmull-Rom through the points, as cubic Béziers.
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p0 = pts[(i - 1 + points) % points];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % points];
    const p3 = pts[(i + 2) % points];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return d + "Z";
}

