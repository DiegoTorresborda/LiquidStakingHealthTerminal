# LST Health Score — Mapa de Datos y Gaps

**Generado:** 2026-03-14
**Objetivo:** Trazar el flujo completo desde datos crudos hasta el score global, identificando qué sub-métrica usa qué dato real y dónde hay vacíos.

---

## 1. El problema central: el scoring es circular

El score final **no se computa desde datos crudos**. El flujo real es:

```
build-overview-dataset.ts → globalLstHealthScore: 71  (número escrito a mano)
         ↓
mock-input.ts: deriveModuleBaselines(network)
  base = network.globalLstHealthScore          ← el número manual
  + señales de ajuste (+/- 3 a 8 pts) desde 8 campos reales
         ↓
buildMockScoringInput(network)
  TODOS los sub-metrics de cada módulo = repeated(baseline_del_módulo)
  (poolDepth = slippageQuality = volumeQuality = lpDiversification = mismo número)
         ↓
engine.ts: computeLstHealthScore(input)
  weighted average → pero como todos los sub-metrics son iguales, resultado ≈ baseline
  Penalizaciones y caps sí aplican (son booleanos derivados de campos reales)
         ↓
globalScore ≈ globalLstHealthScore original ± 3-8 puntos
```

**Consecuencia:** la arquitectura de 7 módulos × N sub-métricas no diferencia nada hoy. El score es prácticamente el número manual más ajustes menores.

---

## 2. Campos reales en el dataset

### Disponibles y confiables (observed / derived)
| Campo | Fuente | Redes con datos |
|---|---|---|
| `marketCapUsd` | CoinGecko | 9/10 |
| `priceUsd` | CoinGecko | 9/10 |
| `volume24hUsd` | CoinGecko | 9/10 |
| `defiTvlUsd` | DeFi Llama | 9/10 |
| `stablecoinLiquidityUsd` | DeFi Llama / override manual | 10/10 (pero inferred) |
| `validatorCount` | StakingRewards | 8/10 |
| `stakingApyPct` | StakingRewards | 8/10 |
| `stakingRatioPct` | StakingRewards | 8/10 |
| `inflationRatePct` | StakingRewards | 7/10 |
| `verifiedProviders` | StakingRewards | 7/10 |
| `benchmarkCommissionPct` | StakingRewards | 7/10 |
| `lstTvlUsd` | DeFi Llama | 9/10 |
| `stakedValueUsd` | derived (price × staked) | 9/10 |
| `lstPenetrationPct` | derived (lstTvl/stakedValue) | 9/10 |
| `baseTokenDexLiquidityUsd` | DEXScreener | 4/10 |
| `stableExitLiquidityUsd` | DEXScreener | 3/10 |
| `stableExitRouteExists` | DEXScreener | 3/10 |
| `stableExitQuoteToken` | DEXScreener | 3/10 |

### Disponibles pero solo como proxies manuales / inferidos
| Campo | Calidad real | Problema |
|---|---|---|
| `lstProtocols` | inferred (manual) | ¿Cuántos protocolos tienen redención real? No validado |
| `lendingPresence` | inferred (manual) | Bool sin profundidad: ¿cuántos lending venues? ¿qué caps? |
| `lstCollateralEnabled` | inferred (manual) | Bool sin profundidad: ¿cuánto colateral activo? |
| `stakerAddresses` | inferred (manual) | Estimación, no conteo on-chain |

