# LST Health Score v2 — Diseño en progreso

**Estado:** En construcción módulo por módulo
**Ticket size default:** $1M (parámetro configurable)

---

## Arquitectura general

### Tres modos de scoring

| Modo | Criterio | Redes actuales |
|---|---|---|
| **Pre-LST** | No existe protocolo LST activo | Shardeum, XDC, Mantra |
| **LST Activo** | LST existe con actividad de mercado | Monad, Sei, Sui, Aptos, Berachain, Core, Sonic |

> Naciente vs. Maduro no requieren fórmulas distintas — la diferencia emerge naturalmente de los datos disponibles y los scores resultantes.

### Principios de diseño

1. **Máximo 3–5 inputs por módulo** — si no es obtenible para 80%+ de redes, no entra
2. **Jerarquía de fuentes por input:** primaria → proxy → fallback → 0/null con flag
3. **Normalización híbrida para valores USD:** ejecutabilidad (vs ticket) × 0.6 + salud relativa (vs market cap) × 0.4
4. **Escala log para valores USD**, lineal para ratios/porcentajes
5. **Scores comparables entre modos** en la misma escala 0–100, con caps implícitos que limitan el techo del modo Pre-LST
6. **Ticket size parametrizable** — umbrales derivados del ticket, no arbitrarios

### Funciones de normalización compartidas

```typescript
const TICKET_SIZE = 1_000_000  // $1M default, configurable

// Ejecutabilidad: ¿puedo ejecutar el ticket sin haircut grave?
// floor = 2× ticket, ceiling = 25× ticket
function exec(val: number, ticket = TICKET_SIZE): number {
  return logScale(val, ticket * 2, ticket * 25)
}

// Escala logarítmica entre floor y ceiling → 0 a 100
function logScale(val: number, floor: number, ceiling: number): number {
  if (val <= 0) return 0
  const logVal = Math.log(Math.max(val, 1))
  const logFloor = Math.log(Math.max(floor, 1))
  const logCeil = Math.log(ceiling)
  return clamp((logVal - logFloor) / (logCeil - logFloor) * 100, 0, 100)
}

// Escala lineal entre floor y ceiling → 0 a 100
function linScale(val: number, floor: number, ceiling: number): number {
  return clamp((val - floor) / (ceiling - floor) * 100, 0, 100)
}
```

---

## Módulos — Estado del diseño

| Módulo | Peso global | Modo Pre-LST | Modo Activo | Estado |
|---|---|---|---|---|
| **Liquidity & Exit** | 25% | ✅ diseñado | ✅ diseñado | Listo para implementar |
| **Peg Stability** | 15% | — | — | Pendiente |
| **DeFi Moneyness** | 15% | — | — | Pendiente |
| **Security & Governance** | 15% | — | — | Pendiente |
| **Validator Decentralization** | 10% | — | — | Pendiente |
| **Incentive Sustainability** | 10% | — | — | Pendiente |
| **Stress Resilience** | 10% | — | — | Pendiente |

> Los pesos globales pueden revisarse una vez que todos los módulos estén diseñados.

---

## Módulo 1: Liquidity & Exit (25%)

### Modo A — Pre-LST

**Pregunta:** ¿Qué tan buenas son las condiciones del ecosistema para que un LST tenga liquidez exitosa desde el día 1?

```
score = baseExitDepth   × 0.40
      + stableExitDepth × 0.40
      + stakingAdoption × 0.20

Cap: sin ruta stable documentada → techo 45
```

#### Inputs

**`baseExitDepth`** — ¿Hay profundidad para operar el token base?
- Fuente primaria: `baseTokenDexLiquidityUsd` (DEXScreener, suma de todos los pares del token base)
- Proxy: `volume24hUsd` CoinGecko (incluye CEX + DEX — lo que importa es la capacidad de salida, no el venue)
- Normalización: `exec(val) × 0.6 + logScale(val/marketCap, 0.5%, 10%) × 0.4`

