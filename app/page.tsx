import Garden from "./components/Garden";
import { buildGarden } from "./lib/garden";

export default function Home() {
  const garden = buildGarden();
  return (
    <div data-page="home">
      <h1 className="sr-only">Lowell&apos;s garden of ideas</h1>
      <Garden {...garden} />
    </div>
  );
}
