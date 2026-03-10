# Etherscan Integration Spec (v1)

## Purpose

This document defines how Etherscan API v2 should be integrated into the dashboard data pipeline.

Etherscan is being added as the **token and contract intelligence layer** for EVM-compatible chains.

It should complement, not replace, the current sources:

- CoinGecko
- DefiLlama
- Dexscreener
- staking adapters / manual fallbacks

Etherscan API v2 supports 60+ chains under one API key using the `chainid` parameter, which makes it a strong multichain source for many EVM networks relevant to this dashboard.

---

# Why Etherscan Matters

CoinGecko is strong for:
- market cap
- circulating supply
- token price

DefiLlama is strong for:
- DeFi TVL
- stablecoin ecosystem totals
- protocol-level TVL

Dexscreener is strong for:
- pool-level liquidity
- stable exit routes
- DEX market structure

Etherscan is being integrated to provide:
- token supply and token-holder intelligence
- top holder concentration
- token transfer activity
- contract ABI / contract verification visibility
- protocol event logs
- operational balances and wallet monitoring
- gas / execution-cost context

---

# API Endpoints to Use

Use official Etherscan API v2 endpoints only.

## 1. ERC-20 total supply

Use to retrieve current token supply.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=stats&action=tokensupply&contractaddress={tokenAddress}&apikey={apiKey}`

---

## 2. Token holder count

Use to retrieve number of ERC-20 holders.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholdercount&contractaddress={tokenAddress}&apikey={apiKey}`

Note:
This is a PRO endpoint.

---

## 3. Top token holders

Use to retrieve concentration of holdings.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=token&action=topholders&contractaddress={tokenAddress}&offset=100&apikey={apiKey}`

Note:
This is useful for concentration analysis and stress diagnostics.

---

## 4. ERC-20 token transfers by address

Use to retrieve token transfers for an address, optionally filtered by contract.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=account&action=tokentx&address={address}&contractaddress={tokenAddress}&apikey={apiKey}`

---

## 5. Event logs by address

Use to retrieve protocol event logs for configured contracts.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=logs&action=getLogs&address={contractAddress}&fromBlock={fromBlock}&toBlock={toBlock}&apikey={apiKey}`

This is the primary mechanism for protocol-specific analytics such as:
- mint events
- redeem events
- deposit / withdraw events

---

## 6. Contract ABI

Use to retrieve ABI for verified contracts.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=contract&action=getabi&address={contractAddress}&apikey={apiKey}`

This can be used to determine whether a contract is verified and to support protocol-specific event parsing.

---

## 7. Native balance

Use to retrieve native token balance of important addresses.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address={address}&tag=latest&apikey={apiKey}`

Useful for:
- treasury monitoring
- protocol operational wallets
- validator-related operational balances when relevant

---

## 8. Gas oracle

Use to retrieve gas price recommendations and current fee context.

Example:
`https://api.etherscan.io/v2/api?chainid=1&module=gastracker&action=gasoracle&apikey={apiKey}`

Useful as a supporting execution-cost signal.

---

# Integration Goals

The Etherscan integration should support the following use cases:

1. Measure LST holder count and holder concentration
2. Measure LST transfer activity and token activity proxies
3. Detect whether key protocol contracts are verified
4. Enable protocol-specific mint/redeem analytics through logs
5. Track balances of configured treasury / protocol addresses
6. Provide supporting metadata for:
   - DeFi Moneyness
   - Stress Resilience
   - Security & Governance

---

# Data Categories to Extract

## A. LST token intelligence

For configured LST tokens, collect:

- total supply
- holder count
- top holders
- top-10 holder concentration
- recent transfer activity

Suggested normalized fields:

- `lstTotalSupply`
- `lstHolderCount`
- `lstTop10HolderShare`
- `lstTransferCount24h`
- `lstTransferVolume24h`

Notes:
- `lstTop10HolderShare` is derived from the Top Holders endpoint
- transfer volume can be approximated using transfer history if practical
- if exact 24h filtering is too expensive in v1, start with transfer count only

---

## B. Protocol contract intelligence

For configured protocol contracts, collect:

- ABI available / not available
- contract verified flag
- contract creator if later added
- event logs for configured activity signatures

Suggested normalized fields:

- `contractAbiAvailable`
- `contractVerified`
- `protocolMintCount24h`
- `protocolRedeemCount24h`
- `protocolMintVolume24h`
- `protocolRedeemVolume24h`

Important:
Do not attempt blind event discovery in v1.
Only parse events for configured contracts and configured event signatures.

---

## C. Treasury / operational wallet monitoring

For configured addresses, collect:

- native token balance
- optionally ERC-20 balance if later needed
- transfer activity if helpful

Suggested normalized fields:

- `protocolTreasuryNativeBalance`
- `protocolTreasuryLstBalance` (optional later)
- `protocolTreasuryStableBalance` (optional later)

This is secondary in v1 and should remain config-driven.

---

## D. Chain execution context

For each chain where relevant, collect:

- safe gas price
- propose gas price
- fast gas price
- suggested base fee

Suggested normalized fields:

- `safeGasPrice`
- `proposeGasPrice`
- `fastGasPrice`
- `suggestedBaseFee`

