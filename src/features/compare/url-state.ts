// URL state helpers for /compare?nets=sui,aptos,monad
//
// Pure (no React). Caller is responsible for navigation; this module only
// parses/serializes the comma-separated list.

export const MAX_COMPARE = 5

/** Parse the `nets` query string param. Tolerates unknown / duplicate IDs. */
export function parseNets(raw: string | null, validIds: Set<string>): string[] {
  if (!raw) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const piece of raw.split(",")) {
    const id = piece.trim().toLowerCase()
    if (!id) continue
    if (!validIds.has(id)) continue
    if (seen.has(id)) continue
    seen.add(id)
    out.push(id)
    if (out.length >= MAX_COMPARE) break
  }
  return out
}

/** Serialize a list of network IDs back into a comma-separated string. */
export function serializeNets(ids: string[]): string {
  return ids.join(",")
}
