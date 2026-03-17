# Data Sources Catalog

Master reference of all data sources used or evaluated for the Liquid Staking Health Terminal.
**Update this file whenever a new source is discovered during research.**

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Automated | Pulled by a sync script — no manual work needed |
| 🔶 Manual | Must be read and copied by hand |
| 🔬 Research-only | Used to verify/cross-check; not stored in JSON |
| ❌ Unavailable | Paid API or access-restricted |

---

## Tier 1 — Automated (sync scripts)

### CoinGecko
- **URL:** `https://www.coingecko.com/en/coins/{coin-id}`
- **API endpoint:** `https://api.coingecko.com/api/v3/coins/{coin-id}`
- **Script:** `scripts/sync-coingecko-basics.mjs`
- **Fields supplied:**
  - `priceUsd`, `marketCapUsd`, `fdvUsd`
  - `volume24hUsd`, `circulatingSupply`, `circulatingSupplyPct`
- **Notes:** Free tier rate-limited to ~30 req/min. `coin-id` varies from token symbol; always verify on the CoinGecko site before registering a chain. Pre-launch chains may not have an ID yet.
- **Quality:** `observed`

---

### DefiLlama
- **URL:** `https://defillama.com/chain/{ChainName}`
- **API endpoint:** `https://api.llama.fi/v2/chains` → filter by `name`
- **Script:** `scripts/sync-defillama-basics.mjs`
- **Fields supplied:**
  - `defiTvlUsd`
  - `tvlToMcapPct` (derived)
- **Notes:** Chain name is case-sensitive in the API (e.g. `"Berachain"`, not `"berachain"`). Pre-launch chains return 0 TVL.
- **Quality:** `observed`

---

### DexScreener
- **URL:** `https://dexscreener.com/{chainId}/{pairAddress}`
- **API endpoint:** `https://api.dexscreener.com/latest/dex/tokens/{tokenAddress}`
- **Script:** used in `scripts/build-overview-dataset.ts` for stablecoin liquidity
- **Fields supplied:**
  - `stablecoinLiquidityUsd` (estimated from active pairs)
  - DEX pair depth for LST/base-token pools
- **Notes:** Non-EVM chains may have incomplete data. Use `dexscreenerChainId` slug (e.g. `vara`, `sei`). Always cross-check with chain-native DEX UIs.
- **Quality:** `observed`

---

## Tier 2 — Manual (copy-paste from UI)

### StakingRewards
- **URL:** `https://www.stakingrewards.com/asset/{network-slug}`
- **Fields supplied:**
  - `stakingApyPct` (reward rate)
  - `stakingRatioPct`, `stakedTokens`, `stakedValueUsd`
  - `inflationRatePct`
  - `validatorCount`, `benchmarkCommissionPct`
- **Workflow:** See `docs/datasources/stakingrewards.md` for step-by-step.
- **Storage:** `data/manual/stakingrewards.json`
- **Notes:** API is paid. Free UI shows all needed fields. Some niche chains (e.g. Vara) are not indexed — fall back to daic.capital or Subscan.
- **Quality:** `observed`

---

### daic.capital  ← *discovered during Vara integration (2026-03)*
- **URL:** `https://daic.capital/staking/{network-slug}-{token}`
  - Example: `https://daic.capital/staking/vara-network-vara`
- **Fields supplied:**
  - `stakingRatioPct` (staked % of circulating supply)
  - `stakingApyPct` (current reward rate)
  - `inflationRatePct` (estimated)
  - Real yield estimate (APY − inflation)
  - Validator/nominator count
- **When to use:** Primary fallback when StakingRewards does not index a chain. Especially useful for Substrate/Polkadot-ecosystem chains (Vara, Gear, etc.).
- **Notes:** Coverage is growing. URL pattern `/{network-name}-{token-lowercase}` is not always consistent — try variations if 404.
- **Quality:** `observed`

---

### Subscan
- **URL:** `https://{chain}.subscan.io` (chain-specific subdomain)
  - Vara: `https://vara.subscan.io`
  - Polkadot: `https://polkadot.subscan.io`
  - Kusama: `https://kusama.subscan.io`
  - Mantra: check `mantanetwork.subscan.io` or native explorer
- **Fields supplied:**
  - `validatorCount` (active + waiting)
  - `stakingRatioPct` (live on-chain)
  - `nominationPools` count
  - `benchmarkCommissionPct`
  - Unbonding period (`unbondingDays`)
  - Era/epoch timing
- **When to use:** Any Substrate (Polkadot SDK) chain. Authoritative on-chain data — use over StakingRewards when coverage gap exists.
- **Notes:** API available at `https://{chain}.api.subscan.io/` — free tier with rate limits. Data is real-time.
- **Quality:** `observed`

---

