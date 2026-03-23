import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * User endpoints
 * ======================= */

export function getUserLite(
	input: EndpointInput<'user.getUserLite'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('user.getUserLite', input, fetchFn, signal);
}

//TODO: add responses['UsersByCountryResponse'] type, now is not used
export function getUsersByCountry(
	input: EndpointInput<'user.getUsersByCountry'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('user.getUsersByCountry', input, fetchFn, signal);
}
