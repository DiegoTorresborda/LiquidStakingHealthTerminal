import type { NetworkDetailData } from "@/features/network-detail/types";

import { DetailModulesGrid } from "@/components/network-detail/detail-modules-grid";
import { MiniVisualsPanel } from "@/components/network-detail/mini-visuals-panel";
import { NetworkDetailHeader } from "@/components/network-detail/network-detail-header";
import { RedFlagsPanel } from "@/components/network-detail/red-flags-panel";
import { ScoringModelPanel } from "@/components/network-detail/scoring-model-panel";
import { StressSnapshotPanel } from "@/components/network-detail/stress-snapshot-panel";
import { TopOpportunitiesPanel } from "@/components/network-detail/top-opportunities-panel";

type NetworkDiagnosisPageProps = {
  detail: NetworkDetailData;
};

export function NetworkDiagnosisPage({ detail }: NetworkDiagnosisPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <NetworkDetailHeader summary={detail.summary} />

      {detail.scoring ? <ScoringModelPanel scoring={detail.scoring} /> : null}

      <DetailModulesGrid modules={detail.modules} scoring={detail.scoring} />

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TopOpportunitiesPanel opportunities={detail.opportunities} />
        </div>
        <div className="xl:col-span-1">
          <StressSnapshotPanel stress={detail.stressSnapshot} />
        </div>
      </section>

      <RedFlagsPanel redFlags={detail.redFlags} />

      <MiniVisualsPanel miniVisuals={detail.miniVisuals} />
    </main>
  );
}
