import type { NetworkDetailData } from "@/features/network-detail/types";

import { berachainDetail } from "./berachain";
import { monadDetail } from "./monad";
import { seiDetail } from "./sei";

export const explicitNetworkDetails: Record<string, NetworkDetailData> = {
  monad: monadDetail,
  sei: seiDetail,
  berachain: berachainDetail
};
