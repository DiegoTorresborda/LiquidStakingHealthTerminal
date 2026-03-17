import type { NetworkDetailData } from "@/features/network-detail/types";

import { berachainDetail } from "./berachain";
import { monadDetail } from "./monad";
import { seiDetail } from "./sei";
import { varaDetail } from "./vara";

export const explicitNetworkDetails: Record<string, NetworkDetailData> = {
  monad: monadDetail,
  sei: seiDetail,
  berachain: berachainDetail,
  vara: varaDetail
};
