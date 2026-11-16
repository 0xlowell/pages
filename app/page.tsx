import Collage from "./components/Collage";
import { getFragments, getSubjects, transitionName } from "./lib/fragments";

export default function Home() {
  const fragments = getFragments();
  // Only the first link to a page carries its title across the navigation.
  const seen = new Set<string>();
  const items = fragments.map((f) => {
    if (!f.href || f.href.startsWith("http") || seen.has(f.href)) return f;
    seen.add(f.href);
    return { ...f, vt: transitionName(f.href) };
  });
  return (
    <div data-page="home">
      <Collage
        items={items}
        subjects={getSubjects(fragments)}
        intro="Subjects I keep coming back to, and what connects them."
      />
    </div>
  );
}
