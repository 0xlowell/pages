// The wink: the little crop an idea would be on the farm (PixelFarm, CC0).
const CROP = { seedling: 50, budding: 52, evergreen: 54 } as const;
export type StageName = keyof typeof CROP;

export default function Sprout({ stage, size = 16, base = "" }: { stage: StageName; size?: number; base?: string }) {
  const i = CROP[stage];
  const k = size / 16;
  return (
    <span
      className="sprout"
      title={stage}
      role="img"
      aria-label={stage}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${base}/garden/farm.png)`,
        backgroundSize: `${128 * k}px auto`,
        backgroundPosition: `-${(i % 8) * 16 * k}px -${Math.floor(i / 8) * 16 * k}px`,
      }}
    />
  );
}
