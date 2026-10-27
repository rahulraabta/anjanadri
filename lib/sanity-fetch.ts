import { SANITY_REQUEST_TIMEOUT_MS } from './sanity';
import { fetchWithRetry } from './sanity-utils';

const REVALIDATE_SECONDS = 3600;
const STALE_SECONDS = 86400;
const MAX_CACHE_ENTRIES = 128;
const CONTENT_UNAVAILABLE_MESSAGE = 'Product information is temporarily unavailable. Please try again shortly.';

type QueryValue = string | number | boolean | null | QueryValue[] | { [key: string]: QueryValue };

interface SanityFetchOptions<Result> {
  cache?: 'force-cache' | 'no-store';
  useCdn?: boolean;
  parse: (data: unknown) => Result;
}

const cachedResults = new Map<string, { data: unknown; fetchedAt: number; retryAt: number }>();
const pendingRequests = new Map<string, Promise<unknown>>();

/**
 * Sorts object keys recursively so equivalent JSON query parameters share a cache entry.
 * Array order is preserved because it can affect GROQ results. Values must be acyclic JSON.
 */
function canonicalize(value: QueryValue): QueryValue {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonicalize(value[key])]));
  }
  return value;
}

/**
 * Executes a public Sanity query with validation, bounded caching, and a deadline.
 * @param query GROQ query text. Use one stable parser per query/result shape.
 * @param params JSON-compatible GROQ parameters; object key order does not affect caching.
 * @param options Required runtime parser and optional cache/CDN policy.
 * @returns Validated data, or a last-known-good result within the stale allowance.
 * @throws A friendly error when the request/validation fails without a usable fallback.
 * @remarks Public reads deduplicate in-flight work and back off failed refreshes for five
 * seconds. Cache state is process-local, bounded to 128 entries/128 in-flight public
 * queries, and not shared or durable. `no-store` bypasses both local caches and the CDN;
 * callers must separately bound authenticated traffic. Static exports fetch at build
 * time; Next.js revalidation options do not update an already deployed static site.
 */
export async function sanityFetch<Result>(
  query: string,
  params: Record<string, QueryValue>,
  options: SanityFetchOptions<Result>,
): Promise<Result> {
  const cache = options.cache ?? 'force-cache';
  const useCdn = cache === 'no-store' ? false : options.useCdn ?? true;
  const cacheKey = JSON.stringify([query, canonicalize(params), useCdn]);
  const cachedResult = cache === 'force-cache' ? cachedResults.get(cacheKey) : undefined;
  const now = Date.now();
  const maxAgeMs = (REVALIDATE_SECONDS + STALE_SECONDS) * 1000;
  const canServeStale = cachedResult !== undefined && now - cachedResult.fetchedAt < maxAgeMs;

  if (cachedResult && (
    now - cachedResult.fetchedAt < REVALIDATE_SECONDS * 1000 ||
    (canServeStale && now < cachedResult.retryAt)
  )) {
    return cachedResult.data as Result;
  }

  const pendingRequest = cache === 'force-cache' ? pendingRequests.get(cacheKey) : undefined;
  if (pendingRequest) {
    return pendingRequest as Promise<Result>;
  }

  if (cache === 'force-cache' && pendingRequests.size >= MAX_CACHE_ENTRIES) {
    if (canServeStale && cachedResult) return cachedResult.data as Result;
    throw new Error(CONTENT_UNAVAILABLE_MESSAGE);
  }

  const request = (async () => {
    try {
      const response = await fetchWithRetry<unknown>(query, params, {
        cache,
        useCdn,
        ...(cache === 'force-cache' ? { next: { revalidate: REVALIDATE_SECONDS } } : {}),
      });
      const data = options.parse(response);

      if (cache === 'force-cache') {
        cachedResults.delete(cacheKey);
        if (cachedResults.size >= MAX_CACHE_ENTRIES) {
          const oldestKey = cachedResults.keys().next().value;
          if (oldestKey !== undefined) cachedResults.delete(oldestKey);
        }
        cachedResults.set(cacheKey, { data, fetchedAt: Date.now(), retryAt: 0 });
      }

      return data;
    } catch (error) {
      console.warn('Sanity content request failed; checking for a cached fallback.');
      if (
        cachedResult &&
        Date.now() - cachedResult.fetchedAt < maxAgeMs
      ) {
        cachedResult.retryAt = Date.now() + SANITY_REQUEST_TIMEOUT_MS;
        return cachedResult.data as Result;
      }

      throw new Error(CONTENT_UNAVAILABLE_MESSAGE, {
        cause: error,
      });
    }
  })();

  if (cache === 'force-cache') pendingRequests.set(cacheKey, request);
  try {
    return await request;
  } finally {
    if (cache === 'force-cache') pendingRequests.delete(cacheKey);
  }
}
