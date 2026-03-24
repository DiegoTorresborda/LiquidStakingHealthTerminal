/**
 * Registry of official native token deployments across chains, per network.
 *
 * Purpose:
 *   - Provides exact contract addresses for cross-chain DexScreener lookups,
 *     avoiding symbol-based false positives (e.g. searching "MON" returns
 *     unrelated tokens on Base, BSC, and Ethereum).
 *   - Enables cross-chain exit liquidity aggregation in the scoring pipeline.
 *
 * Usage:
 *   - `build-overview-dataset.ts` reads `crossChainDeployments` and fetches
 *     DEX pairs for each deployment, summing qualifying pairs (> $100K liquidity)
 *     into `crossChainExitLiquidityUsd`.
 *   - `discover-network-tokens.mjs` (future script) uses this registry as its
 *     starting point when onboarding new networks.
 *
 * How to add a new network:
 *   1. Find the official token list page (e.g. docs.chain.xyz/tokens-and-bridges)
 *   2. Confirm contract addresses on each supported chain
 *   3. Add an entry below with verified addresses only
 *   4. Run `build-overview-dataset.ts` — cross-chain data will populate automatically
 */

export type CrossChainDeployment = {
  /** DexScreener chain ID (e.g. "ethereum", "solana", "base") */
  chainId: string;
  /** Official token contract address on this chain */
  address: string;
  /** Bridge protocol used to deploy this token (e.g. "NTT 2/2", "LayerZero", "Wormhole") */
  bridge?: string;
  /** Bridge frontend URL for users to move tokens */
  bridgeUrl?: string;
  /** Additional notes about this deployment */
  notes?: string;
};

export type NetworkTokenConfig = {
  networkId: string;
  /** Ticker symbol of the native token */
  nativeTokenSymbol: string;
  /** DexScreener chain ID for the home chain */
  nativeChainId: string;
  /** Native wrapped token address used on DEXes (e.g. WMON on Monad mainnet) */
  nativeTokenAddress: string | null;
  /** Official cross-chain deployments of the native token */
  crossChainDeployments: CrossChainDeployment[];
  /** URL of the official token list / bridge documentation page */
  officialDocsUrl?: string;
  /** ISO date of last discovery run */
  lastDiscoveryAt?: string;
};

/**
 * Minimum per-pair liquidity threshold (USD) for cross-chain pairs to count
 * toward crossChainExitLiquidityUsd in the scoring pipeline.
 */
export const CROSS_CHAIN_MIN_LIQUIDITY_USD = 100_000;

/**
 * Counterparty token symbols accepted as valid exit tokens for cross-chain pairs.
 * Pairs against these tokens are eligible to contribute to crossChainExitLiquidityUsd.
 */
export const CROSS_CHAIN_EXIT_TOKENS = ["USDC", "USDT", "DAI", "WETH", "ETH", "SOL"] as const;

export const NETWORK_TOKEN_REGISTRY: Record<string, NetworkTokenConfig> = {
  monad: {
    networkId: "monad",
    nativeTokenSymbol: "MON",
    nativeChainId: "monad",
    nativeTokenAddress: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A", // WMON (Wrapped MON)
    officialDocsUrl:
      "https://docs.monad.xyz/developer-essentials/network-information/tokens-and-bridges",
    lastDiscoveryAt: "2026-03-23",
    crossChainDeployments: [
      {
        chainId: "ethereum",
        address: "0x6917037f8944201b2648198a89906edf863b9517",
        bridge: "NTT 2/2",
        bridgeUrl: "https://monadbridge.xyz"
      },
      {
        chainId: "solana",
        address: "CrAr4RRJMBVwRsZtT62pEhfA9H5utymC2mVx8e7FreP2",
        bridge: "Wormhole"
      }
    ]
  },
  sei: {

    networkId: "sei",
    nativeTokenSymbol: "SEI",
    nativeChainId: "seiv2",
    nativeTokenAddress: "0xE30feDd158A2e3b13e9badaeABaFc5516e95e8C7", // WSEI (Wrapped SEI)
    officialDocsUrl: "https://docs.sei.io/evm/bridging/layerzero",
    lastDiscoveryAt: "2026-03-24",
    crossChainDeployments: [
      {
        chainId: "ethereum",
        address: "0xbdF43ecAdC5ceF51B7D1772F722E40596BC1788B",
        bridge: "LayerZero OFT v2",
        bridgeUrl: "https://app.sei.io/bridge"
      }
    ]
  },
  sui: {

    networkId: "sui",
    nativeTokenSymbol: "SUI",
    nativeChainId: "sui",
    nativeTokenAddress: null, // SUI is used natively in DeFi — no WSUI equivalent
    officialDocsUrl: "https://docs.sui.io/concepts/tokenomics/sui-bridging",
    lastDiscoveryAt: "2026-03-24",
    crossChainDeployments: [
      {
        chainId: "base",
        address: "0xb0505e5a99abd03d94a1169e638B78EDfEd26ea4",
        bridge: "Universal Protocol (uSUI)",
        bridgeUrl: "https://bridge.sui.io",
        notes: "Third-party wrapped SUI, custodied by Coinbase Prime. CoinGecko-listed. No official Sui Foundation ERC-20 exists."
      }
    ]
  },
  aptos: {
    networkId: "aptos",
    nativeTokenSymbol: "APT",
    nativeChainId: "aptos",
    nativeTokenAddress: null, // APT is natively usable in DeFi — no wrapping needed (0x1::aptos_coin::AptosCoin)
    officialDocsUrl: "https://aptos.dev/build/guides/exchanges",
    lastDiscoveryAt: "2026-03-24",
    crossChainDeployments: [
      {
        chainId: "base",
        address: "0x9c0e042d65a2e1ff31ac83f404e5cb79f452c337",
        bridge: "Universal Protocol (uAPT)",
        bridgeUrl: "https://theaptosbridge.com",
        notes: "Third-party wrapped APT, custodied by Coinbase Prime. CoinGecko-listed but ~$21K liquidity — below $100K scoring threshold."
      }
    ]
  }
  // Future entries: zigchain, berachain, etc. as cross-chain bridges launch
};
