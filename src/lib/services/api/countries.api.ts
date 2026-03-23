import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * User endpoints
 * ======================= */

export function getCountries(
	input: EndpointInput<'country.getAllCountries'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('country.getAllCountries', input, fetchFn, signal);
}

export function getRegions(
	input: EndpointInput<'region.getRegionsObject'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('region.getRegionsObject', input, fetchFn, signal);
}

export function getCountry(
	input: EndpointInput<'country.getCountryById'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('country.getCountryById', input, fetchFn, signal);
}

export function getRegion(
	input: EndpointInput<'region.getById'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('region.getById', input, fetchFn, signal);
}
