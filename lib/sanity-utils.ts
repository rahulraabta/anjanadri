import type { FilteredResponseQueryOptions, QueryParams } from '@sanity/client';
import { client, SANITY_REQUEST_TIMEOUT_MS } from './sanity';

/** Recognizes transport failures, including errors wrapped by sanityFetch. */
export function isSanityNetworkError(error: unknown): boolean {
  for (let depth = 0; depth < 5 && error !== null && typeof error === 'object'; depth++) {
    if ('statusCode' in error && typeof error.statusCode === 'number') return false;
    if ('name' in error && (error.name === 'TimeoutError' || error.name === 'AbortError')) return true;
    if ('code' in error && typeof error.code === 'string' &&
      /^(ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|ENOTFOUND|EPIPE|UND_ERR_)/.test(error.code)) return true;
    if ('message' in error && typeof error.message === 'string' &&
      /network|fetch failed|failed to fetch|timeout|timed out|socket hang up/i.test(error.message)) return true;
    error = 'cause' in error ? error.cause : undefined;
  }
  return false;
}

/** Tries a query three times, with a fresh Edge-compatible deadline per attempt. */
export async function fetchWithRetry<Result>(
  query: string,
  params: QueryParams = {},
  options: Omit<FilteredResponseQueryOptions, 'signal'> = {},
): Promise<Result> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await client.fetch<Result>(query, params, {
        ...options,
        signal: AbortSignal.timeout(SANITY_REQUEST_TIMEOUT_MS),
      });
    } catch (error) {
      if (attempt >= 3 || !isSanityNetworkError(error)) throw error;
      await new Promise<void>(resolve => setTimeout(resolve, 1000));
    }
  }
}
