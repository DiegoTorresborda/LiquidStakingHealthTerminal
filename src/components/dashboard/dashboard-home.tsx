"use client";

import { useMemo, useState } from "react";

import { ContrastPanel } from "@/components/dashboard/contrast-panel";
import { HeroSummary } from "@/components/dashboard/hero-summary";
import { ModuleGrid } from "@/components/dashboard/module-grid";
import { OpportunitiesPanel } from "@/components/dashboard/opportunities-panel";
import { RedFlagsPanel } from "@/components/dashboard/red-flags-panel";
import { SupportingSignals } from "@/components/dashboard/supporting-signals";
import { TopBar } from "@/components/dashboard/top-bar";
import { NETWORK_SNAPSHOTS, PRIMARY_DEMO_NETWORK_ID } from "@/data/mock-networks";
import { orderModules } from "@/lib/scoring";

export function DashboardHome() {
  const [selectedNetworkId, setSelectedNetworkId] = useState(PRIMARY_DEMO_NETWORK_ID);

  const selectedNetwork = useMemo(() => {
    return NETWORK_SNAPSHOTS.find((network) => network.id === selectedNetworkId) ?? NETWORK_SNAPSHOTS[0];
  }, [selectedNetworkId]);

  const orderedModules = useMemo(() => orderModules(selectedNetwork.modules), [selectedNetwork.modules]);

  return (
    <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
      <TopBar
        selectedNetworkId={selectedNetwork.id}
        onSelectNetwork={setSelectedNetworkId}
        networks={NETWORK_SNAPSHOTS}
        displayName={selectedNetwork.displayName}
        chainMeta={`${selectedNetwork.chainType} · Chain ID ${selectedNetwork.chainId}`}
        selectedLST={`${selectedNetwork.lstDisplayName} (${selectedNetwork.lstSymbol})`}
        dashboardMode={selectedNetwork.dashboardMode}
        updatedAt={selectedNetwork.updatedAt}
        dataMode={selectedNetwork.dataMode}
      />

      <HeroSummary
        networkName={selectedNetwork.name}
        lstSymbol={selectedNetwork.lstSymbol}
        globalScore={selectedNetwork.globalScore}
        lpLabel={selectedNetwork.lpAttractiveness}
        labelTone={selectedNetwork.lpAttractivenessTone}
        diagnosis={selectedNetwork.diagnosis}
        heroText={selectedNetwork.heroText}
        institutionalReadiness={selectedNetwork.institutionalReadiness}
        bestModule={selectedNetwork.uiLabels.bestModule}
        weakestModule={selectedNetwork.uiLabels.weakestModule}
        primaryBottleneck={selectedNetwork.uiLabels.primaryBottleneck}
        strategicUpgrade={selectedNetwork.uiLabels.mainStrategicUpgrade}
        highlights={selectedNetwork.highlights}
      />

      <ContrastPanel
        strengths={selectedNetwork.strategicContrast.strengths}
        bottlenecks={selectedNetwork.strategicContrast.bottlenecks}
      />

      <ModuleGrid modules={orderedModules} />

      <section className="grid gap-4 lg:grid-cols-2">
        <OpportunitiesPanel opportunities={selectedNetwork.opportunities} />
        <RedFlagsPanel redFlags={selectedNetwork.redFlags} />
      </section>

      <SupportingSignals
        slippageCurve={selectedNetwork.supportingSignals.slippageCurve}
        pegDeviation={selectedNetwork.supportingSignals.pegDeviation}
        defiUsage={selectedNetwork.supportingSignals.defiUsage}
        validatorConcentration={selectedNetwork.supportingSignals.validatorConcentration}
        stressSnapshot={selectedNetwork.supportingSignals.stressSnapshot}
      />
    </main>
  );
}
