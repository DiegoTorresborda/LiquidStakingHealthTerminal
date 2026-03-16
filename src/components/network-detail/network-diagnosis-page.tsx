import type { NetworkDetailData } from "@/features/network-detail/types";

import { ChainResourcesSection } from "@/components/chain-resources";
import { DetailModulesGrid } from "@/components/network-detail/detail-modules-grid";
import { ImprovementPlanPanel } from "@/components/network-detail/improvement-plan-panel";
import { MiniVisualsPanel } from "@/components/network-detail/mini-visuals-panel";
import { NetworkDetailHeader } from "@/components/network-detail/network-detail-header";
import { RedFlagsPanel } from "@/components/network-detail/red-flags-panel";
import { ScoringModelPanel } from "@/components/network-detail/scoring-model-panel";
import { StressSnapshotPanel } from "@/components/network-detail/stress-snapshot-panel";

type NetworkDiagnosisPageProps = {
  detail: NetworkDetailData;
};

export function NetworkDiagnosisPage({ detail }: NetworkDiagnosisPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-[1480px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <NetworkDetailHeader summary={detail.summary} />

      {detail.scoring ? (
        <ScoringModelPanel scoring={detail.scoring} mode={detail.summary.scoringMode} />
      ) : null}

      <DetailModulesGrid modules={detail.modules} scoring={detail.scoring} />

      {detail.radarRecord && detail.v2Result && (
        <ImprovementPlanPanel
          record={detail.radarRecord}
          currentResult={detail.v2Result}
        />
      )}

      <StressSnapshotPanel stress={detail.stressSnapshot} />

      <ChainResourcesSection networkId={detail.summary.networkId} showEmptyState />

      <RedFlagsPanel redFlags={detail.redFlags} />

      <MiniVisualsPanel miniVisuals={detail.miniVisuals} />
    </main>
  );
}
