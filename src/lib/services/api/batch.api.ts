import { trpcBatchFetch } from './client';
import type { EndpointPath, EndpointInput, BatchOutput } from '$lib/types/api/registry';

/* =======================
 * Batch helper
 * ======================= */

type BatchRequest<P extends EndpointPath> = {
	path: P;
	input: EndpointInput<P>;
};

/**
 * Execute multiple API requests in batch mode.
 * Pass a `const` array of requests to get back a fully typed tuple.
 *
 * @param requests Array of `{ path, input }` — use `as const` for typed tuple output
 * @param fetchFn  Custom fetch, use it with SvelteKit load functions (optional)
 * @returns Typed tuple ordered by request position
 *
 * @example
 * const [company, region] = await batchFetch([
 *   { path: 'company.getById', input: { companyId: '123' } },
 *   { path: 'region.getById',  input: { regionId: '456' } },
 * ] as const);
 * //  company ^? CompanyResponse
 * //  region  ^? RegionResponse
 */
export async function batchFetch<const Requests extends ReadonlyArray<BatchRequest<EndpointPath>>>(
	requests: Requests,
	fetchFn: typeof fetch = fetch
): Promise<BatchOutput<{ [K in keyof Requests]: Requests[K]['path'] }>> {
	return trpcBatchFetch(requests, fetchFn);
}
