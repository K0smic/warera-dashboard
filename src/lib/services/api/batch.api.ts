import { trpcBatchFetch, ApiError } from './client';
import type { EndpointPath, EndpointInput, BatchOutput } from '$lib/types/api/registry';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BatchRequest<P extends EndpointPath> = {
	path: P;
	input: EndpointInput<P>;
};

type BatchResult<Requests extends ReadonlyArray<BatchRequest<EndpointPath>>> = BatchOutput<{
	[K in keyof Requests]: Requests[K]['path'];
}>;

// ---------------------------------------------------------------------------
// In-flight dedup map
//
// Keyed by the full serialised request list so that two concurrent callers
// asking for the exact same batch share one promise instead of firing two
// identical HTTP requests. The entry is removed when the promise settles,
// so the next call after settlement will always go to the network.
// ---------------------------------------------------------------------------

const inFlight = new Map<string, Promise<unknown>>();

function buildKey<const Requests extends ReadonlyArray<BatchRequest<EndpointPath>>>(
	requests: Requests
): string {
	return requests.map((r) => `${r.path}:${JSON.stringify(r.input)}`).join('|');
}

// ---------------------------------------------------------------------------
// batchFetch
// ---------------------------------------------------------------------------

/**
 * Execute multiple API requests in a single tRPC batch call.
 *
 * Identical concurrent calls are deduplicated — they share one in-flight
 * promise. Pass `as const` to get a fully typed tuple back.
 *
 * Retry (×3, exponential backoff) and AbortSignal support are handled by
 * the underlying `trpcBatchFetch`.
 *
 * @example
 * const [company, region] = await batchFetch([
 *   { path: 'company.getById', input: { companyId: '123' } },
 *   { path: 'region.getById',  input: { regionId:  '456' } },
 * ] as const, fetch, controller.signal);
 */
export async function batchFetch<const Requests extends ReadonlyArray<BatchRequest<EndpointPath>>>(
	requests: Requests,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
): Promise<BatchResult<Requests>> {
	const key = buildKey(requests);

	if (!inFlight.has(key)) {
		const promise = trpcBatchFetch(requests, fetchFn, signal).finally(() => {
			inFlight.delete(key);
		});
		inFlight.set(key, promise);
	}

	return inFlight.get(key) as Promise<BatchResult<Requests>>;
}

// ---------------------------------------------------------------------------
// Re-export so load functions only need one import
// ---------------------------------------------------------------------------

export { ApiError };
