import Link from "next/link";
import LaneStrip from "../components/LaneStrip";
import RunLedger from "../components/RunLedger";
import { Legend } from "../components/Mark";

export default function HybridCase() {
  return (
    <>
      <section>
        <h2>The problem</h2>
        <div>
          <p>
            A core-banking style application, operated through its screens on Windows machines reached through Citrix.
            The starting design was computer use end to end: a model reads the screen, proposes an action, the action
            runs, repeat.
          </p>
          <p>
            That is a good way to explore an unfamiliar interface. As the default for journeys people already know, I
            questioned it: every step pays for a model call, and a reviewer has to read a transcript to see what happened.
          </p>
        </div>
      </section>

      <section>
        <h2>What I proposed</h2>
        <div>
          <ul>
            <li>A coding-agent CLI as the harness, instead of another bespoke agent loop.</li>
            <li>Human guidance at the start, so the agent explores with direction.</li>
            <li>Tools and context managed by the harness, with specialised sub-agents available when a task calls for them.</li>
            <li>Deterministic RPA procedures for journeys that are known and validated.</li>
            <li>Computer use only for a situation a procedure does not cover or a step that fails, then a hand-back.</li>
          </ul>
          <p>
            Sub-agents are a capability of the harness. I am not describing a fleet. What improves over time is the set
            of procedures, through my corrections and their formalisation. No fine-tuning, no reinforcement learning,
            no self-improving loop.
          </p>
        </div>
      </section>

      <section>
        <h2>Three designs compared</h2>
        <div>
          <p>
            Cells are steps of one invented ten-step task. Ochre means the model decided it; grey means a recorded
            procedure ran it.
          </p>
          <LaneStrip />
        </div>
      </section>

      <section className="wide">
        <RunLedger />
      </section>

      <section>
        <h2>Run Lab</h2>
        <div>
          <p>The tool I use to look at runs. One view per run, with:</p>
          <ul>
            <li>a timeline of events and durations;</li>
            <li>screenshots, and a video that follows the selected event;</li>
            <li>model calls and tool calls;</li>
            <li>comparison between attempts, and errors next to the step that raised them.</li>
          </ul>
          <p>
            Its main rule: a proposed action, an executed action and a confirmed business result are three different
            facts. Missing data is shown as unknown, never as zero.
          </p>
          <Legend />
        </div>
      </section>

      <section>
        <h2>Running it for real</h2>
        <div>
          <p>The runtime has to work unattended on Windows and Citrix:</p>
          <ul>
            <li>distributed and versioned;</li>
            <li>fed by a work queue;</li>
            <li>bounded retries, with checks after actions;</li>
            <li>protection against doing the same action twice.</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Where it stands</h2>
        <div>
          <div className="limits">
            <h3>Early, about a month in</h3>
            <ul>
              <li>Lower cloud AI cost and better robustness are design goals. I have not measured either.</li>
              <li>No return-on-investment or production-reliability claim is made here.</li>
              <li>The data in the interactive example is invented.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Read more</h2>
        <div>
          <ul className="related">
            <li><Link href="/writing/from-computer-use-to-hybrid-automation/">From continuous computer use to hybrid automation</Link></li>
            <li><Link href="/writing/proposed-executed-confirmed/">Proposed, executed, confirmed</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