This should be treated as supporting metadata, not a core score driver in v1.

---

# Scope for v1

The v1 Etherscan integration should focus only on:

1. LST total supply
2. LST holder count
3. top holder concentration
4. transfer activity
5. contract ABI / verification availability
6. optional event logs for configured mint/redeem contracts if configuration exists

Do NOT attempt in v1 to build a full generic onchain analytics engine.

Keep the implementation deterministic and config-driven.

---

# Architecture Requirements

## Adapter

Create a dedicated adapter:

`/src/data/adapters/etherscan.ts`

Suggested functions:

- `getTokenSupply(chainId, tokenAddress)`
- `getTokenHolderCount(chainId, tokenAddress)`
- `getTopTokenHolders(chainId, tokenAddress, limit)`
- `getTokenTransfersByAddress(chainId, address, tokenAddress, options)`
- `getContractAbi(chainId, contractAddress)`
- `getLogs(chainId, contractAddress, fromBlock, toBlock, topics)`
- `getNativeBalance(chainId, address)`
- `getGasOracle(chainId)`

---

## Configuration files

Create deterministic configuration for:

### Etherscan-supported chains mapping
`/src/data/mappings/etherscanChains.ts`

### LST token addresses
`/src/data/config/lstTokens.ts`

### Protocol contracts and event signatures
`/src/data/config/protocolContracts.ts`

### Treasury / important addresses
`/src/data/config/importantAddresses.ts`

Do NOT attempt to guess contract addresses or event signatures at runtime.

---

# Dataset Integration

Extend the generated dataset so Etherscan-derived metrics can be included in:

`/data/networks.generated.json`

Suggested fields to add where possible:

- `lstTotalSupply`
- `lstHolderCount`
- `lstTop10HolderShare`
- `lstTransferCount24h`
- `lstTransferVolume24h`
- `contractAbiAvailable`
- `contractVerified`
- `protocolMintCount24h`
- `protocolRedeemCount24h`
- `protocolMintVolume24h`
- `protocolRedeemVolume24h`
- `protocolTreasuryNativeBalance`
- `safeGasPrice`
- `proposeGasPrice`
- `fastGasPrice`
- `suggestedBaseFee`

---

# Metadata Rules

For each Etherscan-derived field, preserve:

- `asOf`
- `sourceRefs`
- `quality`
- `confidence`

Classification guidance:

- directly fetched values → `observed`
- values computed from fetched results → `derived`
- missing unavailable values → `null`
- do not mark Etherscan values as simulated

For `sourceRefs`, include at minimum:
- endpoint name
- chain ID
- token / contract / address used

---

# Source of Truth Rules

Etherscan should be the primary source for:

- ERC-20 total supply
- token holder count
- top token holders
- transfer activity
- contract ABI / verification visibility
- event logs
- native balance
- gas oracle

CoinGecko should remain the primary source for:
- market cap
- token price
- circulating supply

DefiLlama should remain the primary source for:
- DeFi TVL
- ecosystem-level stablecoin totals
- protocol TVL

Dexscreener should remain the primary source for:
- DEX liquidity
- stable exit routes
- pool structure

---

# Normalization Rules

## Holder concentration

For an LST token:

`top10 holder share = sum(top 10 holder balances) / total supply`

Suggested normalized field:

- `lstTop10HolderShare`

Interpretation:
- high concentration = higher fragility / stress risk
- lower concentration = broader holder base

---

## Transfer activity

For configured addresses or token flows, use ERC-20 transfer history to derive:

- transfer count in the last 24h
- optional transfer volume approximation

Suggested normalized fields:

- `lstTransferCount24h`
- `lstTransferVolume24h`

Treat these as activity proxies, not perfect usage measures.

---

## Contract verification

If ABI retrieval succeeds:
- `contractAbiAvailable = true`
- `contractVerified = true`

If ABI retrieval fails:
- set fields to false or null depending on error type

Do not over-interpret this as a security guarantee.
It is only an operational transparency input.

---

# Relationship to Scoring

Etherscan metrics should be used as supporting inputs for:

## DeFi Moneyness
- holder count
- transfer activity
- supply distribution

## Stress Resilience
- holder concentration
- redeem / mint event activity if configured

## Security & Governance
- contract ABI availability
- verification visibility

Etherscan should not be used for:
- market cap
- DeFi TVL
- DEX liquidity depth
- stable exit routes

---

# Fallback Behavior

If Etherscan data is missing or unsupported:

- do not invent values
- return null
- preserve metadata
- let the UI display Missing / N/A

If an endpoint is PRO-only and unavailable, store null and mark confidence accordingly.

---

# Caching

Cache Etherscan responses for at least 10 minutes.

If logs are expensive or numerous, cache longer for development builds.

---

# v1 Deliverables

The v1 implementation should produce:

1. an Etherscan adapter
2. deterministic chain mapping
3. deterministic token / contract / address config
4. new Etherscan-derived fields inside the generated dataset
5. resilient UI behavior for missing values
6. no source guessing beyond configured mappings

---

# Constraints

- Use official Etherscan API v2 endpoints only
- Do not scrape explorer pages
- Do not infer protocol event signatures automatically
- Keep the implementation deterministic and modular
- Prefer token-address-based and contract-address-based queries
