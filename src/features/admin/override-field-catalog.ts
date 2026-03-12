export type OverrideValueType = "number" | "string" | "boolean";

export type OverrideFieldOption = {
  field: string;
  label: string;
  valueType: OverrideValueType;
  group:
    | "identity"
    | "market"
    | "staking"
    | "liquidity"
    | "dex"
    | "onchain"
    | "scores"
    | "metadata";
};

const FIELD_GROUP_LABEL: Record<OverrideFieldOption["group"], string> = {
  identity: "Identity",
  market: "Market",
  staking: "Staking",
  liquidity: "Liquidity",
  dex: "Dex / Exit Routes",
  onchain: "On-chain Signals",
  scores: "Scores",
  metadata: "Metadata"
};

export const OVERRIDE_FIELD_CATALOG: OverrideFieldOption[] = [
  { field: "networkId", label: "Network ID", valueType: "string", group: "identity" },
  { field: "chain", label: "Chain", valueType: "string", group: "identity" },
  { field: "network", label: "Network", valueType: "string", group: "identity" },
  { field: "token", label: "Token", valueType: "string", group: "identity" },
  { field: "category", label: "Category", valueType: "string", group: "identity" },
  { field: "status", label: "Status", valueType: "string", group: "identity" },
  { field: "largestLst", label: "Largest LST", valueType: "string", group: "identity" },
  { field: "mainBottleneck", label: "Main Bottleneck", valueType: "string", group: "identity" },
  { field: "mainOpportunity", label: "Main Opportunity", valueType: "string", group: "identity" },

  { field: "marketCapUsd", label: "Market Cap USD", valueType: "number", group: "market" },
  { field: "fdvUsd", label: "FDV USD", valueType: "number", group: "market" },
  { field: "circulatingSupply", label: "Circulating Supply", valueType: "number", group: "market" },
  { field: "circulatingSupplyPct", label: "Circulating Supply %", valueType: "number", group: "market" },
  { field: "priceUsd", label: "Price USD", valueType: "number", group: "market" },
  { field: "volume24hUsd", label: "24h Volume USD", valueType: "number", group: "market" },

  { field: "validatorCount", label: "Validator Count", valueType: "number", group: "staking" },
  { field: "stakerAddresses", label: "Staker Addresses", valueType: "number", group: "staking" },
  { field: "stakingRatioPct", label: "Staking Ratio %", valueType: "number", group: "staking" },
  { field: "stakingApyPct", label: "Staking APY %", valueType: "number", group: "staking" },
  { field: "rewardRatePct", label: "Reward Rate %", valueType: "number", group: "staking" },
  { field: "stakingMarketCapUsd", label: "Staking Market Cap USD", valueType: "number", group: "staking" },
  { field: "stakedTokens", label: "Staked Tokens", valueType: "number", group: "staking" },
  { field: "inflationRatePct", label: "Inflation Rate %", valueType: "number", group: "staking" },
  { field: "verifiedProviders", label: "Verified Providers", valueType: "number", group: "staking" },
  { field: "benchmarkCommissionPct", label: "Benchmark Commission %", valueType: "number", group: "staking" },

  { field: "defiTvlUsd", label: "DeFi TVL USD", valueType: "number", group: "liquidity" },
  { field: "stablecoinLiquidityUsd", label: "Stablecoin Liquidity USD", valueType: "number", group: "liquidity" },
  { field: "lstTvlUsd", label: "LST TVL USD", valueType: "number", group: "liquidity" },
  { field: "lstProtocols", label: "# of LST Protocols", valueType: "number", group: "liquidity" },
  { field: "stakedValueUsd", label: "Staked Value USD", valueType: "number", group: "liquidity" },
  { field: "lendingPresence", label: "Lending Presence", valueType: "boolean", group: "liquidity" },
  { field: "lstCollateralEnabled", label: "LST Collateral Enabled", valueType: "boolean", group: "liquidity" },
  { field: "tvlToMarketCap", label: "TVL / Market Cap", valueType: "number", group: "liquidity" },
  { field: "lstPenetrationPct", label: "LST Penetration %", valueType: "number", group: "liquidity" },

  { field: "baseTokenDexLiquidityUsd", label: "Base Token Dex Liquidity USD", valueType: "number", group: "dex" },
  { field: "baseTokenDexVolume24hUsd", label: "Base Token Dex Volume 24h USD", valueType: "number", group: "dex" },
  { field: "baseTokenPairCount", label: "Base Token Pair Count", valueType: "number", group: "dex" },
  {
    field: "baseTokenLargestPoolLiquidityUsd",
    label: "Base Token Largest Pool Liquidity USD",
    valueType: "number",
    group: "dex"
  },
  {
    field: "baseTokenPoolConcentration",
    label: "Base Token Pool Concentration",
    valueType: "number",
    group: "dex"
  },
  { field: "stableExitRouteExists", label: "Stable Exit Route Exists", valueType: "boolean", group: "dex" },
  { field: "stableExitLiquidityUsd", label: "Stable Exit Liquidity USD", valueType: "number", group: "dex" },
  { field: "stableExitPairAddress", label: "Stable Exit Pair Address", valueType: "string", group: "dex" },
  { field: "stableExitQuoteToken", label: "Stable Exit Quote Token", valueType: "string", group: "dex" },
  { field: "stableExitDexId", label: "Stable Exit Dex ID", valueType: "string", group: "dex" },
  { field: "lstDexLiquidityUsd", label: "LST Dex Liquidity USD", valueType: "number", group: "dex" },
  { field: "lstDexVolume24hUsd", label: "LST Dex Volume 24h USD", valueType: "number", group: "dex" },
  { field: "lstPairCount", label: "LST Pair Count", valueType: "number", group: "dex" },
  { field: "lstLargestPoolLiquidityUsd", label: "LST Largest Pool Liquidity USD", valueType: "number", group: "dex" },
  { field: "lstPoolConcentration", label: "LST Pool Concentration", valueType: "number", group: "dex" },
  { field: "lstHasBasePair", label: "LST Has Base Pair", valueType: "boolean", group: "dex" },
  { field: "lstHasStablePair", label: "LST Has Stable Pair", valueType: "boolean", group: "dex" },
  {
    field: "baseTokenVolumeLiquidityRatio",
    label: "Base Token Volume / Liquidity Ratio",
    valueType: "number",
    group: "dex"
  },
  { field: "lstVolumeLiquidityRatio", label: "LST Volume / Liquidity Ratio", valueType: "number", group: "dex" },

  { field: "lstTotalSupply", label: "LST Total Supply", valueType: "number", group: "onchain" },
  { field: "lstHolderCount", label: "LST Holder Count", valueType: "number", group: "onchain" },
  { field: "lstTop10HolderShare", label: "LST Top10 Holder Share", valueType: "number", group: "onchain" },
  { field: "lstTransferCount24h", label: "LST Transfer Count 24h", valueType: "number", group: "onchain" },
  { field: "lstTransferVolume24h", label: "LST Transfer Volume 24h", valueType: "number", group: "onchain" },
  { field: "contractAbiAvailable", label: "Contract ABI Available", valueType: "boolean", group: "onchain" },
  { field: "contractVerified", label: "Contract Verified", valueType: "boolean", group: "onchain" },
  { field: "protocolMintCount24h", label: "Protocol Mint Count 24h", valueType: "number", group: "onchain" },
  { field: "protocolRedeemCount24h", label: "Protocol Redeem Count 24h", valueType: "number", group: "onchain" },
  { field: "protocolMintVolume24h", label: "Protocol Mint Volume 24h", valueType: "number", group: "onchain" },
  { field: "protocolRedeemVolume24h", label: "Protocol Redeem Volume 24h", valueType: "number", group: "onchain" },
  {
    field: "protocolTreasuryNativeBalance",
    label: "Protocol Treasury Native Balance",
    valueType: "number",
    group: "onchain"
  },
  { field: "safeGasPrice", label: "Safe Gas Price", valueType: "number", group: "onchain" },
  { field: "proposeGasPrice", label: "Propose Gas Price", valueType: "number", group: "onchain" },
  { field: "fastGasPrice", label: "Fast Gas Price", valueType: "number", group: "onchain" },
  { field: "suggestedBaseFee", label: "Suggested Base Fee", valueType: "number", group: "onchain" },

  { field: "globalLstHealthScore", label: "Global LST Health Score", valueType: "number", group: "scores" },
  { field: "opportunityScore", label: "Opportunity Score", valueType: "number", group: "scores" },

  { field: "quality", label: "Record Quality", valueType: "string", group: "metadata" },
  { field: "confidence", label: "Record Confidence", valueType: "string", group: "metadata" },
  { field: "dataCoveragePct", label: "Data Coverage %", valueType: "number", group: "metadata" },
  { field: "asOf", label: "As Of", valueType: "string", group: "metadata" }
];

export const OVERRIDE_FIELDS_BY_GROUP = OVERRIDE_FIELD_CATALOG.reduce<Record<string, OverrideFieldOption[]>>(
  (accumulator, option) => {
    const groupLabel = FIELD_GROUP_LABEL[option.group];
    if (!accumulator[groupLabel]) {
      accumulator[groupLabel] = [];
    }

    accumulator[groupLabel].push(option);
    return accumulator;
  },
  {}
);

export const OVERRIDE_FIELD_METADATA = Object.fromEntries(
  OVERRIDE_FIELD_CATALOG.map((option) => [option.field, option])
) satisfies Record<string, OverrideFieldOption>;
