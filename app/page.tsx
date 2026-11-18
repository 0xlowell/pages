import Farm from "./components/Farm";
import { buildFarm } from "./lib/farm";

export default function Home() {
  const farm = buildFarm();
  return (
    <div data-page="home">
      <h1 className="sr-only">Lowell&apos;s garden of ideas</h1>
      <Farm {...farm} base={process.env.PAGES_BASE_PATH || ""} />
    </div>
  );
}
