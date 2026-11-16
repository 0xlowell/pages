import Link from "next/link";

export default function WorkspacesCase() {
  return (
    <>
      <section>
        <h2>My role</h2>
        <div>
          <p>
            These are two existing products. I contribute to their continued development and to the integration between
            them. I did not originate either of them, and I do not present them as mine.
          </p>
        </div>
      </section>

      <section>
        <h2>Employee AI workspace</h2>
        <div>
          <p>
            A shared workspace for conversational AI: persistent conversations, governed business tools, files, and
            interactive pages generated from data the person is allowed to see.
          </p>
          <p className="subhead">What I work on</p>
          <ul>
            <li>Conversation state that survives a reload.</li>
            <li>A dropped stream reconnecting to the current run, so interrupted work can be recovered.</li>
            <li>Interactive pages that use only permitted data, and keep their context when saved.</li>
          </ul>
          <p>
            The browser presents the experience. The server owns the conversation, identity, tool permissions and
            execution state.
          </p>
        </div>
      </section>

      <section>
        <h2>Assisted product intake</h2>
        <div>
          <p>
            A journey that helps employees describe a need, understand the delivery options and prepare a structured
            request. An assistant proposes changes to the form; the person reviews them and submits.
          </p>
          <p className="subhead">What I work on</p>
          <ul>
            <li>Durable messages and files kept on the server.</li>
            <li>Proposals applied once, with a once-only draft application.</li>
            <li>Recovery after an interrupted upload or stream.</li>
            <li>Handoff to request tracking, and the development paths and starters that support later delivery.</li>
          </ul>
          <p>
            The assistant does not gain the right to submit because it helped write the request.
          </p>
        </div>
      </section>

      <section>
        <h2>Current stage</h2>
        <div>
          <div className="limits">
            <h3>Ongoing development and integration</h3>
            <ul>
              <li>Existing products and a shared backend; integration work is in progress.</li>
              <li>Assisting with a request is not the same as automatically building and deploying an application, and nothing here claims that.</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2>Read more</h2>
        <div>
          <ul className="related">
            <li><Link href="/writing/the-applications-around-the-agent/">The applications around the agent</Link></li>
          </ul>
        </div>
      </section>
    </>
  );
}
