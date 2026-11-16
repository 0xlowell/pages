const steps = 10;

function Lane({ name, drivers }: { name: string; drivers: ("model" | "procedure")[] }) {
  const modelCount = drivers.filter((d) => d === "model").length;
  return (
    <div className="lane">
      <span>{name}</span>
      <span className="lane-cells" role="img" aria-label={`${modelCount} of ${drivers.length} steps decided by the model`}>
        {drivers.map((d, i) => (
          <i key={i} data-driver={d} />
        ))}
      </span>
    </div>
  );
}

export default function LaneStrip() {
  const all = Array.from({ length: steps }, () => "model" as const);
  const none = Array.from({ length: steps }, () => "procedure" as const);
  const one = none.map((d, i) => (i === 5 ? ("model" as const) : d));
  return (
    <figure className="lanes">
      <Lane name="Continuous" drivers={all} />
      <Lane name="Hybrid, known path" drivers={none} />
      <Lane name="Hybrid, one surprise" drivers={one} />
      <figcaption>
        Illustrative: the same ten-step task under three designs. Ochre cells are steps the model decides; grey cells run from a recorded procedure.
      </figcaption>
    </figure>
  );
}
