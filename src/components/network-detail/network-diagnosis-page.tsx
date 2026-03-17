import type { NetworkDetailData } from "@/features/network-detail/types";

import { ChainResourcesSection } from "@/components/chain-resources";
import { DetailModulesGrid } from "@/components/network-detail/detail-modules-grid";
import { DiagnosisInteractiveSection } from "@/components/network-detail/diagnosis-interactive-section";
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

      <DetailModulesGrid modules={detail.modules} scoring={detail.scoring} v2Result={detail.v2Result} />

      {/* Red Flags + Improvement Plan share state: selecting an improvement resolves its linked flag */}
      {detail.radarRecord && detail.v2Result ? (
        <DiagnosisInteractiveSection
          record={detail.radarRecord}
          currentResult={detail.v2Result}
          redFlags={detail.redFlags}
          lstLaunchProjectedScore={detail.summary.lstLaunchProjectedScore}
        />
      ) : (
        <RedFlagsPanel redFlags={detail.redFlags} />
      )}

      <StressSnapshotPanel stress={detail.stressSnapshot} />

      <ChainResourcesSection networkId={detail.summary.networkId} showEmptyState />

      <MiniVisualsPanel miniVisuals={detail.miniVisuals} />
    </main>
  );
}
