import type { Outcome } from "../components/Mark";

export type Driver = "model" | "procedure";

export type LedgerRow = {
  label: string;
  driver: Driver;
  proposed: Outcome;
  executed: Outcome;
  confirmed: Outcome;
  note: string;
};

export type ScenarioId = "continuous" | "known" | "surprise";

export const scenarios: { id: ScenarioId; name: string; summary: string }[] = [
  {
    id: "continuous",
    name: "Continuous computer use",
    summary: "The model looks at the screen and decides every action.",
  },
  {
    id: "known",
    name: "Hybrid, known path",
    summary: "A recorded procedure runs every step. The model is not called.",
  },
  {
    id: "surprise",
    name: "Hybrid, one surprise",
    summary:
      "The procedure runs until step 6 no longer matches the recording. The model handles that step, then hands back.",
  },
];

type Base = {
  label: string;
  confirmed: Outcome;
  model: string;
  procedure: string;
};

// An invented task in an invented customer-records application.
const base: Base[] = [
  {
    label: "Open customer search",
    confirmed: "yes",
    model: "Reads the screen and proposes a click on the search menu. The next screenshot shows the search form.",
    procedure: "Replays the recorded click. A check finds the search form title on screen.",
  },
  {
    label: "Search by reference",
    confirmed: "yes",
    model: "Types the reference and proposes Enter. A one-row result list is visible afterwards.",
    procedure: "Types the reference from the work item and presses Enter. The check expects exactly one row.",
  },
  {
    label: "Open the record",
    confirmed: "yes",
    model: "Opens the row. The record header carries the same reference.",
    procedure: "Opens the row. The check compares the record header with the reference.",
  },
  {
    label: "Open the contact tab",
    confirmed: "yes",
    model: "Finds the tab and clicks it. The address fields appear.",
    procedure: "Clicks the recorded tab. The check expects the address fields.",
  },
  {
    label: "Edit the address line",
    confirmed: "yes",
    model: "Replaces the text in the field. The screenshot shows the new text.",
    procedure: "Replaces the text in the field. The check reads the field value back.",
  },
  {
    label: "Choose the country",
    confirmed: "yes",
    model: "Opens the list and picks the value. The field shows the choice.",
    procedure: "Opens the list and picks the value from the work item. The field shows the choice.",
  },
  {
    label: "Save",
    confirmed: "unknown",
    model:
      "Clicks Save. The dialog that follows does not say whether the write succeeded, so this stays unknown until event 10 reads the stored value.",
    procedure:
      "Clicks Save. The dialog that follows does not say whether the write succeeded, so this stays unknown until the read-back at the end.",
  },
  {
    label: "Dismiss the confirmation dialog",
    confirmed: "yes",
    model: "Closes the dialog. The record view is back.",
    procedure: "Closes the dialog. The check expects the record view.",
  },
  {
    label: "Reopen the record",
    confirmed: "yes",
    model: "Searches again and opens the record from a fresh load.",
    procedure: "Repeats the search and opens the record from a fresh load.",
  },
  {
    label: "Read back the stored address",
    confirmed: "yes",
    model: "Reads the stored address on the fresh load and compares it with the intended value. This settles event 7.",
    procedure: "Reads the stored address on the fresh load and compares it with the work item. This settles the save.",
  },
];

function row(b: Base, driver: Driver): LedgerRow {
  return {
    label: b.label,
    driver,
    proposed: "yes",
    executed: "yes",
    confirmed: b.confirmed,
    note: driver === "model" ? b.model : b.procedure,
  };
}

export function buildRows(id: ScenarioId): LedgerRow[] {
  if (id === "continuous") return base.map((b) => row(b, "model"));
  if (id === "known") return base.map((b) => row(b, "procedure"));
  const rows: LedgerRow[] = [];
  base.forEach((b, i) => {
    if (i === 5) {
      rows.push({
        label: "Choose the country",
        driver: "procedure",
        proposed: "yes",
        executed: "failed",
        confirmed: "no",
        note: "The recorded selector for the country list is not on screen: the layout differs from the recording. The procedure stops here instead of guessing, and asks for a hand-over.",
      });
      rows.push({
        label: "Choose the country (hand-over)",
        driver: "model",
        proposed: "yes",
        executed: "yes",
        confirmed: "yes",
        note: "Looks at the screen, finds the list in its new position and picks the value. The field shows the choice. Control goes back to the procedure at the next step.",
      });
    } else {
      rows.push(row(b, "procedure"));
    }
  });
  return rows;
}
