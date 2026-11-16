export type Stage = "proposed" | "executed" | "confirmed";
export type Outcome = "yes" | "no" | "unknown" | "failed";

export function Mark({ stage, outcome }: { stage: Stage; outcome: Outcome }) {
  return <span className="mark" data-stage={stage} data-outcome={outcome} aria-hidden="true" />;
}

export const stageLabel: Record<Stage, string> = {
  proposed: "Proposed",
  executed: "Executed",
  confirmed: "Confirmed",
};

export const outcomeSentence: Record<Stage, Record<Outcome, string>> = {
  proposed: {
    yes: "The action was proposed.",
    no: "No action was proposed.",
    unknown: "Not recorded.",
    failed: "The proposal was rejected.",
  },
  executed: {
    yes: "The action ran.",
    no: "The action did not run.",
    unknown: "Not recorded whether it ran.",
    failed: "The action failed.",
  },
  confirmed: {
    yes: "The result was observed.",
    no: "Nothing was checked.",
    unknown: "Unknown. No evidence was recorded.",
    failed: "The observed result differs from the intent.",
  },
};

export const outcomeWord: Record<Outcome, string> = {
  yes: "yes",
  no: "no",
  unknown: "unknown",
  failed: "failed",
};

export function Legend() {
  return (
    <ul className="legend" aria-label="How to read the marks">
      <li><span className="mark" data-stage="proposed" data-outcome="yes" aria-hidden="true" /> Yes</li>
      <li><span className="mark" data-stage="proposed" data-outcome="no" aria-hidden="true" /> No, or not done</li>
      <li><span className="mark" data-stage="proposed" data-outcome="unknown" aria-hidden="true" /> Unknown</li>
      <li><span className="mark" data-stage="proposed" data-outcome="failed" aria-hidden="true" /> Failed</li>
    </ul>
  );
}
