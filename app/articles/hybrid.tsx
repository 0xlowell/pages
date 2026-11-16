import Link from "next/link";
import LaneStrip from "../components/LaneStrip";

export default function HybridArticle() {
  return (
    <>
      <p>
        A month ago I started on an automation problem that looked settled. A business application, core banking in this
        case, is operated through its screens, on Windows machines reached through Citrix. The approach already on the
        table was computer use from end to end: a model looks at a screenshot, proposes the next action, the action
        runs, and the loop repeats until the task is done.
      </p>
      <p>
        I questioned that design. This post is the reasoning, written down while it is still early. I have no
        production numbers to offer, and I will say where that matters.
      </p>

      <h2>What computer use is good at</h2>
      <p>
        Pointed at an application nobody has mapped, a model that reads the screen is remarkably useful. It finds the
        menu, notices that a dialog appeared, and recovers from small surprises. For <em>exploring</em> an unfamiliar
        interface I do not know a better tool.
      </p>
      <p>
        The trouble starts when the same journey is walked again and again. Open the search, type a reference, open the
        record, change one field, save. A person has done this a hundred times and could write the steps on a card. In
        a continuous loop the model decides each of them again, every run.
      </p>

      <h2>Why I stopped wanting the model to decide everything</h2>
      <p>Three things bothered me, in this order:</p>
      <ul>
        <li>
          <strong>Cost and time repeat.</strong> Each step pays for a model call, and a journey that is already
          understood pays for it every time.
        </li>
        <li>
          <strong>Runs are hard to compare.</strong> Two runs of the same journey can take different paths for reasons
          that live inside a model response. Reviewing one means reading a transcript.
        </li>
        <li>
          <strong>Failure is undifferentiated.</strong> If every step is a judgement call, a wrong click looks like any
          other click until something downstream breaks.
        </li>
      </ul>
      <p>
        Lower cloud AI cost and better robustness are what I am designing for. They are goals, not results. I have not
        measured either, and this post does not claim a saving or a reliability rate.
      </p>

      <h2>The shape I proposed instead</h2>
      <p>
        First, use a coding-agent CLI as the harness instead of writing yet another agent loop. It already provides
        tools, a way to manage context, a place for a person to steer at the start, and the ability to delegate parts
        of the work to specialised sub-agents. That delegation is a capability of the harness. I am not running a
        fleet of agents, and I would not know how to prove one worked.
      </p>
      <p>Second, treat the model as the way journeys get discovered and the procedure as the way they get repeated:</p>
      <ol>
        <li>Explore the application with the agent, with me guiding it early on.</li>
        <li>Write down the journeys that are known and validated as deterministic RPA procedures, each with checks.</li>
        <li>Run those procedures as the default.</li>
        <li>
          When a procedure meets a situation it does not cover, or fails at a specific step, give that step to computer
          use.
        </li>
        <li>Return control to the procedure as soon as the step is done.</li>
      </ol>

      <figure>
        <LaneStrip />
      </figure>

      <p>
        The point of the last two steps is the narrow scope. The model is not asked to finish the whole task after a
        hiccup. It is asked to get past one step, and the procedure continues. You can see the interactive version of
        this on the <Link href="/work/hybrid-automation/#run-ledger">project page</Link>, with invented data.
      </p>

      <h2>What “learning” means here</h2>
      <p>
        I want to be exact about this, because the phrase invites a bigger claim than I am making. Nothing is
        fine-tuned. There is no reinforcement learning and no system that improves itself in production. What improves
        is a body of procedures: I explore, correct the agent by hand, and formalise what worked into something
        verifiable. The model helps me find the path; a person decides what becomes a procedure.
      </p>

      <h2>What I still do not know</h2>
      <ul>
        <li>How often real procedures will meet a situation they do not cover once they run at volume.</li>
        <li>Whether hand-overs stay narrow in practice, or drift towards “the model finishes everything”.</li>
        <li>How much a procedure costs to maintain when the application changes under it.</li>
      </ul>
      <p>
        The third one worries me most. A procedure is cheaper to run than a loop, but it is also something that can go
        stale. That is why I care about seeing, for every action, what was proposed, what ran and what was confirmed.
        That is the subject of the <Link href="/writing/proposed-executed-confirmed/">next post</Link>.
      </p>
    </>
  );
}
