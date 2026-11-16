"use client";

import { useId, useMemo, useState } from "react";
import { buildRows, scenarios, type ScenarioId } from "../lib/ledger-data";
import { Legend, Mark, outcomeSentence, outcomeWord, stageLabel, type Stage } from "./Mark";

const stages: Stage[] = ["proposed", "executed", "confirmed"];

export default function RunLedger() {
  const uid = useId();
  const [scenario, setScenario] = useState<ScenarioId>("surprise");
  const [selected, setSelected] = useState(5);

  const rows = useMemo(() => buildRows(scenario), [scenario]);
  const current = scenarios.find((s) => s.id === scenario)!;
  const row = rows[Math.min(selected, rows.length - 1)];
  const modelEvents = rows.filter((r) => r.driver === "model").length;
  const handOvers = rows.filter((r, i) => r.driver === "model" && rows[i - 1]?.driver === "procedure").length;

  return (
    <figure className="ledger" id="run-ledger" aria-labelledby={`${uid}-title`}>
      <div className="ledger-head">
        <h3 id={`${uid}-title`}>One task, three designs</h3>
        <p>
          Illustrative. The task, the application and every outcome here are invented; this is not a capture and not
          live data. Pick a design, then pick an event to see what the ledger would record for it.
        </p>
        <fieldset>
          <legend>Design</legend>
          <div className="seg">
            {scenarios.map((s) => (
              <label key={s.id}>
                <input
                  type="radio"
                  name={`${uid}-scenario`}
                  value={s.id}
                  checked={scenario === s.id}
                  onChange={() => {
                    setScenario(s.id);
                    setSelected(5);
                  }}
                />
                <span>{s.name}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p style={{ marginTop: "0.75rem" }}>{current.summary}</p>
      </div>

      <div className="ledger-body">
        <div className="ledger-list">
          <div className="ledger-cols" aria-hidden="true">
            <span>#</span>
            <span>Event</span>
            <span>Decided by</span>
            {stages.map((s) => (
              <span key={s}>
                <span className="long">{stageLabel[s]}</span>
                <span className="short">{stageLabel[s][0]}</span>
              </span>
            ))}
          </div>
          <ol>
            {rows.map((r, i) => (
              <li key={`${scenario}-${i}`} className="ledger-row">
                <button type="button" aria-current={i === selected ? "true" : undefined} onClick={() => setSelected(i)}>
                  <span className="n">{i + 1}</span>
                  <span>
                    {r.label}
                    <span className="mobile-driver" aria-hidden="true">{r.driver}</span>
                    <span className="sr-only">
                      . Decided by the {r.driver}. Proposed: {outcomeWord[r.proposed]}. Executed:{" "}
                      {outcomeWord[r.executed]}. Confirmed: {outcomeWord[r.confirmed]}.
                    </span>
                  </span>
                  <span className="driver" data-driver={r.driver} aria-hidden="true">
                    {r.driver}
                  </span>
                  <span className="marks" aria-hidden="true">
                    <Mark stage="proposed" outcome={r.proposed} />
                    <Mark stage="executed" outcome={r.executed} />
                    <Mark stage="confirmed" outcome={r.confirmed} />
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <dl className="ledger-stats">
            <div>
              <dt>Events decided by the model</dt>
              <dd>
                {modelEvents} of {rows.length}
              </dd>
            </div>
            <div>
              <dt>Hand-overs to the model</dt>
              <dd>{handOvers}</dd>
            </div>
          </dl>
          <div style={{ padding: "0 1.25rem 1.25rem" }}>
            <Legend />
          </div>
        </div>

        <div className="ledger-detail" aria-live="polite">
          <h4>
            Event {Math.min(selected, rows.length - 1) + 1}: {row.label}
          </h4>
          <p className="by">Decided by the {row.driver}.</p>
          <dl>
            {stages.map((s) => {
              const outcome = row[s];
              return (
                <div key={s}>
                  <Mark stage={s} outcome={outcome} />
                  <dt>{stageLabel[s]}</dt>
                  <dd>{outcomeSentence[s][outcome]}</dd>
                </div>
              );
            })}
          </dl>
          <p className="note">{row.note}</p>
        </div>
      </div>
    </figure>
  );
}
