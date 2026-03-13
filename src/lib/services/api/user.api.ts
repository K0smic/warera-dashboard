import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * User endpoints
 * ======================= */

export function getUserLite(
	input: EndpointInput<'user.getUserLite'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('user.getUserLite', input, fetchFn);
}

//TODO: add responses['UsersByCountryResponse'] type, now is not used
export function getUsersByCountry(
	input: EndpointInput<'user.getUsersByCountry'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('user.getUsersByCountry', input, fetchFn);
}
