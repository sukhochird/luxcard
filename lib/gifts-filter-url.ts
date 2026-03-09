/**
 * List filter URL format: single param with comma-separated values.
 * e.g. /gifts?category=Restaurant,Coffee+Shop&occasion=Birthday,Wedding
 */

export function parseCommaParam(
  searchParams: URLSearchParams,
  key: string
): string[] {
  const raw = searchParams.get(key);
  if (!raw || !raw.trim()) return [];
  return raw
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean);
}

export function setCommaParam(
  params: URLSearchParams,
  key: string,
  values: string[]
): void {
  params.delete(key);
  if (values.length > 0) {
    params.set(key, values.map((v) => encodeURIComponent(v)).join(","));
  }
}
