import type { Metadata } from "next";

import { MethodologyPage } from "@/components/methodology/methodology-page";

export const metadata: Metadata = {
  title: "Methodology | LST Ecosystem Intelligence Platform",
  description:
    "Scoring methodology for evaluating LST ecosystem health, LP attractiveness, and institutional liquidity readiness."
};

export default function Page() {
  return <MethodologyPage />;
}
