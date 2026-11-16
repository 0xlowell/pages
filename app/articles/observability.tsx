import Link from "next/link";
import { Legend, Mark } from "../components/Mark";

export default function ObservabilityArticle() {
  return (
    <>
      <p>
        When an automation clicks a button, three different things can be true, and logs often merge them into one line
        that says “saved”.
      </p>

      <figure>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">What happened</th>
                <th scope="col">What it means</th>
                <th scope="col">Where the evidence comes from</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row"><Mark stage="proposed" outcome="yes" /> Proposed</th>
                <td>An agent or a procedure decided the action should happen.</td>
                <td>The model response or the procedure step.</td>
              </tr>
              <tr>
                <th scope="row"><Mark stage="executed" outcome="yes" /> Executed</th>
                <td>The tool actually performed it on the machine.</td>
                <td>The tool call and its return value.</td>
              </tr>
              <tr>
                <th scope="row"><Mark stage="confirmed" outcome="yes" /> Confirmed</th>
                <td>Someone or something observed the result afterwards.</td>
                <td>A screenshot, a read-back, or a business-side check.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </figure>

      <p>
        Each can be true without the next. A model can propose a click that the harness refuses. A click can execute
        and land on the wrong control. A save can execute and show a dialog that tells you nothing about whether the
        write happened. Treating them as one event makes those cases invisible.
      </p>

      <h2>Missing data is unknown, not zero</h2>
      <p>
        The second rule I hold to: when I have no evidence, the record says <em>unknown</em>. It does not say “no
        errors” and it does not say zero. A step with no screenshot has not been shown to be fine. A run with no
        duration recorded did not take no time.
      </p>
      <p>
        On screen that means a fourth state, drawn differently from the other three, so a gap does not look like a
        clean result.
      </p>
      <Legend />

      <h2>What the Run Lab puts in one place</h2>
      <p>For each run, I want to be able to open one view and see:</p>
      <ul>
        <li>a timeline of events, with durations;</li>
        <li>screenshots, and a video that moves in step with the selected event;</li>
        <li>the model calls and tool calls behind each event;</li>
        <li>side-by-side comparison of two attempts at the same journey;</li>
        <li>errors, next to the step that raised them.</li>
      </ul>
      <p>
        None of that is clever. It is what lets me answer “what did it actually do?” without trusting a summary the
        automation wrote about itself.
      </p>

      <h2>Why this matters for retries</h2>
      <p>
        The distinction pays off most when something goes wrong. If a run stops after a click that was executed but not
        confirmed, replaying that click blindly could do the same thing twice. Knowing the click ran, and that its
        result is unknown, is what lets a retry start by <em>reading the state</em> before it acts. That is how I think
        about bounded retries and duplicate-action prevention: the ledger is the input to the decision, not an
        afterthought.
      </p>
      <p className="aside">
        The interactive example on the <Link href="/work/hybrid-automation/#run-ledger">project page</Link> uses invented data. It shows one
        save whose result stays unknown until a later read-back settles it.
      </p>
    </>
  );
}