### Completamente ausentes (missing en todas o casi todas las redes)
| Campo | Relevancia para scoring | Fuente potencial |
|---|---|---|
| `lstDexLiquidityUsd` | CRÍTICA — Liquidity & Exit, Stress | DEXScreener (token LST) |
| `lstDexVolume24hUsd` | CRÍTICA — Liquidity & Exit | DEXScreener |
| `lstPairCount` | Alta — diversificación | DEXScreener |
| `lstLargestPoolLiquidityUsd` | Alta — concentración LP | DEXScreener |
| `lstPoolConcentration` | Alta — concentración LP | DEXScreener |
| `lstHasBasePair` | Alta — exit path | DEXScreener |
| `lstHasStablePair` | Alta — stable exit | DEXScreener |
| `lstVolumeLiquidityRatio` | Media — calidad de volumen | derived |
| `lstHolderCount` | Media — distribución LST | Etherscan / chain explorer |
| `lstTop10HolderShare` | Alta — concentración LST | Etherscan / chain explorer |
| `lstTotalSupply` | Media — tamaño real del LST | Etherscan |
| `lstTransferCount24h` | Media — actividad orgánica | Etherscan |
| `protocolMintCount24h` | Alta — uso real del protocolo | Etherscan |
| `protocolRedeemCount24h` | CRÍTICA — redención real | Etherscan |
| `protocolMintVolume24h` | Alta | Etherscan |
| `protocolRedeemVolume24h` | CRÍTICA — peg anchor | Etherscan |
| `contractVerified` | Media — seguridad | Etherscan |
| Precio histórico LST/base | CRÍTICA — Peg Stability | DEXScreener, CoinGecko |
| Unbonding period (días) | Alta — redemption friction | Manual / chain docs |
| Número de auditorías | Alta — Security | Manual / DeFi Llama protocols |
| Timelock existence | Alta — Security | Manual / chain explorer |

---

## 3. Cobertura por red

| Red | Cobertura | Calidad | Campos missing | Campos observed |
|---|---|---|---|---|
| Monad | 63.1% | inferred | 24 | 19 |
| Aptos | 61.5% | inferred | 25 | 19 |
| Sei | 46.2% | simulated | 35 | 15 |
| Sui | 46.2% | simulated | 35 | 15 |
| XDC | 46.2% | simulated | 35 | 15 |
| Mantra | 44.6% | simulated | 36 | 15 |
| Berachain | 44.6% | simulated | 36 | 10 |
| Shardeum | 35.4% | simulated | 42 | 0 |
| Core | 27.7% | simulated | 47 | 6 |
| Sonic | 27.7% | simulated | 47 | 6 |

> Monad y Aptos son las únicas redes con datos suficientes para un scoring no-simulado.
> Core, Sonic y Shardeum tienen cobertura tan baja que cualquier score es ruido.

---

## 4. Mapeo sub-métrica → dato real disponible

### Módulo 1: Liquidity & Exit (25% del score global)

