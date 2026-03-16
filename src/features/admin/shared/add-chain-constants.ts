export const CATEGORIES = [
  "High-performance EVM L1",
  "High-throughput trading L1",
  "Object-centric L1",
  "Move-based L1",
  "DeFi-native L1",
  "Enterprise-focused L1",
  "Dynamic sharded L1",
  "Bitcoin-aligned PoS",
  "Gaming-focused L1",
  "RWA-focused L1"
] as const;

export type ChainCategory = typeof CATEGORIES[number];
