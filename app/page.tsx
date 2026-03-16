import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LstOpportunityRadar } from "@/components/radar/lst-opportunity-radar";

function getHiddenNetworkIds(): string[] {
  try {
    const path = join(process.cwd(), "data/manual/network-visibility.json");
    const data = JSON.parse(readFileSync(path, "utf-8"));
    return Array.isArray(data.hidden) ? data.hidden : [];
  } catch {
    return [];
  }
}

export default function Page() {
  const hiddenNetworkIds = getHiddenNetworkIds();
  return <LstOpportunityRadar hiddenNetworkIds={hiddenNetworkIds} />;
}
