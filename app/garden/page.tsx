import type { Metadata } from "next";
import Farm from "../components/Farm";
import { buildFarm } from "../lib/farm";

export const metadata: Metadata = {
  title: "The farm",
  description: "The same ideas as the home page, planted as a small pixel-art farm.",
};

export default function Garden() {
  const farm = buildFarm();
  return (
    <div data-page="farm">
      <h1 className="sr-only">Lowell&apos;s farm</h1>
      <Farm {...farm} base={process.env.PAGES_BASE_PATH || ""} />
    </div>
  );
}
