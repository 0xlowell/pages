import Canvas from "./components/Canvas";
import { buildGraph } from "./lib/graph";

export default function Home() {
  const { nodes, edges, subjects } = buildGraph();
  return (
    <div data-page="home">
      <h1 className="sr-only">Lowell, a map of linked ideas</h1>
      <Canvas nodes={nodes} edges={edges} subjects={subjects} />
    </div>
  );
}
