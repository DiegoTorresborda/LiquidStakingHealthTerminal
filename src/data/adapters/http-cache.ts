import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const CACHE_DIR = new URL("../../../.cache/ingestion/", import.meta.url);
const TEN_MINUTES_MS = 10 * 60 * 1000;

function cachePathFor(url: string) {
  const key = createHash("sha1").update(url).digest("hex");
  return new URL(`${key}.json`, CACHE_DIR);
}

export async function fetchJsonWithCache<T>(url: string, init?: RequestInit): Promise<T> {
  await mkdir(CACHE_DIR, { recursive: true });
  const cachePath = cachePathFor(url);

  try {
    const raw = await readFile(cachePath, "utf8");
    const cached = JSON.parse(raw) as { cachedAt: number; data: T };

    if (Date.now() - cached.cachedAt <= TEN_MINUTES_MS) {
      return cached.data;
    }
  } catch {
    // cache miss
  }

  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${url}`);
  }

  const data = (await response.json()) as T;
  await writeFile(cachePath, JSON.stringify({ cachedAt: Date.now(), data }, null, 2));
  return data;
}
