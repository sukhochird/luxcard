import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";

export const MEILI_INDEX = "gifts";

function getConfig() {
  const host = process.env.NEXT_PUBLIC_MEILI_HOST;
  const key = process.env.NEXT_PUBLIC_MEILI_SEARCH_KEY;
  if (!host || !key) return null;
  return { host, key };
}

export function getSearchClient() {
  const config = getConfig();
  if (!config) return null;
  try {
    return instantMeiliSearch(config.host, config.key);
  } catch {
    return null;
  }
}

export function isSearchConfigured(): boolean {
  return getConfig() !== null;
}