| Sub-métrica | Peso en módulo | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `lstMarketDepth.poolDepth` | 0.35 × 0.3 | `lstDexLiquidityUsd` | ❌ missing | Registrar LST token en DEXScreener |
| `lstMarketDepth.slippageQuality` | 0.3 × 0.3 | Slippage quote para $100k–$1M | ❌ sin fuente | API de agregador (1inch / Paraswap) |
| `lstMarketDepth.volumeQuality` | 0.2 × 0.3 | `lstDexVolume24hUsd` | ❌ missing | DEXScreener |
| `lstMarketDepth.lpDiversification` | 0.15 × 0.3 | `lstPairCount`, `lstPoolConcentration` | ❌ missing | DEXScreener |
| `baseExitQuality.lstBaseSlippage` | 0.5 × 0.2 | Slippage LST→base token | ❌ sin fuente | API de agregador |
| `baseExitQuality.lstBaseDepth` | 0.3 × 0.2 | `lstLargestPoolLiquidityUsd`, `lstHasBasePair` | ❌ missing | DEXScreener |
| `baseExitQuality.routeRedundancy` | 0.2 × 0.2 | `lstPairCount`, venues | ❌ missing | DEXScreener |
| `stableExitQuality.baseStableDepth` | 0.35 × 0.25 | `stableExitLiquidityUsd` | ⚠️ solo 3/10 redes | DEXScreener (ampliar cobertura) |
| `stableExitQuality.exitSlippage` | 0.35 × 0.25 | Slippage base→stable | ⚠️ proxy grosero vía liquidez | API de agregador |
| `stableExitQuality.stablecoinQuality` | 0.2 × 0.25 | `stableExitQuoteToken` (USDC > USDT > otros) | ⚠️ solo 3/10 redes | DEXScreener |
| `stableExitQuality.routeRedundancy` | 0.1 × 0.25 | # pares stable disponibles | ❌ sin fuente | DEXScreener |
| `redemptionAnchor.redemptionAvailability` | 0.35 × 0.15 | Existencia de redención nativa | ⚠️ proxy: `lstProtocols >= 2` | Manual + on-chain |
| `redemptionAnchor.queueTransparency` | 0.25 × 0.15 | Dashboard de cola pública | ❌ sin fuente | Manual / research |
| `redemptionAnchor.redemptionFriction` | 0.2 × 0.15 | Unbonding period, fees | ❌ sin fuente | Manual / chain docs |
| `redemptionAnchor.arbitrageViability` | 0.2 × 0.15 | `lstDexLiquidityUsd` + spread LST/base | ❌ missing | DEXScreener + precio histórico |
| `liquidityDurability.incentiveDependence` | 0.4 × 0.1 | Ratio emisiones/fees en pools LST | ❌ sin fuente | DeFi Llama (farms) |
| `liquidityDurability.tvlPersistence` | 0.3 × 0.1 | Histórico de `lstTvlUsd` (tendencia) | ⚠️ solo snapshot actual | DeFi Llama histórico |
| `liquidityDurability.organicVolumeQuality` | 0.2 × 0.1 | `lstVolumeLiquidityRatio` | ❌ missing | DEXScreener |
| `liquidityDurability.lpStability` | 0.1 × 0.1 | LP churn / turnover | ❌ sin fuente | On-chain analytics |

**Flags del módulo:**
| Flag | Lógica actual | Dato ideal | Confiabilidad |
|---|---|---|---|
| `stablecoinExitExists` | `stablecoinLiquidityUsd >= 70M` | `stableExitRouteExists` del LST | ⚠️ proxy con umbral arbitrario |
| `redemptionPathExists` | `lstProtocols >= 2` | Verificación on-chain | ⚠️ proxy grosero |
| `extremeLpConcentrationPenalty` | `lstProtocols === 1` → 5 o 10 pts | `lstPoolConcentration` | ❌ missing |

---

### Módulo 2: Peg Stability (15%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `discountLevel` | 0.35 | Avg descuento LST/base 30d | ❌ sin fuente | CoinGecko / DEXScreener histórico |
| `discountVolatility` | 0.25 | Volatilidad del descuento 30d | ❌ sin fuente | Derived del histórico |
| `pegRecovery` | 0.2 | Velocidad de recuperación post-shock | ❌ sin fuente | Análisis histórico |
| `arbitrageEfficiency.redemptionAvailability` | 0.4 × 0.2 | Idem redemption anchor | ⚠️ proxy | Manual |
| `arbitrageEfficiency.redemptionFriction` | 0.3 × 0.2 | Unbonding + fees | ❌ sin fuente | Manual |
| `arbitrageEfficiency.arbitrageCapacity` | 0.3 × 0.2 | `lstDexLiquidityUsd` | ❌ missing | DEXScreener |

**Flags del módulo:**
| Flag | Lógica actual | Problema |
|---|---|---|
| `redemptionPathExists` | `lstProtocols >= 2` | Idem arriba |
| `persistentLargeDiscount` | `stablecoinLiquidityUsd < 60M` | No tiene nada que ver con el peg real |
| `extremeVolatilityPenalty` | `stablecoinLiquidityUsd < 30M` | Proxy completamente distinto del concepto |

> **Este módulo es el de mayor brecha.** Los 3 inputs principales requieren histórico de precio LST que no existe en el dataset.

