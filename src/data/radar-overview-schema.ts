export type FieldDataClass = "observed" | "derived" | "inferred" | "simulated" | "missing";

export type RadarOverviewField =
  | "category"
  | "status"
  | "fdvUsd"
  | "circulatingSupplyPct"
  | "stakerAddresses"
  | "lstProtocols"
  | "largestLst"
  | "lendingPresence"
  | "lstCollateralEnabled"
  | "mainBottleneck"
  | "mainOpportunity"
  | "marketCapUsd"
  | "circulatingSupply"
  | "priceUsd"
  | "volume24hUsd"
  | "defiTvlUsd"
  | "stablecoinLiquidityUsd"
  | "validatorCount"
  | "stakingRatioPct"
  | "stakingApyPct"
  | "rewardRatePct"
  | "stakingMarketCapUsd"
  | "stakedTokens"
  | "stakedValueUsd"
  | "inflationRatePct"
  | "verifiedProviders"
  | "benchmarkCommissionPct"
  | "lstTvlUsd"
  | "tvlToMarketCap"
  | "lstPenetrationPct"
  | "baseTokenDexLiquidityUsd"
  | "baseTokenDexVolume24hUsd"
  | "baseTokenPairCount"
  | "baseTokenLargestPoolLiquidityUsd"
  | "baseTokenPoolConcentration"
  | "stableExitRouteExists"
  | "stableExitLiquidityUsd"
  | "stableExitPairAddress"
  | "stableExitQuoteToken"
  | "stableExitDexId"
  | "lstDexLiquidityUsd"
  | "lstDexVolume24hUsd"
  | "lstPairCount"
  | "lstLargestPoolLiquidityUsd"
  | "lstPoolConcentration"
  | "lstHasBasePair"
  | "lstHasStablePair"
  | "baseTokenVolumeLiquidityRatio"
  | "lstVolumeLiquidityRatio"
  | "lstTotalSupply"
  | "lstHolderCount"
  | "lstTop10HolderShare"
  | "lstTransferCount24h"
  | "lstTransferVolume24h"
  | "contractAbiAvailable"
  | "contractVerified"
  | "protocolMintCount24h"
  | "protocolRedeemCount24h"
  | "protocolMintVolume24h"
  | "protocolRedeemVolume24h"
  | "protocolTreasuryNativeBalance"
  | "safeGasPrice"
  | "proposeGasPrice"
  | "fastGasPrice"
  | "suggestedBaseFee"
  | "hasLst"
  | "unbondingDays"
  | "auditCount"
  | "hasTimelock";

export type RadarOverviewRecord = {
  networkId: string;
  chain: string;
  network: string;
  token: string;
  category: string | null;
  status: string | null;
  fdvUsd: number | null;
  circulatingSupplyPct: number | null;
  stakerAddresses: number | null;
  lstProtocols: number | null;
  largestLst: string | null;
  lendingPresence: boolean | null;
  lstCollateralEnabled: boolean | null;
  mainBottleneck: string | null;
  mainOpportunity: string | null;
  marketCapUsd: number | null;
  circulatingSupply: number | null;
  priceUsd: number | null;
  volume24hUsd: number | null;
  defiTvlUsd: number | null;
  stablecoinLiquidityUsd: number | null;
  validatorCount: number | null;
  stakingRatioPct: number | null;
  stakingApyPct: number | null;
  rewardRatePct: number | null;
  stakingMarketCapUsd: number | null;
  stakedTokens: number | null;
  stakedValueUsd: number | null;
  inflationRatePct: number | null;
  verifiedProviders: number | null;
  benchmarkCommissionPct: number | null;
  staking: {
    rewardRatePct: number | null;
    stakingRatioPct: number | null;
    stakingMarketCapUsd: number | null;
    stakedTokens: number | null;
    inflationRatePct: number | null;
    validators: number | null;
    verifiedProviders: number | null;
    benchmarkCommissionPct: number | null;
  };
  stakingMeta: {
    source: string | null;
    asOf: string | null;
    quality: "observed-manual" | null;
    confidence: "high" | null;
  };
  lstTvlUsd: number | null;
  tvlToMarketCap: number | null;
  lstPenetrationPct: number | null;
  baseTokenDexLiquidityUsd: number | null;
  baseTokenDexVolume24hUsd: number | null;
  baseTokenPairCount: number | null;
  baseTokenLargestPoolLiquidityUsd: number | null;
  baseTokenPoolConcentration: number | null;
  stableExitRouteExists: boolean | null;
  stableExitLiquidityUsd: number | null;
  stableExitPairAddress: string | null;
  stableExitQuoteToken: string | null;
  stableExitDexId: string | null;
  lstDexLiquidityUsd: number | null;
  lstDexVolume24hUsd: number | null;
  lstPairCount: number | null;
  lstLargestPoolLiquidityUsd: number | null;
  lstPoolConcentration: number | null;
  lstHasBasePair: boolean | null;
  lstHasStablePair: boolean | null;
  baseTokenVolumeLiquidityRatio: number | null;
  lstVolumeLiquidityRatio: number | null;
  lstTotalSupply: number | null;
  lstHolderCount: number | null;
  lstTop10HolderShare: number | null;
  lstTransferCount24h: number | null;
  lstTransferVolume24h: number | null;
  contractAbiAvailable: boolean | null;
  contractVerified: boolean | null;
  protocolMintCount24h: number | null;
  protocolRedeemCount24h: number | null;
  protocolMintVolume24h: number | null;
  protocolRedeemVolume24h: number | null;
  protocolTreasuryNativeBalance: number | null;
  safeGasPrice: number | null;
  proposeGasPrice: number | null;
  fastGasPrice: number | null;
  suggestedBaseFee: number | null;
  hasLst: boolean | null;
  unbondingDays: number | null;
  auditCount: number | null;
  hasTimelock: boolean | null;
  globalLstHealthScore: number;
  opportunityScore: number;
  asOf: string;
  sourceRefs: string[];
  quality: "observed" | "inferred" | "simulated";
  confidence: "high" | "medium" | "low";
  dataCoveragePct: number;
  fieldQuality: Record<string, FieldDataClass>;
};
