# Tutorial de Uso: LST Opportunity Radar + Network Diagnosis

## 1. Objetivo del producto

Este dashboard sirve para responder dos preguntas:

1. ¿Qué redes PoS merecen análisis profundo?
2. En cada red, ¿qué frena hoy la adopción de LST y qué mejorar primero?

La lógica central es LP-centric:
un LP no compra solo APY, compra **carry + utilidad + salida + control de riesgo**.

---

## 2. Qué vas a encontrar en la app

La plataforma tiene dos capas conectadas.

### Capa A: `LST Opportunity Radar` (market overview)

Vista de portafolio para comparar redes.

Incluye:
- KPIs agregados
- tabla sortable/filterable
- `Global LST Health Score` (salud actual)
- `Opportunity Score` (upside estratégico)

### Capa B: `Network Detail Diagnosis` (`/network/[networkId]`)

Vista de diagnóstico profundo por red.

Incluye:
- resumen ejecutivo
- 7 módulos analíticos
- Top Opportunities
- Red Flags
- Stress Snapshot
- Scoring Model v1 (raw, penalties, caps, final)

---

## 3. Flujo recomendado de uso (rápido)

1. Abrí la vista Radar y ordená por `Opportunity Score` para detectar targets de intervención.
2. Filtrá por status, lending y collateral para acotar el universo.
3. Abrí una red con click en fila o `Open diagnosis`.
4. En detalle, revisá primero:
   - `Global LST Health Score`
   - pilares (`Exitability`, `Moneyness`, `Credibility`)
   - módulos más débiles
5. Confirmá si los problemas son estructurales en:
   - salida a stables
   - utilidad colateral
   - fragilidad en estrés
6. Priorizá 1-3 oportunidades con mayor impacto y menor fricción de ejecución.

---

## 4. Cómo interpretar los dos scores principales

## `Global LST Health Score`

Mide **calidad actual** del ecosistema LST.

Rangos:
- 85-100: Institutional Grade
- 70-84: Strong
- 55-69: Usable but Constrained
- 40-54: Fragile
- <40: Unhealthy

## `Opportunity Score`

Mide **atractivo de intervención** (upside de mejora), no calidad actual.

Regla práctica:
- Health alto + Opportunity bajo => ecosistema más maduro, menos upside incremental.
- Health medio/bajo + Opportunity alto => ecosistema incompleto con espacio de mejora.

No mezclar ambos scores: cumplen funciones distintas.

---

## 5. Cómo se calcula el scoring (v1)

Fuente formal: [lst-health-scoring.md](/Users/diegotorres/Documents/GitHub/LiquidStakingHealthTerminal/docs/lst-health-scoring.md)

Arquitectura:
- 7 módulos
- 3 pilares
- 1 score global

### 7 módulos

1. Liquidity & Exit  
2. Peg Stability  
3. Stress Resilience  
4. DeFi Moneyness  
5. Security & Governance  
6. Validator Decentralization  
7. Incentive Sustainability

### 3 pilares

- `Exitability`  
  `0.50*Liquidity&Exit + 0.30*PegStability + 0.20*StressResilience`

- `Moneyness`  
  `DeFiMoneyness`

- `Credibility`  
  `0.40*Security&Governance + 0.30*ValidatorDecentralization + 0.30*IncentiveSustainability`

### Global LST Health Score

`0.45*Exitability + 0.30*Moneyness + 0.25*Credibility`

---

## 6. Qué son `raw`, `penalties`, `caps`, `final`

En cada módulo (y en global) la UI muestra breakdown:

- `raw`: score antes de ajustes.
- `penalties`: descuentos por riesgos detectados.
- `capped`: límite máximo aplicado por hard rules.
- `final`: score final usado por el dashboard.

Ejemplos de hard rules:
- sin ruta de stable exit => cap en Liquidity & Exit
- sin redemption path => cap en Peg o Stress
- mala gobernanza/peg/exitability => cap global

Interpretación:
- si `raw` es alto pero `final` cae por cap, el problema es **estructural**, no cosmético.

---

## 7. Cómo detectar oportunidades de mejora

Usá este método en cada red:

1. Detectá el cuello de botella principal:
   - módulo más bajo
   - red flags de severidad alta
   - caps activos
2. Verificá si bloquea al LP en salida o utilidad:
   - salida a USDC (exitability)
   - uso de LST como colateral (moneyness)
3. Priorizá oportunidades del panel:
   - `Very High` y `High` primero
4. Convertí cada oportunidad en hipótesis de impacto:
   - "Si mejoramos X, sube Y módulo y baja Z riesgo"
5. Ordená plan de ejecución:
   - quick wins (transparencia, parámetros)
   - medium wins (integraciones lending/collateral)
   - structural wins (liquidez stable profunda, redención robusta)

Plantilla de diagnóstico:
- Bottleneck principal:
- Riesgo LP crítico:
- Oportunidad #1:
- Impacto esperado:
- Dificultad estimada:
- Señal de éxito:

---

## 8. Lectura de señales en menos de 1 minuto

Checklist rápido:

1. Health Score y banda.
2. Gap entre Health y Opportunity.
3. Módulo más débil y más fuerte.
4. ¿Hay cap global o caps de módulo?
5. Top 3 oportunidades.
6. Riesgo de estrés (haircut, queue, contagion).

Si no podés resumir en una frase "qué frena hoy a la red", todavía no terminaste el diagnóstico.

---

## 9. Qué datos son API y qué datos siguen mock

Estado actual del overview:

- Observado (API snapshot):
  - CoinGecko: market cap, FDV, circulating supply.
  - DefiLlama: DeFi TVL, LST TVL (stablecoin liquidity depende de disponibilidad de source).
- Derivado:
  - staked value, TVL/MCAP, LST penetration.
- Curado/mock:
  - parte importante de staking, gobernanza, narrativa, oportunidad y flags.

En detalle por red, gran parte del contenido estratégico sigue mock/curado para prototipo v1.

---

## 10. Comandos útiles de operación local

En la raíz del repo:

```bash
npm run data:sync:coingecko
npm run data:sync:defillama
npm run data:sync:all
npm run dev
```

Recomendación:
- refrescar snapshots antes de reuniones o análisis comparativos.

---

## 11. Errores comunes de interpretación

1. Confundir `Opportunity Score` con salud actual.
2. Sobrerreaccionar a APY sin validar salida a stables.
3. Ignorar caps activos en scoring.
4. Tomar integraciones simbólicas como adopción real.
5. No distinguir datos observados vs inferidos/simulados.

---

## 12. Resultado esperado del análisis

Un buen uso del dashboard debería terminar en una salida accionable:

- "Esta red no está rota, pero le falta X para volverse LP-friendly."
- "La mejora de mayor ROI es Y."
- "El riesgo que más bloquea capital hoy es Z."

Si podés llegar a esa conclusión en 5-10 minutos por red, el flujo está funcionando correctamente.