---

### Módulo 3: DeFi Moneyness (15%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `collateralUtility` | 0.4 | Colateral activo ($), # venues, LTV | ⚠️ solo bool `lstCollateralEnabled` | DeFi Llama protocols, manual |
| `defiIntegrationBreadth` | 0.25 | # protocolos donde el LST es usable | ⚠️ solo bool `lendingPresence` | DeFi Llama protocols |
| `usageDepth` | 0.2 | Ratio `lstTvlUsd/defiTvlUsd` o `lstTvlUsd/marketCapUsd` | ✅ calculable: `tvlToMarketCap` proxy | Ya existe, usable |
| `demandQuality` | 0.15 | % LST en estrategias vs. idle | ❌ sin fuente | On-chain analytics |

**Flags:**
| Flag | Lógica actual | Confiabilidad |
|---|---|---|
| `lstUsedAsCollateral` | `lstCollateralEnabled` (manual bool) | ⚠️ depende de actualización manual |

---

### Módulo 4: Security & Governance (15%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `auditPosture` | 0.3 | # auditorías, firmas, fecha | ❌ sin fuente | Manual / DeFi Llama audits |
| `adminControlQuality` | 0.3 | Multisig threshold, admin keys | ❌ `contractVerified` missing | On-chain / manual |
| `upgradeSafety` | 0.2 | Timelock duration (días), proxy pattern | ❌ sin fuente | Manual / on-chain |
| `operationalTransparency` | 0.2 | Bug bounty, docs, incident history | ❌ sin fuente | Manual research |

**Flags:**
| Flag | Lógica actual | Problema |
|---|---|---|
| `noAudits` | `marketCapUsd < 1.2B && lstProtocols === 1` | No tiene relación con auditorías reales |
| `noTimelockUpgrades` | `!lendingPresence && !lstCollateralEnabled` | No tiene relación con timelocks reales |

> **Este módulo es completamente opaco.** Todos los inputs son proxies de otros conceptos. No existe ningún dato real de seguridad en el dataset.

---

### Módulo 5: Validator Decentralization (10%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `delegationDistribution` | 0.35 | HHI o Nakamoto coefficient de stake | ⚠️ proxy: `validatorCount` | On-chain / StakingRewards |
| `validatorSetBreadth` | 0.25 | `validatorCount`, # active validators | ✅ `validatorCount` disponible | Ya existe |
| `operatorQuality` | 0.2 | `verifiedProviders`, uptime, comisiones | ✅ `verifiedProviders`, `benchmarkCommissionPct` | Ya existe |
| `slashingRiskManagement` | 0.2 | Historial de slashings, políticas | ❌ sin fuente | Manual / chain analytics |

**Flags:**
| Flag | Lógica actual | Confiabilidad |
|---|---|---|
| `extremeConcentration` | `validatorCount < 65` | ⚠️ proxy razonable pero sin Nakamoto coefficient |

> **Módulo con mejor cobertura relativa.** `validatorCount`, `verifiedProviders` y `benchmarkCommissionPct` son reales y usables.

---

### Módulo 6: Incentive Sustainability (10%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `yieldQuality` | 0.35 | APY real vs. inflación (`stakingApyPct - inflationRatePct`) | ✅ ambos disponibles | Ya calculable |
| `liquidityDurability` | 0.3 | Ratio fees/emisiones en pools LST | ❌ sin fuente | DeFi Llama farms |
| `usagePersistence` | 0.2 | Tendencia de `lstTvlUsd` (crecimiento 30d/90d) | ⚠️ solo snapshot | DeFi Llama histórico |
| `revenueSupport` | 0.15 | Fee revenue del protocolo LST | ❌ sin fuente | DeFi Llama revenue |

**Flags:**
| Flag | Lógica actual | Confiabilidad |
|---|---|---|
| `emissionsDominate` | `stakingApyPct >= 8.8 && !lstCollateralEnabled` | ⚠️ correlación débil, no causa |

