import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NetworkDiagnosisPage } from "@/components/network-detail/network-diagnosis-page";
import { getAllNetworkIds, getNetworkDetailById } from "@/features/network-detail/data";

type NetworkDetailPageProps = {
  params: {
    networkId: string;
  };
};

export function generateStaticParams() {
  return getAllNetworkIds().map((networkId) => ({ networkId }));
}

export function generateMetadata({ params }: NetworkDetailPageProps): Metadata {
  const detail = getNetworkDetailById(params.networkId);

  if (!detail) {
    return {
      title: "Network Diagnosis | LST Opportunity Radar"
    };
  }

  return {
    title: `${detail.summary.networkName} Diagnosis | LST Opportunity Radar`,
    description: detail.summary.diagnosis
  };
}

export default function NetworkDetailPage({ params }: NetworkDetailPageProps) {
  const detail = getNetworkDetailById(params.networkId);

  if (!detail) {
    notFound();
  }

  return <NetworkDiagnosisPage detail={detail} />;
}