**`stableExitDepth`** — ¿Existe ruta base→stable negociable?
- Fuente primaria: `stableExitLiquidityUsd` (DEXScreener, suma de pares base/USDC + base/USDT + otros stable, todos los DEXes)
- Proxy: `stablecoinLiquidityUsd` × 0.05 (descuento agresivo: total stables en chain ≠ liquidez del par)
- Normalización: `exec(val) × 0.6 + logScale(val/marketCap, 0.3%, 5%) × 0.4`

**`stakingAdoption`** — ¿Hay demanda para convertir stake en LST?
- Fuente: `stakingRatioPct`
- Normalización: `linScale(val, 5%, 60%)`

#### Cap
- Si `stableExitLiquidityUsd` = null y `stablecoinLiquidityUsd` < $20M → cap score en 45

---

### Modo B — LST Activo

**Pregunta:** ¿Puede un LP entrar, operar y salir del LST con fricción razonable?

```
score = lstLiquidity     × 0.45
      + stableExit       × 0.35
      + redemptionAnchor × 0.20

Cap: sin ruta stable → techo 55
Cap: sin redención nativa → techo 60
```

#### Inputs

**`lstLiquidity`** — ¿Puedo vender el LST sin haircut significativo?
- Fuente primaria: `lstDexLiquidityUsd` (DEXScreener, suma de TODOS los pares del token LST en todos los DEXes)
- Proxy: **ninguno** — si no hay dato, el componente es 0
- Normalización: `exec(val) × 0.6 + logScale(val/lstTvlUsd, 2%, 20%) × 0.4`
- Denominador relativo: `lstTvlUsd` (no market cap del token base)

**`stableExit`** — ¿Hay ruta eficiente base→stable?
- Fuente primaria: `stableExitLiquidityUsd` (DEXScreener, suma de todos los pares base/stable)
- Proxy: `stablecoinLiquidityUsd` × 0.05
- Normalización: `exec(val) × 0.6 + logScale(val/marketCap, 0.3%, 5%) × 0.4`
- Denominador relativo: `marketCapUsd` del token base

**`redemptionAnchor`** — ¿Existe salida vía unbonding nativo?
- Fuente primaria: `unbondingDays` (campo manual a agregar) + `lstProtocols >= 1`
- Proxy: `lstProtocols >= 1` como boolean si no hay `unbondingDays`

| Condición | Score |
|---|---|
| No existe redención nativa | 0 |
| Existe, unbonding > 21 días | 35 |
| Existe, unbonding 8–21 días | 60 |
| Existe, unbonding 3–7 días | 80 |
| Existe, unbonding ≤ 2 días | 100 |
| Solo boolean (sin días conocidos) | 50 |

#### Caps
- Sin `stableExitLiquidityUsd` ni proxy viable → cap 55
- Sin redención nativa (`lstProtocols` = 0 o null) → cap 60

---

## Campos nuevos necesarios en el dataset

| Campo | Tipo | Fuente | Módulo | Prioridad |
|---|---|---|---|---|
| `unbondingDays` | `number \| null` | Manual | Liquidity & Exit, Peg Stability, Stress | Alta |
| `stableExitLiquidityUsdTotal` | `number \| null` | DEXScreener agregado (suma de pares) | Liquidity & Exit, Stress | Alta |
| `lstDexLiquidityUsdTotal` | `number \| null` | DEXScreener agregado (suma de pares LST) | Liquidity & Exit, Stress | Alta |

> Nota: los campos actuales `stableExitLiquidityUsd` y `lstDexLiquidityUsd` capturan solo el mejor par. Se necesita la suma de todos los pares relevantes.

---

## Notas de implementación

- Directorio v2: `src/features/scoring/v2/`
- Archivos: `types.ts`, `engine.ts`, `input-builder.ts`, `normalizers.ts`
- El sistema v1 se mantiene intacto hasta que v2 esté completo
- Swap final: reemplazar imports en los componentes que consumen el scoring