---

### Módulo 7: Stress Resilience (10%)

| Sub-métrica | Peso | Dato ideal | Disponible hoy | Gap |
|---|---|---|---|---|
| `liquidityShockResistance.lpDiversification` | 0.4 × 0.3 | `lstPoolConcentration` | ❌ missing | DEXScreener |
| `liquidityShockResistance.poolDepth` | 0.35 × 0.3 | `lstDexLiquidityUsd` | ❌ missing | DEXScreener |
| `liquidityShockResistance.venueDiversity` | 0.25 × 0.3 | `lstPairCount` (# venues) | ❌ missing | DEXScreener |
| `redemptionCapacity.queueThroughput` | 0.4 × 0.25 | Max redención diaria del protocolo | ❌ sin fuente | On-chain / docs |
| `redemptionCapacity.redemptionTransparency` | 0.3 × 0.25 | Dashboard público de cola | ❌ sin fuente | Manual research |
| `redemptionCapacity.unbondingDuration` | 0.3 × 0.25 | Días de unbonding | ❌ sin fuente | Manual / chain docs |
| `stableExitCapacity.baseStableDepth` | 0.4 × 0.25 | `stablecoinLiquidityUsd` | ✅ disponible (inferred) | Ya usable |
| `stableExitCapacity.exitSlippage` | 0.3 × 0.25 | `stableExitLiquidityUsd` proxy | ⚠️ solo 3/10 redes | Ampliar DEXScreener |
| `stableExitCapacity.stablecoinDiversity` | 0.2 × 0.25 | # stablecoins en pares de salida | ❌ sin fuente | DEXScreener / manual |
| `stableExitCapacity.stablecoinQuality` | 0.1 × 0.25 | Ranking de stablecoin (USDC > USDT) | ⚠️ `stableExitQuoteToken` parcial | Ampliar cobertura |
| `defiContagionRisk.lendingRiskDesign` | 0.4 × 0.2 | LTV, liquidation params del lending | ⚠️ solo bool `lendingPresence` | DeFi Llama protocols |
| `defiContagionRisk.oracleRobustness` | 0.3 × 0.2 | Oracle type (Chainlink, TWAP, etc.) | ❌ sin fuente | Manual research |
| `defiContagionRisk.leverageExposure` | 0.3 × 0.2 | Looping strategies activas | ❌ sin fuente | On-chain analytics |

---

## 5. Resumen de gaps por prioridad

### Tier 1 — Crítico: sin estos datos, los módulos de mayor peso son inválidos

| Dato faltante | Módulos impactados | Fuente potencial | Dificultad |
|---|---|---|---|
| Precio histórico LST/base (30d) | Peg Stability (15%) completo | DEXScreener / CoinGecko | Media |
| `lstDexLiquidityUsd` | Liquidity & Exit (25%), Stress (10%) | DEXScreener con token LST configurado | Media |
| `lstDexVolume24hUsd` | Liquidity & Exit | DEXScreener | Baja (mismo adapter) |
| `lstPoolConcentration` | Liquidity & Exit, Stress | DEXScreener | Baja (mismo adapter) |
| Unbonding period (días) | Liquidity & Exit, Stress, Peg | Manual + chain docs | Baja (campo manual) |

### Tier 2 — Alto: mejoran significativamente la precisión del scoring

| Dato faltante | Módulos impactados | Fuente potencial | Dificultad |
|---|---|---|---|
| # auditorías + firma | Security & Governance (15%) | DeFi Llama protocols / manual | Media |
| Timelock existence (días) | Security & Governance | On-chain / manual | Media |
| `protocolRedeemCount24h` | Peg Stability, Stress | Etherscan (ya configurado) | Baja (adapter existe) |
| `lstTop10HolderShare` | Validator Decentralization | Etherscan | Baja (adapter existe) |
| Colateral activo ($) por venue | DeFi Moneyness | DeFi Llama protocols | Media |

### Tier 3 — Medio: refinan pero no son bloqueantes

| Dato faltante | Módulos impactados | Fuente potencial |
|---|---|---|
| Ratio fees/emisiones en pools | Incentive Sustainability | DeFi Llama farms |
| Tendencia histórica `lstTvlUsd` | Incentive Sustainability | DeFi Llama histórico |
| Fee revenue del protocolo | Incentive Sustainability | DeFi Llama revenue |
| Oracle type (Chainlink vs TWAP) | Stress Resilience | Manual research |
| HHI / Nakamoto coefficient | Validator Decentralization | StakingRewards / on-chain |

---

## 6. Sub-métricas que SÍ son calculables hoy con datos reales

Estos campos existen y pueden reemplazar el mock inmediatamente:

| Sub-métrica del engine | Campo real disponible | Fórmula sugerida |
|---|---|---|
| `validatorSetBreadth` | `validatorCount` | `scale(validatorCount, 20, 200)` |
| `operatorQuality` | `verifiedProviders`, `benchmarkCommissionPct` | weighted average de ambos escalados |
| `stableExitCapacity.baseStableDepth` | `stablecoinLiquidityUsd` | `scale(val, 20M, 500M)` |
| `usageDepth` (DeFi Moneyness) | `tvlToMarketCap` o `lstTvlUsd/defiTvlUsd` | ratio escalado |
| `yieldQuality` | `stakingApyPct`, `inflationRatePct` | `scale(apy - inflation, -2, 8)` |
| `stableExitQuality.baseStableDepth` | `stableExitLiquidityUsd` (3 redes) | `scale(val, 1M, 100M)` |
| `stableExitQuality.stablecoinQuality` | `stableExitQuoteToken` | ranking: USDC=100, USDT=75, otros=40 |
| `stablecoinExitExists` (flag) | `stableExitRouteExists` | booleano directo |
| `extremeConcentration` (flag) | `validatorCount` | `validatorCount < 65` (ya implementado) |

**Cobertura calculable sin datos adicionales: ~15% de los inputs del engine.**

---

## 7. Lo que el score NO puede medir hoy

| Concepto | Por qué importa | Estado |
|---|---|---|
| Peg behavior real del LST | Es el módulo de 15% y la señal más directa de salud | 0% de datos disponibles |
| Liquidez real del LST en DEX | Es el driver primario del módulo de 25% | 0% (token LST no configurado) |
| Calidad de redención (velocidad, transparencia) | Determina si el arbitraje puede anclar el peg | 0% de datos disponibles |
| Seguridad real (auditorías, timelocks) | El módulo entero usa proxies falsos | 0% de datos reales |
| Sostenibilidad de incentivos (fees vs. emisiones) | Diferencia TVL orgánico de TVL subsidiado | 0% de datos disponibles |

---

## 8. Conclusión para la reformulación

Antes de reformular las fórmulas, hay dos decisiones previas:

**Decisión A — ¿Qué datos se van a recolectar?**
El scoring real requiere principalmente: (1) precio histórico LST, (2) liquidez DEX del LST, (3) datos on-chain de redención, (4) campos de seguridad manuales. Sin al menos los primeros dos, los módulos de mayor peso (Liquidity & Exit 25%, Peg Stability 15%) seguirán siendo ficción.

**Decisión B — ¿Cómo manejar la incertidumbre mientras faltan datos?**
Opciones: (a) mostrar score parcial solo con módulos con datos reales, (b) usar intervalos de confianza en vez de scores puntuales, (c) mantener un score "estimado" pero marcado explícitamente como tal.

**El score actual de `globalLstHealthScore` hardcodeado en `build-overview-dataset.ts` debería renombrarse como `analystEstimatedScore` para reflejar que es una opinión cualitativa, no un output del engine.**
