// Original schematics. Fictional or abstract only: no capture, no real data.

const squares = Array.from({ length: 10 }, (_, i) => i);

export function HybridSchematic() {
  return (
    <svg viewBox="0 0 480 300" role="img" aria-labelledby="sch-hybrid">
      <title id="sch-hybrid">
        Schematic. The agent explores an application along a winding path. Validated journeys become a procedure of
        ten verified steps. One step falls back to the model, then control returns to the procedure.
      </title>
      <text x="24" y="28" className="dg-text-strong">Explore with the agent</text>
      <path
        className="dg-model-line"
        d="M24 80 C60 36 84 124 120 80 S180 36 216 86 S276 124 312 74 S384 46 456 84"
      />
      {[
        [24, 80],
        [120, 80],
        [216, 86],
        [312, 74],
        [456, 84],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="4.5" className="dg-model" />
      ))}

      <path className="dg-line" d="M240 118 V158" />
      <path className="dg-line" d="M233 150 L240 160 L247 150" />
      <text x="254" y="144" className="dg-text">formalise what is validated</text>

      <text x="24" y="188" className="dg-text-strong">Replay as a procedure</text>
      {squares.map((i) => {
        const x = 24 + i * 44;
        const model = i === 5;
        return (
          <g key={i}>
            <rect x={x} y="202" width="36" height="36" rx="5" className={model ? "dg-model" : "dg-solid"} />
            {!model && (
              <path
                d={`M${x + 10} ${220} l6 6 l11 -12`}
                fill="none"
                stroke="var(--paper)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </g>
        );
      })}
      <path className="dg-model-line" d="M262 246 V262" style={{ strokeWidth: 2 }} />
      <text x="262" y="280" textAnchor="middle" className="dg-text">
        only this step goes back to the model
      </text>
    </svg>
  );
}

export function AccessSchematic() {
  const people: [string, number][] = [
    ["A", 70],
    ["N", 150],
    ["S", 230],
  ];
  const roles: [string, number][] = [
    ["Case handler", 70],
    ["Case manager", 150],
    ["Access steward", 230],
  ];
  const perms: [string, number][] = [
    ["View", 50],
    ["Edit", 90],
    ["Cancel", 130],
  ];
  const curve = (x1: number, y1: number, x2: number, y2: number) =>
    `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;
  return (
    <svg viewBox="0 0 480 300" role="img" aria-labelledby="sch-access">
      <title id="sch-access">
        Schematic with fictional people. People connect to roles, and roles connect to permissions. The permission to
        assign roles is drawn apart from the permissions to use business data.
      </title>
      <text x="22" y="20" className="dg-text-strong">People</text>
      <text x="190" y="20" className="dg-text-strong">Roles</text>
      <text x="362" y="20" className="dg-text-strong">Permissions</text>

      {people.map(([, y], i) => (
        <path key={i} className="dg-line-soft" d={curve(58, y, 190, roles[i][1])} />
      ))}
      {[0, 1].map((i) => (
        <path key={`h${i}`} className="dg-line-soft" d={curve(300, 70, 362, perms[i][1])} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={`m${i}`} className="dg-line-soft" d={curve(300, 150, 362, perms[i][1])} />
      ))}
      <path className="dg-accent-line" d={curve(300, 230, 362, 218)} />
      <path className="dg-accent-line" d={curve(58, 230, 190, 230)} />

      {people.map(([l, y]) => (
        <g key={l}>
          <circle cx="40" cy={y} r="18" className="dg-box" />
          <text x="40" y={y + 4.5} textAnchor="middle" className="dg-text-strong">{l}</text>
        </g>
      ))}
      {roles.map(([l, y]) => (
        <g key={l}>
          <rect x="190" y={y - 17} width="110" height="34" rx="8" className="dg-box" />
          <text x="245" y={y + 4.5} textAnchor="middle" className="dg-text-strong">{l}</text>
        </g>
      ))}
      {perms.map(([l, y]) => (
        <g key={l}>
          <rect x="362" y={y - 14} width="94" height="28" rx="6" className="dg-box" />
          <text x="409" y={y + 4.5} textAnchor="middle" className="dg-text">{l}</text>
        </g>
      ))}
      <path className="dg-dash" d="M350 168 H468" />
      <text x="362" y="186" className="dg-text">Manage access</text>
      <rect x="362" y="204" width="94" height="28" rx="6" className="dg-accent" />
      <text x="409" y="222.5" textAnchor="middle" className="dg-text-strong" style={{ fill: "var(--accent-ink)" }}>
        Assign roles
      </text>
      <text x="22" y="282" className="dg-text">Fictional people. The backend decides, the map shows.</text>
    </svg>
  );
}

export function WorkspaceSchematic() {
  return (
    <svg viewBox="0 0 480 300" role="img" aria-labelledby="sch-ws">
      <title id="sch-ws">
        Schematic of two flows. Top: a chat window talks to a server that owns the conversation, the tools and the
        run state. Bottom: a conversation produces a proposed form, a person reviews it, and only then is it sent.
      </title>
      {/* Workspace flow */}
      <text x="24" y="20" className="dg-text-strong">Workspace</text>
      <rect x="24" y="34" width="124" height="88" rx="10" className="dg-box" />
      <rect x="38" y="50" width="70" height="12" rx="6" className="dg-line-soft" style={{ fill: "var(--paper-2)" }} />
      <rect x="62" y="70" width="72" height="12" rx="6" className="dg-accent" />
      <rect x="38" y="90" width="56" height="12" rx="6" className="dg-line-soft" style={{ fill: "var(--paper-2)" }} />
      <path className="dg-line" d="M150 78 H206" />
      <path className="dg-line" d="M198 72 L207 78 L198 84" />
      <rect x="208" y="34" width="150" height="88" rx="10" className="dg-box" />
      <text x="223" y="58" className="dg-text-strong">Server owns</text>
      <text x="223" y="78" className="dg-text">conversation</text>
      <text x="223" y="95" className="dg-text">tools and identity</text>
      <text x="223" y="112" className="dg-text">run state</text>
      <path className="dg-line" d="M360 78 H404" />
      <path className="dg-line" d="M396 72 L405 78 L396 84" />
      <rect x="406" y="42" width="50" height="72" rx="8" className="dg-box" />
      <path className="dg-line-soft" d="M416 62 H446 M416 78 H446 M416 94 H446" />

      {/* Intake flow */}
      <text x="24" y="168" className="dg-text-strong">Product intake</text>
      <rect x="24" y="182" width="96" height="62" rx="10" className="dg-box" />
      <path className="dg-line-soft" d="M38 200 H100 M38 214 H84 M38 228 H96" />
      <path className="dg-line" d="M122 213 H146" />
      <path className="dg-line" d="M138 207 L147 213 L138 219" />
      <rect x="148" y="176" width="116" height="74" rx="8" className="dg-box" />
      <path className="dg-line-soft" d="M160 194 H250 M160 210 H250" />
      <path className="dg-dash" d="M160 228 H250" style={{ stroke: "var(--accent)" }} />
      <path className="dg-line" d="M266 213 H292" />
      <path className="dg-line" d="M284 207 L293 213 L284 219" />
      <circle cx="318" cy="213" r="22" className="dg-box" />
      <path className="dg-ok" d="M307 214 l8 8 l14 -17" />
      <path className="dg-line" d="M342 213 H372" />
      <path className="dg-line" d="M364 207 L373 213 L364 219" />
      <rect x="374" y="196" width="82" height="34" rx="8" className="dg-accent" />
      <text x="415" y="217.5" textAnchor="middle" className="dg-text-strong" style={{ fill: "var(--accent-ink)" }}>
        Send
      </text>
      <text x="206" y="268" textAnchor="middle" className="dg-text">proposal</text>
      <text x="318" y="268" textAnchor="middle" className="dg-text">person reviews</text>
      <text x="415" y="268" textAnchor="middle" className="dg-text">person submits</text>
    </svg>
  );
}