### Mintscan
- **URL:** `https://www.mintscan.io/{chain}`
  - SEI: `https://www.mintscan.io/sei`
  - Injective: `https://www.mintscan.io/injective`
  - Mantra: `https://www.mintscan.io/mantra`
- **Fields supplied:**
  - `validatorCount`
  - `stakingRatioPct`, `stakingApyPct`
  - `unbondingDays`
  - Top validator list for Nakamoto coefficient estimates
- **When to use:** Cosmos SDK chains (SEI, Injective, Mantra, Kava, etc.).
- **Notes:** Also accessible via Cosmos REST API on each chain's RPC node.
- **Quality:** `observed`

---

### Etherscan / Block Explorers (EVM)
- **URLs:**
  - Ethereum: `https://etherscan.io`
  - Berachain: `https://berascan.com`
  - Sonic: check `https://sonicscan.org`
  - Core: `https://scan.coredao.org`
  - Shardeum: `https://explorer.shardeum.org`
- **Fields supplied:**
  - Token holder counts (approximation for `stakerAddresses`)
  - Contract verification (LST audit trail)
  - TVL cross-check via contract balances
- **Notes:** `etherscanChainId` in the chain registry maps each network to its numeric EVM chain ID. Non-EVM chains → `null`.
- **Quality:** `observed`

---

## Tier 3 — Research / Cross-check Only

### Chain-native DEX UIs
| Chain | DEX | URL |
|-------|-----|-----|
| Vara | Invariant | `https://invariant.app/swap` |
| Vara | Rivr | `https://rivr.exchange` |
| Berachain | BEX | `https://hub.berachain.com` |
| SEI | Jellyfish DEX | `https://app.jellyfish.network` |
| SEI | Nitro | `https://app.nitro.trade` |

**Use for:** DEX liquidity depth estimates, LST pool TVL, stablecoin routing confirmation.

---

### Official Docs / Tokenomics Wikis
| Chain | URL | Key data |
|-------|-----|---------|
| Vara | `https://wiki.vara.network/docs/tokenomics` | Inflation schedule, treasury, IOP |
| Vara | `https://vara.network/ecosystem` | Ecosystem app list |
| Gear Protocol | `https://gear.rs` | Runtime/execution layer audits |
| Berachain | `https://docs.berachain.com` | PoL mechanics, BGT, validator whitelist |
| SEI | `https://docs.sei.io` | Validator setup, unbonding period |
| Monad | `https://docs.monad.xyz` | Parallel EVM specs, validator roadmap |

---

### LST Protocol Trackers
| Source | URL | Use |
|--------|-----|-----|
| Liquid Staking Landscape (Nansen) | `https://pro.nansen.ai` | LST TVL rankings (paid) |
| LSTFi.xyz | `https://lstfi.xyz` | Cross-chain LST discovery |
| DeFiLlama LST category | `https://defillama.com/lsd` | LST TVL by protocol |

---

### Validator / Decentralization Tools
| Source | URL | Use |
|--------|-----|-----|
| Rated Network | `https://www.rated.network` | Validator performance (Ethereum focus) |
| Observatory (Chorus One) | `https://observatory.zone` | Cosmos validator analytics |
| Polkadot Staking Dashboard | `https://staking.polkadot.network` | Substrate NPoS stake distribution |

---

## Source Priority Matrix

When multiple sources provide the same field, use this priority order:

| Field | Priority |
|-------|---------|
| `priceUsd`, `marketCapUsd`, `fdvUsd` | CoinGecko → manual fallback |
| `defiTvlUsd` | DefiLlama → DexScreener (sum of pools) |
| `stablecoinLiquidityUsd` | DexScreener → chain DEX UI |
| `stakingApyPct` | StakingRewards → daic.capital → chain docs |
| `stakingRatioPct` | StakingRewards → daic.capital → Subscan/Mintscan |
| `inflationRatePct` | StakingRewards → daic.capital → tokenomics wiki |
| `validatorCount` | Subscan/Mintscan → StakingRewards |
| `benchmarkCommissionPct` | Subscan/Mintscan → StakingRewards |
| `unbondingDays` | Chain docs → Subscan/Mintscan → StakingRewards |
| `lstTvlUsd`, `lstPenetrationPct` | DefiLlama LSD → DexScreener pool → protocol UI |

---

## Adding a New Source

When you discover a useful source during research, add it here with:

1. **URL pattern** (including any variable parts like `{chain}`)
2. **Fields supplied** — map to the exact field names in `RadarOverviewRecord`
3. **When to use** — which chains/situations it covers
4. **Quality tag** — `observed` / `derived` / `inferred`
5. **Discovery context** — which network integration surfaced it

```
### Source Name  ← discovered during {Network} integration ({YYYY-MM})
- URL: ...
- Fields supplied: ...
- When to use: ...
- Quality: ...
```
