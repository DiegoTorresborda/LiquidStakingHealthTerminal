# Data Inventory By Chain (Mock/API/Manual)

Generated at: 2026-03-11T13:36:12.629Z

Legend: `mockeado` = valor sintético/base; `api/manual-observed` = observado; `inferred` = override/regla; `derived` = cálculo interno; `missing` = sin dato.

## Monad (monad)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 54.7 |
| sourceRefs | coingecko:coins/markets:monad<br/>defillama:chains:Monad<br/>defillama:protocols:category=liquid staking:chain=Monad<br/>defillama:stablecoins:Monad<br/>manual-domain-overrides:stablecoinLiquidityUsd<br/>stakingrewards.com:manual-snapshot:monad:asOf=2026-03-10<br/>dexscreener:token-pairs:v1:monad:0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A<br/>dexscreener:pair:monad:0x659bD0BC4167BA25c62E05656F78043E7eD4a9da<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=143 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | monad | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Monad | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | MON | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | High-performance EVM L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | High Potential | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 227991521 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 12.36 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 16.01 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 142000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 71 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 2 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 37.3 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 484734658.701648 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 86 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 10830583396 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 1236000000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 28179752 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 169 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stMON | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 210000000 | inferred | inferred | DefiLlama + override manual | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Stablecoin exit liquidity | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Expand LST collateral integrations | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 54.7 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 9500000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 44 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.02105 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 36213851 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 16.01 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 268560000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 1.98 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 34 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 15.73 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 10517468.886827 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 212.6 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | 2314437.67 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | 3109515.8 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | 30 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | 1389322.65 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | 0.600285 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | true | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | 1389322.65 | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | 0x659bD0BC4167BA25c62E05656F78043E7eD4a9da | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | USDC | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | uniswap | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | 1.34353 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 16.01 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 12.36 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 268560000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 1236000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 1.98 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 169 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 34 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 15.73 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 8 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [9 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock explícito (data/network-details/monad.ts) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock explícito (data/network-details/monad.ts) | Cards de módulos |
| detail.opportunities (4) | mockeado | Mock explícito (data/network-details/monad.ts) | Top Opportunities panel |
| detail.redFlags (3) | mockeado | Mock explícito (data/network-details/monad.ts) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock explícito (data/network-details/monad.ts) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock explícito (data/network-details/monad.ts) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Sei (sei)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 34 |
| sourceRefs | coingecko:coins/markets:sei-network<br/>defillama:chains:Sei<br/>defillama:protocols:category=liquid staking:chain=Sei<br/>defillama:stablecoins:Sei<br/>manual-domain-overrides:stablecoinLiquidityUsd<br/>stakingrewards.com:manual-snapshot:sei:asOf=2026-03-10 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | sei | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Sei | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | SEI | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | High-throughput trading L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Emerging | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 420360457 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 37.68 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 7.14 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 185000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 66 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 2 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 3.9 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 59574862.654439 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 82 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 6733333333 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 3770000000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 158391820 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 40 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stSEI | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 140000000 | inferred | inferred | DefiLlama + override manual | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Weak LST DeFi integration | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Enable lending collateral usage | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 34 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 5600000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 59 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.06243 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 58324167 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 7.14 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 243830000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 3.99 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 12 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 5 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 6231011.941698 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 14.2 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 7.14 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 37.68 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 243830000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 3770000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 3.99 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 40 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 12 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 5 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 8 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [6 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock explícito (data/network-details/sei.ts) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock explícito (data/network-details/sei.ts) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock explícito (data/network-details/sei.ts) | Top Opportunities panel |
| detail.redFlags (3) | mockeado | Mock explícito (data/network-details/sei.ts) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock explícito (data/network-details/sei.ts) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock explícito (data/network-details/sei.ts) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Sui (sui)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 34 |
| sourceRefs | coingecko:coins/markets:sui<br/>defillama:chains:Sui<br/>defillama:protocols:category=liquid staking:chain=Sui<br/>defillama:stablecoins:Sui<br/>manual-domain-overrides:stablecoinLiquidityUsd<br/>stakingrewards.com:manual-snapshot:sui:asOf=2026-03-10 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | sui | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Sui | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | SUI | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Object-centric L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Mature | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 3714706819 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 74.89 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 1.73 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 210000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 74 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 3 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 4.8 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 954726533.711748 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 68 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 3899984688.415443 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 7490000000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 2781943937 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 128 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stSUI | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 420000000 | inferred | inferred | DefiLlama + override manual | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | LST fragmentation | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Consolidate liquidity across LSTs | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 34 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 15000000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 48 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.95247 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 628548739 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 1.73 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 7270000000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 3.33 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 23 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 6.51 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 132301592.834774 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 25.7 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 1.73 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 74.89 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 7270000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 7490000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 3.33 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 128 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 23 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 6.51 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 8 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [6 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Aptos (aptos)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 52.8 |
| sourceRefs | coingecko:coins/markets:aptos<br/>defillama:chains:Aptos<br/>defillama:protocols:category=liquid staking:chain=Aptos<br/>defillama:stablecoins:Aptos<br/>stakingrewards.com:manual-snapshot:aptos:asOf=2026-03-10<br/>dexscreener:token-pairs:v1:aptos:0x1::aptos_coin::AptosCoin<br/>dexscreener:pair:aptos:pcs-1 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | aptos | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Aptos | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | APT | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Move-based L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Mature | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 737556946 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 98.16 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 7 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 165000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 70 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 3 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 6.2 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 392528359.245981 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 64 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 781457412.252439 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 832850000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 723985898 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 119 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stAPT | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 350000000 | missing | missing | API DefiLlama | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Limited LST liquidity depth | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Expand LST market-making infrastructure | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 52.8 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 10400000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 54 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.943808 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 52886212 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 7 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 815170000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 7.46 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 11 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 8.75 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 44849648.774098 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 53.2 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | 720676.7 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | 36702.44 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | 30 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | 430614.31 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | 0.597514 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | true | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | 430614.31 | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | pcs-1 | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | USDC | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | pancakeswap | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | 0.050928 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 7 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 98.16 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 815170000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 832850000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 7.46 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 119 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 11 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 8.75 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 8 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [7 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Berachain (berachain)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 34 |
| sourceRefs | coingecko:coins/markets:berachain-bera<br/>defillama:chains:Berachain<br/>defillama:protocols:category=liquid staking:chain=Berachain<br/>defillama:stablecoins:Berachain<br/>dexscreener:token-pairs:v1:berachain:0x6969696969696969696969696969696969696969<br/>dexscreener:pair:berachain:0x4866Dd95a3bC4eb40Dd1B659489e3410dAe3287f<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=80094 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | berachain | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Berachain | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | BERA | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | DeFi-native L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | High Potential | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 127125379 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 43 | missing | missing | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 9.3 | missing | missing | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 97000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 63 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 2 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 201.1 | missing | missing | Mock base (fallback) | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 363052191.067954 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 91 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 228936268.62414 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | null | missing | missing | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 54663913 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 69 | missing | missing | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stBERA | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 300000000 | missing | missing | API DefiLlama | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | LST penetration still low | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Make LST core collateral asset | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 34 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 7200000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 36 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.555022 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 23037524 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | null | missing | missing | Manual StakingRewards | No visualizado |
| inflationRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| verifiedProviders | null | missing | missing | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | null | missing | missing | Manual StakingRewards | No visualizado |
| lstTvlUsd | 109924350.703 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 285.6 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | 2343758.82 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | 592724.23 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | 30 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | 657389.84 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | 0.280485 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | true | derivado | derived | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | 199247.99 | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | 0x4866Dd95a3bC4eb40Dd1B659489e3410dAe3287f | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | USDC.e | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | kodiak | api/manual-observed | observed | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | 0.252895 | derivado | derived | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 7 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [7 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock explícito (data/network-details/berachain.ts) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock explícito (data/network-details/berachain.ts) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock explícito (data/network-details/berachain.ts) | Top Opportunities panel |
| detail.redFlags (3) | mockeado | Mock explícito (data/network-details/berachain.ts) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock explícito (data/network-details/berachain.ts) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock explícito (data/network-details/berachain.ts) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## XDC (xdc)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 34 |
| sourceRefs | coingecko:coins/markets:xdce-crowd-sale<br/>defillama:chains:XDC<br/>defillama:protocols:category=liquid staking:chain=XDC<br/>defillama:stablecoins:XDC<br/>manual-domain-overrides:stablecoinLiquidityUsd<br/>stakingrewards.com:manual-snapshot:xdc:asOf=2026-03-10<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=50 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | xdc | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | XDC | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | XDC | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Enterprise-focused L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Underdeveloped | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 645235501 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 12.84 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 10 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 61000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 58 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 7.3 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 10883134.264606 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 87 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 19937049406.32 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 2560000000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 82848238 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 108 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stXDC | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 46000000 | inferred | inferred | DefiLlama + override manual | Radar Show Details + Scoring input + fallback module |
| lendingPresence | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Weak DeFi ecosystem | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Build core DeFi + LST stack | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 34 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 1800000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 79 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.032366 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 14165372 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 10 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 82430000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 1.28 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 0 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 0 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 6049864.306318 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 1.7 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 12.84 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 82430000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 2560000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 1.28 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 108 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 0 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 0 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 8 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [7 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Shardeum (shardeum)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 18.9 |
| sourceRefs | coingecko:coins/markets:shardeum-2<br/>manual-domain-overrides:defiTvlUsd<br/>manual-domain-overrides:stablecoinLiquidityUsd<br/>manual-fallback:manual-staking.json<br/>manual-domain-overrides:lstTvlUsd |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | shardeum | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Shardeum | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | SHM | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Dynamic sharded L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Early Opportunity | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 826814 | inferred | inferred | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 41 | inferred | inferred | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 9.8 | inferred | inferred | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 42000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 54 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 9144.7 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 75000000 | inferred | inferred | DefiLlama + override manual | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 92 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 9675596460 | inferred | inferred | API CoinGecko | Radar Show Details |
| stakedTokens | null | missing | missing | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 338994 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 78 | inferred | inferred | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stSHM | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 21000000 | inferred | inferred | DefiLlama + override manual | Radar Show Details + Scoring input + fallback module |
| lendingPresence | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Ecosystem still early | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Launch foundational LST infrastructure | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 18.9 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 2100000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 43 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | null | missing | missing | API CoinGecko | No visualizado |
| volume24hUsd | null | missing | missing | API CoinGecko | No visualizado |
| rewardRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | null | missing | missing | Manual StakingRewards | No visualizado |
| inflationRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| verifiedProviders | null | missing | missing | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | null | missing | missing | Manual StakingRewards | No visualizado |
| lstTvlUsd | 31000000 | inferred | inferred | DefiLlama + override manual | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 9071 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 41 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 78 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 7 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [5 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Core (core)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 13.2 |
| sourceRefs | coingecko:coins/markets:coredaoorg<br/>defillama:chains:CORE<br/>defillama:protocols:category=liquid staking:chain=CORE<br/>defillama:stablecoins:CORE<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=1116 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | core | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Core | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | CORE | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Bitcoin-aligned PoS | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Growing | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 86264495 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 55 | missing | missing | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 7.3 | missing | missing | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 98000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 67 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 2 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 2.6 | missing | missing | Mock base (fallback) | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 29893527.493572 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 73 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 1074804772.81914 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | null | missing | missing | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 47445472 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 83 | missing | missing | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stCORE | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 120000000 | missing | missing | API DefiLlama | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Moderate liquidity depth | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Expand LST adoption in DeFi | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 13.2 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 3600000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 61 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.080251 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 3410285 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | null | missing | missing | Manual StakingRewards | No visualizado |
| inflationRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| verifiedProviders | null | missing | missing | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | null | missing | missing | Manual StakingRewards | No visualizado |
| lstTvlUsd | 1238324.055057 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 34.7 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 7 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [5 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Sonic (sonic)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 13.2 |
| sourceRefs | coingecko:coins/markets:sonic-3<br/>defillama:chains:Sonic<br/>defillama:protocols:category=liquid staking:chain=Sonic<br/>defillama:stablecoins:Sonic<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=146 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | sonic | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Sonic | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | SONIC | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | Gaming-focused L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Early Opportunity | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 156987304 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 36 | missing | missing | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 8.7 | missing | missing | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 55000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 52 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 2.8 | missing | missing | Mock base (fallback) | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 56267005.410674 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 88 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 3784775845 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | null | missing | missing | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 56515429 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 61 | missing | missing | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stSONIC | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 19000000 | missing | missing | API DefiLlama | Radar Show Details + Scoring input + fallback module |
| lendingPresence | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | false | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Weak financial layer | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Introduce DeFi primitives for LST | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 13.2 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 2600000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 42 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.041471 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 19851673 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | null | missing | missing | Manual StakingRewards | No visualizado |
| inflationRatePct | null | missing | missing | Manual StakingRewards | No visualizado |
| verifiedProviders | null | missing | missing | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | null | missing | missing | Manual StakingRewards | No visualizado |
| lstTvlUsd | 1598979.858575 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 35.8 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | null | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 7 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [5 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

## Mantra (mantra)

| Metadata | Value |
|---|---|
| asOf | 2026-03-11T11:41:56.440Z |
| quality | simulated |
| confidence | low |
| dataCoveragePct | 32.1 |
| sourceRefs | coingecko:coins/markets:mantra-dao<br/>defillama:chains:Mantra<br/>defillama:protocols:category=liquid staking:chain=Mantra<br/>defillama:stablecoins:Mantra<br/>stakingrewards.com:manual-snapshot:mantra:asOf=2026-03-10<br/>etherscan:v2:module=gastracker:action=gasoracle:chainid=169 |

### Indicadores usados en UI (Radar/Detail)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| networkId | mantra | sin-clasificar | n/a | No definido | Routing `/network/[networkId]` |
| network | Mantra | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Network + Detail Header |
| token | OM | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: Native Token + Detail Header |
| category | RWA-focused L1 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla subtitulo + Detail Header |
| status | Emerging | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar tabla: status tag |
| marketCapUsd | 82536193 | api/manual-observed | observed | API CoinGecko | Radar tabla col + KPI Total Market Cap + Detail Header |
| stakingRatioPct | 27.88 | api/manual-observed | observed | Manual StakingRewards | Radar col + KPI Avg Staking Ratio + Detail Header + Scoring input |
| stakingApyPct | 18.58 | api/manual-observed | observed | Manual StakingRewards | Radar col + Detail Header + Scoring input |
| stakerAddresses | 76000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + fallback module metrics + Scoring input |
| globalLstHealthScore | 68 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill (recalculado por scoring UI) + Detail Header |
| lstProtocols | 2 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar col + Scoring input |
| lstPenetrationPct | 0 | derivado | derived | Derivado desde APIs/manual | Radar col + KPI Avg LST Penetration + fallback module metric |
| defiTvlUsd | 674435.353975 | api/manual-observed | observed | API DefiLlama | Radar col + KPI Total DeFi TVL + Detail Header |
| opportunityScore | 79 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar pill + Detail Header |
| circulatingSupply | 4776841386.770579 | api/manual-observed | observed | API CoinGecko | Radar Show Details |
| stakedTokens | 1970000000 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + %Staked derivado |
| stakedValueUsd | 23011091 | derivado | n/a | Derivado local (`marketCapUsd * stakingRatioPct`) | KPI Total Staked Value + Radar Show Details |
| validatorCount | 38 | api/manual-observed | observed | Manual StakingRewards | Radar Show Details + fallback module + Scoring input |
| largestLst | stOM | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback module |
| stablecoinLiquidityUsd | 98000000 | missing | missing | API DefiLlama | Radar Show Details + Scoring input + fallback module |
| lendingPresence | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| lstCollateralEnabled | true | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + Scoring input |
| mainBottleneck | Limited stablecoin liquidity | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback diagnosis |
| mainOpportunity | Expand DeFi credit markets | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | Radar Show Details + fallback opportunities |
| quality | simulated | metadata | n/a | Derivado por pipeline | Radar Show Details |
| confidence | low | metadata | n/a | Derivado por pipeline | Radar Show Details |
| dataCoveragePct | 32.1 | metadata | n/a | Derivado por pipeline | KPI Avg Data Coverage + Radar Show Details |
| asOf | 2026-03-11T11:41:56.440Z | metadata | n/a | Metadata pipeline | Radar Show Details |

### Indicadores en dataset (aun no visualizados o parciales)

| Indicador | Valor | Estado | fieldQuality | Origen | Destino UI |
|---|---:|---|---|---|---|
| fdvUsd | 4200000000 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| circulatingSupplyPct | 43 | mockeado | n/a | Mock base `data/networks.ts` (sample universe) | No visualizado |
| priceUsd | 0.017163 | api/manual-observed | observed | API CoinGecko | No visualizado |
| volume24hUsd | 98879 | api/manual-observed | observed | API CoinGecko | No visualizado |
| rewardRatePct | 18.58 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| stakingMarketCapUsd | 36080000 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| inflationRatePct | 12.74 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| verifiedProviders | 4 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| benchmarkCommissionPct | 4.26 | api/manual-observed | observed | Manual StakingRewards | No visualizado |
| lstTvlUsd | 0 | api/manual-observed | observed | API DefiLlama | No visualizado directo (input derivaciones/scoring) |
| tvlToMcapPct | 0.8 | derivado | derived | Derivado local (`defiTvlUsd / marketCapUsd`) | No visualizado directo (Scoring input) |
| baseTokenDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitRouteExists | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitPairAddress | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitQuoteToken | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| stableExitDexId | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstDexVolume24hUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPairCount | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstLargestPoolLiquidityUsd | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstPoolConcentration | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasBasePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstHasStablePair | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| baseTokenVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstVolumeLiquidityRatio | null | missing | missing | API Dexscreener | No visualizado (dataset) |
| lstTotalSupply | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstHolderCount | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTop10HolderShare | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| lstTransferVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractAbiAvailable | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| contractVerified | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemCount24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolMintVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolRedeemVolume24h | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| protocolTreasuryNativeBalance | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| safeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| proposeGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| fastGasPrice | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| suggestedBaseFee | null | missing | missing | API Etherscan v2 | No visualizado (dataset) |
| staking.rewardRatePct | 18.58 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingRatioPct | 27.88 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakingMarketCapUsd | 36080000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.stakedTokens | 1970000000 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.inflationRatePct | 12.74 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.validators | 38 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.verifiedProviders | 4 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| staking.benchmarkCommissionPct | 4.26 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.source | stakingrewards.com | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.asOf | 2026-03-10 | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.quality | observed-manual | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| stakingMeta.confidence | high | manual | n/a | Manual `data/manual/stakingrewards.json` | No visualizado (dataset) |
| chainResourcesLinksCount | 7 | manual-curado | n/a | Manual curado `data/chain-resources.json` | Radar quick action Resources + Detail section Chain Resources |
| sourceRefs | [6 items] | metadata | n/a | Metadata pipeline | Radar Show Details |

### Bloques de Network Detail (provenance)

| Bloque | Estado | Origen | Destino UI |
|---|---|---|---|
| detail.summary.diagnosis | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Detail Header |
| detail.modules (7) | mockeado (scores reemplazados por scoring engine) | Mock sintético fallback (`src/features/network-detail/data.ts`) | Cards de módulos |
| detail.opportunities (3) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Top Opportunities panel |
| detail.redFlags (2) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Red Flags panel |
| detail.stressSnapshot | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Stress Snapshot panel |
| detail.miniVisuals (4 series) | mockeado | Mock sintético fallback (`src/features/network-detail/data.ts`) | Mini Visuals panel |
| detail.scoring (modules/pillars/global) | derivado (inputs mixtos) | src/features/scoring/* | Scoring Model panel + Health pill |

