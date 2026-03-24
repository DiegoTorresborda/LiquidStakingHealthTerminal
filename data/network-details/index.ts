import type { NetworkDetailData } from "@/features/network-detail/types";

import { berachainDetail } from "./berachain";
import { monadDetail } from "./monad";
import { seiDetail } from "./sei";
import { varaDetail } from "./vara";
import { zigchainDetail } from "./zigchain";

export const explicitNetworkDetails: Record<string, NetworkDetailData> = {
  monad: monadDetail,
  sei: seiDetail,
  berachain: berachainDetail,
  vara: varaDetail,
  zigchain: zigchainDetail
};
