import type { Metadata } from "next";

import { LiquidStakingPage } from "@/components/liquid-staking/liquid-staking-page";

export const metadata: Metadata = {
  title: "Liquid Staking Economics | LST Ecosystem Intelligence Platform",
  description:
    "Why robust liquid staking systems are critical for PoS capital efficiency, LP attractiveness, and DeFi growth."
};

export default function Page() {
  return <LiquidStakingPage />;
}
