import Link from "next/link";

export default function PlatformArticle() {
  return (
    <>
      <p>
        A useful agent needs somewhere for people to work, a way to turn a conversation into an application action,
        and a clear answer to who is allowed to do what. Those are three connected parts of my current work.
      </p>
      <p>
        My role differs across them. I proposed the application-access solution after the problem was brought to me.
        The employee AI workspace and the product-intake service already existed: I contribute to their continued
        development and integration. This note describes the engineering problems, with internal product names omitted.
      </p>

      <h2>Starting with the access problem</h2>
      <p>
        The problem was how to manage application permissions as the number of applications and business roles grows.
        I proposed separating sign-in from business authorization: use the existing identity provider to establish who
        the person is, and give applications a shared place to declare and evaluate their business permissions.
      </p>
      <p>
        A permission might allow reading a record, editing a draft or cancelling an unsubmitted item. Roles combine
        those permissions. Assignments connect the roles to people or groups, within an application and scope.
        A visual workspace helps a person inspect those relationships, while the backend enforces every decision.
        Moving a person on a map cannot grant access by itself.
      </p>
      <p>
        One distinction matters throughout: permission to manage access does not automatically include permission to
        use the underlying business data. A person can administer a role without receiving its business permissions.
        The proposed management model also uses explicit mandates, so authority is not silently inferred from a job
        title or reporting line.
      </p>
      <p>
        The connected local pilot already brings together a catalog, roles, assignments, server-side checks, an audit
        trail and a first consuming application. Real Microsoft sign-in has been exercised locally. Broader delegation
        semantics and deployment of the shared authorization system remain work in progress; this is not a claim of
        an organization-wide production rollout.
      </p>

      <h2>Continuing the employee AI workspace</h2>
      <p>
        The existing workspace brings conversations, business tools, files and generated interactive pages into one
        interface. I contribute to its ongoing implementation rather than presenting it as a platform I originated.
      </p>
      <p>
        The work goes beyond displaying messages. A conversation needs to survive a reload. A dropped stream should
        reconnect to the current run. An interactive page should use the data the person is permitted to see, and a
        saved result should retain its context. The browser presents the experience; the server owns the conversation,
        identity, tool permissions and execution state.
      </p>
      <p>
        These boundaries make the interface and the runtime an integration problem. A model response, an application
        action and a persisted result need to refer to the same work, including when the connection fails halfway through.
      </p>

      <h2>Connecting assistance to a product request</h2>
      <p>
        Another existing product helps employees describe a need and understand the available delivery paths.
        The assistant proposes a structured request and changes to its form. The employee reviews the content and
        presses Send. The assistant does not acquire submission authority just because it helped write the request.
      </p>
      <p>
        My continuity work includes the conversation and application integration: messages and files kept on the
        server, proposals applied once, recovery after interrupted uploads or streams, and a handoff to request tracking.
        The wider journey also exposes development guidance and repository starters. That supports application
        delivery, but it should not be described as an autonomous factory that builds and deploys any idea.
      </p>

      <h2>A common engineering concern</h2>
      <p>
        Across these products, I care about where a suggestion becomes an action, which system has authority, and
        what evidence remains afterwards. The same questions appear in the automation harness: an agent can explore
        and propose, a bounded procedure can execute, and the application must still confirm the result.
      </p>
      <p>
        I describe that execution side in{" "}
        <Link href="/writing/from-computer-use-to-hybrid-automation/">From continuous computer use to hybrid automation</Link>.
      </p>
    </>
  );
}
