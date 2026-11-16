import Link from "next/link";
import AccessMap from "../components/AccessMap";

export default function AccessCase() {
  return (
    <>
      <section>
        <h2>The problem</h2>
        <div>
          <p>
            How to manage who can do what in business applications as their number, and
            the number of roles, keeps growing. Each application handling it alone does not scale.
          </p>
        </div>
      </section>

      <section>
        <h2>The approach</h2>
        <div>
          <p>
            A shared application-authorization layer with a visual workspace. The identity provider keeps handling
            sign-in. Applications declare their business permissions, and the layer evaluates them.
          </p>
          <ul>
            <li><strong>Permissions, roles, assignments.</strong> A permission allows one thing, a role combines permissions, and an assignment gives a role to a person or group within an application.</li>
            <li><strong>The map shows, the backend decides.</strong> Moving someone on the map grants nothing by itself; every decision is enforced on the server and recorded in an audit trail.</li>
            <li><strong>Sign-in and authorization are separate.</strong> Knowing who someone is does not say what they may do.</li>
            <li><strong>Managing access is not using data.</strong> A person can administer a role without receiving its business permissions.</li>
            <li><strong>Explicit mandates.</strong> Authority is not inferred from a job title or a reporting line.</li>
          </ul>
        </div>
      </section>

      <section className="wide">
        <AccessMap />
      </section>

      <section>
        <h2>Current stage</h2>
        <div>
          <div className="limits">
            <h3>Connected local pilot</h3>
            <ul>
              <li>Catalog, roles, assignments, server-side checks, audit trail and a first consuming application are connected.</li>
              <li>Real Microsoft sign-in has been exercised locally.</li>
              <li>The wider delegation and mandate rules are still being worked out.</li>
              <li>This is not an organisation-wide production rollout.</li>
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
