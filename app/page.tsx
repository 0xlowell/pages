import Collage from "./components/Collage";
import { getFragments, getSubjects } from "./lib/fragments";

export default function Home() {
  const fragments = getFragments();
  const subjects = getSubjects(fragments);
  return (
    <div data-page="home">
      <section className="col intro">
        <h1 className="lead">Subjects I keep coming back to, and what connects them.</h1>
        <p className="muted">
          Fragments, not a résumé. Pick a subject to see what it touches. For now most of it is software and AI
          agents; that will widen.
        </p>
      </section>
      <Collage fragments={fragments} subjects={subjects} />
    </div>
  );
}
