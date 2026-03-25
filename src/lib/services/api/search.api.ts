import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * Search endpoints
 * ======================= */

export function search(
	input: EndpointInput<'search.searchAnything'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('search.searchAnything', input, fetchFn, signal);
}
