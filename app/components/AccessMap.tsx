"use client";

import { useId, useState } from "react";

type Kind = "use" | "access";

const people = [
  { id: "avery", name: "Avery", y: 60, via: "support" as string | null, role: null as string | null },
  { id: "noor", name: "Noor", y: 150, via: null, role: "manager" },
  { id: "sam", name: "Sam", y: 240, via: null, role: "steward" },
];
const groups = [{ id: "support", name: "Support team", y: 60, role: "handler" }];
const roles = [
  { id: "handler", name: "Case handler", y: 60, perms: ["view", "edit"] },
  { id: "manager", name: "Case manager", y: 150, perms: ["view", "edit", "cancel"] },
  { id: "steward", name: "Access steward", y: 240, perms: ["assign"] },
];
const perms: { id: string; name: string; y: number; kind: Kind }[] = [
  { id: "view", name: "View cases", y: 40, kind: "use" },
  { id: "edit", name: "Edit drafts", y: 85, kind: "use" },
  { id: "cancel", name: "Cancel unsubmitted", y: 130, kind: "use" },
  { id: "assign", name: "Assign roles", y: 235, kind: "access" },
];

const X = { person: 20, group: 150, role: 300, perm: 460 };
const W = { person: 90, group: 110, role: 120, perm: 140 };
const H = 32;

const curve = (x1: number, y1: number, x2: number, y2: number) =>
  `M${x1} ${y1} C${(x1 + x2) / 2} ${y1} ${(x1 + x2) / 2} ${y2} ${x2} ${y2}`;

export default function AccessMap() {
  const uid = useId();
  const [who, setWho] = useState("sam");
  const person = people.find((p) => p.id === who)!;

  const roleIds = new Set<string>();
  const groupIds = new Set<string>();
  if (person.via) {
    groupIds.add(person.via);
    roleIds.add(groups.find((g) => g.id === person.via)!.role);
  }
  if (person.role) roleIds.add(person.role);
  const permIds = new Set<string>();
  roles.filter((r) => roleIds.has(r.id)).forEach((r) => r.perms.forEach((p) => permIds.add(p)));

  const can = perms.filter((p) => permIds.has(p.id));
  const useCan = can.filter((p) => p.kind === "use").map((p) => p.name);
  const accessCan = can.filter((p) => p.kind === "access").map((p) => p.name);
  const via = person.via
    ? `through the ${groups.find((g) => g.id === person.via)!.name} group, which holds the ${roles.find((r) => r.id === groups.find((g) => g.id === person.via)!.role)!.name} role`
    : `through the ${roles.find((r) => r.id === person.role)!.name} role, assigned directly`;

  const edges: { d: string; on: boolean; key: string }[] = [];
  people.forEach((p) => {
    if (p.via) {
      const g = groups.find((x) => x.id === p.via)!;
      edges.push({ key: `${p.id}-${g.id}`, d: curve(X.person + W.person, p.y, X.group, g.y), on: p.id === who });
    } else {
      const r = roles.find((x) => x.id === p.role)!;
      edges.push({ key: `${p.id}-${r.id}`, d: curve(X.person + W.person, p.y, X.role, r.y), on: p.id === who });
    }
  });
  groups.forEach((g) => {
    const r = roles.find((x) => x.id === g.role)!;
    edges.push({ key: `${g.id}-${r.id}`, d: curve(X.group + W.group, g.y, X.role, r.y), on: groupIds.has(g.id) });
  });
  roles.forEach((r) =>
    r.perms.forEach((pid) => {
      const p = perms.find((x) => x.id === pid)!;
      edges.push({ key: `${r.id}-${pid}`, d: curve(X.role + W.role, r.y, X.perm, p.y + (p.kind === "use" ? 6 : 14)), on: roleIds.has(r.id) });
    }),
  );
  // Draw active edges last so they sit on top.
  edges.sort((a, b) => Number(a.on) - Number(b.on));

  return (
    <figure className="amap" aria-labelledby={`${uid}-title`}>
      <div className="amap-head">
        <h3 id={`${uid}-title`}>Who can do what, on a fictional map</h3>
        <p>
          Illustrative. The people, groups and roles are invented. Choose a person to follow their path from group or
          role to permission. The two permission groups are separate on purpose: assigning roles does not open the data.
        </p>
        <fieldset>
          <legend>Person</legend>
          <div className="seg">
            {people.map((p) => (
              <label key={p.id}>
                <input
                  type="radio"
                  name={`${uid}-person`}
                  value={p.id}
                  checked={who === p.id}
                  onChange={() => setWho(p.id)}
                />
                <span>{p.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="amap-svg scroll-x" tabIndex={0} role="group" aria-label="Relationship map, scrolls sideways on small screens">
        <svg viewBox="0 0 610 300" aria-hidden="true">
          <text x={X.person} y="14" className="dg-text-strong">People</text>
          <text x={X.group} y="14" className="dg-text-strong">Groups</text>
          <text x={X.role} y="14" className="dg-text-strong">Roles</text>
          <text x={X.perm} y="14" className="dg-text-strong">Permissions</text>
          {edges.map((e) => (
            <path key={e.key} className="amap-edge" data-on={e.on} d={e.d} />
          ))}
          {people.map((p) => (
            <g key={p.id} className="amap-node" data-on={p.id === who}>
              <rect x={X.person} y={p.y - H / 2} width={W.person} height={H} rx="8" />
              <text x={X.person + 12} y={p.y + 4.5}>{p.name}</text>
            </g>
          ))}
          {groups.map((g) => (
            <g key={g.id} className="amap-node" data-on={groupIds.has(g.id)}>
              <rect x={X.group} y={g.y - H / 2} width={W.group} height={H} rx="8" />
              <text x={X.group + 12} y={g.y + 4.5}>{g.name}</text>
            </g>
          ))}
          {roles.map((r) => (
            <g key={r.id} className="amap-node" data-on={roleIds.has(r.id)}>
              <rect x={X.role} y={r.y - H / 2} width={W.role} height={H} rx="8" />
              <text x={X.role + 12} y={r.y + 4.5}>{r.name}</text>
            </g>
          ))}
          <path className="dg-dash" d={`M${X.perm} 176 H${X.perm + W.perm}`} />
          <text x={X.perm} y="196" className="dg-text">Manage access</text>
          <text x={X.perm} y="160" className="dg-text">Use business data</text>
          {perms.map((p) => (
            <g key={p.id} className="amap-node" data-kind={p.kind} data-on={permIds.has(p.id)}>
              <rect x={X.perm} y={p.y - H / 2 + (p.kind === "use" ? 6 : 14)} width={W.perm} height={H} rx="8" />
              <text x={X.perm + 12} y={p.y + 4.5 + (p.kind === "use" ? 6 : 14)}>{p.name}</text>
            </g>
          ))}
        </svg>
      </div>

      <div className="amap-result" aria-live="polite">
        <p>
          <strong>{person.name}</strong> holds permissions {via}.
        </p>
        <p>
          Business data: {useCan.length ? useCan.join(", ") : "none"}. Managing access:{" "}
          {accessCan.length ? accessCan.join(", ") : "none"}.
        </p>
      </div>
    </figure>
  );
}
